import { safe } from "./core-utils.js";
import { parseDateValue } from "./schedule-status.js";

export function createPhotoFolderHelpers({
  cloudinaryPhotos={},
  photoCloudinaryVersionDate
}={}){
  const photoFolderNameCache=new WeakMap();
  const sitePhotoFolderGroupsCache=new WeakMap();
  const cloudinaryVersionDate=item=>typeof photoCloudinaryVersionDate==="function" ? photoCloudinaryVersionDate(item) : "";

  function photoFolderNameForDate(value=new Date()){
    let d=null;
    if(value && typeof value.toDate==="function") d=value.toDate();
    else if(value instanceof Date) d=value;
    else d=parseDateValue(value);
    if(!d || isNaN(d.getTime())) d=new Date();
    const y=d.getFullYear();
    const m=String(d.getMonth()+1).padStart(2,"0");
    const day=String(d.getDate()).padStart(2,"0");
    return `${y}-${m}-${day}`;
  }

  function normalizePhotoFolderDateName(value="",fallback=new Date()){
    const raw=safe(value);
    const last=raw.split(/[\\/]/).map(part=>safe(part)).filter(Boolean).pop() || raw;
    const candidates=[last,raw,fallback].map(item=>safe(item)).filter(Boolean);
    for(const candidate of candidates){
      const d=parseDateValue(candidate);
      if(d && !isNaN(d.getTime())) return photoFolderNameForDate(d);
    }
    return photoFolderNameForDate(new Date());
  }

  function photoFolderDateFingerprint(value){
    if(value && typeof value.toDate==="function"){
      try{return `ts:${value.toDate().getTime()}`;}catch(e){}
    }
    if(value instanceof Date) return `date:${value.getTime()}`;
    return safe(value);
  }

  function photoFolderNameFingerprint(item){
    if(!item || (typeof item!=="object" && typeof item!=="function")) return "";
    const explicit=safe(item.photoFolder || item.folderName || item.folder || item.cloudinaryFolderDate || item.cloudinaryFolder);
    const fallbackDate=item.createdAt || item.uploadedAt || item.date || "";
    const version=safe(item.cloudinaryVersion || item.version);
    const fallback=photoFolderDateFingerprint(fallbackDate);
    if(!explicit && !fallback && !version) return "";
    return [explicit,fallback,version].join("\u001f");
  }

  function photoFolderName(item){
    const canCache=!!(item && (typeof item==="object" || typeof item==="function"));
    const fingerprint=canCache ? photoFolderNameFingerprint(item) : "";
    if(canCache && fingerprint){
      const cached=photoFolderNameCache.get(item);
      if(cached && cached.fingerprint===fingerprint) return cached.value;
    }
    const explicit=safe(item && (item.photoFolder || item.folderName || item.folder || item.cloudinaryFolderDate || item.cloudinaryFolder));
    const fallbackDate=item?.createdAt || item?.uploadedAt || item?.date || cloudinaryVersionDate(item);
    const value=explicit
      ? normalizePhotoFolderDateName(explicit,fallbackDate)
      : photoFolderNameForDate(fallbackDate);
    if(canCache && fingerprint) photoFolderNameCache.set(item,{fingerprint,value});
    return value;
  }

  function cloudinaryPhotoFolderPath(folderName){
    const base=safe(cloudinaryPhotos.folder);
    const folder=safe(folderName);
    return [base,folder].filter(Boolean).join("/");
  }

  function sitePhotoFolderGroupsFingerprint(items){
    const source=Array.isArray(items) ? items : [];
    let out="";
    for(let idx=0;idx<source.length;idx++){
      const photo=source[idx];
      if(idx) out+="\u001e";
      out+=String(idx)
        +"\u001f"+safe(photo && (photo._id || photo.id || ""))
        +"\u001f"+photoFolderNameFingerprint(photo)
        +"\u001f"+safe(photo && (photo.createdAt || photo.uploadedAt || photo.date || ""))
        +"\u001f"+safe(photo && (photo.cloudinaryVersion || photo.version || ""));
    }
    return out;
  }

  function sitePhotoFolderGroups(items){
    const canCache=Array.isArray(items);
    const fingerprint=canCache ? sitePhotoFolderGroupsFingerprint(items) : "";
    if(canCache){
      const cached=sitePhotoFolderGroupsCache.get(items);
      if(cached && cached.fingerprint===fingerprint) return cached.groups;
    }
    const groups=new Map();
    const source=Array.isArray(items) ? items : [];
    for(let idx=0;idx<source.length;idx++){
      const photo=source[idx];
      const folder=photoFolderName(photo);
      if(!groups.has(folder)) groups.set(folder,[]);
      groups.get(folder).push({photo,idx});
    }
    const result=[];
    for(const [folder,photos] of groups){
      result.push({folder,photos});
    }
    if(canCache) sitePhotoFolderGroupsCache.set(items,{fingerprint,groups:result});
    return result;
  }

  return {
    cloudinaryPhotoFolderPath,
    photoFolderName,
    photoFolderNameFingerprint,
    photoFolderNameForDate,
    sitePhotoFolderGroups,
    sitePhotoFolderGroupsFingerprint
  };
}
