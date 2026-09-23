import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("main protocol history view loads only on authorized opening",()=>{
  assert.doesNotMatch(main,/from "\.\/main-protocol-history-view-utils\.js"/);
  assert.match(main,/import\("\.\/main-protocol-history-view-utils\.js"\)/);
  assert.match(main,/viewHelpers=await loadMainProtocolHistoryViewHelpers\(\)/);
  assert.match(main,/if\(!canViewMainProtocolHistory\(\)\)[\s\S]*?return;[\s\S]*?loadMainProtocolHistoryViewHelpers\(\)/);
});

test("history view shares its initialized instance and retries import failure",()=>{
  assert.match(main,/if\(mainProtocolHistoryViewHelpers\) return Promise\.resolve\(mainProtocolHistoryViewHelpers\)/);
  assert.match(main,/if\(!mainProtocolHistoryViewHelpersPromise\)/);
  assert.match(main,/mainProtocolHistoryViewHelpersPromise=null;\s*throw error;/);
});

test("history data and processing remain in the main app",()=>{
  assert.match(main,/async function loadMainProtocolHistoryItems\(\)/);
  assert.match(main,/setMainProtocolHistoryProcessed:\(item,checked\)=>setMainProtocolHistoryProcessed\(item,checked\)/);
  assert.match(main,/getMainProtocolHistoryTechnicianFilter:\(\)=>mainProtocolHistoryTechnicianFilter/);
  assert.match(main,/viewHelpers\.bindMainProtocolHistoryControlsDom\(shell\)/);
});
