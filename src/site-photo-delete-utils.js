export function createSitePhotoDeleteHelpers({
  canDeleteSitePhoto,
  deleteCloudinaryUpload,
  deleteSiteChildItem,
  getSelectedSite,
  getSitePhotoIndex,
  getSitePhotoItems,
  removeEmbeddedSiteItem,
  removeOfflinePhotoItem,
  removeSiteLocalItem,
  renderSitePhotos,
  safe,
  setSitePhotoIndex,
  setSitePhotoItems,
  setSitePhotosStatusText,
  showSaveConfirmation,
  sitePhotoDeleteTokens
}){
  async function deleteCurrentSitePhoto(){
    const items=getSitePhotoItems();
    const index=getSitePhotoIndex();
    const selectedSite=getSelectedSite();
    const item=items[index];
    if(!item || !safe(item._id)){
      setSitePhotosStatusText("Není vybraná fotografie ke smazání.");
      return;
    }
    if(!canDeleteSitePhoto(item)){
      setSitePhotosStatusText("Tuhle fotografii může smazat správce nebo ten, kdo ji nahrál.");
      return;
    }
    if(!confirm("Opravdu smazat tuto fotografii?")) return;
    try{
      setSitePhotosStatusText("Mažu fotografii...");
      const id=safe(item._id);
      await deleteSiteChildItem("photos",id,selectedSite);
      await removeEmbeddedSiteItem("photos",id,selectedSite);
      removeSiteLocalItem("photos",id,selectedSite);
      await removeOfflinePhotoItem(id,selectedSite);
      await deleteCloudinaryUpload(item);
      sitePhotoDeleteTokens.delete(id);
      const nextItems=items.filter(photo=>safe(photo && photo._id)!==id);
      setSitePhotoItems(nextItems);
      if(index>=nextItems.length) setSitePhotoIndex(Math.max(0,nextItems.length-1));
      renderSitePhotos(nextItems,true);
      setSitePhotosStatusText("Fotografie smazána z bodu.");
      showSaveConfirmation("Fotografie smazána z bodu.");
    }catch(e){
      setSitePhotosStatusText("Chyba mazání fotografie: "+e.message);
    }
  }

  return { deleteCurrentSitePhoto };
}
