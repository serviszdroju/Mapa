import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const java=fs.readFileSync(
  new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java",import.meta.url),
  "utf8",
);
const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("Android Room counters use the repository executor bridge",()=>{
  assert.match(java,/public void requestCountsJson\(String requestId\)/);
  assert.match(java,/repository\.counts\(new SzzOfflineRepository\.Callback\(\)/);
  assert.match(java,/window\.__szzAndroidCountsResult/);
});

test("web prefers async Android counters and keeps the legacy fallback",()=>{
  const body=main.match(/function readAndroidOfflineCounts\(\)\{([\s\S]*?)\n\}/);
  assert.ok(body);
  assert.match(body[1],/bridge\.requestCountsJson\(requestId\)/);
  assert.match(body[1],/new Promise\(resolve=>/);
  assert.match(body[1],/bridge\.countsJson\(\)/);
});

test("async Android counter requests are bounded by a timeout",()=>{
  assert.match(main,/androidCountsRequests\.delete\(requestId\);\s*resolve\(null\);\s*\},5000\)/);
});
