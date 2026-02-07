var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// auth/utils/db.js
async function dbGet(env, query, params = []) {
  const result = await env.JUMVI_DB.prepare(query).bind(...params).first();
  return result || null;
}
__name(dbGet, "dbGet");
async function dbAll(env, query, params = []) {
  const result = await env.JUMVI_DB.prepare(query).bind(...params).all();
  return result.results || [];
}
__name(dbAll, "dbAll");
async function dbRun(env, query, params = []) {
  return env.JUMVI_DB.prepare(query).bind(...params).run();
}
__name(dbRun, "dbRun");

// auth/utils/crypto.js
var encoder = new TextEncoder();
function toHex(buffer) {
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(toHex, "toHex");
function randomId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = bytes[6] & 15 | 64;
  bytes[8] = bytes[8] & 63 | 128;
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}
__name(randomId, "randomId");
async function sha256Hex(input) {
  const data = typeof input === "string" ? encoder.encode(input) : input;
  const hash = await crypto.subtle.digest("SHA-256", data);
  return toHex(hash);
}
__name(sha256Hex, "sha256Hex");
var PBKDF2_ITER = 1e5;
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits"
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITER, hash: "SHA-256" },
    key,
    256
  );
  return `pbkdf2|${PBKDF2_ITER}|${toHex(salt)}|${toHex(bits)}`;
}
__name(hashPassword, "hashPassword");
async function verifyPassword(password, stored) {
  if (!stored?.startsWith("pbkdf2")) return false;
  const parts = stored.includes("|") ? stored.split("|") : stored.split("$");
  const [, iterStr, saltHex, hashHex] = parts;
  const iterations = parseInt(iterStr, 10);
  const salt = Uint8Array.from(saltHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits"
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256
  );
  return toHex(bits) === hashHex;
}
__name(verifyPassword, "verifyPassword");
var BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function base32Encode(bytes) {
  let bits = "";
  bytes.forEach((b) => bits += b.toString(2).padStart(8, "0"));
  let output = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    if (chunk.length < 5) output += BASE32_ALPHABET[parseInt(chunk.padEnd(5, "0"), 2)];
    else output += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return output;
}
__name(base32Encode, "base32Encode");
function base32Decode(str) {
  const cleaned = str.replace(/=+$/g, "").toUpperCase();
  let bits = "";
  for (const c of cleaned) {
    const val = BASE32_ALPHABET.indexOf(c);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.slice(i, i + 8), 2));
  }
  return new Uint8Array(bytes);
}
__name(base32Decode, "base32Decode");
function generateTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}
__name(generateTotpSecret, "generateTotpSecret");
async function hmacSha1(keyBytes, counter) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, [
    "sign"
  ]);
  return crypto.subtle.sign("HMAC", key, counter);
}
__name(hmacSha1, "hmacSha1");
async function totpCode(secret, step = 30, digits = 6, timestamp = Date.now()) {
  const key = base32Decode(secret);
  const counter = Math.floor(timestamp / 1e3 / step);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, counter);
  const hmac = new Uint8Array(await hmacSha1(key, buffer));
  const offset = hmac[hmac.length - 1] & 15;
  const code = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
  return String(code % 10 ** digits).padStart(digits, "0");
}
__name(totpCode, "totpCode");
async function verifyTotp(secret, code, window = 1) {
  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const candidate = await totpCode(secret, 30, 6, now + w * 3e4);
    if (candidate === code) return true;
  }
  return false;
}
__name(verifyTotp, "verifyTotp");
function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 6; i++) {
    codes.push(Math.random().toString(36).slice(2, 8).toUpperCase());
  }
  return codes;
}
__name(generateBackupCodes, "generateBackupCodes");

