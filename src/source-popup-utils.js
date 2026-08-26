export function createSourcePopupHelpers({
  detailKey,
  escValue,
  getLeaflet,
  getMap,
  markerRowsSignature,
  openDetailById,
  siteSourceLabel,
  stableSignature,
  statusText
}){
  let sourcePopupLastHandledKey="";
  let sourcePopupLastHandledAt=0;

  function resetSourcePopupActivationGuard(){
    sourcePopupLastHandledKey="";
    sourcePopupLastHandledAt=0;
  }

  function activateSourcePopupButton(sourceBtn,event){
    if(!sourceBtn) return false;
    const key=sourceBtn.getAttribute("data-source-popup-key");
    if(!key) return false;
    if(event){
      if(event.cancelable) event.preventDefault();
      event.stopPropagation();
      if(event.stopImmediatePropagation) event.stopImmediatePropagation();
      try{
        const leaflet=getLeaflet();
        if(leaflet && leaflet.DomEvent) leaflet.DomEvent.stopPropagation(event);
      }catch(e){}
    }
    const now=Date.now();
    if(sourcePopupLastHandledKey===key && now-sourcePopupLastHandledAt<450) return true;
    sourcePopupLastHandledKey=key;
    sourcePopupLastHandledAt=now;
    openDetailById(key);
    try{
      const map=getMap();
      if(map && typeof map.closePopup==="function") map.closePopup();
    }catch(e){}
    return true;
  }

  function handleSourcePopupActivation(event){
    const target=event && event.target;
    const sourceBtn=target && target.closest ? target.closest("[data-source-popup-key]") : null;
    if(sourceBtn) activateSourcePopupButton(sourceBtn,event);
  }

  function bindSourcePopupHandlers(doc=document){
    if(!doc || doc.__szzSourcePopupHandlersBound) return;
    doc.__szzSourcePopupHandlersBound=true;
    doc.addEventListener("click",handleSourcePopupActivation,true);
    doc.addEventListener("touchend",handleSourcePopupActivation,{capture:true,passive:false});
  }

  function sourceButtonHtml(row){
    return `<button class="source-popup-btn" type="button" data-source-popup-key="${escValue(detailKey(row))}">${escValue(siteSourceLabel(row))}<small>${escValue(statusText(row))}</small></button>`;
  }

  function groupPopupHtml(group){
    if(!group) return "";
    const rowsInGroup=group.rows || [];
    const primary=rowsInGroup[0] || null;
    const signature=stableSignature([
      group.key || "",
      group.label || "",
      primary ? primary.adresa || "" : "",
      rowsInGroup.length,
      group._markerRowsSignature || markerRowsSignature(rowsInGroup)
    ]);
    if(group._popupHtmlSignature===signature && group._popupHtml){
      return group._popupHtml;
    }
    let html="";
    if(rowsInGroup.length<=1){
      const r=primary;
      html=r ? `<b>${escValue(r.adresa||"Bez názvu")}</b><br>${escValue(siteSourceLabel(r))}<br>${escValue(statusText(r))}<br><button class="source-popup-btn source-popup-detail-btn" type="button" data-source-popup-key="${escValue(detailKey(r))}">Detail</button>` : "";
    }else{
      let sourceButtonsHtml="";
      for(const row of rowsInGroup){
        sourceButtonsHtml+=sourceButtonHtml(row);
      }
      html=`<b>${escValue(group.label || "Místo")}</b><br>${rowsInGroup.length} zdrojů na jednom místě<div class="source-popup-list">${sourceButtonsHtml}</div>`;
    }
    group._popupHtmlSignature=signature;
    group._popupHtml=html;
    return html;
  }

  bindSourcePopupHandlers();

  return {
    activateSourcePopupButton,
    bindSourcePopupHandlers,
    groupPopupHtml,
    resetSourcePopupActivationGuard
  };
}
