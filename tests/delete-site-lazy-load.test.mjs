import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const helper=fs.readFileSync(new URL("../src/delete-site-utils.js",import.meta.url),"utf8");

test("site deletion runtime loads only on the delete action",()=>{
  assert.doesNotMatch(main,/from "\.\/delete-site-utils\.js"/);
  assert.match(main,/import\("\.\/delete-site-utils\.js"\)/);
  assert.match(main,/async function deleteSelectedSite\(\)[\s\S]*?await loadDeleteSiteHelpers\(\)/);
  assert.match(main,/deleteSiteHelpersPromise=null;\s*throw error;/);
});

test("both detail delete buttons keep the lazy deletion action",()=>{
  assert.match(main,/deleteDataSiteBtn\.onclick=deleteSelectedSite/);
  assert.match(main,/deleteSiteBtn\.onclick=deleteSelectedSite/);
});

test("lazy deletion keeps permissions, tombstone, child cleanup, and local removal",()=>{
  assert.match(helper,/if\(!isAppAdmin\(\)\)/);
  assert.match(helper,/setDoc\(doc\(db,"deletedSites",tombstoneId\),deletePayload/);
  assert.match(helper,/for\(const colName of \["protocols","serviceRecords"\]\)/);
  assert.match(helper,/getRemoveFirebaseSiteRow\(\)/);
});
