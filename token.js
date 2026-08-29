const crypto = require("crypto");

function b64url(input) {
  return Buffer.from(input).toString("base64url");
}
function sign(value, secret) {
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}
function createToken(payload, secret) {
  const body = b64url(JSON.stringify(payload));
  return `${body}.${sign(body, secret)}`;
}
function verifyToken(token, secret) {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) return null;
  const expected = sign(body, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  if (!payload.exp || Date.now() > payload.exp) return null;
  return payload;
}
module.exports = { createToken, verifyToken };
