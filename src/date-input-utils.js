import { parseDateValue } from "./schedule-status.js";

export function dateInputValueFromAny(v){
  const d=v instanceof Date ? v : parseDateValue(v);
  if(!d || isNaN(d.getTime())) return "";
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

export function isoDateFromAny(v){
  const d=parseDateValue(v);
  if(!d) return "";
  const y=d.getFullYear();
  const m=String(d.getMonth()+1).padStart(2,"0");
  const day=String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}
