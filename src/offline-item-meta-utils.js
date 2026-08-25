import { safe } from "./core-utils.js";
import { timeValueFromAny } from "./history-time-utils.js";

export function szzTimeMsFromAny(value){
  if(value && typeof value.toDate==="function") return value.toDate().getTime();
  if(value && typeof value.seconds==="number") return Number(value.seconds)*1000 + Math.round((Number(value.nanoseconds) || 0)/1000000);
  const fromHelper=typeof timeValueFromAny==="function" ? timeValueFromAny(value) : 0;
  if(Number.isFinite(fromHelper) && fromHelper>0) return fromHelper;
  const parsed=Date.parse(safe(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function szzRecordUpdatedMs(item={}){
  return Math.max(
    szzTimeMsFromAny(item.updatedAt),
    szzTimeMsFromAny(item.syncedAt),
    szzTimeMsFromAny(item.uploadedAt),
    szzTimeMsFromAny(item.savedAt),
    szzTimeMsFromAny(item.createdAt),
    szzTimeMsFromAny(item.date),
    szzTimeMsFromAny(item.checkDate),
    szzTimeMsFromAny(item.cloudinaryVersion ? Number(item.cloudinaryVersion)*1000 : 0)
  );
}

export function szzItemsMeta(items=[]){
  const list=Array.isArray(items) ? items : [];
  let latestMs=0;
  const ids=[];
  list.forEach((item,idx)=>{
    latestMs=Math.max(latestMs,szzRecordUpdatedMs(item));
    ids.push(safe(item?._id || item?.id || `${idx}`));
  });
  return {
    count:list.length,
    latestMs,
    signature:ids.sort().join("|")
  };
}

export function cloneSzzItemsMeta(meta={}){
  return {
    count:Number(meta.count) || 0,
    latestMs:Number(meta.latestMs) || 0,
    signature:safe(meta.signature)
  };
}

export function szzDetailMetaChanged(before=null,after=null){
  if(!before || !after) return true;
  return before.count!==after.count || before.latestMs!==after.latestMs || before.signature!==after.signature;
}
