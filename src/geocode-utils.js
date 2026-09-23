import { safe } from "./core-utils.js";
import {
  canonicalRegionValue,
  inferRegionFromAddressText,
  regionTextNorm
} from "./geocode-region-utils.js";
import {
  geocodeRequestedHouseNumbers,
  houseNumberVariants,
  normalizeHouseNumberToken
} from "./geocode-house-number-utils.js";

export { canonicalRegionValue, inferRegionFromAddressText, regionTextNorm };
export { geocodeRequestedHouseNumbers };

export async function reverseGeocodeGpsGeneric(lat,lon){
  const url=`https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  const res=await fetch(url,{headers:{"Accept":"application/json"}});
  if(!res.ok) throw new Error("Reverse geokódování selhalo");
  const data=await res.json();
  return data.display_name || "";
}

function geocodeCountryVariants(text){
  const n=regionTextNorm(text);
  const hasSk=/(^|\s)(sk|sr)(\s|$)/.test(n) || /\b(slovensko|slovakia|slovenska republika)\b/.test(n);
  const hasCz=/(^|\s)(cz|cr|ceska republika|cesko|czechia|czech republic)(\s|$)/.test(n);
  return hasSk
    ? ["Slovensko","Slovakia"]
    : hasCz
      ? ["Česko","Česká republika","Czechia"]
      : ["Česko","Česká republika","Czechia","Slovensko","Slovakia"];
}

function geocodeCandidateQueries(address){
  const clean=safe(address).replace(/\s+/g," ").trim();
  if(!clean) return [];
  const countryVariants=geocodeCountryVariants(clean);
  const noParen=clean.replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();
  const noCountry=noParen
    .replace(/\b(CZ|CR|ČR|SK|SR|Česko|Cesko|Česká republika|Ceska republika|Czechia|Slovensko|Slovakia)\b/gi," ")
    .replace(/\s+/g," ")
    .replace(/\s*,\s*$/,"")
    .trim();
  const base=[
    clean,
    noParen,
    noCountry,
    clean.replace(/\s+-.*$/,"").trim()
  ].filter(Boolean);
  const out=[];
  const push=q=>{
    const cleanQ=safe(q).replace(/\s+/g," ").replace(/\s*,\s*/g,", ").replace(/^,\s*|\s*,$/g,"").trim();
    if(cleanQ && !out.includes(cleanQ)) out.push(cleanQ);
  };
  const commaVariants=q=>{
    const parts=q.split(",").map(part=>safe(part)).filter(Boolean);
    const variants=[];
    if(parts.length>=2){
      const first=parts[0];
      const second=parts[1];
      const rest=parts.slice(2);
      variants.push([second,first,...rest].join(", "));
      variants.push([second,first].join(", "));
      variants.push(parts.slice(0,2).join(", "));
    }
    return variants;
  };
  const expanded=[];
  base.forEach(q=>{
    expanded.push(q);
    commaVariants(q).forEach(v=>expanded.push(v));
  });
  expanded.forEach(q=>{
    push(q);
    countryVariants.forEach(country=>push(`${q}, ${country}`));
  });
  return out.filter((q,idx,arr)=>q && arr.indexOf(q)===idx).slice(0,42);
}

function geocodeCandidateStructured(address){
  const clean=safe(address).replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();
  const parts=clean.split(",").map(part=>safe(part)).filter(Boolean);
  if(parts.length<2) return [];
  const countries=geocodeCountryVariants(clean).map(country=>country.includes("Sloven") || country==="Slovakia" ? "Slovensko" : "Česko")
    .filter((country,idx,arr)=>arr.indexOf(country)===idx);
  const variants=[];
  const add=(street,city,country)=>{
    street=safe(street); city=safe(city); country=safe(country);
    if(street && city) variants.push({street,city,country});
  };
  countries.forEach(country=>{
    add(parts[0],parts[1],country);
    add(parts[1],parts[0],country);
  });
  return variants.filter((item,idx,arr)=>idx===arr.findIndex(other=>other.street===item.street && other.city===item.city && other.country===item.country));
}

function geocodeReturnedHouseNumbers(item){
  const address=(item && item.address) || {};
  return [
    address.house_number,
    address.housenumber,
    address["addr:housenumber"],
    item && item.housenumber
  ].map(normalizeHouseNumberToken).filter(Boolean);
}

function geocodeHouseNumberMatches(requestedNumbers,item){
  if(!requestedNumbers.length) return true;
  const requested=new Set(requestedNumbers.flatMap(houseNumberVariants));
  const returned=geocodeReturnedHouseNumbers(item);
  const displayNumbers=geocodeRequestedHouseNumbers((item && (item.display_name || item.display)) || "");
  for(const number of [...returned,...displayNumbers]){
    for(const variant of houseNumberVariants(number)){
      if(requested.has(variant)) return true;
    }
  }
  return false;
}

function setGeocodeMessage(message){
  window.lastGeocodeMessage=safe(message);
}

function houseNumberNotVerifiedMessage(address){
  const numbers=geocodeRequestedHouseNumbers(address);
  return numbers.length
    ? `Našel jsem jen ulici/obec, ale neověřil číslo domu ${numbers.join(", ")}. Upřesni adresu nebo zadej GPS ručně.`
    : "";
}

async function geocodeNominatimParams(params,sourceAddress=""){
  try{
    const res=await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`,{headers:{"Accept":"application/json"}});
    if(!res.ok) throw new Error("Geokódování selhalo");
    return geocodePickResult(await res.json(),sourceAddress);
  }catch(e){
    throw e;
  }
}

