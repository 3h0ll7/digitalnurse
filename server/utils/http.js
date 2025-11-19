const defaultOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

const allowedOrigins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((origin) => origin.trim())
  : defaultOrigins;

export const buildCorsHeaders = () => ({
  "Access-Control-Allow-Origin": allowedOrigins.includes("*")
    ? "*"
    : allowedOrigins[0] || "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
});

export const applySecurityHeaders = (res) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
};

export const sendJson = (res, statusCode, payload) => {
  const corsHeaders = buildCorsHeaders();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  applySecurityHeaders(res);

  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
};

export const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    if (req.method === "GET" || req.method === "HEAD") {
      return resolve({});
    }

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.socket.destroy();
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => {
      if (!body) {
        return resolve({});
      }
      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON payload"));
      }
    });

    req.on("error", (error) => reject(error));
  });
};
