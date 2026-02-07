export async function dbGet(env, query, params = []) {
  const result = await env.JUMVI_DB.prepare(query).bind(...params).first();
  return result || null;
}

export async function dbAll(env, query, params = []) {
  const result = await env.JUMVI_DB.prepare(query).bind(...params).all();
  return result.results || [];
}

export async function dbRun(env, query, params = []) {
  return env.JUMVI_DB.prepare(query).bind(...params).run();
}
