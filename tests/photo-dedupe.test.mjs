import test from "node:test";
import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import {
  createPhotoDedupe,
  photoDuplicateKeys,
  photoFileDedupeInfo,
  stablePhotoIdForSite
} from "../src/photo-dedupe-utils.js";

function fileLike(name,content,options={}){
  const bytes=new TextEncoder().encode(content);
  return {
    name,
    size:bytes.byteLength,
    lastModified:options.lastModified || 1770000000000,
    type:options.type || "image/jpeg",
    arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)
  };
}

test("photo dedupe skips items with the same content fingerprint",()=>{
  const items=[];
  const dedupe=createPhotoDedupe(items);
  assert.equal(dedupe.add({_id:"photo-1",photoFingerprint:"sha256:abc",url:"https://example.test/a.jpg"}),true);
  assert.equal(dedupe.add({_id:"photo-2",sha256:"abc",url:"https://example.test/b.jpg"}),false);
  assert.equal(items.length,1);
});

test("photo dedupe treats Cloudinary transformed URLs as the same photo",()=>{
  const keys=photoDuplicateKeys({
    fullUrl:"https://res.cloudinary.com/demo/image/upload/v123/szz/foto.jpg",
    displayUrl:"https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1600,c_limit/v123/szz/foto.jpg"
  });
  const urlKeys=keys.filter(key=>key.startsWith("url:"));
  assert.equal(new Set(urlKeys).size,1);
});

test("same selected file gets the same site photo id",async()=>{
  const first=await photoFileDedupeInfo(fileLike("foto.jpg","same-photo"),webcrypto);
  const second=await photoFileDedupeInfo(fileLike("renamed.jpg","same-photo"),webcrypto);
  assert.equal(first.photoDedupeKey,second.photoDedupeKey);
  assert.equal(stablePhotoIdForSite("site-a",first.photoDedupeKey),stablePhotoIdForSite("site-a",second.photoDedupeKey));
  assert.notEqual(stablePhotoIdForSite("site-a",first.photoDedupeKey),stablePhotoIdForSite("site-b",second.photoDedupeKey));
});
