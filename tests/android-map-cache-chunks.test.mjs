import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main = fs.readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const late = fs.readFileSync(new URL("../public/late.js", import.meta.url), "utf8");
const activity = fs.readFileSync(new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java", import.meta.url), "utf8");
const repository = fs.readFileSync(new URL("../android/app/src/main/java/cz/astip/serviszdroju/offline/SzzOfflineRepository.java", import.meta.url), "utf8");

test("Android mapa sdili asynchronni blokove cteni Room cache", () => {
  assert.match(main, /window\.requestAndroidCachedSitesItems=limit=>requestAndroidCachedSitesItems\(window\.SzzAndroidOffline,limit\)/);
  assert.match(main, /requestCachedSitesJsonChunks\(limit,200,requestId\)/);
  assert.match(late, /await window\.requestAndroidCachedSitesItems\(20000\)/);
  assert.match(late, /rowsFromMapRowsCacheItems\(chunkedAndroidItems\)/);
});

test("Android zahreje Room cache bodu soubezne se startem WebView", () => {
  const repositoryReady = activity.indexOf("offlineRepository = SzzOfflineRepository.get(this)");
  const prewarm = activity.indexOf("offlineRepository.prewarmCachedSites()", repositoryReady);
  const webViewStart = activity.indexOf("createAndAttachWebView(savedInstanceState)", prewarm);

  assert.ok(repositoryReady >= 0 && prewarm > repositoryReady && webViewStart > prewarm);
  assert.match(repository, /public void prewarmCachedSites\(\) \{\s*executor\.execute\(\(\) -> \{/);
  assert.match(repository, /dao\.cachedSiteRawJson\(20000\)/);
});

test("synchronni Android cache zustava jen jako kompatibilni fallback", () => {
  const chunked = late.indexOf('typeof window.requestAndroidCachedSitesItems==="function"');
  const synchronous = late.indexOf("const androidRows=readMapRowsCacheAndroid()", chunked);
  const indexedDb = late.indexOf("const indexed=await readMapRowsCacheIndexedDb()", synchronous);

  assert.ok(chunked >= 0 && synchronous > chunked && indexedDb > synchronous);
});
