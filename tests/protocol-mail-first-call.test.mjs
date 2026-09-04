import assert from "node:assert/strict";
import {test} from "node:test";
import {createProtocolFileExportHelpers} from "../src/protocol-file-export-utils.js";

test("sendProtocolByMail waits for lazy Firebase Functions before first callable use", async () => {
  let functionsReady=false;
  let callablePayload=null;
  const helpers=createProtocolFileExportHelpers({
    blobToBase64:async blob=>Buffer.from(await blob.arrayBuffer()).toString("base64"),
    buildPdfFromJpegPages:()=>new TextEncoder().encode("%PDF-1.4\n% first mail test\n%%EOF"),
    buildProtocolWordBlob:async()=>new Blob(["docx"],{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"}),
    downloadBlobFile:()=>{},
    enrichProtocolWithTechnicianSignature:async protocol=>protocol,
    ensureMailFunctions:async()=>{
      functionsReady=true;
      return true;
    },
    getFbFnMod:()=>functionsReady ? {
      httpsCallable:()=>async payload=>{
        callablePayload=payload;
        return {data:{ok:true}};
      }
    } : null,
    getFirebaseReady:()=>true,
    getMailFunctions:()=>functionsReady ? {region:"europe-west1"} : null,
    getSelectedSite:()=>({adresa:"Testovací bod",zdroj:"ASTIP STRONG"}),
    normalizeProtocolTechnicianFields:protocol=>protocol,
    protocolExportDatePart:()=>"2026-09-04",
    protocolMailBody:()=>"Test body",
    protocolMailSubject:()=>"Test subject",
    protocolPdfFileNameFromWord:name=>name.replace(/\.docx$/i,".pdf"),
    protocolTechnicianDisplayName:()=>"Jan Soldan",
    protocolTechnicianSignatureImageBytes:()=>new Uint8Array([1]),
    protocolWordFileNamePart:()=>"test",
    renderProtocolPdfPageCanvases:async()=>[{width:1,height:1}],
    safe:value=>String(value ?? "").trim(),
    setProtocolStatusText:()=>{},
    showSaveConfirmation:()=>{},
    validProtocolMailRecipient:email=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
  });

  await helpers.sendProtocolByMail({
    deviceType:"ASTIP STRONG",
    technicianEmail:"jan.soldan@astip.cz",
    technicianSignatureDataUrl:"data:image/png;base64,AA=="
  },"test@example.com");

  assert.equal(functionsReady,true);
  assert.ok(callablePayload);
  assert.equal(callablePayload.recipientEmail,"test@example.com");
  assert.equal(callablePayload.contentType,"application/pdf");
});
