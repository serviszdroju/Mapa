export function cloneLocalStorageArrayEntries(entries=[]){
  const source=Array.isArray(entries) ? entries : [];
  const out=[];
  for(const entry of source){
    out.push({
      key:entry.key,
      suffix:entry.suffix,
      items:Array.isArray(entry.items) ? entry.items.slice() : []
    });
  }
  return out;
}

export function cloneLocalStorageArrayItems(items=[]){
  const source=Array.isArray(items) ? items : [];
  const out=[];
  for(const item of source){
    out.push(item && typeof item==="object" ? {...item} : item);
  }
  return out;
}

export function cloneLocalStorageObjectEntries(entries=[]){
  const source=Array.isArray(entries) ? entries : [];
  const out=[];
  for(const entry of source){
    out.push({
      key:entry.key,
      suffix:entry.suffix,
      item:entry.item && typeof entry.item==="object" ? {...entry.item} : entry.item
    });
  }
  return out;
}

export function cloneLocalStorageObjectItem(item){
  return item && typeof item==="object" && !Array.isArray(item) ? {...item} : {};
}
