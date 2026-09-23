import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const sitesBuild=fs.readFileSync(new URL("../scripts/prepare-sites-build.mjs",import.meta.url),"utf8");
const androidBuild=fs.readFileSync(new URL("../scripts/prepare-android-web-assets.mjs",import.meta.url),"utf8");

test("unused map fallback is excluded from critical service-worker precache",()=>{
  assert.match(sitesBuild,/excludedPrecacheAssetNames = new Set\(\["map-fallback\.jpg"\]\)/);
  assert.match(sitesBuild,/!excludedPrecacheAssetNames\.has\(file\)/);
});

test("unused map fallback is excluded from packaged Android assets",()=>{
  assert.match(androidBuild,/relativePath === "assets\/map-fallback\.jpg"/);
  assert.match(androidBuild,/excludes: \["downloads\/\*\.apk", "assets\/map-fallback\.jpg"\]/);
});
