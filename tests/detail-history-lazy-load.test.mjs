import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("detail protocol history renderer is excluded from startup imports",()=>{
  assert.doesNotMatch(main,/from "\.\/detail-history-view-utils\.js"/);
  assert.match(main,/import\("\.\/detail-history-view-utils\.js"\)/);
  assert.match(main,/async function renderHistory\(\)/);
  assert.match(main,/return helpers\.renderHistory\(\)/);
});

test("detail history action binding loads together with the lazy renderer",()=>{
  assert.doesNotMatch(main,/from "\.\/detail-history-actions-utils\.js"/);
  assert.match(main,/import\("\.\/detail-history-actions-utils\.js"\)/);
  assert.match(main,/if\(!detailHistoryActionsHelpersPromise\)/);
  assert.match(main,/detailHistoryActionsHelpersPromise=null;\s*throw error;/);
  assert.match(main,/Promise\.all\(\[\s*import\("\.\/detail-history-view-utils\.js"\),\s*loadDetailHistoryActionsHelpers\(\)/);
});

test("detail history renderer shares one load and retries failures",()=>{
  assert.match(main,/if\(!detailHistoryViewHelpersPromise\)/);
  assert.match(main,/detailHistoryViewHelpersPromise=null;\s*throw error;/);
  assert.match(main,/Historii protokolů se nepodařilo zobrazit\. Zkus záložku otevřít znovu\./);
});

test("detail history mutations and actions remain wired through the lazy factory",()=>{
  assert.match(main,/setDetailHistoryProtocolHandoff:\(item,checked\)=>setDetailHistoryProtocolHandoff\(item,checked\)/);
  assert.match(main,/deleteCurrentHistoryProtocol/);
  assert.match(main,/exportProtocolToWord/);
  assert.match(main,/sendProtocolByMail/);
  assert.match(main,/openTechnicianSignatureDialog/);
});
