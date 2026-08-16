const CACHE_VERSION = "astip-szz-v373";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const TILE_CACHE = "astip-szz-map-tiles-v1";
const OFFLINE_SYNC_TAG = "astip-szz-offline-sync";

const PRECACHE_URLS = [
  "./",
  "./index.html",
  "./late.js",
  "./manifest.webmanifest",
  "./szz-icon.svg",
  "./szz-icon-192.png",
  "./szz-icon-512.png",
  "./szz-app-icon-192.png",
  "./szz-app-icon-512.png",
  "./szz-app-icon-maskable-192.png",
  "./szz-app-icon-maskable-512.png",
  "./szz-logo.png",
  "./szz-logo-display.png",
  "./podpis-tipek.png",
  "./podpis-tipek.jpg"
];

const EXTERNAL_PRECACHE_URLS = [
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cacheUrls(cache, PRECACHE_URLS))
      .then(() => { cacheExternalShellUrls(); })
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
  if (event.data && event.data.type === "SZZ_CACHE_APP_SHELL") {
    event.waitUntil(cacheClientShellUrls(event.data.urls, event.ports && event.ports[0]));
  }
});

self.addEventListener("sync", (event) => {
  if (event.tag === OFFLINE_SYNC_TAG) {
    event.waitUntil(notifyClientsToSync("background-sync"));
  }
});

async function notifyClientsToSync(reason) {
  const clientsList = await self.clients.matchAll({type: "window", includeUncontrolled: true});
  await Promise.all(clientsList.map((client) => client.postMessage({
    type: "SZZ_SYNC_REQUEST",
    reason
  })));
}

async function cacheUrls(cache, urls) {
  let index = 0;
  const worker = async () => {
    while (index < urls.length) {
      const url = urls[index++];
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
    }
  };
  await Promise.allSettled(Array.from({length: Math.min(4, urls.length)}, () => worker()));
}

async function cacheExternalShellUrls() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    await cacheUrls(cache, EXTERNAL_PRECACHE_URLS);
  } catch (error) {
    console.warn("Offline cache: externí knihovny se nepodařilo připravit", error);
  }
}

async function cacheClientShellUrls(urls, replyPort) {
  let count = 0;
  try {
    const safeUrls = normalizeClientShellUrls(urls);
    if (safeUrls.length) {
      const cache = await caches.open(STATIC_CACHE);
      await cacheUrls(cache, safeUrls);
      count = safeUrls.length;
    }
    if (replyPort) replyPort.postMessage({type: "SZZ_CACHE_APP_SHELL_DONE", count});
  } catch (error) {
    console.warn("Offline cache: shell aplikace se nepodařilo uložit", error);
    if (replyPort) replyPort.postMessage({type: "SZZ_CACHE_APP_SHELL_DONE", count, error: String(error && error.message || error)});
  }
}

function normalizeClientShellUrls(urls) {
  const unique = [];
  (Array.isArray(urls) ? urls : []).slice(0, 80).forEach((url) => {
    try {
      const parsed = new URL(url, self.registration.scope);
      const normalized = parsed.href;
      if (isClientShellUrl(parsed) && !unique.includes(normalized)) unique.push(normalized);
    } catch (error) {}
  });
  return unique;
}

function isClientShellUrl(url) {
  try {
    const scope = new URL(self.registration.scope);
    if (url.origin === self.location.origin && url.pathname.startsWith(scope.pathname)) {
      return url.pathname.includes("/assets/") ||
        /\/(index\.html|app\.css|late\.js|manifest\.webmanifest|sw\.js|szz-icon(?:-\d+)?\.png|szz-app-icon-\d+\.png|szz-logo(?:-display)?\.png|podpis-tipek\.(?:png|jpg))$/.test(url.pathname) ||
        url.pathname === scope.pathname ||
        url.pathname === `${scope.pathname}index.html`;
    }
    return url.hostname === "unpkg.com" &&
      /^\/leaflet@1\.9\.4\/dist\/leaflet\.(?:css|js)$/.test(url.pathname);
  } catch (error) {
    return false;
  }
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

async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return Response.error();
  }
}

