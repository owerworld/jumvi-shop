import { verifyJwt } from "../utils/token.js";
import { dbAll, dbRun } from "../utils/db.js";
import { randomId } from "../utils/crypto.js";

export function parseCookies(request) {
  const header = request.headers.get("Cookie") || "";
  return Object.fromEntries(
    header.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    })
  );
}

export function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For") || "";
}

export async function requireAccess(request, env) {
  const cookies = parseCookies(request);
  const token = cookies.access_token;
  const payload = await verifyJwt(token, env.JWT_SECRET);
  return payload;
}

export async function checkRateLimit(env, email, ip) {
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const rows = await dbAll(
    env,
    "SELECT success FROM login_attempts WHERE (email = ? OR ip_address = ?) AND attempted_at > ?",
    [email, ip, since]
  );
  const fails = rows.filter((r) => r.success === 0).length;
  return fails >= 5;
}

export async function logAttempt(env, email, ip, success) {
  await dbRun(
    env,
    "INSERT INTO login_attempts (id, email, ip_address, success, attempted_at) VALUES (?, ?, ?, ?, ?)",
    [randomId(), email, ip, success ? 1 : 0, new Date().toISOString()]
  );
}
