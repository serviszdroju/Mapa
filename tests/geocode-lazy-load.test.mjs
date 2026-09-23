import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

import {
  geocodeAddressGeneric,
  reverseGeocodeGpsGeneric
} from "../src/geocode-utils.js";

const main=fs.readFileSync(new URL("../src/main.js",import.meta.url),"utf8");
const network=fs.readFileSync(new URL("../src/geocode-utils.js",import.meta.url),"utf8");

test("Nominatim network helpers load only for a geocoding action",()=>{
  assert.doesNotMatch(main,/from "\.\/geocode-utils\.js"/);
  assert.match(main,/geocodeNetworkModulePromise=import\("\.\/geocode-utils\.js"\)/);
  assert.match(main,/async function geocodeAddressFast\(\.\.\.args\)/);
  assert.match(main,/async function geocodeAddressGeneric\(\.\.\.args\)/);
  assert.match(main,/async function reverseGeocodeGpsGeneric\(\.\.\.args\)/);
});

test("lazy geocoding shares one module load and retries import failures",()=>{
  assert.match(main,/if\(!geocodeNetworkModulePromise\)/);
  assert.match(main,/geocodeNetworkModulePromise=null;\s*throw error;/);
  assert.match(main,/return module\.geocodeAddressFast\(\.\.\.args\)/);
  assert.match(main,/return module\.geocodeAddressGeneric\(\.\.\.args\)/);
  assert.match(main,/return module\.reverseGeocodeGpsGeneric\(\.\.\.args\)/);
});

test("network geocoding keeps its endpoints and visible errors",()=>{
  assert.match(network,/nominatim\.openstreetmap\.org\/search/);
  assert.match(network,/nominatim\.openstreetmap\.org\/reverse/);
  assert.match(network,/Reverse geokódování selhalo/);
  assert.match(network,/Geokódování selhalo/);
});

test("lazy network module still resolves an address and reverse GPS result",async()=>{
  const originalFetch=globalThis.fetch;
  const originalWindow=globalThis.window;
  const requested=[];
  globalThis.window={};
  globalThis.fetch=async url=>{
    requested.push(String(url));
    if(String(url).includes("/reverse?")){
      return {ok:true,json:async()=>({display_name:"Náměstí Míru 342, Praha"})};
    }
    return {
      ok:true,
      json:async()=>[{lat:"50.0755",lon:"14.4378",display_name:"Praha",address:{city:"Praha"}}]
    };
  };
  try{
    const point=await geocodeAddressGeneric("Praha");
    assert.equal(point.lat,"50.0755");
    assert.equal(point.lon,"14.4378");
    assert.equal(await reverseGeocodeGpsGeneric(50.0755,14.4378),"Náměstí Míru 342, Praha");
    assert.ok(requested.some(url=>url.includes("nominatim.openstreetmap.org/search?")));
    assert.ok(requested.some(url=>url.includes("nominatim.openstreetmap.org/reverse?")));
  }finally{
    globalThis.fetch=originalFetch;
    globalThis.window=originalWindow;
  }
});
