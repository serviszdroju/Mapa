import assert from "node:assert/strict";
import test from "node:test";
import {createProtocolHandoffHelpers} from "../src/protocol-handoff-utils.js";

function makeStorage(){
  const data=new Map();
  return {
    getItem(key){
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key,value){
      data.set(String(key),String(value));
    },
    removeItem(key){
      data.delete(String(key));
    },
    clear(){
      data.clear();
    }
  };
}

function helpers(){
  globalThis.localStorage=makeStorage();
  return createProtocolHandoffHelpers({
    currentUserEmail:()=>"iva@astip.cz",
    getSelectedSite:()=>({id:"site-1"}),
    selectedSiteDocId:()=>"doc-1",
    serverTimestamp:()=>"SERVER_TIME",
    storageKey:"test:handoff"
  });
}

test("processed protocols are shown as handed off in detail",()=>{
  const h=helpers();
  assert.equal(h.protocolHandoffForProcessing({processed:true}),true);
  assert.equal(h.protocolHandoffForProcessing({processed:"ano"}),true);
  assert.equal(h.protocolHandoffForProcessing({processedAt:"2026-08-30T12:00:00.000Z"}),true);
});

test("red or stop protocols are shown as handed off in detail",()=>{
  const h=helpers();
  assert.equal(h.protocolHandoffForProcessing({sourceState:"stop"}),true);
  assert.equal(h.protocolHandoffForProcessing({result:"Neprovozuschopné"}),true);
  assert.equal(h.protocolHandoffForProcessing({conditionsReason:"závada baterie"}),true);
});

test("manual handoff value can still uncheck an automatic state",()=>{
  const h=helpers();
  assert.equal(h.protocolHandoffForProcessing({processed:true,handoffForProcessing:false}),false);
  assert.equal(h.protocolHandoffForProcessing({sourceState:"stop",processingHandoff:"ne"}),false);
});

test("remembered manual override has priority",()=>{
  const h=helpers();
  h.rememberProtocolHandoffOverride("protocol-1",false,{_id:"protocol-1"});
  assert.equal(h.protocolHandoffForProcessing({_id:"protocol-1",processed:true}),false);
  h.rememberProtocolHandoffOverride("protocol-1",true,{_id:"protocol-1"});
  assert.equal(h.protocolHandoffForProcessing({_id:"protocol-1"}),true);
});
