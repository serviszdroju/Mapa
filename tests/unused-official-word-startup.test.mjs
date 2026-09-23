import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("unused alternative official Word builder is excluded from startup",()=>{
  assert.doesNotMatch(main,/createOfficialProtocolWordDocumentHelpers/);
  assert.doesNotMatch(main,/official-protocol-word-document-utils\.js/);
  assert.doesNotMatch(main,/buildOfficialProtocolWordEntries/);
});

test("official document export keeps the lazy RTF template pipeline",()=>{
  assert.match(main,/import\("\.\/official-protocol-text-utils\.js"\)/);
  assert.match(main,/import\("\.\/official-protocol-file-name-utils\.js"\)/);
  assert.match(main,/import\("\.\/official-rtf-asset-utils\.js"\)/);
  assert.match(main,/import\("\.\/official-rtf-template-utils\.js"\)/);
  assert.match(main,/import\("\.\/official-rtf-export-utils\.js"\)/);
  assert.match(main,/async function exportOfficialProtocol\(mode="ok"\)/);
});
