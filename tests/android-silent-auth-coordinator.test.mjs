import test from "node:test";
import assert from "node:assert/strict";
import {
  resetAndroidSilentAuthCoordinator,
  runAndroidSilentAuthOnce,
  waitForExistingAuthUser
} from "../src/android-silent-auth-coordinator.js";

test("souběžné tiché Android přihlášení spustí síťovou operaci jen jednou",async()=>{
  resetAndroidSilentAuthCoordinator();
  let calls=0;
  let release;
  const pending=new Promise(resolve=>{ release=resolve; });
  const start=()=>{
    calls++;
    return pending;
  };
  const first=runAndroidSilentAuthOnce(start,{now:()=>1000});
  const second=runAndroidSilentAuthOnce(start,{now:()=>1001});
  assert.equal(first,second);
  assert.equal(calls,0);
  await Promise.resolve();
  assert.equal(calls,1);
  release({user:{uid:"test"}});
  assert.deepEqual(await first,{user:{uid:"test"}});
});

test("po vypršení intervalu lze tiché Android přihlášení spustit znovu",async()=>{
  resetAndroidSilentAuthCoordinator();
  let calls=0;
  await runAndroidSilentAuthOnce(()=>++calls,{reuseMs:100,now:()=>1000});
  await runAndroidSilentAuthOnce(()=>++calls,{reuseMs:100,now:()=>1200});
  assert.equal(calls,2);
});

test("pred nativnim obnovenim se pouzije uz probihajici Firebase relace",async()=>{
  let ticks=0;
  const user={uid:"existing"};
  const found=await waitForExistingAuthUser(
    ()=>ticks>=2 ? user : null,
    {
      timeoutMs:500,
      pollMs:100,
      now:()=>ticks*100,
      delay:async()=>{ ticks++; }
    }
  );
  assert.equal(found,user);
  assert.equal(ticks,2);
});

test("bez obnovene Firebase relace cekani skonci a povoli nativni fallback",async()=>{
  let ticks=0;
  const found=await waitForExistingAuthUser(
    ()=>null,
    {
      timeoutMs:300,
      pollMs:100,
      now:()=>ticks*100,
      delay:async()=>{ ticks++; }
    }
  );
  assert.equal(found,null);
  assert.equal(ticks,3);
});
