import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("browser file helpers are excluded from startup",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createBrowserFileHelpers[^}]*\}/m);
  assert.match(main,/import\("\.\/browser-file-utils\.js"\)/);
  assert.match(main,/fileHelpers\.downloadBlobFile\(prepared\.fileName,prepared\.blob\)/);
});

test("browser file helpers share one retryable lazy instance",()=>{
  assert.match(main,/if\(!browserFileHelpersPromise\)/);
  assert.match(main,/browserFileHelpersPromise=null;\s*throw error;/);
  assert.match(main,/blobToBase64:fileHelpers\.blobToBase64/);
  assert.match(main,/drawImageContained:fileHelpers\.drawImageContained/);
  assert.match(main,/loadDataUrlImage:fileHelpers\.loadDataUrlImage/);
  assert.match(main,/protocolPdfFileNameFromWord:fileHelpers\.protocolPdfFileNameFromWord/);
});
