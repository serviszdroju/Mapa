const CACHE_VERSION = "astip-szz-v40";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const TILE_CACHE = "astip-szz-map-tiles-v1";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./szz-icon.svg",
  "./szz-icon-192.png",
  "./szz-icon-512.png",
  "./szz-app-icon-192.png",
  "./szz-app-icon-512.png",
  "./szz-logo.png",
  "./szz-logo-display.png",
  "./podpis-tipek.png",
  "./podpis-tipek.jpg"
];

const EXTERNAL_PRECACHE_URLS = [];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cacheUrls(cache, PRECACHE_URLS.concat(EXTERNAL_PRECACHE_URLS)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => ![STATIC_CACHE, RUNTIME_CACHE, TILE_CACHE].includes(key))
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

async function cacheUrls(cache, urls) {
  await Promise.allSettled(urls.map(async (url) => {
    try {
      const request = new Request(url, {cache: "reload"});
      let response = null;
      try {
        response = await fetch(request);
      } catch (error) {
        response = await fetch(new Request(url, {
          cache: "reload",
          mode: isSameOriginUrl(url) ? "same-origin" : "no-cors",
          credentials: isSameOriginUrl(url) ? "same-origin" : "omit"
        }));
      }
      if (response && (response.ok || response.type === "opaque")) {
        await cache.put(request, response.clone());
      }
    } catch (error) {
      console.warn("Offline cache: soubor se nepodařilo uložit", url, error);
    }
  }));
}

function isSameOriginUrl(url) {
  try {
    return new URL(url, self.location.href).origin === self.location.origin;
  } catch (error) {
    return false;
  }
}

async function networkFirst(request, options = {}) {
  const {fallbackToShell = false} = options;
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(new Request(request, {cache: "reload"}));
    if (response && response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (!fallbackToShell) return Response.error();
    return (await caches.match("./")) ||
      (await caches.match("./index.html")) ||
      (await caches.match(new URL("./index.html", self.registration.scope).href)) ||
      Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(isMapTileRequest(request) ? TILE_CACHE : RUNTIME_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then((response) => {
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => cached);
  return cached || network;
}

function isMapTileRequest(request) {
  try {
    const url = new URL(request.url);
    return url.hostname === "tile.openstreetmap.org" && /\/\d+\/\d+\/\d+\.png$/.test(url.pathname);
  } catch (error) {
    return false;
  }
}

function isAppShellRequest(request) {
  try {
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return false;
    return request.destination === "document" ||
      request.destination === "script" ||
      request.destination === "style" ||
      request.destination === "manifest" ||
      /\/(index\.html|manifest\.webmanifest|sw\.js)$/.test(url.pathname);
  } catch (error) {
    return false;
  }
}

self.addEventListener("fetch", (event) => {
  const {request} = event;
  if (request.method !== "GET") return;
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, {fallbackToShell: true}));
    return;
  }
  if (isAppShellRequest(request)) {
    event.respondWith(networkFirst(request, {fallbackToShell: request.destination === "document"}));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});
