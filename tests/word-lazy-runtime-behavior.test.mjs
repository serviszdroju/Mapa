import assert from "node:assert/strict";
import test from "node:test";

import {createProtocolWordDocumentHelpers} from "../src/protocol-word-document-utils.js";
import {createProtocolWordSignatureHelpers} from "../src/protocol-word-signature-utils.js";
import {createProtocolWordXmlHelpers} from "../src/protocol-word-xml-utils.js";

test("lazy Word runtime builds the unchanged document entries",()=>{
  const protocolExportValue=value=>String(value ?? "");
  const xml=createProtocolWordXmlHelpers({protocolExportValue});
  const signatures=createProtocolWordSignatureHelpers({
    protocolSignatureImageBytes:()=>null,
    protocolTechnicianDisplayName:()=>"Technik Test",
    protocolTechnicianSignatureImageBytes:()=>null,
    safe:value=>String(value ?? ""),
    wordParagraph:xml.wordParagraph,
    wordParagraphXml:xml.wordParagraphXml,
    wordTable:xml.wordTable,
    wordXmlEscape:xml.wordXmlEscape
  });
  const document=createProtocolWordDocumentHelpers({
    getCurrentUser:()=>({email:"technik@astip.cz"}),
    getSelectedSite:()=>({adresa:"Testovací 1",zdroj:"UPS"}),
    protocolAccessText:()=>"bez omezení",
    protocolAvailabilityText:()=>"dostupné",
    protocolBackedDevicesText:()=>"PBZ",
    protocolConditionsText:()=>"ano",
    protocolDisplayDate:()=>"23. 9. 2026",
    protocolMeasurementTableSpec:()=>({rows:[[{text:"Vstup"}]],widths:[9630]}),
    protocolPeriodText:()=>"12 měsíců",
    protocolSignatureImageBytes:()=>null,
    protocolSourceStateLabel:()=>"V pořádku",
    protocolSourceStateValue:()=>"ok",
    protocolSourceTestMethodLabel:()=>"test",
    protocolTechnicianSignatureImageBytes:()=>null,
    wordBlank:xml.wordBlank,
    wordFormField:xml.wordFormField,
    wordFormGrid:xml.wordFormGrid,
    wordParagraph:xml.wordParagraph,
    wordParagraphXml:xml.wordParagraphXml,
    wordRun:xml.wordRun,
    wordSignatureGrid:signatures.wordSignatureGrid,
    wordTable:xml.wordTable,
    wordXmlEscape:xml.wordXmlEscape
  });

  const entries=document.buildProtocolWordEntries({
    siteName:"Testovací 1",
    deviceType:"UPS & baterie",
    serial:"123",
    clientSign:"Jan Test"
  });
  const byName=new Map(entries.map(entry=>[entry.name,entry.data]));
  assert.ok(byName.has("word/document.xml"));
  assert.ok(byName.has("word/styles.xml"));
  assert.match(byName.get("word/document.xml"),/UPS &amp; baterie/);
  assert.match(byName.get("word/document.xml"),/Technik Test/);
  assert.match(byName.get("word/styles.xml"),/Times New Roman/);
});
