import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source=fs.readFileSync(
  new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java",import.meta.url),
  "utf8",
);

test("Android considers only a validated internet connection online",()=>{
  const body=source.match(/private boolean isOnline\(\) \{([\s\S]*?)\n    \}/);
  assert.ok(body);
  assert.match(body[1],/NET_CAPABILITY_INTERNET/);
  assert.match(body[1],/NET_CAPABILITY_VALIDATED/);
});

test("an unvalidated connection keeps the packaged app fallback available",()=>{
  assert.match(source,/if \(isOnline\(\) && !forceLocalAssetFallback\) return null;/);
  assert.match(source,/webView\.setNetworkAvailable\(isOnline\(\)\)/);
  assert.match(source,/WebSettings\.LOAD_CACHE_ELSE_NETWORK/);
  assert.match(source,/openBundledAssetFirst\(uri\)/);
});
