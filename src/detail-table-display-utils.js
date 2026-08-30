export function createDetailTableDisplayHelpers({
  rawForSiteFieldLookup,
  detailRowClassName=()=>"",
  userSiteDataFields,
  userSiteDisplayText,
  userSiteFieldValue
}){
  function detailTableRows(r){
    const raw=rawForSiteFieldLookup(r);
    const rows=[];
    for(const spec of userSiteDataFields){
      if(spec.hideInDetail) continue;
      const value=userSiteFieldValue(r,spec,raw);
      if(spec.hideWhenEmpty && !String(value || "").trim()) continue;
      rows.push({spec,value,rowClassName:detailRowClassName(spec,value,r,raw)});
    }
    return rows;
  }

  function detailTableSignature(rowsForDetail){
    const rows=Array.isArray(rowsForDetail) ? rowsForDetail : [];
    let signature="";
    for(let i=0;i<rows.length;i++){
      const {spec,value,rowClassName}=rows[i];
      const key=String(spec.key);
      const text=String(value);
      const classes=String(rowClassName || "");
      if(i) signature+="\u001f";
      signature+=`${key.length}:${key}\u001e${text.length}:${text}\u001e${classes.length}:${classes}`;
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
    for(const {spec,value,rowClassName} of rowsForDetail){
      const row=document.createElement("div");
      row.className="history-detail-row";
      const extraClass=String(rowClassName || "");
      if(extraClass) row.classList.add(...extraClass.split(/\s+/).filter(Boolean));
      if(spec.type==="textarea" || String(value || "").includes("\n")) row.classList.add("detail-multiline-row");
      if(spec.important) row.classList.add("detail-important-row");
      const label=document.createElement("span");
      label.textContent=spec.label;
      const valueCell=document.createElement("span");
      valueCell.className="history-detail-value";
      valueCell.textContent=userSiteDisplayText(spec,value,r);
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
