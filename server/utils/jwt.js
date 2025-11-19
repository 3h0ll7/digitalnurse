import { createHmac } from "node:crypto";

const base64Url = (input) => Buffer.from(JSON.stringify(input)).toString("base64url");

const getSecret = () => {
  return process.env.JWT_SECRET || "local-dev-secret";
};

export const signJwt = (payload, options = {}) => {
  const header = { alg: "HS256", typ: "JWT" };
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresIn = options.expiresIn || 60 * 60 * 8; // 8 hours
  const tokenPayload = { ...payload, iat: issuedAt, exp: issuedAt + expiresIn };

  const base = `${base64Url(header)}.${base64Url(tokenPayload)}`;
  const signature = createHmac("sha256", getSecret()).update(base).digest("base64url");
  return `${base}.${signature}`;
};

export const verifyJwt = (token) => {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const base = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac("sha256", getSecret()).update(base).digest("base64url");
    if (expectedSignature !== signature) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
};
