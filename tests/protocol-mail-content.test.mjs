import assert from "node:assert/strict";
import test from "node:test";

import { createProtocolMailContentHelpers } from "../src/protocol-mail-content-utils.js";

test("protocol mail content keeps the existing subject and body fields",()=>{
  const helpers=createProtocolMailContentHelpers({
    currentUserEmail:()=>"jan.soldan@astip.cz",
    getCurrentUser:()=>({displayName:"Jan Soldan"}),
    getSelectedSite:()=>({adresa:"Záložní adresa",zdroj:"Záložní zdroj"}),
    normalizeTechnicianDisplayName:value=>String(value || "").trim(),
    protocolDisplayDate:value=>value==="2026-09-23" ? "23. 9. 2026" : "",
    safe:value=>String(value ?? "").trim()
  });

  assert.equal(
    helpers.protocolMailSubject(),
    "Protokol zkoušky provozuschopnosti záložního zdroje"
  );
  assert.equal(
    helpers.protocolMailBody({
      date:"2026-09-23",
      place:"Hodonín, Třída bratří Čapků",
      deviceType:"ASTIP UPS",
      technician:"Jiný technik"
    },"protokol.docx"),
    [
      "Dobrý den,",
      "",
      "v příloze posílám vyexportovaný protokol.",
      "",
      "Datum kontroly: 23. 9. 2026",
      "Místo: Hodonín, Třída bratří Čapků",
      "Zařízení: ASTIP UPS",
      "Soubor: protokol.docx",
      "",
      "S pozdravem",
      "Jan Soldan",
      "",
      "Servis záložních zdrojů s.r.o.",
      "IČ: 09391126  DIČ: CZ09391126",
      "sídlo: Božetěchova 3003/133, 612 00 Brno, Česká republika"
    ].join("\n")
  );
});
