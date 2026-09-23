import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(
  new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java", import.meta.url),
  "utf8",
);

function methodBody(name) {
  const start = source.indexOf(`protected void ${name}()`);
  assert.notEqual(start, -1, `${name} musi existovat`);
  const nextOverride = source.indexOf("@Override", start + 1);
  return source.slice(start, nextOverride < 0 ? source.length : nextOverride);
}

test("odchod z aplikace uklada koncept a cookies pouze jednou", () => {
  const onPause = methodBody("onPause");
  const onStop = methodBody("onStop");

  assert.match(onPause, /flushWebDraftToNative\(\)/);
  assert.match(onPause, /CookieManager\.getInstance\(\)\.flush\(\)/);
  assert.doesNotMatch(onStop, /flushWebDraftToNative\(\)/);
  assert.doesNotMatch(onStop, /CookieManager\.getInstance\(\)\.flush\(\)/);
  assert.match(onStop, /super\.onStop\(\)/);
});