async function cacheFirst(request, cacheName = STATIC_CACHE) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque")) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return Response.error();
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

function timeoutResponse(ms, response) {
  return new Promise((resolve) => setTimeout(() => resolve(response), ms));
}

async function appShellStaleWhileRevalidate(request, options = {}) {
  const {fallbackToShell = false, preferFreshNetwork = false, networkTimeoutMs = 700} = options;
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = (await cache.match(request)) || (fallbackToShell ? await shellFallbackResponse() : null);
  const network = fetch(new Request(request, {cache: "reload"}))
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);
  if (preferFreshNetwork && cached) {
    return (await Promise.race([network, timeoutResponse(networkTimeoutMs, cached)])) || cached || Response.error();
  }
  return cached || network || Response.error();
}

async function shellFallbackResponse() {
  return (await caches.match("./")) ||
    (await caches.match("./index.html")) ||
    (await caches.match(new URL("./index.html", self.registration.scope).href)) ||
    null;
}

function isMapTileRequest(request) {
  try {
    const url = new URL(request.url);
    return url.hostname === "tile.openstreetmap.org" && /\/\d+\/\d+\/\d+\.png$/.test(url.pathname);
  } catch (error) {
    return false;
  }
}

function isFirebaseOrAuthRequest(request) {
  try {
    const url = new URL(request.url);
    const host = url.hostname;
    return host === "accounts.google.com" ||
      host === "apis.google.com" ||
      host === "oauth2.googleapis.com" ||
      host === "securetoken.googleapis.com" ||
      host === "identitytoolkit.googleapis.com" ||
      host === "firestore.googleapis.com" ||
      host === "firebase.googleapis.com" ||
      host === "firebaseinstallations.googleapis.com" ||
      host === "firebasestorage.googleapis.com" ||
      host.endsWith(".googleapis.com") && /\/(google\.firestore|identitytoolkit|securetoken)\//.test(url.pathname);
  } catch (error) {
    return false;
  }
}

function isRuntimeCacheAllowed(request) {
  try {
    const url = new URL(request.url);
    if (url.origin === self.location.origin) return true;
    if (isMapTileRequest(request)) return true;
    if (url.hostname === "unpkg.com" && ["script", "style"].includes(request.destination)) return true;
    if (url.hostname === "www.gstatic.com" && ["script", "style", "font"].includes(request.destination)) return true;
    if (url.hostname === "res.cloudinary.com" && request.destination === "image") return true;
    return request.destination === "image";
  } catch (error) {
    return false;
  }
}

function isStaticAssetRequest(request) {
  try {
    const url = new URL(request.url);
    if (url.origin === self.location.origin) {
      return request.destination !== "document" && (
        url.pathname.includes("/assets/") ||
        /\/(late\.js|manifest\.webmanifest|szz-icon(?:-\d+)?\.png|szz-app-icon-\d+\.png|szz-logo(?:-display)?\.png|podpis-tipek\.(?:png|jpg))$/.test(url.pathname)
      );
    }
    return url.hostname === "unpkg.com" &&
      /^\/leaflet@1\.9\.4\/dist\/leaflet\.(?:css|js)$/.test(url.pathname);
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
    event.respondWith(appShellStaleWhileRevalidate(request, {
      fallbackToShell: true,
      preferFreshNetwork: true,
      networkTimeoutMs: 700
    }));
    return;
  }
  if (isStaticAssetRequest(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (isAppShellRequest(request)) {
    if (request.destination === "document") {
      event.respondWith(appShellStaleWhileRevalidate(request, {fallbackToShell: true}));
      return;
    }
    event.respondWith(networkFirst(request, {fallbackToShell: request.destination === "document"}));
    return;
  }
  if (isFirebaseOrAuthRequest(request) || !isRuntimeCacheAllowed(request)) {
    event.respondWith(networkOnly(request));
    return;
  }
  event.respondWith(staleWhileRevalidate(request));
});
