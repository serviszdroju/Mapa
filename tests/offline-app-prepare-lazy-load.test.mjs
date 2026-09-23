import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const controls=fs.readFileSync(new URL("../src/offline-app-controls-utils.js",import.meta.url),"utf8");

test("offline app preparation loads only on the first manual prepare action",()=>{
  assert.doesNotMatch(main,/from "\.\/offline-app-prepare-utils\.js"/);
  assert.match(main,/import\("\.\/offline-app-prepare-utils\.js"\)/);
  assert.match(main,/async function prepareSzzOfflineAppData\(options=\{\}\)[\s\S]*?await loadOfflineAppPrepareHelpers\(\)/);
  assert.match(main,/offlineAppPrepareHelpersPromise=null;\s*throw error;/);
});

test("offline preparation controls and public action remain available at startup",()=>{
  assert.match(main,/window\.prepareSzzOfflineAppData=prepareSzzOfflineAppData/);
  assert.match(main,/createOfflineAppControlsHelpers\(\{[\s\S]*?prepareSzzOfflineAppData,/);
  assert.match(controls,/prepareBtn\.addEventListener\("click",\(\)=>prepareSzzOfflineAppData/);
  assert.match(controls,/forceFullBtn\.addEventListener\("click",\(\)=>prepareSzzOfflineAppData/);
});
