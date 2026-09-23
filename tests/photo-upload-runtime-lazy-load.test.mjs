import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("photo upload runtime wrapper is excluded from startup",()=>{
  assert.doesNotMatch(main,/^import\s*\{[^}]*createPhotoUploadRuntimeHelpers[^}]*\}/m);
  assert.match(main,/import\("\.\/photo-upload-runtime-utils\.js"\)/);
});

test("photo upload actions share one retryable lazy runtime",()=>{
  assert.match(main,/if\(!photoUploadRuntimeHelpersPromise\)/);
  assert.match(main,/photoUploadRuntimeHelpersPromise=null;\s*throw error;/);
  assert.match(main,/helpers\.deleteCloudinaryUpload\(\.\.\.args\)/);
  assert.match(main,/helpers\.prepareCloudinaryUploadFile\(\.\.\.args\)/);
  assert.match(main,/helpers\.prepareOfflinePhotoData\(\.\.\.args\)/);
  assert.match(main,/helpers\.uploadPhotoToCloudinary\(\.\.\.args\)/);
});
