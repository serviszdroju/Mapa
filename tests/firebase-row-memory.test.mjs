import test from "node:test";
import assert from "node:assert/strict";

import { createFirebaseRowDocHelpers } from "../src/firebase-row-doc-utils.js";

test("Firebase řádek sdílí jednu kanonickou kopii raw dat",()=>{
  let mergedInput=null;
  const helpers=createFirebaseRowDocHelpers({
    applyLatestProtocolDateToRaw:()=>raw=>{
      mergedInput=raw;
      return {...raw,"Poslední_kontrola":"2026-09-01"};
    },
    applySiteEditToRow:()=>row=>row,
    normalizeSiteRows:()=>rawRows=>rawRows.map(raw=>({raw,lat:49,lon:15})),
    safeValue:value=>String(value ?? "").trim()
  });
  const sourceRaw={Název:"Testovací bod",GPS_lat:"49",GPS_lon:"15"};
  const row=helpers.firebaseRowFromDocSnap({
    id:"site-1",
    data:()=>({raw:sourceRaw,latestProtocolDate:"2026-09-01",protocolRefs:["protocol-1"]})
  });
  assert.equal(mergedInput,sourceRaw);
  assert.equal(row.firebaseData.raw,row.raw);
  assert.notEqual(row.raw,sourceRaw);
  assert.equal(sourceRaw.Firebase_doc_id,undefined);
  assert.equal(row.firebaseData.latestProtocolDate,"2026-09-01");
  assert.deepEqual(row.firebaseData.protocolRefs,["protocol-1"]);
  assert.equal(row.raw.Firebase_doc_id,"site-1");
});

test("Firebase mapovy radek odlozi velke detailove kolekce do otevreni detailu",()=>{
  const helpers=createFirebaseRowDocHelpers({
    applyLatestProtocolDateToRaw:()=>raw=>raw,
    applySiteEditToRow:()=>row=>row,
    normalizeSiteRows:()=>rawRows=>rawRows.map(raw=>({raw}))
  });
  const row=helpers.firebaseRowFromDocSnap({
    id:"site-heavy",
    data:()=>({
      raw:{Název:"Velký bod"},
      latestProtocolDate:"2026-09-02",
      dedupKeys:["site:heavy"],
      attachments:[{dataUrl:"large-attachment"}],
      photos:[{dataUrl:"large-photo"}],
      protocolHistory:[{notes:"large-protocol"}],
      serviceHistory:[{notes:"large-service"}],
      sitePhotosEmbedded:[{url:"large-legacy-photo"}],
      sitePhotoRefs:[{url:"large-legacy-ref"}]
    })
  });

  assert.equal(row.firebaseData.raw,row.raw);
  assert.equal(row.firebaseData.latestProtocolDate,"2026-09-02");
  assert.deepEqual(row.firebaseData.dedupKeys,["site:heavy"]);
  for(const key of ["attachments","photos","protocolHistory","serviceHistory","sitePhotosEmbedded","sitePhotoRefs"]){
    assert.equal(Object.hasOwn(row.firebaseData,key),false,key);
  }
});

test("Firebase radek po zavreni detailu uvolni znovu nactene velke kolekce",()=>{
  const helpers=createFirebaseRowDocHelpers();
  const raw={Název:"Bod"};
  const row={
    raw,
    firebaseData:{
      raw,
      latestProtocolDate:"2026-09-02",
      dedupKeys:["site:one"],
      attachments:[{dataUrl:"attachment"}],
      photos:[{dataUrl:"photo"}],
      protocolHistory:[{notes:"protocol"}]
    }
  };

  assert.equal(helpers.releaseRowDetailData(row),true);
  assert.deepEqual(row.firebaseData,{raw,latestProtocolDate:"2026-09-02",dedupKeys:["site:one"]});
  assert.equal(helpers.releaseRowDetailData(row),false);
});

test("Firebase řádek obranně zkopíruje raw, když merge vrátí vstup",()=>{
  const helpers=createFirebaseRowDocHelpers({
    applyLatestProtocolDateToRaw:()=>raw=>raw,
    applySiteEditToRow:()=>row=>row,
    normalizeSiteRows:()=>rawRows=>rawRows.map(raw=>({raw})),
    safeValue:value=>String(value ?? "").trim()
  });
  const sourceRaw={Název:"Testovací bod"};
  const row=helpers.firebaseRowFromDocSnap({
    id:"site-2",
    data:()=>({raw:sourceRaw,latestProtocolDate:"2026-09-01"})
  });
  assert.notEqual(row.raw,sourceRaw);
  assert.equal(sourceRaw.Firebase_doc_id,undefined);
  assert.equal(row.raw.Firebase_doc_id,"site-2");
});
