import { APP_REGION_OPTIONS } from "./app-options.js";
import {
  TEXT_NORM_CACHE_MAX_LENGTH,
  readTextNormCache,
  regionNormCache,
  rememberTextNormCache,
  safe
} from "./core-utils.js";

export function regionTextNorm(value){
  const text=safe(value);
  if(text.length<=TEXT_NORM_CACHE_MAX_LENGTH){
    const cached=readTextNormCache(regionNormCache,text);
    if(cached!==undefined) return cached;
  }
  const normalized=text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/[^\p{L}\p{N}]+/gu," ")
    .replace(/\s+/g," ")
    .trim();
  return text.length<=TEXT_NORM_CACHE_MAX_LENGTH ? rememberTextNormCache(regionNormCache,text,normalized) : normalized;
}

const REGION_ALIAS_SPECS=[
  ["Hlavní město Praha",["praha","hlavni mesto praha","prague"]],
  ["Středočeský kraj",["stredocesky","stredocesky kraj","central bohemian"]],
  ["Jihočeský kraj",["jihocesky","jihocesky kraj","south bohemian"]],
  ["Plzeňský kraj",["plzensky","plzensky kraj","pilsen"]],
  ["Karlovarský kraj",["karlovarsky","karlovarsky kraj"]],
  ["Ústecký kraj",["ustecky","ustecky kraj"]],
  ["Liberecký kraj",["liberecky","liberecky kraj"]],
  ["Královéhradecký kraj",["kralovehradecky","kralovehradecky kraj"]],
  ["Pardubický kraj",["pardubicky","pardubicky kraj"]],
  ["Kraj Vysočina",["vysocina","kraj vysocina"]],
  ["Jihomoravský kraj",["jihomoravsky","jihomoravsky kraj","south moravian"]],
  ["Olomoucký kraj",["olomoucky","olomoucky kraj"]],
  ["Moravskoslezský kraj",["moravskoslezsky","moravskoslezsky kraj"]],
  ["Zlínský kraj",["zlinsky","zlinsky kraj"]],
  ["Slovensko",["slovensko","slovakia","sk","slovenska republika"]]
];
let normalizedRegionOptionsCache=null;
let normalizedRegionAliasesCache=null;

function normalizedRegionOptions(){
  if(!normalizedRegionOptionsCache){
    normalizedRegionOptionsCache=APP_REGION_OPTIONS.map(region=>({region,norm:regionTextNorm(region)}));
  }
  return normalizedRegionOptionsCache;
}

function normalizedRegionAliases(){
  if(!normalizedRegionAliasesCache){
    normalizedRegionAliasesCache=REGION_ALIAS_SPECS.map(([region,words])=>({
      region,
      words:words
        .map(word=>regionTextNorm(word))
        .filter(Boolean)
        .map(norm=>({norm,boundary:norm.length<=2 ? new RegExp(`(^|\\s)${norm}(\\s|$)`) : null}))
    }));
  }
  return normalizedRegionAliasesCache;
}

export function canonicalRegionValue(value){
  const normalized=regionTextNorm(value);
  if(!normalized) return "";
  for(const {region,norm} of normalizedRegionOptions()){
    if(normalized===norm || normalized.includes(norm)) return region;
  }
  for(const {region,words} of normalizedRegionAliases()){
    if(words.some(({norm,boundary})=>{
      if(normalized===norm) return true;
      if(boundary) return boundary.test(normalized);
      return normalized.includes(norm);
    })) return region;
  }
  return "";
}

export function inferRegionFromAddressText(text,addressObj={}){
  const combined=regionTextNorm([
    text,
    addressObj.state,
    addressObj.region,
    addressObj.county,
    addressObj.city,
    addressObj.town,
    addressObj.village,
    addressObj.country,
    addressObj.country_code
  ].filter(Boolean).join(" "));
  if(!combined) return "";

  const fromAddress=canonicalRegionValue([
    addressObj.state,
    addressObj.region,
    addressObj.county,
    addressObj.country,
    addressObj.country_code
  ].filter(Boolean).join(" "));
  if(fromAddress) return fromAddress;
  if(/\b(sk|slovensko|slovakia|bratislava|trnava|poprad|zilina|zvolen|banska bystrica|nitra|kosice)\b/.test(combined)) return "Slovensko";

  const direct=canonicalRegionValue(combined);
  if(direct) return direct;
  const hints=[
    ["Hlavní město Praha",["praha","prague"]],
    ["Jihomoravský kraj",["brno","brno venkov","blansko","breclav","hodonin","vyskov","znojmo"]],
    ["Středočeský kraj",["kladno","kralupy","melnik","nymburk","benesov","kolin","kutna hora","pribram","rakovnik","beroun","mlada boleslav"]],
    ["Jihočeský kraj",["ceske budejovice","cesky krumlov","jindrichuv hradec","pisek","prachatice","strakonice","tabor","cimelice"]],
    ["Plzeňský kraj",["plzen","klatovy","rokycany","tachov","domazlice","plzen sever","plzen jih"]],
    ["Karlovarský kraj",["karlovy vary","cheb","sokolov","vejprty"]],
    ["Ústecký kraj",["usti nad labem","decin","chomutov","litomerice","louny","most","teplice"]],
    ["Liberecký kraj",["liberec","jablonec","semily","ceska lipa","turnov"]],
    ["Královéhradecký kraj",["hradec kralove","jicin","nachod","trutnov","rychnov","vrchlabi","pec pod snezkou"]],
    ["Pardubický kraj",["pardubice","chrudim","svitavy","usti nad orlici","chocen","vamberk"]],
    ["Kraj Vysočina",["jihlava","havlickuv brod","pelhrimov","trebic","zdar nad sazavou","humpolec","pacov","velke mezirici"]],
    ["Olomoucký kraj",["olomouc","prostejov","prerov","sumperk","jesenik","slatinice"]],
    ["Moravskoslezský kraj",["ostrava","opava","frydek mistek","karvina","novy jicin","bruntal","cesky tesin"]],
    ["Zlínský kraj",["zlin","kromeriz","uherske hradiste","uhersky brod","vsetin","slusovice","luhacovice"]]
  ];
  for(const [region,words] of hints){
    if(words.some(word=>combined.includes(word))) return region;
  }
  return "";
}
