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

test("every connection state keeps the packaged app shell available",()=>{
  assert.doesNotMatch(source,/if \(isOnline\(\) && !forceLocalAssetFallback\) return null;/);
  assert.match(source,/boolean online = isOnline\(\)/);
  assert.match(source,/applyWebViewNetworkAvailability\(online\)/);
  assert.match(source,/WebSettings\.LOAD_CACHE_ELSE_NETWORK/);
  assert.match(source,/openBundledAssetFirst\(uri\)/);
});

test("Android forwards validated connectivity changes to WebView once per state",()=>{
  assert.match(source,/registerDefaultNetworkCallback\(networkCallback\)/);
  assert.match(source,/onCapabilitiesChanged\(Network network, NetworkCapabilities capabilities\)/);
  assert.match(source,/Boolean\.valueOf\(online\)\.equals\(webViewNetworkAvailable\)/);
  assert.match(source,/target\.setNetworkAvailable\(online\)/);
  assert.match(source,/unregisterNetworkCallback\(callback\)/);
});

test("network observer does not trigger or alter authentication",()=>{
  const observer=source.match(/private void registerNetworkObserver\(\) \{([\s\S]*?)\n    \}\n\n    private void unregisterNetworkObserver/);
  assert.ok(observer);
  assert.doesNotMatch(observer[1],/restoreAndroidAuth|startGoogleSignIn|signOut/);
});
