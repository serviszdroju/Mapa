import assert from "node:assert/strict";
import test from "node:test";

import {createOfflineMediaObjectUrlHelpers} from "../src/offline-media-object-url-utils.js";

test("offline gallery replaces remote photo URLs with cached blob URLs",async()=>{
  const blobs=new Map([
    ["https://img/display.jpg",{size:1600,name:"display"}],
    ["https://img/thumb.jpg",{size:240,name:"thumb"}]
  ]);
  const helpers=createOfflineMediaObjectUrlHelpers({
    cacheStorage:()=>({match:async url=>blobs.has(url) ? {blob:async()=>blobs.get(url)} : null}),
    createObjectUrl:blob=>`blob:${blob.name}`,
    isOffline:()=>true,
    photoDisplayUrl:item=>item.display,
    photoFullUrl:item=>item.full,
    photoThumbUrl:item=>item.thumb,
    revokeObjectUrl:()=>{}
  });
  const photo={display:"https://img/display.jpg",full:"https://img/full.jpg",thumb:"https://img/thumb.jpg"};
  const result=await helpers.hydrateOfflinePhotoObjectUrls([photo]);
  assert.equal(result[0]._offlineDisplayUrl,"blob:display");
  assert.equal(result[0]._offlineFullUrl,"blob:display");
  assert.equal(result[0]._offlineThumbUrl,"blob:thumb");
});

test("online gallery removes temporary offline URLs and avoids cache reads",async()=>{
  let cacheReads=0;
  const helpers=createOfflineMediaObjectUrlHelpers({
    cacheStorage:()=>({match:async()=>{cacheReads++;return null;}}),
    isOffline:()=>false
  });
  const photo={
    url:"https://img/photo.jpg",
    _offlineDisplayUrl:"blob:display",
    _offlineFullUrl:"blob:full",
    _offlineThumbUrl:"blob:thumb"
  };
  await helpers.hydrateOfflinePhotoObjectUrls([photo]);
  assert.deepEqual(photo,{url:"https://img/photo.jpg"});
  assert.equal(cacheReads,0);
});
