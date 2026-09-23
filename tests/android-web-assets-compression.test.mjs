import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const build=fs.readFileSync(new URL("../android/app/build.gradle",import.meta.url),"utf8");

test("Android WebView shell avoids per-start ZIP decompression",()=>{
  const block=build.match(/androidResources\s*\{([\s\S]*?)\n\s*\}/)?.[1] || "";
  assert.match(block,/noCompress\s*\+=\s*\[\s*"html"\s*,\s*"js"\s*,\s*"css"\s*\]/);
  assert.doesNotMatch(block,/png|jpe?g|rtf|apk/);
});
