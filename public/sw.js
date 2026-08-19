const CACHE = "chalupa-manager-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/pwa-icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Neřešíme POST, PUT, DELETE atd.
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Pouze naše vlastní doména
  if (url.origin !== self.location.origin) {
    return;
  }

  /*
   * NAVIGACE
   *
   * Vždy nejdříve zkusíme aktuální aplikaci ze serveru.
   * Pokud server vrátí 404 nebo jinou chybu,
   * použijeme index.html.
   */
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            return response;
          }

          return caches.match("/index.html");
        })
        .catch(() => {
          return caches.match("/index.html");
        })
    );

    return;
  }

  /*
   * STATICKÉ ASSETY
   *
   * Cacheujeme pouze soubory z /assets/.
   * Firestore ani ostatní API se tímto Service Workerem
   * necacheují.
   */
  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((response) => {
          if (!response.ok) {
            return response;
          }

          const responseToCache = response.clone();

          caches
            .open(CACHE)
            .then((cache) => cache.put(request, responseToCache))
            .catch(() => {});

          return response;
        });
      })
    );
  }
});