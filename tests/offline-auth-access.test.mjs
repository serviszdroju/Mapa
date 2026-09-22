import test from "node:test";
import assert from "node:assert/strict";
import {
  canResumeAndroidCachedSession,
  hasTrustedOfflineSession
} from "../src/offline-auth-access-utils.js";

test("Android muze offline otevrit cache s ulozenym nativnim prihlasenim",()=>{
  assert.equal(hasTrustedOfflineSession({
    online:false,
    androidShell:true,
    androidStoredAuth:true
  }),true);
});

test("web bez zname relace ani Android bez ulozeneho uctu offline cache neotevrou",()=>{
  assert.equal(hasTrustedOfflineSession({online:false}),false);
  assert.equal(hasTrustedOfflineSession({online:false,androidShell:true}),false);
});

test("rucni odhlaseni ma pred offline cache vzdy prednost",()=>{
  assert.equal(hasTrustedOfflineSession({
    online:false,
    explicitlySignedOut:true,
    knownSignedIn:true,
    androidShell:true,
    androidStoredAuth:true
  }),false);
});

test("ulozena relace neobchazi bezne online overeni",()=>{
  assert.equal(hasTrustedOfflineSession({
    online:true,
    androidShell:true,
    androidStoredAuth:true
  }),false);
});

test("Android pri tichem online overeni muze ihned ukazat znamou ulozenou relaci",()=>{
  assert.equal(canResumeAndroidCachedSession({
    knownSignedIn:true,
    androidStoredAuth:true
  }),true);
});

test("Android cache se pred overenim neukaze po odhlaseni ani bez obou priznaku",()=>{
  assert.equal(canResumeAndroidCachedSession({
    explicitlySignedOut:true,
    knownSignedIn:true,
    androidStoredAuth:true
  }),false);
  assert.equal(canResumeAndroidCachedSession({knownSignedIn:true}),false);
  assert.equal(canResumeAndroidCachedSession({androidStoredAuth:true}),false);
});
