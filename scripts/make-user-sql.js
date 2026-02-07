import { hashPassword } from "../auth/utils/crypto.js";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error("Usage: node scripts/make-user-sql.js email password");
  process.exit(1);
}

const id = crypto.randomUUID();
const hash = await hashPassword(password);
const createdAt = new Date().toISOString();
const trusted = JSON.stringify({ trusted: [], backup: [] });

const sql = `INSERT INTO users (id, email, password_hash, created_at, trusted_devices) VALUES ('${id}', '${email.toLowerCase()}', '${hash}', '${createdAt}', '${trusted}');`;
console.log(sql);
