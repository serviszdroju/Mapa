import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const helper=await import("../src/protocol-check-text-utils.js");

test("protocol check-text formatting is excluded from startup and shared by Word and PDF",()=>{
  assert.doesNotMatch(main,/from "\.\/protocol-check-text-utils\.js"/);
  assert.match(main,/import\("\.\/protocol-check-text-utils\.js"\)/);
  assert.match(main,/protocolCheckTextHelpersPromise=null;\s*throw error;/);
  assert.match(main,/buildProtocolWordEntries[\s\S]*?loadProtocolCheckTextHelpers\(\)/);
  assert.match(main,/loadProtocolPdfRuntime[\s\S]*?loadProtocolCheckTextHelpers\(\)/);
});

test("lazy check-text helper keeps checkbox labels and condition details",()=>{
  const helpers=helper.createProtocolCheckTextHelpers({
    safe:value=>String(value || ""),
    simpleNorm:value=>String(value || "").trim().toLowerCase()
  });
  assert.equal(helpers.protocolPeriodText({period:"6 měsíců"}),"☒ 6 měsíců / ☐ 12 měsíců");
  assert.equal(helpers.protocolConditionsText({conditions:"ne",conditionsReason:"Vadná baterie"}),"☐ ano / ☒ ne\nOdůvodnění: Vadná baterie");
  assert.match(helpers.protocolBackedDevicesText({backedDevices:{lift:true}}),/^☒ Výtah/);
  assert.match(helpers.protocolAccessText({access:{helmet:true}}),/☒ helma/);
  assert.match(helpers.protocolAvailabilityText({availability:{wcOk:true}}),/^WC ☒ Ok \/ ☐ Nok/);
});
