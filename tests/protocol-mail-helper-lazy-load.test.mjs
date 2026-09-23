import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const actions=fs.readFileSync(new URL("../src/detail-history-actions-utils.js",import.meta.url),"utf8");
const helper=await import("../src/protocol-mail-utils.js");

test("protocol mail helper is excluded from startup and shared by every mail path",()=>{
  assert.doesNotMatch(main,/from "\.\/protocol-mail-utils\.js"/);
  assert.match(main,/import\("\.\/protocol-mail-utils\.js"\)/);
  assert.match(main,/protocolMailHelpersPromise=null;\s*throw error;/);
  assert.match(main,/loadProtocolFileExportHelpers[\s\S]*?loadProtocolMailHelpers\(\)/);
  assert.match(main,/const recipient=await promptProtocolMailRecipient\(payload\)/);
  assert.match(actions,/const recipient=await promptProtocolMailRecipient\(getCurrentHistoryItem\(\)\)/);
});

test("lazy mail helper keeps validation and Firebase error translations",()=>{
  const helpers=helper.createProtocolMailHelpers({
    safe:value=>value && typeof value==="object" ? String(value.message || "") : String(value || "")
  });
  assert.equal(helpers.validProtocolMailRecipient("technik@astip.cz"),true);
  assert.equal(helpers.validProtocolMailRecipient("spatny-email"),false);
  assert.equal(
    helpers.protocolMailErrorText({code:"functions/unauthenticated"}),
    "Nejdřív se znovu přihlaš přes Google účtem @astip.cz."
  );
  assert.match(helpers.protocolMailErrorText({code:"functions/resource-exhausted"}),/moc velká/);
});
