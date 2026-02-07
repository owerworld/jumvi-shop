import { login, refresh, logout, me, forgotPassword, resetPassword } from "./auth/api/auth.js";
import { setup2fa, verify2fa } from "./auth/api/2fa.js";
import { requireAccess, parseCookies, clientIp } from "./auth/api/middleware.js";
import { verifyJwt } from "./auth/utils/token.js";
import { dbRun } from "./auth/utils/db.js";

const PAGES_ORIGIN = "https://jumvi-panel.pages.dev";
const INDEX_KEY = "_index.json";
const STATE_KEY = "_state.json";
const ALLOWED_MIME = ["application/pdf", "image/png", "image/jpeg", "video/mp4", "video/quicktime"];
const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
const MAX_VIDEO_SIZE = 200 * 1024 * 1024;
const FILE_TOKEN_TTL = 5 * 60 * 1000;
const ENCRYPTION_MAX_BYTES = 25 * 1024 * 1024;
const GOLD_OUNCE_GRAMS = 31.1035;
const QUARTER_GOLD_GRAMS = 1.75;
const QUARTER_GOLD_PURITY = 22 / 24;
const SCRIPT_SRI_TARGETS = [
  "https://cdn.jsdelivr.net/npm/axios@1.6.8/dist/axios.min.js",
  "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
  "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"
];
const CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://cdn.jsdelivr.net",
  "style-src 'self'",
  "img-src 'self' data: blob: https://api.qrserver.com",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
  "report-uri /api/csp-report",
  "report-to csp-endpoint"
].join("; ");
const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=86400; includeSubDomains",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy": CSP_POLICY,
  "Report-To": JSON.stringify({
    group: "csp-endpoint",
    max_age: 86400,
    endpoints: [{ url: "https://say23.jumvi.co/api/csp-report" }]
  })
};

let auditReady = false;
let encKeyPromise = null;
const sriCache = new Map();

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getSriHash(url) {
  if (sriCache.has(url)) return sriCache.get(url);
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const hash = await crypto.subtle.digest("SHA-384", buffer);
    const b64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
    const integrity = `sha384-${b64}`;
    sriCache.set(url, integrity);
    return integrity;
  } catch {
    return null;
  }
}

async function injectSri(html) {
  let output = html;
  for (const src of SCRIPT_SRI_TARGETS) {
    const integrity = await getSriHash(src);
    if (!integrity) continue;
    const escaped = escapeRegExp(src);
    const tagRegex = new RegExp(`<script\\b([^>]*?)src=["']${escaped}["']([^>]*)>`, "gi");
    output = output.replace(tagRegex, (match) => {
      if (/\bintegrity=/.test(match)) return match;
      let extra = ` integrity="${integrity}"`;
      if (!/\bcrossorigin=/.test(match)) {
        extra += ` crossorigin="anonymous"`;
      }
      return match.replace(/>$/, `${extra}>`);
    });
  }
  return output;
}

async function applySecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  const contentType = headers.get("Content-Type") || "";
  if (contentType.includes("text/html")) {
    const html = await response.text();
    const withSri = await injectSri(html);
    return new Response(withSri, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

async function readIndex(env) {
  const obj = await env.PANEL_FILES.get(INDEX_KEY);
  if (!obj) return [];
  try {
    const text = await obj.text();
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeIndex(env, items) {
  const body = JSON.stringify(items);
  await env.PANEL_FILES.put(INDEX_KEY, body, {
    httpMetadata: { contentType: "application/json" }
  });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "private, max-age=0, no-store",
      "Vary": "Cookie",
      ...SECURITY_HEADERS
    }
  });
}

function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function mimeFromName(name = "") {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".mov")) return "video/quicktime";
  return "";
}

function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(str) {
  const pad = str.padEnd(str.length + (4 - (str.length % 4 || 4)), "=");
  const normalized = pad.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function signPayload(payload, env) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const data = enc.encode(payload);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, data));
  return base64UrlEncode(sig);
}

async function verifySignature(payload, signature, env) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(env.SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBytes = base64UrlDecode(signature);
  return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
}

