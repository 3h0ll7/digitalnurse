import { parseBody, sendJson, buildCorsHeaders, applySecurityHeaders } from "./utils/http.js";
import { requireAuth } from "./middleware/auth.js";

export class Router {
  constructor() {
    this.routes = [];
  }

  register(method, path, handler, options = {}) {
    this.routes.push({ method, path, handler, ...options });
  }

  async handle(req, res) {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const corsHeaders = buildCorsHeaders();
    Object.entries(corsHeaders).forEach(([key, value]) => res.setHeader(key, value));
    applySecurityHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      const params = this.matchPath(pathname, route.path);
      if (!params) continue;

      req.params = params;
      if (["POST", "PUT", "PATCH"].includes(req.method)) {
        try {
          req.body = await parseBody(req);
        } catch (error) {
          return sendJson(res, 400, { error: error.message });
        }
      }

      if (route.requireAuth) {
        const user = await requireAuth(req, res);
        if (!user) return;
        req.user = user;
      }

      try {
        await route.handler(req, res);
      } catch (error) {
        console.error(error);
        return sendJson(res, 500, { error: "Internal server error" });
      }
      return;
    }

    return sendJson(res, 404, { error: "Not found" });
  }

  matchPath(requestPath, routePath) {
    const requestSegments = requestPath.split("/").filter(Boolean);
    const routeSegments = routePath.split("/").filter(Boolean);
    if (requestSegments.length !== routeSegments.length) {
      return null;
    }
    const params = {};
    for (let i = 0; i < routeSegments.length; i += 1) {
      const segment = routeSegments[i];
      if (segment.startsWith(":")) {
        params[segment.slice(1)] = requestSegments[i];
        continue;
      }
      if (segment !== requestSegments[i]) {
        return null;
      }
    }
    return params;
  }
}
