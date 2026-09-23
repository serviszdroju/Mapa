import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("technician signature tools load only when first used",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createTechnicianSignatureHelpers[^}]*\}\s*from\s*["']\.\/technician-signature-utils\.js["']/m);
  assert.match(main,/technicianSignatureHelpersPromise=import\("\.\/technician-signature-utils\.js"\)/);
  assert.match(main,/helpers\.enrichProtocolWithTechnicianSignature\(protocol\)/);
  assert.match(main,/helpers\.openTechnicianSignatureDialog\(\)/);
});

test("signature helper import is shared and can retry after failure",()=>{
  assert.match(main,/if\(!technicianSignatureHelpersPromise\)/);
  assert.match(main,/technicianSignatureHelpersPromise=null;\s*throw error;/);
  assert.match(main,/window\.openTechnicianSignatureDialog=openTechnicianSignatureDialog/);
});
