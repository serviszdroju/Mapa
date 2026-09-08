import test from "node:test";
import assert from "node:assert/strict";
import { createMainProtocolHistoryViewHelpers } from "../src/main-protocol-history-view-utils.js";

const baseHelpers={
  historyDateLabel:item=>item.checkDate || "",
  historySavedDateLabel:item=>item.savedAt || "",
  isMainProtocolProcessed:item=>item.processed === true,
  mainProtocolControlDateIso:item=>item.checkDate || "",
  mainProtocolHistoryItemOwnedByCurrentUser:item=>item.createdBy==="technik-a@astip.cz",
  mainProtocolWorkflowLabel:()=>"nepředáno ke zpracování",
  mainProtocolWorkflowState:()=>"idle",
  protocolGlobalHistoryTitle:item=>item.title || "Protokol",
  protocolSourceStateLabel:item=>item.sourceState || "",
  protocolSourceTestMethodLabel:value=>value || "",
  protocolTimeValue:()=>""
};

const items=[
  {_id:"1",title:"A",checkDate:"2026-09-01",createdBy:"technik-a@astip.cz"},
  {_id:"2",title:"B",checkDate:"2026-09-01",createdBy:"technik-b@astip.cz"},
  {_id:"3",title:"C",checkDate:"2026-09-02",technicianEmail:"technik-c@astip.cz"}
];

test("admin muze filtrovat hlavni historii protokolu podle technika",()=>{
  const helpers=createMainProtocolHistoryViewHelpers({
    ...baseHelpers,
    canViewAllMainProtocolHistory:()=>true
  });

  const options=helpers.mainProtocolHistoryTechnicianOptions(items);
  assert.deepEqual(options.map(option=>option.label),[
    "technik-a@astip.cz",
    "technik-b@astip.cz",
    "technik-c@astip.cz"
  ]);

  const visible=helpers.mainProtocolHistoryVisibleRows(items,"","technik-b@astip.cz");
  assert.deepEqual(visible.map(row=>row.title),["B"]);
});

test("bezny technik nevidi admin filtr a stale vidi jen vlastni protokoly",()=>{
  const helpers=createMainProtocolHistoryViewHelpers({
    ...baseHelpers,
    canViewAllMainProtocolHistory:()=>false
  });

  assert.deepEqual(helpers.mainProtocolHistoryTechnicianOptions(items),[]);
  const visible=helpers.mainProtocolHistoryVisibleRows(items,"","technik-b@astip.cz");
  assert.deepEqual(visible.map(row=>row.title),["A"]);
});
