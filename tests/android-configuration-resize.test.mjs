import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source=fs.readFileSync(new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java",import.meta.url),"utf8");

test("Android ignores delayed resize work from an older rotation",()=>{
  assert.match(source,/final int resizeGeneration = \+\+configurationResizeGeneration;/);
  assert.match(source,/configurationResizeGeneration != resizeGeneration/);
});

test("destroyed Android activity invalidates pending resize work",()=>{
  const destroyBody=source.match(/protected void onDestroy\(\) \{([\s\S]*?)super\.onDestroy\(\);/);
  assert.ok(destroyBody);
  assert.match(destroyBody[1],/configurationResizeGeneration\+\+;/);
});

test("Android publishes current configuration dimensions to CSS after rotation",()=>{
  assert.match(source,/updateAndroidViewportCss\(newConfig\);/);
  assert.match(source,/--szz-android-viewport-height/);
  const css=fs.readFileSync(new URL("../css/responsive-final.css",import.meta.url),"utf8");
  assert.match(css,/html\.szz-android-shell \.app\{[\s\S]*?var\(--szz-android-viewport-height,100dvh\)/);
  assert.match(css,/html\.szz-android-shell #map\{\s*height:100% !important;/);
});

test("Android rotation coalesces WebView resize without forced layout storms",()=>{
  assert.match(source,/CONFIGURATION_RESIZE_DELAY_MS = 180L/);
  assert.doesNotMatch(source,/CONFIGURATION_RESIZE_DELAYS_MS/);
  const changeBody=source.match(/public void onConfigurationChanged\(Configuration newConfig\) \{([\s\S]*?)\n    \}/);
  assert.ok(changeBody);
  assert.doesNotMatch(changeBody[1],/requestLayout|\.invalidate\(/);
  assert.match(changeBody[1],/postConfigurationResize\(CONFIGURATION_RESIZE_DELAY_MS, resizeGeneration\)/);
  const delayedBody=source.match(/private void postConfigurationResize\([\s\S]*?\{([\s\S]*?)\n    \}\n\n    @Override/);
  assert.ok(delayedBody);
  assert.equal((delayedBody[1].match(/requestLayout\(/g)||[]).length,1);
  assert.doesNotMatch(delayedBody[1],/\.invalidate\(/);
  assert.match(delayedBody[1],/target\.setLayoutParams\(new FrameLayout\.LayoutParams/);
  assert.match(delayedBody[1],/target\.postOnAnimation/);
  assert.match(delayedBody[1],/window\.dispatchEvent\(new Event\('resize'\)\)/);
});

test("Android requests use one complete bundled web shell",()=>{
  const body=source.match(/private WebResourceResponse localApkAssetResponse\(Uri uri\) \{([\s\S]*?)\n    \}/);
  assert.ok(body);
  const bundledAt=body[1].indexOf("openBundledAssetFirst(uri)");
  assert.ok(bundledAt>=0);
  assert.doesNotMatch(body[1],/isOnline\(\).*return null/);
  assert.match(body[1],/return isDocumentRequest\(uri\) \? openAssetResponse\(SZZ_ASSET_ROOT \+ "\/index\.html"\) : null;/);
});
