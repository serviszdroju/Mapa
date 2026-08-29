export function createSiteAttachmentLoadHelpers({
  attachmentDisplayUrl,
  attachmentSiblingRows,
  detailLazyKey,
  getDb,
  getFirebaseReady,
  getSelectedSite,
  historyTimeValue,
  loadSiteChildItems,
  readAndroidCachedRecords,
  readSiteLocalArray,
  refreshSiteDataFromFirebase,
  renderSiteAttachments,
  safe,
  saveAttachmentsSnapshotToAndroid,
  setSiteAttachmentItems,
  setSiteAttachmentsStatusText,
  siteAttachmentsStatusNode,
  waitForFirebaseUser
}){
  async function loadSiteAttachments(site=getSelectedSite()){
    const st=siteAttachmentsStatusNode();
    if(!st) return;
    const requestedKey=detailLazyKey(site);
    const stillSameSite=()=>!requestedKey || requestedKey===detailLazyKey(getSelectedSite());
    const items=[];
    const dedupe=new Set();
    const addAttachment=item=>{
      const url=attachmentDisplayUrl(item);
      if(!item || !url) return;
      const id=safe(item._id || item.id || url);
      if(dedupe.has(id)) return;
      dedupe.add(id);
      items.push(item);
    };
    const renderLoaded=(message="")=>{
      if(!stillSameSite()) return;
      items.sort((a,b)=>historyTimeValue(b)-historyTimeValue(a));
      const nextItems=items.slice();
      setSiteAttachmentItems(nextItems);
      renderSiteAttachments(nextItems);
      setSiteAttachmentsStatusText(message || (items.length ? `Načteno příloh: ${items.length}.` : ""));
      saveAttachmentsSnapshotToAndroid(site,items);
    };
    const siblings=attachmentSiblingRows(site);
    if(site){
      const androidAttachments=readAndroidCachedRecords("cachedAttachmentsJson",site,5000);
      androidAttachments.forEach((item,idx)=>addAttachment({...item,_id:item._id || `android_attachment_${idx}`,_androidRoom:true}));
    }
    siblings.forEach(sibling=>{
      readSiteLocalArray("attachments",sibling).forEach(addAttachment);
      const embedded=Array.isArray(sibling?.firebaseData?.attachments) ? sibling.firebaseData.attachments : [];
      embedded.forEach(addAttachment);
    });
    if(!getFirebaseReady() || !getDb() || !site){
      renderLoaded(items.length ? `Načteno lokálních příloh: ${items.length}.` : "");
      return;
    }
    setSiteAttachmentsStatusText("Načítám přílohy...");
    const signedUser=await waitForFirebaseUser();
    if(!stillSameSite()) return;
    if(!signedUser){
      renderLoaded(items.length ? `Načteno lokálních příloh: ${items.length}.` : "Čekám na přihlášení, přílohy se načtou po přihlášení.");
      return;
    }
    try{
      await Promise.all(siblings.map(async sibling=>{
        if(!stillSameSite()) return;
        await refreshSiteDataFromFirebase(sibling);
        const embedded=Array.isArray(sibling?.firebaseData?.attachments) ? sibling.firebaseData.attachments : [];
        embedded.forEach(addAttachment);
        const childItems=await loadSiteChildItems("attachments",sibling);
        childItems.forEach(addAttachment);
      }));
      renderLoaded();
    }catch(e){
      renderLoaded(items.length ? `Načteno lokálních příloh: ${items.length}. Online přílohy se nepodařilo načíst.` : `Chyba načtení příloh: ${e.message}`);
    }
  }

  return { loadSiteAttachments };
}
