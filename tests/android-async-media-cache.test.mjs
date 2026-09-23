import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("Android Room media cache uses the repository executor bridge",()=>{
  const repository=read("android/app/src/main/java/cz/astip/serviszdroju/offline/SzzOfflineRepository.java");
  const activity=read("android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java");
  assert.match(repository,/cachedPhotosJsonAsync\(int limit, StringCallback callback\)[\s\S]*?executor\.execute/);
  assert.match(repository,/cachedAttachmentsJsonAsync\(int limit, StringCallback callback\)[\s\S]*?executor\.execute/);
  assert.match(activity,/requestCachedPhotosJson\(int limit, String requestId\)/);
  assert.match(activity,/requestCachedAttachmentsJson\(int limit, String requestId\)/);
  assert.match(activity,/window\.__szzAndroidCachedRecordsResult/);
});

test("gallery and attachments await async Android media reads",()=>{
  const main=read("src/main.js");
  const attachments=read("src/site-attachment-load-utils.js");
  assert.match(main,/async function readAndroidCachedRecordsAsync/);
  assert.match(main,/await readAndroidCachedRecordsAsync\("cachedPhotosJson",site,5000\)/);
  assert.match(main,/await readAndroidCachedRecordsAsync\("cachedPhotosJson",selectedSite,5000\)/);
  assert.match(attachments,/await readAndroidCachedRecordsAsync\("cachedAttachmentsJson",site,5000\)/);
});

test("async Android media requests are bounded without a blocking retry",()=>{
  const main=read("src/main.js");
  const body=main.match(/async function readAndroidCachedRecordsAsync[\s\S]*?\n\}/)?.[0] || "";
  assert.match(body,/},10000\)/);
  assert.equal((body.match(/readAndroidCachedRecords\(method,site,limit\)/g) || []).length,1);
  assert.match(body,/return \[\]/);
});
