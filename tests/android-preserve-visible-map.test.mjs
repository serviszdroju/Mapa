import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("Android auth restore preserves an already visible Room-backed map",()=>{
  const body=source.match(/async function loadFirebaseRowsAfterAuthInner\(reason="auth"\)\{([\s\S]*?)\n  \}/)?.[1] || "";
  const preserveAt=body.indexOf("window.__szzAndroidFastCacheRowsLoaded || isAndroidShellRuntime()");
  const cacheOnlyAt=body.indexOf("offlineCacheOnly:true");
  assert.ok(preserveAt>=0,"Android shell guard must be present");
  assert.ok(cacheOnlyAt>preserveAt,"visible Android rows must be preserved before cache-only Firebase reads");
  assert.match(body,/syncFirebaseRowsDeltaAfterAuth\(reason\)/,"online changes must still synchronize in the background");
});