async function createFileToken(payload, env) {
  const body = JSON.stringify(payload);
  const encoded = base64UrlEncode(new TextEncoder().encode(body));
  const signature = await signPayload(encoded, env);
  return `${encoded}.${signature}`;
}

async function verifyFileToken(token, env) {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  const ok = await verifySignature(encoded, signature, env);
  if (!ok) return null;
  const decoded = new TextDecoder().decode(base64UrlDecode(encoded));
  const payload = JSON.parse(decoded);
  if (!payload?.exp || Date.now() > payload.exp) return null;
  return payload;
}

async function ensureAuditTable(env) {
  if (auditReady) return;
  await dbRun(
    env,
    `CREATE TABLE IF NOT EXISTS file_access_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      file_key TEXT,
      action TEXT,
      ip_address TEXT,
      user_agent TEXT,
      via_token INTEGER,
      created_at TEXT
    )`
  );
  auditReady = true;
}

async function logFileAccess(env, info) {
  try {
    await ensureAuditTable(env);
    await dbRun(
      env,
      "INSERT INTO file_access_logs (id, user_id, file_key, action, ip_address, user_agent, via_token, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        crypto.randomUUID(),
        info.userId || null,
        info.key,
        info.action,
        info.ip || "",
        info.ua || "",
        info.viaToken ? 1 : 0,
        new Date().toISOString(),
      ]
    );
  } catch {}
}

function parseAllowlist(env) {
  const raw = env.ALLOW_IPS || "";
  return raw.split(",").map((v) => v.trim()).filter(Boolean);
}

function pinRequired(env) {
  return !!env.FILE_PIN;
}

function verifyPin(request, env) {
  if (!pinRequired(env)) return true;
  const headerPin = request.headers.get("X-File-Pin");
  const url = new URL(request.url);
  const queryPin = url.searchParams.get("pin");
  const pin = headerPin || queryPin || "";
  return pin && pin === env.FILE_PIN;
}

async function getEncryptionKey(env) {
  if (!env.FILE_ENC_KEY) return null;
  if (!encKeyPromise) {
    encKeyPromise = (async () => {
      const raw = Uint8Array.from(atob(env.FILE_ENC_KEY), (c) => c.charCodeAt(0));
      return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
    })();
  }
  return encKeyPromise;
}

async function encryptBuffer(buffer, env) {
  const key = await getEncryptionKey(env);
  if (!key) return { buffer, iv: null, encrypted: false };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, buffer);
  return { buffer: encrypted, iv, encrypted: true };
}

async function decryptBuffer(buffer, iv, env) {
  const key = await getEncryptionKey(env);
  if (!key) return buffer;
  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, buffer);
}

