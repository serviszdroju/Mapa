import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");

test("Google Identity preload does not delay the app DOMContentLoaded startup",()=>{
  assert.match(html,/<script async src="https:\/\/accounts\.google\.com\/gsi\/client"><\/script>/);
  assert.doesNotMatch(html,/<script defer src="https:\/\/accounts\.google\.com\/gsi\/client"><\/script>/);
  assert.match(html,/function loadGoogleIdentityServices\(\)/);
});
