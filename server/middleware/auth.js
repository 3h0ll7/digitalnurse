import { verifyJwt, signJwt } from "../utils/jwt.js";
import { sendJson } from "../utils/http.js";
import { db } from "../lib/database.js";

export const authenticateRequest = async (req, res) => {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.slice(7);
  const payload = verifyJwt(token);
  if (!payload) {
    return null;
  }
  const user = await db.getUserById(payload.sub);
  if (!user) {
    return null;
  }
  return sanitizeUser(user);
};

export const requireAuth = async (req, res) => {
  const user = await authenticateRequest(req, res);
  if (!user) {
    sendJson(res, 401, { error: "Unauthorized" });
    return null;
  }
  return user;
};

export const sanitizeUser = (user) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

export const issueTokenForUser = (user) => {
  return signJwt({ sub: user.id, email: user.email, role: user.role });
};
