import { dbGet, dbRun } from "../utils/db.js";
import { hashPassword, verifyPassword, randomId, sha256Hex, generateBackupCodes } from "../utils/crypto.js";
import { signJwt, verifyJwt } from "../utils/token.js";
import { parseCookies, clientIp, checkRateLimit, logAttempt } from "./middleware.js";
import { createSessionTokens } from "./session.js";

const ACCESS_TTL = 30 * 60;
const REFRESH_TTL = 30 * 24 * 60 * 60;
const REFRESH_TTL_SHORT = 24 * 60 * 60;

function cookie(name, value, maxAge, domain) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Domain=${domain}`;
}

function clearCookie(name, domain) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Domain=${domain}`;
}

function passwordPolicy(password) {
  return (
    password.length >= 12 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

async function createSession(env, user, remember, request) {
  return createSessionTokens(env, user, remember, request);
}

export async function login(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const password = body.password || "";
  const remember = body.remember !== false;
  const deviceToken = (body.deviceToken || "").toString().trim();
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
  await dbRun(env, "UPDATE users SET last_login = ? WHERE id = ?", [new Date().toISOString(), user.id]);

  const cookies = parseCookies(request);
  const trusted = cookies.trusted_device || deviceToken || "";
  const trustedDevices = user.trusted_devices ? JSON.parse(user.trusted_devices) : { trusted: [], backup: [] };
  const trustedHashes = trustedDevices.trusted || [];
  const trustedOk = trusted ? trustedHashes.includes(await sha256Hex(trusted + env.SESSION_SECRET)) : false;

  if (user.totp_enabled && !trustedOk) {
    const preToken = await signJwt({ sub: user.id, purpose: "2fa", remember }, env.JWT_SECRET, 10 * 60);
    return new Response(JSON.stringify({ requires2fa: true, setup: false }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie("pre_2fa", preToken, 600, env.COOKIE_DOMAIN),
      },
    });
  }

  if (!user.totp_enabled) {
    const preToken = await signJwt({ sub: user.id, purpose: "2fa", remember }, env.JWT_SECRET, 10 * 60);
    return new Response(JSON.stringify({ requires2fa: true, setup: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": cookie("pre_2fa", preToken, 600, env.COOKIE_DOMAIN),
      },
    });
  }

  const access = await signJwt({ sub: user.id, email: user.email }, env.JWT_SECRET, ACCESS_TTL);
  const session = await createSession(env, user, remember, request);
  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": [
        cookie("access_token", access, ACCESS_TTL, env.COOKIE_DOMAIN),
        cookie("refresh_token", session.refreshRaw, session.ttl, env.COOKIE_DOMAIN),
      ].join(", "),
    },
  });
}

export async function refresh(request, env) {
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
      "Set-Cookie": cookie("access_token", access, ACCESS_TTL, env.COOKIE_DOMAIN),
    },
  });
}

export async function logout(request, env) {
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
        clearCookie("pre_2fa", env.COOKIE_DOMAIN),
      ].join(", "),
    },
  });
}

export async function me(request, env) {
  const cookies = parseCookies(request);
  const token = cookies.access_token;
  const payload = await verifyJwt(token, env.JWT_SECRET);
  if (!payload) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  return new Response(JSON.stringify({ id: payload.sub, email: payload.email }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function forgotPassword(request, env) {
  const body = await request.json().catch(() => ({}));
  const email = (body.email || "").toLowerCase().trim();
  const user = await dbGet(env, "SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
  const resetToken = `${randomId()}${randomId()}`;
  const resetHash = await sha256Hex(resetToken + env.SESSION_SECRET);
  const trusted = user.trusted_devices ? JSON.parse(user.trusted_devices) : { trusted: [], backup: [] };
  trusted.reset = { hash: resetHash, exp: Date.now() + 60 * 60 * 1000 };
  await dbRun(env, "UPDATE users SET trusted_devices = ? WHERE id = ?", [
    JSON.stringify(trusted),
    user.id,
  ]);
  return new Response(JSON.stringify({ ok: true, resetToken }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function resetPassword(request, env) {
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
    user.id,
  ]);
  return new Response(JSON.stringify({ ok: true }), { headers: { "Content-Type": "application/json" } });
}

export async function bootstrapUser(env, email, password) {
  const existing = await dbGet(env, "SELECT id FROM users WHERE email = ?", [email]);
  if (existing) return existing.id;
  const id = randomId();
  const pwHash = await hashPassword(password);
  await dbRun(env, "INSERT INTO users (id, email, password_hash, created_at, trusted_devices) VALUES (?, ?, ?, ?, ?)", [
    id,
    email,
    pwHash,
    new Date().toISOString(),
    JSON.stringify({ trusted: [], backup: [] }),
  ]);
  return id;
}
