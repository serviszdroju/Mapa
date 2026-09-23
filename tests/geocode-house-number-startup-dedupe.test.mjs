import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const geocode=fs.readFileSync(new URL("../src/geocode-utils.js",import.meta.url),"utf8");

test("house-number extraction stays in lazy geocoding and is absent from startup imports",()=>{
  assert.doesNotMatch(main,/from "\.\/geocode-house-number-utils\.js"/);
  assert.doesNotMatch(main,/\bgeocodeRequestedHouseNumbers,\s*\n\s*inferControlPeriodMonthsFromDateValues/);
  assert.match(geocode,/from "\.\/geocode-house-number-utils\.js"/);
  assert.match(geocode,/const requestedNumbers=geocodeRequestedHouseNumbers\(sourceAddress\)/);
  assert.match(geocode,/const numbers=geocodeRequestedHouseNumbers\(address\)/);
});
