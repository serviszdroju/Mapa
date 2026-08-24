import { safe } from "./core-utils.js";

export function timeValueFromAny(raw){
  if(raw && typeof raw.toDate==="function") return raw.toDate().getTime();
  const d=new Date(raw || 0);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export function historyTimeValue(item){
  return timeValueFromAny(item?.savedAt || item?.createdAt || item?.updatedAt || item?.offlineSavedAt || item?.uploadedAt || item?.checkDate || item?.date || 0);
}

export function protocolSavedTimeValue(item){
  return timeValueFromAny(item?.savedAt || item?.createdAt || item?.updatedAt || item?.offlineSavedAt || 0);
}

export function dateOnlyTextFallback(value){
  return safe(value)
    .replace(/T\d{1,2}:\d{2}(:\d{2})?.*$/,"")
    .replace(/\s+\d{1,2}:\d{2}(:\d{2})?.*$/,"")
    .trim();
}
