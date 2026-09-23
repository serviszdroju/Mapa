import assert from "node:assert/strict";
import test from "node:test";

import {createProtocolFileExportHelpers} from "../src/protocol-file-export-utils.js";

test("PDF export awaits the lazy byte writer before creating the Blob",async()=>{
  const expected="%PDF-1.4\n% lazy writer\n%%EOF";
  const helpers=createProtocolFileExportHelpers({
    blobToBase64:async()=>"",
    buildPdfFromJpegPages:async pages=>{
      assert.equal(pages.length,1);
      await Promise.resolve();
      return new TextEncoder().encode(expected);
    },
    buildProtocolWordBlob:async()=>new Blob(),
    downloadBlobFile:()=>{},
    enrichProtocolWithTechnicianSignature:async protocol=>protocol,
    ensureMailFunctions:async()=>false,
    getFbFnMod:()=>null,
    getFirebaseReady:()=>false,
    getMailFunctions:()=>null,
    getSelectedSite:()=>({adresa:"Test"}),
    normalizeProtocolTechnicianFields:protocol=>protocol,
    protocolExportDatePart:()=>"01-01-2026",
    protocolMailBody:()=>"",
    protocolMailSubject:()=>"",
    protocolPdfFileNameFromWord:name=>name.replace(/\.docx$/,".pdf"),
    protocolTechnicianDisplayName:()=>"",
    protocolTechnicianSignatureImageBytes:()=>null,
    protocolWordFileNamePart:value=>String(value),
    renderProtocolPdfPageCanvases:async()=>[{dataUrl:"data:image/jpeg;base64,AA==",width:1,height:1}],
    safe:value=>String(value || ""),
    setProtocolStatusText:()=>{},
    showSaveConfirmation:()=>{},
    validProtocolMailRecipient:()=>true
  });

  const blob=await helpers.buildProtocolPdfBlob({siteName:"Test"});
  assert.equal(blob.type,"application/pdf");
  assert.equal(await blob.text(),expected);
});
