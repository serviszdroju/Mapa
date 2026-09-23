import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const html=fs.readFileSync(new URL("../index.html",import.meta.url),"utf8");

test("kriticke lokalni zdroje se objevi pred velkym prihlasovacim blokem",()=>{
  const authBlockStart=html.indexOf("<script>\n(function(){");
  assert.ok(authBlockStart>0,"chybi hlavni prihlasovaci blok");

  for(const asset of [
    "./vendor/leaflet/leaflet.css",
    "./vendor/leaflet/leaflet.js",
    "./app.css",
    "./src/shell-boot.js",
    "./src/sw-register.js",
    "./src/detail-tabs.js",
    "./src/hosted-login.js",
    "./src/main.js"
  ]){
    const first=html.indexOf(asset);
    assert.ok(first>0 && first<authBlockStart,`${asset} se musi nacitat pred prihlasovacim blokem`);
    assert.equal(html.indexOf(asset,first+1),-1,`${asset} smi byt v HTML jen jednou`);
  }
});