// auth/utils/token.js
var encoder2 = new TextEncoder();
function base64url(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let str = "";
  bytes.forEach((b) => str += String.fromCharCode(b));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
__name(base64url, "base64url");
async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder2.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, encoder2.encode(data));
}
__name(hmacSha256, "hmacSha256");
async function signJwt(payload, secret, expiresInSeconds) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1e3);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };
  const encodedHeader = base64url(encoder2.encode(JSON.stringify(header)));
  const encodedPayload = base64url(encoder2.encode(JSON.stringify(body)));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const signature = await hmacSha256(secret, unsigned);
  return `${unsigned}.${base64url(signature)}`;
}
__name(signJwt, "signJwt");
async function verifyJwt(token, secret) {
  if (!token) return null;
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) return null;
  const unsigned = `${h}.${p}`;
  const expected = base64url(await hmacSha256(secret, unsigned));
  if (expected !== s) return null;
  const payload = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
  if (payload.exp && Date.now() / 1e3 > payload.exp) return null;
  return payload;
}
__name(verifyJwt, "verifyJwt");

// auth/api/middleware.js
function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
}
__name(parseCookies, "parseCookies");
function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
}
__name(clientIp, "clientIp");
async function requireAccess(request, env) {
  const cookies = parseCookies(request);
  const token = cookies.access_token;
  const payload = await verifyJwt(token, env.JWT_SECRET);
  return payload;
}
__name(requireAccess, "requireAccess");
async function checkRateLimit(env, email, ip) {
  const since = new Date(Date.now() - 15 * 60 * 1e3).toISOString();
  const rows = await dbAll(
    env,
    "SELECT success FROM login_attempts WHERE (email = ? OR ip_address = ?) AND attempted_at > ?",
    [email, ip, since]
  );
  const fails = rows.filter((r) => r.success === 0).length;
  return fails >= 5;
}
__name(checkRateLimit, "checkRateLimit");
async function logAttempt(env, email, ip, success) {
  await dbRun(
    env,
    "INSERT INTO login_attempts (id, email, ip_address, success, attempted_at) VALUES (?, ?, ?, ?, ?)",
    [randomId(), email, ip, success ? 1 : 0, (/* @__PURE__ */ new Date()).toISOString()]
  );
}
__name(logAttempt, "logAttempt");

// auth/api/session.js
var REFRESH_TTL = 30 * 24 * 60 * 60;
async function ensureSessionLimit(env, userId) {
  const sessions = await dbAll(env, "SELECT id, created_at FROM sessions WHERE user_id = ? ORDER BY created_at DESC", [
    userId
  ]);
  if (sessions.length <= 3) return;
  const toDelete = sessions.slice(3).map((s) => s.id);
  for (const id of toDelete) {
    await dbRun(env, "DELETE FROM sessions WHERE id = ?", [id]);
  }
}
__name(ensureSessionLimit, "ensureSessionLimit");
async function createSessionTokens(env, user, remember, request) {
  const refreshRaw = `${randomId()}-${randomId()}`;
  const refreshHash = await sha256Hex(refreshRaw + env.SESSION_SECRET);
  const ttl = remember ? REFRESH_TTL : 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + ttl * 1e3).toISOString();
  await dbRun(
    env,
    "INSERT INTO sessions (id, user_id, refresh_token, ip_address, user_agent, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      randomId(),
      user.id,
      refreshHash,
      clientIp(request),
      request.headers.get("User-Agent") || "",
      expiresAt,
      (/* @__PURE__ */ new Date()).toISOString()
    ]
  );
  await ensureSessionLimit(env, user.id);
  return { refreshRaw, ttl };
}
__name(createSessionTokens, "createSessionTokens");

