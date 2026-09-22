import test from "node:test";
import assert from "node:assert/strict";

import { get } from "../src/core-utils.js";
import { explicitWatchSelfFromRaw } from "../src/map-status.js";

test("přesný klíč přidaný po prvním čtení obejde normalizovanou cache",()=>{
  const raw={Název:"Bod"};
  assert.equal(get(raw,"kontakt"),"");
  raw.Kontakt="603 123 456";
  assert.equal(get(raw,"Kontakt"),"603 123 456");
});

test("normalizovaná cache nepoužije odstraněný klíč",()=>{
  const raw={" Kontakt ":"původní"};
  assert.equal(get(raw,"kontakt"),"původní");
  delete raw[" Kontakt "];
  raw.KONTAKT="nový";
  assert.equal(get(raw,"kontakt"),"nový");
});

test("stav hlídání zachytí nově doplněný kanonický alias",()=>{
  const raw={Název:"Bod"};
  assert.equal(explicitWatchSelfFromRaw(raw),null);
  raw["Hlídáme sami termín"]="ano";
  assert.equal(explicitWatchSelfFromRaw(raw),true);
});
