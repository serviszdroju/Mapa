import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const helper=fs.readFileSync(new URL("../src/offline-map-tile-cache-utils.js",import.meta.url),"utf8");

test("offline map tile worker loads only on the first manual cache action",()=>{
  assert.doesNotMatch(main,/from "\.\/offline-map-tile-cache-utils\.js"/);
  assert.match(main,/import\("\.\/offline-map-tile-cache-utils\.js"\)/);
  assert.match(main,/async function cacheVisibleMapTiles\(\)[\s\S]*?await loadOfflineMapTileCacheHelpers\(\)/);
  assert.match(main,/offlineMapTileCacheHelpersPromise=null;\s*throw error;/);
});

test("offline map controls and public actions remain available at startup",()=>{
  assert.match(main,/document\.addEventListener\("DOMContentLoaded",bindOfflineMapCacheButton\)/);
  assert.match(main,/window\.cacheVisibleMapTiles=cacheVisibleMapTiles/);
  assert.match(main,/window\.cacheCzechOfflineMap=cacheCzechOfflineMap/);
  assert.match(helper,/await Promise\.all\(Array\.from\(\{length:Math\.min\(6,unique\.length\)\}/);
});
