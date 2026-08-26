export function createDetailTableDisplayHelpers({
  rawForSiteFieldLookup,
  userSiteDataFields,
  userSiteDisplayText,
  userSiteFieldValue
}){
  function detailTableRows(r){
    const raw=rawForSiteFieldLookup(r);
    const rows=[];
    for(const spec of userSiteDataFields){
      if(spec.hideInDetail) continue;
      rows.push({spec,value:userSiteFieldValue(r,spec,raw)});
    }
    return rows;
  }

  function detailTableSignature(rowsForDetail){
    const rows=Array.isArray(rowsForDetail) ? rowsForDetail : [];
    let signature="";
    for(let i=0;i<rows.length;i++){
      const {spec,value}=rows[i];
      const key=String(spec.key);
      const text=String(value);
      if(i) signature+="\u001f";
      signature+=`${key.length}:${key}\u001e${text.length}:${text}`;
    }
    return signature;
  }

  function renderDetailTable(table,r){
    if(!table) return;
    table.classList.remove("data-edit-table");
    table.classList.add("history-item","small","detail-history-table");
    const rowsForDetail=detailTableRows(r);
    const signature=detailTableSignature(rowsForDetail);
    if(table.dataset.detailTableMode==="display" && table.dataset.detailSignature===signature && table.childElementCount){
      return;
    }
    const fragment=document.createDocumentFragment();
    for(const {spec,value} of rowsForDetail){
      const row=document.createElement("div");
      row.className="history-detail-row";
      if(spec.type==="textarea" || String(value || "").includes("\n")) row.classList.add("detail-multiline-row");
      if(spec.important) row.classList.add("detail-important-row");
      const label=document.createElement("span");
      label.textContent=spec.label;
      const valueCell=document.createElement("span");
      valueCell.className="history-detail-value";
      valueCell.textContent=userSiteDisplayText(spec,value);
      row.append(label,valueCell);
      fragment.appendChild(row);
    }
    table.replaceChildren(fragment);
    table.dataset.detailTableMode="display";
    table.dataset.detailSignature=signature;
  }

  return {
    renderDetailTable
  };
}