export async function geocodeAddressGeneric(address){
  setGeocodeMessage("");
  const queries=geocodeCandidateQueries(address);
  if(!queries.length) return null;
  let lastError=null;
  const structured=geocodeCandidateStructured(address);
  for(const item of structured){
    const params=new URLSearchParams({
      format:"jsonv2",
      addressdetails:"1",
      limit:"5",
      "accept-language":"cs,sk,en",
      street:item.street,
      city:item.city
    });
    if(item.country) params.set("country",item.country);
    try{
      const picked=await geocodeNominatimParams(params,address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  for(const qText of queries){
    for(const countrycodes of ["cz,sk",""]){
      const params=new URLSearchParams({
        format:"jsonv2",
        addressdetails:"1",
        limit:"5",
        "accept-language":"cs,sk,en",
        q:qText
      });
      if(countrycodes) params.set("countrycodes",countrycodes);
      try{
        const picked=await geocodeNominatimParams(params,address);
        if(picked) return picked;
      }catch(e){
        lastError=e;
      }
    }
  }
  for(const qText of queries.slice(0,10)){
    try{
      const params=new URLSearchParams({q:qText,limit:"5"});
      const res=await fetch(`https://photon.komoot.io/api/?${params.toString()}`,{headers:{"Accept":"application/json"}});
      if(!res.ok){lastError=new Error("Geokódování selhalo");continue;}
      const picked=geocodePickPhoton(await res.json(),address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  if(lastError) console.warn("Geokódování adresy nenašlo výsledek",lastError);
  return null;
}

export async function geocodeAddressFast(address){
  setGeocodeMessage("");
  const queries=geocodeCandidateQueries(address).slice(0,12);
  if(!queries.length) return null;
  let lastError=null;
  for(const item of geocodeCandidateStructured(address).slice(0,4)){
    const params=new URLSearchParams({
      format:"jsonv2",
      addressdetails:"1",
      limit:"3",
      "accept-language":"cs,sk,en",
      street:item.street,
      city:item.city
    });
    if(item.country) params.set("country",item.country);
    try{
      const picked=await geocodeNominatimParams(params,address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  for(const qText of queries){
    const params=new URLSearchParams({
      format:"jsonv2",
      addressdetails:"1",
      limit:"3",
      "accept-language":"cs,sk,en",
      countrycodes:"cz,sk",
      q:qText
    });
    try{
      const picked=await geocodeNominatimParams(params,address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  for(const qText of queries.slice(0,4)){
    try{
      const params=new URLSearchParams({q:qText,limit:"3"});
      const res=await fetch(`https://photon.komoot.io/api/?${params.toString()}`,{headers:{"Accept":"application/json"}});
      if(!res.ok){lastError=new Error("Geokódování selhalo");continue;}
      const picked=geocodePickPhoton(await res.json(),address);
      if(picked) return picked;
    }catch(e){
      lastError=e;
    }
  }
  if(lastError) console.warn("Rychlé geokódování adresy nenašlo výsledek",lastError);
  return null;
}

function geocodePickResult(data,sourceAddress=""){
  if(!Array.isArray(data) || !data.length) return null;
  const requestedNumbers=geocodeRequestedHouseNumbers(sourceAddress);
  const usable=data
    .map(item=>({item,lat:Number(item.lat),lon:Number(item.lon)}))
    .filter(x=>Number.isFinite(x.lat) && Number.isFinite(x.lon));
  if(!usable.length) return null;
  const scored=usable.map(x=>({
    ...x,
    czSk:x.lat>=47 && x.lat<=51.5 && x.lon>=12 && x.lon<=23,
    houseMatch:geocodeHouseNumberMatches(requestedNumbers,x.item)
  }));
  let czSk=scored.find(x=>x.czSk && x.houseMatch) || scored.find(x=>x.houseMatch);
  if(!czSk && requestedNumbers.length){
    setGeocodeMessage(houseNumberNotVerifiedMessage(sourceAddress));
    return null;
  }
  czSk=czSk || scored.find(x=>x.czSk) || scored[0];
  return {
    lat:String(czSk.item.lat),
    lon:String(czSk.item.lon),
    display:czSk.item.display_name || "",
    address:czSk.item.address || {},
    houseNumberMatched:requestedNumbers.length ? true : undefined
  };
}

function geocodePickPhoton(data,sourceAddress=""){
  const features=Array.isArray(data?.features) ? data.features : [];
  const requestedNumbers=geocodeRequestedHouseNumbers(sourceAddress);
  const usable=features.map(feature=>{
    const coords=feature?.geometry?.coordinates || [];
    const lon=Number(coords[0]);
    const lat=Number(coords[1]);
    const props=feature.properties || {};
    return {
      feature,
      lat,
      lon,
      czSk:lat>=47 && lat<=51.5 && lon>=12 && lon<=23,
      houseMatch:geocodeHouseNumberMatches(requestedNumbers,{
        display:[
          props.name,
          props.street,
          props.housenumber,
          props.city || props.town || props.village,
          props.state,
          props.country
        ].filter(Boolean).join(", "),
        housenumber:props.housenumber,
        address:{house_number:props.housenumber}
      })
    };
  }).filter(x=>Number.isFinite(x.lat) && Number.isFinite(x.lon));
  if(!usable.length) return null;
  let czSk=usable.find(x=>x.czSk && x.houseMatch) || usable.find(x=>x.houseMatch);
  if(!czSk && requestedNumbers.length){
    setGeocodeMessage(houseNumberNotVerifiedMessage(sourceAddress));
    return null;
  }
  czSk=czSk || usable.find(x=>x.czSk) || usable[0];
  const p=czSk.feature.properties || {};
  const display=[
    p.name,
    p.street,
    p.housenumber,
    p.city || p.town || p.village,
    p.state,
    p.country
  ].filter(Boolean).join(", ");
  return {
    lat:String(czSk.lat),
    lon:String(czSk.lon),
    display,
    address:{
      house_number:p.housenumber || "",
      state:p.state || "",
      county:p.county || "",
      city:p.city || p.town || p.village || "",
      country:p.country || "",
      country_code:p.countrycode || ""
    }
  };
}
