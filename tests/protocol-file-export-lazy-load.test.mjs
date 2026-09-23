import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("protocol file export orchestration is excluded from startup",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createProtocolFileExportHelpers[^}]*\}/m);
  assert.match(main,/import\("\.\/protocol-file-export-utils\.js"\)/);
  assert.match(main,/async function exportProtocolToWord\(\.\.\.args\)/);
  assert.match(main,/async function sendProtocolByMail\(\.\.\.args\)/);
});

test("protocol mail content composition is excluded from startup",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createProtocolMailContentHelpers[^}]*\}/m);
  assert.match(main,/import\("\.\/protocol-mail-content-utils\.js"\)/);
  assert.doesNotMatch(main,/v příloze posílám vyexportovaný protokol/);
});

test("protocol file export runtime is shared and retries import failures",()=>{
  assert.match(main,/if\(!protocolFileExportHelpersPromise\)/);
  assert.match(main,/protocolFileExportHelpersPromise=null;\s*throw error;/);
  assert.match(main,/helpers\.exportProtocolToWord\(\.\.\.args\)/);
  assert.match(main,/helpers\.sendProtocolByMail\(\.\.\.args\)/);
});

test("Word import failures keep the existing visible error",()=>{
  assert.match(main,/Načtení Word exportu protokolu selhalo/);
  assert.match(main,/setProtocolStatusText\("Export do Wordu se nepodařil\."\)/);
  assert.match(main,/showSaveConfirmation\("Export do Wordu se nepodařil\."\)/);
});
