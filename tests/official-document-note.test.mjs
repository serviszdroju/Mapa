import test from "node:test";
import assert from "node:assert/strict";
import { createOfficialRtfTemplateHelpers } from "../src/official-rtf-template-utils.js";

test("poznamka pro zakaznika je ve funkcnim dokladu pouze jednou",()=>{
  const helpers=createOfficialRtfTemplateHelpers({
    OFFICIAL_CONTROL_SUBJECT_TEXT:"",
    addOfficialRtfSignatures:output=>output,
    addOfficialRtfWatermark:output=>output,
    compactOfficialRtfMeasurementSection:output=>output,
    officialManufacturerText:()=>"",
    officialMultiline:()=>[],
    officialOneLine:value=>String(value || ""),
    officialOperatorLines:()=>[],
    officialProtocolCustomerNote:protocol=>protocol.customerNote || "",
    officialProtocolTemplateValues:()=>({"__SZZ_NOTE__":""}),
    officialRtfEscape:value=>String(value || ""),
    safe:value=>String(value || "")
  });
  const note="Testovaci poznamka zakaznika";
  const output=helpers.fillOfficialRtfTemplate(
    "Pozn\\'e1mky: __SZZ_NOTE__ podpisy",
    {customerNote:note},
    {},
    "ok"
  );

  assert.equal(output.includes("__SZZ_NOTE__"),false);
  assert.equal(output.split(note).length-1,1);
  assert.match(output,/\\highlight7/);
});
