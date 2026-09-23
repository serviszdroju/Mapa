import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),"utf8");

test("Android outbox operation reads use the repository executor",()=>{
  const repository=read("android/app/src/main/java/cz/astip/serviszdroju/offline/SzzOfflineRepository.java");
  const activity=read("android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java");
  assert.match(repository,/outboxOperationJsonAsync\(String operationId, StringCallback callback\)[\s\S]*?executor\.execute/);
  assert.match(activity,/requestOutboxOperationJson\(String operationId, String requestId\)/);
  assert.match(activity,/window\.__szzAndroidOutboxOperationResult/);
});

test("protocol and photo sync await async outbox state",()=>{
  const source=read("src/main.js");
  assert.match(source,/function androidOutboxOperationAsync\(operationId\)/);
  assert.match(source,/await androidOutboxOperationAsync\(`protocol:\$\{id\}`\)/);
  assert.match(source,/await androidOutboxOperationAsync\(`photo:\$\{id\}`\)/);
});

test("async outbox requests are bounded without a blocking timeout fallback",()=>{
  const source=read("src/main.js");
  const body=source.match(/function androidOutboxOperationAsync\(operationId\)\{([\s\S]*?)\n\}/)?.[1] || "";
  assert.match(body,/},5000\)/);
  assert.equal((body.match(/androidOutboxOperation\(operationId\)/g) || []).length,1);
  assert.match(body,/resolve\(null\)/);
});
