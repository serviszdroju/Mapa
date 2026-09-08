import test from "node:test";
import assert from "node:assert/strict";
import { mergeMainProtocolHistoryItemsPreferFirebase } from "../src/main-protocol-history-merge-utils.js";

test("firebase hlavni historie prepise starsi lokalni kopii stejneho protokolu",()=>{
  const localItems=[
    {
      _id:"hodonin-25112501",
      title:"Hodonín, Třída bratří Čapků 3273_1",
      handoffForProcessing:true,
      processingHandoff:"ano"
    }
  ];
  const firebaseItems=[
    {
      _id:"hodonin-25112501",
      title:"Hodonín, Třída bratří Čapků 3273_1",
      handoffForProcessing:true,
      processingHandoff:"ano",
      processed:true,
      processedAt:"2026-09-08T08:00:00.000Z",
      processedBy:"jan.soldan@astip.cz"
    }
  ];

  const merged=mergeMainProtocolHistoryItemsPreferFirebase(localItems,firebaseItems);

  assert.equal(merged.length,1);
  assert.equal(merged[0].processed,true);
  assert.equal(merged[0].processedAt,"2026-09-08T08:00:00.000Z");
  assert.equal(merged[0].processedBy,"jan.soldan@astip.cz");
});
