import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("official document data helpers are excluded from map startup",()=>{
  assert.doesNotMatch(main,/createOfficialProtocolDataHelpers[\s\S]*?from "\.\/official-protocol-data-utils\.js"/);
  assert.match(main,/import\("\.\/official-protocol-data-utils\.js"\)/);
  assert.match(main,/if\(!officialProtocolDataHelpersPromise\)/);
  assert.match(main,/officialProtocolDataHelpersPromise=null;\s*throw error;/);
});

test("document actions wait for the shared lazy helper",()=>{
  assert.match(main,/async function saveOfficialProtocolData\(\.\.\.args\)\{[\s\S]*?helpers\.saveOfficialProtocolData\(\.\.\.args\)/);
  assert.match(main,/async function protocolForOfficialDocument\(\.\.\.args\)\{[\s\S]*?helpers\.protocolForOfficialDocument\(\.\.\.args\)/);
  assert.match(main,/const data=await saveOfficialProtocolData\(\{silent:true\}\)/);
  assert.match(main,/const protocol=await protocolForOfficialDocument\(\)/);
});

test("history editing keeps a synchronous selected protocol lookup",()=>{
  assert.match(main,/function selectedHistoryProtocol\(\)\{\s*const current=detailHistoryItems\[detailHistoryIndex\];/);
  assert.match(main,/return isProtocolHistoryItem\(current\) \? current : null;/);
});
