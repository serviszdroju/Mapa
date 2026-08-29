export const SZZ_SYNC_STATE_KEY="astipSzzSyncState:v1";

export function createOfflineSyncStateHelpers({
  readSzzLocalStateObject,
  safeValue,
  writeSzzLocalStateObject
}){
  const safe=safeValue;

  function readSzzSyncState(){
    return readSzzLocalStateObject(SZZ_SYNC_STATE_KEY);
  }

  function writeSzzSyncState(update={}){
    try{
      const next={...readSzzSyncState(),...update,updatedAt:new Date().toISOString()};
      return writeSzzLocalStateObject(SZZ_SYNC_STATE_KEY,next);
    }catch(e){
      return {...update};
    }
  }

  function noteSzzSyncState(status,details={}){
    const nowIso=new Date().toISOString();
    if(status==="syncing"){
      return writeSzzSyncState({
        status:"syncing",
        lastReason:details.reason || "",
        syncStartedAt:nowIso,
        lastError:""
      });
    }
    if(status==="error"){
      return writeSzzSyncState({
        status:"error",
        lastReason:details.reason || "",
        lastError:safe(details.lastError || "Synchronizace selhala."),
        lastFailedAt:nowIso
      });
    }
    return writeSzzSyncState({
      status:"ok",
      lastReason:details.reason || "",
      lastCount:Number(details.lastCount) || 0,
      lastSyncedAt:nowIso,
      lastError:""
    });
  }

  function szzSyncTimeLabel(value){
    const raw=safe(value);
    if(!raw) return "zatím neproběhla";
    const date=new Date(raw);
    if(Number.isNaN(date.getTime())) return raw;
    const diff=Math.max(0,Date.now()-date.getTime());
    if(diff<45000) return "před chvílí";
    if(diff<3600000) return `před ${Math.max(1,Math.round(diff/60000))} min`;
    if(diff<86400000) return `před ${Math.max(1,Math.round(diff/3600000))} h`;
    return date.toLocaleString("cs-CZ",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"});
  }

  return {
    noteSzzSyncState,
    readSzzSyncState,
    szzSyncTimeLabel,
    writeSzzSyncState
  };
}
