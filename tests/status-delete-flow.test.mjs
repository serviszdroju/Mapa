import test from "node:test";
import assert from "node:assert/strict";
import {
  clearOrderedRepairStatusRaw
} from "../src/map-status-raw-patch-utils.js";
import {
  orderedFlagFromRaw,
  repairOrderFlagFromRaw,
  stopFlagFromRaw
} from "../src/map-status.js";
import {
  createFirebaseLoadReportHelpers
} from "../src/firebase-load-report-utils.js";
import {
  dedupeSiteRows,
  siteDedupKeysFromRaw
} from "../src/row-dedup-utils.js";

test("ulozeni protokolu zrusi objednanou kontrolu i objednanou opravu, ale ne stop stav",()=>{
  const raw={
    "Kontrola objednaná":"ANO",
    "Objednaná oprava":"ANO",
    "Stop Stav":"ANO",
    "Stav pro mapu":"Objednaná oprava",
    "Barva bodu":"#2563eb"
  };
  clearOrderedRepairStatusRaw(raw);
  assert.equal(orderedFlagFromRaw(raw),false);
  assert.equal(repairOrderFlagFromRaw(raw),false);
  assert.equal(stopFlagFromRaw(raw),true);
  assert.equal(raw["Kontrola objednaná"],"NE");
  assert.equal(raw["Objednaná oprava"],"NE");
  assert.equal(raw["Stop Stav"],"ANO");
});

test("smazany Firebase bod se schova podle doc id aliasu",()=>{
  const deletedSiteIds=new Set(["firebase-doc-1"]);
  const helpers=createFirebaseLoadReportHelpers({
    getDeletedSiteIds:()=>deletedSiteIds,
    getDeletedSiteRecords:()=>[],
    getRows:()=>[],
    siteDedupKeysFromRaw,
    setLastFirebaseLoadReport:()=>{}
  });
  assert.equal(helpers.isFirebaseRowHidden({
    id:"other-visible-id",
    firebaseDocId:"firebase-doc-1",
    raw:{"Firebase_doc_id":"firebase-doc-1"}
  }),true);
});

test("smazany Firebase bod se schova podle ulozenych dedup klicu",()=>{
  const raw={
    "Název":"Hartmanice, Chlum 27",
    "Adresa / umístění":"Hartmanice, Chlum 27",
    "Popis_zdroje":"ASTIP STRONG 7500VA/3f - 30 minut",
    "Výrobní číslo":"15021201"
  };
  const helpers=createFirebaseLoadReportHelpers({
    getDeletedSiteIds:()=>new Set(),
    getDeletedSiteRecords:()=>[{
      id:"old-id",
      dedupKeys:siteDedupKeysFromRaw(raw)
    }],
    getRows:()=>[],
    siteDedupKeysFromRaw,
    setLastFirebaseLoadReport:()=>{}
  });
  assert.equal(helpers.isFirebaseRowHidden({
    id:"new-id-from-reload",
    firebaseDocId:"another-firebase-doc",
    raw:{...raw,"Firebase_doc_id":"another-firebase-doc"}
  }),true);
});

test("deduplikace spoji stejnou adresu a vyrobni cislo i pri jinem zapisu vykonu",()=>{
  const first={
    id:"stop-copy",
    firebaseDocId:"doc-stop",
    raw:{
      "Název":"Chlum 27, Hartmanice",
      "Adresa / umístění":"Chlum 27, Hartmanice",
      "Popis_zdroje":"ASTIP STRONG 7,5kVA/3f-30minut",
      "Výrobní číslo":"15021201"
    }
  };
  const second={
    id:"ordered-copy",
    firebaseDocId:"doc-ordered",
    raw:{
      "Název":"Hartmanice, Chlum 27",
      "Adresa / umístění":"Hartmanice, Chlum 27",
      "Popis_zdroje":"ASTIP STRONG 7500VA/3f - 30 minut",
      "Výrobní číslo":"15021201"
    }
  };
  const result=dedupeSiteRows([first,second]);
  assert.equal(result.rows.length,1);
  assert.equal(result.duplicateDocIds.length,1);
});
