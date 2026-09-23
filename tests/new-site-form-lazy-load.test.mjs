import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const mode=fs.readFileSync(new URL("../src/new-site-mode-utils.js",import.meta.url),"utf8");

test("new-site form implementation loads only when the form is opened",()=>{
  assert.doesNotMatch(main,/createNewSiteFormFieldHelpers[\s\S]*?from "\.\/new-site-form-utils\.js"/);
  assert.match(main,/import\("\.\/new-site-form-utils\.js"\)/);
  assert.match(main,/async function ensureNewSiteFormReady\(\)/);
  assert.match(main,/newSiteFormHelpersPromise=null;\s*throw error;/);
  assert.match(mode,/async function openNewSiteForm\(\)\{\s*await ensureNewSiteFormReady\(\);/);
});

test("new-site save waits for the same initialized form helper",()=>{
  assert.match(main,/getElementById\("saveNewSiteBtn"\)\.onclick=async\(\)=>\{\s*await ensureNewSiteFormReady\(\);/);
  assert.match(main,/const allRawData=collectNewSiteAllFields\(\)/);
  assert.match(main,/forceRenderNewSiteForm,/);
  assert.match(main,/renderNewSiteAllFields,/);
});
