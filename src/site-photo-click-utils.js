export function createSitePhotoClickHelpers({
  deleteCurrentSitePhoto,
  getSitePhotoIndex,
  getSitePhotoItems,
  renderSitePhotos,
  setSitePhotoIndex
}){
  function bindSitePhotoListClicks(list){
    if(!list || list.__szzPhotoClickBound) return;
    list.__szzPhotoClickBound=true;
    list.addEventListener("click",event=>{
      const button=event.target.closest && event.target.closest("button");
      const items=getSitePhotoItems();
      if(button && list.contains(button)){
        if(button.id==="sitePhotoPrevBtn"){
          if(items.length>1){
            setSitePhotoIndex((getSitePhotoIndex()-1+items.length)%items.length);
            renderSitePhotos(items,true);
          }
          return;
        }
        if(button.id==="sitePhotoNextBtn"){
          if(items.length>1){
            setSitePhotoIndex((getSitePhotoIndex()+1)%items.length);
            renderSitePhotos(items,true);
          }
          return;
        }
        if(button.id==="deleteSitePhotoBtn"){
          deleteCurrentSitePhoto();
          return;
        }
      }
      const btn=event.target.closest && event.target.closest("[data-photo-idx]");
      if(!btn || !list.contains(btn)) return;
      const nextIndex=Number(btn.getAttribute("data-photo-idx")) || 0;
      if(getSitePhotoIndex()!==nextIndex){
        setSitePhotoIndex(nextIndex);
        renderSitePhotos(items,true);
      }
    });
  }

  return { bindSitePhotoListClicks };
}
