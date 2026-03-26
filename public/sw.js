const CACHE_NAME = "digital-nurse-buddy-v2";
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

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const appShellResponse = await fetch("/", { cache: "no-store" });

      await Promise.all(
        APP_ROUTES.map(async (route) => {
          await cache.put(route, appShellResponse.clone());
        })
      );

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
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);
  if (NETWORK_ONLY_DOMAINS.some((domain) => url.hostname.includes(domain))) {
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
        if (
          networkResponse.status === 200 &&
          (networkResponse.type === "basic" || networkResponse.type === "cors")
        ) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        if (event.request.mode === "navigate") {
          const fallbackResponse = await caches.match(OFFLINE_FALLBACK_ROUTE);
          if (fallbackResponse) {
            return fallbackResponse;
          }
        }
        const fallbackResponse = await caches.match(OFFLINE_FALLBACK_ROUTE);
        return fallbackResponse || Response.error();
      }
    })()
  );
});
