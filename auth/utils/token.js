const encoder = new TextEncoder();

function base64url(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  let str = "";
  bytes.forEach((b) => (str += String.fromCharCode(b)));
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(data));
}

export async function signJwt(payload, secret, expiresInSeconds) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInSeconds };

  const encodedHeader = base64url(encoder.encode(JSON.stringify(header)));
  const encodedPayload = base64url(encoder.encode(JSON.stringify(body)));
  const unsigned = `${encodedHeader}.${encodedPayload}`;
  const signature = await hmacSha256(secret, unsigned);
  return `${unsigned}.${base64url(signature)}`;
}

export async function verifyJwt(token, secret) {
  if (!token) return null;
  const [h, p, s] = token.split(".");
  if (!h || !p || !s) return null;
  const unsigned = `${h}.${p}`;
  const expected = base64url(await hmacSha256(secret, unsigned));
  if (expected !== s) return null;
  const payload = JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
  if (payload.exp && Date.now() / 1000 > payload.exp) return null;
  return payload;
}
