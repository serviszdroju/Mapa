import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("offline detail prefetch implementation is excluded from initial map imports",()=>{
  assert.doesNotMatch(main,/from "\.\/offline-detail-prefetch-(?:site|runner)-utils\.js"/);
  assert.match(main,/import\("\.\/offline-detail-prefetch-site-utils\.js"\)/);
  assert.match(main,/import\("\.\/offline-detail-prefetch-runner-utils\.js"\)/);
  assert.match(main,/Promise\.all\(\[/);
});

test("manual and background offline prefetch share one retryable lazy runtime",()=>{
  assert.match(main,/if\(!offlineDetailPrefetchHelpersPromise\)/);
  assert.match(main,/offlineDetailPrefetchHelpersPromise=null;\s*throw error;/);
  assert.match(main,/async function prefetchSzzOfflineDetailData\(\.\.\.args\)/);
  assert.match(main,/async function scheduleSzzBackgroundDetailPrefetch\(\.\.\.args\)/);
  assert.match(main,/prefetchOfflineDetailData:\(rowsForDetails,options\)=>prefetchSzzOfflineDetailData\(rowsForDetails,options\)/);
});
