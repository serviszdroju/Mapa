import { safe } from "./core-utils.js";

const CLOUDINARY_TRANSFORM_URL_CACHE_LIMIT=800;
const cloudinaryTransformUrlCache=new Map();

function rememberCloudinaryTransformUrl(cacheKey,value){
  cloudinaryTransformUrlCache.set(cacheKey,value);
  if(cloudinaryTransformUrlCache.size>CLOUDINARY_TRANSFORM_URL_CACHE_LIMIT){
    const firstKey=cloudinaryTransformUrlCache.keys().next().value;
    if(firstKey) cloudinaryTransformUrlCache.delete(firstKey);
  }
  return value;
}

export function cloudinaryTransformUrl(url,transformation){
  const s=safe(url);
  const t=safe(transformation);
  if(!s || !t || !s.includes("/image/upload/")) return s;
  if(s.includes(`/image/upload/${t}/`)) return s;
  const cacheKey=`${t}|${s}`;
  const cached=cloudinaryTransformUrlCache.get(cacheKey);
  if(cached) return cached;
  const marker="/image/upload/";
  const markerIndex=s.indexOf(marker);
  const prefix=s.slice(0,markerIndex+marker.length);
  const rest=s.slice(markerIndex+marker.length);
  const slashIndex=rest.indexOf("/");
  if(slashIndex<0) return s;
  const firstSegment=rest.slice(0,slashIndex);
  const remaining=rest.slice(slashIndex+1);
  const firstSegmentIsVersion=/^v\d+$/i.test(firstSegment);
  const firstSegmentLooksTransform=/(^|,)(?:f_auto|q_auto|w_\d+|h_\d+|c_[a-z0-9_]+|dpr_|fl_|e_|g_|r_|ar_)/i.test(firstSegment);
  const transformed=firstSegmentLooksTransform && !firstSegmentIsVersion
    ? `${prefix}${t}/${remaining}`
    : `${prefix}${t}/${rest}`;
  return rememberCloudinaryTransformUrl(cacheKey,transformed);
}

export function fileBaseName(name){
  return safe(name || "fotografie").replace(/\.[^.]+$/,"") || "fotografie";
}

export function photoFileName(item,idx=0){
  const base=fileBaseName(item?.fileName || item?.originalFileName || `fotografie-${idx+1}`)
    .replace(/[^\p{L}\p{N}_-]+/gu,"_")
    .replace(/^_+|_+$/g,"")
    .slice(0,70) || `fotografie-${idx+1}`;
  return `${base}.jpg`;
}

export function bytesLabel(bytes){
  const n=Number(bytes || 0);
  if(!Number.isFinite(n) || n<=0) return "";
  if(n<1024) return `${Math.round(n)} B`;
  if(n<1024*1024) return `${Math.round(n/1024)} kB`;
  return `${(n/1024/1024).toFixed(1).replace(".",",")} MB`;
}

export function createPhotoUrlHelpers(){
  const photoUrlBundleCache=new WeakMap();

  function photoUrlFingerprint(item){
    if(!item || (typeof item!=="object" && typeof item!=="function")) return "";
    return [
      item.displayUrl,
      item.url,
      item.fullUrl,
      item.originalUrl,
      item.downloadUrl,
      item.dataUrl,
      item.thumbUrl,
      item.previewUrl,
      item.thumbnailUrl
    ].map(safe).join("\u001f");
  }

  function computePhotoDisplayUrl(item){
    const explicit=safe(item && (item.displayUrl || item.url));
    if(explicit) return cloudinaryTransformUrl(explicit,"f_auto,q_auto,w_1600,c_limit");
    const original=safe(item && (item.fullUrl || item.originalUrl || item.downloadUrl));
    if(original) return cloudinaryTransformUrl(original,"f_auto,q_auto,w_1600,c_limit");
    return safe(item && item.dataUrl);
  }

  function computePhotoFullUrl(item){
    return safe(item && (item.fullUrl || item.originalUrl || item.downloadUrl || item.url || item.displayUrl || item.dataUrl));
  }

  function computePhotoThumbUrl(item,displayUrl=""){
    const original=safe(item && (item.fullUrl || item.originalUrl || item.downloadUrl));
    if(original) return cloudinaryTransformUrl(original,"f_auto,q_auto,w_240,c_limit");
    const explicit=safe(item && (item.thumbUrl || item.previewUrl || item.thumbnailUrl));
    const fallback=displayUrl || computePhotoDisplayUrl(item);
    return cloudinaryTransformUrl(explicit || fallback,"f_auto,q_auto,w_240,c_limit");
  }

  function photoUrlBundle(item){
    const canCache=!!(item && (typeof item==="object" || typeof item==="function"));
    const fingerprint=canCache ? photoUrlFingerprint(item) : "";
    if(canCache && fingerprint){
      const cached=photoUrlBundleCache.get(item);
      if(cached && cached.fingerprint===fingerprint) return cached.urls;
    }
    const display=computePhotoDisplayUrl(item);
    const full=computePhotoFullUrl(item);
    const thumb=computePhotoThumbUrl(item,display);
    const urls={display,full,thumb};
    if(canCache && fingerprint) photoUrlBundleCache.set(item,{fingerprint,urls});
    return urls;
  }

  function photoDisplayUrl(item){
    return photoUrlBundle(item).display;
  }

  function photoFullUrl(item){
    return photoUrlBundle(item).full;
  }

  function photoThumbUrl(item){
    return photoUrlBundle(item).thumb;
  }

  return {
    photoDisplayUrl,
    photoFullUrl,
    photoThumbUrl,
    photoUrlBundle
  };
}
