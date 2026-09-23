import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("Android APK skips redundant PWA service worker work",()=>{
  const sw=read("src/sw-register.js");
  const shell=read("src/shell-boot.js");
  const cache=read("src/app-shell-cache.js");
  const guard=/document\.documentElement\.classList\.contains\("szz-android-shell"\)/;

  assert.match(sw.match(/function registerSzzServiceWorker\(\)\{([\s\S]*?)\n\}/)?.[1] || "",guard);
  assert.match(shell.match(/async function warmUpSzzPwaInstall\(options=\{\}\)\{([\s\S]*?)\n\}/)?.[1] || "",guard);
  assert.match(cache.match(/async function cacheAppShellForOffline\(options=\{\}\)\{([\s\S]*?)\n  \}/)?.[1] || "",guard);
});
