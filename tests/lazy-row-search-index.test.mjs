import test from "node:test";
import assert from "node:assert/strict";

import { createRowFastIndexHelpers } from "../src/row-fast-index-utils.js";

function helpers(searchCalls){
  return createRowFastIndexHelpers({
    ensureRowPlaceCache:()=>({}),
    ensureRowScheduleCache:()=>({status:"OK / ostatní"}),
    ensureRowSourceCache:()=>({}),
    regionTextNorm:value=>String(value || "").toLowerCase(),
    rowLookupKeys:()=>["row-1"],
    rowRegion:()=>"Jihomoravský kraj",
    rowScheduleFingerprint:()=>"schedule",
    rowSearchText:()=>{
      searchCalls.count++;
      return "Brno, Nopova 88 ASTIP";
    },
    searchNorm:value=>String(value).toLowerCase(),
    sitePlaceGroupKey:()=>"place",
    sitePlaceLabel:()=>"Brno, Nopova 88",
    siteSourceIdentity:()=>"astip",
    statusText:()=>"OK / ostatní"
  });
}

test("běžné indexování mapy odloží vyhledávací text do prvního hledání",()=>{
  const searchCalls={count:0};
  const { ensureRowFastIndexes, ensureRowSearchIndex }=helpers(searchCalls);
  const row={raw:{Název:"Brno, Nopova 88"}};

  ensureRowFastIndexes(row,7);
  assert.equal(searchCalls.count,0);
  assert.equal(row._searchText,undefined);
  assert.equal(row.i,7);

  ensureRowSearchIndex(row);
  assert.equal(searchCalls.count,1);
  assert.equal(row._searchText,"brno, nopova 88 astip");
  assert.equal(row._compactSearchText,"brno,nopova88astip");

  ensureRowSearchIndex(row);
  assert.equal(searchCalls.count,1);
});
