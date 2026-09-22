import test from "node:test";
import assert from "node:assert/strict";

import { createFirebaseRowDocHelpers } from "../src/firebase-row-doc-utils.js";

test("Firebase řádek sdílí jednu kanonickou kopii raw dat",()=>{
  const helpers=createFirebaseRowDocHelpers({
    applyLatestProtocolDateToRaw:()=>raw=>({...raw,"Poslední_kontrola":"2026-09-01"}),
    applySiteEditToRow:()=>row=>row,
    normalizeSiteRows:()=>rawRows=>rawRows.map(raw=>({raw,lat:49,lon:15})),
    safeValue:value=>String(value ?? "").trim()
  });
  const sourceRaw={Název:"Testovací bod",GPS_lat:"49",GPS_lon:"15"};
  const row=helpers.firebaseRowFromDocSnap({
    id:"site-1",
    data:()=>({raw:sourceRaw,latestProtocolDate:"2026-09-01",protocolRefs:["protocol-1"]})
  });
  assert.equal(row.firebaseData.raw,row.raw);
  assert.notEqual(row.raw,sourceRaw);
  assert.equal(row.firebaseData.latestProtocolDate,"2026-09-01");
  assert.deepEqual(row.firebaseData.protocolRefs,["protocol-1"]);
  assert.equal(row.raw.Firebase_doc_id,"site-1");
});
