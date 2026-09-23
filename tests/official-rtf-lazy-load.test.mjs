import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("official RTF pipeline loads only for document export",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createOfficialRtf(?:Asset|Template|Export)Helpers[^}]*\}/m);
  assert.match(main,/import\("\.\/official-rtf-asset-utils\.js"\)/);
  assert.match(main,/import\("\.\/official-rtf-template-utils\.js"\)/);
  assert.match(main,/import\("\.\/official-rtf-export-utils\.js"\)/);
  assert.match(main,/helpers\.preparedOfficialProtocolExport\(protocol,officialData,mode\)/);
});

test("official RTF lazy pipeline shares one instance and retries failures",()=>{
  assert.match(main,/if\(!officialRtfExportHelpersPromise\)/);
  assert.match(main,/officialRtfExportHelpersPromise=null;\s*throw error;/);
  assert.match(main,/preparedOfficialProtocolExport\(protocol,data,mode\)/);
});

test("official RTF templates and assets remain unchanged",()=>{
  assert.match(main,/OFFICIAL_RTF_TEMPLATE_URL="official-template\.rtf"/);
  assert.match(main,/OFFICIAL_STOP_RTF_TEMPLATE_URL="official-stop-template\.rtf"/);
  assert.match(main,/OFFICIAL_TIPEK_SIGNATURE_URL="\.\/podpis-tipek\.png"/);
  assert.match(main,/OFFICIAL_WATERMARK_LOGO_URL="\.\/szz-logo-display\.png"/);
});
