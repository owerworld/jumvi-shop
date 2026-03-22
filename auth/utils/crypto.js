const encoder = new TextEncoder();

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function randomId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
}

export async function sha256Hex(input) {
  const data = typeof input === "string" ? encoder.encode(input) : input;
  const hash = await crypto.subtle.digest("SHA-256", data);
  return toHex(hash);
}

// NOTE: bcryptjs couldn't be installed in this offline environment.
// This uses PBKDF2-HMAC-SHA256 (210k iterations) as a secure fallback.
const PBKDF2_ITER = 100000;

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: PBKDF2_ITER, hash: "SHA-256" },
    key,
    256
  );
  return `pbkdf2|${PBKDF2_ITER}|${toHex(salt)}|${toHex(bits)}`;
}

export async function verifyPassword(password, stored) {
  if (!stored?.startsWith("pbkdf2")) return false;
  const parts = stored.includes("|") ? stored.split("|") : stored.split("$");
  const [, iterStr, saltHex, hashHex] = parts;
  const iterations = parseInt(iterStr, 10);
  const salt = Uint8Array.from(saltHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, [
    "deriveBits",
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256
  );
  return toHex(bits) === hashHex;
}

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(bytes) {
  let bits = "";
  bytes.forEach((b) => (bits += b.toString(2).padStart(8, "0")));
  let output = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.slice(i, i + 5);
    if (chunk.length < 5) output += BASE32_ALPHABET[parseInt(chunk.padEnd(5, "0"), 2)];
    else output += BASE32_ALPHABET[parseInt(chunk, 2)];
  }
  return output;
}

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

export function generateTotpSecret() {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}

async function hmacSha1(keyBytes, counter) {
  const key = await crypto.subtle.importKey("raw", keyBytes, { name: "HMAC", hash: "SHA-1" }, false, [
    "sign",
  ]);
  return crypto.subtle.sign("HMAC", key, counter);
}

export async function totpCode(secret, step = 30, digits = 6, timestamp = Date.now()) {
  const key = base32Decode(secret);
  const counter = Math.floor(timestamp / 1000 / step);
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setUint32(4, counter);
  const hmac = new Uint8Array(await hmacSha1(key, buffer));
  const offset = hmac[hmac.length - 1] & 0xf;
  const code =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);
  return String(code % 10 ** digits).padStart(digits, "0");
}

export async function verifyTotp(secret, code, window = 1, step = 30) {
  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const candidate = await totpCode(secret, step, 6, now + w * step * 1000);
    if (candidate === code) return true;
  }
  return false;
}

export function generateBackupCodes() {
  const codes = [];
  for (let i = 0; i < 6; i++) {
    codes.push(Math.random().toString(36).slice(2, 8).toUpperCase());
  }
  return codes;
}
