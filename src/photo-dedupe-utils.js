function safe(value){
  return String(value ?? "").trim();
}

function hashText(value){
  let h1=0x811c9dc5;
  let h2=0x01000193;
  const text=String(value ?? "");
  for(let i=0;i<text.length;i++){
    const code=text.charCodeAt(i);
    h1^=code;
    h1=Math.imul(h1,0x01000193);
    h2^=code + i;
    h2=Math.imul(h2,0x85ebca6b);
  }
  return `${(h1>>>0).toString(36)}${(h2>>>0).toString(36)}`;
}

function hexFromBuffer(buffer){
  const bytes=new Uint8Array(buffer);
  let out="";
  for(let i=0;i<bytes.length;i++) out+=bytes[i].toString(16).padStart(2,"0");
  return out;
}

function normalizeName(value){
  return safe(value).toLowerCase();
}

function normalizePhotoUrl(value){
  const url=safe(value);
  if(!url || url.startsWith("data:")) return "";
  if(!url.includes("/image/upload/")) return url;
  const marker="/image/upload/";
  const markerIndex=url.indexOf(marker);
  const prefix=url.slice(0,markerIndex+marker.length);
  let rest=url.slice(markerIndex+marker.length);
  const slashIndex=rest.indexOf("/");
  if(slashIndex>=0){
    const firstSegment=rest.slice(0,slashIndex);
    const firstSegmentIsVersion=/^v\d+$/i.test(firstSegment);
    const firstSegmentLooksTransform=/(^|,)(?:f_auto|q_auto|w_\d+|h_\d+|c_[a-z0-9_]+|dpr_|fl_|e_|g_|r_|ar_)/i.test(firstSegment);
    if(firstSegmentLooksTransform && !firstSegmentIsVersion) rest=rest.slice(slashIndex+1);
  }
  return prefix+rest;
}

export function photoFileFallbackSignature(file){
  if(!file) return "";
  return [
    normalizeName(file.name),
    safe(file.size || ""),
    safe(file.lastModified || ""),
    normalizeName(file.type)
  ].join("\u001f");
}

export async function photoFileDedupeInfo(file,cryptoSource=globalThis.crypto){
  const fallback=photoFileFallbackSignature(file);
  let sha256="";
  try{
    if(file && cryptoSource?.subtle && typeof file.arrayBuffer==="function"){
      sha256=hexFromBuffer(await cryptoSource.subtle.digest("SHA-256",await file.arrayBuffer()));
    }
  }catch(e){
    sha256="";
  }
  const key=sha256 ? `sha256:${sha256}` : `file:${fallback}`;
  return {
    sha256,
    photoFingerprint:key,
    photoDedupeKey:key,
    photoFileSignature:fallback
  };
}

export function stablePhotoIdForSite(siteKey,photoDedupeKey){
  const site=safe(siteKey) || "site";
  const key=safe(photoDedupeKey) || "photo";
  return `photo_${hashText(`${site}\u001f${key}`)}`;
}

export function photoDuplicateKeys(item,options={}){
  if(!item || typeof item!=="object") return [];
  const keys=[];
  const add=(prefix,value)=>{
    const text=safe(value);
    if(text) keys.push(`${prefix}:${text}`);
  };
  const addFingerprint=value=>{
    const text=safe(value);
    if(!text) return;
    add("fp",text);
    const sha=text.replace(/^sha256:/i,"");
    if(sha && sha!==text) add("fp",sha);
  };
  add("id",item._id || item.id || item.photoId || item.firebaseId || item.firebaseDocId);
  addFingerprint(item.photoFingerprint);
  addFingerprint(item.photoDedupeKey);
  addFingerprint(item.sha256);
  addFingerprint(item.checksum);
  add("cloud",item.cloudinaryPublicId);
  add("asset",item.cloudinaryAssetId);
  const urlValues=[
    item.fullUrl,
    item.displayUrl,
    item.url,
    item.thumbUrl,
    typeof options.photoDisplayUrl==="function" ? options.photoDisplayUrl(item) : ""
  ];
  for(const value of urlValues) add("url",normalizePhotoUrl(value));
  const fileName=normalizeName(item.fileName || item.originalFileName);
  const size=safe(item.originalSize || item.size || "");
  const takenAt=safe(item.takenAt || item.photoTakenAt || item.lastModifiedAt || "");
  if(fileName && size && takenAt) add("file",`${fileName}\u001f${size}\u001f${takenAt}`);
  return keys.filter((key,idx,arr)=>arr.indexOf(key)===idx);
}

export function createPhotoDedupe(items=[],options={}){
  const keys=new Set();
  const remember=item=>{
    const itemKeys=photoDuplicateKeys(item,options);
    const duplicate=itemKeys.some(key=>keys.has(key));
    for(const key of itemKeys) keys.add(key);
    return duplicate;
  };
  for(const item of items || []) remember(item);
  return {
    has:item=>photoDuplicateKeys(item,options).some(key=>keys.has(key)),
    add:item=>{
      if(!item) return false;
      if(remember(item)) return false;
      items.push(item);
      return true;
    },
    remember
  };
}
