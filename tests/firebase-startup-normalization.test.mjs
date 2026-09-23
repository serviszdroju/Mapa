import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source=fs.readFileSync(new URL("../public/late.js",import.meta.url),"utf8");

test("Firebase startup row fallback does not depend on a later helper",()=>{
  const body=source.match(/function fallbackNormalizedRow\(raw, docId\)\{([\s\S]*?)\n  \}/);
  assert.ok(body,"fallbackNormalizedRow musi zustat dostupny pro casny Firebase start");
  assert.match(body[1],/String\(docId \?\? ""\)\.trim\(\)/);
  assert.doesNotMatch(body[1],/cleanSource\(/);
});
