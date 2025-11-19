import "./lib/env.js";
import http from "node:http";
import { Router } from "./router.js";
import { db } from "./lib/database.js";
import { signup, login, currentUser } from "./controllers/authController.js";
import { getMasterData } from "./controllers/masterDataController.js";
import { triageAssistant } from "./controllers/aiController.js";
import { sendJson } from "./utils/http.js";

const router = new Router();

router.register("GET", "/health", async (req, res) => {
  return sendJson(res, 200, { status: "healthy", timestamp: new Date().toISOString() });
});

router.register("GET", "/api/status", async (req, res) => {
  return sendJson(res, 200, {
    api: "Digital Nurse Buddy",
    version: "1.0.0",
    uptime: process.uptime(),
  });
});

router.register("POST", "/api/auth/register", signup);
router.register("POST", "/api/auth/signup", signup);
router.register("POST", "/api/auth/login", login);
router.register("GET", "/api/auth/me", currentUser, { requireAuth: true });
router.register("GET", "/api/master-data/:type", getMasterData, { requireAuth: true });
router.register("POST", "/api/ai/triage", triageAssistant, { requireAuth: true });

router.register("POST", "/signup", signup);
router.register("POST", "/login", login);
router.register("GET", "/me", currentUser, { requireAuth: true });
router.register("GET", "/master-data/:type", getMasterData, { requireAuth: true });
router.register("POST", "/ai/triage", triageAssistant, { requireAuth: true });

const server = http.createServer((req, res) => router.handle(req, res));

const start = async () => {
  await db.init();
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
};

start();
