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
const STATIC_ASSET_EXTENSIONS = [
  ".css",
  ".js",
  ".mjs",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".ico",
  ".woff",
  ".woff2",
  ".ttf",
  ".json",
];

const isAppRoute = (pathname) => APP_ROUTES.includes(pathname);

const isCacheableStaticAsset = (url) =>
  STATIC_ASSET_EXTENSIONS.some((extension) => url.pathname.endsWith(extension));

const shouldBypassRequest = (request) => {
  if (request.method !== "GET") {
    return true;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return true;
  }

  if (NETWORK_ONLY_DOMAINS.some((domain) => url.hostname.includes(domain))) {
    return true;
  }

  if (
    url.pathname.startsWith("/@vite") ||
    url.pathname.startsWith("/src/") ||
    url.pathname.includes("/node_modules/") ||
    url.searchParams.has("v")
  ) {
    return true;
  }

  return false;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const appShellResponse = await fetch(OFFLINE_FALLBACK_ROUTE, { cache: "no-store" });

      await Promise.all(
        APP_ROUTES.map(async (route) => {
          await cache.put(route, appShellResponse.clone());
        }),
      );

      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  if (shouldBypassRequest(event.request)) {
    return;
  }

  const url = new URL(event.request.url);

  if (event.request.mode === "navigate" || isAppRoute(url.pathname)) {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(event.request, { cache: "no-store" });
          const cache = await caches.open(CACHE_NAME);
          await cache.put(url.pathname, networkResponse.clone());
          return networkResponse;
        } catch {
          const fallbackResponse = await caches.match(url.pathname);
          const offlineResponse = await caches.match(OFFLINE_FALLBACK_ROUTE);
          return fallbackResponse || offlineResponse || Response.error();
        }
      })(),
    );
    return;
  }

  if (!isCacheableStaticAsset(url)) {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      try {
        const networkResponse = await fetch(event.request);
        if (networkResponse.status === 200 && networkResponse.type === "basic") {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        return Response.error();
      }
    })(),
  );
});