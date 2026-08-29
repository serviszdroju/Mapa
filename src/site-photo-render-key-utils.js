export function createSitePhotoRenderKeyHelpers({
  canDeleteSitePhotoForUser,
  currentUserEmail,
  detailLazyKey,
  isAppAdmin,
  photoDisplayUrl,
  photoFullUrl,
  photoThumbUrl,
  safe,
  sitePlaceGroupKey,
  siteRecordKeys
}){
  function sitePhotoKeys(site){
    return siteRecordKeys(site);
  }

  function sitePhotoRenderKey(items,index,site){
    const siteKey=detailLazyKey(site) || sitePlaceGroupKey(site) || safe(site && site.id);
    const userEmail=currentUserEmail();
    const isAdminUser=isAppAdmin();
    const photos=(items || []).map((photo,idx)=>[
      safe(photo && (photo._id || photo.id || idx)),
      photoDisplayUrl(photo),
      photoFullUrl(photo),
      photoThumbUrl(photo),
      safe(photo && photo.storageMode),
      safe(photo && photo._syncStatus),
      safe(photo && photo._offline),
      safe(photo && (photo.createdAt || photo.uploadedAt || photo.date)),
      safe(photo && photo.updatedAt),
      safe(photo && photo.takenAt),
      safe(photo && (photo.photoFolder || photo.folderName || photo.folder || photo.cloudinaryFolderDate || photo.cloudinaryFolder)),
      safe(photo && (photo.uploadedBy || photo.createdBy || photo.ownerEmail)),
      safe(photo && (photo.size || "")),
      safe(photo && (photo.originalSize || "")),
      safe(photo && (photo.fileName || photo.originalFileName)),
      canDeleteSitePhotoForUser(photo,userEmail,isAdminUser) ? "delete" : "readonly"
    ].join("~")).join("||");
    return [
      siteKey,
      index,
      (items || []).length,
      userEmail,
      isAdminUser ? "admin" : "user",
      photos
    ].join("|||");
  }

  return { sitePhotoKeys, sitePhotoRenderKey };
}
