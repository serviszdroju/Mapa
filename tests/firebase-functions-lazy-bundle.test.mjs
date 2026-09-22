import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const startupSdk=fs.readFileSync(new URL("../src/firebase-bundled-sdk.js",import.meta.url),"utf8");
const functionsSdk=fs.readFileSync(new URL("../src/firebase-functions-sdk.js",import.meta.url),"utf8");
const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const sitesBuild=fs.readFileSync(new URL("../scripts/prepare-sites-build.mjs",import.meta.url),"utf8");

test("Firebase Functions is excluded from the startup SDK bundle",()=>{
  assert.doesNotMatch(startupSdk,/firebase\/functions/);
  assert.match(functionsSdk,/firebase\/functions/);
});

test("Firebase Functions is imported only through the mail initializer",()=>{
  assert.match(main,/bundledFirebaseFunctionsPromise=import\("\.\/firebase-functions-sdk\.js"\)/);
  assert.match(main,/async function ensureMailFunctions\(\)[\s\S]*?loadBundledFirebaseFunctions\(\)/);
  assert.doesNotMatch(main,/bundledFirebaseMods\.firebaseFunctionsMod/);
});

test("Firebase Functions is excluded from the critical service-worker precache",()=>{
  assert.match(sitesBuild,/lazyAssetPrefixes = \["firebase-functions-sdk-"\]/);
  assert.match(sitesBuild,/!lazyAssetPrefixes\.some/);
});
