export function createMapStatusParityHelpers({
  color,
  detailKey,
  groupColor,
  groupHasUsableGps,
  groupPrimaryRow,
  groupRowsByPlace,
  inCzSk,
  siteSourceLabel,
  statusText
}){
  function mapStatusParitySnapshot(inputRows=[]){
    const mapRows=[];
    for(const row of inputRows || []){
      if(inCzSk(row)) mapRows.push(row);
    }
    const groups=groupRowsByPlace(mapRows);
    return groups
      .filter(groupHasUsableGps)
      .map(group=>{
        const rep=groupPrimaryRow(group);
        return {
          key:String(group.key || ""),
          label:String(group.label || ""),
          lat:Number.isFinite(group.lat) ? Number(group.lat.toFixed(6)) : null,
          lon:Number.isFinite(group.lon) ? Number(group.lon.toFixed(6)) : null,
          count:(group.rows || []).length,
          color:groupColor(group.rows || []),
          status:rep ? statusText(rep) : "",
          representative:rep ? detailKey(rep) : "",
          sources:(group.rows || []).map(row=>({
            key:detailKey(row),
            source:siteSourceLabel(row),
            color:color(row),
            status:statusText(row)
          }))
        };
      })
      .sort((a,b)=>a.key.localeCompare(b.key,"cs",{sensitivity:"base"}));
  }

  return {mapStatusParitySnapshot};
}
