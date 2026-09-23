import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");

test("attachment runtime modules are excluded from startup imports",()=>{
  for(const moduleName of ["render","load","upload"]){
    assert.doesNotMatch(main,new RegExp(`from "\\.\\/site-attachment-${moduleName}-utils\\.js"`));
    assert.match(main,new RegExp(`import\\("\\.\\/site-attachment-${moduleName}-utils\\.js"\\)`));
  }
});

test("attachments share one initialized runtime and retry import failure",()=>{
  assert.match(main,/if\(siteAttachmentRuntimeHelpers\) return Promise\.resolve\(siteAttachmentRuntimeHelpers\)/);
  assert.match(main,/if\(!siteAttachmentRuntimeHelpersPromise\)/);
  assert.match(main,/siteAttachmentRuntimeHelpersPromise=null;\s*throw error;/);
  assert.match(main,/Přílohy se nepodařilo zobrazit\. Zkus záložku otevřít znovu\./);
});

test("empty attachment list replaces the lazy-loading placeholder",()=>{
  const renderer=fs.readFileSync(new URL("../src/site-attachment-render-utils.js",import.meta.url),"utf8");
  assert.match(renderer,/let siteAttachmentRenderSignature=null/);
  assert.match(renderer,/siteAttachmentRenderSignature=null/);
  assert.match(renderer,/Zatím nejsou uložené žádné přílohy\./);
});

test("attachment public load, render, and upload entry points remain available",()=>{
  assert.match(main,/async function renderSiteAttachments\(items=\[\]\)/);
  assert.match(main,/async function loadSiteAttachments\(\.\.\.args\)/);
  assert.match(main,/async function uploadSiteAttachments\(\.\.\.args\)/);
  assert.match(main,/window\.loadSiteAttachments=loadSiteAttachments/);
  assert.match(main,/window\.uploadSiteAttachments=uploadSiteAttachments/);
});
