import test from "node:test";
import assert from "node:assert/strict";
import {createAutomaticConnectivityRefreshScheduler} from "../src/offline-connectivity-listeners-utils.js";

function fakeScheduler(){
  let currentTime=1000;
  let callback=null;
  const reasons=[];
  const scheduler=createAutomaticConnectivityRefreshScheduler({
    clearTimer:()=>{ callback=null; },
    minIntervalMs:60000,
    now:()=>currentTime,
    run:reason=>reasons.push(reason),
    setTimer:fn=>{ callback=fn; return 1; }
  });
  return {
    advance:ms=>{ currentTime+=ms; },
    flush:()=>{ const fn=callback; callback=null; if(fn) fn(); },
    reasons,
    scheduler
  };
}

test("rychly focus po automaticke kontrole znovu nespusti offline praci",()=>{
  const fake=fakeScheduler();
  assert.equal(fake.scheduler.schedule("visible"),true);
  fake.flush();
  fake.advance(20000);
  assert.equal(fake.scheduler.schedule("focus"),false);
  fake.flush();
  assert.deepEqual(fake.reasons,["visible"]);
});

test("navrat online obejde casove omezeni a zustane okamzity",()=>{
  const fake=fakeScheduler();
  fake.scheduler.schedule("visible");
  fake.flush();
  fake.advance(20000);
  assert.equal(fake.scheduler.schedule("online",120,{force:true}),true);
  fake.flush();
  assert.deepEqual(fake.reasons,["visible","online"]);
});

test("automaticka kontrola je po minute znovu povolena",()=>{
  const fake=fakeScheduler();
  fake.scheduler.schedule("visible");
  fake.flush();
  fake.advance(60000);
  assert.equal(fake.scheduler.schedule("focus"),true);
  fake.flush();
  assert.deepEqual(fake.reasons,["visible","focus"]);
});
