const CACHE_NAME = "digital-nurse-buddy-v3";
const APP_ROUTES = [
  "/",
  "/home",
  "/procedures",
  "/labs",
  "/flashcards",
  "/mind-maps",
  "/assessments",
  "/calculators",
  "/ecg",
  "/ai-assistant",
];
const OFFLINE_FALLBACK_ROUTE = "/home";
const NETWORK_ONLY_DOMAINS = ["supabase.co", "googleapis.com", "fonts.gstatic.com"];
const ASSET_BYPASS_PATTERNS = ["/node_modules/", "/src/", "/@vite/", ".ts", ".tsx", ".js", ".jsx", ".map"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const appShellResponse = await fetch("/", { cache: "no-store" });

      await Promise.all(APP_ROUTES.map(async (route) => cache.put(route, appShellResponse.clone())));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  const isNavigationRequest = event.request.mode === "navigate";
  const shouldBypassCache =
    NETWORK_ONLY_DOMAINS.some((domain) => url.hostname.includes(domain)) ||
    ASSET_BYPASS_PATTERNS.some((pattern) => url.pathname.includes(pattern));

  if (shouldBypassCache) return;

  if (!isNavigationRequest) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request, { cache: "no-store" });
        const cache = await caches.open(CACHE_NAME);
        await cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch {
        const fallbackResponse =
          (await caches.match(event.request)) ||
          (await caches.match(OFFLINE_FALLBACK_ROUTE));

        return fallbackResponse || Response.error();
      }
    })()
  );
});
