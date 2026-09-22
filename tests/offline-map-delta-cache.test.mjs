import test from "node:test";
import assert from "node:assert/strict";

import { createOfflineMapDeltaSyncHelpers } from "../src/offline-map-delta-sync-utils.js";

test("delta sync refreshes the authoritative cache even with zero changed rows",async()=>{
  let cacheWrites=0;
  const {syncOfflineMapRowDeltas}=createOfflineMapDeltaSyncHelpers({
    cacheCurrentRowsForOffline:()=>{ cacheWrites++; },
    getDb:()=>({}),
    getFsMod:()=>({collection:()=>({})}),
    isFirebaseReady:()=>true,
    isOnline:()=>true,
    readFirestoreDocsUpdatedSince:async()=>{},
    runWhenIdle:callback=>callback(),
    waitForFirebaseUser:async()=>({email:"technik@astip.cz"})
  });
  const changed=await syncOfflineMapRowDeltas(Date.now()-60_000,{background:true});
  assert.deepEqual(changed,[]);
  assert.equal(cacheWrites,1);
});

test("delta sync still caches once after applying changed rows",async()=>{
  let cacheWrites=0;
  let applied=0;
  const {syncOfflineMapRowDeltas}=createOfflineMapDeltaSyncHelpers({
    cacheCurrentRowsForOffline:()=>{ cacheWrites++; },
    getDb:()=>({}),
    getFsMod:()=>({collection:()=>({})}),
    isFirebaseReady:()=>true,
    isOnline:()=>true,
    readFirestoreDocsUpdatedSince:async(_factory,_fields,_since,onDoc)=>onDoc({id:"site-1"}),
    rowFromDocSnap:doc=>({firebaseDocId:doc.id}),
    runWhenIdle:callback=>callback(),
    upsertChangedRows:async rows=>{ applied=rows.length; },
    waitForFirebaseUser:async()=>({email:"technik@astip.cz"})
  });
  const changed=await syncOfflineMapRowDeltas(Date.now()-60_000,{background:true});
  assert.equal(changed.length,1);
  assert.equal(applied,1);
  assert.equal(cacheWrites,1);
});
