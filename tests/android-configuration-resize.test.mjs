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
