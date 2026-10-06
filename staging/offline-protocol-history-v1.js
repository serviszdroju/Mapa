export function persistLoadedHistory(site, items, mergeLocalArray) {
  if (!site || !Array.isArray(items) || typeof mergeLocalArray !== "function") return;
  const protocols = [];
  const records = [];
  for (const item of items) {
    if (!item || typeof item !== "object") continue;
    if (item._type === "Protokol") protocols.push(item);
    else if (item._type === "Servisní záznam") records.push(item);
  }
  // The merge keeps pending local records and existing source identities intact.
  if (protocols.length) mergeLocalArray("protocolHistory", protocols, site, 180);
  if (records.length) mergeLocalArray("serviceHistory", records, site, 180);
}
