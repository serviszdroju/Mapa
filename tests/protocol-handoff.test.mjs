import test from "node:test";
import assert from "node:assert/strict";
import { createProtocolHandoffHelpers } from "../src/protocol-handoff-utils.js";

function createStorage(){
  const data=new Map();
  globalThis.localStorage={
    getItem:key=>data.has(key) ? data.get(key) : null,
    setItem:(key,value)=>data.set(key,String(value)),
    removeItem:key=>data.delete(key)
  };
  return data;
}

function helpers(){
  createStorage();
  return createProtocolHandoffHelpers({
    currentUserEmail:()=>"ivi@astip.cz",
    selectedSiteDocId:()=>"site-1",
    storageKey:"test:handoff"
  });
}

test("processed protocols are handed off automatically",()=>{
  const h=helpers();
  assert.equal(h.protocolProcessedForHandoff({processed:true}),true);
  assert.equal(h.protocolHandoffForProcessing({processed:"ano"}),true);
  assert.equal(h.protocolHandoffForProcessing({processedAt:"2026-08-30T10:00:00Z"}),true);
});

test("red and stop protocol states are handed off automatically",()=>{
  const h=helpers();
  assert.equal(h.protocolLooksRedForHandoff({workflowState:"cervena"}),true);
  assert.equal(h.protocolHandoffForProcessing({sourceStatus:"Stop Stav"}),true);
  assert.equal(h.protocolHandoffForProcessing({conditionsReason:"nevyhovujici stav"}),true);
  assert.equal(h.protocolHandoffForProcessing({issues:"zavada baterie"}),true);
});

test("manual false handoff fields can uncheck automatic state",()=>{
  const h=helpers();
  assert.equal(h.protocolHandoffForProcessing({
    handoffForProcessing:false,
    processed:true,
    workflowState:"cervena"
  }),false);
  assert.equal(h.protocolHandoffForProcessing({
    processingHandoff:"ne",
    sourceStatus:"Stop Stav"
  }),false);
});

test("remembered handoff override has priority",()=>{
  const h=helpers();
  const item={_id:"protocol-1",processed:true};
  h.rememberProtocolHandoffOverride(item._id,false,item);
  assert.equal(h.protocolHandoffForProcessing(item),false);
  h.rememberProtocolHandoffOverride(item._id,true,item);
  assert.equal(h.protocolHandoffForProcessing(item),true);
});
