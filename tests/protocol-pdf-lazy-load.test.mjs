import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("PDF renderer is loaded only when a PDF is requested",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createProtocolPdfRenderHelpers[^}]*\}\s*from\s*["']\.\/protocol-pdf-render-utils\.js["']/m);
  assert.doesNotMatch(main,/^import\s*\{[^}]*createPdfByteWriterHelpers[^}]*\}\s*from\s*["']\.\/pdf-byte-writer-utils\.js["']/m);
  assert.match(main,/import\("\.\/protocol-pdf-render-utils\.js"\)/);
  assert.match(main,/import\("\.\/pdf-byte-writer-utils\.js"\)/);
  assert.match(main,/const runtime=await loadProtocolPdfRuntime\(\)/);
  assert.match(main,/return runtime\.renderProtocolPdfPageCanvases\(protocol,options\)/);
  assert.match(main,/return runtime\.buildPdfFromJpegPages\(pages\)/);
});

test("failed lazy PDF imports can be retried",()=>{
  assert.match(main,/protocolPdfRuntimePromise=null;\s*throw error;/);
});
