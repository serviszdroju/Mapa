export function createSiteAttachmentUploadHelpers({
  addLocalAttachmentToCurrentView,
  appendEmbeddedSiteItem,
  appendSiteLocalArray,
  attachmentInlineMaxBytes,
  attachmentSiblingRows,
  bytesLabel,
  getCurrentUserEmail,
  getDb,
  getFirebaseReady,
  getSelectedSite,
  getSiteAttachmentItems,
  readAttachmentFileData,
  refreshDetailTabLoad,
  renderSiteAttachments,
  resetSiteAttachmentInput,
  safe,
  saveAttachmentsSnapshotToAndroid,
  saveLocalAttachmentToAndroid,
  saveSiteChildItem,
  selectedSiteAttachmentFiles,
  setSiteAttachmentsStatusText,
  showSaveConfirmation,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteRecordIdentity,
  waitForFirebaseUser
}){
  async function uploadSiteAttachments(){
    const files=selectedSiteAttachmentFiles();
    const selectedSite=getSelectedSite();
    if(!selectedSite){ setSiteAttachmentsStatusText("Není vybraný bod."); return; }
    if(!files.length){ setSiteAttachmentsStatusText("Nejdřív vyber přílohy."); return; }
    const oversized=files.find(file=>Number(file.size || 0)>attachmentInlineMaxBytes);
    if(oversized){
      setSiteAttachmentsStatusText(`Příloha ${oversized.name || ""} je moc velká. V této verzi je limit ${bytesLabel(attachmentInlineMaxBytes)} na soubor.`);
      return;
    }
    const signedUser=(getFirebaseReady() && getDb()) ? await waitForFirebaseUser(1200) : null;
    const userEmail=signedUser?.email || getCurrentUserEmail() || "";
    const onlineSaveAvailable=!!(getFirebaseReady() && getDb() && signedUser && navigator.onLine !== false);
    const siblings=attachmentSiblingRows(selectedSite);
    let savedCount=0;
    for(let i=0;i<files.length;i++){
      const file=files[i];
      const attachmentId=(window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : `attachment_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      setSiteAttachmentsStatusText(`Ukládám přílohu ${i+1}/${files.length}...`);
      const createdAt=new Date().toISOString();
      const dataUrl=await readAttachmentFileData(file);
      const basePayload={
        _id:attachmentId,
        fileName:file.name || `priloha-${i+1}`,
        originalFileName:file.name || "",
        type:file.type || "application/octet-stream",
        size:file.size || dataUrl.length,
        url:dataUrl,
        downloadUrl:dataUrl,
        dataUrl,
        storageMode:onlineSaveAvailable ? "firebaseInline" : "localInline",
        uploadedBy:userEmail || "nepřihlášený uživatel",
        createdAt,
        uploadedAt:createdAt,
        _offline:!onlineSaveAvailable,
        _syncStatus:onlineSaveAvailable ? "online" : "local",
        localOnly:!onlineSaveAvailable,
        syncQueuedAt:onlineSaveAvailable ? "" : createdAt,
        sharedPlaceKey:sitePlaceGroupKey(selectedSite),
        sharedPlaceName:sitePlaceLabel(selectedSite) || selectedSite.adresa || ""
      };
      for(const sibling of siblings){
        const payload={...basePayload,...siteRecordIdentity(sibling)};
        if(onlineSaveAvailable){
          const childOk=await saveSiteChildItem("attachments",attachmentId,payload,sibling);
          if(!childOk) await appendEmbeddedSiteItem("attachments",payload,sibling);
        }
        appendSiteLocalArray("attachments",payload,sibling,180);
        if(onlineSaveAvailable) saveAttachmentsSnapshotToAndroid(sibling,[payload]);
        else saveLocalAttachmentToAndroid(sibling,payload);
      }
      addLocalAttachmentToCurrentView(basePayload);
      savedCount++;
    }
    resetSiteAttachmentInput();
    renderSiteAttachments(getSiteAttachmentItems());
    setSiteAttachmentsStatusText(onlineSaveAvailable ? `Uloženo příloh: ${savedCount}.` : `Přílohy uloženy lokálně: ${savedCount}.`);
    showSaveConfirmation(onlineSaveAvailable ? "Přílohy uloženy." : "Přílohy uloženy lokálně.");
    try{ refreshDetailTabLoad("attachments",selectedSite); }catch(e){}
  }

  return { uploadSiteAttachments };
}
