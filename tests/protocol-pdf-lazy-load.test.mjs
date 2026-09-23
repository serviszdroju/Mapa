import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("PDF renderer is loaded only when a PDF is requested",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createProtocolPdfRenderHelpers[^}]*\}\s*from\s*["']\.\/protocol-pdf-render-utils\.js["']/m);
  assert.match(main,/protocolPdfRendererPromise=import\("\.\/protocol-pdf-render-utils\.js"\)/);
  assert.match(main,/const renderer=await protocolPdfRendererPromise/);
  assert.match(main,/return renderer\(protocol,options\)/);
});

test("failed lazy PDF imports can be retried",()=>{
  assert.match(main,/protocolPdfRendererPromise=null;\s*throw error;/);
});
