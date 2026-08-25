import { safe } from "./core-utils.js";

const formFieldNodeCache=new Map();

export function formFieldNode(id){
  const key=safe(id);
  if(!key) return null;
  const cached=formFieldNodeCache.get(key);
  if(cached && cached.isConnected && cached.id===key) return cached;
  const el=document.getElementById(key);
  if(el) formFieldNodeCache.set(key,el);
  else formFieldNodeCache.delete(key);
  return el;
}

export function drawerNode(){
  return formFieldNode("drawer");
}
export function detailTitleNode(){
  return formFieldNode("detailTitle");
}
export function detailSubNode(){
  return formFieldNode("detailSub");
}
export function detailTableNode(){
  return formFieldNode("detailTable");
}
export function newSiteCardNode(){
  return formFieldNode("newSiteCard");
}
export function sourceChooserNode(){
  return formFieldNode("sourceChooser");
}
export function detailLastCheckNode(){
  return formFieldNode("detailLastCheck");
}
export function detailNextCheckNode(){
  return formFieldNode("detailNextCheck");
}
export function officialProtocolStatusNode(){
  return formFieldNode("officialProtocolStatus");
}
export function officialProtocolDataBoxNode(){
  return formFieldNode("officialProtocolDataBox");
}
export function officialProtocolSourceInfoNode(){
  return formFieldNode("officialProtocolSourceInfo");
}
export function officialManufacturerSelectNode(){
  return formFieldNode("officialManufacturerSelect");
}
export function sidebarListNode(){
  return formFieldNode("list");
}
export function shownCountNode(){
  return formFieldNode("shownCount");
}
export function gpsCountNode(){
  return formFieldNode("gpsCount");
}
export function gpsBoxNode(){
  return formFieldNode("gpsBox");
}

export function setInputValue(id,value){
  const el=formFieldNode(id);
  const next=String(value ?? "");
  if(el && el.value!==next) el.value=next;
}

export function setInputChecked(id,value){
  const el=formFieldNode(id);
  if(el && el.checked!==!!value) el.checked=!!value;
}

export function setInputValueIfExists(selector,value){
  const el=document.querySelector(selector);
  const next=String(value ?? "");
  if(el && el.value!==next) el.value=next;
}
