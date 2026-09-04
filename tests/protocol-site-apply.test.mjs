import test from "node:test";
import assert from "node:assert/strict";
import { createProtocolSiteApplyHelpers } from "../src/protocol-site-apply-utils.js";

const helpers=createProtocolSiteApplyHelpers({
  addMonths:(date,months)=>{
    const next=new Date(date);
    next.setMonth(next.getMonth()+months);
    return next;
  },
  applyStopStatusRawPatch:(raw,active)=>{
    raw["Stop Stav"]=active ? "ANO" : "NE";
    return raw;
  },
  dateInputValueFromAny:value=>new Date(value).toISOString().slice(0,10),
  detailKey:site=>site?.id || "",
  detectControlPeriod:raw=>raw["Perioda kontrol"] || "12",
  getSelectedSite:()=>null,
  historyObjectSummary:()=>"",
  historyTimeValue:()=>0,
  isoDateFromAny:value=>String(value || "").slice(0,10),
  normalize:rows=>rows,
  parseDateValue:value=>value ? new Date(value) : null,
  periodMonths:()=>12,
  protocolDisplayDate:value=>String(value || "").slice(0,10),
  protocolSavedTimeValue:()=>0,
  protocolSourceStateValue:protocol=>protocol.sourceState || "",
  safe:value=>String(value ?? "").trim(),
  setSelectedSite:()=>{}
});

test("kontakt z vyplneneho protokolu se zapise do vsech detailnich aliasu",()=>{
  const raw={};
  helpers.applyProtocolFieldsToRaw(raw,{contacts:"Novák 603 111 222"});
  [
    "Kontakt",
    "Kontakt_mapy",
    "Hlavní kontakt",
    "Upravený kontakt",
    "Kontakty",
    "Telefon",
    "Telefon kontakt",
    "Mobil",
    "Kontakt osoba",
    "Kontakt na místě"
  ].forEach(key=>{
    assert.equal(raw[key],"Novák 603 111 222");
  });
});
