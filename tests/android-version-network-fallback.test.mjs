import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gradle=fs.readFileSync(new URL("../android/app/build.gradle",import.meta.url),"utf8");

test("network fallback fix is shipped as an installable Android update",()=>{
  assert.match(gradle,/versionCode 124/);
  assert.match(gradle,/versionName "1\.2\.22-nonblocking-fallback"/);
});
