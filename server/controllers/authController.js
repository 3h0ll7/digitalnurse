import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db, defaultUnits } from "../lib/database.js";
import { hashPassword, verifyPassword } from "../utils/password.js";
import { issueTokenForUser, sanitizeUser } from "../middleware/auth.js";
import { sendJson } from "../utils/http.js";

const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  organization: z.string().min(2).optional(),
  units: z
    .array(z.object({ id: z.string(), name: z.string(), type: z.string().optional() }))
    .optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const register = async (req, res) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await db.findUserByEmail(data.email);
    if (existing) {
      return sendJson(res, 409, { error: "User already exists" });
    }

    const userRecord = {
      id: randomUUID(),
      email: data.email.toLowerCase(),
      passwordHash: hashPassword(data.password),
      fullName: data.fullName,
      role: "nurse",
      organization: data.organization || "Digital Nurse Buddy",
      units: data.units && data.units.length ? data.units : defaultUnits,
      createdAt: new Date().toISOString(),
    };

    await db.createUser(userRecord);
    const token = issueTokenForUser(userRecord);
    return sendJson(res, 201, { token, user: sanitizeUser(userRecord) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendJson(res, 400, { error: error.flatten() });
    }
    return sendJson(res, 500, { error: "Unable to register user" });
  }
};

export const login = async (req, res) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await db.findUserByEmail(data.email);
    if (!user || !verifyPassword(data.password, user.passwordHash)) {
      return sendJson(res, 401, { error: "Invalid credentials" });
    }
    const token = issueTokenForUser(user);
    return sendJson(res, 200, { token, user: sanitizeUser(user) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendJson(res, 400, { error: error.flatten() });
    }
    return sendJson(res, 500, { error: "Unable to login" });
  }
};

export const currentUser = async (req, res) => {
  if (!req.user) {
    return sendJson(res, 401, { error: "Unauthorized" });
  }
  return sendJson(res, 200, { user: req.user });
};
