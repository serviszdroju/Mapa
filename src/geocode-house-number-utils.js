import { safe, simpleNorm } from "./core-utils.js";

export function normalizeHouseNumberToken(value){
  return simpleNorm(value).replace(/\s+/g,"").replace(/[^0-9a-z/]/g,"");
}

function shouldSkipHouseNumberToken(text,index,token){
  const after=text[index+token.length] || "";
  if(after===".") return true;
  const before=simpleNorm(text.slice(Math.max(0,index-28),index));
  if(/\b(praha|brno|ostrava|plzen|plzeň)\s*$/.test(before)) return true;
  if(/\b(praha|brno|ostrava|plzen|plzeň)\s+\d+\s*$/.test(simpleNorm(text.slice(Math.max(0,index-35),index+token.length)))) return true;
  return false;
}

export function geocodeRequestedHouseNumbers(text){
  const clean=safe(text).replace(/\b\d{3}\s?\d{2}\b/g," ");
  const out=[];
  const re=/\b\d{1,5}(?:\s*\/\s*\d{1,5})?[a-zA-Z]?\b/g;
  let match;
  while((match=re.exec(clean))){
    const token=match[0];
    if(shouldSkipHouseNumberToken(clean,match.index,token)) continue;
    const normalized=normalizeHouseNumberToken(token);
    if(!normalized || /^\d{5}$/.test(normalized)) continue;
    out.push(normalized);
  }
  return out.filter((item,index,array)=>item && array.indexOf(item)===index);
}

export function houseNumberVariants(value){
  const base=normalizeHouseNumberToken(value);
  if(!base) return [];
  const out=[base];
  if(base.includes("/")){
    const parts=base.split("/").filter(Boolean);
    parts.forEach(part=>out.push(part));
    if(parts.length===2) out.push(`${parts[1]}/${parts[0]}`);
  }
  const letter=base.match(/^(\d+)([a-z])$/);
  if(letter) out.push(letter[1]);
  return out.filter((item,index,array)=>item && array.indexOf(item)===index);
}
