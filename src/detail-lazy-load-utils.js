export function createDetailLazyLoadHelpers({
  detailHistoryNode,
  detailKey,
  drawerNode,
  getSelectedSite,
  loadHistory,
  loadSiteAttachments,
  loadSitePhotos,
  resetDetailHistory,
  resetSiteAttachmentInput,
  resetSiteAttachments,
  resetSitePhotoInput,
  resetSitePhotos,
  safe,
  setSiteAttachmentsStatusText,
  setSitePhotosStatusText,
  siteAttachmentsNode,
  siteAttachmentsStatusNode,
  sitePhotosListNode,
  sitePhotosStatusNode,
  updateOfficialProtocolSourceInfo
}){
  let detailLazyLoadKey="";
  let detailLazyLoadState={historyLoaded:false,historyLoading:false,photosLoaded:false,photosLoading:false,attachmentsLoaded:false,attachmentsLoading:false};

  function detailLazyKey(site=getSelectedSite()){
    if(!site) return "";
    return String(detailKey(site) || site.firebaseDocId || site.raw?.["Firebase_doc_id"] || site.id || "").trim();
  }

  function activeDetailTabName(){
    return drawerNode()?.dataset?.detailTab || "data";
  }

  function sameDetailLazySite(site=getSelectedSite()){
    return !!site && detailLazyKey(site)===detailLazyLoadKey;
  }

  function resetDetailLazyLoadState(site){
    detailLazyLoadKey=detailLazyKey(site);
    detailLazyLoadState={historyLoaded:false,historyLoading:false,photosLoaded:false,photosLoading:false,attachmentsLoaded:false,attachmentsLoading:false};
    resetDetailHistory();
    resetSitePhotos();
    const history=detailHistoryNode();
    if(history) history.textContent="Zatím nenačteno.";
    const photoList=sitePhotosListNode();
    if(photoList){
      const placeholder=document.createElement("div");
      placeholder.className="site-photos-empty";
      placeholder.textContent="Fotografie se načtou po otevření Galerie.";
      photoList.replaceChildren(placeholder);
    }
    resetSiteAttachments();
    const attachmentList=siteAttachmentsNode("siteAttachmentsList");
    if(attachmentList){
      const placeholder=document.createElement("div");
      placeholder.className="site-photos-empty";
      placeholder.textContent="Přílohy se načtou po otevření záložky Přílohy.";
      attachmentList.replaceChildren(placeholder);
    }
    setSitePhotosStatusText("");
    setSiteAttachmentsStatusText("");
    updateOfficialProtocolSourceInfo();
  }

  function startDetailAsyncLoads(site){
    resetDetailLazyLoadState(site);
    try{ resetSitePhotoInput(); }catch(e){}
    try{ resetSiteAttachmentInput(); }catch(e){}
  }

  function ensureDetailAsyncLoads(site){
    return ensureDetailTabLoad(activeDetailTabName(),site);
  }

  function ensureDetailTabLoad(tabName=activeDetailTabName(),site=getSelectedSite()){
    if(!site || !sameDetailLazySite(site)) return;
    if(tabName==="gallery"){
      if(detailLazyLoadState.photosLoaded || detailLazyLoadState.photosLoading) return;
      detailLazyLoadState.photosLoading=true;
      const st=sitePhotosStatusNode();
      if(st && !st.textContent) setSitePhotosStatusText("Načítám fotografie...");
      Promise.resolve(loadSitePhotos(site))
        .then(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.photosLoaded=true; })
        .catch(e=>{
          detailLazyLoadState.photosLoaded=false;
          console.warn("Načtení fotografií detailu selhalo",e);
        })
        .finally(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.photosLoading=false; });
    }
    if(tabName==="attachments"){
      if(detailLazyLoadState.attachmentsLoaded || detailLazyLoadState.attachmentsLoading) return;
      detailLazyLoadState.attachmentsLoading=true;
      const st=siteAttachmentsStatusNode();
      if(st && !st.textContent) setSiteAttachmentsStatusText("Načítám přílohy...");
      Promise.resolve(loadSiteAttachments(site))
        .then(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.attachmentsLoaded=true; })
        .catch(e=>{
          detailLazyLoadState.attachmentsLoaded=false;
          console.warn("Načtení příloh detailu selhalo",e);
        })
        .finally(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.attachmentsLoading=false; });
    }
    if(tabName==="protocol" || tabName==="document"){
      if(detailLazyLoadState.historyLoaded || detailLazyLoadState.historyLoading) return;
      detailLazyLoadState.historyLoading=true;
      Promise.resolve(loadHistory(site.id))
        .then(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.historyLoaded=true; })
        .catch(e=>{
          detailLazyLoadState.historyLoaded=false;
          console.warn("Načtení historie detailu selhalo",e);
        })
        .finally(()=>{ if(sameDetailLazySite(site)) detailLazyLoadState.historyLoading=false; });
    }
  }

  function refreshDetailTabLoad(tabName=activeDetailTabName(),site=getSelectedSite()){
    if(!site || !sameDetailLazySite(site)) return;
    if(tabName==="gallery"){
      detailLazyLoadState.photosLoaded=false;
      if(detailLazyLoadState.photosLoading) return;
      ensureDetailTabLoad("gallery",site);
    }
    if(tabName==="attachments"){
      detailLazyLoadState.attachmentsLoaded=false;
      if(detailLazyLoadState.attachmentsLoading) return;
      ensureDetailTabLoad("attachments",site);
    }
    if(tabName==="protocol" || tabName==="document"){
      detailLazyLoadState.historyLoaded=false;
      if(detailLazyLoadState.historyLoading) return;
      ensureDetailTabLoad(tabName,site);
    }
  }

  function refreshLoadedDetailTabs(site=getSelectedSite()){
    if(!site || !sameDetailLazySite(site)) return;
    const active=activeDetailTabName();
    if(active==="gallery" || detailLazyLoadState.photosLoaded){
      refreshDetailTabLoad("gallery",site);
    }
    if(active==="attachments" || detailLazyLoadState.attachmentsLoaded){
      refreshDetailTabLoad("attachments",site);
    }
    if(active==="protocol" || active==="document" || detailLazyLoadState.historyLoaded){
      refreshDetailTabLoad(active==="document" ? "document" : "protocol",site);
    }
  }

  return {
    activeDetailTabName,
    detailLazyKey,
    ensureDetailAsyncLoads,
    ensureDetailTabLoad,
    refreshDetailTabLoad,
    refreshLoadedDetailTabs,
    resetDetailLazyLoadState,
    sameDetailLazySite,
    startDetailAsyncLoads
  };
}
