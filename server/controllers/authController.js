import { randomUUID } from "node:crypto";
import { z } from "zod";
import { db, defaultUnits } from "../lib/database.js";
import { issueTokenForUser, sanitizeUser } from "../middleware/auth.js";
import { sendJson } from "../utils/http.js";
import { identityProvider } from "../services/identityProvider.js";

const signupSchema = z.object({
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

export const signup = async (req, res) => {
  try {
    const data = signupSchema.parse(req.body);
    const email = data.email.toLowerCase();
    const existing = await db.findUserByEmail(email);
    if (existing) {
      return sendJson(res, 409, { error: "User already exists" });
    }

    const identityProfile = await identityProvider.signup({
      email,
      password: data.password,
      fullName: data.fullName,
    });

    const userRecord = {
      id: identityProfile.id || randomUUID(),
      email,
      passwordHash: identityProfile.passwordHash || null,
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
    const email = data.email.toLowerCase();
    const user = await db.findUserByEmail(email);
    if (!user) {
      return sendJson(res, 401, { error: "Invalid email or password" });
    }

    try {
      await identityProvider.verify({ user, email, password: data.password });
    } catch (error) {
      return sendJson(res, 401, { error: error.message || "Invalid email or password" });
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
