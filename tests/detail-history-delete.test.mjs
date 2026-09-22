import test from "node:test";
import assert from "node:assert/strict";

import { APP_PROTOCOL_DELETE_EMAILS } from "../src/app-options.js";
import { createDetailHistoryDeleteHelpers } from "../src/detail-history-delete-utils.js";
import { isProtocolHistoryItem } from "../src/protocol-export-utils.js";

test("Iva has explicit permission to delete protocols",()=>{
  const allowed=new Set(APP_PROTOCOL_DELETE_EMAILS.map(email=>email.toLowerCase()));
  assert.equal(allowed.has("iva.glozova@astip.cz"),true);
});

test("legacy protocol collection uses the same delete classification as the detail button",async()=>{
  const deleted=[];
  const helpers=createDetailHistoryDeleteHelpers({
    detailHistoryNode:()=>null,
    getCurrentHistoryItem:()=>({_id:"legacy-1",_collection:"siteProtocols"}),
    getDb:()=>({}),
    getFsMod:()=>({
      doc:(...parts)=>parts.join("/"),
      deleteDoc:async ref=>{ deleted.push(ref); },
      setDoc:async()=>{},
      serverTimestamp:()=>"now"
    }),
    getSelectedSite:()=>null,
    isHistoryAdmin:()=>true,
    isProtocolHistoryItem,
    loadHistory:async()=>{},
    removeSiteLocalItem:()=>{},
    selectedSiteDocId:()=>"",
    showSaveConfirmation:()=>{}
  });
  const previousConfirm=globalThis.confirm;
  globalThis.confirm=()=>true;
  try{
    await helpers.deleteCurrentHistoryProtocol();
  }finally{
    globalThis.confirm=previousConfirm;
  }
  assert.deepEqual(deleted,["[object Object]/protocols/legacy-1"]);
});
