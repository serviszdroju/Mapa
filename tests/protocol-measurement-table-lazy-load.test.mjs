import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const measurement=fs.readFileSync(new URL("../src/protocol-measurement-table-utils.js",import.meta.url),"utf8");

test("protocol measurement table is excluded from startup and shared by Word and PDF exports",()=>{
  assert.doesNotMatch(main,/from "\.\/protocol-measurement-table-utils\.js"/);
  assert.match(main,/import\("\.\/protocol-measurement-table-utils\.js"\)/);
  assert.match(main,/protocolMeasurementTableSpecPromise=null;\s*throw error;/);
  assert.match(main,/buildProtocolWordEntries[\s\S]*?loadProtocolMeasurementTableSpec\(\)/);
  assert.match(main,/loadProtocolPdfRuntime[\s\S]*?loadProtocolMeasurementTableSpec\(\)/);
});

test("lazy measurement table keeps the complete protocol field layout",()=>{
  for(const field of [
    "batteryCount","capacityAh","setCount","auxBatteryAh","temperature","seal2",
    "inputVac","output1Vac","output2Vac","backup1Vac","backup2Vac",
    "mainBatVdc","resetDiagnostics","auxBatVdc","unbalance1","unbalance2"
  ]) assert.match(measurement,new RegExp(`protocol\\.${field}\\b`));
  assert.match(measurement,/const w=\[1070,1070,1070,1070,1070,1070,1070,1070,1070\]/);
});
