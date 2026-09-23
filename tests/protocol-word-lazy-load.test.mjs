import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("protocol Word document content is loaded only for export",()=>{
  const main=read("src/main.js");
  assert.doesNotMatch(main,/^import\s*\{[^}]*createProtocolWordDocumentHelpers[^}]*\}\s*from\s*["']\.\/protocol-word-document-utils\.js["']/m);
  assert.doesNotMatch(main,/^import\s*\{[^}]*(?:createProtocolWordXmlHelpers|createProtocolWordSignatureHelpers)[^}]*\}/m);
  assert.match(main,/import\("\.\/protocol-word-document-utils\.js"\)/);
  assert.match(main,/import\("\.\/protocol-word-xml-utils\.js"\)/);
  assert.match(main,/import\("\.\/protocol-word-signature-utils\.js"\)/);
  assert.match(main,/return helpers\.buildProtocolWordEntries\(protocol\)/);
  assert.match(main,/protocolWordRuntimePromise=null;\s*throw error;/);
});

test("DOCX blob waits for lazy Word entries",()=>{
  const blob=read("src/protocol-word-blob-utils.js");
  assert.match(blob,/buildDocxBlob\(await buildProtocolWordEntries\(protocol\)\)/);
});

test("protocol document keeps the unchanged Word styles inside its lazy chunk",()=>{
  const document=read("src/protocol-word-document-utils.js");
  const main=read("src/main.js");
  assert.match(document,/import \{buildProtocolWordStylesXml\} from "\.\/protocol-word-styles-utils\.js"/);
  assert.doesNotMatch(main,/import \{buildProtocolWordStylesXml\} from "\.\/protocol-word-styles-utils\.js"/);
});
