export function siteChildLocalKind(kind){
  return kind==="protocols" ? "protocolHistory" :
    kind==="serviceRecords" ? "serviceHistory" :
    kind==="photos" ? "photos" :
    kind==="attachments" ? "attachments" : "";
}

export function siteChildTypeLabel(kind){
  return kind==="protocols" ? "Protokol" :
    kind==="serviceRecords" ? "Servisní záznam" :
    kind==="attachments" ? "Příloha" : "";
}

export function siteChildDeltaFields(kind){
  if(kind==="photos" || kind==="attachments") return ["updatedAt","uploadedAt","createdAt","savedAt"];
  return ["updatedAt","syncedAt","savedAt","createdAt","date"];
}
