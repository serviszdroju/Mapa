export function createFirebaseAutoReloadHelpers({
  getFirebaseReady,
  getFirebaseUnifiedPrimary,
  getRows,
  getWindow,
  waitForFirebaseUser
}){
  const FIREBASE_EMPTY_RELOAD_KEY="astipFirebaseEmptyReloadCount";
  let firebaseRowsAutoReloadTimer=null;

  function hasLoadedRows(){
    const rows=getRows();
    return Array.isArray(rows) && rows.length>0;
  }

  function resetFirebaseRowsAutoReload(){
    try{sessionStorage.removeItem(FIREBASE_EMPTY_RELOAD_KEY);}catch(e){}
  }

  function firebaseAutoReloadCount(){
    try{return Number(sessionStorage.getItem(FIREBASE_EMPTY_RELOAD_KEY) || "0") || 0;}catch(e){return 0;}
  }

  function setFirebaseAutoReloadCount(count){
    try{sessionStorage.setItem(FIREBASE_EMPTY_RELOAD_KEY,String(count));}catch(e){}
  }

  async function scheduleFirebaseRowsAutoReload(delay=9000){
    const win=getWindow();
    if(!win.__szzAllowAutomaticFullFirebaseReload){
      return;
    }
    if(hasLoadedRows()){
      resetFirebaseRowsAutoReload();
      return;
    }
    const nextCount=firebaseAutoReloadCount()+1;
    if(nextCount>3){
      const gps=document.getElementById("gpsBox");
      if(gps){
        gps.style.display="block";
        gps.className="notice err";
        gps.textContent="Body se zatím nenačetly. Zkontroluj přihlášení přes účet @astip.cz nebo oprávnění Firebase a použij ruční obnovení.";
      }
      return;
    }
    setFirebaseAutoReloadCount(nextCount);
    clearTimeout(firebaseRowsAutoReloadTimer);
    firebaseRowsAutoReloadTimer=setTimeout(async()=>{
      if(!getFirebaseReady() || !getFirebaseUnifiedPrimary()) return;
      if(hasLoadedRows()){
        resetFirebaseRowsAutoReload();
        return;
      }
      const signedUser=await waitForFirebaseUser(2500);
      if(!signedUser) return;
      if(typeof win.loadFirebaseSitesUnified==="function"){
        try{await win.loadFirebaseSitesUnified();}catch(e){console.warn("Opakované načtení Firebase selhalo",e);}
      }
      if(hasLoadedRows()){
        resetFirebaseRowsAutoReload();
        return;
      }
      const p=document.getElementById("progress");
      if(p) p.textContent=`Body se zatím nenačetly, zkouším znovu (${nextCount}/3)...`;
      if(nextCount<3){
        scheduleFirebaseRowsAutoReload(Math.min(delay*1.7,30000));
      }
    },delay);
  }

  return {
    resetFirebaseRowsAutoReload,
    scheduleFirebaseRowsAutoReload
  };
}
