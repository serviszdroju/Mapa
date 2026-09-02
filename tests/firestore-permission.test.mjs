import test from "node:test";
import assert from "node:assert/strict";
import {
  isFirestorePermissionDenied,
  readFirestoreArrayContainsAny,
  readFirestoreEqualsAny
} from "../src/firestore-query-utils.js";
import {
  createFirestoreDeltaHelpers
} from "../src/firestore-delta-utils.js";

test("Firestore permission-denied chyba se rozpozna podle code i textu",()=>{
  assert.equal(isFirestorePermissionDenied({code:"permission-denied"}),true);
  assert.equal(isFirestorePermissionDenied({message:"Missing or insufficient permissions."}),true);
  assert.equal(isFirestorePermissionDenied({code:"unavailable",message:"Network unavailable"}),false);
});

test("permission-denied ve fallback dotazech se neloguje jako varovani",async()=>{
  const originalWarn=console.warn;
  const warns=[];
  console.warn=(...args)=>warns.push(args);
  const fsMod={
    collection:()=>({}),
    query:()=>({}),
    where:()=>({}),
    getDocs:async()=>{ throw {code:"permission-denied"}; }
  };
  try{
    assert.equal(await readFirestoreArrayContainsAny(fsMod,{},"protocols","siteKeys",["site-1"],()=>{}),false);
    assert.equal(await readFirestoreEqualsAny(fsMod,{},"protocols","siteId",["site-1"],()=>{}),false);
  }finally{
    console.warn=originalWarn;
  }
  assert.deepEqual(warns,[]);
});

test("permission-denied v rozdilovem cteni se neloguje jako varovani",async()=>{
  const originalWarn=console.warn;
  const warns=[];
  console.warn=(...args)=>warns.push(args);
  const helpers=createFirestoreDeltaHelpers({
    getDb:()=>({}),
    getFsMod:()=>({
      query:()=>({}),
      where:()=>({}),
      getDocs:async()=>{ throw {code:"permission-denied"}; }
    }),
    isFirebaseReady:()=>true,
    isOnline:()=>true,
    isPermissionDenied:isFirestorePermissionDenied,
    runBoundedFirestoreTasks:async tasks=>{ for(const task of tasks) await task(); }
  });
  try{
    const count=await helpers.readFirestoreDocsUpdatedSince(()=>({}),["updatedAt"],Date.now(),()=>{});
    assert.equal(count,0);
  }finally{
    console.warn=originalWarn;
  }
  assert.deepEqual(warns,[]);
});
