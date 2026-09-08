import { safe } from "./core-utils.js";

export function mergeMainProtocolHistoryItemsPreferFirebase(localItems=[],firebaseItems=[]){
  const items=[];
  const indexById=new Map();
  const add=(item,preferIncoming=false)=>{
    if(!item) return;
    const id=safe(item._id || item.id);
    if(!id){
      items.push(item);
      return;
    }
    if(indexById.has(id)){
      if(preferIncoming){
        const idx=indexById.get(id);
        items[idx]={...items[idx],...item};
      }
      return;
    }
    indexById.set(id,items.length);
    items.push(item);
  };
  (Array.isArray(localItems) ? localItems : []).forEach(item=>add(item,false));
  (Array.isArray(firebaseItems) ? firebaseItems : []).forEach(item=>add(item,true));
  return items;
}
