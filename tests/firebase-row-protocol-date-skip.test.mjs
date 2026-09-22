import assert from "node:assert/strict";
import test from "node:test";

import {createFirebaseRowDocHelpers} from "../src/firebase-row-doc-utils.js";

function makeHelpers(calls){
  return createFirebaseRowDocHelpers({
    applyLatestProtocolDateToRaw:()=>((raw,data)=>{
      calls.push(data);
      return {...raw,"Poslední_kontrola":"2026-09-22"};
    }),
    applySiteEditToRow:()=>row=>row,
    normalizeSiteRows:()=>rawRows=>rawRows.map(raw=>({raw})),
    safeValue:value=>String(value??"").trim()
  });
}

test("Firebase bod bez protokolovych dat preskoci merge posledni kontroly",()=>{
  const calls=[];
  const {firebaseRowFromDocSnap}=makeHelpers(calls);
  const row=firebaseRowFromDocSnap({id:"site-1",data:()=>({raw:{Nazev:"Bod"}})});
  assert.equal(calls.length,0);
  assert.equal(row.raw.Nazev,"Bod");
  assert.equal(row.raw["Poslední_kontrola"],undefined);
});

test("Firebase bod s historii nebo latest datem zachova merge",()=>{
  for(const data of [
    {raw:{Nazev:"Historie"},protocolHistory:[{date:"2026-09-22"}]},
    {raw:{Nazev:"Datum"},latestProtocolDate:"2026-09-22"}
  ]){
    const calls=[];
    const {firebaseRowFromDocSnap}=makeHelpers(calls);
    const row=firebaseRowFromDocSnap({id:"site-2",data:()=>data});
    assert.equal(calls.length,1);
    assert.equal(row.raw["Poslední_kontrola"],"2026-09-22");
  }
});
