import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

let envLoaded = false;

export const loadEnv = () => {
  if (envLoaded) return;
  const envPath = path.resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const raw = readFileSync(envPath, "utf-8");
    raw
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith("#"))
      .forEach((line) => {
        const [key, ...rest] = line.split("=");
        const value = rest.join("=").trim();
        if (key && !process.env[key]) {
          process.env[key.trim()] = value.replace(/^"|"$/g, "");
        }
      });
  }
  envLoaded = true;
};

loadEnv();
