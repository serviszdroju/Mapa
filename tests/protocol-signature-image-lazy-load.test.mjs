import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const helper=await import("../src/protocol-signature-image-utils.js");

test("protocol signature image helpers are excluded from startup and shared by every export path",()=>{
  assert.doesNotMatch(main,/from "\.\/protocol-signature-image-utils\.js"/);
  assert.match(main,/import\("\.\/protocol-signature-image-utils\.js"\)/);
  assert.match(main,/protocolSignatureImageHelpersPromise=null;\s*throw error;/);
  for(const loader of [
    "buildProtocolWordEntries","loadOfficialRtfExportHelpers","loadProtocolPdfRuntime",
    "loadTechnicianSignatureHelpers","loadProtocolFileExportHelpers"
  ]) assert.match(main,new RegExp(`${loader}[\\s\\S]*?loadProtocolSignatureImageHelpers\\(\\)`));
});

test("lazy signature helper keeps PNG validation and byte conversion",()=>{
  const helpers=helper.createProtocolSignatureImageHelpers({safe:value=>String(value || "")});
  const png="data:image/png;base64,AQID";
  assert.deepEqual(Array.from(helpers.protocolSignatureImageBytes({clientSignatureDataUrl:png})),[1,2,3]);
  assert.deepEqual(Array.from(helpers.protocolTechnicianSignatureImageBytes({techSignatureDataUrl:png})),[1,2,3]);
  assert.equal(helpers.protocolSignatureImageBytes({clientSignatureDataUrl:"data:image/jpeg;base64,AQID"}),null);
});