async function safe(handler, label) {
  try {
    return await handler();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: `auth_${label}_error`, message }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttp = url.protocol === "http:" || forwardedProto === "http";
    if (isHttp) {
      const httpsUrl = `https://${url.host}${url.pathname}${url.search}`;
      return applySecurityHeaders(Response.redirect(httpsUrl, 301));
    }

    if (url.pathname === "/api/csp-report" && request.method === "POST") {
      try {
        const payload = await request.text();
        console.warn("csp-report", payload);
      } catch {}
      return applySecurityHeaders(new Response(null, { status: 204 }));
    }

    // Auth pages
    if (url.pathname === "/auth" || url.pathname === "/auth/") {
      return applySecurityHeaders(Response.redirect(`${url.origin}/auth/login`, 302));
    }
    if (url.pathname.startsWith("/auth")) {
      const pageMap = {
        "/auth/login": "/auth/pages/login",
        "/auth/setup-2fa": "/auth/pages/setup-2fa",
        "/auth/forgot-password": "/auth/pages/forgot-password"
      };
      const target = pageMap[url.pathname] || url.pathname;
      const pageRes = await fetch(new Request(PAGES_ORIGIN + target, request));
      return applySecurityHeaders(pageRes);
    }

    // Auth APIs
    if (url.pathname.startsWith("/api/auth")) {
      if (url.pathname === "/api/auth/login" && request.method === "POST")
        return safe(() => login(request, env), "login");
      if (url.pathname === "/api/auth/verify-2fa" && request.method === "POST")
        return safe(() => verify2fa(request, env), "verify2fa");
      if (url.pathname === "/api/auth/setup-2fa" && request.method === "POST")
        return safe(() => setup2fa(request, env), "setup2fa");
      if (url.pathname === "/api/auth/refresh" && request.method === "POST")
        return safe(() => refresh(request, env), "refresh");
      if (url.pathname === "/api/auth/logout" && request.method === "POST")
        return safe(() => logout(request, env), "logout");
      if (url.pathname === "/api/auth/me" && request.method === "GET")
        return safe(() => me(request, env), "me");
      if (url.pathname === "/api/auth/forgot-password" && request.method === "POST")
        return safe(() => forgotPassword(request, env), "forgot");
      if (url.pathname === "/api/auth/reset-password" && request.method === "POST")
        return safe(() => resetPassword(request, env), "reset");
      return jsonResponse({ error: "Not found" }, 404);
    }

    const needsAuth = url.pathname.startsWith("/panel");
    if (needsAuth) {
      const payload = await requireAccess(request, env);
      if (!payload) {
        if (url.pathname.startsWith("/panel/api")) return jsonResponse({ error: "Unauthorized" }, 401);
        return applySecurityHeaders(Response.redirect(`${url.origin}/auth/login`, 302));
      }
    }

    if (!url.pathname.startsWith("/panel")) {
      const passthrough = await fetch(request);
      return applySecurityHeaders(passthrough);
    }

    if (url.pathname.startsWith("/panel/api")) {

      if (url.pathname === "/panel/api/upload" && request.method === "POST") {
        const form = await request.formData();
        const file = form.get("file");
        if (!file || typeof file === "string") {
          return jsonResponse({ error: "Missing file" }, 400);
        }

        const category = (form.get("category") || "").toString().trim();
        const relatedId = (form.get("relatedId") || "").toString();
        const safeName = sanitizeName(file.name || "file.pdf");
        const key = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}`;

        const contentType = file.type || mimeFromName(file.name) || "application/pdf";
        if (!ALLOWED_MIME.includes(contentType)) {
          return jsonResponse({ error: "Invalid file type" }, 400);
        }
        const maxSize = contentType.startsWith("video/") ? MAX_VIDEO_SIZE : MAX_UPLOAD_SIZE;
        if (file.size > maxSize) {
          return jsonResponse({ error: "File too large" }, 400);
        }
        const storedAt = new Date().toISOString();
        let bodyToStore = file.stream();
        let meta = {
          name: file.name || safeName,
          category,
          relatedId,
          date: storedAt,
          enc: "0",
          origType: contentType
        };

        if (!contentType.startsWith("video/") && file.size <= ENCRYPTION_MAX_BYTES) {
          const buffer = await file.arrayBuffer();
          const { buffer: encrypted, iv, encrypted: ok } = await encryptBuffer(buffer, env);
          if (ok) {
            bodyToStore = encrypted;
            meta = {
              ...meta,
              enc: "1",
              iv: base64UrlEncode(new Uint8Array(iv)),
            };
          }
        }

        await env.PANEL_FILES.put(key, bodyToStore, {
          httpMetadata: { contentType },
          customMetadata: meta
        });

        const index = await readIndex(env);
        index.push({
          key,
          name: file.name || safeName,
          type: contentType,
          size: file.size || 0,
          category,
          relatedId,
          date: storedAt
        });
        await writeIndex(env, index);

        return jsonResponse({ key });
      }

      if (url.pathname === "/panel/api/list" && request.method === "GET") {
        const index = await readIndex(env);
        return jsonResponse(index);
      }

      if (url.pathname === "/panel/api/fx" && request.method === "GET") {
        const date = url.searchParams.get("date");
        if (!date) return jsonResponse({ error: "Missing date" }, 400);
        const fxRes = await fetch(`https://api.frankfurter.app/${encodeURIComponent(date)}?from=TRY&to=USD`);
        if (!fxRes.ok) return jsonResponse({ error: "FX failed" }, 502);
        const data = await fxRes.json();
        const rate = Number(data?.rates?.USD);
        if (!Number.isFinite(rate) || rate <= 0) return jsonResponse({ error: "FX invalid" }, 502);
        return jsonResponse({ rate, date });
      }

      if (url.pathname === "/panel/api/gold" && request.method === "GET") {
        const tryKapalicarsi = async () => {
          const goldRes = await fetch("https://kapalicarsi.apiluna.org/", {
            headers: { "User-Agent": "jumvi-panel/1.0" }
          });
          if (!goldRes.ok) return null;
          const list = await goldRes.json().catch(() => null);
          if (!Array.isArray(list)) return null;
          const item = list.find((row) => row?.code === "CEYREK_YENI") || list.find((row) => row?.code === "CEYREK_ESKI");
          if (!item) return null;
          const quarterTry = Number(String(item.satis || item.alis || "0").replace(",", "."));
          if (!Number.isFinite(quarterTry) || quarterTry <= 0) return null;
          return { quarterTry };
        };

        const cap = await tryKapalicarsi();
        if (cap?.quarterTry) {
          const fxRes = await fetch("https://api.frankfurter.app/latest?from=TRY&to=USD");
          if (!fxRes.ok) return jsonResponse({ error: "fx_failed" }, 502);
          const fxData = await fxRes.json().catch(() => null);
          const rate = Number(fxData?.rates?.USD);
          if (!Number.isFinite(rate) || rate <= 0) return jsonResponse({ error: "fx_failed" }, 502);
          const quarterUsd = cap.quarterTry * rate;
          return jsonResponse({
            quarterTry: Number(cap.quarterTry.toFixed(2)),
            quarterUsd: Number(quarterUsd.toFixed(2)),
            fxRate: rate,
            updatedAt: new Date().toISOString(),
            source: "kapalicarsi"
          });
        }

        const key = env.METALS_DEV_KEY;
        if (!key) return jsonResponse({ error: "gold_failed" }, 502);
        const metalRes = await fetch(
          `https://api.metals.dev/v1/latest?api_key=${encodeURIComponent(key)}&currency=USD&unit=toz`
        );
        if (!metalRes.ok) return jsonResponse({ error: "gold_failed" }, 502);
        const metalData = await metalRes.json().catch(() => null);
        if (metalData?.status !== "success") return jsonResponse({ error: "gold_invalid" }, 502);
        const ounceUsd = Number(metalData?.metals?.gold);
        if (!Number.isFinite(ounceUsd) || ounceUsd <= 0) return jsonResponse({ error: "gold_invalid" }, 502);
        const quarterUsd = (ounceUsd / GOLD_OUNCE_GRAMS) * QUARTER_GOLD_GRAMS * QUARTER_GOLD_PURITY;
        const usdTryRes = await fetch("https://api.frankfurter.app/latest?from=USD&to=TRY");
        if (!usdTryRes.ok) return jsonResponse({ error: "fx_failed" }, 502);
        const usdTryData = await usdTryRes.json().catch(() => null);
        const usdTry = Number(usdTryData?.rates?.TRY);
        if (!Number.isFinite(usdTry) || usdTry <= 0) return jsonResponse({ error: "fx_failed" }, 502);
        const quarterTry = quarterUsd * usdTry;
        return jsonResponse({
          quarterTry: Number(quarterTry.toFixed(2)),
          quarterUsd: Number(quarterUsd.toFixed(2)),
          fxRate: usdTry,
          updatedAt: new Date().toISOString(),
          source: "spot"
        });
      }

      if (url.pathname === "/panel/api/state" && request.method === "GET") {
        const obj = await env.PANEL_FILES.get(STATE_KEY);
        if (!obj) return jsonResponse({ state: null });
        try {
          const text = await obj.text();
          const data = JSON.parse(text);
          return jsonResponse({ state: data });
        } catch {
          return jsonResponse({ state: null });
        }
      }

      if (url.pathname === "/panel/api/state" && request.method === "PUT") {
        const body = await request.json().catch(() => null);
        if (!body || typeof body !== "object") {
          return jsonResponse({ error: "Invalid body" }, 400);
        }
        await env.PANEL_FILES.put(STATE_KEY, JSON.stringify(body), {
          httpMetadata: { contentType: "application/json" }
        });
        return jsonResponse({ ok: true });
      }

      if (url.pathname.startsWith("/panel/api/file-url/") && request.method === "GET") {
        const key = decodeURIComponent(url.pathname.replace("/panel/api/file-url/", ""));
        const payload = await requireAccess(request, env);
        if (!payload) return jsonResponse({ error: "Unauthorized" }, 401);
        if (!verifyPin(request, env)) return jsonResponse({ error: "pin_required" }, 403);
        const download = url.searchParams.get("download") === "1";
        const token = await createFileToken(
          { key, exp: Date.now() + FILE_TOKEN_TTL, download, pin: pinRequired(env) ? true : false },
          env
        );
        const signedUrl = `${url.origin}/panel/api/file/${encodeURIComponent(key)}?token=${encodeURIComponent(token)}`;
        return jsonResponse({ url: signedUrl });
      }

      if (url.pathname.startsWith("/panel/api/file/") && request.method === "GET") {
        const key = decodeURIComponent(url.pathname.replace("/panel/api/file/", ""));
        const token = url.searchParams.get("token");
        let payload = null;
        let viaToken = false;
        if (token) {
          payload = await verifyFileToken(token, env);
          viaToken = !!payload;
          if (!payload) return jsonResponse({ error: "Unauthorized" }, 401);
          if (pinRequired(env) && !payload.pin) return jsonResponse({ error: "pin_required" }, 403);
        } else {
          payload = await requireAccess(request, env);
          if (!payload) return jsonResponse({ error: "Unauthorized" }, 401);
          if (!verifyPin(request, env)) return jsonResponse({ error: "pin_required" }, 403);
        }

        const allowlist = parseAllowlist(env);
        if (allowlist.length) {
          const ip = clientIp(request);
          if (!allowlist.includes(ip)) return jsonResponse({ error: "Forbidden" }, 403);
        }

        const obj = await env.PANEL_FILES.get(key);
        if (!obj) return jsonResponse({ error: "Not found" }, 404);

        const name = obj.customMetadata?.name || "file.pdf";
        const download = url.searchParams.get("download") === "1" || payload?.download;
        const headers = new Headers();
        obj.writeHttpMetadata(headers);
        const origType = obj.customMetadata?.origType || headers.get("Content-Type") || "application/pdf";
        headers.set("Content-Type", origType);
        headers.set(
          "Content-Disposition",
          `${download ? "attachment" : "inline"}; filename=\"${name}\"`
        );
        headers.set("Cache-Control", "private, max-age=0, no-store");
        headers.set("Vary", "Cookie");

        let body = obj.body;
        if (obj.customMetadata?.enc === "1") {
          const iv = base64UrlDecode(obj.customMetadata?.iv || "");
          const encrypted = await obj.arrayBuffer();
          const decrypted = await decryptBuffer(encrypted, iv, env);
          body = decrypted;
        }

        await logFileAccess(env, {
          userId: payload?.sub || null,
          key,
          action: download ? "download" : "view",
          ip: clientIp(request),
          ua: request.headers.get("User-Agent") || "",
          viaToken,
        });

        return applySecurityHeaders(new Response(body, { headers }));
      }

      if (url.pathname.startsWith("/panel/api/file/") && request.method === "DELETE") {
        const key = decodeURIComponent(url.pathname.replace("/panel/api/file/", ""));
        await env.PANEL_FILES.delete(key);
        const index = await readIndex(env);
        await writeIndex(env, index.filter((i) => i.key !== key));
        return jsonResponse({ ok: true });
      }

      return jsonResponse({ error: "Not found" }, 404);
    }

    const panelRes = await fetch(new Request(PAGES_ORIGIN + url.pathname + url.search, request));
    return applySecurityHeaders(panelRes);
  }
}
