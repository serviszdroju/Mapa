import test from "node:test";
import assert from "node:assert/strict";
import { createSiteFieldLookupHelpers } from "../src/site-field-lookup-utils.js";
import { dataNormFixed } from "../src/data-key-utils.js";
import { canonicalWatchSelfValue, orderedFlagFromRaw } from "../src/map-status.js";
import { color, statusText } from "../src/schedule-status.js";

test("editace kraje pouzije normalizovany kraj z radku, kdyz v raw datech chybi",()=>{
  const regionSpec={label:"Kraj",key:"Kraj",keys:["Kraj","Region","Kraj / oblast"],type:"region"};
  const { userSiteFieldValue }=createSiteFieldLookupHelpers({
    dataNormFixed,
    userSiteDataFields:[regionSpec],
    detectControlPeriod:()=>"",
    getImportantNoteFixed:()=>"",
    getWatchFixed:()=>"",
  });
  const value=userSiteFieldValue({kraj:"Zlínský kraj",raw:{}},regionSpec,{});
  assert.equal(value,"Zlínský kraj");
});

test("zluty stav kontroly objednane odpovida aktivnimu ordered priznaku",()=>{
  const raw={"Stav pro mapu":"Kontrola objednaná"};
  const row={raw,ordered:orderedFlagFromRaw(raw),repairOrdered:false,stopped:false,noOrder:false,posledni:"2026-01-01",pristi:"2026-12-01"};
  assert.equal(row.ordered,true);
  assert.equal(statusText(row),"Kontrola objednaná");
  assert.equal(color(row),"#eab308");
});

test("hlidame sami termin se v detailu zobrazi jako ano i z legacy priznaku bez objednavky",()=>{
  const watchSpec={label:"Hlídáme sami termín",key:"Hlídáme sami termín",type:"yesno"};
  const { userSiteFieldValue }=createSiteFieldLookupHelpers({
    dataNormFixed,
    userSiteDataFields:[watchSpec],
    detectControlPeriod:()=>"",
    getImportantNoteFixed:()=>"",
    getWatchFixed:canonicalWatchSelfValue,
  });
  const raw={"Bez objednávky":"ANO"};
  const value=userSiteFieldValue({raw},watchSpec,raw);
  assert.equal(value,"ano");
});
