import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const gradle=fs.readFileSync(new URL("../android/app/build.gradle",import.meta.url),"utf8");

test("network fallback fix is shipped as an installable Android update",()=>{
  const versionCode=Number(gradle.match(/versionCode\s+(\d+)/)?.[1] || 0);
  assert.ok(versionCode>=145,"sitovy fallback musi zustat v Android verzi 145 nebo novejsi");
  assert.match(gradle,/versionName\s+"1\.2\.[0-9]+-[^"]+"/);
});
