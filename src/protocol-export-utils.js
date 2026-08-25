import {
  safe,
  simpleNorm
} from "./core-utils.js";
import { parseDateValue } from "./schedule-status.js";

export function historyObjectSummary(obj){
  if(!obj || typeof obj!=="object") return "";
  const labels={
    lift:"Výtah",vent:"Vent. výt. šachty",machineLight:"Osvětlení strojovny",chuc:"CHÚC",
    damper:"Klapka",skylight:"Světlík",gate:"Vrata",ats:"ATS",rpo:"RPO",no:"NO",
    sprinkler:"Sprinkler",csTs:"CS/TS",blue:"modrá",b:"B",c:"C",garage:"garáže",
    carLift:"auto výtah",barrier:"závora",parkingHouse:"park. dům",permit:"povolení",
    training:"školení",shoes:"boty",vest:"vesta",helmet:"helma",wcOk:"WC OK",
    wcNok:"WC NOK",lightOk:"Osvětlení OK",lightNok:"Osvětlení NOK",ladder:"Žebřík",
    stairs:"Schody",lowCeiling:"Snížený strop",extremeTemp:"Extrémní teploty",
    other:"jiné"
  };
  return Object.entries(obj)
    .filter(([,value])=>value===true || (value!==false && safe(value)))
    .map(([key,value])=>{
      const label=labels[key] || key;
      return value===true ? label : `${label}: ${value}`;
    })
    .join(", ");
}

export function isProtocolHistoryItem(item){
  return !!item && (
    item._type==="Protokol" ||
    ["protocols","siteProtocols","localProtocols","embeddedProtocols","protocolRefs"].includes(item._collection)
  );
}

export function createProtocolExportHelpers({
  formatDateTimeCz
}={}){
  const dateTimeLabel=date=>typeof formatDateTimeCz==="function" ? formatDateTimeCz(date) : "";

  function protocolExportValue(value){
    if(value===null || value===undefined) return "";
    if(value && typeof value.toDate==="function") return dateTimeLabel(value.toDate());
    if(value instanceof Date) return dateTimeLabel(value);
    if(Array.isArray(value)) return value.map(protocolExportValue).filter(Boolean).join(", ");
    if(typeof value==="object"){
      const summary=historyObjectSummary(value);
      if(summary) return summary;
      try{return JSON.stringify(value)}catch(e){return String(value)}
    }
    return String(value).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g," ").trim();
  }

  function protocolWordFileNamePart(value){
    return simpleNorm(value || "protokol")
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/^-+|-+$/g,"")
      .slice(0,60) || "protokol";
  }

  function protocolExportDatePart(protocol={}){
    const raw=safe(protocol.date || protocol.checkDate || protocol.createdAt || "");
    const d=parseDateValue(raw);
    if(d){
      const pad=n=>String(n).padStart(2,"0");
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    return new Date().toISOString().slice(0,10);
  }

  return {
    protocolExportDatePart,
    protocolExportValue,
    protocolWordFileNamePart
  };
}