// auth/api/auth.js
var ACCESS_TTL = 30 * 60;
var REFRESH_TTL2 = 30 * 24 * 60 * 60;
var REFRESH_TTL_SHORT = 24 * 60 * 60;
function cookie(name, value, maxAge, domain) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Domain=${domain}`;
}
__name(cookie, "cookie");
function clearCookie(name, domain) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Domain=${domain}`;
}
__name(clearCookie, "clearCookie");
function passwordPolicy(password) {
  return password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password);
}
__name(passwordPolicy, "passwordPolicy");
async function createSession(env, user, remember, request) {
  return createSessionTokens(env, user, remember, request);
}
__name(createSession, "createSession");
async function login(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const password = body.password || "";
  const remember = body.remember !== false;
  const ip = clientIp(request);
  if (await checkRateLimit(env, email, ip)) {
    return new Response(JSON.stringify({ error: "Too many attempts" }), { status: 429 });
  }
  const user = await dbGet(env, "SELECT * FROM users WHERE email = ?", [email]);
  if (!user) {
    await logAttempt(env, email, ip, false);
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    await logAttempt(env, email, ip, false);
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
  }
  await logAttempt(env, email, ip, true);
  await dbRun(env, "UPDATE users SET last_login = ? WHERE id = ?", [(/* @__PURE__ */ new Date()).toISOString(), user.id]);
  const cookies = parseCookies(request);
  const trusted = cookies.trusted_device;
  const trustedDevices = user.trusted_devices ? JSON.parse(user.trusted_devices) : { trusted: [], backup: [] };
  const trustedHashes = trustedDevices.trusted || [];
  const trustedOk = trusted ? trustedHashes.includes(await sha256Hex(trusted + env.SESSION_SECRET)) : false;
  if (user.totp_enabled && !trustedOk) {
    const preToken = await signJwt({ sub: user.id, purpose: "2fa", remember }, env.JWT_SECRET, 10 * 60);
    return new Response(JSON.stringify({ requires2fa: true, setup: false }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie("pre_2fa", preToken, 600, env.COOKIE_DOMAIN)
      }
    });
  }
  if (!user.totp_enabled) {
    const preToken = await signJwt({ sub: user.id, purpose: "2fa", remember }, env.JWT_SECRET, 10 * 60);
    return new Response(JSON.stringify({ requires2fa: true, setup: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie("pre_2fa", preToken, 600, env.COOKIE_DOMAIN)
      }
    });
  }
  const access = await signJwt({ sub: user.id, email: user.email }, env.JWT_SECRET, ACCESS_TTL);
  const session = await createSession(env, user, remember, request);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": [
        cookie("access_token", access, ACCESS_TTL, env.COOKIE_DOMAIN),
        cookie("refresh_token", session.refreshRaw, session.ttl, env.COOKIE_DOMAIN)
      ].join(", ")
    }
  });
}
__name(login, "login");
async function refresh(request, env) {
  const cookies = parseCookies(request);
  const refreshToken = cookies.refresh_token;
  if (!refreshToken) return new Response(JSON.stringify({ error: "No refresh" }), { status: 401 });
  const hash = await sha256Hex(refreshToken + env.SESSION_SECRET);
  const session = await dbGet(env, "SELECT * FROM sessions WHERE refresh_token = ?", [hash]);
  if (!session) return new Response(JSON.stringify({ error: "Invalid refresh" }), { status: 401 });
  if (new Date(session.expires_at).getTime() < Date.now()) {
    await dbRun(env, "DELETE FROM sessions WHERE id = ?", [session.id]);
    return new Response(JSON.stringify({ error: "Expired" }), { status: 401 });
  }
  const user = await dbGet(env, "SELECT * FROM users WHERE id = ?", [session.user_id]);
  if (!user) return new Response(JSON.stringify({ error: "Invalid user" }), { status: 401 });
  const access = await signJwt({ sub: user.id, email: user.email }, env.JWT_SECRET, ACCESS_TTL);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": cookie("access_token", access, ACCESS_TTL, env.COOKIE_DOMAIN)
    }
  });
}
__name(refresh, "refresh");
async function logout(request, env) {
  const cookies = parseCookies(request);
  const refreshToken = cookies.refresh_token;
  if (refreshToken) {
    const hash = await sha256Hex(refreshToken + env.SESSION_SECRET);
    await dbRun(env, "DELETE FROM sessions WHERE refresh_token = ?", [hash]);
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": [
        clearCookie("access_token", env.COOKIE_DOMAIN),
        clearCookie("refresh_token", env.COOKIE_DOMAIN),
        clearCookie("trusted_device", env.COOKIE_DOMAIN),
        clearCookie("pre_2fa", env.COOKIE_DOMAIN)
      ].join(", ")
    }
  });
}
__name(logout, "logout");
async function me(request, env) {
  const cookies = parseCookies(request);
  const token = cookies.access_token;
  const payload = await verifyJwt(token, env.JWT_SECRET);
  if (!payload) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  return new Response(JSON.stringify({ id: payload.sub, email: payload.email }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(me, "me");
async function forgotPassword(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const user = await dbGet(env, "SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  const resetToken = `${randomId()}${randomId()}`;
  const resetHash = await sha256Hex(resetToken + env.SESSION_SECRET);
  const trusted = user.trusted_devices ? JSON.parse(user.trusted_devices) : { trusted: [], backup: [] };
  trusted.reset = { hash: resetHash, exp: Date.now() + 60 * 60 * 1e3 };
  await dbRun(env, "UPDATE users SET trusted_devices = ? WHERE id = ?", [
    JSON.stringify(trusted),
    user.id
  ]);
  return new Response(JSON.stringify({ ok: true, resetToken }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(forgotPassword, "forgotPassword");
async function resetPassword(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const token = body.token || "";
  const newPassword = body.newPassword || "";
  if (!passwordPolicy(newPassword)) {
    return new Response(JSON.stringify({ error: "Weak password" }), { status: 400 });
  }
  const user = await dbGet(env, "SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return new Response(JSON.stringify({ error: "Invalid" }), { status: 400 });
  const trusted = user.trusted_devices ? JSON.parse(user.trusted_devices) : {};
  const reset = trusted.reset;
  if (!reset || reset.exp < Date.now()) return new Response(JSON.stringify({ error: "Expired" }), { status: 400 });
  const hash = await sha256Hex(token + env.SESSION_SECRET);
  if (hash !== reset.hash) return new Response(JSON.stringify({ error: "Invalid" }), { status: 400 });
  const pwHash = await hashPassword(newPassword);
  delete trusted.reset;
  await dbRun(env, "UPDATE users SET password_hash = ?, trusted_devices = ? WHERE id = ?", [
    pwHash,
    JSON.stringify(trusted),
    user.id
  ]);
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}
__name(resetPassword, "resetPassword");

// auth/api/2fa.js
var ACCESS_TTL2 = 30 * 60;
function cookie2(name, value, maxAge, domain) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Domain=${domain}`;
}
__name(cookie2, "cookie");
async function setup2fa(request, env) {
  const cookies = parseCookies(request);
  const pre = cookies.pre_2fa;
  const payload = await verifyJwt(pre, env.JWT_SECRET);
  if (!payload || payload.purpose !== "2fa") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const user = await dbGet(env, "SELECT * FROM users WHERE id = ?", [payload.sub]);
  if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  if (user.totp_enabled) {
    return new Response(JSON.stringify({ error: "already_enabled" }), { status: 409 });
  }
  const secret = generateTotpSecret();
  const backupCodes = generateBackupCodes();
  const backupHashes = await Promise.all(
    backupCodes.map((c) => sha256Hex(c + env.SESSION_SECRET))
  );
  let trusted = { trusted: [], backup: [] };
  if (user.trusted_devices) {
    try {
      trusted = JSON.parse(user.trusted_devices);
    } catch {
    }
  }
  trusted.backup = backupHashes;
  await dbRun(env, "UPDATE users SET totp_secret = ?, trusted_devices = ? WHERE id = ?", [
    secret,
    JSON.stringify(trusted),
    user.id
  ]);
  const otpauth = `otpauth://totp/JUMVI:${encodeURIComponent(user.email)}?secret=${secret}&issuer=JUMVI&digits=6&period=30`;
  return new Response(JSON.stringify({ secret, otpauth, backupCodes }), {
    headers: { "Content-Type": "application/json" }
  });
}
__name(setup2fa, "setup2fa");
async function verify2fa(request, env) {
  const cookies = parseCookies(request);
  const pre = cookies.pre_2fa;
  const payload = await verifyJwt(pre, env.JWT_SECRET);
  if (!payload || payload.purpose !== "2fa") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const code = (body.code || "").toString().trim();
  const trustDevice = body.trustDevice === true;
  const user = await dbGet(env, "SELECT * FROM users WHERE id = ?", [payload.sub]);
  if (!user || !user.totp_secret) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  let verified = await verifyTotp(user.totp_secret, code);
  const trusted = user.trusted_devices ? JSON.parse(user.trusted_devices) : { trusted: [], backup: [] };
  if (!verified && trusted.backup?.length) {
    const hash = await sha256Hex(code + env.SESSION_SECRET);
    if (trusted.backup.includes(hash)) {
      verified = true;
      trusted.backup = trusted.backup.filter((h) => h !== hash);
    }
  }
  if (!verified) return new Response(JSON.stringify({ error: "Invalid code" }), { status: 401 });
  if (!user.totp_enabled) {
    await dbRun(env, "UPDATE users SET totp_enabled = 1, trusted_devices = ? WHERE id = ?", [
      JSON.stringify(trusted),
      user.id
    ]);
  } else {
    await dbRun(env, "UPDATE users SET trusted_devices = ? WHERE id = ?", [JSON.stringify(trusted), user.id]);
  }
  const access = await signJwt({ sub: user.id, email: user.email }, env.JWT_SECRET, ACCESS_TTL2);
  const { refreshRaw, ttl } = await createSessionTokens(env, user, payload.remember !== false, request);
  const setCookies = [cookie2("access_token", access, ACCESS_TTL2, env.COOKIE_DOMAIN)];
  setCookies.push(cookie2("refresh_token", refreshRaw, ttl, env.COOKIE_DOMAIN));
  if (trustDevice) {
    const deviceToken = `${randomId()}${randomId()}`;
    const hash = await sha256Hex(deviceToken + env.SESSION_SECRET);
    trusted.trusted = trusted.trusted || [];
    trusted.trusted.push(hash);
    await dbRun(env, "UPDATE users SET trusted_devices = ? WHERE id = ?", [JSON.stringify(trusted), user.id]);
    setCookies.push(cookie2("trusted_device", deviceToken, 30 * 24 * 60 * 60, env.COOKIE_DOMAIN));
  }
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": setCookies.join(", ")
    }
  });
}
__name(verify2fa, "verify2fa");

// panel-pin-worker.js
var PAGES_ORIGIN = "https://jumvi-panel.pages.dev";
var INDEX_KEY = "_index.json";
var STATE_KEY = "_state.json";
var ALLOWED_MIME = ["application/pdf", "image/png", "image/jpeg", "video/mp4", "video/quicktime"];
var MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
var MAX_VIDEO_SIZE = 200 * 1024 * 1024;
var FILE_TOKEN_TTL = 5 * 60 * 1e3;
var ENCRYPTION_MAX_BYTES = 25 * 1024 * 1024;
var SCRIPT_SRI_TARGETS = [
  "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
  "https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js",
  "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"
];
var CSP_POLICY = [
  "default-src 'self'",
  "script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://api.qrserver.com",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests"
].join("; ");
var SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
  "Content-Security-Policy": CSP_POLICY
};
var auditReady = false;
var encKeyPromise = null;
var sriCache = /* @__PURE__ */ new Map();
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
__name(escapeRegExp, "escapeRegExp");
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
__name(getSriHash, "getSriHash");
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
__name(injectSri, "injectSri");
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
__name(applySecurityHeaders, "applySecurityHeaders");
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
__name(readIndex, "readIndex");
async function writeIndex(env, items) {
  const body = JSON.stringify(items);
  await env.PANEL_FILES.put(INDEX_KEY, body, {
    httpMetadata: { contentType: "application/json" }
  });
}
__name(writeIndex, "writeIndex");
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
__name(jsonResponse, "jsonResponse");
function sanitizeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}
__name(sanitizeName, "sanitizeName");
function mimeFromName(name = "") {
  const lower = name.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".mp4")) return "video/mp4";
  if (lower.endsWith(".mov")) return "video/quicktime";
  return "";
}
__name(mimeFromName, "mimeFromName");
function base64UrlEncode(bytes) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
__name(base64UrlEncode, "base64UrlEncode");
function base64UrlDecode(str) {
  const pad = str.padEnd(str.length + (4 - (str.length % 4 || 4)), "=");
  const normalized = pad.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(normalized);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
__name(base64UrlDecode, "base64UrlDecode");
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
__name(signPayload, "signPayload");
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
__name(verifySignature, "verifySignature");
async function createFileToken(payload, env) {
  const body = JSON.stringify(payload);
  const encoded = base64UrlEncode(new TextEncoder().encode(body));
  const signature = await signPayload(encoded, env);
  return `${encoded}.${signature}`;
}
__name(createFileToken, "createFileToken");
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
__name(verifyFileToken, "verifyFileToken");
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
__name(ensureAuditTable, "ensureAuditTable");
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
        (/* @__PURE__ */ new Date()).toISOString()
      ]
    );
  } catch {
  }
}
__name(logFileAccess, "logFileAccess");
function parseAllowlist(env) {
  const raw = env.ALLOW_IPS || "";
  return raw.split(",").map((v) => v.trim()).filter(Boolean);
}
__name(parseAllowlist, "parseAllowlist");
function pinRequired(env) {
  return !!env.FILE_PIN;
}
__name(pinRequired, "pinRequired");
function verifyPin(request, env) {
  if (!pinRequired(env)) return true;
  const headerPin = request.headers.get("X-File-Pin");
  const url = new URL(request.url);
  const queryPin = url.searchParams.get("pin");
  const pin = headerPin || queryPin || "";
  return pin && pin === env.FILE_PIN;
}
__name(verifyPin, "verifyPin");
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
__name(getEncryptionKey, "getEncryptionKey");
async function encryptBuffer(buffer, env) {
  const key = await getEncryptionKey(env);
  if (!key) return { buffer, iv: null, encrypted: false };
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, buffer);
  return { buffer: encrypted, iv, encrypted: true };
}
__name(encryptBuffer, "encryptBuffer");
async function decryptBuffer(buffer, iv, env) {
  const key = await getEncryptionKey(env);
  if (!key) return buffer;
  return crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, buffer);
}
__name(decryptBuffer, "decryptBuffer");
async function safe(handler, label) {
  try {
    return await handler();
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ error: `auth_${label}_error`, message }, 500);
  }
}
__name(safe, "safe");
var panel_pin_worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const isHttp = url.protocol === "http:" || forwardedProto === "http";
    if (isHttp) {
      const httpsUrl = `https://${url.host}${url.pathname}${url.search}`;
      return applySecurityHeaders(Response.redirect(httpsUrl, 301));
    }
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
        const storedAt = (/* @__PURE__ */ new Date()).toISOString();
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
              iv: base64UrlEncode(new Uint8Array(iv))
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
          `${download ? "attachment" : "inline"}; filename="${name}"`
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
          viaToken
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
};
export {
  panel_pin_worker_default as default
};
//# sourceMappingURL=panel-pin-worker.js.map
