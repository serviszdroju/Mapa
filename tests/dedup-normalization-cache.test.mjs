import test from "node:test";
import assert from "node:assert/strict";

import { dedupNormCache } from "../src/core-utils.js";
import { siteDedupValue } from "../src/site-labels.js";
import { siteDedupKeysFromRaw } from "../src/row-dedup-utils.js";

test("deduplikační normalizace udrží celý mapový průchod v omezené cache",()=>{
  dedupNormCache.clear();
  assert.equal(siteDedupValue("Česká republika, Žďár nad Sázavou"),"zdar nad sazavou");

  for(let i=0;i<6500;i++) siteDedupValue(`Jedinečné místo ${i}`);

  assert.equal(dedupNormCache.size,6000);
  assert.equal(dedupNormCache.has("Jedinečné místo 0"),false);
  assert.equal(dedupNormCache.has("Jedinečné místo 6499"),true);
});

test("deduplikační klíče zůstanou správné mezi novými kopiemi a po změně pole",()=>{
  const raw={
    "Název":"Žďár nad Sázavou 1",
    "Adresa / umístění":"Žďár nad Sázavou 1",
    "Popis_zdroje":"ASTIP 20 kVA",
    "Výrobní číslo":"ABC-123"
  };
  const first=siteDedupKeysFromRaw(raw);
  const second=siteDedupKeysFromRaw({...raw});
  assert.deepEqual(second,first);

  const changed=siteDedupKeysFromRaw({...raw,"Výrobní číslo":"XYZ-987"});
  assert.notDeepEqual(changed,first);
});
