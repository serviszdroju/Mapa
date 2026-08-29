export function createRecordAccessFallbackHelpers({
  getAuth,
  getAuthAccessWaitForFirebaseUser,
  getCompatAuthClient,
  getMergeSiteLocalArrayImpl,
  getRecordMatchTextKeysImpl,
  getRowLookupKeysImpl,
  getSelectedSite,
  getSelectedSiteDocIdImpl,
  getSiteRecordIdentityImpl,
  getSiteRecordKeysImpl,
  getSiteRecordKeySetImpl,
  getSiteRecordNormTextKeysImpl,
  getSiteRecordTextKeysImpl,
  getSiteLocalArrayMetaReader,
  getUpdateAdminAppControls,
  searchNorm,
  setCurrentUser,
  uniqueNonEmptyStrings
}){
  function safeSyncCurrentUserFromCompat(){
    try{
      const compatClient=getCompatAuthClient();
      const user=compatClient && compatClient.currentUser ? compatClient.currentUser : null;
      if(user) setCurrentUser(user);
      return user;
    }catch(e){
      return null;
    }
  }

  function safeReadSiteLocalArrayMeta(kind,site){
    try{
      const reader=getSiteLocalArrayMetaReader();
      if(typeof reader==="function") return reader(kind,site);
    }catch(e){
      if(!(e instanceof ReferenceError)) console.warn("Lokální metadata se nepodařilo načíst",e);
    }
    return {count:0,latest:0,signature:""};
  }

  function safeUpdateAdminAppControls(){
    try{
      if(typeof window.updateAdminAppControls==="function"){
        window.updateAdminAppControls();
        return;
      }
    }catch(e){}
    try{
      const updater=getUpdateAdminAppControls();
      if(typeof updater==="function") updater();
    }catch(e){
      if(!(e instanceof ReferenceError)) console.warn("Ovládací prvky přihlášení se nepodařilo obnovit",e);
    }
  }

  function safeWaitForFirebaseUser(timeoutMs=8000){
    const helper=getAuthAccessWaitForFirebaseUser();
    try{
      if(typeof helper==="function") return helper(timeoutMs);
    }catch(e){
      if(!(e instanceof ReferenceError)) console.warn("Čekání na Firebase uživatele se nepodařilo připravit",e);
    }
    const auth=getAuth();
    return Promise.resolve(safeSyncCurrentUserFromCompat() || window.__authReadyUser || window.currentUser || (auth && auth.currentUser) || null);
  }

  function waitForFirebaseUser(timeoutMs=8000){
    return safeWaitForFirebaseUser(timeoutMs);
  }

  function fallbackRecordKeys(site=getSelectedSite()){
    if(!site) return [];
    return uniqueNonEmptyStrings([
      site.id,
      site.siteId,
      site.siteKey,
      site.firebaseDocId,
      site.siteDocId,
      site._id,
      site._detailKey,
      site._rowKey
    ]);
  }

  function rowLookupKeys(row){
    const helper=getRowLookupKeysImpl();
    if(typeof helper==="function") return helper(row);
    return fallbackRecordKeys(row);
  }

  function selectedSiteDocId(site=getSelectedSite()){
    const helper=getSelectedSiteDocIdImpl();
    if(typeof helper==="function") return helper(site);
    return fallbackRecordKeys(site)[0] || "";
  }

  function siteRecordKeys(site=getSelectedSite()){
    const helper=getSiteRecordKeysImpl();
    if(typeof helper==="function") return helper(site);
    return fallbackRecordKeys(site);
  }

  function siteRecordIdentity(site=getSelectedSite()){
    const helper=getSiteRecordIdentityImpl();
    if(typeof helper==="function") return helper(site);
    return siteRecordKeys(site).join("|");
  }

  function siteRecordKeySet(site=getSelectedSite()){
    const helper=getSiteRecordKeySetImpl();
    if(typeof helper==="function") return helper(site);
    return new Set(siteRecordKeys(site));
  }

  function fallbackRecordTextKeys(record=getSelectedSite()){
    if(!record) return [];
    return uniqueNonEmptyStrings([
      record.siteName,
      record.name,
      record.Nazev,
      record["Název"],
      record.address,
      record.Adresa,
      record.place,
      record.pbzLocation
    ].map(value=>searchNorm(value)));
  }

  function siteRecordTextKeys(site=getSelectedSite()){
    const helper=getSiteRecordTextKeysImpl();
    if(typeof helper==="function") return helper(site);
    return fallbackRecordTextKeys(site);
  }

  function siteRecordNormTextKeys(site=getSelectedSite()){
    const helper=getSiteRecordNormTextKeysImpl();
    if(typeof helper==="function") return helper(site);
    return siteRecordTextKeys(site);
  }

  function recordMatchTextKeys(record){
    const helper=getRecordMatchTextKeysImpl();
    if(typeof helper==="function") return helper(record);
    return fallbackRecordTextKeys(record);
  }

  function mergeSiteLocalArray(...args){
    const helper=getMergeSiteLocalArrayImpl();
    if(typeof helper==="function") return helper(...args);
    const items=args[1];
    return Array.isArray(items) ? items.slice() : [];
  }

  return {
    fallbackRecordKeys,
    recordMatchTextKeys,
    rowLookupKeys,
    safeReadSiteLocalArrayMeta,
    safeSyncCurrentUserFromCompat,
    safeUpdateAdminAppControls,
    safeWaitForFirebaseUser,
    selectedSiteDocId,
    siteRecordIdentity,
    siteRecordKeys,
    siteRecordKeySet,
    siteRecordNormTextKeys,
    siteRecordTextKeys,
    mergeSiteLocalArray,
    waitForFirebaseUser
  };
}
