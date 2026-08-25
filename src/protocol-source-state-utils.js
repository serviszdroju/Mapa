import {
  safe,
  simpleNorm
} from "./core-utils.js";

export function protocolSourceStateValue(protocol={}){
  const raw=safe(protocol.sourceState || protocol.protocolSourceState || protocol.sourceStatus || protocol.finalSourceState);
  const normalized=simpleNorm(raw);
  if(normalized==="ok" || normalized.includes("poradku") || normalized.includes("funkcni") || normalized.includes("provozuschop")) return "ok";
  if(normalized==="stop" || normalized.includes("stop") || normalized.includes("mimo provoz") || normalized.includes("neprovozuschop")) return "stop";
  return "";
}

export function protocolSourceStateLabel(protocol={}){
  const state=protocolSourceStateValue(protocol);
  if(state==="ok") return "Zdroj je v pořádku";
  if(state==="stop") return "Zdroj je ve stop stavu";
  return "";
}

export function protocolSourceTestMethodLabel(value){
  const normalized=simpleNorm(value);
  if(!normalized) return "";
  if(normalized==="lift" || normalized.includes("vytah")) return "zdroj byl odzkoušen výtahem";
  if(normalized==="ventilation" || normalized.includes("odvetr")) return "zdroj byl odzkoušen odvětráním";
  if(normalized==="empty" || normalized.includes("prazdno")) return "zdroj byl odzkoušen na prázdno";
  return safe(value);
}
