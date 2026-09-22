import test from "node:test";
import assert from "node:assert/strict";

import {
  readCachedLocalDetailItems,
  trimOldestCacheEntries
} from "../src/local-detail-cache-utils.js";

test("detail cache keeps only the newest bounded entries",async()=>{
  const cache=new Map();
  for(let index=0;index<6;index++){
    await readCachedLocalDetailItems({
      cache,
      key:`site-${index}`,
      loader:async()=>[{index}],
      maxEntries:3
    });
  }
  assert.deepEqual([...cache.keys()],["site-3","site-4","site-5"]);
  assert.deepEqual(cache.get("site-5").items,[{index:5}]);
});

test("cache trimming preserves the currently written entry",()=>{
  const cache=new Map([
    ["keep",{items:[1]}],
    ["old-1",{items:[2]}],
    ["old-2",{items:[3]}]
  ]);
  trimOldestCacheEntries(cache,2,"keep");
  assert.equal(cache.has("keep"),true);
  assert.equal(cache.has("old-1"),false);
  assert.equal(cache.size,2);
});
