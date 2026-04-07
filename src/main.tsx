import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const setupServiceWorker = () => {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    if (import.meta.env.PROD) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[SW] Registered:", reg.scope))
        .catch((err) => console.warn("[SW] Failed:", err));
      return;
    }

    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));

    if ("caches" in window) {
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys
          .filter((cacheKey) => cacheKey.startsWith("digital-nurse-buddy"))
          .map((cacheKey) => caches.delete(cacheKey)),
      );
    }
  });
};

setupServiceWorker();

createRoot(document.getElementById("root")!).render(<App />);
