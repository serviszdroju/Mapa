import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root=new URL("../",import.meta.url);

test("inline startup watchdog recovers only an online empty visible shell after the grace period",async()=>{
  const html=await readFile(new URL("index.html",root),"utf8");
  assert.match(html,/const appVisible=!!\(app && app\.style\.display/);
  assert.match(html,/const hasRows=Array\.isArray\(window\.rows\) && window\.rows\.length>0/);
  assert.match(html,/appVisible && \(!options\.allowEmptyShell \|\| hasRows \|\| navigator\.onLine===false\)/);
  assert.match(html,/allowEmptyShell:delay>=15000/);
});

test("main auth fallback no longer treats an online empty shell as a completed startup",async()=>{
  const main=await readFile(new URL("src/main.js",root),"utf8");
  assert.match(main,/const emptyVisibleShell=appVisible && rows\.length===0 && navigator\.onLine!==false/);
  assert.match(main,/if\(!startupStillChecking && !emptyVisibleShell\) return/);
});

test("progress status helper is module-scoped for Android cache and offline recovery paths",async()=>{
  const main=await readFile(new URL("src/main.js",root),"utf8");
  const helperIndex=main.indexOf("function setProgressStatus(message)");
  const firebaseBootIndex=main.indexOf('if(firebaseReady){\n  (async()=>{');
  assert.ok(helperIndex>=0,"progress helper must exist");
  assert.ok(firebaseBootIndex>=0,"Firebase boot block must exist");
  assert.ok(helperIndex<firebaseBootIndex,"progress helper must be visible outside Firebase boot");
  assert.equal(main.match(/function setProgressStatus\(message\)/g)?.length,1);
});
