import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const viteConfig=fs.readFileSync(new URL("../vite.config.mjs",import.meta.url),"utf8");
const androidBuild=fs.readFileSync(new URL("../scripts/prepare-android-web-assets.mjs",import.meta.url),"utf8");

test("production HTML uses the public display and sidebar logo files",()=>{
  assert.match(viteConfig,/szz-logo-display/);
  assert.match(viteConfig,/src="\.\/szz-logo-display\.png"/);
  assert.match(viteConfig,/szz-logo-sidebar/);
  assert.match(viteConfig,/src="\.\/szz-logo-sidebar\.png"/);
});

test("orphan hashed logo copies are removed after the Vite build",()=>{
  assert.match(viteConfig,/\^szz-logo-\(\?:display\|sidebar\)/);
  assert.match(viteConfig,/rmSync\(path\.join\(assetDir,file\)\)/);
});

test("legacy duplicate logos are not copied into the Android APK",()=>{
  assert.match(androidBuild,/relativePath === "assets\/fzz-logo\.png"/);
  assert.match(androidBuild,/relativePath === "szz-logo\.png"/);
});
