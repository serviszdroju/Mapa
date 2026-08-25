import { safe } from "./core-utils.js";

export function attachmentDisplayUrl(item={}){
  return safe(item.url || item.downloadUrl || item.fullUrl || item.dataUrl);
}

export function attachmentFileName(item={},idx=0){
  return safe(item.fileName || item.originalFileName || `priloha-${idx+1}`) || `priloha-${idx+1}`;
}

export function attachmentRenderSignature(items=[]){
  const source=Array.isArray(items) ? items : [];
  let out="";
  for(let idx=0;idx<source.length;idx++){
    const item=source[idx] || {};
    if(idx) out+="\u001e";
    out+=[
      item._id || item.id,
      item.fileName,
      item.size,
      item.type,
      item.createdAt,
      item.uploadedBy,
      attachmentDisplayUrl(item)
    ].map(safe).map(value=>`${value.length}:${value}`).join("\u001f");
  }
  return out;
}
