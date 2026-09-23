import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source=fs.readFileSync(
  new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java",import.meta.url),
  "utf8"
);

test("WebView configuration reuses one connectivity sample",()=>{
  const body=source.match(/private void configureWebView\(\) \{([\s\S]*?)\n    \}/)?.[1] || "";
  assert.equal((body.match(/isOnline\(\)/g) || []).length,1);
  assert.match(body,/boolean online = isOnline\(\)/);
  assert.match(body,/applyWebViewNetworkAvailability\(online\)/);
  assert.match(body,/settings\.setCacheMode\(online \?/);
  assert.match(body,/setCacheMode\(online \?/);
});

test("bundled asset responses reuse extension and immutable headers",()=>{
  const body=source.match(/private WebResourceResponse openAssetResponse\(String assetPath\) \{([\s\S]*?)\n    \}/)?.[1] || "";
  assert.match(source,/SZZ_ASSET_RESPONSE_HEADERS\s*=\s*\n\s*Collections\.singletonMap\("Cache-Control", "no-store"\)/);
  assert.match(body,/String extension = assetExtension\(assetPath\)/);
  assert.match(body,/mimeTypeForExtension\(extension\)/);
  assert.match(body,/charsetForExtension\(extension\)/);
  assert.match(body,/SZZ_ASSET_RESPONSE_HEADERS/);
  assert.doesNotMatch(body,/Collections\.singletonMap/);
});
