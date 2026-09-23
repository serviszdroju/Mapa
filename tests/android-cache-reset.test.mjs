import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const activitySource=fs.readFileSync(new URL(
  "../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java",
  import.meta.url
),"utf8");

test("aktualizace Android aplikace zachova offline mapove dlazdice",()=>{
  const purgeStart=activitySource.indexOf("private void purgeServiceWorkerCaches");
  const purgeEnd=activitySource.indexOf("private boolean handleUrl",purgeStart);
  assert.ok(purgeStart>=0 && purgeEnd>purgeStart,"cache reset musi byt v MainActivity");
  const purgeSource=activitySource.slice(purgeStart,purgeEnd);
  assert.match(purgeSource,/key!==['\"]astip-szz-map-tiles-v1['\"]/);
  assert.match(purgeSource,/caches\.delete\(key\)/);
  assert.doesNotMatch(purgeSource,/location\.replace|loadUrl/);
});

test("aktualizace Android aplikace neobnovi stranku behem prace",()=>{
  const pageFinished=activitySource.match(/public void onPageFinished\([\s\S]*?\n            \}/)?.[0] || "";
  assert.match(pageFinished,/purgeServiceWorkerCaches\(view\)/);
  assert.match(pageFinished,/injectAndroidBootstrap\(\)/);
  assert.doesNotMatch(pageFinished,/purgeServiceWorkerCaches\(view\);\s*return;/);
});

test("aktualizace APK nemaze Google a Firebase HTTP cache",()=>{
  assert.doesNotMatch(activitySource,/\.clearCache\(true\)/);
  assert.match(activitySource,/pendingWebCacheReset = shouldResetWebCacheForBuild\(\)/);
  assert.match(activitySource,/purgeServiceWorkerCaches\(view\)/);
});
