import { dbGet, dbRun } from "../utils/db.js";
import {
  generateTotpSecret,
  verifyTotp,
  generateBackupCodes,
  sha256Hex,
  randomId,
} from "../utils/crypto.js";
import { verifyJwt, signJwt } from "../utils/token.js";
import { parseCookies } from "./middleware.js";
import { createSessionTokens } from "./session.js";

const ACCESS_TTL = 30 * 60;

function cookie(name, value, maxAge, domain) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}; Domain=${domain}`;
}

export async function setup2fa(request, env) {
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

  const secret = user.totp_secret || generateTotpSecret();
  const backupCodes = generateBackupCodes();
  const backupHashes = await Promise.all(
    backupCodes.map((c) => sha256Hex(c + env.SESSION_SECRET))
  );
  let trusted = { trusted: [], backup: [] };
  if (user.trusted_devices) {
    try { trusted = JSON.parse(user.trusted_devices); } catch {}
  }
  trusted.backup = backupHashes;

  await dbRun(env, "UPDATE users SET totp_secret = ?, trusted_devices = ? WHERE id = ?", [
    secret,
    JSON.stringify(trusted),
    user.id,
  ]);

  const otpauth = `otpauth://totp/JUMVI:${encodeURIComponent(user.email)}?secret=${secret}&issuer=JUMVI&digits=6&period=30`;
  return new Response(JSON.stringify({ secret, otpauth, backupCodes }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function verify2fa(request, env) {
  const cookies = parseCookies(request);
  const pre = cookies.pre_2fa;
  const payload = await verifyJwt(pre, env.JWT_SECRET);
  if (!payload || payload.purpose !== "2fa") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }
  const body = await request.json().catch(() => ({}));
  const rawCode = (body.code || "").toString().trim();
  const code = rawCode.replace(/\s+/g, "");
  const trustDevice = body.trustDevice === true;

  const user = await dbGet(env, "SELECT * FROM users WHERE id = ?", [payload.sub]);
  if (!user || !user.totp_secret) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  let verified = false;
  const digitsOnly = code.replace(/[^\d]/g, "");
  if (/^\d{6}$/.test(digitsOnly)) {
    verified = await verifyTotp(user.totp_secret, digitsOnly, 4);
    if (!verified) {
      // Fallback: some authenticators use 60s step; allow a wider window during setup/verify.
      verified = await verifyTotp(user.totp_secret, digitsOnly, 4, 60);
    }
  }
  const trusted = user.trusted_devices ? JSON.parse(user.trusted_devices) : { trusted: [], backup: [] };
  if (!verified && trusted.backup?.length) {
    const backupCode = code.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const hash = await sha256Hex(backupCode + env.SESSION_SECRET);
    if (trusted.backup.includes(hash)) {
      verified = true;
      trusted.backup = trusted.backup.filter((h) => h !== hash);
    }
  }

  if (!verified) return new Response(JSON.stringify({ error: "Invalid code" }), { status: 401 });

  if (!user.totp_enabled) {
    await dbRun(env, "UPDATE users SET totp_enabled = 1, trusted_devices = ? WHERE id = ?", [
      JSON.stringify(trusted),
      user.id,
    ]);
  } else {
    await dbRun(env, "UPDATE users SET trusted_devices = ? WHERE id = ?", [JSON.stringify(trusted), user.id]);
  }

  const access = await signJwt({ sub: user.id, email: user.email }, env.JWT_SECRET, ACCESS_TTL);
  const { refreshRaw, ttl } = await createSessionTokens(env, user, payload.remember !== false, request);

  const setCookies = [cookie("access_token", access, ACCESS_TTL, env.COOKIE_DOMAIN)];
  setCookies.push(cookie("refresh_token", refreshRaw, ttl, env.COOKIE_DOMAIN));

  if (trustDevice) {
    const deviceToken = `${randomId()}${randomId()}`;
    const hash = await sha256Hex(deviceToken + env.SESSION_SECRET);
    trusted.trusted = trusted.trusted || [];
    trusted.trusted.push(hash);
    await dbRun(env, "UPDATE users SET trusted_devices = ? WHERE id = ?", [JSON.stringify(trusted), user.id]);
    setCookies.push(cookie("trusted_device", deviceToken, 30 * 24 * 60 * 60, env.COOKIE_DOMAIN));
    return new Response(JSON.stringify({ ok: true, trustedDevice: deviceToken }), {
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": setCookies.join(", "),
      },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": setCookies.join(", "),
    },
  });
}
