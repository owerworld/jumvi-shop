import { dbRun, dbAll } from "../utils/db.js";
import { randomId, sha256Hex } from "../utils/crypto.js";
import { clientIp } from "./middleware.js";

const REFRESH_TTL = 30 * 24 * 60 * 60;

async function ensureSessionLimit(env, userId) {
  const sessions = await dbAll(env, "SELECT id, created_at FROM sessions WHERE user_id = ? ORDER BY created_at DESC", [
    userId,
  ]);
  if (sessions.length <= 3) return;
  const toDelete = sessions.slice(3).map((s) => s.id);
  for (const id of toDelete) {
    await dbRun(env, "DELETE FROM sessions WHERE id = ?", [id]);
  }
}

export async function createSessionTokens(env, user, remember, request) {
  const refreshRaw = `${randomId()}-${randomId()}`;
  const refreshHash = await sha256Hex(refreshRaw + env.SESSION_SECRET);
  const ttl = remember ? REFRESH_TTL : 24 * 60 * 60;
  const expiresAt = new Date(Date.now() + ttl * 1000).toISOString();
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
      new Date().toISOString(),
    ]
  );
  await ensureSessionLimit(env, user.id);
  return { refreshRaw, ttl };
}
