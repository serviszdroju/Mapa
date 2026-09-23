import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("site photo viewer renderer is excluded from startup imports",()=>{
  assert.doesNotMatch(main,/from "\.\/site-photo-viewer-render-utils\.js"/);
  assert.match(main,/import\("\.\/site-photo-viewer-render-utils\.js"\)/);
  assert.match(main,/async function renderSitePhotos\(items=sitePhotoItems,preserveIndex=false\)/);
  assert.match(main,/viewerHelpers\.createSitePhotoViewer\(sitePhotoItems,sitePhotoIndex\)/);
});

test("gallery renderer shares one load and retries failures",()=>{
  assert.match(main,/if\(!sitePhotoViewerRenderHelpersPromise\)/);
  assert.match(main,/sitePhotoViewerRenderHelpersPromise=null;\s*throw error;/);
  assert.match(main,/Galerii fotografií se nepodařilo zobrazit\. Zkus záložku otevřít znovu\./);
});

test("gallery mutations and offline behavior remain in the main app",()=>{
  assert.match(main,/deleteCurrentSitePhoto/);
  assert.match(main,/uploadSitePhotos/);
  assert.match(main,/readOfflinePhotoItems/);
  assert.match(main,/createPhotoDedupe/);
  assert.match(main,/bindSitePhotoListClicks\(list\)/);
});
