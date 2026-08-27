import {
  APP_ADMIN_EMAILS,
  APP_ALLOWED_EMAILS,
  APP_PROTOCOL_HISTORY_EMAILS,
  APP_REGION_OPTIONS,
  APP_STATUS_FILTER_OPTIONS
} from "./app-options.js";
import {
  esc,
  first,
  get,
  makeLocalRecordId,
  num,
  safe,
  simpleNorm,
  stableSignature,
  stableSignaturePart
} from "./core-utils.js";
import {
  AUTH_RESTORE_GRACE_MS,
  CLOUDINARY_PHOTOS,
  GOOGLE_WEB_CLIENT_ID,
  authBootStartedAt,
  clearExplicitSignOut,
  compatGoogleProvider,
  compatFirebaseReady,
  createAuthAccessHelpers,
  ensureCompatAuthPersistence,
  ensureCompatFirebaseApp,
  explicitSignOutPending,
  firebaseConfig,
  forgetKnownSignedIn,
  getCompatAuthClient,
  knownSignedIn,
  lastKnownUserEmail,
  loadGoogleIdentityServices,
  loadCompatFirebaseScripts,
  markExplicitSignOut,
  primeCompatAuthPersistence,
  rememberKnownSignedIn,
  setStartupAuthChecking
} from "./firebase-auth.js";
import {
  WATCH_SELF_RAW_KEYS,
  applyWatchSelfAliases,
  canonicalWatchSelfValue,
  explicitWatchSelfFromRaw,
  orderedFlagFromRaw,
  repairOrderFlagFromRaw,
  restoreFirebaseMapStatusRawValues,
  stopFlagFromRaw
} from "./map-status.js";
import {
  applyStopStatusRawPatch,
  clearRawStatusColorWhere,
  clearRawStatusTextWhere,
  mapStatusRawPatchFromStatePatch,
  rawStatusColorLooksOrdered,
  rawStatusColorLooksRepairOrdered,
  rawStatusColorLooksStopped,
  rawStatusTextLooksOrdered,
  rawStatusTextLooksRepairOrdered,
  rawStatusTextLooksStopped
} from "./map-status-raw-patch-utils.js";
import {
  LAST_CHECK_KEYS,
  NEXT_CHECK_KEYS,
  addMonths,
  color,
  computedNextDate,
  daysToComputedNext,
  displayNext,
  ensureRowScheduleCache,
  formatDateCz,
  formatDateTimeCz,
  inferControlPeriodMonthsFromDateValues,
  inferControlPeriodMonthsFromDates,
  isNoOrderSite,
  parseDateValue,
  periodMonths,
  pill,
  rowScheduleFingerprint,
  statusText
} from "./schedule-status.js";
import {
  canonicalRegionValue,
  geocodeAddressFast,
  geocodeAddressGeneric,
  geocodeRequestedHouseNumbers,
  inferRegionFromAddressText,
  regionTextNorm,
  reverseGeocodeGpsGeneric
} from "./geocode-utils.js";
import {
  rowSearchText,
  searchNorm
} from "./search-utils.js";
import {
  ensureRowPlaceCache,
  ensureRowSourceCache,
  rawValueForAny,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceIdentity,
  siteSourceLabel,
  sourceSerialTextFromRaw,
  sourceTypeTextFromRaw
} from "./site-labels.js";
import {
  cachedPostAppShellUrlsToServiceWorker,
  currentAppShellUrls
} from "./app-shell-cache.js";
import {
  requestSzzPersistentStorage,
  szzBytesLabel,
  szzStorageEstimate
} from "./storage-persistence.js";
import {
  MAP_TILE_CACHE_NAME,
  MAP_TILE_URL_TEMPLATE,
  visibleMapTileUrlsForMap
} from "./map-tile-utils.js";
import {
  clearSzzLocalStateObjectCache,
  readSzzLocalStateObject,
  writeSzzLocalStateObject
} from "./local-state-cache.js";
import {
  runAfterPaint,
  runAfterTwoPaints,
  runWhenIdle,
  szzYieldToBrowser
} from "./scheduler-utils.js";
import {
  dateInputValueFromAny,
  isoDateFromAny
} from "./date-input-utils.js";
import {
  setClassNameIfChanged,
  setDisabledIfChanged,
  setDisplayIfChanged,
  setTextIfChanged
} from "./dom-update-utils.js";
import {
  szzCompareCsBase
} from "./czech-sort-utils.js";
import {
  daysBetweenToday,
  inCzSk,
  rawGps,
  siteId
} from "./row-data-utils.js";
import {
  dateOnlyTextFallback,
  historyTimeValue,
  protocolSavedTimeValue,
  timeValueFromAny
} from "./history-time-utils.js";
import {
  shouldHideDataRow
} from "./detail-data-utils.js";
import {
  createLegacyEditCacheHelpers
} from "./legacy-edit-cache.js";
import {
  createLegacyEditLoadHelpers
} from "./legacy-edit-load-utils.js";
import {
  createLegacyExtraSiteHelpers
} from "./legacy-extra-site-utils.js";
import {
  createLegacyDeletedSiteHelpers
} from "./legacy-deleted-site-utils.js";
import {
  createRowIdentityHelpers
} from "./row-identity-utils.js";
import {
  createRecordIdDedupe,
  recordIdKeys
} from "./record-id-utils.js";
import {
  createRecordTextHelpers
} from "./record-text-utils.js";
import {
  createRecordSourceHelpers
} from "./record-source-utils.js";
import {
  readFirestoreArrayContainsAny,
  readFirestoreEqualsAny,
  runBoundedFirestoreTasks,
  uniqueNonEmptyStrings
} from "./firestore-query-utils.js";
import {
  detailLastCheckNode,
  detailNextCheckNode,
  detailSubNode,
  detailTableNode,
  detailTitleNode,
  drawerNode,
  formFieldNode,
  gpsBoxNode,
  gpsCountNode,
  newSiteCardNode,
  officialManufacturerSelectNode,
  officialProtocolDataBoxNode,
  officialProtocolSourceInfoNode,
  officialProtocolStatusNode,
  setInputChecked,
  setInputValue,
  setInputValueIfExists,
  shownCountNode,
  sidebarListNode,
  sourceChooserNode
} from "./form-field-utils.js";
import {
  createDetailDrawerShellHelpers
} from "./detail-drawer-shell-utils.js";
import {
  dataLabelAll,
  dataLabelFixed,
  dataLabelUser,
  dataNormAll,
  dataNormFixed,
  dataNormUser,
  dataValueKeyUser,
  hideDataFixed,
  hideDataUser,
  hideOnlyInternalData,
  isImportantDataAll,
  isNoteFixed,
  isNoteUser,
  isWatchFixed,
  orderedAllDataKeys,
  orderedDataUser,
  orderedFixedKeys,
  valNormFixed
} from "./data-key-utils.js";
import {
  createSiteFieldLookupHelpers
} from "./site-field-lookup-utils.js";
import {
  cloneLocalStorageArrayEntries,
  cloneLocalStorageArrayItems,
  cloneLocalStorageObjectEntries,
  szzArrayWithoutItemId
} from "./local-storage-clone-utils.js";
import {
  createSiteLocalKeyHelpers
} from "./site-local-key-utils.js";
import {
  createSiteLocalStorageHelpers,
  createSiteLocalStorageMutationHelpers
} from "./site-local-storage-utils.js";
import {
  SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,
  SZZ_PROTOCOL_DRAFT_STORE,
  withSzzOfflineQueueStore
} from "./offline-queue-db-utils.js";
import {
  createOfflineSiteQueueHelpers
} from "./offline-site-queue-utils.js";
import {
  createOfflineProtocolQueueHelpers
} from "./offline-protocol-queue-utils.js";
import {
  createProtocolDraftStorageHelpers
} from "./protocol-draft-storage-utils.js";
import {
  clearLocalDetailReadCache,
  readCachedLocalDetailItems as readCachedLocalDetailItemsFromCache
} from "./local-detail-cache-utils.js";
import {
  createLocalStorageEntriesHelpers
} from "./local-storage-entries-utils.js";
import {
  createOfflineDetailMetaHelpers
} from "./offline-detail-meta-utils.js";
import {
  createOfflineRowFingerprintHelpers
} from "./offline-row-fingerprint-utils.js";
import {
  cloneSzzItemsMeta,
  szzDetailMetaChanged,
  szzItemsMeta
} from "./offline-item-meta-utils.js";
import {
  bytesLabel,
  createPhotoUrlHelpers,
  photoFileName
} from "./photo-url-utils.js";
import {
  createOfflinePhotoItemHelpers
} from "./offline-photo-item-utils.js";
import {
  createOfflinePhotoQueueHelpers
} from "./offline-photo-queue-utils.js";
import {
  createOfflineIdHelpers
} from "./offline-id-utils.js";
import {
  createFirebaseSiteCountCacheHelpers
} from "./firebase-site-count-cache-utils.js";
import {
  createOfflineRowSelectHelpers
} from "./offline-row-select-utils.js";
import {
  createOfflinePrefetchItemHelpers
} from "./offline-prefetch-item-utils.js";
import {
  siteChildDeltaFields,
  siteChildLocalKind,
  siteChildTypeLabel
} from "./site-child-kind-utils.js";
import {
  createFirestoreDeltaHelpers
} from "./firestore-delta-utils.js";
import {
  createOfflineSiteMetaHelpers
} from "./offline-site-meta-utils.js";
import {
  createFirebaseRowDocHelpers
} from "./firebase-row-doc-utils.js";
import {
  createOfflineMapDeltaSyncHelpers
} from "./offline-map-delta-sync-utils.js";
import {
  createOfflineStandaloneHistoryHelpers
} from "./offline-standalone-history-utils.js";
import {
  createOfflineDetailPrefetchSiteHelpers
} from "./offline-detail-prefetch-site-utils.js";
import {
  createOfflineAppPrepareHelpers
} from "./offline-app-prepare-utils.js";
import {
  createOfflineMapTileCacheHelpers
} from "./offline-map-tile-cache-utils.js";
import {
  createOfflineDetailPrefetchRunner
} from "./offline-detail-prefetch-runner-utils.js";
import {
  canDeleteSitePhotoForUser,
  createPhotoRenderMetaHelpers
} from "./photo-render-meta-utils.js";
import {
  createPhotoFolderHelpers
} from "./photo-folder-utils.js";
import {
  attachmentDisplayUrl,
  attachmentFileName,
  attachmentRenderSignature
} from "./attachment-utils.js";
import {
  createPhotoDateHelpers
} from "./photo-date-utils.js";
import {
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel
} from "./protocol-source-state-utils.js";
import {
  createProtocolExportHelpers,
  historyObjectSummary,
  isProtocolHistoryItem
} from "./protocol-export-utils.js";
import {
  createHistoryLabelHelpers
} from "./history-label-utils.js";
import {
  createProtocolHandoffHelpers
} from "./protocol-handoff-utils.js";
import {
  createProtocolWorkflowHelpers
} from "./protocol-workflow-utils.js";
import {
  createMainProtocolHistoryViewHelpers
} from "./main-protocol-history-view-utils.js";
import {
  createFilterDomHelpers,
  createFilterOptionHelpers,
  createFilterRenderScheduler
} from "./filter-render-utils.js";
import {
  createFilterLogicHelpers
} from "./filter-logic-utils.js";
import {
  createRowEditApplyHelpers
} from "./row-edit-apply-utils.js";
import {
  createRowNormalizeHelpers
} from "./row-normalize-utils.js";
import {
  createNewSiteFieldHelpers
} from "./new-site-field-utils.js";
import {
  WARRANTY_SELECT_OPTIONS,
  createNewSiteFormFieldHelpers
} from "./new-site-form-utils.js";
import {
  createNewSiteModeHelpers
} from "./new-site-mode-utils.js";
import {
  createEditFormHelpers
} from "./edit-form-utils.js";
import {
  createDeleteSiteHelpers
} from "./delete-site-utils.js";
import {
  createMapStatusParityHelpers
} from "./map-status-parity-utils.js";
import {
  createRowFastIndexHelpers
} from "./row-fast-index-utils.js";
import {
  createPlaceGroupHelpers
} from "./place-group-utils.js";
import {
  createSidebarRenderHelpers
} from "./sidebar-render-utils.js";
import {
  createMapMarkerRenderHelpers
} from "./map-marker-render-utils.js";
import {
  createSourcePopupHelpers
} from "./source-popup-utils.js";
import {
  createFirebaseAutoReloadHelpers
} from "./firebase-auto-reload-utils.js";
import {
  createMapFitHelpers
} from "./map-fit-utils.js";
import {
  createAppRenderLoopHelpers
} from "./app-render-loop-utils.js";
import {
  createMapFocusHelpers
} from "./map-focus-utils.js";
import {
  dedupeSiteRows,
  siteDedupKeysFromRaw
} from "./row-dedup-utils.js";
import {
  createFirebaseLoadReportHelpers
} from "./firebase-load-report-utils.js";
import {
  createSharedPlaceEditHelpers
} from "./shared-place-edit-utils.js";
import {
  createControlDateDisplayHelpers
} from "./control-date-display-utils.js";
import {
  createDetailStatusButtonHelpers
} from "./detail-status-button-utils.js";
import {
  createDetailTableDisplayHelpers
} from "./detail-table-display-utils.js";
import {
  createDetailLazyLoadHelpers
} from "./detail-lazy-load-utils.js";

const CSV_FILE="";
const PUBLIC_CSV_DATA_ENABLED=false;
let firebaseReady = !firebaseConfig.apiKey.includes("VLOZIT");
const firebaseConfigured = firebaseReady;
let app, auth, db, mailFunctions=null, mailFunctionsPromise=null, fb={}, currentUser=null;
let authAccessWaitForFirebaseUser=null;
let rowLookupKeysImpl=null;
let selectedSiteDocIdImpl=null;
let siteRecordKeysImpl=null;
let siteRecordIdentityImpl=null;
let siteRecordKeySetImpl=null;
let siteRecordTextKeysImpl=null;
let siteRecordNormTextKeysImpl=null;
let recordMatchTextKeysImpl=null;
let mergeSiteLocalArrayImpl=null;
let rows=[], csvRows=[], originalCsvRows=[], extraSites=[], selectedSite=null, addSourceBaseSite=null, editCache={};
let firebaseUnifiedPrimary = firebaseReady;
let map=null, layer=null;
let appRenderLoop=null;
window.__firebaseConfig = firebaseConfig;
window.firebaseReady = firebaseReady;
window.__firebaseConfigured = firebaseConfigured;
window.firebaseUnifiedPrimary = firebaseUnifiedPrimary;
window.__firebaseUnifiedPrimary = firebaseUnifiedPrimary;
window.cloudinaryPhotoConfig = CLOUDINARY_PHOTOS;
window.rows = rows;
window.safe=safe;
window.WATCH_SELF_RAW_KEYS=WATCH_SELF_RAW_KEYS;
window.explicitWatchSelfFromRaw=explicitWatchSelfFromRaw;
window.canonicalWatchSelfValue=canonicalWatchSelfValue;
window.applyWatchSelfAliases=applyWatchSelfAliases;
function firebaseRowsWereLoadedFromNetwork(maxAgeMs=45000){
  const loadedAt=Number(window.__szzFirebaseSitesLastNetworkLoadAt || 0);
  return Array.isArray(rows) && rows.length && !!window.__szzFirebaseRowsNetworkLoaded && loadedAt>0 && Date.now()-loadedAt<maxAgeMs;
}
const APP_BUILD_VERSION="2026-08-27-no-refresh-login-popup-v558";
const SZZ_PROTOCOL_HANDOFF_OVERRIDES_KEY="astipMap:protocolHandoffOverrides:v1";
const SZZ_OFFLINE_READY_KEY="astipSzzOfflineReady:v1";
const SZZ_OFFLINE_DETAIL_META_KEY="astipSzzOfflineDetailMeta:v1";
const SZZ_FIREBASE_SITE_CACHE_KEY="astipFirebaseSitesMapCacheV2";
const SITE_RECORD_EQUALITY_FIELDS=["siteId","siteKey","firebaseDocId","siteDocId","siteLegacyId"];
const SZZ_OFFLINE_INCREMENTAL_SAFETY_MS=10000;
const CZECH_OFFLINE_TILE_VERSION="visible-v2";
const CZECH_OFFLINE_DONE_KEY="astipCzechOfflineMapVersion";
const CZECH_OFFLINE_BOUNDS={west:12.05,south:48.45,east:18.95,north:51.15};
const CZECH_OFFLINE_ZOOMS=[6,7,8,9,10,11];
const SZZ_BACKGROUND_DELTA_SYNC_MIN_MS=5*60*1000;
function showAppShellFast(message=""){
  if(window.__szzFastShellShown) return;
  const hasUser=!!(window.currentUser || window.__authReadyUser);
  const canResumeKnownSession=!hasUser && !explicitSignOutPending() && knownSignedIn() && navigator.onLine===false;
  if(canResumeKnownSession){
    window.__szzFastShellShown=true;
    window.__mapAppUnlocked=true;
    try{document.documentElement.classList.add("auth-resume");}catch(e){}
    if(typeof window.__szzSetAuthState==="function"){
      window.__szzSetAuthState("logged-in",{message:message || "Obnovuji přihlášení..."});
    }else{
      const startup=document.getElementById("startupScreen");
      const appEl=document.getElementById("mainApp");
      const topLogout=document.getElementById("topLogoutBtn");
      const progress=document.getElementById("progress");
      setDisplayIfChanged(startup,"none");
      setDisplayIfChanged(appEl,"grid");
      setDisplayIfChanged(topLogout,"block");
      setTextIfChanged(progress,message || "Obnovuji přihlášení...");
    }
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    return;
  }
  if(!hasUser && !explicitSignOutPending() && knownSignedIn()){
    if(typeof window.__szzSetAuthState==="function"){
      window.__szzSetAuthState("checking",{
        intro:"Kontroluji uložené přihlášení...",
        message:message || "Obnovuji přihlášení..."
      });
    }else{
      const startup=document.getElementById("startupScreen");
      const appEl=document.getElementById("mainApp");
      const startupButton=document.getElementById("startupLoginBtn");
      const status=document.getElementById("startupStatus");
      setDisplayIfChanged(startup,"flex");
      setDisplayIfChanged(appEl,"none");
      setDisplayIfChanged(startupButton,"none");
      setTextIfChanged(status,message || "Obnovuji přihlášení...");
    }
    return;
  }
  if(!hasUser){
    if(typeof window.__szzSetAuthState==="function"){
      window.__szzSetAuthState("logged-out",{message:""});
    }else{
      const startup=document.getElementById("startupScreen");
      const appEl=document.getElementById("mainApp");
      const startupButton=document.getElementById("startupLoginBtn");
      const status=document.getElementById("startupStatus");
      setDisplayIfChanged(startup,"flex");
      setDisplayIfChanged(appEl,"none");
      setDisplayIfChanged(startupButton,"none");
      if(message) setTextIfChanged(status,"");
    }
    return;
  }
  window.__szzFastShellShown=true;
  window.__mapAppUnlocked=true;
  try{ if(window.setStartupAuthChecking) window.setStartupAuthChecking(false); }catch(e){}
  if(typeof window.__szzSetAuthState==="function"){
    window.__szzSetAuthState("logged-in",{message});
  }else{
    const startup=document.getElementById("startupScreen");
    const appEl=document.getElementById("mainApp");
    const loginRow=document.getElementById("mainLoginRow");
    const topLogout=document.getElementById("topLogoutBtn");
    const progress=document.getElementById("progress");
    setDisplayIfChanged(startup,"none");
    setDisplayIfChanged(appEl,"grid");
    setDisplayIfChanged(loginRow,"none");
    setDisplayIfChanged(topLogout,"block");
    if(message) setTextIfChanged(progress,message);
  }
}

function loadOfflineRowsFromLocalCacheWhenAvailable(message="",timeoutMs=8000){
  if(window.__szzOfflineBootCacheLoadStarted) return;
  window.__szzOfflineBootCacheLoadStarted=true;
  const started=Date.now();
  const progress=document.getElementById("progress");
  const run=()=>{
    const directLoader=window.showFirebaseMapRowsCache;
    const unifiedLoader=window.loadFirebaseSitesUnified;
    const done=loadedRows=>{
      const count=Array.isArray(loadedRows) ? loadedRows.length : 0;
      setTextIfChanged(progress,count
        ? `Offline režim. Načteno ${count} bodů z telefonu.`
        : (message || "Offline režim. Uložená data zatím nejsou v tomto zařízení připravená."));
    };
    if(typeof directLoader==="function"){
      Promise.resolve(directLoader(null,{offlineBoot:true})).then(done).catch(e=>console.warn("Offline cache bodů se nepodařila načíst",e));
      return;
    }
    if(typeof unifiedLoader==="function"){
      Promise.resolve(unifiedLoader(null,{offlineCacheOnly:true,skipFirestoreCache:true,allowOnlineCache:true})).then(done).catch(e=>console.warn("Offline cache bodů se nepodařila načíst",e));
      return;
    }
    if(Date.now()-started<timeoutMs){
      setTimeout(run,150);
      return;
    }
    setTextIfChanged(progress,message || "Offline režim. Uložená data zatím nejsou v tomto zařízení připravená.");
  };
  if(message) setTextIfChanged(progress,message);
  run();
}
window.loadOfflineRowsFromLocalCacheWhenAvailable=loadOfflineRowsFromLocalCacheWhenAvailable;

function safeSyncCurrentUserFromCompat(){
  try{
    const compatClient=getCompatAuthClient();
    const user=compatClient && compatClient.currentUser ? compatClient.currentUser : null;
    if(user){
      currentUser=user;
      window.currentUser=user;
      window.__authReadyUser=user;
    }
    return user;
  }catch(e){
    return null;
  }
}

function safeReadSiteLocalArrayMeta(kind,site){
  try{
    if(typeof readSiteLocalArrayMeta==="function") return readSiteLocalArrayMeta(kind,site);
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
    if(typeof updateAdminAppControls==="function") updateAdminAppControls();
  }catch(e){
    if(!(e instanceof ReferenceError)) console.warn("Ovládací prvky přihlášení se nepodařilo obnovit",e);
  }
}

function safeWaitForFirebaseUser(timeoutMs=8000){
  const helper=authAccessWaitForFirebaseUser;
  try{
    if(typeof helper==="function") return helper(timeoutMs);
  }catch(e){
    if(!(e instanceof ReferenceError)) console.warn("Čekání na Firebase uživatele se nepodařilo připravit",e);
  }
  return Promise.resolve(safeSyncCurrentUserFromCompat() || window.__authReadyUser || window.currentUser || (auth && auth.currentUser) || null);
}

function waitForFirebaseUser(timeoutMs=8000){
  return safeWaitForFirebaseUser(timeoutMs);
}

function fallbackRecordKeys(site=selectedSite){
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
  const helper=rowLookupKeysImpl;
  if(typeof helper==="function") return helper(row);
  return fallbackRecordKeys(row);
}

function selectedSiteDocId(site=selectedSite){
  const helper=selectedSiteDocIdImpl;
  if(typeof helper==="function") return helper(site);
  return fallbackRecordKeys(site)[0] || "";
}

function siteRecordKeys(site=selectedSite){
  const helper=siteRecordKeysImpl;
  if(typeof helper==="function") return helper(site);
  return fallbackRecordKeys(site);
}

function siteRecordIdentity(site=selectedSite){
  const helper=siteRecordIdentityImpl;
  if(typeof helper==="function") return helper(site);
  return siteRecordKeys(site).join("|");
}

function siteRecordKeySet(site=selectedSite){
  const helper=siteRecordKeySetImpl;
  if(typeof helper==="function") return helper(site);
  return new Set(siteRecordKeys(site));
}

function fallbackRecordTextKeys(record=selectedSite){
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

function siteRecordTextKeys(site=selectedSite){
  const helper=siteRecordTextKeysImpl;
  if(typeof helper==="function") return helper(site);
  return fallbackRecordTextKeys(site);
}

function siteRecordNormTextKeys(site=selectedSite){
  const helper=siteRecordNormTextKeysImpl;
  if(typeof helper==="function") return helper(site);
  return siteRecordTextKeys(site);
}

function recordMatchTextKeys(record){
  const helper=recordMatchTextKeysImpl;
  if(typeof helper==="function") return helper(record);
  return fallbackRecordTextKeys(record);
}

function mergeSiteLocalArray(...args){
  const helper=mergeSiteLocalArrayImpl;
  if(typeof helper==="function") return helper(...args);
  const items=args[1];
  return Array.isArray(items) ? items.slice() : [];
}

function invalidateMapAfterPaint(){
  runAfterPaint(()=>{ if(window.map) window.map.invalidateSize(true); });
  runAfterTwoPaints(()=>{ if(window.map) window.map.invalidateSize(true); });
}

function initMapShell(){
  if(window.map && window.map.invalidateSize && window.L){
    map=window.map;
    if(!layer) layer=L.layerGroup().addTo(map);
    return map;
  }
  if(!window.L){
    runAfterPaint(initMapShell);
    return null;
  }
  showAppShellFast("Připravuji mapu. Servisní data se načtou po přihlášení.");
  window.map=L.map("map",{preferCanvas:true}).setView([49.9,15.5],7);
  map=window.map;
  L.tileLayer(MAP_TILE_URL_TEMPLATE,{maxZoom:19,attribution:"&copy; OpenStreetMap"}).addTo(map);
  layer=L.layerGroup().addTo(map);
  invalidateMapAfterPaint();
  return map;
}

showAppShellFast("Připravuji mapu. Servisní data se načtou po přihlášení.");
initMapShell();
window.cacheAppShellForOffline=cacheAppShellForOffline;

async function ensureMailFunctions(){
  if(!firebaseReady || !app) return false;
  if(fb.fnMod && mailFunctions) return true;
  if(!mailFunctionsPromise){
    mailFunctionsPromise=(async()=>{
      try{
        const fnMod=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-functions.js");
        fb.fnMod=fnMod;
        mailFunctions=fnMod.getFunctions(app,"europe-west1");
        window.mailFunctions=mailFunctions;
        return true;
      }catch(e){
        console.warn("Firebase Functions se nepodařilo připravit",e);
        return false;
      }
    })();
  }
  const ready=await mailFunctionsPromise;
  if(!ready) mailFunctionsPromise=null;
  return ready;
}

window.addEventListener("load",()=>{
  if(!firebaseReady){
    const st=document.getElementById("startupStatus");
    const message=firebaseConfigured
      ? "Firebase se zatím nepodařilo načíst. Servisní data se z bezpečnostních důvodů načtou až po přihlášení."
      : "Firebase není nastavený – servisní data nejsou v této veřejné verzi dostupná.";
    setTextIfChanged(st,message);
    const box=document.getElementById("firebaseBox");
    if(box){
      setDisplayIfChanged(box,"block");
      setClassNameIfChanged(box,firebaseConfigured ? "notice" : "notice err");
      setTextIfChanged(box,message);
    }
    runAfterTwoPaints(()=>showApp());
  }
});


if(firebaseReady){
  (async()=>{
  let appMod=null;
  let authMod=null;
  let fsMod=null;
  try{
    [appMod,authMod,fsMod] = await Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]);
  }catch(e){
    console.warn("Firebase modulární knihovny nejsou dostupné, zkouším záložní režim",e);
    const compatAvailable=!!(ensureCompatFirebaseApp() && window.firebase && firebase.auth);
    if(compatAvailable){
      firebaseReady=true;
      firebaseUnifiedPrimary=true;
      window.firebaseReady=true;
      window.firebaseUnifiedPrimary=true;
      window.__firebaseUnifiedPrimary=true;
      const box=document.getElementById("firebaseBox");
      if(box){
        setDisplayIfChanged(box,"block");
        setClassNameIfChanged(box,"notice");
        setTextIfChanged(box,"Firebase běží v záložním režimu. Pro úpravy se přihlaš tlačítkem Přihlásit technika.");
      }
    }else{
      firebaseReady=false;
      firebaseUnifiedPrimary=false;
      window.firebaseReady=false;
      window.firebaseUnifiedPrimary=false;
      window.__firebaseUnifiedPrimary=false;
      const box=document.getElementById("firebaseBox");
      if(box){
        setDisplayIfChanged(box,"block");
        setClassNameIfChanged(box,"notice err");
        setTextIfChanged(box,"Firebase knihovny se nepodařilo načíst. Přihlášení zatím není dostupné a veřejný CSV export už není součástí produkčního webu.");
      }
    }
    const st=document.getElementById("startupStatus");
    setTextIfChanged(st,compatAvailable
      ? "Firebase modul se načetl v záložním režimu. Otevírám mapu."
      : "Firebase není dostupný. Servisní data se načtou po obnovení přihlášení nebo připojení.");
    runAfterTwoPaints(()=>{
      try{showApp();}catch(err){}
      if(!compatAvailable || navigator.onLine===false){
        loadOfflineRowsFromLocalCacheWhenAvailable("Offline režim. Hledám uložené body, mapu a protokoly v telefonu.");
      }
    });
  }
  if(firebaseReady && appMod && authMod && fsMod){
  fb={appMod,authMod,fsMod,fnMod:null};
  app=appMod.getApps().length ? appMod.getApp() : appMod.initializeApp(firebaseConfig);
  auth=authMod.getAuth(app);
  window.auth=auth;
  try{
    if(authMod.useDeviceLanguage) authMod.useDeviceLanguage(auth);
    else if(auth.useDeviceLanguage) auth.useDeviceLanguage();
  }catch(e){}
  try{
    const persistenceChoices=[
      authMod.indexedDBLocalPersistence,
      authMod.browserLocalPersistence,
      authMod.browserSessionPersistence
    ].filter(Boolean);
    let persistenceSet=false;
    for(const persistence of persistenceChoices){
      try{
        await authMod.setPersistence(auth,persistence);
        persistenceSet=true;
        break;
      }catch(e){
        console.warn("Firebase persistence varianta selhala",e);
      }
    }
    if(!persistenceSet) console.warn("Firebase persistence nejde nastavit");
  }catch(e){
    console.warn("Firebase persistence nejde nastavit",e);
  }
  try{
    if(fsMod.initializeFirestore && fsMod.persistentLocalCache){
      const cacheOptions={};
      if(fsMod.persistentMultipleTabManager) cacheOptions.tabManager=fsMod.persistentMultipleTabManager();
      db=fsMod.initializeFirestore(app,{localCache:fsMod.persistentLocalCache(cacheOptions)});
    }else{
      db=fsMod.getFirestore(app);
    }
  }catch(e){
    db=fsMod.getFirestore(app);
  }
  window.fb=fb;
  window.db=db;
  try{ ensureCompatFirebaseApp(); }catch(e){ console.warn("Compat Firebase se nepodařilo inicializovat",e); }
  const firebaseBox=document.getElementById("firebaseBox");
  setDisplayIfChanged(firebaseBox,"none");

  const AUTH_REDIRECT_PENDING_KEY="astipFirebaseRedirectPending";
  let lastAuthMessage="";
  let authLoginInProgress=false;
  function authPending(){
    try{return safe(sessionStorage.getItem(AUTH_REDIRECT_PENDING_KEY));}catch(e){return "";}
  }
  function setAuthPending(reason="redirect"){
    try{sessionStorage.setItem(AUTH_REDIRECT_PENDING_KEY,reason);}catch(e){}
  }
  function clearAuthPending(){
    try{sessionStorage.removeItem(AUTH_REDIRECT_PENDING_KEY);}catch(e){}
  }
  function setStartupStatus(message){
    lastAuthMessage=message || "";
    const st=document.getElementById("startupStatus");
    setTextIfChanged(st,message || "");
    const appEl=document.getElementById("mainApp");
    const appVisible=!!(appEl && appEl.style.display && appEl.style.display!=="none");
    if(appVisible && typeof setProgressStatus==="function") setProgressStatus(message || "");
  }
  function authErrorText(e){
    const code=safe(e && e.code);
    const message=safe(e && e.message);
    if(/Android Google|Google odmítl konfiguraci APK|RESULT_CANCELED|APK\s+\d|kód\s+\d+/i.test(message)){
      return message;
    }
    if(/missing initial state|sessionstorage|storage-partitioned/i.test(message)){
      return "Prohlížeč neudržel návrat z Google přihlášení. Zkus tlačítko znovu; pokud se to opakuje, otevři stránku v Android Chromu a povol úložiště/cookies pro tento web.";
    }
    if(code==="auth/unauthorized-domain"){
      const domain=location.hostname || "serviszdroju.github.io";
      return `Doména ${domain} není povolená ve Firebase Authentication > Settings > Authorized domains.`;
    }
    if(code==="auth/operation-not-supported-in-this-environment"){
      return "Firebase přihlášení v tomto prostředí nefunguje. Otevři web přes https://serviszdroju.github.io/Mapa/.";
    }
    if(/popup_failed_to_open|popup_blocked/i.test(`${code} ${message}`)){
      return "Prohlížeč zablokoval Google přihlašovací okno. Povol popup okna pro tento web a zkus tlačítko znovu.";
    }
    if(/popup_closed|access_denied|cancel/i.test(`${code} ${message}`)){
      return "Google přihlášení bylo zavřené nebo přerušené před dokončením. Zkus tlačítko znovu a vyber účet @astip.cz.";
    }
    if(/idpiframe_initialization_failed|google identity/i.test(`${code} ${message}`)){
      return "Google přihlášení se v prohlížeči nepodařilo připravit. Zkontroluj blokování cookies/pop-up oken a zkus stránku znovu načíst.";
    }
    if(code==="auth/popup-blocked"){
      return "Prohlížeč zablokoval přihlašovací okno. Povol popup okno pro tento web nebo zkus tlačítko znovu.";
    }
    if(code==="auth/popup-closed-by-user"){
      return "Přihlašovací okno bylo zavřené před dokončením. Zkus tlačítko znovu a vyber účet @astip.cz.";
    }
    if(code==="auth/cancelled-popup-request"){
      return "Přihlášení bylo přerušeno dalším pokusem. Zkus tlačítko znovu.";
    }
    if(code==="auth/network-request-failed"){
      return "Firebase přihlášení nemá spojení. Zkontroluj internet nebo blokování v prohlížeči.";
    }
    if(code==="auth/account-exists-with-different-credential"){
      return "Tento e-mail je ve Firebase vedený pod jiným způsobem přihlášení.";
    }
    return [code,message].filter(Boolean).join(" ") || "Google účet se nepodařilo načíst. Zkus přihlášení znovu.";
  }
  function redirectResolver(){
    return authMod.browserPopupRedirectResolver || undefined;
  }
  function googleIdentityLoginError(error){
    const raw=error || {};
    const code=safe(raw.code || raw.type || raw.error);
    const message=safe(raw.message || raw.error_description || raw.details || raw);
    const err=new Error(message || code || "Google přihlášení bylo přerušené.");
    if(code) err.code=code;
    return err;
  }
  async function signInWithGoogleAccessToken(accessToken){
    const token=safe(accessToken);
    if(!token) throw new Error("Google nevrátil přihlašovací token.");
    if(auth && authMod && authMod.GoogleAuthProvider && authMod.signInWithCredential){
      const credential=authMod.GoogleAuthProvider.credential(null,token);
      return authMod.signInWithCredential(auth,credential);
    }
    const compatClient=getCompatAuthClient();
    if(
      compatClient &&
      window.firebase &&
      firebase.auth &&
      firebase.auth.GoogleAuthProvider &&
      compatClient.signInWithCredential
    ){
      const credential=firebase.auth.GoogleAuthProvider.credential(null,token);
      return compatClient.signInWithCredential(credential);
    }
    throw new Error("Firebase Auth není dostupný.");
  }
  async function signInWithGoogleIdToken(idToken){
    const token=safe(idToken);
    if(!token) throw new Error("Google nevrátil přihlašovací token.");
    if(auth && authMod && authMod.GoogleAuthProvider && authMod.signInWithCredential){
      const credential=authMod.GoogleAuthProvider.credential(token,null);
      return authMod.signInWithCredential(auth,credential);
    }
    const compatClient=getCompatAuthClient();
    if(
      compatClient &&
      window.firebase &&
      firebase.auth &&
      firebase.auth.GoogleAuthProvider &&
      compatClient.signInWithCredential
    ){
      const credential=firebase.auth.GoogleAuthProvider.credential(token,null);
      return compatClient.signInWithCredential(credential);
    }
    throw new Error("Firebase Auth není dostupný.");
  }
  function androidAuthBridge(){
    const bridge=window.SzzAndroidAuth;
    if(!bridge || typeof bridge.startGoogleSignIn!=="function") return null;
    try{
      if(typeof bridge.isGoogleSignInConfigured==="function" && !bridge.isGoogleSignInConfigured()) return null;
    }catch(e){
      return null;
    }
    return bridge;
  }
  function androidStoredAuthState(){
    const bridge=androidAuthBridge();
    if(!bridge) return null;
    try{
      if(typeof bridge.storedAuthJson==="function"){
        const parsed=JSON.parse(String(bridge.storedAuthJson() || "{}"));
        if(parsed && parsed.ok!==false) return parsed;
      }
    }catch(e){}
    try{
      return {
        ok:true,
        hasStoredAuth:typeof bridge.hasStoredGoogleSignIn==="function" ? !!bridge.hasStoredGoogleSignIn() : false,
        email:typeof bridge.storedEmail==="function" ? safe(bridge.storedEmail()).toLowerCase() : ""
      };
    }catch(e){}
    return null;
  }
  function androidHasStoredAuth(){
    const state=androidStoredAuthState();
    return !!(state && state.hasStoredAuth);
  }
  function signInWithAndroidGoogleIdToken(options={}){
    const bridge=androidAuthBridge();
    if(!bridge) throw new Error("Android Google přihlášení není v této APK dostupné.");
    return new Promise((resolve,reject)=>{
      let done=false;
      const finish=(fn,value)=>{
        if(done) return;
        done=true;
        window.__szzAndroidSignInWithGoogleIdToken=null;
        window.__szzAndroidSignInError=null;
        fn(value);
      };
      window.__szzAndroidSignInWithGoogleIdToken=token=>{
        signInWithGoogleIdToken(token)
          .then(result=>finish(resolve,result))
          .catch(error=>finish(reject,error));
      };
      window.__szzAndroidSignInError=message=>{
        finish(reject,new Error(safe(message) || "Android Google přihlášení se nepodařilo."));
      };
      try{
        if(options.silent && typeof bridge.restoreGoogleSignIn==="function") bridge.restoreGoogleSignIn();
        else bridge.startGoogleSignIn();
      }catch(error){
        finish(reject,error);
      }
      setTimeout(()=>{
        finish(reject,new Error("Android Google přihlášení nevrátilo výsledek včas. Zkus tlačítko znovu."));
      },90000);
    });
  }
  async function signInWithGoogleIdentityServices(){
    await primeCompatAuthPersistence();
    const google=await loadGoogleIdentityServices();
    const oauth2=google && google.accounts && google.accounts.oauth2;
    if(!oauth2 || typeof oauth2.initTokenClient!=="function"){
      throw new Error("Google Identity Services nejsou dostupné.");
    }
    return new Promise((resolve,reject)=>{
      let done=false;
      const finish=(fn,value)=>{
        if(done) return;
        done=true;
        fn(value);
      };
      let client=null;
      try{
        client=oauth2.initTokenClient({
          client_id:GOOGLE_WEB_CLIENT_ID,
          scope:"openid email profile",
          prompt:"select_account",
          hosted_domain:"astip.cz",
          callback:response=>{
            if(response && (response.error || response.error_description)){
              finish(reject,googleIdentityLoginError(response));
              return;
            }
            const token=response && response.access_token;
            signInWithGoogleAccessToken(token)
              .then(result=>finish(resolve,result))
              .catch(error=>finish(reject,error));
          },
          error_callback:error=>finish(reject,googleIdentityLoginError(error))
        });
        client.requestAccessToken({prompt:"select_account"});
      }catch(error){
        finish(reject,error);
      }
      setTimeout(()=>{
        finish(reject,new Error("Google přihlášení nevrátilo výsledek včas. Zkus tlačítko znovu."));
      },90000);
    });
  }
  function modularGoogleProvider(){
    if(!authMod || !authMod.GoogleAuthProvider) return null;
    const provider=new authMod.GoogleAuthProvider();
    provider.addScope("email");
    provider.addScope("profile");
    provider.setCustomParameters({prompt:"select_account",hd:"astip.cz"});
    return provider;
  }
  async function signInWithFirebaseGooglePopup(){
    await primeCompatAuthPersistence({load:true});
    const compatClient=getCompatAuthClient();
    const compatProvider=compatGoogleProvider();
    if(compatClient && compatProvider && typeof compatClient.signInWithPopup==="function"){
      return compatClient.signInWithPopup(compatProvider);
    }
    const provider=modularGoogleProvider();
    if(auth && provider && authMod && typeof authMod.signInWithPopup==="function"){
      const resolver=redirectResolver();
      return resolver ? authMod.signInWithPopup(auth,provider,resolver) : authMod.signInWithPopup(auth,provider);
    }
    throw new Error("Firebase popup přihlášení není dostupné.");
  }
  async function signInWithGoogleNoRedirect(){
    if(androidAuthBridge()){
      return signInWithAndroidGoogleIdToken();
    }
    try{
      return await signInWithFirebaseGooglePopup();
    }catch(popupError){
      const code=safe(popupError && popupError.code);
      const message=safe(popupError && popupError.message);
      if(/popup-closed-by-user|cancelled-popup-request|access_denied|cancel/i.test(`${code} ${message}`)){
        throw popupError;
      }
      console.warn("Firebase popup přihlášení selhalo, zkouším Google token bez redirectu",popupError);
      return signInWithGoogleIdentityServices();
    }
  }
  async function googleRedirectResultUser(){
    await primeCompatAuthPersistence();
    const compatClient=getCompatAuthClient();
    if(compatClient && compatClient.getRedirectResult){
      try{
        const result=await compatClient.getRedirectResult();
        if(result && result.user) return result.user;
      }catch(e){
        console.warn("Compat redirect výsledek přihlášení se nepodařilo načíst",e);
      }
    }
    if(authMod.getRedirectResult && auth){
      try{
        const resolver=redirectResolver();
        const result=resolver ? await authMod.getRedirectResult(auth,resolver) : await authMod.getRedirectResult(auth);
        if(result && result.user) return result.user;
      }catch(e){
        console.warn("Redirect výsledek přihlášení se nepodařilo načíst",e);
      }
    }
    return currentAuthCandidate();
  }
  function setProgressStatus(message){
    const p=document.getElementById("progress");
    setTextIfChanged(p,message || "");
    const gps=document.getElementById("gpsBox");
    if(gps && message){
      setDisplayIfChanged(gps,"block");
      setClassNameIfChanged(gps,"notice");
      setTextIfChanged(gps,message);
    }else if(gps && !message && gps.className==="notice"){
      setDisplayIfChanged(gps,"none");
      setTextIfChanged(gps,"");
    }
  }
  function setSignedUser(user){
    currentUser=user;
    window.currentUser=user;
    window.__authReadyUser=user;
    const userBox=document.getElementById("userBox");
    setTextIfChanged(userBox,user?`Přihlášen: ${user.email}`:"Nepřihlášeno");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode(user ? "logout" : "login");
    safeUpdateAdminAppControls();
  }
  function clearSignedUser(){
    currentUser=null;
    window.currentUser=null;
    window.__authReadyUser=null;
    const userBox=document.getElementById("userBox");
    setTextIfChanged(userBox,"Nepřihlášeno");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    safeUpdateAdminAppControls();
  }
  const GOOGLE_LOGIN_INTERACTION_MAX_AGE_MS=15000;
  function activeGoogleLoginGesture(){
    try{
      return !!(navigator.userActivation && navigator.userActivation.isActive);
    }catch(e){
      return false;
    }
  }
  function rememberGoogleLoginInteraction(event){
    if(event && typeof event.preventDefault==="function"){
      event.preventDefault();
      try{window.__szzGoogleLoginInteractionAt=Date.now();}catch(e){}
      return true;
    }
    return false;
  }
  function hasRecentGoogleLoginInteraction(){
    const at=Number(window.__szzGoogleLoginInteractionAt || 0);
    return activeGoogleLoginGesture() || (Number.isFinite(at) && at>0 && Date.now()-at<GOOGLE_LOGIN_INTERACTION_MAX_AGE_MS);
  }
  function isExplicitGoogleLoginRequest(options){
    return !!(options && options.explicit===true) || hasRecentGoogleLoginInteraction();
  }
  async function startFirebaseRedirectLogin(options={}){
    if(!isExplicitGoogleLoginRequest(options)){
      window.__loginRequested=false;
      if(appIsOpenOrHasRows() && !explicitSignOutPending()){
        keepAppOpenDuringAuthRestore("");
      }
      return false;
    }
    if(!firebaseReady || (!auth && !getCompatAuthClient())){
      const message="Firebase přihlášení ještě není připravené. Zkontroluj internet a zkus to znovu.";
      setStartupAuthChecking(false);
      if(typeof window.__szzSetAuthState==="function"){
        window.__szzSetAuthState("logged-out",{message,intro:"Přihlaste se Google účtem @astip.cz."});
      }else{
        showLogin();
        setStartupStatus(message);
      }
      return;
    }
    clearExplicitSignOut();
    clearAuthPending();
    authLoginInProgress=true;
    try{
      await primeCompatAuthPersistence();
      try{document.documentElement.classList.remove("auth-resume");}catch(e){}
      window.__loginRequested=true;
      setStartupAuthChecking(true);
      if(typeof window.__szzSetAuthState==="function"){
        window.__szzSetAuthState("logging-in",{
          intro:"Otevírám Google přihlášení...",
          message:"Otevírám Google přihlášení..."
        });
      }else{
        setStartupStatus("Otevírám Google přihlášení...");
      }
      const activeEmail=String(currentAuthCandidate()?.email || "").toLowerCase();
      if(activeEmail && !isAllowedLoginEmail(activeEmail)){
        setStartupStatus("Otevírám Google přihlášení, vyber účet @astip.cz...");
      }
      const loginResult=await signInWithGoogleNoRedirect();
      const loginUser=loginResult && loginResult.user ? loginResult.user : await waitForAuthCandidate(5000);
      if(loginUser){
        await handleAuthorizedUser(loginUser);
      }else{
        const restored=await waitForAuthCandidate(5000);
        if(restored) await handleAuthorizedUser(restored);
        else{
          clearAuthPending();
          if(!knownSignedIn()) try{document.documentElement.classList.remove("auth-resume");}catch(e){}
          setStartupAuthChecking(false);
          showLogin();
          setStartupStatus("Google přihlášení se zavřelo bez dokončení. Zkus tlačítko znovu a vyber účet @astip.cz.");
        }
      }
    }catch(e){
      clearAuthPending();
      if(isAndroidTransientAuthError(e) && appIsOpenOrHasRows() && !explicitSignOutPending()){
        console.warn("Android přihlášení se obnoví na pozadí, mapa zůstává otevřená",e);
        keepAppOpenDuringAuthRestore("");
        return;
      }
      if(navigator.onLine!==false) forgetKnownSignedIn();
      try{document.documentElement.classList.remove("auth-resume");}catch(e){}
      setStartupAuthChecking(false);
      showLogin();
      setStartupStatus("Přihlášení selhalo: " + authErrorText(e));
    }finally{
      authLoginInProgress=false;
    }
  }
  function startGoogleLoginFromUi(eventOrOptions){
    const fromEvent=rememberGoogleLoginInteraction(eventOrOptions);
    const explicit=fromEvent || !!(eventOrOptions && eventOrOptions.explicit===true) || hasRecentGoogleLoginInteraction();
    return startFirebaseRedirectLogin({explicit});
  }
  async function signOutFirebase(){
    authLoginInProgress=false;
    try{
      markExplicitSignOut();
      forgetKnownSignedIn();
      clearSignedUser();
      try{
        const bridge=window.SzzAndroidAuth;
        if(bridge && typeof bridge.signOut==="function") bridge.signOut();
      }catch(e){}
      const compatClient=getCompatAuthClient();
      await Promise.allSettled([
        compatClient && compatClient.signOut ? compatClient.signOut() : Promise.resolve(),
        auth && authMod.signOut ? authMod.signOut(auth) : Promise.resolve()
      ]);
    }catch(e){
      setStartupStatus("Odhlášení selhalo: " + (e.code || "") + " " + (e.message || e));
    }finally{
      location.reload();
    }
  }
  function delay(ms){
    return new Promise(resolve=>setTimeout(resolve,ms));
  }
  let backgroundAuthRetryTimer=null;
  let lastAuthorizedUserAt=0;
  const ANDROID_AUTH_RESUME_KEEP_OPEN_MS=8*60*60*1000;
  function currentAuthCandidate(){
    return safeSyncCurrentUserFromCompat() || window.__authReadyUser || window.currentUser || (auth && auth.currentUser) || null;
  }
  function isAndroidShellRuntime(){
    return !!(window.__szzAndroidShell || window.SzzAndroidAuth);
  }
  function appIsOpenOrHasRows(){
    const appEl=document.getElementById("mainApp");
    const visibleApp=!!(appEl && appEl.style.display && appEl.style.display!=="none");
    const resumed=!!(document.documentElement && document.documentElement.classList.contains("auth-resume"));
    const loadedRows=(Array.isArray(rows) && rows.length) || (Array.isArray(window.rows) && window.rows.length);
    return !!(window.__mapAppUnlocked || visibleApp || resumed || loadedRows || window.__firebaseUnifiedRowsLoaded);
  }
  function isAndroidTransientAuthError(error){
    const message=safe(error && (error.message || error.code) || error);
    return /Android Google přihlášení nevrátilo výsledek včas|Tiché obnovení Android přihlášení|native-resume|auth-null/i.test(message);
  }
  function shouldKeepAppOpenOnAuthNull(){
    const runtimeAuthorized=lastAuthorizedUserAt && appIsOpenOrHasRows();
    const androidAuthorized=isAndroidShellRuntime() && lastAuthorizedUserAt && Date.now()-lastAuthorizedUserAt<ANDROID_AUTH_RESUME_KEEP_OPEN_MS && androidHasStoredAuth();
    const offlineKnownSession=knownSignedIn() && navigator.onLine===false;
    return !explicitSignOutPending() && (runtimeAuthorized || androidAuthorized || offlineKnownSession || authPending());
  }
  async function waitForAuthCandidate(timeoutMs=3500){
    const started=Date.now();
    while(Date.now()-started<timeoutMs){
      const user=currentAuthCandidate();
      if(user) return user;
      await delay(250);
    }
    return currentAuthCandidate();
  }
  async function tryRestoreAuthCandidate(timeoutMs=4500){
    await ensureCompatAuthPersistence();
    if(auth && auth.authStateReady){
      await Promise.race([
        auth.authStateReady(),
        delay(timeoutMs)
      ]).catch(()=>{});
    }
    return currentAuthCandidate() || await waitForAuthCandidate(timeoutMs);
  }
  function clearBackgroundAuthRetry(){
    if(backgroundAuthRetryTimer){
      clearTimeout(backgroundAuthRetryTimer);
      backgroundAuthRetryTimer=null;
    }
  }
  let androidSilentAuthPromise=null;
  let lastAndroidSilentAuthAt=0;
  function canTryAndroidSilentAuth(){
    if(explicitSignOutPending() || authLoginInProgress) return false;
    const bridge=androidAuthBridge();
    return !!(bridge && typeof bridge.restoreGoogleSignIn==="function");
  }
  async function tryAndroidSilentAuth(reason="restore"){
    if(!canTryAndroidSilentAuth()) return null;
    const now=Date.now();
    if(androidSilentAuthPromise) return androidSilentAuthPromise;
    if(lastAndroidSilentAuthAt && now-lastAndroidSilentAuthAt<12000) return null;
    lastAndroidSilentAuthAt=now;
    const keepQuiet=appIsOpenOrHasRows();
    androidSilentAuthPromise=(async()=>{
      try{
        if(!keepQuiet){
          setStartupAuthChecking(true);
          setStartupStatus(reason==="auth-null"
            ? "Obnovuji Android přihlášení..."
            : "Kontroluji Android přihlášení...");
        }
        const result=await signInWithAndroidGoogleIdToken({silent:true});
        const user=result && result.user ? result.user : await waitForAuthCandidate(3500);
        if(user){
          await handleAuthorizedUser(user);
          return user;
        }
      }catch(e){
        console.warn("Tiché obnovení Android přihlášení selhalo",e);
        if(keepQuiet){
          setStartupAuthChecking(false);
          setProgressStatus("");
        }
      }finally{
        androidSilentAuthPromise=null;
      }
      return null;
    })();
    return androidSilentAuthPromise;
  }
  window.__szzAndroidAuthMaybeRestore=reason=>{
    if(currentAuthCandidate() || authLoginInProgress || explicitSignOutPending()) return false;
    if(!androidHasStoredAuth()) return false;
    tryAndroidSilentAuth(reason || "native-resume");
    return true;
  };
  function scheduleBackgroundAuthRetry(delayMs=2500){
    if(backgroundAuthRetryTimer || explicitSignOutPending()) return;
    backgroundAuthRetryTimer=setTimeout(async()=>{
      backgroundAuthRetryTimer=null;
      const restored=await tryRestoreAuthCandidate(3500);
      if(restored){
        handleAuthorizedUser(restored);
      }else if(await tryAndroidSilentAuth("auth-null")){
        return;
      }else if(shouldKeepAppOpenOnAuthNull()){
        scheduleBackgroundAuthRetry(Math.min(Math.max(delayMs*2,5000),30000));
      }
    },delayMs);
  }
  function keepAppOpenDuringAuthRestore(message){
    if(explicitSignOutPending()) return false;
    setStartupAuthChecking(false);
    try{document.documentElement.classList.add("auth-resume");}catch(e){}
    showApp({allowWithoutUser:true});
    const topLogoutBtn=document.getElementById("topLogoutBtn");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    setDisplayIfChanged(topLogoutBtn,"block");
    setProgressStatus(message || "Přihlášení se obnovuje na pozadí. Mapa zůstává otevřená z uložených dat.");
    runWhenIdle(()=>{
      try{
        if(typeof window.loadFirebaseSitesUnified==="function"){
          window.loadFirebaseSitesUnified(null,{offlineCacheOnly:true});
        }
      }catch(e){}
    },200);
    scheduleBackgroundAuthRetry();
    return true;
  }
  async function finishRedirectLoginIfPending(){
    if(!authPending()) return false;
    clearAuthPending();
    try{
      const user=await googleRedirectResultUser() || await tryRestoreAuthCandidate(2500);
      if(user){
        await handleAuthorizedUser(user);
        return true;
      }
    }catch(e){
      console.warn("Obnova přihlášení po starém redirectu selhala",e);
    }
    return false;
  }
  async function waitForFirebaseRowsLoader(timeoutMs=5000){
    const started=Date.now();
    while(typeof window.loadFirebaseSitesUnified!=="function" && Date.now()-started<timeoutMs){
      await delay(100);
    }
    return typeof window.loadFirebaseSitesUnified==="function";
  }
  let postLoginLoadToken=0;
  let postLoginLoadPromise=null;
  let backgroundDeltaSyncPromise=null;
  let lastBackgroundDeltaSyncAt=0;
  async function loadFirebaseRowsAfterAuth(reason="auth"){
    if(postLoginLoadPromise) return postLoginLoadPromise;
    postLoginLoadPromise=loadFirebaseRowsAfterAuthInner(reason).finally(()=>{postLoginLoadPromise=null;});
    return postLoginLoadPromise;
  }
  async function syncFirebaseRowsDeltaAfterAuth(reason="auth"){
    if(backgroundDeltaSyncPromise) return backgroundDeltaSyncPromise;
    if(navigator.onLine===false || !firebaseUnifiedPrimary) return 0;
    if(document.visibilityState==="hidden") return 0;
    if(typeof syncSzzOfflineMapRowDeltas!=="function") return 0;
    const now=Date.now();
    if(lastBackgroundDeltaSyncAt && now-lastBackgroundDeltaSyncAt<SZZ_BACKGROUND_DELTA_SYNC_MIN_MS) return 0;
    const ready=readSzzOfflineReadyState();
    const sinceMs=Number(ready.rowsSyncedAtMs || Date.parse(ready.preparedAt || "") || 0);
    if(!sinceMs) return 0;
    backgroundDeltaSyncPromise=(async()=>{
      await szzYieldToBrowser(900);
      setProgressStatus("Přihlášení potvrzeno. Kontroluji změny na pozadí...");
      const changedRows=await syncSzzOfflineMapRowDeltas(sinceMs,{background:true});
      const nowMs=Date.now();
      writeSzzOfflineReadyState({
        appBuildVersion:APP_BUILD_VERSION,
        preparedAt:ready.preparedAt || new Date().toISOString(),
        rowsSyncedAtMs:Math.max(0,nowMs-SZZ_OFFLINE_INCREMENTAL_SAFETY_MS),
        lastDeltaSyncAt:new Date().toISOString(),
        changedRows:Array.isArray(changedRows) ? changedRows.length : 0
      });
      if(Array.isArray(changedRows) && changedRows.length){
        requestRender();
        scheduleSzzBackgroundDetailPrefetch(changedRows,{
          reason:`${reason}-delta-details`,
          incremental:true,
          delayMs:900
        });
        setProgressStatus(`Synchronizováno na pozadí: ${changedRows.length} změněných bodů.`);
      }else{
        setProgressStatus("");
      }
      if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
      return Array.isArray(changedRows) ? changedRows.length : 0;
    })().finally(()=>{
      lastBackgroundDeltaSyncAt=Date.now();
      backgroundDeltaSyncPromise=null;
    });
    return backgroundDeltaSyncPromise;
  }
  async function loadFirebaseRowsAfterAuthInner(reason="auth"){
    if(!firebaseUnifiedPrimary) return true;
    const token=++postLoginLoadToken;
    const loaderReady=await waitForFirebaseRowsLoader();
    if(token!==postLoginLoadToken) return false;
    if(!loaderReady){
      setProgressStatus("Firebase načítání bodů ještě není připravené, zkusím to znovu bez obnovení stránky...");
      if(typeof scheduleFirebaseRowsAutoReload==="function") scheduleFirebaseRowsAutoReload(2500);
      return false;
    }
    if(typeof window.loadFirebaseSitesUnified==="function"){
      try{
        const cachedRows=await window.loadFirebaseSitesUnified(null,{offlineCacheOnly:true,skipFirestoreCache:true,allowOnlineCache:true});
        if(Array.isArray(cachedRows) && cachedRows.length){
          resetFirebaseRowsAutoReload();
          runWhenIdle(()=>syncFirebaseRowsDeltaAfterAuth(reason).catch(e=>{
            console.warn("Rozdílová synchronizace bodů po přihlášení selhala",e);
          }),900);
          return true;
        }
      }catch(e){
        console.warn("Lokální načtení bodů po přihlášení selhalo",e);
      }
    }
    if(navigator.onLine===false){
      setProgressStatus("Offline režim. Body se načtou z telefonu, Firebase se nebude zkoušet.");
      return false;
    }
    const ready=readSzzOfflineReadyState();
    const cachedRowsAvailable=readCachedFirebaseSiteCount();
    if(ready.rowsSyncedAtMs && cachedRowsAvailable){
      try{
        await syncFirebaseRowsDeltaAfterAuth(reason);
        return true;
      }catch(e){
        console.warn("Rozdílová synchronizace bodů po přihlášení selhala",e);
      }
    }
    setProgressStatus("První načtení na tomto zařízení: stahuji body z Firebase do telefonu...");
    try{
      const loaded=await window.loadFirebaseSitesUnified(null,{force:true,skipLocalCache:true});
      if((Array.isArray(loaded) && loaded.length) || (Array.isArray(rows) && rows.length)){
        resetFirebaseRowsAutoReload();
        const cachedRows=cacheCurrentFirebaseRowsForOffline();
        writeSzzOfflineReadyState({
          appBuildVersion:APP_BUILD_VERSION,
          preparedAt:new Date().toISOString(),
          rowsSyncedAtMs:Math.max(0,Date.now()-SZZ_OFFLINE_INCREMENTAL_SAFETY_MS),
          incremental:false,
          cachedRows
        });
        setProgressStatus("");
        try{fit();}catch(e){}
        scheduleSzzBackgroundDetailPrefetch(Array.isArray(loaded) && loaded.length ? loaded : rows,{
          reason:`${reason}-first-details`,
          incremental:false,
          forceFull:true,
          delayMs:1800
        });
        return true;
      }
    }catch(e){
      console.warn("První online načtení bodů po přihlášení selhalo",e);
    }
    setProgressStatus("Body se zatím nenačetly. Zkouším další načtení na pozadí bez obnovení stránky.");
    if(typeof scheduleFirebaseRowsAutoReload==="function") scheduleFirebaseRowsAutoReload(2500);
    return false;
  }
  async function handleAuthorizedUser(user){
    clearBackgroundAuthRetry();
    clearAuthPending();
    clearExplicitSignOut();
    setSignedUser(user);
    const email=String(user.email || "").toLowerCase();
    if(!isAllowedLoginEmail(email)){
      setStartupStatus("Přihlášení je povoleno jen pro @astip.cz. Přihlášený účet: " + (email || "bez e-mailu"));
      markExplicitSignOut();
      forgetKnownSignedIn();
      try{
        const bridge=window.SzzAndroidAuth;
        if(bridge && typeof bridge.signOut==="function") bridge.signOut();
      }catch(e){}
      const compatClient=getCompatAuthClient();
      await Promise.allSettled([
        compatClient && compatClient.signOut ? compatClient.signOut() : Promise.resolve(),
        auth && authMod.signOut ? authMod.signOut(auth) : Promise.resolve()
      ]);
      clearSignedUser();
      showLogin();
      return;
    }
    lastAuthorizedUserAt=Date.now();
    window.__szzLastAuthorizedUserAt=lastAuthorizedUserAt;
    rememberKnownSignedIn(user);
    setStartupAuthChecking(false);
    const topLogoutBtn=document.getElementById("topLogoutBtn");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("logout");
    setDisplayIfChanged(topLogoutBtn,"block");
    showApp();
    setProgressStatus("Přihlášení potvrzeno. Lokální data zůstávají otevřená, synchronizuji na pozadí...");
    await loadFirebaseRowsAfterAuth("login");
    if(typeof window.syncOfflineChanges==="function"){
      runWhenIdle(()=>window.syncOfflineChanges({reason:"login",silent:true}),1800);
    }
    if(selectedSite){
      runWhenIdle(()=>{
        try{ window.refreshLoadedDetailTabs?.(selectedSite); }catch(e){}
      },900);
    }
  }
  function handleExplicitSignedOutUi(){
    forgetKnownSignedIn();
    setStartupAuthChecking(false);
    clearSignedUser();
    const topLogoutBtn=document.getElementById("topLogoutBtn");
    setDisplayIfChanged(topLogoutBtn,"none");
    showLogin();
    if(lastAuthMessage && lastAuthMessage!=="Kontroluji přihlášení..."){
      setStartupStatus(lastAuthMessage);
    }else{
      setStartupStatus("");
    }
  }
  function showSignedOutLogin(message){
    clearSignedUser();
    setStartupAuthChecking(false);
    showLogin();
    setStartupStatus(message || "Nejsi přihlášený k Firebase. Servisní data se načtou po přihlášení; případná lokální cache se použije jen pro dříve přihlášené zařízení.");
  }
  function tryAndroidAuthThenLogin(message){
    if(!canTryAndroidSilentAuth()) return false;
    setStartupAuthChecking(true);
    setStartupStatus("Obnovuji Android přihlášení...");
    tryAndroidSilentAuth("auth-null").then(user=>{
      if(user) return;
      if(isAndroidShellRuntime() && androidHasStoredAuth() && appIsOpenOrHasRows() && !explicitSignOutPending()){
        keepAppOpenDuringAuthRestore("Android přihlášení se obnovuje na pozadí. Mapa zůstává otevřená z uložených dat.");
        scheduleBackgroundAuthRetry(10000);
        return;
      }
      forgetKnownSignedIn();
      showSignedOutLogin(message || "Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.");
    });
    return true;
  }
  function handleSignedOut(){
    if(authLoginInProgress){
      setStartupAuthChecking(true);
      setStartupStatus("Čekám na dokončení Google přihlášení...");
      return;
    }
    if(explicitSignOutPending()){
      handleExplicitSignedOutUi();
      return;
    }
    if(authPending()){
      setStartupAuthChecking(true);
      setStartupStatus("Kontroluji přihlášení...");
      finishRedirectLoginIfPending().then(async done=>{
        if(done) return;
        const restored=currentAuthCandidate();
        if(restored){
          handleAuthorizedUser(restored);
          return;
        }
        const androidUser=await tryAndroidSilentAuth("auth-null");
        if(androidUser) return;
        clearAuthPending();
        if(navigator.onLine===false && shouldKeepAppOpenOnAuthNull()){
          keepAppOpenDuringAuthRestore("Přihlášení se obnovuje na pozadí. Pokud je dostupná lokální Firebase cache, mapa zůstane dočasně otevřená z ní.");
          return;
        }
        if(navigator.onLine!==false) forgetKnownSignedIn();
        showSignedOutLogin("Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.");
      });
      return;
    }
    const knownSession=knownSignedIn() && !explicitSignOutPending();
    if(shouldKeepAppOpenOnAuthNull() && appIsOpenOrHasRows()){
      keepAppOpenDuringAuthRestore(navigator.onLine===false
        ? "Offline režim. Používám lokálně uložené body, protokoly a fotky."
        : "Přihlášení se obnovuje na pozadí. Mapa zůstává otevřená z uložených dat.");
      return;
    }
    if(knownSession && navigator.onLine===false){
      keepAppOpenDuringAuthRestore("Offline režim. Používám lokálně uložené body, protokoly a fotky.");
      return;
    }
    const restoringKnownSession=knownSession && Date.now()-authBootStartedAt<AUTH_RESTORE_GRACE_MS;
    if(restoringKnownSession){
      setStartupAuthChecking(true);
      setProgressStatus("Obnovuji přihlášení...");
      setTimeout(()=>{
        const restored=auth.currentUser || window.__authReadyUser || window.currentUser || safeSyncCurrentUserFromCompat();
        if(restored){
          handleAuthorizedUser(restored);
          return;
        }
        if(tryAndroidAuthThenLogin("Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.")) return;
        if(Date.now()-authBootStartedAt<AUTH_RESTORE_GRACE_MS){
          handleSignedOut();
          return;
        }
        if(navigator.onLine===false){
          keepAppOpenDuringAuthRestore("Offline režim. Používám lokálně uložené body, protokoly a fotky.");
        }else{
          forgetKnownSignedIn();
          showSignedOutLogin("Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.");
        }
      },600);
      return;
    }
    if(knownSession && navigator.onLine!==false && tryAndroidAuthThenLogin("Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.")){
      return;
    }
    if(navigator.onLine!==false && androidHasStoredAuth() && tryAndroidAuthThenLogin("Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.")){
      return;
    }
    if(knownSession && navigator.onLine!==false) forgetKnownSignedIn();
    showSignedOutLogin();
  }

  window.__startFirebaseRedirectLogin=startGoogleLoginFromUi;
  window.__signOutFirebase=signOutFirebase;
  window.startFirebaseGoogleLogin=startGoogleLoginFromUi;
  if(typeof window.startGoogleLogin!=="function") window.startGoogleLogin=startGoogleLoginFromUi;
  if(typeof window.loginPopup!=="function") window.loginPopup=startGoogleLoginFromUi;
  window.__startCompatGoogleLoginFallback=startGoogleLoginFromUi;
  if(typeof window.bindLoginButtons==="function") window.bindLoginButtons();
  if(typeof window.__szzRunPendingLogin==="function") window.__szzRunPendingLogin();

  try{
    setStartupStatus("Kontroluji přihlášení...");
    await primeCompatAuthPersistence();
    if(authPending()){
      await finishRedirectLoginIfPending();
    }else{
      const restored=currentAuthCandidate() || await tryRestoreAuthCandidate(1200) || await googleRedirectResultUser() || await tryRestoreAuthCandidate(2500);
      if(restored) await handleAuthorizedUser(restored);
      else if(androidHasStoredAuth()){
        await tryAndroidSilentAuth("startup");
      }
    }
  }catch(e){
    clearAuthPending();
    setStartupStatus("Chyba kontroly přihlášení: " + authErrorText(e));
  }

  let modularAuthListenerBound=false;
  if(auth && authMod.onAuthStateChanged){
    authMod.onAuthStateChanged(auth,user=>{
      if(user) handleAuthorizedUser(user);
      else handleSignedOut();
    });
    modularAuthListenerBound=true;
  }
  const compatAuthForListener=await primeCompatAuthPersistence();
  if(compatAuthForListener && compatAuthForListener.onAuthStateChanged){
    compatAuthForListener.onAuthStateChanged(user=>{
      if(user) handleAuthorizedUser(user);
      else if(!modularAuthListenerBound) handleSignedOut();
    });
  }
  if(!modularAuthListenerBound){
    console.warn("Modulární Firebase Auth listener není dostupný; používám pouze záložní compat listener.");
  }
  }
  })().catch(e=>{
    console.warn("Firebase inicializace selhala",e);
    clearExplicitSignOut();
    setStartupAuthChecking(false);
    const message=safe(e && (e.code || e.message) || e);
    setTextIfChanged(document.getElementById("startupStatus"),"Chyba kontroly přihlášení: " + (message || "Google účet se nepodařilo načíst. Zkus přihlášení znovu."));
  });
}

function setOfflineMapStatus(message="",state="info"){
  const el=document.getElementById("offlineMapStatus");
  if(!el) return;
  setDisplayIfChanged(el,message ? "block" : "none");
  setClassNameIfChanged(el,`notice offline-map-status ${state==="error" ? "err" : state==="ok" ? "ok" : ""}`.trim());
  setTextIfChanged(el,message);
}

function setOfflineMapButtonState(busy=false,text="Uložit zobrazenou mapu"){
  const button=document.getElementById("cacheMapTilesBtn");
  if(!button) return;
  if(czechOfflineMapReady()){
    setDisplayIfChanged(button,"none");
    setDisabledIfChanged(button,false);
    setTextIfChanged(button,"Mapa je uložená");
    return;
  }
  setDisplayIfChanged(button,"");
  setDisabledIfChanged(button,busy);
  setTextIfChanged(button,text);
}

async function cachedAppShellCountIfCurrent(signature){
  try{
    const ready=readSzzOfflineReadyState();
    const count=Number(ready && ready.shellCount);
    if(
      ready.appBuildVersion!==APP_BUILD_VERSION ||
      ready.appShellSignature!==signature ||
      !Number.isFinite(count) ||
      count<=0 ||
      !("caches" in window)
    ){
      return 0;
    }
    const cachedShell=
      await caches.match(new URL("./index.html",document.baseURI).href) ||
      await caches.match(new URL("./sw.js",document.baseURI).href) ||
      await caches.match("./");
    return cachedShell ? count : 0;
  }catch(e){
    return 0;
  }
}

async function cacheAppShellForOffline(options={}){
  if(!("serviceWorker" in navigator)) return 0;
  try{
    const registration=window.registerSzzServiceWorker
      ? await window.registerSzzServiceWorker()
      : await navigator.serviceWorker.register("./sw.js");
    await navigator.serviceWorker.ready;
    const urls=currentAppShellUrls();
    const signature=urls.join("\n");
    const reusable=options.force===true ? 0 : await cachedAppShellCountIfCurrent(signature);
    if(reusable) return reusable;
    const count=await cachedPostAppShellUrlsToServiceWorker(registration,urls);
    writeSzzOfflineReadyState({
      appBuildVersion:APP_BUILD_VERSION,
      appShellSignature:signature,
      shellCachedAt:new Date().toISOString(),
      shellCount:count
    });
    return count;
  }catch(e){
    console.warn("Service worker pro offline aplikaci se nepodařilo připravit",e);
    return 0;
  }
}

window.requestSzzPersistentStorage=requestSzzPersistentStorage;

const {
  clearCachedFirebaseSiteCount,
  readCachedFirebaseSiteCount
}=createFirebaseSiteCountCacheHelpers({
  cacheKey:SZZ_FIREBASE_SITE_CACHE_KEY,
  countOfflineSiteQueueItems:items=>countOfflineSiteQueueItems(items),
  maxAgeMs:1800
});
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_FIREBASE_SITE_CACHE_KEY){
    clearCachedFirebaseSiteCount();
  }
});

const {
  firebaseRowsForOffline,
  szzOfflineRowsForPrefetch
}=createOfflineRowSelectHelpers({
  getRows:()=>Array.isArray(window.rows) ? window.rows : rows,
  getRowsIndexVersion:()=>rowsIndexVersion,
  isPrimaryRows:current=>current===rows,
  safeValue:safe
});

const {
  appendOfflineChildItemsWithMeta,
  appendOfflineItems,
  cacheOfflineMediaUrls:cacheSzzOfflineMediaUrls,
  embeddedItemsForOffline:szzEmbeddedItemsForOffline,
  offlinePhotoUrls:szzOfflinePhotoUrls
}=createOfflinePrefetchItemHelpers({
  safeValue:safe,
  photoDisplayUrl:item=>photoDisplayUrl(item),
  photoFullUrl:item=>photoFullUrl(item),
  photoThumbUrl:item=>photoThumbUrl(item),
  runtimeCacheName:"astip-szz-v555-runtime",
  mediaFetchConcurrency:4
});

function saveFirebaseRowsCacheForRows(source=null){
  const firebaseRows=firebaseRowsForOffline(source);
  if(firebaseRows.length && typeof window.saveFirebaseMapRowsCache==="function"){
    try{ window.saveFirebaseMapRowsCache(firebaseRows); }catch(e){}
  }
  return firebaseRows.length || readCachedFirebaseSiteCount();
}

function cacheCurrentFirebaseRowsForOffline(){
  return saveFirebaseRowsCacheForRows();
}

const SZZ_OFFLINE_DETAIL_META_CACHE_MS=1800;
const {
  readOfflineDetailMeta:readSzzOfflineDetailMeta,
  writeOfflineDetailMeta:writeSzzOfflineDetailMeta,
  bindOfflineDetailMetaStorageListener:bindSzzOfflineDetailMetaStorageListener
}=createOfflineDetailMetaHelpers({
  storageKey:SZZ_OFFLINE_DETAIL_META_KEY,
  maxAgeMs:SZZ_OFFLINE_DETAIL_META_CACHE_MS
});
bindSzzOfflineDetailMetaStorageListener(window);

const {
  localOfflineDetailMeta:szzLocalOfflineDetailMeta,
  offlineSiteMetaKey:szzOfflineSiteMetaKey,
  readOfflineSiteMeta:readSzzOfflineSiteMeta,
  writeOfflineSiteMeta:writeSzzOfflineSiteMeta
}=createOfflineSiteMetaHelpers({
  detailKey:site=>detailKey(site),
  readOfflineDetailMeta:readSzzOfflineDetailMeta,
  readSiteLocalArrayMeta:safeReadSiteLocalArrayMeta,
  safeValue:safe,
  selectedSiteDocId:site=>selectedSiteDocId(site),
  writeOfflineDetailMeta:writeSzzOfflineDetailMeta
});

const {
  stableRawFingerprint:szzStableRawFingerprint,
  offlineRowFingerprint:szzOfflineRowFingerprint
}=createOfflineRowFingerprintHelpers();

const {
  readFirestoreDocsUpdatedSince
}=createFirestoreDeltaHelpers({
  getDb:()=>db,
  getFsMod:()=>fb && fb.fsMod,
  isFirebaseReady:()=>firebaseReady,
  isOnline:()=>navigator.onLine!==false,
  runBoundedFirestoreTasks,
  safetyMs:SZZ_OFFLINE_INCREMENTAL_SAFETY_MS,
  uniqueNonEmptyStrings
});

const {
  firebaseRowFromDocSnap:szzFirebaseRowFromDocSnap,
  firebaseRowKey:szzFirebaseRowKey
}=createFirebaseRowDocHelpers({
  applyLatestProtocolDateToRaw:()=>window.applyLatestProtocolDateToRaw,
  applySiteEditToRow:()=>window.applySiteEditToRow || window.applyEditToRow || (row=>row),
  normalizeSiteRows:()=>window.normalizeSiteRows || window.normalize,
  safeValue:safe
});

const {
  syncOfflineMapRowDeltas:syncSzzOfflineMapRowDeltas
}=createOfflineMapDeltaSyncHelpers({
  cacheCurrentRowsForOffline:()=>cacheCurrentFirebaseRowsForOffline(),
  getDb:()=>db,
  getFsMod:()=>fb && fb.fsMod,
  isFirebaseReady:()=>firebaseReady,
  isOnline:()=>navigator.onLine!==false,
  readFirestoreDocsUpdatedSince,
  rowFromDocSnap:szzFirebaseRowFromDocSnap,
  rowKey:szzFirebaseRowKey,
  runWhenIdle,
  upsertChangedRows:async(changedRows,{background,upsertBatchSize})=>{
    if(typeof window.upsertFirebaseSiteRows==="function"){
      if(background){
        try{ window.upsertFirebaseSiteRows(changedRows,{render:false}); }catch(e){}
        await szzYieldToBrowser(180);
      }else{
        try{ window.upsertFirebaseSiteRows(changedRows,{render:true}); }catch(e){}
      }
    }else if(typeof window.upsertFirebaseSiteRow==="function"){
      for(let i=0;i<changedRows.length;i++){
        try{ window.upsertFirebaseSiteRow(changedRows[i],false); }catch(e){}
        if(background && i%upsertBatchSize===upsertBatchSize-1) await szzYieldToBrowser(180);
      }
    }
  },
  waitForFirebaseUser
});

const {
  readOfflineStandaloneHistoryCollection
}=createOfflineStandaloneHistoryHelpers({
  createRecordIdDedupe,
  getDb:()=>db,
  getFsMod:()=>fb && fb.fsMod,
  hasMatchingHistoryItemForSite,
  isFirebaseReady:()=>firebaseReady,
  isOnline:()=>navigator.onLine!==false,
  matchingHistoryItemsForSite,
  readFirestoreArrayContainsAny,
  readFirestoreEqualsAny,
  runBoundedFirestoreTasks,
  safeValue:safe,
  siteRecordEqualityFields:SITE_RECORD_EQUALITY_FIELDS,
  siteRecordKeys,
  siteRecordTextKeys
});

const {
  prefetchOfflineDetailsForSite
}=createOfflineDetailPrefetchSiteHelpers({
  appendOfflineChildItemsWithMeta,
  appendOfflineItems,
  cacheOfflineMediaUrls:cacheSzzOfflineMediaUrls,
  detailMetaChanged:szzDetailMetaChanged,
  embeddedItemsForOffline:szzEmbeddedItemsForOffline,
  getDb:()=>db,
  getFsMod:()=>fb && fb.fsMod,
  isFirebaseReady:()=>firebaseReady,
  isOnline:()=>navigator.onLine!==false,
  loadSiteChildItemsForOffline,
  localOfflineDetailMeta:szzLocalOfflineDetailMeta,
  mergeSiteLocalArray,
  offlinePhotoUrls:szzOfflinePhotoUrls,
  offlineRowFingerprint:szzOfflineRowFingerprint,
  readOfflineSiteMeta:readSzzOfflineSiteMeta,
  readOfflineStandaloneHistoryCollection,
  refreshSiteDataFromFirebase,
  writeOfflineSiteMeta:writeSzzOfflineSiteMeta
});

const {
  isConstrainedDevice:szzIsConstrainedDevice,
  prefetchOfflineDetailData:prefetchSzzOfflineDetailData,
  scheduleBackgroundDetailPrefetch:scheduleSzzBackgroundDetailPrefetch
}=createOfflineDetailPrefetchRunner({
  getRowsForPrefetch:inputRows=>szzOfflineRowsForPrefetch(inputRows),
  isReady:()=>firebaseReady && !!db && !!(fb && fb.fsMod),
  isOnline:()=>navigator.onLine!==false,
  isPageVisible:()=>document.visibilityState!=="hidden",
  prefetchOfflineDetailsForSite:(site,options)=>prefetchOfflineDetailsForSite(site,options),
  runBoundedFirestoreTasks,
  runWhenIdle,
  safeValue:safe,
  scheduleOfflineAppStatus:delay=>{ if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(delay); },
  waitForFirebaseUser:safeWaitForFirebaseUser,
  writeOfflineReadyState:update=>writeSzzOfflineReadyState(update)
});

window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_OFFLINE_READY_KEY || event.key===SZZ_SYNC_STATE_KEY){
    clearSzzLocalStateObjectCache(event.key || "");
  }
});

function readSzzOfflineReadyState(){
  return readSzzLocalStateObject(SZZ_OFFLINE_READY_KEY);
}

function writeSzzOfflineReadyState(update={}){
  try{
    const next={...readSzzOfflineReadyState(),...update,updatedAt:new Date().toISOString()};
    return writeSzzLocalStateObject(SZZ_OFFLINE_READY_KEY,next);
  }catch(e){
    return {...update};
  }
}

const {
  prepareOfflineAppData:prepareSzzOfflineAppData
}=createOfflineAppPrepareHelpers({
  appBuildVersion:APP_BUILD_VERSION,
  cacheAppShellForOffline,
  cacheCurrentRowsForOffline:()=>cacheCurrentFirebaseRowsForOffline(),
  czechOfflineMapReady,
  getButton:()=>document.getElementById("prepareOfflineAppBtn"),
  getSyncText:()=>document.getElementById("appSyncText"),
  getWindowRows:()=>window.rows,
  incrementalSafetyMs:SZZ_OFFLINE_INCREMENTAL_SAFETY_MS,
  isOnline:()=>navigator.onLine!==false,
  loadFirebaseSitesUnified:(focusId,options)=>typeof window.loadFirebaseSitesUnified==="function" ? window.loadFirebaseSitesUnified(focusId,options) : null,
  openAppToolsPanel:()=>{ if(window.openAppToolsPanel) window.openAppToolsPanel(); },
  prefetchOfflineDetailData:(rowsForDetails,options)=>prefetchSzzOfflineDetailData(rowsForDetails,options),
  readCachedFirebaseSiteCount,
  readOfflineReadyState:()=>readSzzOfflineReadyState(),
  requestPersistentStorage:options=>requestSzzPersistentStorage(options),
  rowsForPrefetch:()=>szzOfflineRowsForPrefetch(),
  scheduleOfflineAppStatus:delay=>{ if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(delay); },
  setDisabledIfChanged,
  setTextIfChanged,
  showFirebaseMapRowsCache:(focusId,options)=>typeof window.showFirebaseMapRowsCache==="function" ? window.showFirebaseMapRowsCache(focusId,options) : null,
  showSaveConfirmation:message=>{ if(window.showSaveConfirmation) window.showSaveConfirmation(message); },
  storageEstimate:()=>szzStorageEstimate(),
  syncOfflineMapRowDeltas:sinceMs=>syncSzzOfflineMapRowDeltas(sinceMs),
  writeOfflineReadyState:update=>writeSzzOfflineReadyState(update)
});
window.prepareSzzOfflineAppData=prepareSzzOfflineAppData;

function visibleMapTileUrls(maxTiles=650){
  return visibleMapTileUrlsForMap(map,maxTiles);
}

function czechOfflineMapReady(){
  try{return localStorage.getItem(CZECH_OFFLINE_DONE_KEY)===CZECH_OFFLINE_TILE_VERSION;}catch(e){return false;}
}

function markCzechOfflineMapReady(){
  try{localStorage.setItem(CZECH_OFFLINE_DONE_KEY,CZECH_OFFLINE_TILE_VERSION);}catch(e){}
}

const {
  cacheMapTileUrls
}=createOfflineMapTileCacheHelpers({
  cacheAppShellForOffline,
  cacheName:MAP_TILE_CACHE_NAME,
  getNavigator:()=>navigator,
  getRunning:()=>window.__mapTileCacheRunning,
  markCzechReady:()=>markCzechOfflineMapReady(),
  reportServiceWorkerError:e=>{ if(typeof window.reportSzzServiceWorkerError==="function") window.reportSzzServiceWorkerError(e); },
  requestPersistentStorage:options=>requestSzzPersistentStorage(options),
  setButtonState:setOfflineMapButtonState,
  setRunning:value=>{ window.__mapTileCacheRunning=value; },
  setStatus:setOfflineMapStatus,
  showSaveConfirmation:message=>{ if(window.showSaveConfirmation) window.showSaveConfirmation(message); }
});

async function cacheVisibleMapTiles(){
  return cacheMapTileUrls(visibleMapTileUrls(),{
    label:"aktuální výřez mapy",
    donePrefix:"Mapa"
  });
}

async function cacheCzechOfflineMap(options={}){
  setOfflineMapStatus("Celou ČR z veřejného OSM serveru nestahuji. Ukládám pouze právě zobrazený výřez mapy.","ok");
  return cacheVisibleMapTiles(options);
}

function bindOfflineMapCacheButton(){
  const button=document.getElementById("cacheMapTilesBtn");
  if(button && !button.__offlineMapBound){
    button.addEventListener("click",()=>cacheVisibleMapTiles());
    button.__offlineMapBound=true;
  }
  setOfflineMapButtonState(false);
  setOfflineMapStatus("Mapové dlaždice se ukládají jen pro výřezy, které si zobrazíš. Celá ČR z OSM se nestahuje.");
}
document.addEventListener("DOMContentLoaded",bindOfflineMapCacheButton);
bindOfflineMapCacheButton();
window.cacheVisibleMapTiles=cacheVisibleMapTiles;
window.cacheCzechOfflineMap=cacheCzechOfflineMap;

window.appRegionOptions = () => APP_REGION_OPTIONS.slice();
const {
  clearFiltersForOpenedSite,
  filterControls
}=createFilterDomHelpers({
  updateStatusFilterColor:()=>updateStatusFilterColor()
});
const {
  filters,
  updateStatusFilterColor
}=createFilterOptionHelpers({
  regionOptions:APP_REGION_OPTIONS,
  statusOptions:APP_STATUS_FILTER_OPTIONS,
  filterControls
});
window.filters=filters;
const authAccessHelpers=createAuthAccessHelpers({
  adminEmails:APP_ADMIN_EMAILS,
  allowedEmails:APP_ALLOWED_EMAILS,
  protocolHistoryEmails:APP_PROTOCOL_HISTORY_EMAILS,
  getFirebaseReady:()=>firebaseReady,
  getAuthClient:()=>auth,
  getAuthModule:()=>fb.authMod,
  getCompatAuthClient,
  getCurrentUser:()=>currentUser || window.currentUser || window.__authReadyUser || null,
  setCurrentUser:user=>{
    currentUser=user;
    window.currentUser=user;
    window.__authReadyUser=user;
  },
  updateInstallButtons:()=>{
    if(typeof window.updateSzzInstallButtons==="function") window.updateSzzInstallButtons();
  }
});
const {
  compatAuthCurrentUser,
  syncCurrentUserFromCompat,
  currentUserEmail,
  isAllowedLoginEmail,
  isAppAdmin,
  canViewProtocolHistory,
  canViewMainProtocolHistory,
  canViewAllMainProtocolHistory,
  updateAdminAppControls,
  waitForFirebaseUser:resolvedWaitForFirebaseUser
}=authAccessHelpers;
authAccessWaitForFirebaseUser=resolvedWaitForFirebaseUser;
window.isAppAdmin=isAppAdmin;
window.canViewProtocolHistory=canViewProtocolHistory;
window.canViewMainProtocolHistory=canViewMainProtocolHistory;
window.canViewAllMainProtocolHistory=canViewAllMainProtocolHistory;
window.updateAdminAppControls=updateAdminAppControls;
document.addEventListener("DOMContentLoaded",updateAdminAppControls);
(window.queueMicrotask || (fn=>Promise.resolve().then(fn)))(updateAdminAppControls);
const {
  editCacheKeyForRow,
  editCacheEntryForRow,
  setLegacyEditCacheEntry
}=createLegacyEditCacheHelpers({
  getEditCache:()=>editCache,
  rowLookupKeys:r=>rowLookupKeys(r),
  siteRecordKeys:site=>siteRecordKeys(site)
});

const {
  applyEditToRow
}=createRowEditApplyHelpers({
  applyWatchSelfAliases,
  canonicalRegionValue,
  editCacheEntryForRow,
  explicitWatchSelfFromRaw,
  inferRegionFromAddressText,
  isFirebaseUnifiedRow,
  isNoOrderSite,
  num,
  orderedFlagFromRaw,
  repairOrderFlagFromRaw,
  restoreFirebaseMapStatusRawValues,
  stopFlagFromRaw
});
const {
  normalize
}=createRowNormalizeHelpers({
  applyEditToRow,
  canonicalRegionValue,
  explicitWatchSelfFromRaw,
  first,
  get,
  inferControlPeriodMonthsFromDateValues,
  inferRegionFromAddressText,
  lastCheckKeys:LAST_CHECK_KEYS,
  nextCheckKeys:NEXT_CHECK_KEYS,
  num,
  orderedFlagFromRaw,
  repairOrderFlagFromRaw,
  siteId,
  stopFlagFromRaw
});

window.normalize = normalize;
window.normalizeSiteRows = normalize;
window.applySiteEditToRow = applyEditToRow;

const {
  loadEdits
}=createLegacyEditLoadHelpers({
  applyEditToRow,
  clearEditCache:()=>{ editCache={}; },
  getDb:()=>db,
  getFirestoreModule:()=>fb.fsMod,
  getRowsSourceState:()=>({csvRows,extraSites,deletedSiteIds}),
  getStatusNode:()=>document.getElementById("editStatus"),
  isFirebaseReady:()=>firebaseReady,
  isFirebaseUnifiedPrimary:()=>firebaseUnifiedPrimary,
  render,
  setLegacyEditCacheEntry,
  setRows:nextRows=>{ window.rows=nextRows; rows=window.rows; }
});


const {
  getAllKnownDataKeys,
  newSiteFieldLabel,
  newSiteFieldNorm,
  shouldSkipNewSiteField
}=createNewSiteFieldHelpers({
  getRows:()=>rows
});




const {
  bindDetailShellControls,
  bindDrawerCloseButton,
  captureNormalDetailDrawerShell,
  dedupeDetailTabs,
  restoreNormalDetailDrawerShell
}=createDetailDrawerShellHelpers({
  bindProtocolToggleButton,
  closeDetailDrawer,
  drawerNode
});
window.captureNormalDetailDrawerShell=captureNormalDetailDrawerShell;
window.restoreNormalDetailDrawerShell=restoreNormalDetailDrawerShell;
window.bindDetailShellControls=bindDetailShellControls;

const {
  recalcEditNextCheck,
  recalcGpsForEditedAddress,
  setRegionFieldValue
}=createEditFormHelpers({
  addMonths,
  formatDateCz,
  geocodeAddressGeneric,
  getSelectedSite:()=>selectedSite,
  isoDateFromAny,
  parseDateValue,
  periodMonths,
  safe
});

const {
  calcNewSiteGpsFromAddress,
  clearNewSiteAllFields,
  collectNewSiteAllFields,
  forceRenderNewSiteForm,
  newSiteFieldElementsByKey,
  newSiteFieldValue,
  renderNewSiteAllFields,
  renderNewSiteFields,
  setNewSiteFieldValue,
  setNewSiteRegionValue,
  syncNewSiteRegionFromText
}=createNewSiteFormFieldHelpers({
  applyWatchSelfAliases,
  geocodeAddressFast,
  geocodeAddressGeneric,
  inferRegionFromAddressText,
  newSiteFieldNorm,
  safe,
  setInputValueIfExists,
  setRegionFieldValue
});

const {
  loadExtraSites,
  newSiteToRow,
  populateNewRegionOptions
}=createLegacyExtraSiteHelpers({
  applyEditToRow,
  applyWatchSelfAliases,
  daysBetweenToday,
  filterControlsReady:filters,
  getCsvRows:()=>csvRows,
  getDb:()=>db,
  getDeletedSiteIds:()=>deletedSiteIds,
  getFirestoreModule:()=>fb.fsMod,
  getNewSiteStatusNode:()=>document.getElementById("newSiteStatus"),
  getRegionOptions:()=>typeof window.appRegionOptions==="function" ? window.appRegionOptions() : APP_REGION_OPTIONS.slice(),
  isFirebaseReady:()=>firebaseReady,
  isFirebaseUnifiedPrimary:()=>firebaseUnifiedPrimary,
  normalize,
  render,
  setExtraSites:nextSites=>{ extraSites=Array.isArray(nextSites) ? nextSites : []; },
  setRows:nextRows=>{ window.rows=nextRows; rows=window.rows; }
});

function hideNewSiteSourceChooser(){
  const chooser=sourceChooserNode();
  if(chooser){
    chooser.style.display="none";
    chooser.replaceChildren();
    chooser.dataset.renderSignature="";
  }
}

const {
  clearNewSiteMode,
  openNewSiteForm,
  setNewSiteModeTitle
}=createNewSiteModeHelpers({
  clearNewSiteAllFields,
  detailSubNode,
  detailTableNode,
  detailTitleNode,
  drawerNode,
  forceRenderNewSiteForm,
  newSiteCardNode,
  populateNewRegionOptions,
  renderNewSiteAllFields,
  restoreNormalDetailDrawerShell,
  runAfterPaint,
  setAddSourceBaseSite:site=>{ addSourceBaseSite=site; },
  setNewSiteSourceChooserHidden:hideNewSiteSourceChooser,
  setSelectedSite:site=>{ selectedSite=site; window.selectedSite=site; },
  setTextIfChanged
});


let deletedSiteIds=new Set();
const {
  loadDeletedSites
}=createLegacyDeletedSiteHelpers({
  applyEditToRow,
  getAuthClient:()=>auth,
  getCsvRows:()=>csvRows,
  getCurrentUser:()=>currentUser || window.currentUser || window.__authReadyUser,
  getDb:()=>db,
  getExtraSites:()=>extraSites,
  getFirestoreModule:()=>fb.fsMod,
  isFirebaseReady:()=>firebaseReady,
  isFirebaseUnifiedPrimary:()=>firebaseUnifiedPrimary,
  setDeletedSiteIds:nextIds=>{ deletedSiteIds=nextIds instanceof Set ? nextIds : new Set(); },
  setRows:nextRows=>{ window.rows=nextRows; rows=window.rows; },
  syncCurrentUserFromCompat
});

const {
  deleteSelectedSite
}=createDeleteSiteHelpers({
  addDeletedSiteId:id=>deletedSiteIds.add(id),
  getCurrentUser:()=>currentUser,
  getDb:()=>db,
  getEditStatusNode:()=>document.getElementById("editStatus"),
  getFirestoreModule:()=>fb.fsMod,
  getLoadFirebaseSitesUnified:()=>window.loadFirebaseSitesUnified,
  getRemoveFirebaseSiteRow:()=>window.removeFirebaseSiteRow,
  getSelectedSite:()=>selectedSite,
  isAppAdmin,
  isFirebaseReady:()=>firebaseReady,
  isFirebaseUnifiedPrimary:()=>firebaseUnifiedPrimary,
  loadDeletedSites,
  loadExtraSites,
  render,
  saveFirebaseRowsCacheForRows,
  safe,
  setSelectedSite:site=>{ selectedSite=site; window.selectedSite=site; },
  showSaveConfirmation,
  drawerNode
});

const {
  filtered,
  rowMatchesSearch
}=createFilterLogicHelpers({
  ensureRowFastIndexes:(r,index)=>ensureRowFastIndexes(r,index),
  filterControls,
  getFilteredRowsCache:()=>filteredRowsCache,
  getRows:()=>rows,
  getRowsIndexVersion:()=>rowsIndexVersion,
  isNoOrderSite,
  regionTextNorm,
  rowRegion,
  rowSearchText,
  safe,
  searchNorm,
  setFilteredRowsCache:nextCache=>{ filteredRowsCache=nextCache; },
  statusText
});
window.sitePlaceLabel=sitePlaceLabel;
window.sitePlaceGroupKey=sitePlaceGroupKey;
const {
  cachedPlaceGroups,
  cachedRowsByPlaceGroup,
  groupColor,
  groupPrimaryRow,
  groupRepresentative,
  groupRowsByPlace,
  markerRowsSignature,
  siteHasMultipleSources,
  siteSiblingRows,
  sortedRowsBySourceLabel,
  statusPriority,
  uncachedHasMultipleSourcesForKey
}=createPlaceGroupHelpers({
  color,
  daysToComputedNext,
  detailKey,
  ensureRowScheduleCache,
  getFilteredRowsSignature:()=>filteredRowsCache.signature,
  getPlaceGroupCache:()=>siteRowsByPlaceGroupCache,
  getPlaceGroupsCache:()=>placeGroupsCache,
  getRows:()=>rows,
  getRowsIndexDirty:()=>rowsIndexDirty,
  getRowsIndexVersion:()=>rowsIndexVersion,
  setPlaceGroupCache:nextCache=>{ siteRowsByPlaceGroupCache=nextCache; },
  setPlaceGroupsCache:nextCache=>{ placeGroupsCache=nextCache; },
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceLabel,
  stableSignature,
  statusText,
  szzCompareCsBase
});
const {
  groupPopupHtml,
  resetSourcePopupActivationGuard
}=createSourcePopupHelpers({
  detailKey,
  escValue:esc,
  getLeaflet:()=>typeof L==="undefined" ? null : L,
  getMap:()=>map,
  markerRowsSignature,
  openDetailById:key=>window.openDetailById(key),
  siteSourceLabel,
  stableSignature,
  statusText
});
window.resetSourcePopupActivationGuard=resetSourcePopupActivationGuard;
const {
  bindMapViewportRendering,
  groupHasUsableGps,
  renderMapGroups,
  resetMapRenderCaches
}=createMapMarkerRenderHelpers({
  detailKey,
  escValue:esc,
  getLastVisiblePlaceGroups:()=>lastVisiblePlaceGroups,
  getLayer:()=>layer,
  getLeaflet:()=>typeof L==="undefined" ? null : L,
  getMap:()=>map,
  getRowsIndexVersion:()=>rowsIndexVersion,
  groupColor,
  groupPopupHtml,
  groupPrimaryRow,
  markerRowsSignature,
  openDetailById:key=>window.openDetailById(key),
  resetSourcePopupActivationGuard
});
const {
  mapStatusParitySnapshot
}=createMapStatusParityHelpers({
  color,
  detailKey,
  groupColor,
  groupHasUsableGps,
  groupPrimaryRow,
  groupRowsByPlace,
  inCzSk,
  siteSourceLabel,
  statusText
});
window.szzMapStatusParitySnapshot=mapStatusParitySnapshot;
const {
  renderCounters,
  renderSidebarGroups,
  resetSidebarRenderCaches
}=createSidebarRenderHelpers({
  daysToComputedNext,
  detailKey,
  displayNext,
  getFilteredRowsSignature:()=>filteredRowsCache.signature,
  getRowsIndexVersion:()=>rowsIndexVersion,
  gpsBoxNode,
  gpsCountNode,
  groupPrimaryRow,
  openDetailById:key=>window.openDetailById(key),
  pill,
  safeValue:safe,
  shownCountNode,
  sidebarListNode,
  siteSourceLabel,
  statusText
});
const {
  resetFirebaseRowsAutoReload,
  scheduleFirebaseRowsAutoReload
}=createFirebaseAutoReloadHelpers({
  getFirebaseReady:()=>firebaseReady,
  getFirebaseUnifiedPrimary:()=>firebaseUnifiedPrimary,
  getRows:()=>rows,
  getWindow:()=>window,
  waitForFirebaseUser
});
window.scheduleFirebaseRowsAutoReload=scheduleFirebaseRowsAutoReload;
const {
  fit,
  resetFitBoundsCache
}=createMapFitHelpers({
  filtered,
  getFilteredRowsSignature:()=>filteredRowsCache.signature,
  getMap:()=>map,
  inCzSk,
  syncRowIndexes
});
window.fit=fit;
appRenderLoop=createAppRenderLoopHelpers({
  bindMapViewportRendering,
  cachedPlaceGroups,
  filtered,
  getRows:()=>rows,
  getRowsGpsCount:()=>rowsGpsCountCache,
  inCzSk,
  renderCounters,
  renderMapGroups,
  renderSidebarGroups,
  resetFirebaseRowsAutoReload,
  setLastVisiblePlaceGroups:groups=>{ lastVisiblePlaceGroups=groups; },
  setWindowRows:nextRows=>{ window.rows=nextRows; },
  syncRowIndexes
});
const {
  beginManualGpsPick,
  closeMapFocusIfIdle,
  returnFromMapFocus,
  showMapFocusLocation,
  showSelectedSiteOnMap
}=createMapFocusHelpers({
  detailKey,
  drawerNode,
  escValue:esc,
  getLeaflet:()=>typeof L==="undefined" ? null : L,
  getMap:()=>map,
  getSelectedSite:()=>selectedSite,
  invalidateMapAfterPaint,
  openDetailById:key=>window.openDetailById(key),
  runAfterTwoPaints,
  showSaveConfirmation:message=>{ if(window.showSaveConfirmation) window.showSaveConfirmation(message); },
  statusText
});
window.showSelectedSiteOnMap=showSelectedSiteOnMap;
window.showMapFocusLocation=showMapFocusLocation;
window.returnFromMapFocus=returnFromMapFocus;
window.beginManualGpsPick=beginManualGpsPick;
function setNewDataFieldValue(key,value){
  const next=String(value || "");
  (newSiteFieldElementsByKey().get(key) || []).forEach(el=>{
    if(el.value!==next) el.value=next;
  });
}
function copyPlaceFieldsToNewSource(site){
  if(!site) return;
  const raw=site.raw || {};
  const place=sitePlaceLabel(site);
  const region=rowRegion(site);
  const contact=safe(site.kontakt || rawValueForAny(raw,["Kontakt","Kontakt_mapy","Hlavní kontakt"]));
  setInputValue("newName",safe(raw["Název"] || site.adresa || place));
  setInputValue("newGpsAddress",place);
  setInputValue("newGpsLat",Number.isFinite(site.lat) ? String(site.lat) : "");
  setInputValue("newGpsLon",Number.isFinite(site.lon) ? String(site.lon) : "");
  setInputValue("newRegion",region || "");
  setInputValue("newContact",contact);
  setInputValue("newSource","");
  setInputValue("newNextCheck","");
  setInputValue("newLastCheck","");
  setInputValue("newNotes","");
  setInputValue("newExtra","");
  setInputChecked("newNoOrder",false);
  setNewDataFieldValue("Název",safe(raw["Název"] || site.adresa || place));
  setNewDataFieldValue("Adresa / umístění",place);
  setNewDataFieldValue("Adresa_GPS",place);
  setNewDataFieldValue("Kraj",region || "");
  setNewDataFieldValue("Kontakt",contact);
  setNewDataFieldValue("Popis_zdroje","");
  setNewDataFieldValue("Zdroj","");
  setNewDataFieldValue("Perioda kontrol",userSiteSharedFieldValue(site,"Perioda kontrol") || "12");
  setNewDataFieldValue("Hlídáme kontroly sami",userSiteSharedFieldValue(site,"Hlídáme sami termín") || "ne");
  setNewDataFieldValue("Smlouva ano/ne",userSiteSharedFieldValue(site,"Smlouva ano/ne") || "ne");
  setNewDataFieldValue("Důležitá poznámka",userSiteSharedFieldValue(site,"Důležitá poznámka"));
}
function openAddSourceForSite(site=selectedSite){
  if(!site) return;
  addSourceBaseSite=site;
  openNewSiteForm();
  addSourceBaseSite=site;
  const title=document.getElementById("drawerTitle") || detailTitleNode();
  const sub=document.getElementById("drawerSub") || detailSubNode();
  if(title) title.textContent="Přidat další zdroj";
  if(sub) sub.textContent=sitePlaceLabel(site) || site.adresa || "";
  copyPlaceFieldsToNewSource(site);
  const st=document.getElementById("newSiteStatus");
  if(st) st.textContent="Adresa a GPS jsou převzaté z aktuálního místa. Doplň typ zdroje nebo výrobní číslo.";
  runAfterPaint(()=>{
    const source=document.getElementById("newSource") || document.querySelector('#newAllFieldsBox [data-new-key="Popis_zdroje"]');
    if(source){
      source.focus();
      source.scrollIntoView({behavior:"smooth",block:"center"});
    }
  });
}
function openAddSourceForSiteByKey(key){
  const row=findRowByAnyId(key);
  if(row) openAddSourceForSite(row);
}
function sourceChooserRenderSignature(site,siblings,activeKey){
  const parts=[
    rowsIndexVersion,
    activeKey,
    sitePlaceGroupKey(site),
    sitePlaceLabel(site),
    markerRowsSignature(siblings)
  ];
  let signature="";
  for(let i=0;i<parts.length;i++){
    if(i) signature+="\u001f";
    signature+=stableSignaturePart(parts[i]);
  }
  return signature;
}
function bindSourceChooserClick(box){
  if(!box || box.__szzSourceChooserClickBound) return;
  box.__szzSourceChooserClickBound=true;
  box.addEventListener("click",event=>{
    const sourceBtn=event.target.closest && event.target.closest("[data-source-key]");
    if(sourceBtn && box.contains(sourceBtn)){
      window.openDetailById(sourceBtn.getAttribute("data-source-key"));
      return;
    }
    const addBtn=event.target.closest && event.target.closest("[data-add-source]");
    if(addBtn && box.contains(addBtn)){
      openAddSourceForSiteByKey(addBtn.getAttribute("data-add-source"));
    }
  });
}
function renderSourceChooser(site=selectedSite){
  const box=sourceChooserNode();
  if(!box) return;
  bindSourceChooserClick(box);
  const siblings=siteSiblingRows(site);
  if(!site){
    box.style.display="none";
    box.replaceChildren();
    box.dataset.renderSignature="";
    return;
  }
  const activeKey=detailKey(site);
  const signature=sourceChooserRenderSignature(site,siblings,activeKey);
  if(box.dataset.renderSignature===signature && box.childElementCount){
    box.style.display="block";
    return;
  }
  box.style.display="block";
  box.dataset.renderSignature=signature;
  const title=document.createElement("div");
  title.className="source-chooser-title";
  title.textContent="Zdroje na tomto místě";
  const buttons=document.createElement("div");
  buttons.className="source-chooser-buttons";
  siblings.forEach(row=>{
    const btn=document.createElement("button");
    const classes=["source-chooser-button"];
    if(detailKey(row)===activeKey) classes.push("active");
    if(row && row.stopped === true) classes.push("stop-source");
    btn.className=classes.join(" ");
    btn.type="button";
    btn.dataset.sourceKey=safe(detailKey(row));
    btn.appendChild(document.createTextNode(siteSourceLabel(row)));
    const meta=document.createElement("small");
    meta.textContent=statusText(row);
    btn.appendChild(meta);
    buttons.appendChild(btn);
  });
  const addBtn=document.createElement("button");
  addBtn.className="source-chooser-button";
  addBtn.type="button";
  addBtn.dataset.addSource=safe(activeKey);
  addBtn.appendChild(document.createTextNode("+ Přidat další zdroj"));
  const addMeta=document.createElement("small");
  addMeta.textContent=sitePlaceLabel(site) || site.adresa || "";
  addBtn.appendChild(addMeta);
  buttons.appendChild(addBtn);
  box.replaceChildren(title,buttons);
}
function rowRegion(r){
  return canonicalRegionValue(r && r.kraj) || inferRegionFromAddressText(rowSearchText(r));
}
window.rowRegion=rowRegion;
let siteRowsByAnyId=new Map();
let siteRowIndexByRef=new WeakMap();
let siteRowIndexByOriginalIndex=new Map();
let csvRowsByAnyId=new Map();
let rowsGpsCountCache=0;
let lastVisiblePlaceGroups=[];
let rowsIndexVersion=0;
let rowsIndexDirty=true;
let indexedRowsRef=null;
let indexedRowsLength=-1;
let indexedCsvRowsRef=null;
let indexedCsvRowsLength=-1;
let filteredRowsCache={signature:"",rows:[]};
let placeGroupsCache={sourceRows:null,signature:"",groups:[]};
let siteRowsByPlaceGroupCache={rowsRef:null,version:-1,map:new Map()};

function markRowsDirty(){
  rowsIndexDirty=true;
  filteredRowsCache={signature:"",rows:[]};
  placeGroupsCache={sourceRows:null,signature:"",groups:[]};
  siteRowsByPlaceGroupCache={rowsRef:null,version:-1,map:new Map()};
  resetMapRenderCaches();
  resetSidebarRenderCaches();
  resetFitBoundsCache();
}

function installRowsWindowBridge(){
  const existingRows=Array.isArray(window.rows) ? window.rows : rows;
  if(existingRows!==rows && existingRows.length && !rows.length){
    rows=existingRows;
    rowsIndexDirty=true;
  }
  try{
    Object.defineProperty(window,"rows",{
      configurable:true,
      get(){ return rows; },
      set(nextRows){
        const normalized=Array.isArray(nextRows) ? nextRows : [];
        const changed=normalized!==indexedRowsRef || normalized.length!==indexedRowsLength || normalized!==rows;
        rows=normalized;
        if(changed) markRowsDirty();
      }
    });
  }catch(e){
    window.rows=rows;
  }
}

function installSelectedSiteWindowBridge(){
  const existingSite=window.selectedSite;
  if(existingSite && !selectedSite) selectedSite=existingSite;
  try{
    Object.defineProperty(window,"selectedSite",{
      configurable:true,
      get(){ return selectedSite; },
      set(nextSite){ selectedSite=nextSite || null; }
    });
  }catch(e){
    window.selectedSite=selectedSite;
  }
}

window.markRowsDirty=markRowsDirty;
installRowsWindowBridge();
installSelectedSiteWindowBridge();

const {
  rowLookupKeys:resolvedRowLookupKeys,
  selectedSiteDocId:resolvedSelectedSiteDocId,
  siteRecordKeys:resolvedSiteRecordKeys,
  siteRecordIdentity:resolvedSiteRecordIdentity,
  siteRecordKeySet:resolvedSiteRecordKeySet
}=createRowIdentityHelpers({
  getSelectedSite:()=>selectedSite,
  detailKey,
  sitePlaceGroupKey,
  siteSourceIdentity,
  uniqueNonEmptyStrings
});
rowLookupKeysImpl=resolvedRowLookupKeys;
selectedSiteDocIdImpl=resolvedSelectedSiteDocId;
siteRecordKeysImpl=resolvedSiteRecordKeys;
siteRecordIdentityImpl=resolvedSiteRecordIdentity;
siteRecordKeySetImpl=resolvedSiteRecordKeySet;
window.selectedSiteDocId=selectedSiteDocId;
const {
  siteRecordTextKeys:resolvedSiteRecordTextKeys,
  siteRecordNormTextKeys:resolvedSiteRecordNormTextKeys,
  recordMatchTextKeys:resolvedRecordMatchTextKeys
}=createRecordTextHelpers({
  getSelectedSite:()=>selectedSite,
  searchNorm
});
siteRecordTextKeysImpl=resolvedSiteRecordTextKeys;
siteRecordNormTextKeysImpl=resolvedSiteRecordNormTextKeys;
recordMatchTextKeysImpl=resolvedRecordMatchTextKeys;
const {
  recordSourceIdentity,
  recordSourceMatchesSite
}=createRecordSourceHelpers({
  searchNorm,
  siteSourceIdentity
});

const {
  ensureRowFastIndexes,
  rowRenderFingerprint
}=createRowFastIndexHelpers({
  ensureRowPlaceCache,
  ensureRowScheduleCache,
  ensureRowSourceCache,
  regionTextNorm,
  rowLookupKeys,
  rowRegion,
  rowScheduleFingerprint,
  rowSearchText,
  searchNorm,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceIdentity,
  statusText
});

function rebuildRowLookupCache(){
  const lookup=new Map();
  const indexByRef=new WeakMap();
  const indexByOriginalIndex=new Map();
  let gpsCount=0;
  for(let i=0;i<rows.length;i++){
    const r=rows[i];
    if(r && (typeof r==="object" || typeof r==="function")) indexByRef.set(r,i);
    if(Number.isFinite(r && r.i) && !indexByOriginalIndex.has(r.i)) indexByOriginalIndex.set(r.i,i);
    if(inCzSk(r)) gpsCount++;
    const keys=rowLookupKeys(r);
    for(const key of keys){
      if(!lookup.has(key)) lookup.set(key,r);
    }
  }
  siteRowsByAnyId=lookup;
  siteRowIndexByRef=indexByRef;
  siteRowIndexByOriginalIndex=indexByOriginalIndex;
  rowsGpsCountCache=gpsCount;
  window.siteRowsByAnyId=siteRowsByAnyId;
}

function rebuildCsvRowLookupCache(){
  const lookup=new Map();
  const sourceRows=Array.isArray(csvRows) ? csvRows : [];
  for(let i=0;i<sourceRows.length;i++){
    const r=sourceRows[i];
    const keys=rowLookupKeys(r);
    for(const key of keys){
      if(!lookup.has(key)) lookup.set(key,i);
    }
  }
  csvRowsByAnyId=lookup;
  indexedCsvRowsRef=csvRows;
  indexedCsvRowsLength=csvRows.length;
  window.csvRowsByAnyId=csvRowsByAnyId;
}

function syncCsvRowLookupCache(){
  if(indexedCsvRowsRef===csvRows && indexedCsvRowsLength===csvRows.length && csvRowsByAnyId.size) return;
  rebuildCsvRowLookupCache();
}

function syncRowIndexes(){
  const rowsRefChanged=indexedRowsRef!==rows;
  const rowsLengthChanged=indexedRowsLength!==rows.length;
  if(!rowsIndexDirty && !rowsRefChanged && !rowsLengthChanged && siteRowsByAnyId.size){
    return;
  }
  let indexesChanged=rowsRefChanged || rowsLengthChanged;
  for(let i=0;i<rows.length;i++){
    const r=rows[i];
    const beforeIndex=r && r.i;
    const beforeSearchRawRef=r && r._searchRawRef;
    const beforeRegion=r && r._regionNorm;
    const beforeStatus=r && r._statusText;
    const beforeFingerprint=r && r._renderIndexFingerprint;
    ensureRowFastIndexes(r,i);
    const nextFingerprint=r ? rowRenderFingerprint(r) : "";
    if(r && (beforeIndex!==r.i || beforeSearchRawRef!==r._searchRawRef || beforeRegion!==r._regionNorm || beforeStatus!==r._statusText)){
      indexesChanged=true;
    }
    if(r && beforeFingerprint!==nextFingerprint){
      r._renderIndexFingerprint=nextFingerprint;
      indexesChanged=true;
    }
  }
  if(!indexesChanged){
    indexedRowsRef=rows;
    indexedRowsLength=rows.length;
    rowsIndexDirty=false;
    return;
  }
  rebuildRowLookupCache();
  rowsIndexVersion++;
  siteRowsByPlaceGroupCache={rowsRef:null,version:-1,map:new Map()};
  indexedRowsRef=rows;
  indexedRowsLength=rows.length;
  rowsIndexDirty=false;
}
function rowMatchesAnyLookupKey(row,key){
  const wanted=String(key || "").trim();
  if(!row || !wanted) return false;
  return rowLookupKeys(row).includes(wanted);
}
function rowIndexForRow(row){
  if(!row) return -1;
  if(Number.isFinite(row.i) && rows[row.i]===row) return row.i;
  syncRowIndexes();
  const cached=siteRowIndexByRef.get(row);
  if(Number.isInteger(cached) && rows[cached]===row) return cached;
  return rows.indexOf(row);
}
function rowIndexForOriginalIndex(originalIndex){
  const numeric=Number(originalIndex);
  if(!Number.isFinite(numeric)) return -1;
  syncRowIndexes();
  const cached=siteRowIndexByOriginalIndex.get(numeric);
  return Number.isInteger(cached) ? cached : -1;
}
function csvRowIndexForRow(row){
  if(!row) return -1;
  syncCsvRowLookupCache();
  const keys=rowLookupKeys(row);
  for(const key of keys){
    const idx=csvRowsByAnyId.get(key);
    if(Number.isInteger(idx) && rowMatchesAnyLookupKey(csvRows[idx],key)) return idx;
  }
  return -1;
}
function findRowByAnyId(key,pool=rows){
  const wanted=String(key || "").trim();
  if(!wanted) return null;
  if(pool===rows){
    syncRowIndexes();
    const direct=siteRowsByAnyId && siteRowsByAnyId.get(wanted);
    if(direct) return direct;
  }
  const source=Array.isArray(pool) ? pool : [];
  for(const row of source){
    if(row && rowLookupKeys(row).includes(wanted)) return row;
  }
  return null;
}
window.findRowByAnyId=findRowByAnyId;
function detailKey(r){
  return editCacheKeyForRow(r);
}
window.detailKey=detailKey;
function recordMatchesSite(record,site=selectedSite){
  if(!record || !site) return false;
  const keySet=siteRecordKeySet(site);
  for(const key of recordIdKeys(record)){
    if(keySet.has(key)) return true;
  }
  if(siteHasMultipleSources(site) && !recordSourceMatchesSite(record,site)) return false;

  const siteTexts=siteRecordNormTextKeys(site);
  const recordTexts=recordMatchTextKeys(record);
  for(const a of siteTexts){
    for(const b of recordTexts){
      if(a===b || (a.length>=10 && b.length>=10 && (a.includes(b) || b.includes(a)))) return true;
    }
  }
  return false;
}
Object.assign(window,{
  geocodeAddressGeneric,
  geocodeAddressFast,
  geocodeRequestedHouseNumbers,
  inferControlPeriodMonthsFromDateValues,
  inferControlPeriodMonthsFromDates,
  inferRegionFromAddressText,
  canonicalRegionValue,
  regionTextNorm,
  sitePlaceGroupKey,
  sitePlaceLabel,
  siteSourceLabel,
  siteSourceIdentity,
  siteSiblingRows,
  rowRegion,
  openAddSourceForSite,
  openAddSourceForSiteByKey,
  siteRecordKeys,
  selectedSiteDocId,
  siteRecordTextKeys,
  recordMatchesSite,
  startDetailManualGpsPick,
  startLegacyNewManualGpsPick,
  startOnlyNewManualGpsPick,
  startFbUnifiedManualGpsPick,
  refreshSiteDataFromFirebase,
  applyLatestProtocolDateToRaw,
  applyLatestProtocolToSite,
  updateSiteControlDateFromProtocol,
  waitForFirebaseUser,
  isAppAdmin,
  setRegionFieldValue
});
window.openDetailById=function(id){
  const wanted=String(id || "").trim();
  if(!wanted) return false;
  syncRowIndexes();
  const row=findRowByAnyId(wanted);
  let idx=rowIndexForRow(row);
  if(idx<0 && row){
    const keys=rowLookupKeys(row);
    for(const key of keys){
      for(let i=0;i<rows.length;i++){
        if(rowMatchesAnyLookupKey(rows[i],key)){
          idx=i;
          break;
        }
      }
      if(idx>=0) break;
    }
  }
  if(idx<0){
    for(let i=0;i<rows.length;i++){
      if(rowMatchesAnyLookupKey(rows[i],wanted)){
        idx=i;
        break;
      }
    }
  }
  if(idx>=0){
    window.openDetail(idx);
    return true;
  }
  return false;
};
function render(){
  return appRenderLoop && appRenderLoop.render();
}
window.render=render;
function requestRender(){
  return appRenderLoop && appRenderLoop.requestRender();
}
window.requestRender=requestRender;
function closeDetailDrawer(){
  try{ setProtocolFormOpen(false,{skipPrefill:true}); }catch(e){
    try{ setProtocolFormFullscreen(false); }catch(_e){}
  }
  const drawer=drawerNode();
  if(drawer){
    drawer.classList.remove("open");
    drawer.classList.remove("protocol-form-fullscreen");
  }
  document.body.classList.remove("protocol-form-fullscreen");
  closeMapFocusIfIdle();
  if(typeof window.resetSourcePopupActivationGuard==="function"){
    window.resetSourcePopupActivationGuard();
  }
  try{
    if(map && typeof map.closePopup==="function") map.closePopup();
  }catch(e){}
  invalidateMapAfterPaint();
}
window.closeDetailDrawer=closeDetailDrawer;
window.siteDedupKeysFromRaw = siteDedupKeysFromRaw;
window.dedupeSiteRows = dedupeSiteRows;
const {
  hiddenFirebaseRowInfo,
  isFirebaseRowHidden,
  updateFirebaseLoadReport
}=createFirebaseLoadReportHelpers({
  getDeletedSiteIds:()=>deletedSiteIds,
  getRows:()=>rows,
  setLastFirebaseLoadReport:report=>{ window.__lastFirebaseLoadReport=report; }
});
function openFirebaseRowAfterRender(openDocId){
  if(!openDocId) return;
  const r=findRowByAnyId(openDocId);
  if(!r) return;
  if(Number.isFinite(r.lat)&&Number.isFinite(r.lon)) runAfterPaint(()=>map.setView([r.lat,r.lon],14));
  runAfterTwoPaints(()=>window.openDetailById(openDocId));
}
window.setFirebaseSiteRows = function(firebaseRows, openDocId=null){
  firebaseUnifiedPrimary = true;
  window.firebaseUnifiedPrimary = true;
  window.__firebaseUnifiedPrimary = true;
  const deduped=dedupeSiteRows(firebaseRows, openDocId);
  const openedDocId=openDocId ? String(openDocId) : "";
  csvRows = deduped.rows;
  rebuildCsvRowLookupCache();
  const hiddenRows=[];
  rows = csvRows
    .map((r,i)=>{r.i=i; return applyEditToRow(r);})
    .filter(r=>{
      const hidden=isFirebaseRowHidden(r,openedDocId);
      if(hidden) hiddenRows.push(hiddenFirebaseRowInfo(r));
      return !hidden;
    });
  window.rows = rows;
  updateFirebaseLoadReport(firebaseRows,deduped.rows,hiddenRows,deduped.duplicateRows);
  if(openDocId) clearFiltersForOpenedSite();
  filters();
  render();
  openFirebaseRowAfterRender(openDocId);
  return rows;
};
window.upsertFirebaseSiteRow = function(firebaseRow, openDocId=null, options={}){
  if(!firebaseRow) return rows;
  const nextRows = csvRows.slice();
  let existingIndex = csvRowIndexForRow(firebaseRow);
  if(existingIndex<0){
    existingIndex = nextRows.findIndex(r=>{
      if(firebaseRow.firebaseDocId && r.firebaseDocId===firebaseRow.firebaseDocId) return true;
      return r.id && firebaseRow.id && r.id===firebaseRow.id;
    });
  }

  if(existingIndex>=0) nextRows[existingIndex]=firebaseRow;
  else nextRows.push(firebaseRow);

  const targetOpenDocId=openDocId===false ? null : (openDocId || firebaseRow.firebaseDocId || firebaseRow.id);
  const openedDocId=targetOpenDocId ? String(targetOpenDocId) : "";
  const csvIndex=existingIndex>=0 ? existingIndex : nextRows.length-1;
  csvRows=nextRows;
  rebuildCsvRowLookupCache();
  const indexedRow={...firebaseRow,i:csvIndex};
  const nextVisibleRow=applyEditToRow(indexedRow);
  const hiddenRows=[];
  let nextVisibleRows=rows.slice();
  const selectedKey=selectedSite ? (detailKey(selectedSite) || selectedSite.id || selectedSite.firebaseDocId) : "";
  const visibleIndex=rowIndexForOriginalIndex(csvIndex);
  if(isFirebaseRowHidden(nextVisibleRow,openedDocId)){
    hiddenRows.push(hiddenFirebaseRowInfo(nextVisibleRow));
    if(visibleIndex>=0) nextVisibleRows.splice(visibleIndex,1);
  }else if(visibleIndex>=0){
    nextVisibleRows[visibleIndex]=nextVisibleRow;
  }else{
    const previous=findRowByAnyId(firebaseRow.firebaseDocId || firebaseRow.id || detailKey(firebaseRow));
    const previousIndex=rowIndexForRow(previous);
    if(previousIndex>=0) nextVisibleRows[previousIndex]=nextVisibleRow;
    else nextVisibleRows.push(nextVisibleRow);
  }
  if(selectedKey && rowMatchesAnyLookupKey(nextVisibleRow,selectedKey)) selectedSite=nextVisibleRow;
  rows=nextVisibleRows;
  window.rows=rows;
  updateFirebaseLoadReport(csvRows,csvRows,hiddenRows,[]);
  if(targetOpenDocId) clearFiltersForOpenedSite();
  if(options && options.render===false) return rows;
  filters();
  render();
  openFirebaseRowAfterRender(targetOpenDocId);
  return rows;
};
window.upsertFirebaseSiteRows = function(firebaseRows=[], options={}){
  const incoming=(Array.isArray(firebaseRows) ? firebaseRows : []).filter(Boolean);
  if(!incoming.length) return rows;
  syncCsvRowLookupCache();
  const nextRows=csvRows.slice();
  for(const firebaseRow of incoming){
    let existingIndex=-1;
    const keys=rowLookupKeys(firebaseRow);
    for(const key of keys){
      const cachedIndex=csvRowsByAnyId.get(key);
      if(Number.isInteger(cachedIndex) && rowMatchesAnyLookupKey(nextRows[cachedIndex],key)){
        existingIndex=cachedIndex;
        break;
      }
    }
    if(existingIndex<0){
      existingIndex=nextRows.findIndex(r=>{
        if(firebaseRow.firebaseDocId && r.firebaseDocId===firebaseRow.firebaseDocId) return true;
        return r.id && firebaseRow.id && r.id===firebaseRow.id;
      });
    }
    if(existingIndex>=0) nextRows[existingIndex]=firebaseRow;
    else nextRows.push(firebaseRow);
  }
  const openedDocId=options && options.openDocId ? String(options.openDocId) : "";
  const selectedKey=selectedSite ? (detailKey(selectedSite) || selectedSite.id || selectedSite.firebaseDocId) : "";
  csvRows=nextRows;
  rebuildCsvRowLookupCache();
  const hiddenRows=[];
  rows=csvRows
    .map((r,i)=>{r.i=i; return applyEditToRow(r);})
    .filter(r=>{
      const hidden=isFirebaseRowHidden(r,openedDocId);
      if(hidden) hiddenRows.push(hiddenFirebaseRowInfo(r));
      return !hidden;
    });
  if(selectedKey){
    const nextSelected=findRowByAnyId(selectedKey,rows);
    if(nextSelected) selectedSite=nextSelected;
  }
  window.rows=rows;
  updateFirebaseLoadReport(csvRows,csvRows,hiddenRows,[]);
  if(openedDocId) clearFiltersForOpenedSite();
  if(options && options.render===false) return rows;
  filters();
  render();
  openFirebaseRowAfterRender(openedDocId);
  return rows;
};
window.removeFirebaseSiteRow = function(site){
  if(!site) return null;
  const raw=(site && site.raw) || {};
  const targetDetailKey=detailKey(site);
  const targetDocId=safe(site.firebaseDocId || raw["Firebase_doc_id"]);
  const targetId=safe(site.id);
  const hasPreciseTarget=!!(targetDetailKey || targetDocId);
  const matchesTarget=row=>{
    const rowRaw=(row && row.raw) || {};
    const rowDetailKey=detailKey(row);
    const rowDocId=safe(row && (row.firebaseDocId || rowRaw["Firebase_doc_id"]));
    const rowId=safe(row && row.id);
    return (targetDetailKey && rowDetailKey===targetDetailKey)
      || (targetDocId && rowDocId===targetDocId)
      || (!hasPreciseTarget && targetId && rowId===targetId);
  };
  const beforeRows=csvRows || [];
  const nextRows=beforeRows.filter(row=>!matchesTarget(row));
  if(nextRows.length===beforeRows.length) return null;
  csvRows=nextRows;
  rebuildCsvRowLookupCache();
  rows=(rows || []).filter(row=>!matchesTarget(row));
  if(selectedSite && matchesTarget(selectedSite)) selectedSite=null;
  window.rows=rows;
  updateFirebaseLoadReport(csvRows,csvRows,[],[]);
  filters();
  render();
  return rows;
};
window.getCurrentCsvRows = function(){
  return originalCsvRows.length ? originalCsvRows : csvRows;
};

const {
  rowIdentityKeys,
  rowMatchesIdentity,
  selectedSiteMatchForSave,
  sharedPlaceEditsFromRaw
}=createSharedPlaceEditHelpers({
  applyWatchSelfAliases,
  dataNormFixed,
  detailKey,
  safe,
  selectedSiteDocId
});

async function propagateSharedPlaceEditsToSiblingSources(siblingRows=[],sharedRaw={}){
  const validSiblings=(siblingRows || []).filter(Boolean);
  const keys=Object.keys(sharedRaw || {});
  if(!validSiblings.length || !keys.length) return 0;

  const identityKeys=new Set();
  let saved=0;

  for(const sibling of validSiblings){
    const docId=selectedSiteDocId(sibling);
    const selectedKey=detailKey(sibling) || sibling.id || docId;
    rowIdentityKeys(sibling).forEach(key=>identityKeys.add(key));
    const mergedRaw={...(sibling.raw || {}), ...sharedRaw};
    if(docId) mergedRaw["Firebase_doc_id"]=docId;
    if(docId && !mergedRaw["Klíč_adresy"]) mergedRaw["Klíč_adresy"]="firebase_"+docId;
    const lat=num(mergedRaw["GPS_lat"]);
    const lon=num(mergedRaw["GPS_lon"]);
    const edit={
      rawEdits:sharedRaw,
      gpsAddress:sharedRaw["Adresa_GPS"] || "",
      gpsLat:sharedRaw["GPS_lat"] || "",
      gpsLon:sharedRaw["GPS_lon"] || "",
      updatedBy:siteEditUserEmail(),
      updatedAt:new Date().toISOString()
    };

    try{
      if(docId && isFirebaseUnifiedRow(sibling)){
        await saveUnifiedSiteRawPatchOrQueue(sibling,sharedRaw,{
          docId,
          reason:"Sdílená úprava adresy zdroje"
        });
      }
      await saveLegacySiteEditIfNeeded(selectedKey,edit,sibling);
      editCache[selectedKey]={...(editCache[selectedKey] || editCache[sibling.id] || {}), ...edit};
      if(docId) editCache[docId]={...(editCache[docId] || {}), ...edit};
      saved++;
    }catch(e){
      console.warn("Společná adresa zdroje se nepodařila uložit",sibling,e);
    }
  }

  if(identityKeys.size){
    rows=rows.map(row=>{
      if(!rowMatchesIdentity(row,identityKeys)) return row;
      const raw={...(row.raw || {}), ...sharedRaw};
      const docId=selectedSiteDocId(row);
      if(docId) raw["Firebase_doc_id"]=docId;
      return applyEditToRow({...row, raw, firebaseDocId:docId || row.firebaseDocId});
    });
    window.rows=rows;
  }
  return saved;
}

async function saveSelectedSiteGpsPosition(lat,lon,found={},address=""){
  if(!selectedSite) throw new Error("Není vybrané místo.");
  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const firebaseDocId=safe(selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "");
  const latText=String(lat);
  const lonText=String(lon);
  const gpsText=`${latText}, ${lonText}`;
  const regionEl=document.querySelector('#detailTable [data-key="Kraj"]');
  let region=safe(regionEl && regionEl.value);
  if(!region) region=inferRegionFromAddressText((found && found.display) || address, (found && found.address) || {});
  if(regionEl && !safe(regionEl.value) && region) regionEl.value=region;

  const editedRaw={
    "GPS_lat":latText,
    "GPS_lon":lonText,
    "Adresa_GPS":gpsText
  };
  if(region) editedRaw["Kraj"]=region;
  const edit={
    rawEdits:editedRaw,
    gpsAddress:gpsText,
    gpsLat:latText,
    gpsLon:lonText,
    updatedBy:siteEditUserEmail(),
    updatedAt:new Date().toISOString()
  };
  const matches=(row)=>selectedSiteMatchForSave(row,selectedKey,firebaseDocId);
  const sharedSiblingRows=siteSiblingRows(selectedSite)
    .filter(row=>!selectedSiteMatchForSave(row,selectedKey,firebaseDocId));
  let siblingAddressUpdates=0;
  let persistentSave=false;

  if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
    const result=await saveUnifiedSiteRawPatchOrQueue(selectedSite,editedRaw,{
      docId:firebaseDocId,
      reason:"Uložení GPS polohy"
    });
    persistentSave=!!(result && (result.saved || result.queued));
  }
  const legacySaved=await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
  persistentSave=persistentSave || !!legacySaved;
  siblingAddressUpdates=await propagateSharedPlaceEditsToSiblingSources(sharedSiblingRows,editedRaw);

  editCache[selectedKey]={...(editCache[selectedKey]||editCache[selectedSite.id]||{}), ...edit};
  if(firebaseDocId) editCache[firebaseDocId]={...(editCache[firebaseDocId]||{}), ...edit};
  const applyGpsEditToRow=(r)=>{
    const raw={...(r.raw||{}), ...editedRaw};
    if(firebaseDocId) raw["Firebase_doc_id"]=firebaseDocId;
    return applyEditToRow({...r, raw, firebaseDocId:firebaseDocId || r.firebaseDocId});
  };
  const lookupKey=safe(firebaseDocId || selectedKey);
  const indexedRow=(lookupKey && findRowByAnyId(lookupKey)) || selectedSite;
  const index=rowIndexForRow(indexedRow);
  if(indexedRow && index>=0 && matches(indexedRow)){
    const nextRows=rows.slice();
    const updated=applyGpsEditToRow(indexedRow);
    nextRows[index]=updated;
    rows=nextRows;
    window.rows=rows;
    selectedSite=updated;
  }else{
    rows=rows.map(r=>matches(r) ? applyGpsEditToRow(r) : r);
    window.rows=rows;
    selectedSite=(lookupKey && findRowByAnyId(lookupKey)) || applyGpsEditToRow(selectedSite);
  }
  saveFirebaseRowsCacheForRows(rows);
  render();
  try{
    if(window.map && window.map.setView) window.map.setView([lat,lon],15);
  }catch(e){}
  if(typeof showSaveConfirmation==="function"){
    showSaveConfirmation(persistentSave
      ? (siblingAddressUpdates ? "GPS poloha uložena i u dalších zdrojů." : "GPS poloha uložena.")
      : "GPS poloha uložena v lokální cache.");
  }
  return !!persistentSave;
}

async function dataAddressToGps(){
  const st=document.getElementById("editStatus");
  const btn=document.getElementById("detailGpsCalcInline") || document.getElementById("calcDataGpsBtn");
  const coordPattern=/^\s*-?\d+(?:[.,]\d+)?\s*[,;]\s*-?\d+(?:[.,]\d+)?\s*$/;
  const addressCandidates=["Adresa / umístění","Původní adresa / umístění","Umístění","Adresa_GPS","Název","Umístění zdroje"]
    .map(k=>document.querySelector(`#detailTable [data-key="${CSS.escape(k)}"]`))
    .map(el=>el ? safe(el.value) : "")
    .filter(Boolean);
  const address=addressCandidates.find(v=>!coordPattern.test(v)) || addressCandidates[0] || "";
  if(!address){if(st)st.textContent="Vyplň adresu.";return;}
  try{
    if(btn) btn.disabled=true;
    if(st)st.textContent="Dopočítávám GPS z adresy...";
    let r=await geocodeAddressFast(address);
    if(!r){
      if(st)st.textContent="Rychlé hledání adresu nenašlo, zkouším podrobněji...";
      r=await geocodeAddressGeneric(address);
    }
    if(!r){
      const region=inferRegionFromAddressText(address);
      const regionEl=document.querySelector('#detailTable [data-key="Kraj"]');
      if(regionEl && !safe(regionEl.value) && region) regionEl.value=region;
      const message=window.lastGeocodeMessage || (region ? "Adresa nebyla nalezena pro GPS, kraj jsem doplnil podle textu adresy." : "Adresa nebyla nalezena.");
      if(st)st.textContent=message;
      return;
    }
    const lat=Number(r.lat);
    const lon=Number(r.lon);
    if(!Number.isFinite(lat) || !Number.isFinite(lon)){
      if(st)st.textContent="Adresa byla nalezena, ale GPS souřadnice nejsou platné.";
      return;
    }
    let latEl=document.querySelector('#detailTable [data-key="GPS_lat"]');
    let lonEl=document.querySelector('#detailTable [data-key="GPS_lon"]');
    let gpsTextEl=document.querySelector('#detailTable [data-key="Adresa_GPS"]');
    let regionEl=document.querySelector('#detailTable [data-key="Kraj"]');
    if(latEl)latEl.value=String(lat);
    if(lonEl)lonEl.value=String(lon);
    if(gpsTextEl)gpsTextEl.value=`${lat}, ${lon}`;
    if(regionEl && !safe(regionEl.value)){
      const region=inferRegionFromAddressText(r.display || address, r.address || {});
      if(region) regionEl.value=region;
    }
    const saved=await saveSelectedSiteGpsPosition(lat,lon,r,address);
    if(st)st.textContent=saved ? "GPS uloženo a bod přesunut na mapě." : "GPS doplněno, ale pro trvalé uložení se přihlaš.";
  }catch(e){
    if(st)st.textContent="Chyba: "+e.message;
  }finally{
    if(btn) btn.disabled=false;
  }
}

function reopenDetailAfterManualGps(key,wasEditing){
  return ()=>{
    if(key) window.openDetailById(key);
    if(wasEditing){
      setTimeout(()=>{
        const btn=document.getElementById("editDataToggleBtn");
        if(btn) btn.click();
      },260);
    }
  };
}

function startDetailManualGpsPick(){
  const key=selectedSite ? (detailKey(selectedSite) || selectedSite.id) : "";
  const wasEditing=!!detailTableNode()?.classList.contains("data-edit-table");
  const drawer=drawerNode();
  if(drawer) drawer.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro tento bod",
    statusId:"editStatus",
    confirmation:"GPS poloha vybrána a uložena.",
    reopen:reopenDetailAfterManualGps(key,wasEditing),
    apply:async(lat,lon)=>{
      setInputValueIfExists('#detailTable [data-key="GPS_lat"]',String(lat));
      setInputValueIfExists('#detailTable [data-key="GPS_lon"]',String(lon));
      setInputValueIfExists('#detailTable [data-key="Adresa_GPS"]',`${lat}, ${lon}`);
      if(selectedSite){
        await saveSelectedSiteGpsPosition(lat,lon,{display:"Ručně vybráno na mapě",address:{}}, "Ručně vybráno na mapě");
      }
    }
  });
}

function startLegacyNewManualGpsPick(){
  const drawer=drawerNode();
  if(drawer) drawer.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro nové místo",
    statusId:"newSiteStatus",
    confirmation:"GPS nového místa vybráno.",
    reopen:()=>{
      const d=drawerNode();
      if(d) d.classList.add("open");
      const card=newSiteCardNode();
      if(card){card.style.display="block";card.scrollIntoView({block:"start"});}
    },
    apply:async(lat,lon)=>{
      setInputValueIfExists("#newGpsLat",String(lat));
      setInputValueIfExists("#newGpsLon",String(lon));
      setInputValueIfExists("#newSiteOnlyCard #onlyNewGpsLat",String(lat));
      setInputValueIfExists("#newSiteOnlyCard #onlyNewGpsLon",String(lon));
      let address="";
      try{ address=await reverseGeocodeGpsGeneric(lat,lon); }catch(_e){}
      const display=address || `${lat}, ${lon}`;
      setInputValueIfExists("#newGpsAddress",display);
      setNewSiteFieldValue("Adresa_GPS",display,{force:true,auto:true});
      setInputValueIfExists('#newSiteOnlyCard [data-new-key="Adresa_GPS"]',display);
      const region=inferRegionFromAddressText(address || "");
      if(region) setNewSiteRegionValue(region,{force:true});
      if(region) setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region,{force:true});
      const st=document.getElementById("newSiteStatus");
      if(st) st.textContent=region ? "GPS vybráno z mapy, kraj doplněn." : "GPS vybráno z mapy.";
    }
  });
}

function startOnlyNewManualGpsPick(){
  const drawer=drawerNode();
  if(drawer) drawer.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro nové místo",
    statusId:"onlyNewStatus",
    confirmation:"GPS nového místa vybráno.",
    reopen:()=>{
      const d=drawerNode();
      if(d) d.classList.add("open");
    },
    apply:async(lat,lon)=>{
      setInputValueIfExists("#onlyNewGpsLat",String(lat));
      setInputValueIfExists("#onlyNewGpsLon",String(lon));
      let address="";
      try{ address=await reverseGeocodeGpsGeneric(lat,lon); }catch(_e){}
      const display=address || `${lat}, ${lon}`;
      setInputValueIfExists('#newSiteOnlyCard [data-new-key="Adresa_GPS"]',display);
      const region=inferRegionFromAddressText(address || "");
      if(region) setRegionFieldValue('#newSiteOnlyCard [data-new-key="Kraj"]',region,{force:true});
      const st=document.getElementById("onlyNewStatus");
      if(st) st.textContent=region ? "GPS vybráno z mapy, kraj doplněn." : "GPS vybráno z mapy.";
    }
  });
}

function startFbUnifiedManualGpsPick(){
  const overlay=document.getElementById("fbUnifiedOverlay");
  const panel=document.getElementById("fbUnifiedPanel");
  if(overlay) overlay.classList.remove("open");
  if(panel) panel.classList.remove("open");
  beginManualGpsPick({
    title:"Vyber GPS pro nové místo",
    statusId:"fbUnifiedStatus",
    confirmation:"GPS nového místa vybráno.",
    reopen:()=>{
      const o=document.getElementById("fbUnifiedOverlay");
      const p=document.getElementById("fbUnifiedPanel");
      if(o) o.classList.add("open");
      if(p) p.classList.add("open");
    },
    apply:async(lat,lon)=>{
      setInputValueIfExists('#fbUnifiedPanel [data-fb-key="GPS_lat"]',String(lat));
      setInputValueIfExists('#fbUnifiedPanel [data-fb-key="GPS_lon"]',String(lon));
      let address="";
      try{ address=await reverseGeocodeGpsGeneric(lat,lon); }catch(_e){}
      const display=address || `${lat}, ${lon}`;
      setInputValueIfExists('#fbUnifiedPanel [data-fb-key="Adresa_GPS"]',display);
      const region=inferRegionFromAddressText(address || "");
      if(region) setRegionFieldValue('#fbUnifiedPanel [data-fb-key="Kraj"]',region,{force:true});
      const st=document.getElementById("fbUnifiedStatus");
      if(st) st.textContent=region ? "GPS vybráno z mapy, kraj doplněn." : "GPS vybráno z mapy.";
    }
  });
}

async function dataGpsToAddress(){
  const st=document.getElementById("editStatus");
  const latEl=document.querySelector('#detailTable [data-key="GPS_lat"]');const lonEl=document.querySelector('#detailTable [data-key="GPS_lon"]');
  if(!latEl||!lonEl||!latEl.value||!lonEl.value){if(st)st.textContent="Vyplň GPS lat/lon.";return;}
  try{if(st)st.textContent="Dopočítávám adresu z GPS...";const addr=await reverseGeocodeGpsGeneric(latEl.value,lonEl.value);const addrEl=document.querySelector('#detailTable [data-key="Adresa_GPS"], #detailTable [data-key="Adresa / umístění"], #detailTable [data-key="Umístění"]');if(addrEl)addrEl.value=addr;if(st)st.textContent="Adresa doplněna z GPS.";}catch(e){if(st)st.textContent="Chyba: "+e.message;}
}


function isPlaceholderDataKey(k){
  return /^sloupec\s*\d+$/i.test(dataNormFixed(k));
}

function isFirebaseUnifiedRow(r){
  const raw = (r && r.raw) || {};
  return !!(r && r.firebaseDocId) || safe(raw["Zdroj_dat"]).toLowerCase().includes("firebase");
}

function shouldSkipLegacySiteEdits(site=selectedSite){
  return false;
}

function legacySiteEditDocKey(value){
  const key=safe(value);
  if(!key || key.includes("/")) return "";
  return key;
}

async function saveLegacySiteEditIfNeeded(selectedKey,edit,site=selectedSite){
  if(shouldSkipLegacySiteEdits(site)) return false;
  const identity=siteRecordIdentity(site);
  const raw=(site && site.raw) || {};
  const payload={
    ...(edit || {}),
    firebaseDocId:identity.firebaseDocId || "",
    siteDocId:identity.siteDocId || "",
    siteId:identity.siteId || "",
    siteLegacyId:identity.siteLegacyId || "",
    siteKey:identity.siteKey || "",
    siteKeys:identity.siteKeys || [],
    sourceGroupKey:identity.sourceGroupKey || "",
    sourceIdentity:identity.sourceIdentity || "",
    siteName:identity.siteName || "",
    siteAddress:identity.siteAddress || "",
    siteSource:identity.siteSource || ""
  };
  const keys=uniqueNonEmptyStrings([
    selectedKey,
    identity.siteKey,
    identity.siteId,
    identity.siteLegacyId,
    identity.siteDocId,
    identity.firebaseDocId,
    ...(identity.siteKeys || []),
    raw["Název"],
    raw["Adresa / umístění"],
    raw["Adresa_GPS"],
    raw["Umístění"],
    raw["Původní adresa / umístění"]
  ].map(legacySiteEditDocKey)).slice(0,20);
  keys.forEach(key=>setLegacyEditCacheEntry(key,payload));
  const canWriteLegacy=!!(firebaseReady && currentUser && db && fb.fsMod && typeof fb.fsMod.doc==="function" && typeof fb.fsMod.setDoc==="function" && navigator.onLine!==false);
  if(!canWriteLegacy) return false;
  const {doc,setDoc}=fb.fsMod;
  for(const key of keys){
    await setDoc(doc(db,"siteEdits",key),payload,{merge:true});
  }
  return true;
}

function siteEditUserEmail(){
  try{
    return safe(currentUser?.email || currentUserEmail?.() || lastKnownUserEmail?.() || "");
  }catch(e){
    try{return safe(currentUser?.email || lastKnownUserEmail?.() || "");}
    catch(_e){return "";}
  }
}

function canWriteFirebaseSiteNow(){
  return !!(firebaseReady && currentUser && db && fb.fsMod && typeof fb.fsMod.doc==="function" && typeof fb.fsMod.setDoc==="function" && navigator.onLine!==false);
}

function siteRawForAndroidUpsert(site,rawPatch={},docId=""){
  const raw={...(site?.raw || {}), ...(rawPatch || {})};
  const finalDocId=safe(docId || site?.firebaseDocId || raw["Firebase_doc_id"] || selectedSiteDocId(site));
  if(finalDocId) raw["Firebase_doc_id"]=finalDocId;
  if(finalDocId && !raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+finalDocId;
  return {raw,docId:finalDocId};
}

function firebaseSiteUpdatePayloadFromRaw(raw={},updatedBy=""){
  const lat=num(raw["GPS_lat"]);
  const lon=num(raw["GPS_lon"]);
  const {serverTimestamp}=fb.fsMod || {};
  return {
    raw,
    dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(raw) : [],
    name:raw["Název"] || raw["Adresa / umístění"] || raw["Adresa_GPS"] || "",
    lat:Number.isFinite(lat) ? lat : null,
    lon:Number.isFinite(lon) ? lon : null,
    updatedBy,
    updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
  };
}

function enqueueUnifiedSiteUpsertToAndroid(site,rawPatch={},options={}){
  const {raw,docId}=siteRawForAndroidUpsert(site,rawPatch,options.docId || "");
  if(!docId) return false;
  const updatedBy=safe(options.updatedBy || siteEditUserEmail());
  const now=new Date().toISOString();
  const payload={
    docId,
    raw,
    dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(raw) : [],
    updatedAt:now,
    updatedBy,
    reason:safe(options.reason || "Úprava bodu offline"),
    manualEntry:true,
    migratedFromCsv:false
  };
  const queued=androidOfflineCall("enqueueOutbox",{
    operationId:`site:${docId}`,
    entityTable:"sites",
    entityLocalId:docId,
    operation:"UPSERT_SITE",
    payloadJson:JSON.stringify(payload)
  });
  if(queued){
    const bridge=androidOfflineBridge();
    if(bridge && typeof bridge.requestSync==="function"){
      try{bridge.requestSync();}catch(e){}
    }
    if(window.registerSzzBackgroundSync) window.registerSzzBackgroundSync("site");
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  }
  return queued;
}

async function saveUnifiedSiteRawPatchOrQueue(site,rawPatch={},options={}){
  const {raw,docId}=siteRawForAndroidUpsert(site,rawPatch,options.docId || "");
  if(!docId || !isFirebaseUnifiedRow(site)) return {saved:false,queued:false,docId,raw};
  const updatedBy=safe(options.updatedBy || siteEditUserEmail());
  if(canWriteFirebaseSiteNow()){
    try{
      const {doc,setDoc}=fb.fsMod;
      await setDoc(doc(db,"sitesUnified",docId),firebaseSiteUpdatePayloadFromRaw(raw,updatedBy),{merge:true});
      markAndroidOutboxSynced(`site:${docId}`);
      return {saved:true,queued:false,docId,raw};
    }catch(e){
      console.warn("Online uložení bodu selhalo, ukládám do Android fronty",e);
    }
  }
  const queued=enqueueUnifiedSiteUpsertToAndroid(site,raw,{...options,docId,updatedBy});
  return {saved:false,queued,docId,raw};
}

function orderedEditableKeys(r){
  const raw = (r && r.raw) || {};
  const out = orderedFixedKeys(raw);

  if(isFirebaseUnifiedRow(r) && Array.isArray(window.firebaseUnifiedEditableKeys)){
    window.firebaseUnifiedEditableKeys.forEach(k=>{
      if(!out.some(existing=>dataNormFixed(existing)===dataNormFixed(k))){
        out.push(k);
      }
    });
  }

  return out;
}

function shouldShowEmptyEditableField(k,label){
  if(isPlaceholderDataKey(k)) return false;
  if(hideDataFixed(k)) return false;
  const n=dataNormFixed(k);
  const l=dataNormFixed(label);
  if(n==="adresa gps" || l==="vyrobni cislo") return true;
  return true;
}

const USER_SITE_DATA_FIELDS = [
  {label:"Název", key:"Název", keys:["Název"]},
  {label:"Adresa / umístění", key:"Adresa / umístění", keys:["Adresa / umístění","Původní adresa / umístění"]},
  {label:"Adresa GPS", key:"Adresa_GPS", keys:["Adresa_GPS"], readonly:true, hideInDetail:true},
  {label:"Kraj", key:"Kraj", keys:["Kraj","Region","Kraj / oblast"], type:"region"},
  {label:"Popis zdroje", key:"Popis_zdroje", keys:["Popis_zdroje","Jaký zdroj"]},
  {label:"Výrobní číslo", key:"Zdroj", keys:["Výrobní číslo","Výrobní_číslo","Seriové číslo","Sériové číslo","Serial","SN","Zdroj"]},
  {label:"Kontakt", key:"Kontakt", keys:["Kontakt","Kontakt_mapy","Hlavní kontakt"]},
  {label:"Umístění zdroje", key:"Umístění zdroje", keys:["Umístění zdroje","Umístění"]},
  {label:"Historie oprav", key:"Historie oprav", keys:["Historie oprav","Historie_oprav"], type:"textarea"},
  {label:"Postup testování", key:"Postup testování", keys:["Postup testování","Postup testovani"], type:"textarea"},
  {label:"Jistič UPS", key:"Jistič UPS", keys:["Jistič UPS","Jistic UPS","Jističe UPS","Jistič"], type:"textarea"},
  {label:"Poznámky", key:"Poznámky", keys:["Poznámky","Poznámky_mapy"], type:"textarea"},
  {label:"Perioda kontrol", key:"Perioda kontrol", keys:["Perioda kontrol","Perioda zkoušky","Perioda zkoušek","Perioda kontroly","Perioda kontrol (6/12)","Perioda","Četnost","Cetnost","Kontrola","Interval"], type:"period"},
  {label:"Hlídáme sami termín", key:"Hlídáme sami termín", keys:["Hlídáme sami termín","Hlídáme termín sami","Hlídat termín sami","Hlidat termin sami","Hlídáme kontroly sami","Hlidame kontroly sami","Jezdit hlídáme termín sami","Bez objednávky"], type:"yesno"},
  {label:"Smlouva", key:"Smlouva ano/ne", keys:["Smlouva ano/ne","Smlouva (ano/ne)","Smlouva ano ne","Smlouva ano","Smlouva"], type:"yesno"},
  {label:"Záruka", key:"Záruka", keys:["Záruka","Zaruka","Warranty"], type:"warranty"},
  {label:"Cena FZ", key:"Cena FZ", keys:["Cena FZ","Cena FZ v Kč"], hideInDetail:true, hideInEdit:true},
  {label:"Důležité poznámky", key:"Důležitá poznámka", keys:["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky"], type:"textarea", important:true}
];
window.userSiteDataFields = USER_SITE_DATA_FIELDS.filter(f=>!f.hideInEdit).map(f=>({label:f.label,key:f.key,type:f.type||"text"}));

const {
  firstSiteField,
  rawForSiteFieldLookup,
  userSiteFieldSpecByKey,
  userSiteFieldValue
}=createSiteFieldLookupHelpers({
  dataNormFixed,
  userSiteDataFields:USER_SITE_DATA_FIELDS,
  detectControlPeriod,
  getImportantNoteFixed,
  getWatchFixed
});

function userSiteSharedFieldValue(site,key){
  const spec=userSiteFieldSpecByKey(key);
  if(!spec) return "";
  return userSiteFieldValue(site,spec,rawForSiteFieldLookup(site));
}

function siteContactForProtocol(site=selectedSite){
  const raw=rawForSiteFieldLookup(site);
  return safe((site && site.kontakt) || firstSiteField(raw,["Kontakt","Kontakt_mapy","Hlavní kontakt","Upravený kontakt"]));
}

function syncOpenProtocolContactFromDetail(site=selectedSite,options={}){
  const el=formFieldNode("protoContacts");
  const form=formFieldNode("protocolForm");
  if(!el || !form || form.style.display==="none") return;
  const next=siteContactForProtocol(site);
  if(!next) return;
  const current=safe(el.value);
  const previous=safe(options.previousContact);
  if(options.force || !current || (previous && dataNormFixed(current)===dataNormFixed(previous))){
    el.value=next;
    if(options.saveDraft) scheduleProtocolDraftSave();
  }
}

function syncOpenProtocolDeviceTypeFromDetail(site=selectedSite,options={}){
  const el=formFieldNode("protoDeviceType");
  const form=formFieldNode("protocolForm");
  if(!el || !form || form.style.display==="none") return;
  const next=protocolDeviceTypeFromSite(site);
  if(!next) return;
  const current=safe(el.value);
  const previous=safe(options.previousDeviceType);
  if(options.force || !current || (previous && dataNormFixed(current)===dataNormFixed(previous))){
    el.value=next;
    updateProtocolSummary();
    if(options.saveDraft) scheduleProtocolDraftSave();
  }
}

function applyProtocolDeviceTypeToSelectedSiteDraft(value,options={}){
  const device=safe(value);
  if(!selectedSite || !device) return;
  const raw={...(selectedSite.raw || {})};
  raw["Popis_zdroje"]=device;
  raw["Kontrolované zařízení"]=device;
  raw["Typ zařízení"]=device;
  selectedSite.raw=raw;
  selectedSite.zdroj=device;
  selectedSite.firebaseData={...(selectedSite.firebaseData || {}),raw};
  const sub=detailSubNode();
  if(sub) sub.textContent=siteSourceLabel(selectedSite) || "";
  renderSourceChooser(selectedSite);
  const table=detailTableNode();
  if(table && !table.classList.contains("data-edit-table")){
    renderDetailTable(table,selectedSite);
  }
  if(options.saveDraft) scheduleProtocolDraftSave();
}

function yesNoFixed(v, fallback="ne"){
  const n=dataNormFixed(v);
  if(n==="ano" || n==="yes" || n==="true" || n==="1" || n==="aktivni") return "ano";
  if(n==="ne" || n==="no" || n==="false" || n==="0" || n==="") return "ne";
  return fallback;
}

function regionOptionsFixed(current){
  const map=new Map();
  const add=v=>{
    const clean=safe(v);
    const key=dataNormFixed(clean);
    if(!key && !map.has("")) map.set("", "");
    if(key && !map.has(key)) map.set(key, clean);
  };
  add("");
  APP_REGION_OPTIONS.forEach(add);
  const currentKey=dataNormFixed(current);
  return [...map.entries()].map(([key,v])=>({key,value:v,label:v || "Vyber kraj",selected:key===currentKey}));
}

function createUserSiteSelect(dataKey,options,selectedValue){
  const select=document.createElement("select");
  select.dataset.key=dataKey;
  options.forEach(([value,label])=>{
    const option=document.createElement("option");
    option.value=value;
    option.textContent=label;
    select.appendChild(option);
  });
  select.value=selectedValue;
  return select;
}

function autoSizeDetailTextarea(textarea,minRows=3){
  if(!textarea) return;
  textarea.rows=Math.max(minRows,String(textarea.value || "").split(/\r?\n/).length);
  textarea.style.height="auto";
  textarea.style.height=`${Math.max(textarea.scrollHeight,48)}px`;
}

function bindAutoSizeDetailTextarea(textarea,minRows=3){
  if(!textarea) return textarea;
  autoSizeDetailTextarea(textarea,minRows);
  textarea.addEventListener("input",()=>autoSizeDetailTextarea(textarea,minRows));
  runAfterPaint(()=>autoSizeDetailTextarea(textarea,minRows));
  return textarea;
}

function userSiteInput(spec, value, site=null){
  if(spec.type==="region"){
    const select=document.createElement("select");
    select.dataset.key=spec.key;
    regionOptionsFixed(value).forEach(item=>{
      const option=document.createElement("option");
      option.value=item.value;
      option.textContent=item.label;
      option.selected=item.selected;
      select.appendChild(option);
    });
    return select;
  }
  if(spec.type==="period"){
    const periodValue=String(value || "").includes("6") ? "6" : "12";
    return createUserSiteSelect(spec.key,[["6","6 měsíců"],["12","12 měsíců"]],periodValue);
  }
  if(spec.type==="yesno"){
    return createUserSiteSelect(spec.key,[["ne","ne"],["ano","ano"]],yesNoFixed(value));
  }
  if(spec.type==="warranty"){
    return createUserSiteSelect(spec.key,WARRANTY_SELECT_OPTIONS,warrantyValueFixed(value));
  }
  if(spec.type==="textarea"){
    const textarea=document.createElement("textarea");
    textarea.dataset.key=spec.key;
    textarea.value=safe(value);
    if(spec.key==="Historie oprav"){
      textarea.classList.add("repair-history-textarea","auto-grow-textarea");
      return bindAutoSizeDetailTextarea(textarea,4);
    }
    return bindAutoSizeDetailTextarea(textarea,3);
  }
  if(spec.key==="Adresa_GPS"){
    const raw=rawForSiteFieldLookup(site);
    const gpsLat=Number.isFinite(site && site.lat) ? String(site.lat) : safe(raw["GPS_lat"]);
    const gpsLon=Number.isFinite(site && site.lon) ? String(site.lon) : safe(raw["GPS_lon"]);
    const fragment=document.createDocumentFragment();
    const coordinate=document.createElement("div");
    coordinate.className="gps-coordinate-edit";
    const gpsInput=document.createElement("input");
    gpsInput.dataset.key=spec.key;
    gpsInput.value=safe(value);
    gpsInput.readOnly=true;
    gpsInput.title="GPS souřadnice";
    const calcBtn=document.createElement("button");
    calcBtn.className="secondary";
    calcBtn.type="button";
    calcBtn.id="detailGpsCalcInline";
    calcBtn.textContent="Dopočítat GPS";
    const pickBtn=document.createElement("button");
    pickBtn.className="secondary";
    pickBtn.type="button";
    pickBtn.id="detailGpsPickMapInline";
    pickBtn.textContent="Vybrat na mapě";
    coordinate.append(gpsInput,calcBtn,pickBtn);
    const latLon=document.createElement("div");
    latLon.className="gps-lat-lon-edit";
    const latInput=document.createElement("input");
    latInput.dataset.key="GPS_lat";
    latInput.value=gpsLat;
    latInput.placeholder="GPS lat";
    const lonInput=document.createElement("input");
    lonInput.dataset.key="GPS_lon";
    lonInput.value=gpsLon;
    lonInput.placeholder="GPS lon";
    latLon.append(latInput,lonInput);
    fragment.append(coordinate,latLon);
    return fragment;
  }
  const input=document.createElement("input");
  input.dataset.key=spec.key;
  input.value=safe(value);
  if(spec.readonly){
    input.readOnly=true;
    input.title="Dopočítá se z adresy";
  }
  return input;
}

function renderEditableDataTable(table,r){
  if(!table) return;
  table.classList.remove("history-item","small","detail-history-table");
  const raw=rawForSiteFieldLookup(r);
  const fragment=document.createDocumentFragment();
  USER_SITE_DATA_FIELDS.filter(spec=>!spec.hideInEdit).forEach(spec=>{
    const value=userSiteFieldValue(r,spec,raw);
    const row=document.createElement("tr");
    if(spec.important) row.className="notes-red-row";
    const label=document.createElement("td");
    label.textContent=spec.key==="Adresa_GPS" ? "GPS souřadnice" : spec.label;
    const valueCell=document.createElement("td");
    valueCell.appendChild(userSiteInput(spec,value,r));
    row.append(label,valueCell);
    fragment.appendChild(row);
  });
  table.replaceChildren(fragment);
  table.dataset.detailTableMode="edit";
  delete table.dataset.detailSignature;
}

function userSiteDisplayValue(spec, value){
  return esc(userSiteDisplayText(spec,value));
}

function userSiteDisplayText(spec, value){
  if(spec.type==="period") return value ? `${safe(value)} měsíců` : "";
  if(spec.type==="yesno") return yesNoFixed(value, "ne");
  if(spec.type==="warranty") return warrantyValueFixed(value);
  return safe(value);
}

function warrantyValueFixed(value){
  const clean=safe(value).toLowerCase();
  const norm=dataNormFixed(clean);
  if(!norm) return "";
  if(norm.includes("zrus")) return "záruka zrušena";
  if(norm.includes("5")) return "záruka 5 let";
  if(norm.includes("2")) return "záruka 2 roky";
  return clean;
}

const {
  showControlDateDisplay,
  showControlDateInputs
}=createControlDateDisplayHelpers({
  addMonths,
  computedNextDate,
  dateInputValueFromAny,
  detailLastCheckNode,
  detailNextCheckNode,
  displayNext,
  formatDateCz,
  getSelectedSite:()=>selectedSite,
  parseDateValue,
  periodMonths,
  setTextIfChanged
});


function addNewDataRowToTable(){
  const keyEl = document.getElementById("newDataKey");
  const valEl = document.getElementById("newDataValue");
  const table = detailTableNode();
  if(!keyEl || !valEl || !table) return;

  const key = keyEl.value.trim();
  const val = valEl.value.trim();

  if(!key){
    alert("Vyplň název nového údaje.");
    keyEl.focus();
    return;
  }
  if(!val){
    alert("Vyplň hodnotu nového údaje.");
    valEl.focus();
    return;
  }

  const row = document.createElement("tr");
  row.className = isNoteUser(key) ? "notes-red-row" : "";
  const keyCell=document.createElement("td");
  keyCell.textContent=key;
  const valueCell=document.createElement("td");
  const input=document.createElement("input");
  input.dataset.key=key;
  input.value=val;
  valueCell.appendChild(input);
  row.append(keyCell,valueCell);

  if(isNoteUser(key)){
    table.appendChild(row);
  }else{
    const firstNote = table.querySelector(".notes-red-row");
    if(firstNote) table.insertBefore(row, firstNote);
    else table.appendChild(row);
  }

  keyEl.value = "";
  valEl.value = "";
  keyEl.focus();
}

async function saveAllDataEdits(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }

  const editedRaw={};
  USER_SITE_DATA_FIELDS.forEach(spec=>{
    const el=document.querySelector(`#detailTable [data-key="${CSS.escape(spec.key)}"]`);
    if(!el) return;
    let value=String(el.value || "").trim();
    if(spec.type==="yesno") value=yesNoFixed(value,"ne");
    if(spec.type==="period") value=value==="6" ? "6" : "12";
    if(spec.type==="warranty") value=warrantyValueFixed(value);
    if(!value && spec.type!=="yesno" && spec.type!=="period" && !spec.important && spec.key!=="Poznámky") return;
    editedRaw[spec.key]=value;
    if(spec.key==="Poznámky"){
      editedRaw["Poznámky_mapy"]=value;
      editedRaw["Upravené poznámky"]=value;
    }
    if(spec.important){
      (spec.keys || []).forEach(key=>{editedRaw[key]=value;});
    }
  });

  const gpsLat=safe(document.querySelector('#detailTable [data-key="GPS_lat"]')?.value);
  const gpsLon=safe(document.querySelector('#detailTable [data-key="GPS_lon"]')?.value);
  if(gpsLat) editedRaw["GPS_lat"]=gpsLat;
  if(gpsLon) editedRaw["GPS_lon"]=gpsLon;

  const lastCheck=safe(document.getElementById("detailLastCheckInput")?.value);
  const nextCheck=safe(document.getElementById("detailNextCheckInput")?.value);
  if(lastCheck) editedRaw["Poslední_kontrola"]=lastCheck;
  if(nextCheck) editedRaw["Příští_kontrola"]=nextCheck;
  const lastChanged=!!lastCheck && isoDateFromAny(lastCheck)!==isoDateFromAny(selectedSite && selectedSite.posledni);
  const nextChanged=!!nextCheck && isoDateFromAny(nextCheck)!==isoDateFromAny(selectedSite && selectedSite.pristi);
  const cancelOrderedByDateChange=selectedSite && selectedSite.ordered === true && (lastChanged || nextChanged);
  if(cancelOrderedByDateChange){
    editedRaw["Kontrola objednaná"]="NE";
    editedRaw["Objednáno"]="NE";
    editedRaw["Stav pro mapu"]="";
  }
  const datePeriod=inferControlPeriodMonthsFromDateValues(
    lastCheck || editedRaw["Poslední_kontrola"] || (selectedSite && selectedSite.posledni),
    nextCheck || editedRaw["Příští_kontrola"] || (selectedSite && selectedSite.pristi)
  );
  if(datePeriod) editedRaw["Perioda kontrol"]=String(datePeriod);

  applyWatchSelfAliases(editedRaw, editedRaw["Hlídáme sami termín"]);
  const watchSelf=explicitWatchSelfFromRaw(editedRaw)===true;

  try{
    const selectedKey=detailKey(selectedSite) || selectedSite.id;
    const sharedPlaceEdits=sharedPlaceEditsFromRaw(editedRaw);
    const sharedSiblingRows=Object.keys(sharedPlaceEdits).length
      ? siteSiblingRows(selectedSite).filter(row=>!selectedSiteMatchForSave(row,selectedKey,selectedSiteDocId(selectedSite)))
      : [];
    const edit = {
      rawEdits: editedRaw,
      name: editedRaw["Název"] || editedRaw["Adresa / umístění"] || "",
      contact: editedRaw["Kontakt"] || "",
      source: editedRaw["Popis_zdroje"] || "",
      notes: editedRaw["Poznámky"] || "",
      gpsAddress: editedRaw["Adresa_GPS"] || "",
      gpsLat,
      gpsLon,
      lastCheck,
      nextCheck,
      noOrder: watchSelf,
      updatedBy: siteEditUserEmail(),
      updatedAt: new Date().toISOString()
    };
    if(cancelOrderedByDateChange) edit.ordered=false;

    const firebaseDocId=safe(selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "");
    const matchesSelectedEditRow=(row)=>{
      if(!row) return false;
      const rowDocId=safe(row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"]) || "");
      return detailKey(row)===selectedKey || row.id===selectedKey || (firebaseDocId && rowDocId===firebaseDocId);
    };
    let queuedForSync=false;
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const result=await saveUnifiedSiteRawPatchOrQueue(selectedSite,editedRaw,{
        docId:firebaseDocId,
        reason:"Úprava detailu místa"
      });
      queuedForSync=!!(result && result.queued);
    }
    const siblingAddressUpdates=await propagateSharedPlaceEditsToSiblingSources(sharedSiblingRows,sharedPlaceEdits);

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);

    editCache[selectedKey] = {...(editCache[selectedKey]||editCache[selectedSite.id]||{}), ...edit};
    if(firebaseDocId) editCache[firebaseDocId] = {...(editCache[firebaseDocId]||{}), ...edit};
    const applyDataEditToRow=(r)=>{
      const raw={...(r.raw||{}), ...editedRaw};
      if(firebaseDocId) raw["Firebase_doc_id"]=firebaseDocId;
      return applyEditToRow({...r, raw, firebaseDocId:firebaseDocId || r.firebaseDocId});
    };
    const lookupKey=safe(firebaseDocId || selectedKey);
    const indexedRow=(lookupKey && findRowByAnyId(lookupKey)) || selectedSite;
    const index=rowIndexForRow(indexedRow);
    if(indexedRow && index>=0 && matchesSelectedEditRow(indexedRow)){
      const nextRows=rows.slice();
      const updated=applyDataEditToRow(indexedRow);
      nextRows[index]=updated;
      rows=nextRows;
      window.rows=rows;
      markRowsDirty();
      selectedSite=updated;
    }else{
      rows=rows.map(r=>matchesSelectedEditRow(r) ? applyDataEditToRow(r) : r);
      window.rows=rows;
      markRowsDirty();
      selectedSite=(lookupKey && findRowByAnyId(lookupKey)) || applyDataEditToRow(selectedSite);
    }
    saveFirebaseRowsCacheForRows(rows);

    const siblingText=siblingAddressUpdates ? ` Sdílené řádky propsány i do dalších zdrojů: ${siblingAddressUpdates}.` : "";
    const syncText=queuedForSync ? " Čeká na synchronizaci." : "";
    if(st) st.textContent=cancelOrderedByDateChange ? `Data uložena. Objednaná kontrola byla zrušena kvůli změně termínu.${siblingText}${syncText}` : `Data uložena.${siblingText}${syncText}`;
    showSaveConfirmation(queuedForSync ? "Data uložena v tabletu, odešlou se po připojení." : (cancelOrderedByDateChange ? "Data uložena, objednání kontroly zrušeno." : (siblingAddressUpdates ? "Sdílené řádky uloženy pro celé místo." : "Data uložena.")));
    const reopenKey=(selectedSite && (detailKey(selectedSite) || selectedSite.firebaseDocId || selectedKey)) || selectedKey;
    render();
    if(selectedSite && Number.isFinite(selectedSite.lat) && Number.isFinite(selectedSite.lon)){
      runAfterPaint(()=>{try{window.map.setView([selectedSite.lat,selectedSite.lon],15);}catch(e){}});
    }
    window.openDetailById(reopenKey);
  }catch(e){
    if(st) st.textContent="Chyba uložení dat: "+e.message;
  }
}

const {
  updateOrderedButton,
  updateRepairButton,
  updateStopButton
}=createDetailStatusButtonHelpers({
  getSelectedSite:()=>selectedSite
});

function rowWithMapStatusPatch(row,patch={},firebaseDocId=""){
  if(!row || !isFirebaseUnifiedRow(row)) return row;
  const raw=row.raw || {};
  const rawPatch=mapStatusRawPatchFromStatePatch(patch,raw);
  if(!Object.keys(rawPatch).length) return row;
  const nextRaw={...raw,...rawPatch};
  if(firebaseDocId) nextRaw["Firebase_doc_id"]=firebaseDocId;
  return {...row, raw:nextRaw, firebaseDocId:firebaseDocId || row.firebaseDocId};
}
function updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,fallbackSite=null,patch={}){
  const lookupKey=safe(firebaseDocId || selectedKey);
  const existing=(lookupKey && findRowByAnyId(lookupKey)) || fallbackSite;
  const index=rowIndexForRow(existing);
  if(existing && index>=0){
    const nextRows=rows.slice();
    const updated={...applyEditToRow(rowWithMapStatusPatch(existing,patch,firebaseDocId)),...patch};
    nextRows[index]=updated;
    rows=nextRows;
    window.rows=rows;
    markRowsDirty();
    return updated;
  }
  rows=rows.map(row=>detailKey(row)===selectedKey ? {...applyEditToRow(rowWithMapStatusPatch(row,patch,firebaseDocId)),...patch} : row);
  window.rows=rows;
  markRowsDirty();
  return (lookupKey && findRowByAnyId(lookupKey)) || (fallbackSite ? {...fallbackSite,...patch} : null);
}

async function toggleRepairFromDetail(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }

  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const repairOrdered=selectedSite.repairOrdered !== true;
  try{
    const existingEdit=editCache[selectedKey] || editCache[selectedSite.id] || {};
    const currentRaw={...(selectedSite.raw || {}),...((existingEdit.rawEdits && typeof existingEdit.rawEdits==="object") ? existingEdit.rawEdits : {})};
    const statusPatch=mapStatusRawPatchFromStatePatch({repairOrdered},currentRaw);
    const edit={
      repairOrdered,
      rawEdits:{...(existingEdit.rawEdits || {}),...statusPatch},
      updatedBy:siteEditUserEmail(),
      updatedAt:new Date().toISOString()
    };

    const firebaseDocId=selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "";
    let queuedForSync=false;
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const result=await saveUnifiedSiteRawPatchOrQueue(selectedSite,statusPatch,{
        docId:firebaseDocId,
        reason:"Změna stavu objednané opravy"
      });
      queuedForSync=!!(result && result.queued);
    }

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...existingEdit,...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,{repairOrdered});
    const syncText=queuedForSync ? " Čeká na synchronizaci." : "";
    if(st) st.textContent=(repairOrdered ? "Oprava označena jako objednaná." : "Objednání opravy zrušeno.")+syncText;
    showSaveConfirmation(queuedForSync ? "Stav uložen v tabletu, odešle se po připojení." : (repairOrdered ? "Oprava objednána." : "Objednání opravy zrušeno."));
    render();
    updateRepairButton();
  }catch(e){
    if(st) st.textContent="Chyba uložení objednané opravy: "+e.message;
  }
}

async function toggleOrderedFromDetail(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }

  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const ordered=selectedSite.ordered !== true;
  try{
    const existingEdit=editCache[selectedKey] || editCache[selectedSite.id] || {};
    const currentRaw={...(selectedSite.raw || {}),...((existingEdit.rawEdits && typeof existingEdit.rawEdits==="object") ? existingEdit.rawEdits : {})};
    const statusPatch=mapStatusRawPatchFromStatePatch({ordered},currentRaw);
    const edit={
      ordered,
      rawEdits:{...(existingEdit.rawEdits || {}),...statusPatch},
      updatedBy:siteEditUserEmail(),
      updatedAt:new Date().toISOString()
    };

    const firebaseDocId=selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "";
    let queuedForSync=false;
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const result=await saveUnifiedSiteRawPatchOrQueue(selectedSite,statusPatch,{
        docId:firebaseDocId,
        reason:"Změna stavu objednané kontroly"
      });
      queuedForSync=!!(result && result.queued);
    }

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...existingEdit,...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,{ordered});
    const syncText=queuedForSync ? " Čeká na synchronizaci." : "";
    if(st) st.textContent=(ordered ? "Kontrola označena jako objednaná." : "Objednání kontroly zrušeno.")+syncText;
    showSaveConfirmation(queuedForSync ? "Stav uložen v tabletu, odešle se po připojení." : (ordered ? "Kontrola objednána." : "Objednání zrušeno."));
    render();
    updateOrderedButton();
  }catch(e){
    if(st) st.textContent="Chyba uložení objednání: "+e.message;
  }
}

async function toggleStopFromDetail(){
  const st=document.getElementById("editStatus");
  if(!selectedSite){ if(st) st.textContent="Není vybrané místo."; return; }

  const selectedKey=detailKey(selectedSite) || selectedSite.id;
  const stopped=selectedSite.stopped !== true;
  try{
    const existingEdit=editCache[selectedKey] || editCache[selectedSite.id] || {};
    const currentRaw={...(selectedSite.raw || {}),...((existingEdit.rawEdits && typeof existingEdit.rawEdits==="object") ? existingEdit.rawEdits : {})};
    const statusPatch=mapStatusRawPatchFromStatePatch({stopped},currentRaw);
    const edit={
      stopped,
      rawEdits:{...(existingEdit.rawEdits || {}),...statusPatch},
      updatedBy:siteEditUserEmail(),
      updatedAt:new Date().toISOString()
    };

    const firebaseDocId=selectedSite.firebaseDocId || (selectedSite.raw && selectedSite.raw["Firebase_doc_id"]) || "";
    let queuedForSync=false;
    if(firebaseDocId && isFirebaseUnifiedRow(selectedSite)){
      const result=await saveUnifiedSiteRawPatchOrQueue(selectedSite,statusPatch,{
        docId:firebaseDocId,
        reason:"Změna Stop Stav"
      });
      queuedForSync=!!(result && result.queued);
    }

    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...existingEdit,...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,{stopped});
    const syncText=queuedForSync ? " Čeká na synchronizaci." : "";
    if(st) st.textContent=(stopped ? "Zdroj je označený jako Stop Stav." : "Stop Stav byl zrušen.")+syncText;
    showSaveConfirmation(queuedForSync ? "Stav uložen v tabletu, odešle se po připojení." : (stopped ? "Stop Stav uložen." : "Stop Stav zrušen."));
    render();
    updateStopButton();
  }catch(e){
    if(st) st.textContent="Chyba uložení Stop Stavu: "+e.message;
  }
}


function getWatchSelfValue(raw){
  return canonicalWatchSelfValue(raw);
}

function getWatchFixed(raw){
  return canonicalWatchSelfValue(raw);
}

function getImportantNoteFixed(raw){
  return firstSiteField(raw,["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky","dulezita poznamka"]);
}

function detectControlPeriod(raw){
  const dateMonths=inferControlPeriodMonthsFromDates(raw || {});
  if(dateMonths) return String(dateMonths);
  const value=firstSiteField(raw,[
    "Perioda",
    "Perioda kontrol",
    "Perioda zkoušky",
    "Perioda zkoušek",
    "Perioda kontroly",
    "Perioda kontrol (6/12)",
    "Cetnost",
    "Četnost",
    "Kontrola",
    "Interval"
  ]);
  if(value){
    const v=valNormFixed(value);
    if(v.includes("6")) return "6";
    if(v.includes("12") || v.includes("rok") || v.includes("rocni")) return "12";
  }

  // fallback podle původních dat
  const joined = JSON.stringify(raw||{}).toLowerCase();
  if(joined.includes("6 mes") || joined.includes("6 měs")) return "6";
  if(joined.includes("12 mes")) return "12";
  if(joined.includes("1 rok")) return "12";

  return "12";
}


function shouldWatchSelf(raw){
  return explicitWatchSelfFromRaw(raw)===true;
}

const {
  renderDetailTable
}=createDetailTableDisplayHelpers({
  rawForSiteFieldLookup,
  userSiteDataFields:USER_SITE_DATA_FIELDS,
  userSiteDisplayText,
  userSiteFieldValue
});

window.openDetail=function(i){
  restoreNormalDetailDrawerShell();
  syncRowIndexes();
  const r=rows[Number(i)]; if(!r)return; selectedSite=r;
  startDetailAsyncLoads(r);
  const drawer=drawerNode();
  if(drawer){ drawer.classList.add("open"); drawer.scrollTop=0; }
  const newSiteCard=newSiteCardNode();
  if(newSiteCard) newSiteCard.style.display="none";
  clearNewSiteMode();
  setTextIfChanged(detailTitleNode(),r.adresa||"Bez názvu");
  setTextIfChanged(detailSubNode(),siteSourceLabel(r)||"");
  renderSourceChooser(r);
  resetOfficialProtocolSection(r);
  if(window.setDetailTab) window.setDetailTab("data");
  const detailTableEl=detailTableNode();
  if(detailTableEl){
    detailTableEl.classList.remove("data-edit-table");
    renderDetailTable(detailTableEl,r);
  }
  showControlDateDisplay(r);
  const addDataRowBox=document.getElementById("addDataRowBox"); if(addDataRowBox) addDataRowBox.style.display="none";
  const editDataToggleBtn=document.getElementById("editDataToggleBtn");
  const toggleOrderedBtn=document.getElementById("toggleOrderedBtn");
  const toggleRepairBtn=document.getElementById("toggleRepairBtn");
  const toggleStopBtn=document.getElementById("toggleStopBtn");
  const showSiteOnMapBtn=document.getElementById("showSiteOnMapBtn");
  const calcDataGpsBtn=document.getElementById("calcDataGpsBtn");
  const saveDataBtn=document.getElementById("saveDataEditsBtn");
  const cancelDataEditBtn=document.getElementById("cancelDataEditBtn");
  if(calcDataGpsBtn){ calcDataGpsBtn.style.display="none"; calcDataGpsBtn.onclick=dataAddressToGps; }
  if(toggleOrderedBtn){
    toggleOrderedBtn.style.display="block";
    updateOrderedButton();
    toggleOrderedBtn.onclick=toggleOrderedFromDetail;
  }
  if(toggleRepairBtn){
    toggleRepairBtn.style.display="block";
    updateRepairButton();
    toggleRepairBtn.onclick=toggleRepairFromDetail;
  }
  if(toggleStopBtn){
    toggleStopBtn.style.display="block";
    updateStopButton();
    toggleStopBtn.onclick=toggleStopFromDetail;
  }
  const deleteDataSiteBtn=document.getElementById("deleteDataSiteBtn");
  if(deleteDataSiteBtn){
    deleteDataSiteBtn.style.display=isAppAdmin() ? "block" : "none";
    deleteDataSiteBtn.onclick=deleteSelectedSite;
  }
  if(showSiteOnMapBtn){
    showSiteOnMapBtn.style.display="block";
    showSiteOnMapBtn.onclick=showSelectedSiteOnMap;
  }

  if(editDataToggleBtn){
    editDataToggleBtn.style.display="block";
    editDataToggleBtn.onclick=()=>{
      const table=detailTableNode();
      if(!table) return;
      table.classList.add("data-edit-table");
      renderEditableDataTable(table,selectedSite);
      const inlineGpsBtn=document.getElementById("detailGpsCalcInline");
      if(inlineGpsBtn) inlineGpsBtn.onclick=dataAddressToGps;
      const inlineGpsPickBtn=document.getElementById("detailGpsPickMapInline");
      if(inlineGpsPickBtn) inlineGpsPickBtn.onclick=startDetailManualGpsPick;
      showControlDateInputs(selectedSite);
      editDataToggleBtn.style.display="none";
      if(calcDataGpsBtn) calcDataGpsBtn.style.display="none";
      if(saveDataBtn) saveDataBtn.style.display="block";
      if(cancelDataEditBtn) cancelDataEditBtn.style.display="block";
      const addDataRowBox=document.getElementById("addDataRowBox"); if(addDataRowBox) addDataRowBox.style.display="none";
      
    };
  }
  if(saveDataBtn){ saveDataBtn.style.display="none"; saveDataBtn.onclick=saveAllDataEdits; }
  if(cancelDataEditBtn){
    cancelDataEditBtn.style.display="none";
    cancelDataEditBtn.onclick=()=>window.openDetailById(detailKey(selectedSite) || selectedSite.id);
  }
  const addDataRowBtn=document.getElementById("addDataRowBtn");
  if(addDataRowBtn) addDataRowBtn.onclick=addNewDataRowToTable;
  clearProtocolEditState();
  setProtocolFormOpen(false,{skipPrefill:true});
  try{
    setInputValue("editName",r.adresa||"");
    setInputValue("editContact",r.kontakt||"");
    setInputValue("editSource",r.zdroj||"");
    setInputChecked("editOrdered",r.ordered === true);
    setInputValue("editGpsAddress",r.gpsAddress||first(r.raw,["Adresa_GPS","Adresa / umístění","Umístění"])||"");
    setInputValue("editGpsLat",Number.isFinite(r.lat)?String(r.lat):"");
    setInputValue("editGpsLon",Number.isFinite(r.lon)?String(r.lon):"");
    setInputValue("editLastCheck",isoDateFromAny(r.posledni)||"");
    recalcEditNextCheck();
    setInputValue("editNotes",r.poznamky||"");
    setInputValue("technician",currentUser?.displayName||currentUser?.email||"");
    setInputValue("checkDate",new Date().toISOString().slice(0,10));
  }catch(e){
    console.warn("Doplňková pole detailu se nepodařilo vyplnit",e);
  }
}
let detailHistoryItems=[];
let detailHistoryIndex=0;
let detailHistoryRenderSignature="";
function detailHistoryNode(){
  return formFieldNode("history");
}
let protocolEditState=null;
const DETAIL_HISTORY_CACHE_MS=45000;
const DETAIL_HISTORY_MUTATION_KINDS=new Set(["protocolHistory","serviceHistory","protocols","serviceRecords"]);
const detailHistoryCache=new Map();
const LAST_PROTOCOL_CACHE_MS=45000;
const lastProtocolCache=new Map();
const MAIN_PROTOCOL_HISTORY_CACHE_MS=45000;
let mainProtocolHistoryCache={key:"",savedAt:0,items:null};
let mainProtocolHistoryRenderSignature="";
let mainProtocolHistoryCurrentItems=[];
let mainProtocolHistoryDateFilter="";
const allLocalProtocolHistoryReadCache=new Map();

function detailHistoryCacheKey(site=selectedSite){
  if(!site) return "";
  const keys=[detailLazyKey(site), selectedSiteDocId(site), ...siteRecordKeys(site), currentUserEmail()]
    .map(x=>String(x || "").trim())
    .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);
  return keys.join("|");
}

function cloneDetailHistoryItem(item){
  return item && typeof item==="object" ? {...item} : item;
}

function cloneDetailHistoryItems(items=[]){
  const source=Array.isArray(items) ? items : [];
  const out=[];
  for(const item of source){
    out.push(cloneDetailHistoryItem(item));
  }
  return out;
}

function readLastProtocolCache(site=selectedSite){
  const key=detailHistoryCacheKey(site);
  if(!key) return undefined;
  const cached=lastProtocolCache.get(key);
  if(!cached) return undefined;
  if(Date.now()-cached.savedAt>LAST_PROTOCOL_CACHE_MS){
    lastProtocolCache.delete(key);
    return undefined;
  }
  return cloneDetailHistoryItem(cached.item) || null;
}

function writeLastProtocolCache(site=selectedSite,item=null){
  const key=detailHistoryCacheKey(site);
  if(!key) return;
  lastProtocolCache.set(key,{
    savedAt:Date.now(),
    item:cloneDetailHistoryItem(item) || null
  });
}

function clearLastProtocolCache(site=selectedSite){
  if(!site){
    lastProtocolCache.clear();
    return;
  }
  const key=detailHistoryCacheKey(site);
  if(key) lastProtocolCache.delete(key);
  else lastProtocolCache.clear();
}

function readDetailHistoryCache(site=selectedSite){
  const key=detailHistoryCacheKey(site);
  if(!key) return null;
  const cached=detailHistoryCache.get(key);
  if(!cached) return null;
  if(Date.now()-cached.savedAt>DETAIL_HISTORY_CACHE_MS){
    detailHistoryCache.delete(key);
    return null;
  }
  return cloneDetailHistoryItems(cached.items);
}

function writeDetailHistoryCache(site=selectedSite,items=[]){
  const key=detailHistoryCacheKey(site);
  if(!key) return;
  detailHistoryCache.set(key,{
    savedAt:Date.now(),
    items:cloneDetailHistoryItems(items)
  });
}

function clearDetailHistoryCache(site=selectedSite){
  detailHistoryRenderSignature="";
  if(!site){
    detailHistoryCache.clear();
    lastProtocolCache.clear();
    return;
  }
  const key=detailHistoryCacheKey(site);
  if(key) detailHistoryCache.delete(key);
  else detailHistoryCache.clear();
  clearLastProtocolCache(site);
}
window.clearDetailHistoryCache=clearDetailHistoryCache;

function mainProtocolHistoryCacheKey(){
  return currentUserEmail() || "anonymous";
}

function readMainProtocolHistoryCache(){
  const key=mainProtocolHistoryCacheKey();
  if(!mainProtocolHistoryCache.items || mainProtocolHistoryCache.key!==key) return null;
  if(Date.now()-mainProtocolHistoryCache.savedAt>MAIN_PROTOCOL_HISTORY_CACHE_MS){
    mainProtocolHistoryCache={key:"",savedAt:0,items:null};
    return null;
  }
  return cloneDetailHistoryItems(mainProtocolHistoryCache.items);
}

function writeMainProtocolHistoryCache(items=[]){
  mainProtocolHistoryCache={
    key:mainProtocolHistoryCacheKey(),
    savedAt:Date.now(),
    items:cloneDetailHistoryItems(items)
  };
}

function clearMainProtocolHistoryCache(){
  mainProtocolHistoryCache={key:"",savedAt:0,items:null};
  mainProtocolHistoryRenderSignature="";
  allLocalProtocolHistoryReadCache.clear();
}
window.clearMainProtocolHistoryCache=clearMainProtocolHistoryCache;

function clearDetailHistoryCacheForKind(kind,site=selectedSite){
  const cleanKind=String(kind || "");
  clearLocalDetailReadCacheForKind(cleanKind,site);
  if(DETAIL_HISTORY_MUTATION_KINDS.has(cleanKind)) clearDetailHistoryCache(site);
  if(cleanKind==="protocolHistory" || cleanKind==="protocols") clearLastProtocolCache(site);
  if(cleanKind==="protocolHistory" || cleanKind==="protocols") clearMainProtocolHistoryCache();
}

function normalizeSealValue(value){
  const n=dataNormFixed(value);
  if(!n) return "";
  if(n.includes("porus") || n.includes("poskoz") || n.includes("spat")) return "porušena";
  if(n.includes("porad") || n==="ok" || n==="ano" || n.includes("neporus")) return "v pořádku";
  return safe(value);
}

function setProtocolFieldValue(id,value){
  const el=formFieldNode(id);
  if(!el) return;
  let next=safe(value);
  if(el.tagName==="SELECT"){
    if(id==="protoSeal2") next=normalizeSealValue(next);
    if(next && !Array.from(el.options).some(option=>option.value===next)){
      const option=document.createElement("option");
      option.value=next;
      option.textContent=next;
      el.appendChild(option);
    }
  }
  if(el.value!==next) el.value=next;
}

function updateProtocolSaveButtonText(){
  setTextIfChanged(formFieldNode("saveProtocolBtn"),protocolEditState ? "Uložit změny protokolu" : "Uložit protokol");
}

function updateProtocolSourceStateUi(){
  const state=val("protoSourceState");
  const wrap=formFieldNode("protoSourceTestWrap");
  if(wrap) setDisplayIfChanged(wrap,state==="ok" ? "grid" : "none");
  if(state!=="ok") setProtocolFieldValue("protoSourceTestMethod","");
}

function clearProtocolEditState(){
  protocolEditState=null;
  updateProtocolSaveButtonText();
}

function protocolEditId(){
  return safe(protocolEditState && protocolEditState.id);
}

function drawSavedProtocolSignature(dataUrl){
  const canvas=protocolSignatureCanvas();
  const ctx=protocolSignatureContext();
  if(!canvas || !ctx || !safe(dataUrl)) return;
  setProtocolClientSignaturePanelOpen(true);
  const img=new Image();
  img.onload=()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const scale=Math.min(canvas.width/img.width, canvas.height/img.height);
    const w=img.width*scale;
    const h=img.height*scale;
    ctx.drawImage(img,(canvas.width-w)/2,(canvas.height-h)/2,w,h);
    protoClientSignatureDirty=false;
  };
  img.src=dataUrl;
}

function fillProtocolFormFromHistory(protocol={}){
  const form=formFieldNode("protocolForm");
  if(form) form.reset();
  clearProtocolClientSignature();
  populateProtocolDeviceSelect();
  setProtocolFieldValue("protoDate",dateInputValueFromAny(protocol.date || protocol.checkDate || protocol.createdAt));
  setProtocolFieldValue("protoPlace",protocol.place || protocol.siteAddress || protocol.siteName || selectedSite?.adresa || "");
  setProtocolFieldValue("protoDeviceType",protocol.deviceType || protocol.selectedDevice || protocol.siteSource || "");
  setProtocolFieldValue("protoSerial",protocol.serial || "");
  setProtocolFieldValue("protoSeal",protocol.seal || "");
  setProtocolFieldValue("protoOperator",protocol.operator || "");
  setProtocolFieldValue("protoCustomer",protocol.customer || "");
  setProtocolFieldValue("protoPbzLocation",protocol.pbzLocation || "");
  setProtocolFieldValue("protoBatteryCount",protocol.batteryCount || "");
  setProtocolFieldValue("protoCapacity",protocol.capacityAh || "");
  setProtocolFieldValue("protoSetCount",protocol.setCount || "");
  setProtocolFieldValue("protoAuxBatteryAh",protocol.auxBatteryAh || "");
  setProtocolFieldValue("protoTemp",protocol.temperature || "");
  setProtocolFieldValue("protoSeal2",protocol.seal2 || "");
  setProtocolFieldValue("protoInputVac",protocol.inputVac || "");
  setProtocolFieldValue("protoOutput1Vac",protocol.output1Vac || "");
  setProtocolFieldValue("protoOutput2Vac",protocol.output2Vac || "");
  setProtocolFieldValue("protoBackup1Vac",protocol.backup1Vac || "");
  setProtocolFieldValue("protoBackup2Vac",protocol.backup2Vac || "");
  setProtocolFieldValue("protoMainBatVdc",protocol.mainBatVdc || "");
  setProtocolFieldValue("protoResetDiag",protocol.resetDiagnostics || "");
  setProtocolFieldValue("protoAuxBatVdc",protocol.auxBatVdc || "");
  setProtocolFieldValue("protoUnbalance1",protocol.unbalance1 || "");
  setProtocolFieldValue("protoUnbalance2",protocol.unbalance2 || "");
  setProtocolFieldValue("protoBreakersLocation",protocol.breakersLocation || "");
  setProtocolFieldValue("protoControlLocation",protocol.controlLocation || "");
  setProtocolFieldValue("protoTestProcedure",protocol.testProcedure || "");
  setProtocolFieldValue("protoContacts",protocol.contacts || "");
  setProtocolFieldValue("protoOtherDevice",protocol.backedDevices?.other || "");
  setProtocolFieldValue("protoOtherAccess",protocol.access?.other || "");
  setProtocolFieldValue("protoOtherAvailability",protocol.availability?.other || "");
  setProtocolFieldValue("protoPeriod",protocol.period || "");
  setProtocolFieldValue("protoConditions",protocol.conditions || protocol.result || "");
  setProtocolFieldValue("protoConditionsReason",protocol.conditionsReason || "");
  setProtocolFieldValue("protoNotes",protocol.notes || protocol.issues || "");
  setProtocolFieldValue("protoCustomerNote",protocol.customerNote || protocol.noteForCustomer || "");
  setProtocolFieldValue("protoChecklist",protocol.checklist || protocol.checkList || protocol.chceckList || "");
  setProtocolFieldValue("protoSourceState",protocolSourceStateValue(protocol));
  setProtocolFieldValue("protoSourceTestMethod",protocol.sourceTestMethod || protocol.testMethod || "");
  setProtocolFieldValue("protoClientSign",protocol.clientSign || protocol.customer || "");
  setProtocolFieldValue("protoTechSign",protocolTechnicianDisplayName(protocol,{allowCurrentFallback:true}));
  updateProtocolSourceStateUi();

  const backed=protocol.backedDevices || {};
  setInputChecked("protoLift",backed.lift);
  setInputChecked("protoVent",backed.vent);
  setInputChecked("protoMachineLight",backed.machineLight);
  setInputChecked("protoChuc",backed.chuc);
  setInputChecked("protoDamper",backed.damper);
  setInputChecked("protoSkylight",backed.skylight);
  setInputChecked("protoGate",backed.gate);
  setInputChecked("protoAts",backed.ats);
  setInputChecked("protoRpo",backed.rpo);
  setInputChecked("protoNo",backed.no);
  setInputChecked("protoSprinkler",backed.sprinkler);
  setInputChecked("protoCsTs",backed.csTs);

  const access=protocol.access || {};
  setInputChecked("protoBlue",access.blue);
  setInputChecked("protoB",access.b);
  setInputChecked("protoC",access.c);
  setInputChecked("protoGarage",access.garage);
  setInputChecked("protoCarLift",access.carLift);
  setInputChecked("protoBarrier",access.barrier);
  setInputChecked("protoParkingHouse",access.parkingHouse);
  setInputChecked("protoPermit",access.permit);
  setInputChecked("protoTraining",access.training);
  setInputChecked("protoShoes",access.shoes);
  setInputChecked("protoVest",access.vest);
  setInputChecked("protoHelmet",access.helmet);

  const availability=protocol.availability || {};
  setInputChecked("protoWcOk",availability.wcOk);
  setInputChecked("protoWcNok",availability.wcNok);
  setInputChecked("protoLightOk",availability.lightOk);
  setInputChecked("protoLightNok",availability.lightNok);
  setInputChecked("protoLadder",availability.ladder);
  setInputChecked("protoStairs",availability.stairs);
  setInputChecked("protoLowCeiling",availability.lowCeiling);
  setInputChecked("protoExtremeTemp",availability.extremeTemp);
  drawSavedProtocolSignature(protocol.clientSignatureDataUrl || "");
  updateProtocolSummary();
}

function editCurrentHistoryProtocol(){
  const protocol=selectedHistoryProtocol();
  if(!protocol){
    setProtocolStatusText("Není vybraný protokol k úpravě.");
    return;
  }
  if(window.setDetailTab) window.setDetailTab("protocol");
  setProtocolFormOpen(true,{skipPrefill:true});
  const form=formFieldNode("protocolForm");
  fillProtocolFormFromHistory(protocol);
  protocolEditState={id:safe(protocol._id), item:{...protocol}, collection:protocol._collection || ""};
  updateProtocolSaveButtonText();
  setProtocolStatusText("Upravuješ uložený protokol. Po uložení se přepíše stejný záznam.");
}

const {
  activeDetailTabName,
  detailLazyKey,
  ensureDetailAsyncLoads,
  ensureDetailTabLoad,
  refreshDetailTabLoad,
  refreshLoadedDetailTabs,
  resetDetailLazyLoadState,
  sameDetailLazySite,
  startDetailAsyncLoads
}=createDetailLazyLoadHelpers({
  detailHistoryNode,
  detailKey,
  drawerNode,
  getSelectedSite:()=>selectedSite,
  loadHistory,
  loadSiteAttachments,
  loadSitePhotos,
  resetDetailHistory:()=>{
    detailHistoryItems=[];
    detailHistoryIndex=0;
    detailHistoryRenderSignature="";
  },
  resetSiteAttachmentInput,
  resetSiteAttachments:()=>{
    siteAttachmentItems=[];
    siteAttachmentRenderSignature="";
  },
  resetSitePhotoInput,
  resetSitePhotos:()=>{
    sitePhotoItems=[];
    sitePhotoIndex=0;
    sitePhotoRenderSignature="";
  },
  safe,
  setSiteAttachmentsStatusText,
  setSitePhotosStatusText,
  siteAttachmentsNode,
  siteAttachmentsStatusNode,
  sitePhotosListNode,
  sitePhotosStatusNode,
  updateOfficialProtocolSourceInfo
});
window.ensureDetailTabLoad=ensureDetailTabLoad;
window.refreshLoadedDetailTabs=refreshLoadedDetailTabs;

const {
  photoCloudinaryVersionDate,
  photoDateLabel,
  photoInsertedLabel,
  photoTakenLabel
}=createPhotoDateHelpers({
  formatDateCz,
  formatDateTimeCz,
  isAppAdmin
});

const {
  protocolExportDatePart,
  protocolExportValue,
  protocolWordFileNamePart
}=createProtocolExportHelpers({
  formatDateTimeCz
});

const {
  historyDateLabel,
  historySavedDateLabel,
  protocolGlobalHistoryTitle
}=createHistoryLabelHelpers({
  dateOnlyTextFallback,
  formatDateCz,
  formatDateTimeCz,
  isAppAdmin,
  protocolExportValue
});

function protocolDisplayDate(value){
  const d=parseDateValue(value);
  return d ? formatDateCz(d) : protocolExportValue(value);
}

function wordXmlEscape(value){
  return protocolExportValue(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&apos;");
}

function wordTextXml(value){
  const raw=protocolExportValue(value);
  if(!raw) return '<w:t xml:space="preserve"> </w:t>';
  return raw.split(/\r?\n/).map((part,idx)=>`${idx ? "<w:br/>" : ""}<w:t xml:space="preserve">${wordXmlEscape(part)}</w:t>`).join("");
}

function wordRun(value,options={}){
  const props=[
    '<w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/>',
    `<w:sz w:val="${options.size || 20}"/>`,
    `<w:szCs w:val="${options.size || 20}"/>`
  ];
  if(options.bold) props.push("<w:b/><w:bCs/>");
  if(options.italic) props.push("<w:i/><w:iCs/>");
  if(options.color) props.push(`<w:color w:val="${options.color}"/>`);
  return `<w:r><w:rPr>${props.join("")}</w:rPr>${wordTextXml(value)}</w:r>`;
}

function wordParagraphXml(runXml,options={}){
  const props=[];
  if(options.align) props.push(`<w:jc w:val="${options.align}"/>`);
  props.push(`<w:spacing w:before="${options.before || 0}" w:after="${options.after ?? 0}" w:line="220" w:lineRule="auto"/>`);
  return `<w:p><w:pPr>${props.join("")}</w:pPr>${runXml || wordRun(" ")}</w:p>`;
}

function wordParagraph(value,options={}){
  return wordParagraphXml(wordRun(value,options),options);
}

function wordBlank(after=60){
  return wordParagraph(" ",{size:4,after});
}

function wordCellXml(contentXml,width,options={}){
  const props=[
    `<w:tcW w:w="${width}" w:type="dxa"/>`,
    `<w:vAlign w:val="${options.vAlign || "center"}"/>`,
    '<w:tcMar><w:top w:w="45" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="45" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tcMar>'
  ];
  if(options.colSpan && options.colSpan>1) props.push(`<w:gridSpan w:val="${options.colSpan}"/>`);
  if(options.fill) props.push(`<w:shd w:fill="${options.fill}"/>`);
  return `<w:tc><w:tcPr>${props.join("")}</w:tcPr>${contentXml || wordParagraph(" ")}</w:tc>`;
}

function wordCellText(text,width,options={}){
  const paragraph=wordParagraph(text || " ",{
    size:options.size || 20,
    bold:!!options.bold,
    align:options.align || "left",
    after:0
  });
  return wordCellXml(paragraph,width,options);
}

function wordTable(rows,widths,options={}){
  const total=widths.reduce((sum,w)=>sum+w,0);
  const borders=options.noBorders
    ? '<w:tblBorders><w:top w:val="nil"/><w:left w:val="nil"/><w:bottom w:val="nil"/><w:right w:val="nil"/><w:insideH w:val="nil"/><w:insideV w:val="nil"/></w:tblBorders>'
    : '<w:tblBorders><w:top w:val="single" w:sz="4" w:color="000000"/><w:left w:val="single" w:sz="4" w:color="000000"/><w:bottom w:val="single" w:sz="4" w:color="000000"/><w:right w:val="single" w:sz="4" w:color="000000"/><w:insideH w:val="single" w:sz="4" w:color="000000"/><w:insideV w:val="single" w:sz="4" w:color="000000"/></w:tblBorders>';
  const grid=widths.map(width=>`<w:gridCol w:w="${width}"/>`).join("");
  const rowXml=rows.map(row=>{
    let colIndex=0;
    const minHeight=row.reduce((max,cell)=>Math.max(max,(cell && cell.height) || 0),0);
    const trPr=minHeight ? `<w:trPr><w:trHeight w:val="${minHeight}" w:hRule="atLeast"/></w:trPr>` : "";
    const cells=row.map(cell=>{
      const c=typeof cell==="string" ? {text:cell} : (cell || {});
      const span=c.colSpan || 1;
      const width=c.width || widths.slice(colIndex,colIndex+span).reduce((sum,w)=>sum+w,0);
      colIndex+=span;
      if(c.xml) return wordCellXml(c.xml,width,c);
      return wordCellText(c.text,width,c);
    }).join("");
    return `<w:tr>${trPr}${cells}</w:tr>`;
  }).join("");
  return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblLayout w:type="fixed"/>${borders}</w:tblPr><w:tblGrid>${grid}</w:tblGrid>${rowXml}</w:tbl>`;
}

function wordFormField(label,value,width=9630){
  return wordTable([
    [{text:label,bold:true,size:18,fill:"F2F2F2"}],
    [{text:protocolExportValue(value) || " ",size:20,height:330}]
  ],[width]) + wordBlank(20);
}

function wordFormGrid(labels,values,widths){
  return wordTable([
    labels.map(label=>({text:label,bold:true,size:18,fill:"F2F2F2"})),
    values.map(value=>({text:protocolExportValue(value) || " ",size:20,height:330}))
  ],widths) + wordBlank(20);
}

function base64ToBytes(base64){
  const binary=atob(base64 || "");
  const bytes=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++) bytes[i]=binary.charCodeAt(i);
  return bytes;
}

function imageBytesFromPngDataUrl(dataUrl=""){
  const match=dataUrl.match(/^data:image\/png;base64,(.+)$/);
  if(!match) return null;
  try{return base64ToBytes(match[1]);}catch(e){return null;}
}

function protocolSignatureImageBytes(protocol={}){
  return imageBytesFromPngDataUrl(safe(protocol.clientSignatureDataUrl || protocol.clientSignature || ""));
}

function protocolTechnicianSignatureImageBytes(protocol={}){
  return imageBytesFromPngDataUrl(safe(protocol.techSignatureDataUrl || protocol.technicianSignatureDataUrl || ""));
}

function technicianKnownKeyFromValue(value=""){
  const text=safe(value);
  if(!text) return "";
  const lower=text.toLowerCase();
  const norm=simpleNorm(text);
  const compact=norm.replace(/\s+/g,"");
  if(
    lower.includes("tipek") ||
    norm.includes("michal tipek") ||
    compact.includes("michaltipek")
  ) return "tipek";
  if(
    lower.includes("jan.soldan") ||
    lower.includes("jansoldan") ||
    norm.includes("jan soldan") ||
    compact.includes("jansoldan")
  ) return "soldan";
  return "";
}

function technicianKnownDisplayName(key=""){
  if(key==="tipek") return "Ing. Michal Tipek";
  if(key==="soldan") return "Ing. Jan Soldan";
  return "";
}

function normalizeTechnicianDisplayName(value=""){
  const text=safe(value);
  if(!text) return "";
  const known=technicianKnownDisplayName(technicianKnownKeyFromValue(text));
  if(known) return known;
  if(/^ing\.?\s+/i.test(text)) return text.replace(/^ing\.?\s+/i,"Ing. ");
  if(text.includes("@")){
    const local=text.split("@")[0].replace(/[._-]+/g," ").trim();
    return local ? local.replace(/\b\w/g,char=>char.toUpperCase()) : text;
  }
  return text;
}

function protocolTechnicianEmail(protocol={},options={}){
  const candidates=[
    protocol.technicianEmail,
    protocol.techEmail,
    protocol.createdBy
  ];
  if(options.allowUpdatedBy) candidates.push(protocol.updatedBy);
  if(options.allowCurrentFallback) candidates.push(currentUser?.email,currentUserEmail(),lastKnownUserEmail());
  for(const candidate of candidates){
    const email=safe(candidate).toLowerCase();
    if(email && email.includes("@")) return email;
  }
  return "";
}

function protocolTechnicianDisplayName(protocol={},options={}){
  const primary=[
    protocol.techSign,
    protocol.technician,
    protocol.technicianName,
    protocol.technicianDisplayName
  ].map(normalizeTechnicianDisplayName).find(Boolean);
  if(primary) return primary;
  const email=protocolTechnicianEmail(protocol,{allowCurrentFallback:false});
  const emailName=normalizeTechnicianDisplayName(email || protocol.technicianEmail || protocol.techEmail || "");
  if(emailName) return emailName;
  if(options.allowCurrentFallback){
    return normalizeTechnicianDisplayName(
      currentUser?.displayName ||
      currentUser?.email ||
      currentUserEmail() ||
      lastKnownUserEmail() ||
      ""
    );
  }
  return "";
}

function normalizeProtocolTechnicianFields(protocol={},options={}){
  const email=protocolTechnicianEmail(protocol,{allowCurrentFallback:!!options.allowCurrentFallback});
  const display=protocolTechnicianDisplayName({...protocol,technicianEmail:protocol.technicianEmail || email},{
    allowCurrentFallback:!!options.allowCurrentFallback
  });
  return {
    ...protocol,
    technicianEmail:protocol.technicianEmail || email,
    techEmail:protocol.techEmail || email,
    technicianName:protocol.technicianName || display,
    techSign:display || protocol.techSign || protocol.technician || ""
  };
}

function wordSignatureImageRun(relId="rIdSignature",options={}){
  const cx=Number(options.cx) || 2600000;
  const cy=Number(options.cy) || 760000;
  const docId=Number(options.docId) || 7;
  const name=wordXmlEscape(options.name || "Podpis objednavatele");
  const fileName=wordXmlEscape(options.fileName || "podpis.png");
  return `<w:r><w:rPr><w:noProof/></w:rPr><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${docId}" name="${name}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${docId}" name="${fileName}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${relId}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
}

function wordClientSignatureCellXml(protocol={},options={}){
  const compact=!!options.compact;
  const parts=[];
  if(safe(protocol.clientSign)) parts.push(wordParagraph(protocol.clientSign,{size:compact ? 16 : 18,after:compact ? 0 : 30}));
  if(protocolSignatureImageBytes(protocol)){
    const imageOptions=compact ? {cx:3800000,cy:1100000,name:"Podpis objednavatele",fileName:"podpis-objednavatele.png"} : {name:"Podpis objednavatele",fileName:"podpis-objednavatele.png"};
    parts.push(wordParagraphXml(wordSignatureImageRun("rIdSignature",imageOptions),{after:0}));
  }
  return parts.join("") || wordParagraph(" ",{size:18,after:0});
}

function wordTechnicianSignatureCellXml(protocol={}){
  const tech=protocolTechnicianDisplayName(protocol,{allowCurrentFallback:true});
  const parts=[];
  if(safe(tech)) parts.push(wordParagraph(tech,{size:18,after:protocolTechnicianSignatureImageBytes(protocol) ? 20 : 0}));
  if(protocolTechnicianSignatureImageBytes(protocol)){
    parts.push(wordParagraphXml(wordSignatureImageRun("rIdTechSignature",{
      cx:3400000,
      cy:980000,
      docId:8,
      name:"Podpis technika",
      fileName:"podpis-technika.png"
    }),{after:0}));
  }
  return parts.join("") || wordParagraph(" ",{size:18,after:0});
}

function wordSignatureGrid(protocol={}){
  return wordTable([
    [
      {text:"Za objednavatele:",bold:true,size:18,fill:"F2F2F2"},
      {text:"Kontrolu provedl:",bold:true,size:18,fill:"F2F2F2"}
    ],
    [
      {xml:wordClientSignatureCellXml(protocol),height:1050},
      {xml:wordTechnicianSignatureCellXml(protocol),height:1050}
    ]
  ],[4815,4815]) + wordParagraph("(čitelně + podpis)",{size:16,after:35});
}

function wordCheck(value){
  return value ? "☒" : "☐";
}

function protocolCheckedText(items){
  return items.map(item=>`${wordCheck(!!item.checked)} ${item.label}`).join("   ");
}

function protocolBackedDevicesText(protocol={}){
  const d=protocol.backedDevices || {};
  return protocolCheckedText([
    {checked:d.lift,label:"Výtah"},
    {checked:d.vent,label:"vent. výt. šachty"},
    {checked:d.machineLight,label:"osvětlení strojovny"},
    {checked:d.chuc,label:"CHÚC"},
    {checked:d.damper,label:"klapka"},
    {checked:d.skylight,label:"světlík"},
    {checked:d.gate,label:"vrata"},
    {checked:d.ats,label:"ATS"},
    {checked:d.rpo,label:"RPO"},
    {checked:d.no,label:"NO"},
    {checked:d.sprinkler,label:"sprinkler"},
    {checked:d.csTs,label:"CS/TS"},
    {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
  ]);
}

function protocolAccessText(protocol={}){
  const d=protocol.access || {};
  return protocolCheckedText([
    {checked:d.blue,label:"modrá"},
    {checked:d.b,label:"B"},
    {checked:d.c,label:"C"},
    {checked:d.garage,label:"garáže"},
    {checked:d.carLift,label:"auto výtah"},
    {checked:d.barrier,label:"závora"},
    {checked:d.parkingHouse,label:"park. dům"},
    {checked:d.permit,label:"povolení"},
    {checked:d.training,label:"školení"},
    {checked:d.shoes,label:"boty"},
    {checked:d.vest,label:"vesta"},
    {checked:d.helmet,label:"helma"},
    {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
  ]);
}

function protocolAvailabilityText(protocol={}){
  const d=protocol.availability || {};
  return [
    `WC ${wordCheck(d.wcOk)} Ok / ${wordCheck(d.wcNok)} Nok`,
    `Osvětlení ${wordCheck(d.lightOk)} Ok / ${wordCheck(d.lightNok)} Nok`,
    protocolCheckedText([
      {checked:d.ladder,label:"žebřík"},
      {checked:d.stairs,label:"schody"},
      {checked:d.lowCeiling,label:"snížený strop"},
      {checked:d.extremeTemp,label:"extrémní teploty"},
      {checked:safe(d.other),label:`jiné: ${safe(d.other)}`}
    ])
  ].join("   ");
}

function protocolPeriodText(protocol={}){
  const period=simpleNorm(protocol.period);
  return `${wordCheck(period.includes("6"))} 6 měsíců / ${wordCheck(period.includes("12"))} 12 měsíců`;
}

function protocolConditionsText(protocol={}){
  const n=simpleNorm(protocol.conditions || protocol.result);
  const base=`${wordCheck(n==="ano" || n==="ok")} ano / ${wordCheck(n==="ne" || n==="nok")} ne`;
  return safe(protocol.conditionsReason) ? `${base}\nOdůvodnění: ${protocol.conditionsReason}` : base;
}

function protocolMeasurementTableSpec(protocol={}){
  const w=[1070,1070,1070,1070,1070,1070,1070,1070,1070];
  const label={bold:true,size:17,fill:"F2F2F2",align:"center"};
  const value={size:18,align:"center",height:330};
  return {
    widths:w,
    rows:[
      [
        {...label,text:"Počet baterií: (ks)"},
        {...label,text:"Kapacita (Ah)"},
        {...label,text:"Počet sad (ks)",colSpan:2},
        {...label,text:"Pom. Bat (Ah)",colSpan:2},
        {...label,text:"Teplota okolí (°C)",colSpan:2},
        {...label,text:"Plomba"}
      ],
      [
        {...value,text:protocol.batteryCount},
        {...value,text:protocol.capacityAh},
        {...value,text:protocol.setCount,colSpan:2},
        {...value,text:protocol.auxBatteryAh,colSpan:2},
        {...value,text:protocol.temperature,colSpan:2},
        {...value,text:protocol.seal2}
      ],
      [
        {...label,text:"Vstup (Vac)"},
        {...label,text:"Výstup 1 (Vac)",colSpan:2},
        {...label,text:"Výstup 2 (Vac)",colSpan:2},
        {...label,text:"Výstup zál. 1 (Vac)",colSpan:2},
        {...label,text:"Výstup zál. 2 (Vac)",colSpan:2}
      ],
      [
        {...value,text:protocol.inputVac},
        {...value,text:protocol.output1Vac,colSpan:2},
        {...value,text:protocol.output2Vac,colSpan:2},
        {...value,text:protocol.backup1Vac,colSpan:2},
        {...value,text:protocol.backup2Vac,colSpan:2}
      ],
      [
        {...label,text:"Hl. bat. 1 (Vdc)"},
        {...label,text:"Reset Diagnostiky",colSpan:2},
        {...label,text:"Pom. bat. (Vdc)",colSpan:2},
        {...label,text:"Rozvážení 1 (Vdc)",colSpan:2},
        {...label,text:"Rozvážení 2 (Vdc)",colSpan:2}
      ],
      [
        {...value,text:protocol.mainBatVdc},
        {...value,text:protocol.resetDiagnostics,colSpan:2},
        {...value,text:protocol.auxBatVdc,colSpan:2},
        {...value,text:protocol.unbalance1,colSpan:2},
        {...value,text:protocol.unbalance2,colSpan:2}
      ]
    ]
  };
}

function protocolMeasurementTable(protocol={}){
  const spec=protocolMeasurementTableSpec(protocol);
  return wordTable(spec.rows,spec.widths) + wordBlank(25);
}

function protocolLegendXml(){
  const items=[
    ["Místo kontroly","oficiální stálá, dočasná nebo stavební adresa v tomto pořadí, popř. GPS navigace"],
    ["Provozovatel zařízení","Adresa dle obchodního rejstříku a IČO majitele zařízení (developer, SVJ)."],
    ["Objednatel zkoušky provozuschopnosti","případně objednatel montáže s následnou zkouškou, může se jednat o dodavatele zálohovaných zařízení, jehož jsme subdodavatelem, apd."],
    ["Umístění PBZ v objektu","co nejpřesnější popis zahrnuje patro a lokaci oproti vchodu do objektu, rozlišení jako např.: chodba, sklepní koje, garáže, pod schodištěm apd."],
    ["Umístění jističů UPS a zál. zařízení v objektu","poloha jističe přívodu do UPS a poloha jističů za UPS, případně poznámka, zda lze bezpečně použít odpínač uvnitř UPS."],
    ["Typ a umístění zálohovaných zařízení v objektu","např.: výtah, ventilátor, klapky, světlíky, čerpadlo, CS a TS, EPS, nouzové osvětlení, závora, vrata, sprinklery, RPO."],
    ["Umístění zálohovaných zařízení","přesná poloha zálohovaných zařízení v objektu."],
    ["Postup testování","stručný postup zkoušky, který se použije pro opakovanou kontrolu stejného zdroje."],
    ["Parkování a vstup do objektu, předepsané OOPP","informace o parkování, vjezdu, klíčích a povinných ochranných pomůckách."],
    ["Kontakty","správce za developera, správce za SVJ, firma, telefon a email."],
    ["Dostupnost","žebříky, stropy, osvětlení, WC a vše, co je anomální a ztěžuje provedení prací."],
    ["Perioda zkoušky provozuschopnosti","6 měsíců pro veřejné budovy a objekty se zvýšeným výskytem osob; 12 měsíců pro klasické bytové domy, pokud PBŘ nepředepisuje jinak."],
    ["Zařízení pracuje ve vyhovujících podmínkách","v odůvodnění uvést např. teplotu okolí, vlhkost, prašnost, mechanické poškození nebo znepřístupněné zařízení."],
    ["Poznámky","např. UPS je plně funkční, STOP STAV, vadná akumulátorová sada, vadná deska střídače apd."],
    ["Poznámka pro zákazníka","poznámka, která se propíše do Dokladu provozuschopnosti."],
    ["Chceck list","vše atypické, co se týká zdroje."],
    ["Stav zdroje po kontrole","výsledek kontroly zdroje: v pořádku nebo Stop Stav."]
  ];
  return wordParagraph("Legenda:",{bold:true,size:20,before:90,after:40}) +
    items.map(([label,text])=>wordParagraphXml(wordRun(`${label}: `,{bold:true,size:16}) + wordRun(text,{size:16}),{after:25})).join("");
}

function buildProtocolWordDocumentXml(protocol={}){
  const site=selectedSite || {};
  const deviceType=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || site.zdroj || "";
  const place=protocol.place || protocol.siteAddress || protocol.siteName || site.adresa || "";
  const blocks=[
    wordParagraph("Potvrzení o provedené zkoušce provozuschopnosti",{align:"center",bold:true,size:28,after:80}),
    wordParagraph("Tento formulář slouží zároveň jako objednávka zkoušky provozuschopnosti. Kontrolu záložního zdroje na PBZ dle Vyhl. 246/2001 Sb. §6, §7 provedl: Servis záložních zdrojů s.r.o., IČ: 09391126",{size:18,after:80}),
    wordFormField("Datum provedení kontroly zdroje:",protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt)),
    wordFormGrid(["Kontrolované zařízení – Typ","Výrobní č.","Plomba"],[deviceType,protocol.serial,protocol.seal],[4300,2650,2680]),
    wordFormField("1) Místo kontroly:",place),
    wordFormField("2) Provozovatel zařízení:",protocol.operator),
    wordFormField("3) Objednatel zkoušky provozuschopnosti:",protocol.customer),
    wordFormField("4) Umístění PBZ v objektu:",protocol.pbzLocation),
    protocolMeasurementTable(protocol),
    wordFormField("5) Umístění jističů UPS a zál. zařízení v objektu:",protocol.breakersLocation),
    wordFormField("6) Typ a umístění zálohovaných zařízení v objektu:",protocolBackedDevicesText(protocol)),
    wordFormField("7) Umístění zálohovaných zařízení:",protocol.controlLocation),
    wordFormField("Postup testování:",protocol.testProcedure),
    wordFormField("8) Parkování a vstup do objektu, předepsané OOPP:",protocolAccessText(protocol)),
    wordFormField("9) Kontakty:",protocol.contacts),
    wordFormField("10) Dostupnost:",protocolAvailabilityText(protocol)),
    wordFormField("11) Perioda zkoušky provozuschopnosti:",protocolPeriodText(protocol)),
    wordFormField("12) Zařízení pracuje ve vyhovujících podmínkách (odůvodnění):",protocolConditionsText(protocol)),
    wordFormField("13) Poznámky:",protocol.notes || protocol.issues),
    wordFormField("14) Poznámka pro zákazníka:",protocol.customerNote || protocol.noteForCustomer),
    wordFormField("15) Chceck list:",protocol.checklist || protocol.checkList || protocol.chceckList),
    wordFormField("Stav zdroje po kontrole:",[
      protocolSourceStateLabel(protocol),
      protocolSourceStateValue(protocol)==="ok" ? protocolSourceTestMethodLabel(protocol.sourceTestMethod || protocol.testMethod) : ""
    ].filter(Boolean).join(" - ")),
    wordSignatureGrid(protocol)
  ];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
<w:body>${blocks.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="850" w:bottom="850" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

function buildProtocolWordStylesXml(){
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="0" w:line="240" w:lineRule="auto"/></w:pPr><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="20"/><w:szCs w:val="20"/></w:rPr></w:style>
<w:style w:type="table" w:default="1" w:styleId="TableNormal"><w:name w:val="Normal Table"/><w:tblPr><w:tblCellMar><w:top w:w="80" w:type="dxa"/><w:left w:w="90" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr></w:style>
</w:styles>`;
}

function buildProtocolWordEntries(protocol={}){
  const now=new Date().toISOString();
  const title=`Protokol ${protocol.siteName || protocol.place || ""}`.trim();
  const signatureBytes=protocolSignatureImageBytes(protocol);
  const techSignatureBytes=protocolTechnicianSignatureImageBytes(protocol);
  const hasPngImage=!!(signatureBytes || techSignatureBytes);
  const imageContentType=hasPngImage ? '<Default Extension="png" ContentType="image/png"/>' : "";
  const imageRel=[
    signatureBytes ? '<Relationship Id="rIdSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/client-signature.png"/>' : "",
    techSignatureBytes ? '<Relationship Id="rIdTechSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/technician-signature.png"/>' : ""
  ].join("");
  const entries=[
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageContentType}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
    {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`},
    {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${imageRel}</Relationships>`},
    {name:"word/document.xml",data:buildProtocolWordDocumentXml(protocol)},
    {name:"word/styles.xml",data:buildProtocolWordStylesXml()},
    {name:"word/settings.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>`},
    {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${wordXmlEscape(title)}</dc:title><dc:creator>${wordXmlEscape(protocol.createdBy || protocol.technicianEmail || currentUser?.email || "")}</dc:creator><cp:lastModifiedBy>${wordXmlEscape(currentUser?.email || "")}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
    {name:"docProps/app.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Servis záložních zdrojů - mapa FZ</Application></Properties>`}
  ];
  if(signatureBytes) entries.push({name:"word/media/client-signature.png",data:signatureBytes});
  if(techSignatureBytes) entries.push({name:"word/media/technician-signature.png",data:techSignatureBytes});
  return entries;
}

function officialProtocolDataForSite(site=selectedSite){
  const remote=(site?.firebaseData?.officialProtocolData && typeof site.firebaseData.officialProtocolData==="object") ? site.firebaseData.officialProtocolData : {};
  const local=readSiteLocalObject("officialProtocolData",site);
  const remoteTime=timeValueFromAny(remote.updatedAt || remote.savedAt || remote.createdAt || 0);
  const localTime=timeValueFromAny(local.updatedAt || local.savedAt || local.createdAt || 0);
  return localTime>remoteTime ? {...remote,...local} : {...local,...remote};
}

const OFFICIAL_CONTROL_SUBJECT_TEXT="Servis záložních zdrojů s.r.o.\nBožetěchova 3003/133\n612 00 Brno\nIČO: 09391126, DIČ: CZ09391126\nC 118823/KSBR Krajský soud v Brně";
const OFFICIAL_DEFAULT_MANUFACTURER_TEXT="Servis záložních zdrojů s.r.o.\nBožetěchova 3003/133\n612 00 Brno\nIČO: 09391126, DIČ: CZ09391126\nC 118823/KSBR Krajský soud v Brně";
const OFFICIAL_MANUFACTURERS={
  astip:{
    label:"Astip",
    text:"Astip servis s.r.o.\ntřída Kpt. Jaroše 1922/3, Černá Pole\n60200, Brno\nIČ: 29276861, DIČ: CZ29276861"
  },
  tipo:{
    label:"TiPO",
    text:"TIPO electric s.r.o.\ntřída Kpt. Jaroše 1922/3, Černá Pole\n60200, Brno\nIČ: 03528405, DIČ: CZ03528405"
  },
  szz:{
    label:"Servis záložních zdrojů",
    text:OFFICIAL_DEFAULT_MANUFACTURER_TEXT
  }
};

function officialManufacturerKeyFromText(value){
  const normalized=simpleNorm(value);
  if(normalized.includes("astip servis")) return "astip";
  if(normalized.includes("tipo electric")) return "tipo";
  if(normalized.includes("servis zaloznich zdroju")) return "szz";
  return "szz";
}

function officialManufacturerTextByKey(key){
  return (OFFICIAL_MANUFACTURERS[key] || OFFICIAL_MANUFACTURERS.szz).text;
}

function syncOfficialManufacturerHidden(){
  const select=officialManufacturerSelectNode();
  const key=select?.value || "szz";
  setInputValue("officialManufacturerData",officialManufacturerTextByKey(key));
  return key;
}

function officialProtocolInputData(){
  const manufacturerKey=syncOfficialManufacturerHidden();
  return {
    operator:val("officialOperatorData"),
    objectAddress:val("officialObjectData"),
    manufacturerKey,
    manufacturer:officialManufacturerTextByKey(manufacturerKey),
    note:val("officialProtocolNote"),
    updatedAt:new Date().toISOString(),
    updatedBy:currentUser?.email || ""
  };
}

function sharedOfficialProtocolData(data={}){
  return {
    operator:data.operator || "",
    objectAddress:data.objectAddress || "",
    manufacturerKey:data.manufacturerKey || "szz",
    manufacturer:data.manufacturer || officialManufacturerTextByKey(data.manufacturerKey || "szz"),
    updatedAt:data.updatedAt || new Date().toISOString(),
    updatedBy:data.updatedBy || currentUser?.email || ""
  };
}

async function propagateOfficialProtocolDataToSiblingSources(data={},site=selectedSite,signedUser=null){
  if(!site) return 0;
  const siblings=siteSiblingRows(site)
    .filter(row=>row && !selectedSiteMatchForSave(row,detailKey(site) || site.id || "",selectedSiteDocId(site)));
  if(!siblings.length) return 0;

  const shared=sharedOfficialProtocolData(data);
  const identityKeys=new Set();
  const canSaveRemote=!!(firebaseReady && db && fb.fsMod && signedUser);
  const remoteWrites=[];
  let saved=0;

  siblings.forEach(sibling=>{
    const existing=officialProtocolDataForSite(sibling);
    const siblingData={
      ...existing,
      ...shared,
      note:existing.note || ""
    };
    writeSiteLocalObject("officialProtocolData",siblingData,sibling);
    sibling.firebaseData={...(sibling.firebaseData || {}),officialProtocolData:siblingData};
    rowIdentityKeys(sibling).forEach(key=>identityKeys.add(key));
    saved++;

    if(canSaveRemote){
      const docId=selectedSiteDocId(sibling);
      if(docId){
        const {doc,setDoc,serverTimestamp}=fb.fsMod;
        remoteWrites.push(setDoc(doc(db,"sitesUnified",docId),{
          officialProtocolData:siblingData,
          updatedAt:serverTimestamp ? serverTimestamp() : siblingData.updatedAt,
          updatedBy:currentUser?.email || ""
        },{merge:true}).catch(e=>{
          console.warn("Sdílená data dokladu se nepodařila uložit pro další zdroj",sibling,e);
        }));
      }
    }
  });

  if(remoteWrites.length) await Promise.all(remoteWrites);
  if(identityKeys.size){
    rows=rows.map(row=>{
      if(!rowMatchesIdentity(row,identityKeys)) return row;
      const existing=row.firebaseData?.officialProtocolData || {};
      return {
        ...row,
        firebaseData:{
          ...(row.firebaseData || {}),
          officialProtocolData:{...existing,...shared,note:existing.note || ""}
        }
      };
    });
    window.rows=rows;
  }
  return saved;
}

function fillOfficialProtocolInputs(site=selectedSite){
  const data=officialProtocolDataForSite(site);
  const raw=site?.raw || {};
  setInputValue("officialOperatorData",data.operator || pickRawValue(raw,["Provozovatel","Provozovatel zařízení"]) || "");
  setInputValue("officialObjectData",data.objectAddress || "");
  const manufacturerKey=data.manufacturerKey || officialManufacturerKeyFromText(data.manufacturer || "");
  setInputValue("officialManufacturerSelect",manufacturerKey);
  setInputValue("officialManufacturerData",officialManufacturerTextByKey(manufacturerKey));
  setInputValue("officialProtocolNote",data.note || "");
}

function latestDisplayedProtocol(){
  let latest=null;
  let latestTime=-Infinity;
  for(const item of detailHistoryItems || []){
    if(!isProtocolHistoryItem(item)) continue;
    const time=protocolTimeValue(item);
    if(!latest || time>latestTime){
      latest=item;
      latestTime=time;
    }
  }
  return latest;
}

function latestLocalProtocolForSite(site=selectedSite){
  const localItems=readSiteLocalArray("protocolHistory",site);
  let latest=null;
  let latestTime=-Infinity;
  for(let idx=0;idx<localItems.length;idx++){
    const item=localItems[idx];
    if(!item) continue;
    const normalized={...item,_type:"Protokol",_collection:"localProtocols",_id:item._id || `local_protocol_${idx}`};
    if(!recordMatchesSite(normalized,site)) continue;
    const time=protocolTimeValue(normalized);
    if(!latest || time>latestTime){
      latest=normalized;
      latestTime=time;
    }
  }
  return latest;
}

function selectedHistoryProtocol(){
  const current=detailHistoryItems[detailHistoryIndex];
  return isProtocolHistoryItem(current) ? current : null;
}

function updateOfficialProtocolSourceInfo(){
  const info=officialProtocolSourceInfoNode();
  if(!info) return;
  const selectedProtocol=selectedHistoryProtocol();
  const protocol=selectedProtocol || latestDisplayedProtocol() || latestLocalProtocolForSite(selectedSite);
  if(protocol){
    const saved=historySavedDateLabel(protocol);
    const checked=historyDateLabel(protocol);
    setTextIfChanged(info,[
      selectedProtocol ? "Použije se právě zobrazený protokol" : "Použije se poslední uložený protokol",
      saved ? `uložený ${saved}` : "",
      checked ? `(kontrola ${checked})` : ""
    ].filter(Boolean).join(" ") + ".");
  }else{
    setTextIfChanged(info,"Použije se poslední uložený protokol. Pokud tu ještě není, nejdřív ulož protokol kontroly.");
  }
}

function resetOfficialProtocolSection(site=selectedSite){
  fillOfficialProtocolInputs(site);
  const box=officialProtocolDataBoxNode();
  const status=officialProtocolStatusNode();
  setDisplayIfChanged(box,"none");
  setTextIfChanged(status,"");
  updateOfficialProtocolSourceInfo();
}

async function saveOfficialProtocolData(options={}){
  const status=officialProtocolStatusNode();
  if(!selectedSite){
    setTextIfChanged(status,"Není vybrané místo.");
    return null;
  }
  const data=officialProtocolInputData();
  if(!safe(data.operator) || !safe(data.objectAddress)){
    const box=officialProtocolDataBoxNode();
    setDisplayIfChanged(box,"grid");
    setTextIfChanged(status,"Nejdřív ručně vyplň bod a) Provozovatel PBZ a bod b) Adresa objektu. Bod b) se nepřebírá z protokolu ani z detailu.");
    return null;
  }
  writeSiteLocalObject("officialProtocolData",data,selectedSite);
  selectedSite.firebaseData={...(selectedSite.firebaseData || {}),officialProtocolData:data};
  let savedToFirebase=false;
  let signedUser=null;
  const docId=selectedSiteDocId(selectedSite);
  if(docId && firebaseReady && db && fb.fsMod){
    signedUser=await waitForFirebaseUser(1200);
    if(signedUser){
      try{
        const {doc,setDoc,serverTimestamp}=fb.fsMod;
        await setDoc(doc(db,"sitesUnified",docId),{
          officialProtocolData:data,
          updatedAt:serverTimestamp ? serverTimestamp() : data.updatedAt,
          updatedBy:currentUser?.email || ""
        },{merge:true});
        savedToFirebase=true;
      }catch(e){
        console.warn("Uložení dat provozovatele selhalo",e);
        if(!options.silent) setTextIfChanged(status,`Data provozovatele jsou uložená jen lokálně: ${e.message}`);
      }
    }
  }
  const siblingCount=await propagateOfficialProtocolDataToSiblingSources(data,selectedSite,signedUser);
  if(!options.silent){
    const siblingText=siblingCount ? ` Data propsána i do dalších zdrojů na stejném místě: ${siblingCount}.` : "";
    setTextIfChanged(status,(savedToFirebase ? "Data provozovatele uložena." : "Data provozovatele uložena lokálně.") + siblingText);
    showSaveConfirmation(siblingCount ? "Data provozovatele uložena pro celé místo." : "Data provozovatele uložena.");
  }
  return data;
}

async function protocolForOfficialDocument(){
  const visible=selectedHistoryProtocol() || latestDisplayedProtocol();
  if(visible) return visible;
  const local=latestLocalProtocolForSite(selectedSite);
  if(local) return local;
  if(!firebaseReady || !db) return null;
  try{
    const last=await getLastProtocol(selectedSite);
    return last || null;
  }catch(e){
    console.warn("Poslední protokol pro doklad se nepodařilo načíst",e);
    return null;
  }
}

function officialProtocolResultText(mode){
  return mode==="stop" ? "--- STOP STAV ---" : "--bez závad--";
}

function officialProtocolFunctionalText(mode){
  return mode==="stop" ? "--- ZAŘÍZENÍ NENÍ PROVOZUSCHOPNÉ ---" : "--zařízení je provozuschopné--";
}

function officialProtocolConditionsValue(protocol={},mode="ok"){
  if(typeof protocol.conditions==="boolean") return protocol.conditions ? "ano" : "ne";
  const normalized=simpleNorm(protocol.conditions);
  if(normalized){
    if(normalized==="ne" || normalized==="no" || normalized==="false" || normalized==="0" || normalized.includes("nevyhov")) return "ne";
    if(normalized==="ano" || normalized==="yes" || normalized==="true" || normalized==="1" || normalized==="ok" || normalized.includes("vyhov")) return "ano";
  }
  return mode==="stop" ? "ne" : "ano";
}

function officialProtocolConditionsText(protocol={},mode="ok"){
  return `-- ${officialProtocolConditionsValue(protocol,mode)} --${officialProtocolConditionsReasonText(protocol)}`;
}

function officialProtocolConditionsReasonText(protocol={}){
  const reason=officialOneLine(protocol.conditionsReason || protocol.environmentReason || protocol.reason || "",90);
  return reason ? ` Důvod: ${reason}` : "";
}

function officialProtocolNextDate(protocol={},site=selectedSite){
  const explicit=protocol.nextDate || protocol.nextCheck || site?.pristi || first(site?.raw || {},NEXT_CHECK_KEYS);
  const explicitDate=parseDateValue(explicit);
  if(explicitDate) return formatDateCz(explicitDate);
  const control=parseDateValue(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  if(!control) return "";
  const p=simpleNorm(protocol.period);
  const months=p.includes("12") ? 12 : (p.includes("6") ? 6 : periodMonths(site));
  return formatDateCz(addMonths(control,months));
}

function officialProtocolRemedyMonth(protocol={}){
  const control=parseDateValue(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  if(!control) return "";
  const remedy=addMonths(control,2);
  const month=String(remedy.getMonth()+1).padStart(2,"0");
  return `${month}/${remedy.getFullYear()}`;
}

function officialProtocolDeviceLine(protocol={},site=selectedSite){
  const device=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || protocolDeviceTypeFromSite(site);
  const serial=protocol.serial || protocolSerialFromSite(site);
  const seal=protocol.seal || "";
  return [device,serial,seal].map(safe).filter(Boolean).join(", ");
}

function officialProtocolCustomerNote(protocol={},officialData={}){
  return safe(protocol.customerNote || protocol.noteForCustomer || protocol.customerProtocolNote || officialData.note || "");
}

function officialMeasurementLineText(label,value,unit){
  const measured=unit==="RAW" ? officialOneLine(value) : officialMeasurementValue(value,unit);
  let suffix="";
  if(measured){
    if(unit==="VAC") suffix=" VAC";
    if(unit==="VDC") suffix=" VDC";
    if(unit==="TEMP" && /^[-+]?\d/.test(measured)) suffix=" °C";
  }
  return `${label} –${measured ? ` ${measured}${suffix}` : ""}`;
}

function officialOptionalMeasurementLineText(label,value,unit){
  const measured=unit==="RAW" ? officialOneLine(value) : officialMeasurementValue(value,unit);
  return measured ? officialMeasurementLineText(label,value,unit) : "";
}

function officialMeasurementPairValue(firstValue,secondValue,unit){
  const first=officialMeasurementValue(firstValue,unit);
  const second=officialMeasurementValue(secondValue,unit);
  if(first && second) return `1: ${first}   2: ${second}`;
  return first || second;
}

function officialProtocolMeasurementColumns(protocol={}){
  const unbalance=officialCombinedMeasurement(protocol.unbalance1,protocol.unbalance2);
  const output1=officialMeasurementLineText("Výstup 1",protocol.output1Vac,"VAC");
  const backup1=officialMeasurementLineText("Výstup při záloze 1",protocol.backup1Vac,"VAC");
  return {
    left:[
      officialMeasurementLineText("Vstup",protocol.inputVac,"VAC"),
      output1,
      backup1,
      officialMeasurementLineText("Pomocná baterie",protocol.auxBatVdc,"VDC")
    ],
    right:[
      officialOptionalMeasurementLineText("Výstup 2",protocol.output2Vac,"VAC"),
      officialOptionalMeasurementLineText("Výstup při záloze 2",protocol.backup2Vac,"VAC"),
      officialMeasurementLineText("Hlavní baterie",protocol.mainBatVdc,"VDC"),
      officialMeasurementLineText("Rozvážení baterií",unbalance,"VDC"),
      officialMeasurementLineText("Teplota v okolí",protocol.temperature,"TEMP")
    ].filter(line=>safe(line).trim())
  };
}

function officialProtocolMeasurementNotesXml(protocol={},extraNote="",after=80){
  const columns=officialProtocolMeasurementColumns(protocol);
  const columnXml=lines=>lines.filter(line=>safe(line).trim()).map(line=>wordParagraph(line,{size:22,after:0})).join("");
  const notes=[];
  if(safe(protocol.notes || protocol.issues)) notes.push(`Poznámka z protokolu – ${safe(protocol.notes || protocol.issues)}`);
  if(safe(extraNote)) notes.push(`Poznámka do dokladu – ${safe(extraNote)}`);
  const notesXml=notes.map(text=>wordParagraph(text,{size:22,after:0})).join("");
  return wordTable([[
    {xml:columnXml(columns.left),vAlign:"top"},
    {xml:columnXml(columns.right),vAlign:"top"}
  ]],[4815,4815],{noBorders:true}) + (notesXml ? wordBlank(10) + notesXml : "") + wordBlank(after);
}

function officialManufacturerText(officialData={}){
  if(officialData.manufacturerKey) return officialManufacturerTextByKey(officialData.manufacturerKey);
  const text=protocolExportValue(officialData.manufacturer).trim();
  if(!text) return OFFICIAL_DEFAULT_MANUFACTURER_TEXT;
  const normalized=simpleNorm(text);
  if(normalized.includes("servis zaloznich zdroju") && normalized.includes("118823")){
    return text
      .replace(/,\s*C\s*118823\/KSBR\s*Krajský\s+soud\s+v\s+Brně/i,"\nC 118823/KSBR Krajský soud v Brně")
      .replace(/\n\s*C\s*118823\/KSBR\s*Krajský\s+soud\s+v\s+Brně/i,"\nC 118823/KSBR Krajský soud v Brně");
  }
  if(normalized.includes("servis zaloznich zdroju") && normalized.includes("09391126") && !normalized.includes("118823")){
    const lines=text.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split("\n");
    const lineIndex=lines.findIndex(line=>/I[ČC]O|I[ČC]|ICO/i.test(line));
    if(lineIndex>=0){
      lines[lineIndex]=lines[lineIndex].replace(/\s+$/,"");
      lines.splice(lineIndex+1,0,"C 118823/KSBR Krajský soud v Brně");
      return lines.join("\n");
    }
    return OFFICIAL_DEFAULT_MANUFACTURER_TEXT;
  }
  return text;
}

function officialRtfMeasurementTextLine(text){
  return `{\\rtlch\\fcs1 \\af0\\afs24 \\ltrch\\fcs0 \\fs24 ${officialRtfEscape(text)}\\par }`;
}

function officialRtfCompactMeasurements(protocol={}){
  const columns=officialProtocolMeasurementColumns(protocol);
  const leftRows=columns.left.map(officialRtfMeasurementTextLine).join("");
  const rightRows=columns.right.map(officialRtfMeasurementTextLine).join("");
  return `{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\sect }\\sectd \\ltrsect\\sbknone\\linex0\\headery708\\footery708\\cols2\\colsx2\\endnhere\\sectdefaultcl \\pard\\plain \\ltrpar\\ql \\li0\\ri0\\sb0\\sa0\\sl260\\slmult1\\nowidctlpar\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 \\rtlch\\fcs1 \\af24\\afs24\\alang1081 \\ltrch\\fcs0 \\fs24\\lang1029\\langfe2052\\kerning3\\cgrid\\langnp1029\\langfenp2052 ${leftRows}\\column ${rightRows}`;
}

function compactOfficialRtfMeasurementSection(output,protocol={}){
  const compact=`${officialRtfCompactMeasurements(protocol)}{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\sect }`;
  const patterns=[
    /\{\\rtlch\\fcs1 [^{}]*?\\sect \}\\sectd \\ltrsect\\sbknone\\linex0\\headery708\\footery708\\cols2\\colsx2[\s\S]*?Pomocn\\'e1 baterie \\endash[\s\S]*?\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\insrsid3878691\\charrsid536511 \\sect \}/,
    /\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 [^{}]*Vstup \\endash[\s\S]*?Pomocn\\'e1 baterie \\endash[\s\S]*?\{\\rtlch\\fcs1 \\af0 \\ltrch\\fcs0 \\insrsid3878691\\charrsid536511 \\sect \}/
  ];
  for(const pattern of patterns){
    if(pattern.test(output)) return output.replace(pattern,compact);
  }
  return output;
}

function officialBlockXml(label,value){
  return wordParagraph(label,{bold:true,size:20,after:35}) + wordParagraph(value || " ",{size:20,after:0});
}

function officialTwoColumnXml(leftLabel,leftValue,rightLabel,rightValue,options={}){
  const after=Number.isFinite(options.after) ? options.after : 25;
  return wordTable([[
    {xml:officialBlockXml(leftLabel,leftValue),vAlign:"top"},
    {xml:officialBlockXml(rightLabel,rightValue),vAlign:"top"}
  ]],[4815,4815],{noBorders:true}) + wordBlank(after);
}

function officialInlineParagraph(label,value){
  return wordParagraphXml(wordRun(label,{bold:true,size:20}) + wordRun(value || " ",{size:20}),{after:45});
}

function buildOfficialProtocolWordDocumentXml(protocol={},officialData={},mode="ok"){
  const site=selectedSite || {};
  const operator=officialOperatorText(officialData.operator);
  const objectAddress=safe(officialData.objectAddress);
  const place=protocol.pbzLocation || protocolSourceLocationFromSite(site) || "";
  const controlDate=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  const nextDate=officialProtocolNextDate(protocol,site);
  const controlSubject=OFFICIAL_CONTROL_SUBJECT_TEXT;
  const manufacturer=officialManufacturerText(officialData);
  const tech="Ing. Michal Tipek";
  const blocks=[
    wordParagraph("Doklad o servisní kontrole a zkoušce provozuschopnosti PBZ",{align:"center",bold:true,size:26,after:30}),
    wordParagraph("dle zákona č. 133/1985 a vyhlášky 246/2001 Sb.",{align:"center",size:20,after:20}),
    wordParagraph("Doklad byl sestaven dle vyhl. 246/2001 Sb. §7, odst.8, písm. a – f.",{align:"center",size:20,after:120}),
    officialTwoColumnXml("a) Provozovatel PBZ:",operator,"b) Adresa objektu kde je PBZ umístěno:",objectAddress,{after:0}),
    officialInlineParagraph("c) Umístění PBZ: ",place),
    officialInlineParagraph("d) Typ záložního zdroje, Výrobní číslo, plomba: ",officialProtocolDeviceLine(protocol,site)),
    officialTwoColumnXml("e) Kontrolní subjekt:",controlSubject,"f) Výrobce PBZ:",manufacturer,{after:70}),
    officialInlineParagraph("g) Výsledek kontroly provozuschopnosti: ",officialProtocolResultText(mode)),
    officialInlineParagraph("h) Výsledek funkčních zkoušek: ",officialProtocolFunctionalText(mode)),
    officialInlineParagraph("i) Datum provedení kontroly: ",controlDate),
    officialInlineParagraph("j) Datum příští kontroly do: ",nextDate),
    wordParagraph("k) Potvrzení kontrolního subjektu:",{bold:true,size:20,after:45}),
    wordParagraph("Potvrzujeme, že jsme provedli funkční zkoušku a kontrolu provozuschopnosti výše uvedeného zařízení v souladu s platnými právními předpisy §6 a §7 vyhlášky MV246/2001 Sb., normativními požadavky, dokumentací a technickými podmínkami výrobce.",{size:20,after:70}),
    officialInlineParagraph("l) Zařízení pracuje ve vyhovujících podmínkách: ",officialProtocolConditionsText(protocol,mode)),
    wordParagraph("Poznámky:",{bold:true,size:20,after:35}),
    officialProtocolMeasurementNotesXml(protocol,officialProtocolCustomerNote(protocol,officialData),25),
    wordBlank(180),
    wordTable([
      [
        {text:"______________________________________",size:18,align:"center"},
        {xml:wordClientSignatureCellXml(protocol,{compact:true}) + wordParagraph("______________________________________",{size:18,align:"center"})}
      ],
      [
        {text:`Servis záložních zdrojů s.r.o. – ${tech}`,size:18,align:"center"},
        {text:"převzal za objednavatele",size:18,align:"center"}
      ]
    ],[4815,4815],{noBorders:true})
  ];
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:wp14="http://schemas.microsoft.com/office/word/2010/wordprocessingDrawing" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:w10="urn:schemas-microsoft-com:office:word" xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml" xmlns:wpg="http://schemas.microsoft.com/office/word/2010/wordprocessingGroup" xmlns:wpi="http://schemas.microsoft.com/office/word/2010/wordprocessingInk" xmlns:wne="http://schemas.microsoft.com/office/word/2006/wordml" xmlns:wps="http://schemas.microsoft.com/office/word/2010/wordprocessingShape" mc:Ignorable="w14 wp14">
<w:body>${blocks.join("")}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="700" w:right="850" w:bottom="700" w:left="850" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>`;
}

function buildOfficialProtocolWordEntries(protocol={},officialData={},mode="ok"){
  const now=new Date().toISOString();
  const title=`Doklad provozuschopnosti ${protocol.siteName || protocol.place || selectedSite?.adresa || ""}`.trim();
  const signatureBytes=protocolSignatureImageBytes(protocol);
  const imageContentType=signatureBytes ? '<Default Extension="png" ContentType="image/png"/>' : "";
  const imageRel=signatureBytes ? '<Relationship Id="rIdSignature" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/client-signature.png"/>' : "";
  const entries=[
    {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>${imageContentType}<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/settings.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`},
    {name:"_rels/.rels",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'},
    {name:"word/_rels/document.xml.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>${imageRel}</Relationships>`},
    {name:"word/document.xml",data:buildOfficialProtocolWordDocumentXml(protocol,officialData,mode)},
    {name:"word/styles.xml",data:buildProtocolWordStylesXml()},
    {name:"word/settings.xml",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:zoom w:percent="100"/><w:defaultTabStop w:val="708"/><w:compat/></w:settings>'},
    {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${wordXmlEscape(title)}</dc:title><dc:creator>${wordXmlEscape(protocol.createdBy || protocol.technicianEmail || currentUser?.email || "")}</dc:creator><cp:lastModifiedBy>${wordXmlEscape(currentUser?.email || "")}</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`},
    {name:"docProps/app.xml",data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Servis záložních zdrojů - mapa FZ</Application></Properties>'}
  ];
  if(signatureBytes) entries.push({name:"word/media/client-signature.png",data:signatureBytes});
  return entries;
}

const OFFICIAL_RTF_TEMPLATE_URL="official-template.rtf";
const OFFICIAL_STOP_RTF_TEMPLATE_URL="official-stop-template.rtf";
const OFFICIAL_TIPEK_SIGNATURE_URL="./podpis-tipek.png";
const OFFICIAL_WATERMARK_LOGO_URL="./szz-logo-display.png";
const officialRtfTemplateCache={};
let officialTipekSignatureBytesCache=null;
let officialWatermarkLogoBytesCache=null;

async function loadOfficialRtfTemplate(mode="ok"){
  const key=mode==="stop" ? "stop" : "ok";
  if(officialRtfTemplateCache[key]) return officialRtfTemplateCache[key];
  const url=key==="stop" ? OFFICIAL_STOP_RTF_TEMPLATE_URL : OFFICIAL_RTF_TEMPLATE_URL;
  const response=await fetch(url,{cache:"no-store"});
  if(!response.ok) throw new Error(`Šablonu ${url} se nepodařilo načíst (${response.status}).`);
  const template=await response.text();
  if(!template.includes("__SZZ_OPERATOR_1__")) throw new Error("Šablona dokladu nemá připravená vyplňovací pole.");
  officialRtfTemplateCache[key]=template;
  return template;
}

async function loadOfficialTipekSignatureBytes(){
  if(officialTipekSignatureBytesCache) return officialTipekSignatureBytesCache;
  try{
    const response=await fetch(OFFICIAL_TIPEK_SIGNATURE_URL,{cache:"force-cache"});
    if(!response.ok) throw new Error(`Podpis se nepodařilo načíst (${response.status}).`);
    officialTipekSignatureBytesCache=new Uint8Array(await response.arrayBuffer());
    return officialTipekSignatureBytesCache;
  }catch(e){
    console.warn("Podpis Ing. Tipek se nepodařilo načíst",e);
    return null;
  }
}

async function loadOfficialWatermarkLogoBytes(){
  if(officialWatermarkLogoBytesCache) return officialWatermarkLogoBytesCache;
  try{
    const response=await fetch(OFFICIAL_WATERMARK_LOGO_URL,{cache:"force-cache"});
    if(!response.ok) throw new Error(`Logo se nepodařilo načíst (${response.status}).`);
    officialWatermarkLogoBytesCache=new Uint8Array(await response.arrayBuffer());
    return officialWatermarkLogoBytesCache;
  }catch(e){
    console.warn("Logo pro vodoznak dokladu se nepodařilo načíst",e);
    return null;
  }
}

function officialOneLine(value,maxLength=0){
  const text=protocolExportValue(value).replace(/\u00a0/g," ").replace(/\s+/g," ").trim();
  if(!maxLength || text.length<=maxLength) return text;
  return `${text.slice(0,Math.max(0,maxLength-3)).trim()}...`;
}

function officialMultiline(value,maxLines=4){
  const lines=protocolExportValue(value)
    .replace(/\u00a0/g," ")
    .replace(/\r\n/g,"\n")
    .replace(/\r/g,"\n")
    .split("\n")
    .map(line=>officialOneLine(line))
    .filter(Boolean);
  if(maxLines>1 && lines.length>maxLines){
    const head=lines.slice(0,maxLines-1);
    const tail=lines.slice(maxLines-1).join(", ");
    return head.concat([officialOneLine(tail)]).slice(0,maxLines);
  }
  while(lines.length<maxLines) lines.push("");
  return lines.slice(0,maxLines);
}

function officialOperatorLines(value,maxLines=4){
  return officialMultiline(value,maxLines);
}

function officialOperatorText(value){
  return officialOperatorLines(value,5).filter(Boolean).join("\n");
}

function officialIcoValue(value){
  return officialOneLine(value).replace(/^(i[čc]o|i[čc]|ico)\s*[:：]?\s*/i,"");
}

function officialMeasurementValue(value,unit){
  let text=officialOneLine(value);
  if(!text) return "";
  if(unit==="VAC") text=text.replace(/\s*VAC\.?\s*$/i,"");
  if(unit==="VDC") text=text.replace(/\s*VDC\.?\s*$/i,"");
  if(unit==="TEMP") text=text.replace(/\s*(°C|C)\s*$/i,"");
  return text.trim();
}

function officialCombinedMeasurement(...values){
  return values.map(value=>officialMeasurementValue(value,"VDC")).filter(Boolean).join(" / ");
}

function officialRtfEscape(value){
  const text=protocolExportValue(value);
  let out="";
  for(const ch of text){
    if(ch==="\n"){
      out+="\\line ";
      continue;
    }
    if(ch==="\\") out+="\\\\";
    else if(ch==="{") out+="\\{";
    else if(ch==="}") out+="\\}";
    else{
      const code=ch.codePointAt(0);
      if(code===160) out+="\\~";
      else if(code<128) out+=ch;
      else out+=`\\u${code>32767 ? code-65536 : code}?`;
    }
  }
  return out;
}

function officialRtfRun(text,{bold=false,underline=false}={}){
  const styles=[
    "\\rtlch\\fcs1",
    bold ? "\\ab" : "",
    "\\af0\\afs22",
    "\\ltrch\\fcs0",
    bold ? "\\b" : "",
    "\\fs22",
    underline ? "\\ul" : ""
  ].filter(Boolean).join(" ");
  return `{${styles} ${officialRtfEscape(text)}}`;
}

function officialRtfSubjectBlock(officialData={}){
  const left=officialMultiline(OFFICIAL_CONTROL_SUBJECT_TEXT,5);
  const right=officialMultiline(officialManufacturerText(officialData),5);
  const paragraph="\\pard \\ltrpar\\ql \\li0\\ri0\\sl250\\slmult1\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 ";
  const heading=`${paragraph}${officialRtfRun("e) Kontrolní subjekt:",{bold:true,underline:true})}\\tab ${officialRtfRun("f) Výrobce PBZ:",{bold:true,underline:true})}\\par`;
  const rows=left.map((line,idx)=>`${paragraph}${officialRtfRun(line || " ")}\\tab ${officialRtfRun(right[idx] || " ")}\\par`).join("\n");
  const blank=`${paragraph}${officialRtfRun(" ")}\\tab ${officialRtfRun(" ")}\\par`;
  return `${heading}\n${blank}\n${rows}\n${blank}\n`;
}

function officialRtfOperatorObjectBlock(officialData={}){
  const left=officialOperatorLines(officialData.operator,5).filter(Boolean);
  const right=officialMultiline(officialData.objectAddress,5).filter(Boolean);
  const rowCount=Math.max(left.length,right.length,1);
  const paragraph="\\pard \\ltrpar\\ql \\li0\\ri0\\sl250\\slmult1\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 ";
  const heading=`${paragraph}${officialRtfRun("a) Provozovatel PBZ:",{bold:true,underline:true})}\\tab ${officialRtfRun("b) Adresa objektu kde je PBZ umístěno:",{bold:true,underline:true})}\\par`;
  const rows=Array.from({length:rowCount},(_,idx)=>`${paragraph}${officialRtfRun(left[idx] || " ")}\\tab ${officialRtfRun(right[idx] || " ")}\\par`).join("\n");
  const blank=`${paragraph}${officialRtfRun(" ")}\\tab ${officialRtfRun(" ")}\\par`;
  return `${heading}\n${blank}\n${rows}\n`;
}

function replaceOfficialRtfOperatorObjectBlock(output,officialData={}){
  const operatorLabel="Provozovatel PBZ:";
  const locationLabel="Um\\'edst\\'ecn\\'ed PBZ:";
  const labelIndex=output.indexOf(operatorLabel);
  const locationIndex=output.indexOf(locationLabel,labelIndex);
  if(labelIndex<0 || locationIndex<0) return output;
  const aMarker=output.lastIndexOf(" a)}",labelIndex);
  const start=aMarker>=0 ? output.lastIndexOf("{\\rtlch",aMarker) : output.lastIndexOf("{\\rtlch",labelIndex);
  const end=output.lastIndexOf("\\pard\\plain",locationIndex);
  if(start<0 || end<0 || end<=start) return output;
  return `${output.slice(0,start)}${officialRtfOperatorObjectBlock(officialData)}${output.slice(end)}`;
}

function replaceOfficialRtfSubjectBlock(output,officialData={}){
  const manufacturerLabel="V\\'fdrobce PBZ:";
  const labelIndex=output.indexOf(manufacturerLabel);
  if(labelIndex<0) return output;
  const resultIndex=output.indexOf("{\\*\\bkmkstart _Hlk56757522}",labelIndex);
  const resultStart=output.lastIndexOf("{\\rtlch\\fcs1",resultIndex);
  const start=output.lastIndexOf("\\pard \\ltrpar\\ql \\li0\\ri0\\nowidctlpar\\tx4962",labelIndex);
  if(start<0 || resultStart<0 || resultStart<=start) return output;
  return `${output.slice(0,start)}${officialRtfSubjectBlock(officialData)}${output.slice(resultStart)}`;
}

function rtfVisibleText(segment){
  return safe(segment)
    .replace(/\\'[0-9a-fA-F]{2}/g,"x")
    .replace(/\\[a-zA-Z]+-?\d* ?/g,"")
    .replace(/[{}]/g,"")
    .trim();
}

function removeOfficialRtfBlankBeforeLocation(output){
  const labelIndex=output.indexOf("Um\\'edst\\'ecn\\'ed PBZ:");
  if(labelIndex<0) return output;
  const locationLabelRunStart=output.lastIndexOf("{\\rtlch",labelIndex);
  const locationMarkerRunStart=output.lastIndexOf("{\\rtlch",locationLabelRunStart-1);
  const locationRunStart=locationMarkerRunStart>=0 ? locationMarkerRunStart : locationLabelRunStart;
  const sectionStart=output.lastIndexOf("\\sectdefaultcl",locationRunStart);
  const paragraphStart=output.indexOf("\\pard\\plain",sectionStart);
  const firstRunStart=output.indexOf("{\\rtlch",paragraphStart);
  const blankEnd=output.lastIndexOf("\\par }",locationRunStart);
  if(sectionStart<0 || paragraphStart<0 || firstRunStart<0 || blankEnd<firstRunStart) return output;
  const blankParagraph=output.slice(firstRunStart,blankEnd+"\\par }".length);
  if(blankParagraph.length>1800 || rtfVisibleText(blankParagraph)) return output;
  const paragraphPrefix=output.slice(paragraphStart,firstRunStart);
  return `${output.slice(0,paragraphStart)}${paragraphPrefix}${output.slice(locationRunStart)}`;
}

function removeOfficialSpacerRunBeforeMarker(block,marker){
  const idx=block.indexOf(marker);
  if(idx<0) return block;
  const before=block.slice(0,idx);
  const after=block.slice(idx);
  const cleaned=before.replace(/(\{\\rtlch\\fcs1[^{}]*(?:I\\'c8O:\s*|\s+)\})\s*(\{\\rtlch\\fcs1[^{}]*\s*)$/,"$2");
  return `${cleaned}${after}`;
}

function normalizeOfficialRtfOperatorBlock(output){
  const first=output.indexOf("__SZZ_OPERATOR_1__");
  const object=output.indexOf("__SZZ_OBJECT_1__",first);
  if(first<0 || object<0) return output;
  const start=output.lastIndexOf("\\pard\\plain",first);
  const blockStart=start>=0 ? start : first;
  let block=output.slice(blockStart,object);
  block=block.replace(/\\li142/g,"\\li0").replace(/\\lin142/g,"\\lin0");
  [
    "__SZZ_OPERATOR_1__",
    "__SZZ_OPERATOR_2__",
    "__SZZ_OPERATOR_3__",
    "__SZZ_OPERATOR_4__"
  ].forEach(marker=>{
    block=removeOfficialSpacerRunBeforeMarker(block,marker);
  });
  return `${output.slice(0,blockStart)}${block}${output.slice(object)}`;
}

function shrinkOfficialRtfTextSize(output){
  return output.replace(/\\(a?fs)(\d+)/g,(match,prefix,sizeText)=>{
    const size=Number(sizeText);
    if(!Number.isFinite(size) || size<=10) return match;
    return `\\${prefix}${Math.max(10,size-2)}`;
  });
}

function bytesToHex(bytes){
  return Array.from(bytes || [],byte=>byte.toString(16).padStart(2,"0")).join("");
}

function szzLogoDataUrl(){
  const logo=document.querySelector("[data-szz-logo-copy]") || document.querySelector(".logo-img");
  return safe(logo?.getAttribute("src") || logo?.src || "");
}

function dataUrlImageBytes(dataUrl){
  const match=safe(dataUrl).match(/^data:image\/(?:png|jpe?g);base64,(.+)$/i);
  if(!match) return null;
  try{return base64ToBytes(match[1]);}catch(e){return null;}
}

function pngImageSize(bytes){
  if(!bytes || bytes.length<24) return null;
  const signature=[137,80,78,71,13,10,26,10];
  for(let i=0;i<signature.length;i++){
    if(bytes[i]!==signature[i]) return null;
  }
  const width=(((bytes[16]<<24)>>>0) + (bytes[17]<<16) + (bytes[18]<<8) + bytes[19])>>>0;
  const height=(((bytes[20]<<24)>>>0) + (bytes[21]<<16) + (bytes[22]<<8) + bytes[23])>>>0;
  if(!width || !height) return null;
  return {width,height};
}

function jpegImageSize(bytes){
  if(!bytes || bytes.length<4 || bytes[0]!==0xff || bytes[1]!==0xd8) return null;
  let offset=2;
  while(offset+9<bytes.length){
    if(bytes[offset]!==0xff){
      offset++;
      continue;
    }
    const marker=bytes[offset+1];
    const length=(bytes[offset+2]<<8) + bytes[offset+3];
    if(!length || offset+length>=bytes.length) break;
    if((marker>=0xc0 && marker<=0xc3) || (marker>=0xc5 && marker<=0xc7) || (marker>=0xc9 && marker<=0xcb) || (marker>=0xcd && marker<=0xcf)){
      const height=(bytes[offset+5]<<8) + bytes[offset+6];
      const width=(bytes[offset+7]<<8) + bytes[offset+8];
      if(width && height) return {width,height};
      return null;
    }
    offset+=2+length;
  }
  return null;
}

function officialRtfWatermarkGeometry(bytes){
  const size=pngImageSize(bytes) || jpegImageSize(bytes) || {width:998,height:495};
  const maxGoalWidth=9000;
  const maxGoalHeight=4465;
  const scale=Math.min(maxGoalWidth/size.width,maxGoalHeight/size.height);
  const picwgoal=Math.max(1,Math.round(size.width*scale));
  const pichgoal=Math.max(1,Math.round(size.height*scale));
  const shpleft=Math.round(900+(maxGoalWidth-picwgoal)/2);
  const shptop=Math.round(4300+(maxGoalHeight-pichgoal)/2);
  return {
    picw:size.width,
    pich:size.height,
    picwgoal,
    pichgoal,
    shpleft,
    shptop,
    shpright:shpleft+picwgoal,
    shpbottom:shptop+pichgoal
  };
}

function officialRtfWatermark(officialData={}){
  const bytes=officialData.watermarkLogoBytes || dataUrlImageBytes(szzLogoDataUrl());
  if(!bytes) return "";
  const hex=bytesToHex(bytes);
  const g=officialRtfWatermarkGeometry(bytes);
  const blip=(bytes[0]===0xff && bytes[1]===0xd8) ? "\\jpegblip" : "\\pngblip";
  return `{\\shp{\\*\\shpinst\\shpleft${g.shpleft}\\shptop${g.shptop}\\shpright${g.shpright}\\shpbottom${g.shpbottom}\\shpfhdr1\\shpbxcolumn\\shpbxignore\\shpbypara\\shpbyignore\\shpwr3\\shpwrk0\\shpfblwtxt1\\shpz2\\shplid20260728{\\sp{\\sn shapeType}{\\sv 75}}{\\sp{\\sn fLockAspectRatio}{\\sv 1}}{\\sp{\\sn fFlipH}{\\sv 0}}{\\sp{\\sn fFlipV}{\\sv 0}}{\\sp{\\sn pib}{\\sv {\\pict\\piccropl0\\piccropr0\\piccropt0\\piccropb0\\picw${g.picw}\\pich${g.pich}\\picwgoal${g.picwgoal}\\pichgoal${g.pichgoal}${blip} ${hex}}}}{\\sp{\\sn pibFlags}{\\sv 2}}{\\sp{\\sn pictureContrast}{\\sv 19661}}{\\sp{\\sn pictureBrightness}{\\sv 22938}}{\\sp{\\sn fLine}{\\sv 0}}{\\sp{\\sn wzName}{\\sv WordPictureWatermarkSZZ}}{\\sp{\\sn posh}{\\sv 2}}{\\sp{\\sn posrelh}{\\sv 0}}{\\sp{\\sn posv}{\\sv 2}}{\\sp{\\sn posrelv}{\\sv 0}}{\\sp{\\sn dhgt}{\\sv 251660288}}{\\sp{\\sn fLayoutInCell}{\\sv 0}}{\\sp{\\sn fBehindDocument}{\\sv 1}}}}{\\shprslt\\par\\pard\\ql \\li0\\ri0\\widctlpar\\phmrg\\posxc\\posyc\\dxfrtext180\\dfrmtxtx180\\dfrmtxty0\\wraparound\\aspalpha\\aspnum\\faauto\\adjustright\\rin0\\lin0\\itap0}\\par `;
}

function addOfficialRtfWatermark(output,officialData={}){
  if(output.includes("WordPictureWatermarkSZZ")) return output;
  const watermark=officialRtfWatermark(officialData);
  if(!watermark) return output;
  const shapeIndex=output.indexOf("{\\shp{\\*\\shpinst");
  if(shapeIndex<0) return output;
  return `${output.slice(0,shapeIndex)}${watermark}${output.slice(shapeIndex)}`;
}

function officialRtfSignatureImage(protocol={}){
  const bytes=protocolSignatureImageBytes(protocol);
  if(!bytes) return "";
  return `{\\pict\\pngblip\\picw900\\pich260\\picwgoal3800\\pichgoal1100 ${bytesToHex(bytes)}}`;
}

function officialRtfTipekSignatureImage(officialData={}){
  const bytes=officialData.tipekSignatureBytes;
  if(!bytes) return "";
  return `{\\pict\\pngblip\\picw865\\pich666\\picwgoal2850\\pichgoal2195 ${bytesToHex(bytes)}}`;
}

function officialRtfClientSignatureContent(protocol={}){
  const name=officialOneLine(protocol.clientSign || protocol.customer || "",80);
  const signature=officialRtfSignatureImage(protocol);
  const parts=[];
  if(name) parts.push(`{\\fs18 ${officialRtfEscape(name)}}`);
  if(signature) parts.push(signature);
  return parts.join(" ");
}

function officialRtfSignatureRow(protocol={},officialData={}){
  const left=officialRtfTipekSignatureImage(officialData);
  const right=officialRtfClientSignatureContent(protocol);
  if(!left && !right) return "";
  const leftCell=left || "{\\fs18 \\~}";
  const rightCell=right || "{\\fs18 \\~}";
  return `{\\pard \\ltrpar\\ql \\li0\\ri0\\sb0\\sa0\\sl0\\slmult0\\nowidctlpar\\tx4962\\wrapdefault\\hyphpar0\\aspalpha\\faroman\\adjustright\\rin0\\lin0\\itap0 {\\*\\szztipeksignature PodpisTipekSZZ}{\\rtlch\\fcs1 \\af0\\afs18 \\ltrch\\fcs0 \\fs18 ${leftCell}\\tab ${rightCell}}\\par }`;
}

function addOfficialRtfSignatures(output,protocol={},officialData={}){
  const block=officialRtfSignatureRow(protocol,officialData);
  if(!block || output.includes("PodpisTipekSZZ")) return output;
  const marker=/(\{\\\*\\bkmkstart _Hlk178752668\})______________________________________/;
  if(marker.test(output)){
    return output.replace(marker,`$1${block}______________________________________`);
  }
  return output.replace("______________________________________        ______________________________________",`${block}______________________________________        ______________________________________`);
}

function compactOfficialRtfEmptyNoteBeforeSignatures(output,officialData={}){
  return output.replace(/\\par\s*\\par\s*(\}\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\fs22\\insrsid3356663\\charrsid9718217 \{\\\*\\bkmkstart _Hlk178752668\})/,"\\par $1");
}

function officialRtfHighlightedNoteRun(text,{bold=false,underline=false}={}){
  const rtlBold=bold ? "\\ab" : "";
  const ltrBold=bold ? "\\b" : "";
  const underlineStyle=underline ? "\\ul" : "";
  return `{\\rtlch\\fcs1 ${rtlBold}\\af0\\afs22 \\ltrch\\fcs0 ${ltrBold}\\fs22${underlineStyle}\\highlight7 ${officialRtfEscape(text)}}`;
}

function inlineOfficialRtfNoteHeading(output,officialData={},protocol={}){
  const note=officialOneLine(officialProtocolCustomerNote(protocol,officialData),130);
  if(!note) return output;
  const marker="Pozn\\'e1mky:";
  const idx=output.indexOf(marker);
  if(idx<0) return output;
  const insertion=officialRtfHighlightedNoteRun(` ${note}`);
  return `${output.slice(0,idx+marker.length)}${insertion}${output.slice(idx+marker.length)}`;
}

function removeOfficialRtfOperatorIcoLabel(output){
  const marker="__SZZ_OPERATOR_4__";
  const idx=output.indexOf(marker);
  if(idx<0) return output;
  const label="I\\'c8O:";
  const start=output.lastIndexOf(label,idx);
  if(start>=0 && idx-start<260){
    return `${output.slice(0,start)}     ${output.slice(start+label.length)}`;
  }
  return output;
}

function normalizeOfficialRtfClientLabel(output){
  return output.replace(/p\\'f8\s*evzal za provozovatele/g,"p\\'f8evzal za objednavatele");
}

function officialProtocolConditionsTail(protocol={},mode="ok"){
  return `${officialProtocolConditionsValue(protocol,mode)} --${officialProtocolConditionsReasonText(protocol)}`;
}

function highlightOfficialStopResultLetter(output,mode="ok"){
  if(mode!=="stop") return output;
  return output
    .replace(
      /(\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\b\\fs22)(\\insrsid2818420\\charrsid9718217 \{\\\*\\bkmkstart _Hlk56757522\}g\})/,
      "$1\\highlight7$2"
    )
    .replace(
      /(\{\\rtlch\\fcs1 \\ab\\af0\\afs22 \\ltrch\\fcs0 \\b\\fs22)(\\insrsid7237376\\charrsid9718217 \) \})/,
      "$1\\highlight7$2"
    );
}

function officialProtocolTemplateValues(protocol={},officialData={},mode="ok"){
  const site=selectedSite || {};
  const operator=officialOperatorLines(officialData.operator,5);
  const object=officialMultiline(officialData.objectAddress,4);
  const operatorFourthLine=[operator[3],operator[4]].filter(Boolean).join("\n");
  const controlDate=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  const device=protocol.deviceType || protocol.selectedDevice || protocol.siteSource || protocolDeviceTypeFromSite(site);
  const serial=protocol.serial || protocolSerialFromSite(site);
  const seal=protocol.seal || "";
  const tech="Ing. Michal Tipek";
  return {
    "__SZZ_OPERATOR_1__":operator[0],
    "__SZZ_OPERATOR_2__":operator[1],
    "__SZZ_OPERATOR_3__":operator[2],
    "__SZZ_OPERATOR_4__":operatorFourthLine,
    "__SZZ_OBJECT_1__":object[0],
    "__SZZ_OBJECT_2__":object[1],
    "__SZZ_OBJECT_3__":object[2],
    "__SZZ_OBJECT_4__":object[3],
    "__SZZ_LOCATION__":officialOneLine(protocol.pbzLocation || protocolSourceLocationFromSite(site) || ""),
    "__SZZ_DEVICE__":officialOneLine(device),
    "__SZZ_SERIAL__":officialOneLine(serial || "-"),
    "__SZZ_SEAL__":officialOneLine(seal || "-"),
    "__SZZ_RESULT__":` ${officialProtocolResultText(mode)}`,
    "__SZZ_FUNCTIONAL__":` ${officialProtocolFunctionalText(mode)}`,
    "__SZZ_CONTROL_DATE__":controlDate,
    "__SZZ_NEXT_DATE__":officialProtocolNextDate(protocol,site),
    "__SZZ_REMEDY_DATE__":officialProtocolRemedyMonth(protocol),
    "__SZZ_CONDITIONS__":officialProtocolConditionsTail(protocol,mode),
    "__SZZ_INPUT__":officialMeasurementValue(protocol.inputVac,"VAC"),
    "__SZZ_OUTPUT__":officialMeasurementPairValue(protocol.output1Vac,protocol.output2Vac,"VAC"),
    "__SZZ_BACKUP__":officialMeasurementPairValue(protocol.backup1Vac,protocol.backup2Vac,"VAC"),
    "__SZZ_AUX__":officialMeasurementValue(protocol.auxBatVdc,"VDC"),
    "__SZZ_MAIN__":officialMeasurementValue(protocol.mainBatVdc,"VDC"),
    "__SZZ_UNBALANCE__":officialOneLine(officialCombinedMeasurement(protocol.unbalance1,protocol.unbalance2)),
    "__SZZ_TEMP__":officialMeasurementValue(protocol.temperature,"TEMP"),
    "__SZZ_NOTE__":officialOneLine(officialProtocolCustomerNote(protocol,officialData),130),
    "__SZZ_TECH__":officialOneLine(tech)
  };
}

function fillOfficialRtfTemplate(template,protocol={},officialData={},mode="ok"){
  let output=removeOfficialRtfOperatorIcoLabel(template);
  output=replaceOfficialRtfOperatorObjectBlock(output,officialData);
  output=normalizeOfficialRtfOperatorBlock(output);
  output=replaceOfficialRtfSubjectBlock(output,officialData);
  const values=officialProtocolTemplateValues(protocol,officialData,mode);
  Object.entries(values).forEach(([placeholder,value])=>{
    output=output.replaceAll(placeholder,officialRtfEscape(value));
  });
  output=inlineOfficialRtfNoteHeading(output,officialData,protocol);
  output=highlightOfficialStopResultLetter(output,mode);
  output=compactOfficialRtfEmptyNoteBeforeSignatures(output,officialData);
  output=compactOfficialRtfMeasurementSection(output,protocol);
  output=addOfficialRtfWatermark(output,officialData);
  output=addOfficialRtfSignatures(output,protocol,officialData);
  output=normalizeOfficialRtfClientLabel(output);
  output=shrinkOfficialRtfTextSize(output);
  return output;
}

function protocolWordFileNameJoin(parts,fallback="protokol"){
  const name=parts
    .map(part=>safe(part))
    .filter(Boolean)
    .map(part=>protocolWordFileNamePart(part))
    .filter(Boolean)
    .join("-")
    .replace(/-+/g,"-")
    .replace(/^-+|-+$/g,"");
  return name.slice(0,140) || fallback;
}

function officialProtocolFileDatePart(protocol={}){
  const raw=safe(protocol.date || protocol.checkDate || protocol.createdAt || protocol.savedAt || "");
  const d=parseDateValue(raw);
  if(d){
    const pad=n=>String(n).padStart(2,"0");
    return `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;
  }
  const today=new Date();
  const pad=n=>String(n).padStart(2,"0");
  return `${pad(today.getDate())}-${pad(today.getMonth()+1)}-${today.getFullYear()}`;
}

function officialSourceFileLabel(protocol={},site=selectedSite){
  if(!siteHasMultipleSources(site)) return "";
  const text=safe(
    protocol.deviceType ||
    protocol.selectedDevice ||
    protocol.siteSource ||
    siteSourceLabel(site) ||
    sourceTypeTextFromRaw(site?.raw || {})
  );
  if(!text) return "";
  const power=text.match(/\b\d+(?:[,.]\d+)?\s*(?:kva|va|kw|w)\b/i);
  if(power) return power[0].replace(/\s+/g,"").replace(",",".");
  const larger=text.match(/\b\d{3,}\b/);
  if(larger) return larger[0];
  const any=text.match(/\b\d+(?:[,.]\d+)?\b/);
  return any ? any[0].replace(",",".") : "";
}

function officialProtocolAddressFileName(protocol={},site=selectedSite,mode="ok"){
  const raw=site?.raw || {};
  const address=officialOneLine(
    protocol.siteAddress ||
    protocol.siteName ||
    protocol.place ||
    site?.adresa ||
    pickRawValue(raw,["Adresa / umístění","Adresa_GPS","Umístění"]) ||
    "",
    140
  );
  if(!address) return "";
  const parts=address.split(",").map(part=>part.trim()).filter(Boolean);
  let city="";
  let street="";
  if(parts.length>=2){
    const first=parts[0];
    const second=parts.slice(1).join(", ");
    const firstHasNumber=/\d/.test(first);
    const secondHasNumber=/\d/.test(second);
    if(firstHasNumber && !secondHasNumber){
      street=first;
      city=second;
    }else if(!firstHasNumber && secondHasNumber){
      city=first;
      street=second;
    }else{
      street=first;
      city=second;
    }
  }else{
    street=address;
  }
  return protocolWordFileNameJoin([
    street,
    city,
    officialProtocolFileDatePart(protocol),
    officialSourceFileLabel(protocol,site),
    mode==="stop" ? "STOP STAV" : ""
  ],"doklad");
}

async function preparedOfficialProtocolExport(protocol={},officialData={},mode="ok"){
  const filled={
    ...protocol,
    createdBy:protocol.createdBy || protocol.technicianEmail || currentUser?.email || ""
  };
  const exportOfficialData={
    ...officialData,
    tipekSignatureBytes:officialData.tipekSignatureBytes || await loadOfficialTipekSignatureBytes(),
    watermarkLogoBytes:officialData.watermarkLogoBytes || await loadOfficialWatermarkLogoBytes()
  };
  const prefix=mode==="stop" ? "doklad-stop-stav" : "doklad-provozuschopnosti";
  const fileBase=officialProtocolAddressFileName(filled,selectedSite,mode) || `${prefix}-${officialProtocolFileDatePart(filled)}`;
  const fileName=`${fileBase}.rtf`;
  const template=await loadOfficialRtfTemplate(mode);
  return {
    filled,
    fileName,
    blob:new Blob([fillOfficialRtfTemplate(template,filled,exportOfficialData,mode)],{type:"application/rtf;charset=utf-8"})
  };
}

async function exportOfficialProtocol(mode="ok"){
  const status=officialProtocolStatusNode();
  if(!selectedSite){
    setTextIfChanged(status,"Není vybrané místo.");
    return;
  }
  const noteInput=document.getElementById("officialProtocolNote");
  const noteBefore=noteInput ? noteInput.value : "";
  const data=await saveOfficialProtocolData({silent:true});
  if(data) data.note=noteBefore;
  if(noteInput) noteInput.value=noteBefore;
  if(!safe(data?.operator) || !safe(data?.objectAddress)){
    const box=officialProtocolDataBoxNode();
    setDisplayIfChanged(box,"grid");
    setTextIfChanged(status,"Nejdřív doplň bod a) Provozovatel PBZ a bod b) Adresa objektu.");
    return;
  }
  setTextIfChanged(status,"Připravuji doklad z posledního uloženého protokolu...");
  const protocol=await protocolForOfficialDocument();
  if(!protocol){
    setTextIfChanged(status,"Nenalezl jsem uložený protokol, ze kterého se má doklad doplnit.");
    showSaveConfirmation("Nejdřív ulož protokol kontroly.");
    return;
  }
  let prepared;
  try{
    prepared=await preparedOfficialProtocolExport(protocol,data,mode);
  }catch(e){
    console.warn("Export dokladu z RTF šablony selhal",e);
    setTextIfChanged(status,e.message || "Doklad se nepodařilo připravit.");
    showSaveConfirmation("Doklad se nepodařilo připravit.");
    return;
  }
  downloadBlobFile(prepared.fileName,prepared.blob);
  if(noteInput) noteInput.value=noteBefore;
  setTextIfChanged(status,mode==="stop" ? "Doklad Stop Stav exportován." : "Doklad provozuschopnosti exportován.");
  showSaveConfirmation("Doklad exportován do Wordu.");
}

function validProtocolMailRecipient(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safe(email));
}

function promptProtocolMailRecipient(protocol={}){
  const suggested=safe(protocol.mailRecipient || protocol.customerEmail || protocol.email || "");
  const value=window.prompt("Zadej e-mail, na který se má protokol odeslat:",suggested);
  if(value===null) return "";
  const email=safe(value).toLowerCase();
  if(!email) return "";
  if(!validProtocolMailRecipient(email)){
    alert("Zadaný e-mail nemá platný tvar.");
    return "";
  }
  return email;
}

let protocolWordZipModulePromise=null;
function loadProtocolWordZipModule(){
  if(!protocolWordZipModulePromise) protocolWordZipModulePromise=import("./zip-docx.js");
  return protocolWordZipModulePromise;
}

async function buildProtocolWordBlob(protocol={}){
  const {buildDocxBlob}=await loadProtocolWordZipModule();
  return buildDocxBlob(buildProtocolWordEntries(protocol));
}

function downloadBlobFile(filename,blob){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");
  link.href=url;
  link.download=filename;
  document.body.appendChild(link);
  link.click();
  setTimeout(()=>{
    URL.revokeObjectURL(url);
    link.remove();
  },0);
}

const technicianSignatureDataUrlCache=new Map();
const TECHNICIAN_SIGNATURE_COLLECTION="technicianSignatures";
function technicianSignatureKnownKey(protocol={}){
  return technicianKnownKeyFromValue([
    protocol.techSign,
    protocol.technician,
    protocol.technicianName,
    protocol.technicianDisplayName,
    protocol.technicianEmail,
    protocol.techEmail,
    protocol.createdBy
  ].map(safe).filter(Boolean).join(" "));
}
function technicianSignatureEmail(protocol={},options={}){
  return protocolTechnicianEmail(protocol,{allowCurrentFallback:!!options.allowCurrentFallback});
}
function technicianSignatureLookupKey(protocol={},options={}){
  const email=technicianSignatureEmail(protocol,options);
  if(email) return email;
  const known=technicianSignatureKnownKey(protocol);
  return known ? `known:${known}` : "";
}
function technicianSignatureDocIds(email=""){
  const clean=safe(email).toLowerCase();
  if(!clean) return [];
  return uniqueNonEmptyStrings([
    clean,
    clean.replace(/[/.#[\]$]/g,"_"),
    simpleNorm(clean).replace(/[^a-z0-9]+/g,"_").replace(/^_+|_+$/g,"")
  ]);
}
async function loadKnownTechnicianSignatureDataUrl(protocol={}){
  const key=technicianSignatureKnownKey(protocol);
  if(key!=="tipek") return "";
  const cacheKey="known:tipek";
  if(technicianSignatureDataUrlCache.has(cacheKey)) return technicianSignatureDataUrlCache.get(cacheKey) || "";
  try{
    const response=await fetch(OFFICIAL_TIPEK_SIGNATURE_URL,{cache:"force-cache"});
    if(!response.ok) throw new Error(`Podpis Tipek se nepodařilo načíst (${response.status}).`);
    const blob=await response.blob();
    const dataUrl=await new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onload=()=>resolve(String(reader.result || ""));
      reader.onerror=()=>reject(reader.error || new Error("Podpis Tipek se nepodařilo převést."));
      reader.readAsDataURL(blob);
    });
    technicianSignatureDataUrlCache.set(cacheKey,dataUrl);
    return dataUrl;
  }catch(e){
    console.warn("Výchozí podpis technika se nepodařilo načíst",e);
    technicianSignatureDataUrlCache.set(cacheKey,"");
    return "";
  }
}
async function loadTechnicianSignatureDataUrl(protocol={}){
  const lookupKey=technicianSignatureLookupKey(protocol);
  if(!lookupKey) return "";
  if(technicianSignatureDataUrlCache.has(lookupKey)) return technicianSignatureDataUrlCache.get(lookupKey) || "";
  const remember=value=>{
    const dataUrl=safe(value);
    technicianSignatureDataUrlCache.set(lookupKey,dataUrl);
    return dataUrl;
  };
  const pickSignature=data=>{
    if(!data || typeof data!=="object") return "";
    return safe(data.signatureDataUrl || data.technicianSignatureDataUrl || data.dataUrl || data.pngDataUrl || "");
  };
  const email=lookupKey.startsWith("known:") ? "" : lookupKey;
  if(!email || !firebaseReady || !db || !fb.fsMod || navigator.onLine===false){
    const fallback=await loadKnownTechnicianSignatureDataUrl(protocol);
    return fallback ? remember(fallback) : "";
  }
  try{
    const {doc,getDoc,collection,query,where,limit:getLimit,getDocs}=fb.fsMod;
    for(const docId of technicianSignatureDocIds(email)){
      try{
        const snap=await getDoc(doc(db,TECHNICIAN_SIGNATURE_COLLECTION,docId));
        if(snap.exists()){
          const found=pickSignature(snap.data());
          if(found) return remember(found);
        }
      }catch(_e){}
    }
    if(query && where && getDocs){
      const constraints=[where("email","==",email)];
      if(getLimit) constraints.push(getLimit(1));
      const snap=await getDocs(query(collection(db,TECHNICIAN_SIGNATURE_COLLECTION),...constraints));
      let found="";
      snap.forEach(docSnap=>{
        if(!found) found=pickSignature(docSnap.data());
      });
      if(found) return remember(found);
    }
  }catch(e){
    console.warn("Podpis technika se nepodařilo načíst",e);
  }
  return remember(await loadKnownTechnicianSignatureDataUrl(protocol));
}
async function enrichProtocolWithTechnicianSignature(protocol={}){
  if(protocolTechnicianSignatureImageBytes(protocol)) return protocol;
  const dataUrl=await loadTechnicianSignatureDataUrl(protocol);
  return dataUrl ? {...protocol,techSignatureDataUrl:dataUrl,technicianSignatureDataUrl:dataUrl} : protocol;
}

function technicianSignatureCurrentEmail(){
  return currentUserEmail();
}

async function saveCurrentTechnicianSignature(dataUrl=""){
  const email=technicianSignatureCurrentEmail();
  if(!email) throw new Error("Nejdřív se přihlaš jako technik.");
  if(!firebaseReady || !db || !fb.fsMod) throw new Error("Firebase není dostupný.");
  const cleanDataUrl=safe(dataUrl);
  if(!cleanDataUrl.startsWith("data:image/png;base64,")) throw new Error("Podpis se nepodařilo připravit.");
  const {doc,setDoc,serverTimestamp}=fb.fsMod;
  await setDoc(doc(db,TECHNICIAN_SIGNATURE_COLLECTION,email),{
    email,
    signatureDataUrl:cleanDataUrl,
    technicianSignatureDataUrl:cleanDataUrl,
    updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString(),
    updatedBy:email
  },{merge:true});
  technicianSignatureDataUrlCache.set(email,cleanDataUrl);
  return cleanDataUrl;
}

async function deleteCurrentTechnicianSignature(){
  const email=technicianSignatureCurrentEmail();
  if(!email) throw new Error("Nejdřív se přihlaš jako technik.");
  if(!firebaseReady || !db || !fb.fsMod) throw new Error("Firebase není dostupný.");
  const {doc,deleteDoc}=fb.fsMod;
  await deleteDoc(doc(db,TECHNICIAN_SIGNATURE_COLLECTION,email));
  technicianSignatureDataUrlCache.set(email,"");
}

function signatureCanvasPoint(e,canvas){
  const rect=canvas.getBoundingClientRect();
  return {
    x:(e.clientX-rect.left)*(canvas.width/rect.width),
    y:(e.clientY-rect.top)*(canvas.height/rect.height)
  };
}

function setupSignatureCanvasDrawing(canvas,onDirty){
  if(!canvas || canvas.dataset.signatureDrawingReady==="1") return;
  canvas.dataset.signatureDrawingReady="1";
  const ctx=canvas.getContext("2d");
  if(!ctx) return;
  ctx.lineWidth=4;
  ctx.lineCap="round";
  ctx.lineJoin="round";
  ctx.strokeStyle="#0f172a";
  let drawing=false;
  let last=null;
  const markDirty=()=>{ if(typeof onDirty==="function") onDirty(); };
  const start=e=>{
    e.preventDefault();
    drawing=true;
    last=signatureCanvasPoint(e,canvas);
    ctx.beginPath();
    ctx.arc(last.x,last.y,2,0,Math.PI*2);
    ctx.fillStyle="#0f172a";
    ctx.fill();
    markDirty();
    try{canvas.setPointerCapture(e.pointerId);}catch(_e){}
  };
  const move=e=>{
    if(!drawing || !last) return;
    e.preventDefault();
    const point=signatureCanvasPoint(e,canvas);
    ctx.beginPath();
    ctx.moveTo(last.x,last.y);
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    last=point;
    markDirty();
  };
  const stop=e=>{
    if(!drawing) return;
    e.preventDefault();
    drawing=false;
    last=null;
    try{canvas.releasePointerCapture(e.pointerId);}catch(_e){}
  };
  canvas.addEventListener("pointerdown",start);
  canvas.addEventListener("pointermove",move);
  canvas.addEventListener("pointerup",stop);
  canvas.addEventListener("pointercancel",stop);
  canvas.addEventListener("pointerleave",stop);
}

function clearSignatureCanvas(canvas){
  if(!canvas) return;
  const ctx=canvas.getContext("2d");
  if(ctx) ctx.clearRect(0,0,canvas.width,canvas.height);
}

function signatureCanvasIsBlank(canvas){
  if(!canvas) return true;
  const blank=document.createElement("canvas");
  blank.width=canvas.width;
  blank.height=canvas.height;
  try{return canvas.toDataURL("image/png")===blank.toDataURL("image/png");}catch(e){return false;}
}

async function drawSignatureDataUrlOnCanvas(canvas,dataUrl=""){
  if(!canvas || !safe(dataUrl)) return false;
  const ctx=canvas.getContext("2d");
  if(!ctx) return false;
  const img=await loadDataUrlImage(dataUrl);
  if(!img) return false;
  clearSignatureCanvas(canvas);
  drawImageContained(ctx,img,18,18,canvas.width-36,canvas.height-36);
  return true;
}

function technicianSignatureDialogNodes(){
  const overlay=document.getElementById("technicianSignatureOverlay");
  return {
    overlay,
    canvas:document.getElementById("technicianSignaturePad"),
    status:document.getElementById("technicianSignatureStatus")
  };
}

function ensureTechnicianSignatureDialog(){
  let {overlay}=technicianSignatureDialogNodes();
  if(overlay) return overlay;
  overlay=document.createElement("div");
  overlay.id="technicianSignatureOverlay";
  overlay.className="technician-signature-overlay";
  overlay.hidden=true;
  overlay.innerHTML=`
    <div class="technician-signature-dialog" role="dialog" aria-modal="true" aria-labelledby="technicianSignatureTitle">
      <div class="technician-signature-head">
        <div>
          <h3 id="technicianSignatureTitle">Podpis technika</h3>
          <p>Podpis se uloží jen k tvému přihlášenému účtu.</p>
        </div>
        <button class="secondary" type="button" id="closeTechnicianSignatureBtn">Zavřít</button>
      </div>
      <canvas id="technicianSignaturePad" width="900" height="260"></canvas>
      <div class="technician-signature-actions">
        <button class="primary" type="button" id="saveTechnicianSignatureBtn">Uložit podpis</button>
        <button class="secondary" type="button" id="clearTechnicianSignatureBtn">Vymazat podpis</button>
        <button class="secondary" type="button" id="cancelTechnicianSignatureBtn">Zavřít</button>
      </div>
      <p class="small technician-signature-status" id="technicianSignatureStatus"></p>
    </div>`;
  document.body.appendChild(overlay);
  const nodes=technicianSignatureDialogNodes();
  const close=()=>{overlay.hidden=true;};
  document.getElementById("closeTechnicianSignatureBtn").onclick=close;
  document.getElementById("cancelTechnicianSignatureBtn").onclick=close;
  overlay.addEventListener("click",event=>{
    if(event.target===overlay) close();
  });
  setupSignatureCanvasDrawing(nodes.canvas,()=>{
    if(nodes.status) nodes.status.textContent="Podpis je upravený, ulož ho tlačítkem Uložit podpis.";
  });
  document.getElementById("saveTechnicianSignatureBtn").onclick=async()=>{
    const current=technicianSignatureDialogNodes();
    try{
      if(signatureCanvasIsBlank(current.canvas)){
        if(current.status) current.status.textContent="Nejdřív se podepiš do pole.";
        return;
      }
      const dataUrl=current.canvas.toDataURL("image/png");
      if(current.status) current.status.textContent="Ukládám podpis...";
      await saveCurrentTechnicianSignature(dataUrl);
      if(current.status) current.status.textContent="Podpis uložen. Bude se vkládat do nově generovaných protokolů.";
      showSaveConfirmation("Podpis technika uložen.");
    }catch(e){
      if(current.status) current.status.textContent=`Chyba uložení podpisu: ${e.message}`;
    }
  };
  document.getElementById("clearTechnicianSignatureBtn").onclick=async()=>{
    const current=technicianSignatureDialogNodes();
    try{
      clearSignatureCanvas(current.canvas);
      if(current.status) current.status.textContent="Mažu uložený podpis...";
      await deleteCurrentTechnicianSignature();
      if(current.status) current.status.textContent="Podpis vymazán.";
      showSaveConfirmation("Podpis technika vymazán.");
    }catch(e){
      if(current.status) current.status.textContent=`Chyba vymazání podpisu: ${e.message}`;
    }
  };
  return overlay;
}

async function openTechnicianSignatureDialog(){
  const email=technicianSignatureCurrentEmail();
  if(!email){
    setProtocolStatusText("Nejdřív se přihlaš jako technik.");
    return;
  }
  const overlay=ensureTechnicianSignatureDialog();
  overlay.hidden=false;
  const {canvas,status}=technicianSignatureDialogNodes();
  clearSignatureCanvas(canvas);
  if(status) status.textContent="Načítám uložený podpis...";
  try{
    const existing=await loadTechnicianSignatureDataUrl({technicianEmail:email});
    if(existing){
      await drawSignatureDataUrlOnCanvas(canvas,existing);
      if(status) status.textContent="Uložený podpis je načtený.";
    }else if(status){
      status.textContent="Zatím nemáš uložený podpis. Podepiš se a dej Uložit podpis.";
    }
  }catch(e){
    if(status) status.textContent="Podpis se nepodařilo načíst, můžeš ho zadat znovu.";
  }
}
window.openTechnicianSignatureDialog=openTechnicianSignatureDialog;

async function preparedProtocolFilled(protocol,options={}){
  if(!protocol) return null;
  const allowCurrentTechnicianFallback=options.allowCurrentTechnicianFallback!==false;
  return enrichProtocolWithTechnicianSignature(normalizeProtocolTechnicianFields({
    ...protocol,
    createdBy:protocol.createdBy || protocol.technicianEmail || ""
  },{allowCurrentFallback:allowCurrentTechnicianFallback}));
}

async function preparedProtocolExport(protocol,options={}){
  if(!protocol) return null;
  const filled=await preparedProtocolFilled(protocol,options);
  const baseName=filled.deviceType || filled.selectedDevice || filled.siteSource || filled.siteName || selectedSite?.adresa || "protokol";
  const fileName=`protokol-${protocolExportDatePart(filled)}-${protocolWordFileNamePart(baseName)}.docx`;
  return {
    filled,
    fileName,
    blob:await buildProtocolWordBlob(filled)
  };
}

async function exportProtocolToWord(protocol){
  if(!protocol){
    showSaveConfirmation("Není vybraný protokol k exportu.");
    return;
  }
  try{
    setProtocolStatusText("Připravuji Word export...");
    const prepared=await preparedProtocolExport(protocol);
    downloadBlobFile(prepared.fileName,prepared.blob);
    setProtocolStatusText("Protokol exportován do Wordu.");
    showSaveConfirmation("Protokol exportován do Wordu.");
  }catch(e){
    console.warn("Export protokolu do Wordu selhal",e);
    setProtocolStatusText("Export do Wordu se nepodařil.");
    showSaveConfirmation("Export do Wordu se nepodařil.");
  }
}

function protocolMailSubject(protocol={}){
  return "Protokol zkoušky provozuschopnosti záložního zdroje";
}

function protocolMailSenderName(protocol={}){
  const email=currentUserEmail();
  const fromEmail=email ? email.split("@")[0].replace(/[._-]+/g," ").trim() : "";
  return normalizeTechnicianDisplayName(
    currentUser?.displayName ||
    protocol.senderName ||
    protocol.technician ||
    protocol.techSign ||
    protocol.technicianName ||
    fromEmail ||
    protocol.technicianEmail ||
    protocol.createdBy ||
    ""
  );
}

function protocolMailBody(protocol={},fileName=""){
  const date=protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt);
  const place=safe(protocol.place || protocol.siteAddress || protocol.siteName || selectedSite?.adresa || "");
  const device=safe(protocol.deviceType || protocol.selectedDevice || protocol.siteSource || selectedSite?.zdroj || "");
  const senderName=protocolMailSenderName(protocol);
  return [
    "Dobrý den,",
    "",
    "v příloze posílám vyexportovaný protokol.",
    "",
    date ? `Datum kontroly: ${date}` : null,
    place ? `Místo: ${place}` : null,
    device ? `Zařízení: ${device}` : null,
    fileName ? `Soubor: ${fileName}` : null,
    "",
    "S pozdravem",
    senderName || null,
    "",
    "Servis záložních zdrojů s.r.o.",
    "IČ: 09391126  DIČ: CZ09391126",
    "sídlo: Božetěchova 3003/133, 612 00 Brno, Česká republika"
  ].filter(line=>line!==null).join("\n");
}

function blobToBase64(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>{
      const result=String(reader.result || "");
      resolve(result.includes(",") ? result.split(",").pop() : result);
    };
    reader.onerror=()=>reject(reader.error || new Error("Soubor nejde připravit k odeslání."));
    reader.readAsDataURL(blob);
  });
}

function protocolPdfFileNameFromWord(fileName=""){
  const clean=safe(fileName);
  return clean.toLowerCase().endsWith(".docx")
    ? `${clean.slice(0,-5)}.pdf`
    : (clean.toLowerCase().endsWith(".pdf") ? clean : "protokol.pdf");
}

function loadDataUrlImage(dataUrl=""){
  return new Promise((resolve,reject)=>{
    const src=safe(dataUrl);
    if(!src) return resolve(null);
    const img=new Image();
    img.onload=()=>resolve(img);
    img.onerror=()=>reject(new Error("Obrázek podpisu se nepodařilo načíst."));
    img.src=src;
  });
}

function drawImageContained(ctx,img,x,y,w,h){
  if(!ctx || !img || !img.width || !img.height) return;
  const scale=Math.min(w/img.width,h/img.height);
  const iw=img.width*scale;
  const ih=img.height*scale;
  ctx.drawImage(img,x+(w-iw)/2,y+(h-ih)/2,iw,ih);
}

function wrapCanvasText(ctx,text,maxWidth){
  const paragraphs=String(text || "").split(/\r?\n/);
  const lines=[];
  paragraphs.forEach(paragraph=>{
    const words=paragraph.split(/\s+/).filter(Boolean);
    if(!words.length){
      lines.push("");
      return;
    }
    let line="";
    words.forEach(word=>{
      const test=line ? `${line} ${word}` : word;
      if(ctx.measureText(test).width<=maxWidth){
        line=test;
        return;
      }
      if(line) lines.push(line);
      line=word;
      while(ctx.measureText(line).width>maxWidth && line.length>1){
        let cut=line.length;
        while(cut>1 && ctx.measureText(line.slice(0,cut)).width>maxWidth) cut--;
        lines.push(line.slice(0,cut));
        line=line.slice(cut);
      }
    });
    lines.push(line);
  });
  return lines;
}

const PROTOCOL_PDF_PAGE_DXA_WIDTH=11906;
const PROTOCOL_PDF_PAGE_DXA_HEIGHT=16838;
const PROTOCOL_PDF_PAGE_WIDTH=1240;
const PROTOCOL_PDF_PAGE_HEIGHT=1754;
const PROTOCOL_PDF_DPI=150;
const PROTOCOL_PDF_DXA_SCALE=PROTOCOL_PDF_PAGE_WIDTH/PROTOCOL_PDF_PAGE_DXA_WIDTH;

function protocolPdfDxa(value){
  return Number(value || 0)*PROTOCOL_PDF_DXA_SCALE;
}

function protocolPdfWordFontPx(size=20){
  return Math.max(6,((Number(size) || 20)/2)*(PROTOCOL_PDF_DPI/72));
}

function protocolPdfLineHeight(size=20){
  return Math.ceil(protocolPdfWordFontPx(size)*1.15);
}

function protocolPdfApplyFont(ctx,options={}){
  const italic=options.italic ? "italic " : "";
  const weight=options.bold ? "700" : "400";
  const px=protocolPdfWordFontPx(options.size || 20).toFixed(2);
  ctx.font=`${italic}${weight} ${px}px "Times New Roman", Times, serif`;
}

function protocolPdfStartPage(state){
  const canvas=document.createElement("canvas");
  canvas.width=PROTOCOL_PDF_PAGE_WIDTH;
  canvas.height=PROTOCOL_PDF_PAGE_HEIGHT;
  const ctx=canvas.getContext("2d");
  ctx.fillStyle="#fff";
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.textBaseline="alphabetic";
  state.pages.push({canvas,ctx});
  state.canvas=canvas;
  state.ctx=ctx;
  state.y=protocolPdfDxa(850);
}

function protocolPdfEnsureSpace(state,height){
  if(!state.ctx || state.y+height>PROTOCOL_PDF_PAGE_HEIGHT-protocolPdfDxa(850)){
    protocolPdfStartPage(state);
  }
}

function protocolPdfDrawParagraph(state,text,options={}){
  const ctx=state.ctx;
  const before=protocolPdfDxa(options.before || 0);
  const after=protocolPdfDxa(options.after ?? 0);
  const width=protocolPdfDxa(9630);
  const fontSize=options.size || 20;
  protocolPdfApplyFont(ctx,options);
  const lines=wrapCanvasText(ctx,protocolExportValue(text) || " ",width);
  const lineHeight=protocolPdfLineHeight(fontSize);
  const height=before+(lines.length*lineHeight)+after;
  protocolPdfEnsureSpace(state,height);
  state.y+=before;
  ctx.fillStyle=options.color || "#000";
  ctx.textAlign=options.align==="center" ? "center" : "left";
  const x=options.align==="center" ? state.marginX+(width/2) : state.marginX;
  let baseline=state.y+protocolPdfWordFontPx(fontSize);
  for(const line of lines){
    ctx.fillText(line,x,baseline);
    baseline+=lineHeight;
  }
  ctx.textAlign="left";
  state.y+=lines.length*lineHeight+after;
}

function protocolPdfPreparedTableRows(ctx,rows=[],widths=[]){
  const scaledWidths=widths.map(protocolPdfDxa);
  const cellMargin={
    top:protocolPdfDxa(45),
    right:protocolPdfDxa(90),
    bottom:protocolPdfDxa(45),
    left:protocolPdfDxa(90)
  };
  return rows.map(row=>{
    let colIndex=0;
    let rowHeight=0;
    const cells=(row || []).map(inputCell=>{
      const cell=typeof inputCell==="string" ? {text:inputCell} : {...(inputCell || {})};
      const span=Math.max(1,Number(cell.colSpan) || 1);
      const width=cell.width ? protocolPdfDxa(cell.width) : scaledWidths.slice(colIndex,colIndex+span).reduce((sum,w)=>sum+w,0);
      colIndex+=span;
      const size=cell.size || 20;
      protocolPdfApplyFont(ctx,cell);
      const innerWidth=Math.max(10,width-cellMargin.left-cellMargin.right);
      const lines=wrapCanvasText(ctx,protocolExportValue(cell.text) || " ",innerWidth);
      const lineHeight=protocolPdfLineHeight(size);
      const contentHeight=(lines.length*lineHeight)+cellMargin.top+cellMargin.bottom;
      rowHeight=Math.max(rowHeight,protocolPdfDxa(cell.height || 0),contentHeight);
      return {cell,width,lines,lineHeight,size};
    });
    return {cells,height:rowHeight};
  });
}

function protocolPdfDrawTable(state,rows=[],widths=[],options={}){
  const ctx=state.ctx;
  const prepared=protocolPdfPreparedTableRows(ctx,rows,widths);
  const height=prepared.reduce((sum,row)=>sum+row.height,0);
  protocolPdfEnsureSpace(state,height);
  const cellMargin={
    top:protocolPdfDxa(45),
    right:protocolPdfDxa(90),
    bottom:protocolPdfDxa(45),
    left:protocolPdfDxa(90)
  };
  let y=state.y;
  prepared.forEach(row=>{
    let x=state.marginX;
    row.cells.forEach(({cell,width,lines,lineHeight,size})=>{
      if(cell.fill){
        ctx.fillStyle=`#${cell.fill}`;
        ctx.fillRect(x,y,width,row.height);
      }
      if(!options.noBorders){
        ctx.strokeStyle="#000";
        ctx.lineWidth=1;
        ctx.strokeRect(x,y,width,row.height);
      }
      protocolPdfApplyFont(ctx,cell);
      ctx.fillStyle=cell.color ? `#${cell.color}` : "#000";
      ctx.textAlign=cell.align==="center" ? "center" : "left";
      const textWidth=width-cellMargin.left-cellMargin.right;
      const textBlockHeight=lines.length*lineHeight;
      const fontPx=protocolPdfWordFontPx(size);
      const tx=cell.align==="center" ? x+(width/2) : x+cellMargin.left;
      let baseline=y+Math.max(cellMargin.top+fontPx,(row.height-textBlockHeight)/2+fontPx*.78);
      for(const line of lines){
        if(cell.align==="center"){
          ctx.fillText(line,tx,baseline,textWidth);
        }else{
          ctx.fillText(line,tx,baseline);
        }
        baseline+=lineHeight;
      }
      ctx.textAlign="left";
      x+=width;
    });
    y+=row.height;
  });
  state.y+=height;
}

function protocolPdfDrawBlank(state,after=60){
  state.y+=protocolPdfDxa(after)+protocolPdfWordFontPx(4);
}

function protocolPdfDrawFormField(state,label,value,width=9630,options={}){
  const rows=[
    [{text:label,bold:true,size:18,fill:"F2F2F2"}],
    [{text:protocolExportValue(value) || " ",size:20,height:330}]
  ];
  if(options.keepWithNextDxa){
    const prepared=protocolPdfPreparedTableRows(state.ctx,rows,[width]);
    const tableHeight=prepared.reduce((sum,row)=>sum+row.height,0);
    protocolPdfEnsureSpace(state,tableHeight+protocolPdfDxa(20)+protocolPdfWordFontPx(4)+protocolPdfDxa(options.keepWithNextDxa));
  }
  protocolPdfDrawTable(state,rows,[width]);
  protocolPdfDrawBlank(state,20);
}

function protocolPdfDrawFormGrid(state,labels,values,widths){
  protocolPdfDrawTable(state,[
    labels.map(label=>({text:label,bold:true,size:18,fill:"F2F2F2"})),
    values.map(value=>({text:protocolExportValue(value) || " ",size:20,height:330}))
  ],widths);
  protocolPdfDrawBlank(state,20);
}

function protocolPdfDrawMeasurementTable(state,protocol={}){
  const spec=protocolMeasurementTableSpec(protocol);
  protocolPdfDrawTable(state,spec.rows,spec.widths);
  protocolPdfDrawBlank(state,25);
}

function protocolPdfDrawSignatureCell(ctx,x,y,width,height,name,img){
  const marginX=protocolPdfDxa(90);
  const marginY=protocolPdfDxa(45);
  let usedY=y+marginY;
  protocolPdfApplyFont(ctx,{size:18});
  ctx.fillStyle="#000";
  ctx.textAlign="left";
  if(safe(name)){
    const lineHeight=protocolPdfLineHeight(18);
    const lines=wrapCanvasText(ctx,name,width-(marginX*2));
    let baseline=usedY+protocolPdfWordFontPx(18);
    for(const line of lines){
      ctx.fillText(line,x+marginX,baseline);
      baseline+=lineHeight;
    }
    usedY=baseline+protocolPdfDxa(20);
  }
  if(img){
    const availableH=Math.max(20,y+height-marginY-usedY);
    drawImageContained(ctx,img,x+marginX,usedY,width-(marginX*2),availableH);
  }
}

function protocolPdfDrawSignatureGrid(state,protocol={},clientImage=null,techImage=null){
  const widths=[4815,4815];
  const headerRows=[
    [
      {text:"Za objednavatele:",bold:true,size:18,fill:"F2F2F2"},
      {text:"Kontrolu provedl:",bold:true,size:18,fill:"F2F2F2"}
    ]
  ];
  const rowHeight=protocolPdfDxa(1050);
  protocolPdfEnsureSpace(state,protocolPdfDxa(330)+rowHeight+protocolPdfDxa(35)+protocolPdfWordFontPx(16));
  protocolPdfDrawTable(state,headerRows,widths);
  protocolPdfEnsureSpace(state,rowHeight+protocolPdfDxa(35)+protocolPdfWordFontPx(16));
  const ctx=state.ctx;
  const colW=protocolPdfDxa(4815);
  const y=state.y;
  [0,1].forEach(idx=>{
    const x=state.marginX+(idx*colW);
    ctx.strokeStyle="#000";
    ctx.lineWidth=1;
    ctx.strokeRect(x,y,colW,rowHeight);
  });
  protocolPdfDrawSignatureCell(ctx,state.marginX,y,colW,rowHeight,protocol.clientSign || "",clientImage);
  protocolPdfDrawSignatureCell(ctx,state.marginX+colW,y,colW,rowHeight,protocolTechnicianDisplayName(protocol),techImage);
  state.y+=rowHeight;
  protocolPdfDrawParagraph(state,"(čitelně + podpis)",{size:16,after:35});
}

function protocolPdfDocumentContext(protocol={}){
  const site=selectedSite || {};
  return {
    deviceType:protocol.deviceType || protocol.selectedDevice || protocol.siteSource || site.zdroj || "",
    place:protocol.place || protocol.siteAddress || protocol.siteName || site.adresa || "",
    sourceState:[
      protocolSourceStateLabel(protocol),
      protocolSourceStateValue(protocol)==="ok" ? protocolSourceTestMethodLabel(protocol.sourceTestMethod || protocol.testMethod) : ""
    ].filter(Boolean).join(" - ")
  };
}

async function renderProtocolPdfPageCanvases(protocol={},options={}){
  const clientImage=await loadDataUrlImage(protocol.clientSignatureDataUrl || protocol.clientSignature || "").catch(()=>null);
  const techImage=await loadDataUrlImage(protocol.techSignatureDataUrl || protocol.technicianSignatureDataUrl || "").catch(()=>null);
  const state={
    pages:[],
    canvas:null,
    ctx:null,
    marginX:protocolPdfDxa(850),
    y:protocolPdfDxa(850)
  };
  const data=protocolPdfDocumentContext(protocol);
  protocolPdfStartPage(state);
  protocolPdfDrawParagraph(state,"Potvrzení o provedené zkoušce provozuschopnosti",{align:"center",bold:true,size:28,after:80});
  protocolPdfDrawParagraph(state,"Tento formulář slouží zároveň jako objednávka zkoušky provozuschopnosti. Kontrolu záložního zdroje na PBZ dle Vyhl. 246/2001 Sb. §6, §7 provedl: Servis záložních zdrojů s.r.o., IČ: 09391126",{size:18,after:80});
  protocolPdfDrawFormField(state,"Datum provedení kontroly zdroje:",protocolDisplayDate(protocol.date || protocol.checkDate || protocol.createdAt));
  protocolPdfDrawFormGrid(state,["Kontrolované zařízení – Typ","Výrobní č.","Plomba"],[data.deviceType,protocol.serial,protocol.seal],[4300,2650,2680]);
  protocolPdfDrawFormField(state,"1) Místo kontroly:",data.place);
  protocolPdfDrawFormField(state,"2) Provozovatel zařízení:",protocol.operator);
  protocolPdfDrawFormField(state,"3) Objednatel zkoušky provozuschopnosti:",protocol.customer);
  protocolPdfDrawFormField(state,"4) Umístění PBZ v objektu:",protocol.pbzLocation);
  protocolPdfDrawMeasurementTable(state,protocol);
  protocolPdfDrawFormField(state,"5) Umístění jističů UPS a zál. zařízení v objektu:",protocol.breakersLocation);
  protocolPdfDrawFormField(state,"6) Typ a umístění zálohovaných zařízení v objektu:",protocolBackedDevicesText(protocol));
  protocolPdfDrawFormField(state,"7) Umístění zálohovaných zařízení:",protocol.controlLocation);
  protocolPdfDrawFormField(state,"Postup testování:",protocol.testProcedure);
  protocolPdfDrawFormField(state,"8) Parkování a vstup do objektu, předepsané OOPP:",protocolAccessText(protocol));
  protocolPdfDrawFormField(state,"9) Kontakty:",protocol.contacts);
  protocolPdfDrawFormField(state,"10) Dostupnost:",protocolAvailabilityText(protocol));
  protocolPdfDrawFormField(state,"11) Perioda zkoušky provozuschopnosti:",protocolPeriodText(protocol));
  protocolPdfDrawFormField(state,"12) Zařízení pracuje ve vyhovujících podmínkách (odůvodnění):",protocolConditionsText(protocol));
  protocolPdfDrawFormField(state,"14) Poznámka pro zákazníka:",protocol.customerNote || protocol.noteForCustomer,9630,{keepWithNextDxa:650});
  if(!options.omitChecklist){
    protocolPdfDrawFormField(state,"15) Chceck list:",protocol.checklist || protocol.checkList || protocol.chceckList,9630,{keepWithNextDxa:650});
  }
  protocolPdfDrawFormField(state,"Stav zdroje po kontrole:",data.sourceState);
  protocolPdfDrawSignatureGrid(state,protocol,clientImage,techImage);
  state.pages.forEach((page,idx)=>{
    const pctx=page.ctx;
    pctx.fillStyle="#666";
    protocolPdfApplyFont(pctx,{size:14});
    pctx.textAlign="right";
    pctx.fillText(`Strana ${idx+1} / ${state.pages.length}`,PROTOCOL_PDF_PAGE_WIDTH-protocolPdfDxa(850),PROTOCOL_PDF_PAGE_HEIGHT-protocolPdfDxa(520));
    pctx.textAlign="left";
  });
  return state.pages.map(page=>({
    width:page.canvas.width,
    height:page.canvas.height,
    dataUrl:page.canvas.toDataURL("image/jpeg",0.86)
  }));
}

function bytesFromDataUrl(dataUrl=""){
  const base64=safe(dataUrl).split(",").pop() || "";
  return base64ToBytes(base64);
}

function textBytes(text){
  return new TextEncoder().encode(String(text || ""));
}

function concatBytes(chunks=[]){
  const total=chunks.reduce((sum,chunk)=>sum+chunk.length,0);
  const out=new Uint8Array(total);
  let offset=0;
  chunks.forEach(chunk=>{
    out.set(chunk,offset);
    offset+=chunk.length;
  });
  return out;
}

function buildPdfFromJpegPages(pages=[]){
  const pageW=595.28;
  const pageH=841.89;
  const count=pages.length;
  const chunks=[];
  const offsets=[];
  let position=0;
  const push=chunk=>{
    const bytes=typeof chunk==="string" ? textBytes(chunk) : chunk;
    chunks.push(bytes);
    position+=bytes.length;
  };
  const objectCount=2+(count*3);
  const objectBody=(num,parts)=>{
    offsets[num]=position;
    push(`${num} 0 obj\n`);
    (Array.isArray(parts) ? parts : [parts]).forEach(push);
    push("\nendobj\n");
  };
  push("%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n");
  objectBody(1,"<< /Type /Catalog /Pages 2 0 R >>");
  const kids=Array.from({length:count},(_,idx)=>`${3+(idx*3)} 0 R`).join(" ");
  objectBody(2,`<< /Type /Pages /Kids [${kids}] /Count ${count} >>`);
  pages.forEach((page,idx)=>{
    const pageObj=3+(idx*3);
    const imageObj=pageObj+1;
    const contentObj=pageObj+2;
    const imageName=`Im${idx+1}`;
    const imageBytes=bytesFromDataUrl(page.dataUrl);
    const content=`q\n${pageW.toFixed(2)} 0 0 ${pageH.toFixed(2)} 0 0 cm\n/${imageName} Do\nQ`;
    objectBody(pageObj,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW.toFixed(2)} ${pageH.toFixed(2)}] /Resources << /XObject << /${imageName} ${imageObj} 0 R >> >> /Contents ${contentObj} 0 R >>`);
    objectBody(imageObj,[`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageBytes.length} >>\nstream\n`,imageBytes,"\nendstream"]);
    objectBody(contentObj,`<< /Length ${textBytes(content).length} >>\nstream\n${content}\nendstream`);
  });
  const xrefStart=position;
  push(`xref\n0 ${objectCount+1}\n`);
  push("0000000000 65535 f \n");
  for(let i=1;i<=objectCount;i++) push(`${String(offsets[i] || 0).padStart(10,"0")} 00000 n \n`);
  push(`trailer\n<< /Size ${objectCount+1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`);
  return concatBytes(chunks);
}

async function buildProtocolPdfBlob(protocol={},options={}){
  const pages=await renderProtocolPdfPageCanvases(protocol,options);
  return new Blob([buildPdfFromJpegPages(pages)],{type:"application/pdf"});
}

async function preparedProtocolPdfExport(protocol,options={}){
  if(!protocol) return null;
  const filled=await preparedProtocolFilled(protocol,{
    allowCurrentTechnicianFallback:options.allowCurrentTechnicianFallback!==false
  });
  if(options.requireTechnicianSignature && !protocolTechnicianSignatureImageBytes(filled)){
    const tech=protocolTechnicianDisplayName(filled) || "technik z protokolu";
    throw new Error(`Technik ${tech} nemá uložený podpis. Nejdřív ulož podpis technika, aby bylo možné poslat PDF zákazníkovi.`);
  }
  const baseName=filled.deviceType || filled.selectedDevice || filled.siteSource || filled.siteName || selectedSite?.adresa || "protokol";
  const wordName=`protokol-${protocolExportDatePart(filled)}-${protocolWordFileNamePart(baseName)}.docx`;
  const fileName=protocolPdfFileNameFromWord(wordName);
  return {
    filled,
    fileName,
    blob:await buildProtocolPdfBlob(filled,{omitChecklist:!!options.omitChecklist})
  };
}

async function sendProtocolByMail(protocol,recipientEmail=""){
  if(!protocol){
    showSaveConfirmation("Není vybraný protokol k poslání.");
    return;
  }
  const toEmail=safe(recipientEmail).toLowerCase();
  if(!validProtocolMailRecipient(toEmail)){
    throw new Error("Zadej platný e-mail příjemce.");
  }
  const mailReady=await ensureMailFunctions();
  if(!firebaseReady || !mailReady || !fb.fnMod || !mailFunctions){
    throw new Error("Odesílací funkce není dostupná. Nejdřív je potřeba nasadit Firebase Function sendProtocolMail.");
  }
  setProtocolStatusText("Připravuji PDF protokol pro e-mail...");
  const prepared=await preparedProtocolPdfExport(protocol,{
    allowCurrentTechnicianFallback:false,
    omitChecklist:true,
    requireTechnicianSignature:true
  });
  setProtocolStatusText(`Odesílám PDF protokol na ${toEmail}...`);
  const sendMail=fb.fnMod.httpsCallable(mailFunctions,"sendProtocolMail");
  await sendMail({
    recipientEmail:toEmail,
    toEmail,
    subject:protocolMailSubject(prepared.filled),
    body:protocolMailBody(prepared.filled,prepared.fileName),
    fileName:prepared.fileName,
    contentType:"application/pdf",
    fileBase64:await blobToBase64(prepared.blob)
  });
  setProtocolStatusText(`Protokol byl odeslán na ${toEmail}.`);
  showSaveConfirmation(`Protokol odeslán na ${toEmail}.`);
}

function protocolMailErrorText(error){
  const code=safe(error && error.code);
  const message=safe(error && error.message || error);
  if(code==="functions/unauthenticated" || code==="unauthenticated"){
    return "Nejdřív se znovu přihlaš přes Google účtem @astip.cz.";
  }
  if(code==="functions/permission-denied" || code==="permission-denied"){
    return message || "Odeslání je povolené jen přihlášeným uživatelům @astip.cz.";
  }
  if(code==="functions/resource-exhausted" || code==="resource-exhausted"){
    return message || "Příloha protokolu je moc velká.";
  }
  return [code,message].filter(Boolean).join(": ") || "E-mail se nepodařilo odeslat.";
}

function protocolMailToastText(error){
  const message=protocolMailErrorText(error);
  return message.length>120 ? `${message.slice(0,117)}...` : message;
}

const {
  siteLocalCacheKey,
  siteLocalDetailReadCacheKey
}=createSiteLocalKeyHelpers({
  detailKey,
  detailLazyKey,
  getSelectedSite:()=>selectedSite,
  recordSourceIdentity,
  selectedSiteDocId
});
const LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS=1800;
const LOCAL_DETAIL_READ_CACHE_MS=1800;
const siteLocalProtocolHistoryReadCache=new Map();
const siteOfflinePhotoReadCache=new Map();
function readCachedLocalDetailItems(cache,key,loader){
  return readCachedLocalDetailItemsFromCache({
    cache,
    cloneItems:cloneLocalStorageArrayItems,
    key,
    loader,
    maxAgeMs:LOCAL_DETAIL_READ_CACHE_MS
  });
}
function clearLocalDetailReadCaches(){
  siteLocalProtocolHistoryReadCache.clear();
  siteOfflinePhotoReadCache.clear();
  allLocalProtocolHistoryReadCache.clear();
}
function clearLocalDetailReadCacheForKind(kind,site=selectedSite){
  const cleanKind=String(kind || "");
  if(!cleanKind){
    clearLocalDetailReadCaches();
    return;
  }
  if(cleanKind==="protocolHistory" || cleanKind==="protocols"){
    clearLocalDetailReadCache(siteLocalProtocolHistoryReadCache,site ? siteLocalCacheKey("protocolHistory",site) : "");
    clearLocalDetailReadCache(allLocalProtocolHistoryReadCache);
  }
  if(cleanKind==="offlinePhotos" || cleanKind==="photos"){
    clearLocalDetailReadCache(siteOfflinePhotoReadCache,site ? siteLocalCacheKey("photos",site) : "");
  }
}
const {
  clearSiteLocalArrayReadCache,
  clearSiteLocalObjectReadCache,
  readSiteLocalArray,
  readSiteLocalArrayMeta,
  readSiteLocalObject,
  rememberSiteLocalArrayReadCache,
  rememberSiteLocalObjectReadCache
}=createSiteLocalStorageHelpers({
  cloneSzzItemsMeta,
  getDefaultSite:()=>selectedSite,
  maxAgeMs:LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS,
  siteLocalCacheKey,
  szzItemsMeta
});
const {
  clearLocalStorageArrayEntriesCache,
  clearLocalStorageObjectEntriesCache,
  localStorageArrayEntries,
  localStorageObjectEntries
}=createLocalStorageEntriesHelpers({
  cloneArrayEntries:cloneLocalStorageArrayEntries,
  cloneObjectEntries:cloneLocalStorageObjectEntries,
  clearSiteArrayReadCache:clearSiteLocalArrayReadCache,
  clearSiteObjectReadCache:clearSiteLocalObjectReadCache,
  maxAgeMs:LOCAL_STORAGE_ARRAY_ENTRIES_CACHE_MS
});
window.addEventListener("storage",()=>{
  clearLocalStorageArrayEntriesCache();
  clearLocalStorageObjectEntriesCache();
  clearLocalDetailReadCaches();
});
const {
  appendSiteLocalArray,
  mergeSiteLocalArray:resolvedMergeSiteLocalArray,
  removeLocalStorageArrayItemByKey,
  removeSiteLocalItem,
  writeSiteLocalObject
}=createSiteLocalStorageMutationHelpers({
  clearDetailHistoryCacheForKind,
  clearLocalStorageArrayEntriesCache,
  clearLocalStorageObjectEntriesCache,
  getDefaultSite:()=>selectedSite,
  readSiteLocalArray,
  rememberSiteLocalArrayReadCache,
  rememberSiteLocalObjectReadCache,
  safeValue:safe,
  siteLocalCacheKey,
  siteRecordIdentity,
  szzArrayWithoutItemId,
  uniqueNonEmptyStrings
});
mergeSiteLocalArrayImpl=resolvedMergeSiteLocalArray;
window.mergeSiteLocalArray=mergeSiteLocalArray;

const {
  countUniqueOfflineItems,
  uniqueByOfflineId,
  uniqueByOfflineIdFromLists
}=createOfflineIdHelpers({
  safeValue:safe
});
window.uniqueByOfflineId=uniqueByOfflineId;
window.uniqueByOfflineIdFromLists=uniqueByOfflineIdFromLists;

const {
  clearOfflineSiteQueueReadCache,
  countOfflineSiteQueueItems,
  isOfflineSiteQueueItem,
  readOfflineSiteQueueItems,
  removeOfflineSiteQueueItem,
  saveOfflineSiteQueueItem
}=createOfflineSiteQueueHelpers({
  invalidateOfflineSiteCountCache:()=>invalidateOfflineSiteCountCache(),
  safeValue:safe
});
window.saveOfflineSiteQueueItem=saveOfflineSiteQueueItem;
window.readOfflineSiteQueueItems=readOfflineSiteQueueItems;
window.removeOfflineSiteQueueItem=removeOfflineSiteQueueItem;

const {
  clearOfflineProtocolQueueReadCache,
  countPendingOfflineProtocolEntries,
  isPendingOfflineProtocolItem,
  pendingOfflineProtocolItems,
  readAllOfflineProtocolQueueItems,
  readOfflineProtocolQueueItems,
  removeOfflineProtocolQueueItem,
  saveOfflineProtocolQueueItem
}=createOfflineProtocolQueueHelpers({
  clearLocalDetailReadCacheForKind,
  detailLazyKey,
  getDefaultSite:()=>selectedSite,
  invalidateOfflineProtocolCountCache:()=>invalidateOfflineProtocolCountCache(),
  recordMatchesSite,
  safeValue:safe,
  siteLocalCacheKey
});
window.saveOfflineProtocolQueueItem=saveOfflineProtocolQueueItem;
window.readAllOfflineProtocolQueueItems=readAllOfflineProtocolQueueItems;
window.readOfflineProtocolQueueItems=readOfflineProtocolQueueItems;
window.removeOfflineProtocolQueueItem=removeOfflineProtocolQueueItem;

function saveProtocolLocally(payload,site=selectedSite,reason=""){
  const identity=siteRecordIdentity(site);
  const offlinePayload={
    ...payload,
    ...identity,
    siteKeys:uniqueNonEmptyStrings([...(Array.isArray(payload?.siteKeys) ? payload.siteKeys : []),...identity.siteKeys]),
    _id:safe(payload?._id) || makeLocalRecordId("protocol"),
    _offline:true,
    _syncStatus:"local",
    localOnly:true,
    offlineReason:safe(reason),
    savedAt:safe(payload?.savedAt) || new Date().toISOString(),
    offlineSavedAt:new Date().toISOString(),
    syncQueuedAt:new Date().toISOString()
  };
  appendSiteLocalArray("protocolHistory",offlinePayload,site,120);
  invalidateOfflineProtocolCountCache();
  saveOfflineProtocolQueueItem(offlinePayload,site).catch(()=>{});
  saveLocalProtocolToAndroid(site,offlinePayload);
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  if(window.registerSzzBackgroundSync) window.registerSzzBackgroundSync("protocol");
  return offlinePayload;
}

function saveLocalProtocolToAndroid(site,offlinePayload){
  if(!offlinePayload) return false;
  const siteLocalId=androidOfflineSiteLocalId(site);
  const localId=safe(offlinePayload._id) || makeLocalRecordId("protocol");
  return androidOfflineCall("saveLocalProtocol",{
    operationId:`protocol:${localId}`,
    localId,
    sourceLocalId:androidOfflineSourceLocalId(site),
    firebaseId:safe(offlinePayload.firebaseDocId || offlinePayload.siteDocId || ""),
    controlDate:safe(offlinePayload.date || offlinePayload.controlDate || ""),
    savedAt:safe(offlinePayload.savedAt || offlinePayload.offlineSavedAt || "") || new Date().toISOString(),
    technicianEmail:safe(offlinePayload.technicianEmail || currentUser?.email || lastKnownUserEmail() || ""),
    siteLocalId,
    payloadJson:JSON.stringify(offlinePayload)
  });
}

function markAndroidOutboxSynced(operationId){
  const bridge=androidOfflineBridge();
  if(!bridge || typeof bridge.markOutboxSynced!=="function") return false;
  try{
    bridge.markOutboxSynced(operationId);
    return true;
  }catch(e){
    console.warn("Android outbox potvrzení selhalo",e);
    return false;
  }
}

window.addEventListener("szz-android-offline-result",event=>{
  const detail=event?.detail || {};
  if(!detail.ok) return;
  if(detail.action==="draft" || detail.action==="protocol"){
    const st=protocolStatusNode();
    if(st && !/uložen|upravuješ|synchroniz/i.test(st.textContent || "")){
      const when=new Date().toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit",second:"2-digit"});
      setProtocolStatusText(`Uloženo v tabletu ${when}.`);
    }
  }
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(250);
});

let protocolDraftTimer=null;
let protocolDraftRestoreInProgress=false;
const PROTOCOL_DRAFT_COUNT_CACHE_MS=1800;
const OFFLINE_PROTOCOL_COUNT_CACHE_MS=1800;
let protocolDraftCountCache=null;
let protocolDraftCountCacheAt=0;
let protocolDraftCountStorageLength=0;
let offlineProtocolCountCache={count:null,savedAt:0,storageLength:-1};

function clearProtocolDraftCountCache(){
  protocolDraftCountCache=null;
  protocolDraftCountCacheAt=0;
  protocolDraftCountStorageLength=0;
}
window.clearProtocolDraftCountCache=clearProtocolDraftCountCache;
function invalidateOfflineProtocolCountCache(){
  offlineProtocolCountCache={count:null,savedAt:0,storageLength:-1};
  clearOfflineProtocolQueueReadCache();
  invalidateSzzOfflineCountsCache();
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key.startsWith("astipMap:protocolDraft:")) clearProtocolDraftCountCache();
  if(!event.key || event.key.startsWith("astipMap:protocolHistory:")) invalidateOfflineProtocolCountCache();
});

const {
  deleteProtocolDraftFromIndexedDb,
  protocolDraftKey,
  readProtocolDraftFromIndexedDb,
  saveProtocolDraftToIndexedDb
}=createProtocolDraftStorageHelpers({
  getDefaultSite:()=>selectedSite,
  siteLocalCacheKey
});

function clearProtocolDraft(site=selectedSite){
  const key=protocolDraftKey(site);
  const siteLocalId=androidOfflineSiteLocalId(site);
  try{localStorage.removeItem(key);}catch(e){}
  clearLocalStorageObjectEntriesCache(key);
  deleteProtocolDraftFromIndexedDb(site);
  const bridge=androidOfflineBridge();
  if(bridge && typeof bridge.deleteProtocolDraft==="function"){
    try{ bridge.deleteProtocolDraft(`protocol-draft:${siteLocalId}`); }catch(e){}
  }
  clearProtocolDraftCountCache();
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
}

function readProtocolDraft(site=selectedSite){
  try{
    const raw=localStorage.getItem(protocolDraftKey(site));
    const parsed=raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed==="object" && parsed.payload ? parsed : null;
  }catch(e){
    return null;
  }
}

function androidOfflineBridge(){
  try{
    return window.SzzAndroidOffline || null;
  }catch(e){
    return null;
  }
}

function androidOfflineCall(method,payload){
  const bridge=androidOfflineBridge();
  if(!bridge || typeof bridge[method]!=="function") return false;
  try{
    bridge[method](JSON.stringify(payload || {}));
    return true;
  }catch(e){
    console.warn("Android offline bridge selhal",method,e);
    return false;
  }
}

function androidOfflineReadJson(method,limit=5000){
  const bridge=androidOfflineBridge();
  if(!bridge || typeof bridge[method]!=="function") return null;
  try{
    return JSON.parse(String(bridge[method](limit) || "{}"));
  }catch(e){
    console.warn("Android offline čtení selhalo",method,e);
    return null;
  }
}

function readAndroidOfflineCounts(){
  const bridge=androidOfflineBridge();
  if(!bridge || typeof bridge.countsJson!=="function") return null;
  try{
    const parsed=JSON.parse(String(bridge.countsJson() || "{}"));
    return parsed?.ok ? parsed : null;
  }catch(e){
    return null;
  }
}

function androidOutboxOperation(operationId){
  const bridge=androidOfflineBridge();
  if(!bridge || typeof bridge.outboxOperationJson!=="function") return null;
  try{
    const parsed=JSON.parse(String(bridge.outboxOperationJson(String(operationId || "")) || "{}"));
    return parsed?.ok && parsed?.found ? parsed.item || null : null;
  }catch(e){
    return null;
  }
}

function androidOfflineSiteLocalId(site=selectedSite){
  const keys=siteRecordKeys(site);
  return keys[0] || selectedSiteDocId(site) || detailKey(site) || safe(site?.id) || "unknown-site";
}

function androidOfflineSourceLocalId(site=selectedSite){
  return siteSourceIdentity(site) || siteSourceLabel(site) || androidOfflineSiteLocalId(site);
}

function saveProtocolDraftToAndroid(site,draft){
  if(!draft || !draft.payload) return false;
  const siteLocalId=androidOfflineSiteLocalId(site);
  return androidOfflineCall("saveProtocolDraft",{
    draftId:`protocol-draft:${siteLocalId}`,
    siteLocalId,
    sourceLocalId:androidOfflineSourceLocalId(site),
    savedAt:draft.savedAt || new Date().toISOString(),
    payloadJson:JSON.stringify(draft)
  });
}

function readAndroidCachedRecords(method,site=selectedSite,limit=5000){
  const parsed=androidOfflineReadJson(method,limit);
  const items=Array.isArray(parsed?.items) ? parsed.items : [];
  if(!site) return items;
  return items.filter(item=>{
    try{ return recordMatchesSite(item,site); }
    catch(e){ return false; }
  });
}

function saveMediaSnapshotToAndroid(method,site,items){
  if(!Array.isArray(items) || !items.length) return false;
  const compactItems=items.filter(item=>item && typeof item==="object");
  if(!compactItems.length) return false;
  return androidOfflineCall(method,{
    siteLocalId:androidOfflineSiteLocalId(site),
    sourceLocalId:androidOfflineSourceLocalId(site),
    savedAt:new Date().toISOString(),
    items:compactItems
  });
}

function savePhotosSnapshotToAndroid(site,items){
  return saveMediaSnapshotToAndroid("savePhotosSnapshot",site,items);
}

function saveAttachmentsSnapshotToAndroid(site,items){
  return saveMediaSnapshotToAndroid("saveAttachmentsSnapshot",site,items);
}

function saveLocalPhotoToAndroid(site,photoPayload){
  if(!photoPayload) return false;
  const localId=safe(photoPayload._id || photoPayload.id) || makeLocalRecordId("photo");
  const payload={...photoPayload,_id:localId};
  return androidOfflineCall("saveLocalPhoto",{
    operationId:`photo:${localId}`,
    localId,
    sourceLocalId:androidOfflineSourceLocalId(site),
    siteLocalId:androidOfflineSiteLocalId(site),
    payloadJson:JSON.stringify(payload)
  });
}

function saveLocalAttachmentToAndroid(site,attachmentPayload){
  if(!attachmentPayload) return false;
  const localId=safe(attachmentPayload._id || attachmentPayload.id) || makeLocalRecordId("attachment");
  const siteLocalId=androidOfflineSiteLocalId(site);
  const roomLocalId=`${siteLocalId}:${localId}`;
  const payload={...attachmentPayload,_id:localId};
  return androidOfflineCall("saveLocalAttachment",{
    operationId:`attachment:${roomLocalId}`,
    localId:roomLocalId,
    attachmentId:localId,
    sourceLocalId:androidOfflineSourceLocalId(site),
    siteLocalId,
    payloadJson:JSON.stringify(payload)
  });
}

function saveProtocolDraftNow(){
  if(protocolDraftRestoreInProgress || protocolEditState || !selectedSite) return;
  const form=formFieldNode("protocolForm");
  if(!form || form.style.display==="none") return;
  try{
    const payload=protocolPayload();
    const draft={
      savedAt:new Date().toISOString(),
      siteKey:siteRecordKeys(selectedSite)[0] || selectedSite.id || "",
      payload
    };
    const key=protocolDraftKey(selectedSite);
    localStorage.setItem(key,JSON.stringify(draft));
    clearLocalStorageObjectEntriesCache(key);
    saveProtocolDraftToAndroid(selectedSite,draft);
    saveProtocolDraftToIndexedDb(selectedSite,draft).then(saved=>{
      if(!saved) return;
      try{
        localStorage.setItem(key,JSON.stringify({
          savedAt:draft.savedAt,
          siteKey:draft.siteKey,
          storage:"indexedDB"
        }));
        clearLocalStorageObjectEntriesCache(key);
      }catch(e){}
    });
    clearProtocolDraftCountCache();
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(250);
    const st=protocolStatusNode();
    if(st && !/uložen|upravuješ/i.test(st.textContent || "")){
      setProtocolStatusText("Rozepsaný protokol se průběžně ukládá v tomto zařízení.");
    }
  }catch(e){
    console.warn("Koncept protokolu se nepodařilo uložit",e);
  }
}
window.saveProtocolDraftNow=saveProtocolDraftNow;
window.flushSzzAndroidOffline=saveProtocolDraftNow;

function scheduleProtocolDraftSave(){
  if(protocolDraftRestoreInProgress || protocolEditState) return;
  clearTimeout(protocolDraftTimer);
  protocolDraftTimer=setTimeout(saveProtocolDraftNow,450);
}

function bindProtocolDraftAutosave(){
  const form=formFieldNode("protocolForm");
  if(!form || form.__protocolDraftBound) return;
  form.__protocolDraftBound="1";
  form.addEventListener("input",scheduleProtocolDraftSave);
  form.addEventListener("change",scheduleProtocolDraftSave);
}

function applyProtocolDraftToForm(draft){
  if(!draft || !draft.payload) return false;
  protocolDraftRestoreInProgress=true;
  try{
    fillProtocolFormFromHistory(draft.payload);
    const when=protocolDisplayDate(draft.savedAt || "");
    setProtocolStatusText(`Obnoven rozepsaný protokol uložený lokálně${when ? ` (${when})` : ""}.`);
    return true;
  }catch(e){
    console.warn("Koncept protokolu se nepodařilo obnovit",e);
    return false;
  }finally{
    protocolDraftRestoreInProgress=false;
  }
}

function restoreProtocolDraftIfAny(site=selectedSite){
  const draft=readProtocolDraft(site);
  if(draft && draft.payload) return applyProtocolDraftToForm(draft);
  const key=protocolDraftKey(site);
  readProtocolDraftFromIndexedDb(site).then(indexedDraft=>{
    if(!indexedDraft || !indexedDraft.payload) return false;
    if(key!==protocolDraftKey(selectedSite) || protocolEditState) return false;
    return applyProtocolDraftToForm(indexedDraft);
  }).catch(e=>console.warn("IndexedDB koncept protokolu se nepodařilo obnovit",e));
  return false;
}

let offlineProtocolSyncRunning=false;

function siteFromOfflineRecord(record={},cacheSuffix=""){
  const recordKeys=recordIdKeys(record);
  for(const key of recordKeys){
    const indexed=findRowByAnyId(key);
    if(indexed) return indexed;
  }
  const suffixKey=safe(cacheSuffix);
  if(suffixKey){
    const indexed=findRowByAnyId(suffixKey) || findRowByAnyId(suffixKey.startsWith("firebase_") ? suffixKey.slice("firebase_".length) : `firebase_${suffixKey}`);
    if(indexed) return indexed;
  }
  let found=null;
  const rowSource=Array.isArray(rows) ? rows : [];
  for(const row of rowSource){
    try{
      const keys=siteRecordKeys(row);
      let keyMatched=false;
      for(const key of recordKeys){
        if(keys.includes(key)){
          keyMatched=true;
          break;
        }
      }
      if(keyMatched || recordMatchesSite(record,row)){
        found=row;
        break;
      }
    }catch(e){
    }
  }
  if(found) return found;
  const docId=safe(record.firebaseDocId || record.siteDocId || (/^[-A-Za-z0-9_]{6,}$/.test(cacheSuffix) && !cacheSuffix.startsWith("firebase_") ? cacheSuffix : ""));
  const siteKey=safe(record.siteKey || record.siteId || cacheSuffix || (docId ? `firebase_${docId}` : "offline_site"));
  const raw={
    "Klíč_adresy":siteKey,
    "Název":safe(record.siteName || record.place || record.siteAddress || ""),
    "Adresa / umístění":safe(record.siteName || record.place || record.siteAddress || ""),
    "Popis_zdroje":safe(record.siteSource || record.deviceType || ""),
    "Zdroj":safe(record.serial || "")
  };
  if(docId) raw["Firebase_doc_id"]=docId;
  if(record.lat) raw["GPS_lat"]=record.lat;
  if(record.lon) raw["GPS_lon"]=record.lon;
  return {
    id:siteKey,
    raw,
    firebaseDocId:docId,
    firebaseData:{raw},
    adresa:raw["Adresa / umístění"] || raw["Název"],
    zdroj:raw["Popis_zdroje"],
    lat:num(raw["GPS_lat"]),
    lon:num(raw["GPS_lon"])
  };
}

function pendingOfflineProtocolSiteRefs(){
  const byKey=new Map();
  const entries=localStorageArrayEntries("astipMap:protocolHistory:");
  for(const entry of entries){
    const pending=pendingOfflineItemSummary(entry.items);
    if(!pending.count) continue;
    const site=siteFromOfflineRecord(pending.first,entry.suffix);
    const key=selectedSiteDocId(site) || detailKey(site) || site.id || entry.suffix;
    byKey.set(key,{site,count:pending.count});
  }
  return Array.from(byKey.values());
}

async function pendingOfflineProtocolSiteRefsAsync(){
  const byKey=new Map();
  const indexed=await readAllOfflineProtocolQueueItems();
  for(const item of indexed){
    const site=siteFromOfflineRecord(item,item.siteCacheKey ? String(item.siteCacheKey).replace("astipMap:protocolHistory:","") : "");
    const key=selectedSiteDocId(site) || detailKey(site) || site.id || item.siteCacheKey || item._id;
    const current=byKey.get(key);
    byKey.set(key,{site,count:(current?.count || 0)+1});
  }
  if(!byKey.size){
    const refs=pendingOfflineProtocolSiteRefs();
    for(const ref of refs){
      const key=selectedSiteDocId(ref.site) || detailKey(ref.site) || ref.site?.id || "";
      if(key) byKey.set(key,ref);
    }
  }
  return Array.from(byKey.values());
}

function pendingOfflineItemSummary(items=[]){
  const source=Array.isArray(items) ? items : [];
  let first=null;
  let count=0;
  for(const item of source){
    if(!isPendingOfflineProtocolItem(item)) continue;
    if(!first) first=item;
    count++;
  }
  return {first,count};
}

function matchingPendingOfflineItemsForSite(items=[],site=selectedSite){
  const out=[];
  const source=Array.isArray(items) ? items : [];
  for(const item of source){
    if(isPendingOfflineProtocolItem(item) && recordMatchesSite(item,site)) out.push(item);
  }
  return out;
}

async function syncOfflineProtocolsForSite(site=selectedSite,options={}){
  if(offlineProtocolSyncRunning) return 0;
  if(!site || !firebaseReady || !db || !fb.fsMod || !currentUser || navigator.onLine===false) return 0;
  const localItems=readSiteLocalArray("protocolHistory",site);
  const indexedItems=await readOfflineProtocolQueueItems(site);
  const offlineItems=matchingPendingOfflineItemsForSite(uniqueByOfflineIdFromLists([localItems,indexedItems]),site);
  if(!offlineItems.length) return 0;
  offlineProtocolSyncRunning=true;
  let synced=0;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const identity=siteRecordIdentity(site);
    for(const item of offlineItems){
      const id=safe(item._id) || makeLocalRecordId("protocol");
      const androidOperation=androidOutboxOperation(`protocol:${id}`);
      if(String(androidOperation?.status || "").toUpperCase()==="SYNCED"){
        removeSiteLocalItem("protocolHistory",id,site);
        await removeOfflineProtocolQueueItem(id);
        markAndroidOutboxSynced(`protocol:${id}`);
        synced++;
        continue;
      }
      const payload={
        ...item,
        ...identity,
        siteKeys:uniqueNonEmptyStrings([...(Array.isArray(item.siteKeys) ? item.siteKeys : []),...identity.siteKeys]),
        _id:id,
        _offline:false,
        _syncStatus:"online",
        syncedAt:new Date().toISOString(),
        syncedBy:currentUser.email || "",
        updatedBy:currentUser.email || item.updatedBy || "",
        createdBy:item.createdBy || currentUser.email || "",
        savedAt:item.savedAt || item.offlineSavedAt || new Date().toISOString()
      };
      const childOk=await saveSiteChildItem("protocols",id,payload,site);
      if(!childOk) await appendEmbeddedSiteItem("protocolHistory",payload,site);
      await appendEmbeddedSiteItem("protocolRefs",{
        _id:id,
        siteId:payload.siteId,
        siteLegacyId:payload.siteLegacyId,
        siteDocId:payload.siteDocId,
        siteKey:payload.siteKey,
        firebaseDocId:payload.firebaseDocId,
        siteKeys:payload.siteKeys,
        sourceGroupKey:payload.sourceGroupKey,
        sourceIdentity:payload.sourceIdentity,
        date:payload.date,
        createdAt:payload.createdAt || payload.savedAt
      },site);
      await setDoc(doc(db,"protocols",id),{
        ...payload,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
      await updateSiteControlDateFromProtocol(payload,site,{clearManualStatus:item.clearManualStatusAfterSave !== false});
      removeSiteLocalItem("protocolHistory",id,site);
      await removeOfflineProtocolQueueItem(id);
      markAndroidOutboxSynced(`protocol:${id}`);
      appendSiteLocalArray("protocolHistory",payload,site,120);
      synced++;
    }
  }catch(e){
    console.warn("Synchronizace offline protokolů selhala",e);
  }finally{
    offlineProtocolSyncRunning=false;
  }
  if(synced && !options.silent){
    showSaveConfirmation(synced===1 ? "Offline protokol uložen online." : `Offline protokoly uloženy online: ${synced}.`);
  }
  if(synced && window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  return synced;
}
window.syncOfflineProtocolsForSite=syncOfflineProtocolsForSite;

async function syncAllOfflineProtocols(options={}){
  if(!firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return 0;
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return 0;
  const refs=await pendingOfflineProtocolSiteRefsAsync();
  let total=0;
  for(const ref of refs){
    total+=await syncOfflineProtocolsForSite(ref.site,{silent:true});
  }
  if(total && !options.silent){
    showSaveConfirmation(total===1 ? "Offline protokol uložen online." : `Offline protokoly uloženy online: ${total}.`);
  }
  return total;
}
window.syncAllOfflineProtocols=syncAllOfflineProtocols;

const SITE_CHILD_ITEMS_CACHE_MS=30000;
const siteChildItemsCache=new Map();

function siteChildItemsCacheKey(kind,site=selectedSite){
  const cleanKind=safe(kind);
  const docId=selectedSiteDocId(site);
  if(!cleanKind || !docId) return "";
  return [cleanKind,docId,currentUserEmail()].join("|");
}

function cloneSiteChildItems(items=[]){
  const source=Array.isArray(items) ? items : [];
  const out=[];
  for(const item of source){
    out.push(item && typeof item==="object" ? {...item} : item);
  }
  return out;
}

function readSiteChildItemsCache(kind,site=selectedSite){
  const key=siteChildItemsCacheKey(kind,site);
  if(!key) return null;
  const cached=siteChildItemsCache.get(key);
  if(!cached) return null;
  if(Date.now()-cached.savedAt>SITE_CHILD_ITEMS_CACHE_MS){
    siteChildItemsCache.delete(key);
    return null;
  }
  return cloneSiteChildItems(cached.items);
}

function writeSiteChildItemsCache(kind,site=selectedSite,items=[]){
  const key=siteChildItemsCacheKey(kind,site);
  if(!key) return;
  siteChildItemsCache.set(key,{
    savedAt:Date.now(),
    items:cloneSiteChildItems(items)
  });
}

function clearSiteChildItemsCache(kind=null,site=selectedSite){
  const cleanKind=kind ? safe(kind) : "";
  const docId=selectedSiteDocId(site);
  if(!cleanKind && !docId){
    siteChildItemsCache.clear();
    return;
  }
  siteChildItemsCache.forEach((_value,key)=>{
    const [cachedKind,cachedDocId]=String(key || "").split("|");
    if((!cleanKind || cachedKind===cleanKind) && (!docId || cachedDocId===docId)){
      siteChildItemsCache.delete(key);
    }
  });
}
window.clearSiteChildItemsCache=clearSiteChildItemsCache;

async function saveSiteChildItem(kind,id,item,site=selectedSite){
  const docId=selectedSiteDocId(site);
  const cleanId=safe(id || item?._id);
  if(!docId || !cleanId || !firebaseReady || !db || !fb.fsMod) return false;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    await setDoc(doc(db,"sitesUnified",docId,kind,cleanId),{
      ...item,
      _id:cleanId,
      siteDocId:docId,
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
    },{merge:true});
    try{
      await setDoc(doc(db,"sitesUnified",docId),{
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
    }catch(e){
      console.warn("Označení změny bodu po uložení položky selhalo",kind,e);
    }
    clearSiteChildItemsCache(kind,site);
    clearDetailHistoryCacheForKind(kind,site);
    return true;
  }catch(e){
    console.warn("Uložení pod bod selhalo",kind,e);
    return false;
  }
}

async function loadSiteChildItems(kind,site=selectedSite){
  const docId=selectedSiteDocId(site);
  if(!docId || !firebaseReady || !db || !fb.fsMod) return [];
  const cached=readSiteChildItemsCache(kind,site);
  if(cached) return cached;
  try{
    const {collection,getDocs}=fb.fsMod;
    const snap=await getDocs(collection(db,"sitesUnified",docId,kind));
    const items=[];
    snap.forEach(docSnap=>{
      items.push({...docSnap.data(),_id:docSnap.id});
    });
    writeSiteChildItemsCache(kind,site,items);
    const localKind=siteChildLocalKind(kind);
    if(localKind) mergeSiteLocalArray(localKind,items.map(item=>({
      ...item,
      _collection:item._collection || `site${kind}`,
      _type:item._type || siteChildTypeLabel(kind)
    })),site,(localKind==="photos" || localKind==="attachments") ? 180 : 180);
    return cloneSiteChildItems(items);
  }catch(e){
    console.warn("Načtení položek pod bodem selhalo",kind,e);
    return [];
  }
}

async function loadSiteChildItemsDelta(kind,site=selectedSite,sinceMs=0){
  const docId=selectedSiteDocId(site);
  const localKind=siteChildLocalKind(kind);
  if(!docId || !localKind || !sinceMs || !firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return [];
  const items=[];
  const itemDedupe=createRecordIdDedupe(items);
  const addDocSnap=docSnap=>{
    if(!docSnap || !docSnap.id || typeof docSnap.data!=="function") return;
    itemDedupe.add({
      ...docSnap.data(),
      _id:docSnap.id,
      _collection:`site${kind}`,
      _type:siteChildTypeLabel(kind)
    });
  };
  try{
    const {collection}=fb.fsMod;
    await readFirestoreDocsUpdatedSince(
      ()=>collection(db,"sitesUnified",docId,kind),
      siteChildDeltaFields(kind),
      sinceMs,
      addDocSnap,
      `Rozdílové načtení ${kind} selhalo`
    );
    if(items.length){
      const merged=mergeSiteLocalArray(localKind,items,site,kind==="photos" ? 180 : 180);
      writeSiteChildItemsCache(kind,site,merged);
    }
    return cloneSiteChildItems(items);
  }catch(e){
    console.warn("Rozdílové načtení položek pod bodem selhalo",kind,e);
    return [];
  }
}

async function loadSiteChildItemsForOffline(kind,site=selectedSite,sinceMs=0){
  const localKind=siteChildLocalKind(kind);
  const hasLocal=localKind ? readSiteLocalArray(localKind,site).length>0 : false;
  if(!sinceMs || !hasLocal) return loadSiteChildItems(kind,site);
  return loadSiteChildItemsDelta(kind,site,sinceMs);
}

async function deleteSiteChildItem(kind,id,site=selectedSite){
  const docId=selectedSiteDocId(site);
  const cleanId=safe(id);
  if(!docId || !cleanId || !firebaseReady || !db || !fb.fsMod) return false;
  try{
    const {doc,deleteDoc}=fb.fsMod;
    await deleteDoc(doc(db,"sitesUnified",docId,kind,cleanId));
    clearSiteChildItemsCache(kind,site);
    clearDetailHistoryCacheForKind(kind,site);
    return true;
  }catch(e){
    console.warn("Smazání položky pod bodem selhalo",kind,e);
    return false;
  }
}

async function removeEmbeddedSiteItem(field,id,site=selectedSite){
  const docId=selectedSiteDocId(site);
  const cleanId=safe(id);
  if(!docId || !cleanId || !firebaseReady || !db || !fb.fsMod) return false;
  try{
    const {doc,setDoc,getDoc,serverTimestamp}=fb.fsMod;
    const ref=doc(db,"sitesUnified",docId);
    let current=[];
    try{
      const snap=await getDoc(ref);
      const data=snap.exists() ? (snap.data() || {}) : {};
      current=Array.isArray(data[field]) ? data[field].slice() : [];
    }catch(e){
      current=Array.isArray(site?.firebaseData?.[field]) ? site.firebaseData[field].slice() : [];
    }
    const next=szzArrayWithoutItemId(current,cleanId,safe);
    await setDoc(ref,{[field]:next,updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()},{merge:true});
    if(site){
      site.firebaseData=site.firebaseData || {};
      site.firebaseData[field]=next;
    }
    clearDetailHistoryCacheForKind(field,site);
    return true;
  }catch(e){
    console.warn("Smazání vložené položky selhalo",field,e);
    return false;
  }
}

async function appendEmbeddedSiteItem(field,item,site=selectedSite){
  const docId=selectedSiteDocId(site);
  if(!docId || !firebaseReady || !db) return false;
  const dataItem={...item};
  try{
    const {doc,setDoc,getDoc,serverTimestamp}=fb.fsMod;
    const ref=doc(db,"sitesUnified",docId);
    let current=[];
    try{
      const snap=await getDoc(ref);
      const data=snap.exists() ? (snap.data() || {}) : {};
      current=Array.isArray(data[field]) ? data[field].slice() : [];
    }catch(e){
      current=Array.isArray(site?.firebaseData?.[field]) ? site.firebaseData[field].slice() : [];
    }
    const itemId=safe(dataItem._id);
    if(itemId){
      current=current.filter(existing=>safe(existing && existing._id)!==itemId);
    }
    current.push(dataItem);
    if(field!=="photos" && current.length>80) current=current.slice(-80);
    await setDoc(doc(db,"sitesUnified",docId),{
      [field]:current,
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
    },{merge:true});
    if(site){
      site.firebaseData=site.firebaseData || {};
      site.firebaseData[field]=current;
    }
    clearDetailHistoryCacheForKind(field,site);
    return true;
  }catch(e){
    console.warn("Záložní uložení do místa selhalo",field,e);
    return false;
  }
}

function protocolDateIso(item){
  return isoDateFromAny(item?.date || item?.checkDate || item?.createdAt || "");
}

function protocolTimeValue(item){
  const saved=protocolSavedTimeValue(item);
  if(saved) return saved;
  const iso=protocolDateIso(item);
  const d=parseDateValue(iso);
  if(d) return d.getTime();
  return historyTimeValue(item);
}

function latestProtocolDateFromSiteData(data){
  const protocols=Array.isArray(data?.protocolHistory) ? data.protocolHistory : [];
  let latestItem=null;
  let latestTime=-Infinity;
  for(const item of protocols){
    const time=protocolTimeValue(item);
    if(!Number.isFinite(time) || time<=0) continue;
    if(!latestItem || time>latestTime){
      latestItem=item;
      latestTime=time;
    }
  }
  return latestItem ? protocolDateIso(latestItem) : isoDateFromAny(data?.latestProtocolDate || "");
}

function applyLatestProtocolDateToRaw(raw,data){
  const out={...(raw || {})};
  const latest=latestProtocolDateFromSiteData(data);
  if(!latest) return out;
  const months=Number(detectControlPeriod(out)) || periodMonths({raw:out});
  out["Perioda kontrol"]=String(months);
  out["Poslední_kontrola"]=latest;
  const last=parseDateValue(latest);
  if(last){
    out["Příští_kontrola"]=dateInputValueFromAny(addMonths(last, months));
  }
  return out;
}

function applyLatestProtocolToSite(protocol,site=selectedSite){
  if(!protocol || !site) return;
  const raw=applyLatestProtocolDateToRaw(site.raw || {},{protocolHistory:[protocol]});
  applyProtocolFieldsToRaw(raw,protocol);
  site.raw=raw;
  const refreshed=normalize([raw])[0];
  Object.assign(site, refreshed, {
    id:site.id,
    i:site.i,
    firebaseDocId:site.firebaseDocId || raw["Firebase_doc_id"] || "",
    firebaseData:site.firebaseData || {}
  });
  if(selectedSite && detailKey(selectedSite)===detailKey(site)) selectedSite=site;
}

function protocolRepairHistoryEntry(protocol={}){
  const note=safe(protocol.notes).replace(/\s+/g," ").trim();
  if(!note) return "";
  const date=protocolDisplayDate(protocol.savedAt || protocol.updatedAt || protocol.createdAt || protocol.date || new Date().toISOString());
  return `${date ? `${date} - ` : ""}${note}`;
}

function appendProtocolNoteToRepairHistory(raw={},protocol={}){
  const entry=protocolRepairHistoryEntry(protocol);
  if(!entry) return raw;
  const current=safe(raw["Historie oprav"] || raw["Historie_oprav"] || "");
  const lines=current.split(/\r?\n/).map(line=>safe(line)).filter(Boolean);
  if(lines.some(line=>line===entry)) return raw;
  const history=[entry,...lines].join("\n");
  raw["Historie oprav"]=history;
  raw["Historie_oprav"]=history;
  return raw;
}

function applyRawValueAliases(raw,keys,value){
  const text=safe(value);
  if(!text) return raw;
  keys.forEach(key=>{ raw[key]=text; });
  return raw;
}

function applyProtocolFieldsToRaw(raw,protocol={}){
  const out=raw || {};
  const device=safe(protocol.deviceType || protocol.selectedDevice);
  const serial=safe(protocol.serial);
  const location=safe(protocol.pbzLocation);
  const breakers=safe(protocol.breakersLocation);
  const testProcedure=safe(protocol.testProcedure);
  const contacts=safe(protocol.contacts);
  const backedSummary=historyObjectSummary(protocol.backedDevices);
  const accessSummary=historyObjectSummary(protocol.access);
  const availabilitySummary=historyObjectSummary(protocol.availability);
  const state=protocolSourceStateValue(protocol);
  if(device){
    out["Popis_zdroje"]=device;
    out["Kontrolované zařízení"]=device;
    out["Typ zařízení"]=device;
  }
  if(serial){
    out["Zdroj"]=serial;
    out["Výrobní číslo"]=serial;
    out["Výrobní_číslo"]=serial;
  }
  if(location){
    out["Umístění zdroje"]=location;
    out["Umístění"]=location;
    out["Umístění PBZ v objektu"]=location;
  }
  applyRawValueAliases(out,["Počet baterií","Počet baterií (ks)","Pocet baterii","Baterie ks"],protocol.batteryCount);
  applyRawValueAliases(out,["Kapacita","Kapacita (Ah)","Kapacita Ah","Ah"],protocol.capacityAh);
  applyRawValueAliases(out,["Počet sad","Počet sad (ks)","Pocet sad","Sady ks"],protocol.setCount);
  applyRawValueAliases(out,["Pom. Bat","Pom. Bat (Ah)","Pomocná baterie","Pom baterie"],protocol.auxBatteryAh);
  if(breakers){
    out["Jistič UPS"]=breakers;
    out["Jističe UPS"]=breakers;
    out["Umístění jističů"]=breakers;
  }
  if(testProcedure){
    out["Postup testování"]=testProcedure;
    out["Postup testovani"]=testProcedure;
  }
  if(contacts){
    out["Kontakt"]=contacts;
    out["Kontakt_mapy"]=contacts;
    out["Hlavní kontakt"]=contacts;
    out["Upravený kontakt"]=contacts;
  }
  if(backedSummary){
    out["Typ a umístění zálohovaných zařízení"]=backedSummary;
    out["Zálohovaná zařízení"]=backedSummary;
  }
  if(safe(protocol.controlLocation)){
    out["Umístění zálohovaných zařízení"]=safe(protocol.controlLocation);
    out["Umístění ovládání"]=safe(protocol.controlLocation);
    out["Ovládání zálohovaných zařízení"]=safe(protocol.controlLocation);
  }
  if(accessSummary){
    out["Parkování a vstup do objektu, předepsané OOPP"]=accessSummary;
    out["Parkování a vstup"]=accessSummary;
    out["OOPP"]=accessSummary;
  }
  if(availabilitySummary){
    out["Dostupnost"]=availabilitySummary;
  }
  if(state==="stop"){
    applyStopStatusRawPatch(out,true,out);
  }else if(state==="ok"){
    applyStopStatusRawPatch(out,false,out);
  }
  appendProtocolNoteToRepairHistory(out,protocol);
  return out;
}

function applyProtocolFieldsToSite(protocol,site=selectedSite){
  if(!protocol || !site) return;
  const raw=applyProtocolFieldsToRaw({...(site.raw || {})},protocol);
  site.raw=raw;
  const refreshed=normalize([raw])[0];
  Object.assign(site, refreshed, {
    id:site.id,
    i:site.i,
    firebaseDocId:site.firebaseDocId || raw["Firebase_doc_id"] || "",
    firebaseData:{...(site.firebaseData || {}), raw}
  });
  if(selectedSite && detailKey(selectedSite)===detailKey(site)) selectedSite=site;
}

function clearManualStatusRaw(raw={}){
  const patch=mapStatusRawPatchFromStatePatch({ordered:false,repairOrdered:false,stopped:false},raw);
  Object.assign(raw,patch);
  clearRawStatusTextWhere(raw,raw,value=>
    rawStatusTextLooksOrdered(value) ||
    rawStatusTextLooksRepairOrdered(value) ||
    rawStatusTextLooksStopped(value)
  );
  clearRawStatusColorWhere(raw,raw,value=>
    rawStatusColorLooksOrdered(value) ||
    rawStatusColorLooksRepairOrdered(value) ||
    rawStatusColorLooksStopped(value)
  );
  return raw;
}

function manualStatusSiteMatches(row,site,selectedKey,docId){
  if(!row || !site) return false;
  const rowDocId=selectedSiteDocId(row);
  return row===site
    || detailKey(row)===selectedKey
    || row.id===selectedKey
    || (!!docId && rowDocId===docId);
}

function clearManualStatusEditCache(site=selectedSite){
  if(!site) return;
  const keys=[
    detailKey(site),
    site.id,
    selectedSiteDocId(site),
    site.firebaseDocId,
    site.raw && site.raw["Firebase_doc_id"]
  ].map(safe).filter(Boolean);
  [...new Set(keys)].forEach(key=>{
    const existing=editCache[key] || {};
    editCache[key]={
      ...existing,
      ordered:false,
      repairOrdered:false,
      stopped:false,
      rawEdits:clearManualStatusRaw({...(existing.rawEdits || {})}),
      updatedBy:currentUser?.email || existing.updatedBy || "",
      updatedAt:new Date().toISOString()
    };
  });
}

function clearManualStatusLocalState(site=selectedSite){
  if(!site) return;
  const selectedKey=detailKey(site) || site.id;
  const docId=selectedSiteDocId(site);
  clearManualStatusEditCache(site);
  const applyClear=(target)=>{
    const raw=clearManualStatusRaw({...(target.raw || {})});
    const refreshed=normalize([raw])[0];
    return {
      ...target,
      ...refreshed,
      raw,
      ordered:false,
      repairOrdered:false,
      stopped:false,
      firebaseDocId:target.firebaseDocId || raw["Firebase_doc_id"] || "",
      firebaseData:{...(target.firebaseData || {}),raw}
    };
  };
  const lookupKey=safe(docId || selectedKey);
  const indexedRow=(lookupKey && findRowByAnyId(lookupKey)) || site;
  const index=rowIndexForRow(indexedRow);
  if(indexedRow && index>=0){
    const nextRows=rows.slice();
    const updated=applyClear(indexedRow);
    nextRows[index]=updated;
    rows=nextRows;
    window.rows=rows;
    selectedSite=updated;
    return;
  }
  rows=rows.map(row=>manualStatusSiteMatches(row,site,selectedKey,docId) ? applyClear(row) : row);
  window.rows=rows;
  selectedSite=(lookupKey && findRowByAnyId(lookupKey)) || applyClear(site);
}

function refreshSelectedDetailDataView(){
  if(!selectedSite) return;
  const table=detailTableNode();
  if(table && !table.classList.contains("data-edit-table")){
    renderDetailTable(table,selectedSite);
  }
  showControlDateDisplay(selectedSite);
  const sub=detailSubNode();
  if(sub) sub.textContent=siteSourceLabel(selectedSite) || "";
  syncOpenProtocolContactFromDetail(selectedSite);
  syncOpenProtocolDeviceTypeFromDetail(selectedSite);
}

async function refreshSiteDataFromFirebase(site=selectedSite){
  const docId=selectedSiteDocId(site);
  if(!docId || !firebaseReady || !db || !fb.fsMod) return null;
  try{
    const {doc,getDoc}=fb.fsMod;
    const snap=await getDoc(doc(db,"sitesUnified",docId));
    if(!snap.exists()) return null;
    const data=snap.data() || {};
    const mergedRaw=applyLatestProtocolDateToRaw({...(site?.raw||{}), ...(data.raw||{})}, data);
    if(site){
      site.firebaseData=data;
      site.raw=mergedRaw;
      const refreshed=normalize([mergedRaw])[0];
      Object.assign(site, refreshed, {
        id:site.id,
        i:site.i,
        firebaseDocId:docId,
        firebaseData:data
      });
    }
    if(selectedSite && detailKey(selectedSite)===detailKey(site)){
      selectedSite=site;
    }
    return data;
  }catch(e){
    console.warn("Čerstvé načtení dat bodu selhalo",e);
    return null;
  }
}

async function updateSiteControlDateFromProtocol(protocol,site=selectedSite,options={}){
  const docId=selectedSiteDocId(site);
  const latest=protocolDateIso(protocol);
  if(!docId || !firebaseReady || !db) return false;
  const baseRaw={...(site?.raw || {})};
  const raw=latest ? applyLatestProtocolDateToRaw(baseRaw,{protocolHistory:[protocol]}) : baseRaw;
  applyProtocolFieldsToRaw(raw,protocol);
  if(options.clearManualStatus) clearManualStatusRaw(raw);
  raw["Firebase_doc_id"]=docId;
  if(!raw["Klíč_adresy"]) raw["Klíč_adresy"]="firebase_"+docId;
  try{
    const {doc,setDoc,serverTimestamp}=fb.fsMod;
    const updatePayload={
      raw,
      dedupKeys:typeof window.siteDedupKeysFromRaw==="function" ? window.siteDedupKeysFromRaw(raw) : [],
      updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString(),
      updatedBy:currentUser?.email || ""
    };
    if(latest) updatePayload.latestProtocolDate=latest;
    await setDoc(doc(db,"sitesUnified",docId),updatePayload,{merge:true});
    if(site){
      site.raw=raw;
      const refreshed=normalize([raw])[0];
      Object.assign(site, refreshed, {
        id:site.id,
        i:site.i,
        firebaseDocId:docId,
        firebaseData:{
          ...(site.firebaseData || {}),
          raw,
          ...(latest ? {latestProtocolDate:latest} : {})
        }
      });
    }
    if(options.clearManualStatus) clearManualStatusLocalState(site);
    return true;
  }catch(e){
    console.warn("Uložení poslední kontroly z protokolu selhalo",e);
    return false;
  }
}

function isHistoryAdmin(){
  return isAppAdmin();
}

function prependHistoryNotice(message){
  const history=detailHistoryNode();
  if(!history) return;
  const note=document.createElement("p");
  note.className="small";
  note.textContent=message;
  history.prepend(note);
}

async function deleteCurrentHistoryProtocol(){
  const item=detailHistoryItems[detailHistoryIndex];
  if(!item || item._type!=="Protokol" || !item._id) return;
  if(!isHistoryAdmin()){
    prependHistoryNotice("Mazat protokoly může jen správce.");
    return;
  }
  if(!confirm("Opravdu smazat tento uložený protokol z historie?")) return;
  try{
    const {doc,deleteDoc,setDoc,serverTimestamp}=fb.fsMod;
    try{ await deleteDoc(doc(db,"protocols",item._id)); }catch(e){ console.warn("Samostatný protokol se nepodařilo smazat",e); }
    const docId=selectedSiteDocId(selectedSite);
    if(docId){
      try{ await deleteDoc(doc(db,"sitesUnified",docId,"protocols",item._id)); }catch(e){ console.warn("Protokol pod bodem se nepodařilo smazat",e); }
      const currentData=selectedSite?.firebaseData || {};
      const protocolHistory=Array.isArray(currentData.protocolHistory) ? currentData.protocolHistory.filter(p=>String(p?._id || "")!==String(item._id)) : [];
      const protocolRefs=Array.isArray(currentData.protocolRefs) ? currentData.protocolRefs.filter(p=>String(p?._id || "")!==String(item._id)) : [];
      await setDoc(doc(db,"sitesUnified",docId),{
        protocolHistory,
        protocolRefs,
        updatedAt:serverTimestamp ? serverTimestamp() : new Date().toISOString()
      },{merge:true});
      selectedSite.firebaseData={...currentData,protocolHistory,protocolRefs};
    }
    removeSiteLocalItem("protocolHistory",item._id,selectedSite);
    showSaveConfirmation("Protokol smazán.");
    await loadHistory(selectedSite?.id || item.siteId);
  }catch(e){
    prependHistoryNotice(`Chyba mazání protokolu: ${e.message}`);
  }
}

function bindDetailHistoryActions(history){
  if(!history || history.__szzHistoryActionClickBound) return;
  history.__szzHistoryActionClickBound=true;
  history.addEventListener("click",async event=>{
    const button=event.target.closest && event.target.closest("button");
    if(!button || !history.contains(button)) return;
    const id=button.id || "";
    if(id==="historyPrevBtn"){
      detailHistoryIndex--;
      renderHistory();
      return;
    }
    if(id==="historyNextBtn"){
      detailHistoryIndex++;
      renderHistory();
      return;
    }
    if(id==="deleteHistoryProtocolBtn"){
      await deleteCurrentHistoryProtocol();
      return;
    }
    if(id==="editHistoryProtocolBtn"){
      editCurrentHistoryProtocol();
      return;
    }
    if(id==="exportHistoryProtocolBtn"){
      exportProtocolToWord(detailHistoryItems[detailHistoryIndex]);
      return;
    }
    if(id==="mailHistoryProtocolBtn"){
      const recipient=promptProtocolMailRecipient(detailHistoryItems[detailHistoryIndex]);
      if(!recipient) return;
      button.disabled=true;
      try{
        await sendProtocolByMail(detailHistoryItems[detailHistoryIndex],recipient);
      }catch(e){
        const message=protocolMailErrorText(e);
        setProtocolStatusText(`Chyba odeslání e-mailu: ${message}`);
        showSaveConfirmation(`E-mail: ${protocolMailToastText(e)}`);
      }finally{
        button.disabled=false;
      }
    }
    if(id==="technicianSignatureBtn"){
      await openTechnicianSignatureDialog();
      return;
    }
  });
  history.addEventListener("change",async event=>{
    const input=event.target && event.target.closest ? event.target.closest("#historyHandoffProtocolCheck") : null;
    if(!input || !history.contains(input)) return;
    const item=detailHistoryItems[detailHistoryIndex];
    const label=input.closest(".history-handoff-processing");
    if(label) label.classList.toggle("is-checked",input.checked);
    input.disabled=true;
    try{
      await setDetailHistoryProtocolHandoff(item,input.checked);
      showSaveConfirmation(input.checked ? "Protokol předán ke zpracování." : "Předání protokolu zrušeno.");
      renderHistory();
    }catch(e){
      input.checked=!input.checked;
      if(label) label.classList.toggle("is-checked",input.checked);
      setProtocolStatusText(`Chyba uložení předání: ${e.message}`);
      showSaveConfirmation("Předání se nepodařilo uložit.");
    }finally{
      input.disabled=false;
    }
  });
}

function renderHistory(){
  const history=detailHistoryNode();
  if(!history) return;
  bindDetailHistoryActions(history);
  if(!canViewProtocolHistory()){
    detailHistoryItems=[];
    detailHistoryIndex=0;
    detailHistoryRenderSignature="auth";
    history.textContent="Historii protokolů uvidí přihlášený technik.";
    updateOfficialProtocolSourceInfo();
    return;
  }

  if(!detailHistoryItems.length){
    detailHistoryRenderSignature="empty";
    history.textContent="Zatím žádný záznam.";
    updateOfficialProtocolSourceInfo();
    return;
  }

  if(detailHistoryIndex<0) detailHistoryIndex=0;
  if(detailHistoryIndex>=detailHistoryItems.length) detailHistoryIndex=detailHistoryItems.length-1;

  const d=detailHistoryItems[detailHistoryIndex];
  const canExportProtocol=isProtocolHistoryItem(d);
  const canDeleteProtocol=isHistoryAdmin() && canExportProtocol;
  const protocolState=protocolSourceStateValue(d);
  const protocolStateText=protocolSourceStateLabel(d);
  const protocolTestText=protocolSourceTestMethodLabel(d.sourceTestMethod || d.testMethod);
  const protocolHandoffChecked=protocolHandoffForProcessing(d);
  const rows=[
    ["Typ záznamu", d._type || "Záznam"],
    ["Datum", historyDateLabel(d)],
    ["Uloženo", historySavedDateLabel(d)],
    ["Technik", protocolTechnicianDisplayName(d)],
    ["Zařízení", d.deviceType || d.siteSource || ""],
    ["Výrobní číslo", d.serial || ""],
    ["Adresa", d.place || d.siteAddress || d.siteName || ""],
    ["Umístění PBZ", d.pbzLocation || ""],
    ["Perioda", d.period || ""],
    ["Výsledek", d.result || d.conditions || ""],
    ["Stav zdroje", protocolStateText],
    ["Odzkoušení zdroje", protocolTestText],
    ["Předáno ke zpracování", protocolHandoffChecked ? "ano" : "ne"],
    ["Reset diagnostiky", d.resetDiagnostics || ""],
    ["Baterie", [d.batteryCount ? `${d.batteryCount} ks` : "", d.capacityAh ? `${d.capacityAh} Ah` : "", d.setCount ? `${d.setCount} sad` : ""].filter(Boolean).join(", ")],
    ["Měření AC", [d.inputVac&&`vstup ${d.inputVac} Vac`, d.output1Vac&&`výstup 1 ${d.output1Vac} Vac`, d.output2Vac&&`výstup 2 ${d.output2Vac} Vac`].filter(Boolean).join(", ")],
    ["Měření DC", [d.mainBatVdc&&`hl. bat. ${d.mainBatVdc} Vdc`, d.auxBatVdc&&`pom. bat. ${d.auxBatVdc} Vdc`].filter(Boolean).join(", ")],
    ["Jističe", d.breakersLocation || ""],
    ["Zálohovaná zařízení", historyObjectSummary(d.backedDevices)],
    ["Umístění zálohovaných zařízení", d.controlLocation || ""],
    ["Postup testování", d.testProcedure || ""],
    ["Vstup / OOPP", historyObjectSummary(d.access)],
    ["Kontakty", d.contacts || ""],
    ["Dostupnost", historyObjectSummary(d.availability)],
    ["Zjištění / poznámky", d.issues || d.notes || d.conditionsReason || ""],
    ["Poznámka pro zákazníka", d.customerNote || d.noteForCustomer || ""],
    ["Chceck list", d.checklist || d.checkList || d.chceckList || ""],
    ["Doporučení", d.recommendation || ""],
    ["Podpis objednavatele", d.clientSignatureDataUrl ? "uložen elektronicky" : ""]
  ].filter(([,value])=>safe(value));

  const photos=d._collection==="protocols" ? [] : (d.photoLinks||[]).filter(Boolean);
  const renderSignature=[
    detailLazyKey(selectedSite),
    canViewProtocolHistory() ? "view" : "no-view",
    isHistoryAdmin() ? "admin" : "user",
    detailHistoryIndex,
    detailHistoryItems.length,
    safe(d && (d._id || d.id || "")),
    safe(d && (d._type || "")),
    safe(d && (d._collection || "")),
    canExportProtocol ? "export" : "",
    canDeleteProtocol ? "delete" : "",
    canExportProtocol ? "tech-signature" : "",
    protocolState,
    protocolStateText,
    protocolTestText,
    protocolHandoffChecked ? "handoff" : "",
    protocolTimeValue(d),
    ...rows.flatMap(([label,value])=>[safe(label),safe(value)]),
    ...photos.map(url=>safe(url))
  ].map(value=>`${String(value).length}:${value}`).join("\u001f");
  if(detailHistoryRenderSignature===renderSignature && history.childElementCount) {
    updateOfficialProtocolSourceInfo();
    return;
  }
  detailHistoryRenderSignature=renderSignature;
  const controls=document.createElement("div");
  controls.className="history-controls";
  const prevBtn=document.createElement("button");
  prevBtn.className="secondary";
  prevBtn.type="button";
  prevBtn.id="historyPrevBtn";
  prevBtn.disabled=detailHistoryIndex<=0;
  prevBtn.textContent="Předchozí";
  const counter=document.createElement("div");
  counter.className="history-counter";
  counter.textContent=`${detailHistoryIndex+1} / ${detailHistoryItems.length}`;
  const nextBtn=document.createElement("button");
  nextBtn.className="secondary";
  nextBtn.type="button";
  nextBtn.id="historyNextBtn";
  nextBtn.disabled=detailHistoryIndex>=detailHistoryItems.length-1;
  nextBtn.textContent="Další";
  controls.append(prevBtn,counter,nextBtn);

  const itemEl=document.createElement("div");
  itemEl.className="history-item";
  rows.forEach(([label,value])=>{
    const rowEl=document.createElement("div");
    rowEl.className="history-detail-row";
    const labelEl=document.createElement("span");
    labelEl.textContent=safe(label);
    const valueEl=document.createElement("span");
    valueEl.textContent=safe(value);
    rowEl.append(labelEl,valueEl);
    itemEl.appendChild(rowEl);
  });
  if(protocolStateText){
    const stateEl=document.createElement("div");
    stateEl.className=`history-protocol-state ${protocolState}`;
    stateEl.textContent=protocolTestText && protocolState==="ok" ? `${protocolStateText} - ${protocolTestText}` : protocolStateText;
    itemEl.appendChild(stateEl);
  }
  if(photos.length){
    const photosEl=document.createElement("div");
    photosEl.className="history-photos";
    photos.forEach((url,idx)=>{
      const link=document.createElement("a");
      link.href=safe(url);
      link.target="_blank";
      const img=document.createElement("img");
      img.src=safe(url);
      img.alt=`Foto ${idx+1}`;
      img.loading="lazy";
      img.decoding="async";
      link.appendChild(img);
      photosEl.appendChild(link);
    });
    itemEl.appendChild(photosEl);
  }
  if(canExportProtocol || canDeleteProtocol){
    const actions=document.createElement("div");
    actions.className="history-actions";
    const addAction=(className,id,text)=>{
      const button=document.createElement("button");
      button.className=className;
      button.type="button";
      button.id=id;
      button.textContent=text;
      actions.appendChild(button);
    };
    if(canExportProtocol){
      addAction("secondary","editHistoryProtocolBtn","Upravit protokol");
      addAction("secondary","exportHistoryProtocolBtn","Exportovat do Wordu");
      addAction("secondary","mailHistoryProtocolBtn","Poslat na mail");
      const handoffLabel=document.createElement("label");
      handoffLabel.className=`secondary history-handoff-processing${protocolHandoffChecked ? " is-checked" : ""}`;
      handoffLabel.htmlFor="historyHandoffProtocolCheck";
      const handoffInput=document.createElement("input");
      handoffInput.type="checkbox";
      handoffInput.id="historyHandoffProtocolCheck";
      handoffInput.checked=protocolHandoffChecked;
      const handoffText=document.createElement("span");
      handoffText.textContent="Předán protokol ke zpracování";
      handoffLabel.append(handoffInput,handoffText);
      actions.appendChild(handoffLabel);
    }
    if(canDeleteProtocol) addAction("danger","deleteHistoryProtocolBtn","Smazat protokol");
    if(canExportProtocol) addAction("secondary","technicianSignatureBtn","Podpis technika");
    itemEl.appendChild(actions);
  }
  history.replaceChildren(controls,itemEl);
  updateOfficialProtocolSourceInfo();
}

function matchingHistoryItemsForSite(items=[],site=selectedSite){
  const matched=[];
  const source=Array.isArray(items) ? items : [];
  for(const item of source){
    if(recordMatchesSite(item,site)) matched.push(item);
  }
  return matched;
}

function hasMatchingHistoryItemForSite(items=[],site=selectedSite){
  const source=Array.isArray(items) ? items : [];
  for(const item of source){
    if(recordMatchesSite(item,site)) return true;
  }
  return false;
}

function sortedMatchingHistoryItemsForSite(items=[],site=selectedSite){
  const matched=matchingHistoryItemsForSite(items,site);
  matched.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
  return matched;
}

function firstProtocolHistoryItem(items=[]){
  const source=Array.isArray(items) ? items : [];
  for(const item of source){
    if(item && item._type==="Protokol") return item;
  }
  return null;
}

function latestMatchingHistoryItemForSite(items=[],site=selectedSite){
  const source=Array.isArray(items) ? items : [];
  let latest=null;
  let latestTime=0;
  for(const item of source){
    if(!recordMatchesSite(item,site)) continue;
    const time=protocolTimeValue(item);
    if(!latest || time>latestTime){
      latest=item;
      latestTime=time;
    }
  }
  return latest;
}

async function loadHistory(siteId){
  const history=detailHistoryNode();
  if(!history) return;
  const requestedKey=detailLazyKey(selectedSite);
  const stillSameSite=()=>!requestedKey || requestedKey===detailLazyKey(selectedSite);
  if(!canViewProtocolHistory()){
    detailHistoryItems=[];
    detailHistoryIndex=0;
    history.textContent="Historii protokolů uvidí přihlášený technik.";
    updateOfficialProtocolSourceInfo();
    return;
  }
  let localHistoryItems=null;
  let localHistoryItemsPromise=null;
  const readLocalHistoryItemsOnce=async()=>{
    if(localHistoryItems) return localHistoryItems;
    localHistoryItems=await (localHistoryItemsPromise || readSiteLocalProtocolHistoryItems(selectedSite));
    return localHistoryItems;
  };
  if(selectedSite){
    localHistoryItemsPromise=readSiteLocalProtocolHistoryItems(selectedSite)
      .then(items=>{
        localHistoryItems=items;
        return items;
      })
      .catch(e=>{
        console.warn("Lokální historie protokolů nejde načíst",e);
        localHistoryItems=[];
        return localHistoryItems;
      });
  }
  const showLocalHistoryOnly=async message=>{
    const localItems=await readLocalHistoryItemsOnce();
    if(!stillSameSite()) return false;
    if(localItems.length){
      localItems.sort((a,b)=>protocolTimeValue(b)-protocolTimeValue(a));
      detailHistoryItems=localItems.slice();
      detailHistoryIndex=0;
      renderHistory();
      return true;
    }
    history.textContent=message;
    detailHistoryItems=[];
    detailHistoryIndex=0;
    updateOfficialProtocolSourceInfo();
    return false;
  };
  if(!firebaseReady){
    await showLocalHistoryOnly("Firebase není nastavený, historie se nenačte.");
    return;
  }
  history.textContent="Načítám historii…";
  const signedUser=await waitForFirebaseUser();
  if(!stillSameSite()) return;
  if(!signedUser){
    await showLocalHistoryOnly("Čekám na přihlášení, historie se načte po přihlášení.");
    return;
  }
  await syncOfflineProtocolsForSite(selectedSite,{silent:true});
  if(!stillSameSite()) return;
  const cachedHistoryItems=readDetailHistoryCache(selectedSite);
  if(cachedHistoryItems){
    detailHistoryItems=cachedHistoryItems;
    detailHistoryIndex=0;
    renderHistory();
    return;
  }
  try{
    const [localItems,,childProtocols,childRecords]=await Promise.all([
      readLocalHistoryItemsOnce(),
      refreshSiteDataFromFirebase(selectedSite),
      loadSiteChildItems("protocols",selectedSite),
      loadSiteChildItems("serviceRecords",selectedSite)
    ]);
    if(!stillSameSite()) return;
    localHistoryItems=localItems;
    const {collection,query,where,getDocs,doc,getDoc}=fb.fsMod;
    const items=[];
    const itemDedupe=createRecordIdDedupe(items);
    const addHistoryItem=item=>{
      itemDedupe.add(item);
    };
    childProtocols.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Protokol",_collection:"siteProtocols",_id:item._id || `site_protocol_${idx}`});
    });
    childRecords.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Servisní záznam",_collection:"siteServiceRecords",_id:item._id || `site_service_${idx}`});
    });
    const embeddedProtocols=Array.isArray(selectedSite?.firebaseData?.protocolHistory) ? selectedSite.firebaseData.protocolHistory : [];
    embeddedProtocols.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Protokol",_collection:"embeddedProtocols",_id:item._id || `embedded_protocol_${idx}`});
    });
    localHistoryItems.forEach(addHistoryItem);
    const embeddedRecords=Array.isArray(selectedSite?.firebaseData?.serviceHistory) ? selectedSite.firebaseData.serviceHistory : [];
    embeddedRecords.forEach((item,idx)=>{
      addHistoryItem({...item,_type:"Servisní záznam",_collection:"embeddedServiceRecords",_id:item._id || `embedded_service_${idx}`});
    });
    const initialItems=sortedMatchingHistoryItemsForSite(items,selectedSite);
    if(initialItems.length){
      detailHistoryItems=initialItems;
      detailHistoryIndex=0;
      renderHistory();
    }
    const refTasks=[];
    const protocolRefs=Array.isArray(selectedSite?.firebaseData?.protocolRefs) ? selectedSite.firebaseData.protocolRefs : [];
    protocolRefs.forEach(refItem=>{
      const id=safe(refItem && refItem._id);
      if(!id) return;
      refTasks.push(async()=>{
        if(itemDedupe.has(id)) return;
        try{
          const snap=await getDoc(doc(db,"protocols",id));
          if(snap.exists()) addHistoryItem({...snap.data(),_type:"Protokol",_collection:"protocols",_id:snap.id});
          else addHistoryItem({...refItem,_type:"Protokol",_collection:"protocolRefs",_id:id});
        }catch(e){
          console.warn("Přímé načtení protokolu selhalo",id,e);
          addHistoryItem({...refItem,_type:"Protokol",_collection:"protocolRefs",_id:id});
        }
      });
    });
    const serviceRefs=Array.isArray(selectedSite?.firebaseData?.serviceRefs) ? selectedSite.firebaseData.serviceRefs : [];
    serviceRefs.forEach(refItem=>{
      const id=safe(refItem && refItem._id);
      if(!id) return;
      refTasks.push(async()=>{
        if(itemDedupe.has(id)) return;
        try{
          const snap=await getDoc(doc(db,"serviceRecords",id));
          if(snap.exists()) addHistoryItem({...snap.data(),_type:"Servisní záznam",_collection:"serviceRecords",_id:snap.id});
          else addHistoryItem({...refItem,_type:"Servisní záznam",_collection:"serviceRefs",_id:id});
        }catch(e){
          console.warn("Přímé načtení servisního záznamu selhalo",id,e);
          addHistoryItem({...refItem,_type:"Servisní záznam",_collection:"serviceRefs",_id:id});
        }
      });
    });
    await runBoundedFirestoreTasks(refTasks,6);
    const historySiteIds=[siteId, ...siteRecordKeys(selectedSite)]
      .map(x=>String(x || ""))
      .filter((x,idx,arr)=>x && arr.indexOf(x)===idx);

    async function readCollection(colName,typeLabel){
      try{
        const addDocSnap=docSnap=>{
          const d=docSnap.data();
          addHistoryItem({...d,_type:typeLabel,_collection:colName,_id:docSnap.id});
        };
        const hasMatchingType=()=>items.some(item=>item._type===typeLabel && recordMatchesSite(item,selectedSite));
        const buildTextQueryTasks=()=>{
          const textQueryTasks=[];
          const textKeys=siteRecordTextKeys(selectedSite).slice(0,8);
          for(const value of textKeys){
            for(const field of ["siteName","siteAddress","place"]){
              textQueryTasks.push(async()=>{
                try{
                  const q=query(collection(db,colName),where(field,"==",value));
                  const snap=await getDocs(q);
                  snap.forEach(addDocSnap);
                }catch(e){
                  console.warn("Historie textový dotaz selhal",colName,field,e);
                }
              });
            }
          }
          return textQueryTasks;
        };
        const renderMatchingItems=()=>{
          if(!stillSameSite()) return;
          const finalItems=sortedMatchingHistoryItemsForSite(items,selectedSite);
          if(finalItems.length<=detailHistoryItems.length) return;
          const latestProtocol=firstProtocolHistoryItem(finalItems);
          if(latestProtocol && selectedSite){
            applyLatestProtocolToSite(latestProtocol,selectedSite);
            showControlDateDisplay(selectedSite);
            requestRender();
          }
          detailHistoryItems=finalItems;
          detailHistoryIndex=Math.min(detailHistoryIndex,Math.max(0,detailHistoryItems.length-1));
          writeDetailHistoryCache(selectedSite,finalItems);
          renderHistory();
        };
        const renderLegacyTextMatches=renderMatchingItems;
        const runTextFallback=async(background=false)=>{
          const textQueryTasks=buildTextQueryTasks();
          if(!textQueryTasks.length) return;
          if(!background){
            await runBoundedFirestoreTasks(textQueryTasks,6);
            return;
          }
          runWhenIdle(async()=>{
            const before=items.length;
            await runBoundedFirestoreTasks(textQueryTasks,3);
            if(items.length>before) renderLegacyTextMatches();
          },1600);
        };
        const siteKeysBatchOk=await readFirestoreArrayContainsAny(
          fb.fsMod,
          db,
          colName,
          "siteKeys",
          historySiteIds,
          addDocSnap,
          `Historie dávkový dotaz selhal ${colName}`
        );
        const queryTasks=[];
        for(const field of SITE_RECORD_EQUALITY_FIELDS){
          queryTasks.push(()=>readFirestoreEqualsAny(
            fb.fsMod,
            db,
            colName,
            field,
            historySiteIds,
            addDocSnap,
            `Historie rovnostní dávkový dotaz selhal ${colName}`
          ));
        }
        for(const id of historySiteIds){
          if(!siteKeysBatchOk){
            queryTasks.push(async()=>{
              try{
                const q=query(collection(db,colName),where("siteKeys","array-contains",id));
                const snap=await getDocs(q);
                snap.forEach(addDocSnap);
              }catch(e){
                console.warn("Historie dotaz selhal",colName,"siteKeys",e);
              }
            });
          }
        }
        const runQueryFallback=async(background=false)=>{
          if(!queryTasks.length) return;
          if(!background){
            await runBoundedFirestoreTasks(queryTasks,6);
            return;
          }
          runWhenIdle(async()=>{
            const before=items.length;
            await runBoundedFirestoreTasks(queryTasks,3);
            if(items.length>before) renderMatchingItems();
            await runTextFallback(true);
          },900);
        };
        if(siteKeysBatchOk && hasMatchingType()){
          renderMatchingItems();
          await runQueryFallback(true);
          return;
        }
        await runQueryFallback(false);
        if(hasMatchingType()){
          renderMatchingItems();
          await runTextFallback(true);
          return;
        }
        await runTextFallback(false);
      }catch(e){
        console.warn("Historie kolekce nejde načíst",colName,e);
      }
    }

    await Promise.all([
      readCollection("serviceRecords","Servisní záznam"),
      readCollection("protocols","Protokol")
    ]);
    if(!stillSameSite()) return;

    const finalItems=sortedMatchingHistoryItemsForSite(items,selectedSite);
    if(!finalItems.length){
      detailHistoryItems=[];
      detailHistoryIndex=0;
      writeDetailHistoryCache(selectedSite,[]);
      history.textContent="Zatím žádný záznam.";
      updateOfficialProtocolSourceInfo();
      return;
    }

    const latestProtocol=firstProtocolHistoryItem(finalItems);
    if(latestProtocol && selectedSite){
      applyLatestProtocolToSite(latestProtocol,selectedSite);
      showControlDateDisplay(selectedSite);
      requestRender();
    }
    detailHistoryItems=finalItems;
    detailHistoryIndex=0;
    writeDetailHistoryCache(selectedSite,finalItems);
    renderHistory();
  }catch(e){
    if(stillSameSite()) history.textContent="Chyba načtení historie: "+e.message;
  }
}

window.loadHistory=loadHistory;

let offlineSyncInFlight=null;
let lastAutomaticOfflineSyncAt=0;
const AUTOMATIC_OFFLINE_SYNC_MIN_MS=60000;
function runOfflineSync(reason="manual",silent=false){
  if(navigator.onLine===false) return Promise.resolve(0);
  if(offlineSyncInFlight) return offlineSyncInFlight;
  const isAutomatic=reason!=="manual" && silent;
  if(isAutomatic){
    const now=Date.now();
    if(now-lastAutomaticOfflineSyncAt<AUTOMATIC_OFFLINE_SYNC_MIN_MS) return Promise.resolve(0);
    lastAutomaticOfflineSyncAt=now;
  }
  if(typeof syncOfflineChanges==="function"){
    offlineSyncInFlight=syncOfflineChanges({reason,silent}).finally(()=>{offlineSyncInFlight=null;});
    return offlineSyncInFlight;
  }
  if(selectedSite && typeof syncOfflineProtocolsForSite==="function"){
    offlineSyncInFlight=syncOfflineProtocolsForSite(selectedSite).finally(()=>{offlineSyncInFlight=null;});
    return offlineSyncInFlight;
  }
  return Promise.resolve(0);
}

window.addEventListener("online",()=>{
  runOfflineSync("online").then(count=>{
    if(count && selectedSite){
      if(typeof window.refreshLoadedDetailTabs==="function") window.refreshLoadedDetailTabs(selectedSite);
    }
  });
});

window.addEventListener("offline",()=>{
  if(typeof showSaveConfirmation==="function") showSaveConfirmation("Offline režim. Změny se uloží lokálně.");
});
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible") runOfflineSync("visible",true);
});
window.addEventListener("focus",()=>runOfflineSync("focus",true));



function fixMapView(){
  if(typeof map === "undefined") return;

  try{
    map.invalidateSize(true);

    // donucení znovunačtení dlaždic
    map.eachLayer(layer=>{
      if(layer && layer.redraw){
        try{ layer.redraw(); }catch(e){}
      }
    });

    if(typeof fit==="function") fit();

  }catch(e){
    console.warn("Map refresh error",e);
  }
}

function showApp(options={}){
  const allowWithoutUser=!!(options && options.allowWithoutUser);
  const hasUser=!!(currentUser || window.currentUser || window.__authReadyUser);
  if(!hasUser && !allowWithoutUser){
    window.__mapAppUnlocked=false;
    showLogin();
    return;
  }
  if(window.setStartupAuthChecking) window.setStartupAuthChecking(false);
  if(window.updateAdminAppControls) window.updateAdminAppControls();
  window.__mapAppUnlocked=true;
  if(typeof window.__szzSetAuthState==="function"){
    window.__szzSetAuthState("logged-in");
    const topLogout=document.getElementById("topLogoutBtn");
    if(topLogout){
      if(window.setTopAuthButtonMode) window.setTopAuthButtonMode(hasUser ? "logout" : "login");
      const canTryLogin=hasUser || firebaseReady || window.__firebaseConfigured || !!(window.firebase && window.firebase.auth);
      setDisplayIfChanged(topLogout,canTryLogin ? "block" : "none");
    }
  }else{
    const startup=document.getElementById("startupScreen");
    const app=document.getElementById("mainApp");
    const loginRow=document.getElementById("mainLoginRow");
    const topLogout=document.getElementById("topLogoutBtn");
    setDisplayIfChanged(startup,"none");
    setDisplayIfChanged(app,"grid");
    setDisplayIfChanged(loginRow,"none");
    if(topLogout){
      if(window.setTopAuthButtonMode) window.setTopAuthButtonMode(hasUser ? "logout" : "login");
      const canTryLogin=hasUser || firebaseReady || window.__firebaseConfigured || !!(window.firebase && window.firebase.auth);
      setDisplayIfChanged(topLogout,canTryLogin ? "block" : "none");
    }
  }
  runAfterTwoPaints(()=>{ if(window.mobileFixMap) window.mobileFixMap(); if(window.map) window.map.invalidateSize(true); });
}
function showLogin(){
  if(window.setStartupAuthChecking) window.setStartupAuthChecking(false);
  if(window.updateAdminAppControls) window.updateAdminAppControls();
  window.__mapAppUnlocked=false;
  if(typeof window.__szzSetAuthState==="function"){
    window.__szzSetAuthState("logged-out",{message:""});
  }else{
    const startup=document.getElementById("startupScreen");
    const app=document.getElementById("mainApp");
    const loginRow=document.getElementById("mainLoginRow");
    const topLogout=document.getElementById("topLogoutBtn");
    setDisplayIfChanged(startup,"flex");
    setDisplayIfChanged(app,"none");
    setDisplayIfChanged(loginRow,"none");
    setDisplayIfChanged(topLogout,"none");
  }
}

function showSaveConfirmation(message="Uloženo."){
  const stack=document.getElementById("saveToast");
  if(!stack) return;
  const item=document.createElement("div");
  item.className="save-toast-item";
  item.textContent=message || "Uloženo.";
  stack.appendChild(item);
  requestAnimationFrame(()=>item.classList.add("show"));
  setTimeout(()=>item.classList.add("hide"),2100);
  setTimeout(()=>item.remove(),2700);
}
window.showSaveConfirmation=showSaveConfirmation;

const {
  clearProtocolHandoffOverridesCache,
  protocolHandoffForProcessing,
  protocolHandoffLocalPatch,
  protocolHandoffRemotePatch,
  rememberProtocolHandoffOverride
}=createProtocolHandoffHelpers({
  currentUserEmail,
  getSelectedSite:()=>selectedSite,
  selectedSiteDocId,
  serverTimestamp:()=>fb?.fsMod?.serverTimestamp ? fb.fsMod.serverTimestamp() : new Date().toISOString(),
  storageKey:SZZ_PROTOCOL_HANDOFF_OVERRIDES_KEY
});

const {
  isMainProtocolProcessed,
  mainProtocolControlDateIso,
  mainProtocolHistoryItemOwnedByCurrentUser,
  mainProtocolProcessedLocalPatch,
  mainProtocolProcessedRemotePatch,
  mainProtocolWorkflowLabel,
  mainProtocolWorkflowState,
  patchProtocolProcessedItems
}=createProtocolWorkflowHelpers({
  currentUserEmail,
  protocolHandoffForProcessing,
  serverTimestamp:()=>fb?.fsMod?.serverTimestamp ? fb.fsMod.serverTimestamp() : new Date().toISOString()
});

const {
  bindMainProtocolHistoryControlsDom,
  bindMainProtocolHistoryListClickDom,
  renderMainProtocolHistoryShellDom,
  renderMainProtocolHistoryRowsDom
}=createMainProtocolHistoryViewHelpers({
  canViewAllMainProtocolHistory,
  getMainProtocolHistoryCurrentItems:()=>mainProtocolHistoryCurrentItems,
  getMainProtocolHistoryDateFilter:()=>mainProtocolHistoryDateFilter,
  historyDateLabel,
  historySavedDateLabel,
  isMainProtocolProcessed,
  mainProtocolControlDateIso,
  mainProtocolHistoryItemOwnedByCurrentUser,
  mainProtocolWorkflowLabel,
  mainProtocolWorkflowState,
  openDetailById:key=>window.openDetailById(key),
  protocolGlobalHistoryTitle,
  protocolSourceStateLabel,
  protocolSourceTestMethodLabel,
  protocolTimeValue,
  renderMainProtocolHistoryRows:(list,items)=>renderMainProtocolHistoryRows(list,items),
  resetMainProtocolHistoryRenderSignature:()=>{mainProtocolHistoryRenderSignature="";},
  setMainProtocolHistoryDateFilter:value=>{mainProtocolHistoryDateFilter=value || "";},
  setMainProtocolHistoryProcessed,
  showSaveConfirmation
});

window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_PROTOCOL_HANDOFF_OVERRIDES_KEY) clearProtocolHandoffOverridesCache();
});

function updateLocalProtocolHistoryProcessed(id,checked){
  const cleanId=safe(id);
  if(!cleanId) return 0;
  const patch=mainProtocolProcessedLocalPatch(checked);
  let changed=0;
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith("astipMap:protocolHistory:")) continue;
      const arr=JSON.parse(localStorage.getItem(key) || "[]");
      if(!Array.isArray(arr)) continue;
      const next=patchProtocolProcessedItems(arr,cleanId,patch,false);
      if(next===arr) continue;
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      clearLocalStorageArrayEntriesCache(key);
      rememberSiteLocalArrayReadCache(key,next,raw);
      changed++;
    }
  }catch(e){
    console.warn("Lokální označení protokolu jako zpracovaný selhalo",e);
  }
  return changed;
}

async function updateOfflineProtocolQueueProcessed(id,checked){
  const cleanId=safe(id);
  if(!cleanId || typeof withSzzOfflineQueueStore!=="function") return false;
  const patch=mainProtocolProcessedLocalPatch(checked);
  try{
    return await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store,setResult)=>{
      const req=store.get(cleanId);
      req.onsuccess=()=>{
        const item=req.result;
        if(!item){
          setResult(false);
          return;
        }
        store.put({...item,...patch});
        setResult(true);
      };
      req.onerror=()=>setResult(false);
    });
  }catch(e){
    return false;
  }
}

async function saveMainProtocolProcessedRemote(item={},checked=false){
  const id=safe(item._id || item.id);
  if(!id || !firebaseReady || !db || !fb.fsMod || !currentUser || navigator.onLine===false) return false;
  if(item._offline || /local|indexed/i.test(safe(item._collection))) return false;
  const {doc,setDoc}=fb.fsMod;
  const patch=mainProtocolProcessedRemotePatch(checked);
  const writes=[
    setDoc(doc(db,"protocols",id),patch,{merge:true})
  ];
  const siteDocIds=uniqueNonEmptyStrings([
    item.siteDocId,
    item.firebaseDocId,
    item.siteId && String(item.siteId).startsWith("firebase_") ? String(item.siteId).slice("firebase_".length) : ""
  ]);
  for(const docId of siteDocIds){
    writes.push(setDoc(doc(db,"sitesUnified",docId,"protocols",id),patch,{merge:true}).catch(e=>{
      console.warn("Označení protokolu pod bodem selhalo",docId,e);
    }));
  }
  await Promise.all(writes);
  return true;
}

function updateMainProtocolHistoryProcessedState(id,checked){
  const cleanId=safe(id);
  const patch=mainProtocolProcessedLocalPatch(checked);
  mainProtocolHistoryCurrentItems=patchProtocolProcessedItems(mainProtocolHistoryCurrentItems,cleanId,patch,true);
  if(Array.isArray(mainProtocolHistoryCache.items)){
    mainProtocolHistoryCache.items=patchProtocolProcessedItems(mainProtocolHistoryCache.items,cleanId,patch,true);
    mainProtocolHistoryCache.savedAt=Date.now();
  }
}

async function setMainProtocolHistoryProcessed(item={},checked=false){
  const id=safe(item._id || item.id);
  if(!id) throw new Error("Protokol nemá ID.");
  await saveMainProtocolProcessedRemote(item,checked);
  updateLocalProtocolHistoryProcessed(id,checked);
  await updateOfflineProtocolQueueProcessed(id,checked);
  updateMainProtocolHistoryProcessedState(id,checked);
}

function updateLocalProtocolHistoryHandoff(id,checked){
  const cleanId=safe(id);
  if(!cleanId) return 0;
  const patch=protocolHandoffLocalPatch(checked);
  let changed=0;
  try{
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(!key || !key.startsWith("astipMap:protocolHistory:")) continue;
      const arr=JSON.parse(localStorage.getItem(key) || "[]");
      if(!Array.isArray(arr)) continue;
      const next=patchProtocolProcessedItems(arr,cleanId,patch,false);
      if(next===arr) continue;
      const raw=JSON.stringify(next);
      localStorage.setItem(key,raw);
      clearLocalStorageArrayEntriesCache(key);
      rememberSiteLocalArrayReadCache(key,next,raw);
      changed++;
    }
  }catch(e){
    console.warn("Lokální předání protokolu ke zpracování selhalo",e);
  }
  return changed;
}

async function updateOfflineProtocolQueueHandoff(id,checked){
  const cleanId=safe(id);
  if(!cleanId || typeof withSzzOfflineQueueStore!=="function") return false;
  const patch=protocolHandoffLocalPatch(checked);
  try{
    return await withSzzOfflineQueueStore(SZZ_OFFLINE_PROTOCOL_QUEUE_STORE,"readwrite",(store,setResult)=>{
      const req=store.get(cleanId);
      req.onsuccess=()=>{
        const item=req.result;
        if(!item){
          setResult(false);
          return;
        }
        store.put({...item,...patch});
        setResult(true);
      };
      req.onerror=()=>setResult(false);
    });
  }catch(e){
    return false;
  }
}

async function saveProtocolHandoffRemote(item={},checked=false){
  const id=safe(item._id || item.id);
  if(!id || !firebaseReady || !db || !fb.fsMod || !currentUser || navigator.onLine===false) return false;
  if(item._offline || /local|indexed/i.test(safe(item._collection))) return false;
  const {doc,setDoc}=fb.fsMod;
  const patch=protocolHandoffRemotePatch(checked);
  const writes=[
    setDoc(doc(db,"protocols",id),patch,{merge:true})
  ];
  const siteDocIds=uniqueNonEmptyStrings([
    item.siteDocId,
    item.firebaseDocId,
    selectedSiteDocId(selectedSite),
    item.siteId && String(item.siteId).startsWith("firebase_") ? String(item.siteId).slice("firebase_".length) : ""
  ]);
  for(const docId of siteDocIds){
    writes.push(setDoc(doc(db,"sitesUnified",docId,"protocols",id),patch,{merge:true}).catch(e=>{
      console.warn("Předání protokolu pod bodem selhalo",docId,e);
    }));
  }
  await Promise.all(writes);
  return true;
}

function updateDetailHistoryProtocolHandoffState(id,checked){
  const cleanId=safe(id);
  const patch=protocolHandoffLocalPatch(checked);
  detailHistoryItems=patchProtocolProcessedItems(detailHistoryItems,cleanId,patch,true);
  mainProtocolHistoryCurrentItems=patchProtocolProcessedItems(mainProtocolHistoryCurrentItems,cleanId,patch,true);
  if(Array.isArray(mainProtocolHistoryCache.items)){
    mainProtocolHistoryCache.items=patchProtocolProcessedItems(mainProtocolHistoryCache.items,cleanId,patch,true);
    mainProtocolHistoryCache.savedAt=Date.now();
  }
  if(selectedSite?.firebaseData){
    if(Array.isArray(selectedSite.firebaseData.protocolHistory)){
      selectedSite.firebaseData.protocolHistory=patchProtocolProcessedItems(selectedSite.firebaseData.protocolHistory,cleanId,patch,true);
    }
    if(Array.isArray(selectedSite.firebaseData.protocolRefs)){
      selectedSite.firebaseData.protocolRefs=patchProtocolProcessedItems(selectedSite.firebaseData.protocolRefs,cleanId,patch,true);
    }
  }
  if(typeof clearSiteChildItemsCache==="function") clearSiteChildItemsCache("protocols",selectedSite);
  clearDetailHistoryCacheForKind("protocols",selectedSite);
  clearLocalDetailReadCacheForKind("protocolHistory",selectedSite);
}

async function setDetailHistoryProtocolHandoff(item={},checked=false){
  const id=safe(item._id || item.id);
  if(!id) throw new Error("Protokol nemá ID.");
  await saveProtocolHandoffRemote(item,checked);
  rememberProtocolHandoffOverride(id,checked,item);
  updateLocalProtocolHistoryHandoff(id,checked);
  await updateOfflineProtocolQueueHandoff(id,checked);
  updateDetailHistoryProtocolHandoffState(id,checked);
}

function readAllLocalProtocolHistoryItems(){
  const items=[];
  try{
    const entries=localStorageArrayEntries("astipMap:protocolHistory:");
    for(const entry of entries){
      const source=Array.isArray(entry.items) ? entry.items : [];
      for(let idx=0;idx<source.length;idx++){
        const item=source[idx];
        if(item) items.push({...item,_type:"Protokol",_collection:"localProtocols",_id:item._id || `local_protocol_${idx}`});
      }
    }
  }catch(e){
    console.warn("Lokální historie protokolů nejde načíst",e);
  }
  return items;
}

function normalizeProtocolHistoryItems(items=[],collection="localProtocols",idPrefix=collection){
  const normalized=[];
  const source=Array.isArray(items) ? items : [];
  for(let idx=0;idx<source.length;idx++){
    const item=source[idx];
    if(!item) continue;
    normalized.push({
      ...item,
      _type:"Protokol",
      _collection:item._collection || collection,
      _id:item._id || `${idPrefix}_${idx}`
    });
  }
  return normalized;
}

function normalizeProtocolHistoryItemsForSite(items=[],site=selectedSite,collection="localProtocols",idPrefix=collection){
  const normalized=[];
  const source=Array.isArray(items) ? items : [];
  for(let idx=0;idx<source.length;idx++){
    const item=source[idx];
    if(!item) continue;
    const normalizedItem={
      ...item,
      _type:"Protokol",
      _collection:item._collection || collection,
      _id:item._id || `${idPrefix}_${idx}`
    };
    if(recordMatchesSite(normalizedItem,site)) normalized.push(normalizedItem);
  }
  return normalized;
}

async function computeAllLocalAndIndexedProtocolHistoryItems(){
  const localItems=readAllLocalProtocolHistoryItems();
  let indexedItems=[];
  if(typeof readAllOfflineProtocolQueueItems==="function"){
    try{
      indexedItems=normalizeProtocolHistoryItems(await readAllOfflineProtocolQueueItems(),"indexedOfflineProtocols","indexed_protocol");
    }catch(e){
      console.warn("IndexedDB historie protokolů nejde načíst",e);
    }
  }
  return uniqueByOfflineIdFromLists([localItems,indexedItems]);
}

async function readAllLocalAndIndexedProtocolHistoryItems(){
  return readCachedLocalDetailItems(allLocalProtocolHistoryReadCache,mainProtocolHistoryCacheKey(),computeAllLocalAndIndexedProtocolHistoryItems);
}

async function computeSiteLocalProtocolHistoryItems(site=selectedSite){
  const localItems=normalizeProtocolHistoryItemsForSite(readSiteLocalArray("protocolHistory",site),site,"localProtocols","local_protocol");
  let indexedItems=[];
  if(typeof readOfflineProtocolQueueItems==="function"){
    try{
      indexedItems=normalizeProtocolHistoryItemsForSite(await readOfflineProtocolQueueItems(site),site,"indexedOfflineProtocols","indexed_protocol");
    }catch(e){
      console.warn("IndexedDB protokoly pro místo nejde načíst",e);
    }
  }
  return uniqueByOfflineIdFromLists([localItems,indexedItems]);
}

async function readSiteLocalProtocolHistoryItems(site=selectedSite){
  const cacheKey=siteLocalDetailReadCacheKey("protocolHistory",site);
  return readCachedLocalDetailItems(siteLocalProtocolHistoryReadCache,cacheKey,()=>computeSiteLocalProtocolHistoryItems(site));
}

function selectLatestProtocolHistoryItems(items=[],limit=80){
  const top=[];
  const maxCount=Math.max(0,Number(limit) || 0);
  if(!maxCount) return top;
  for(const item of items || []){
    if(!isProtocolHistoryItem(item)) continue;
    const time=protocolTimeValue(item);
    let insertAt=top.length;
    while(insertAt>0 && time>top[insertAt-1].time) insertAt--;
    if(insertAt>=maxCount) continue;
    top.splice(insertAt,0,{item,time});
    if(top.length>maxCount) top.length=maxCount;
  }
  const out=new Array(top.length);
  for(let i=0;i<top.length;i++) out[i]=top[i].item;
  return out;
}

async function loadMainProtocolHistoryItems(){
  if(!canViewMainProtocolHistory()) return [];
  const cached=readMainProtocolHistoryCache();
  if(cached) return cached;
  const items=[];
  const itemDedupe=createRecordIdDedupe(items);
  const addItem=item=>{
    itemDedupe.add(item);
  };
  const localItemsPromise=readAllLocalAndIndexedProtocolHistoryItems()
    .catch(e=>{
      console.warn("Lokální hlavní historie protokolů nejde načíst",e);
      return [];
    });
  let firebaseItemsPromise=Promise.resolve([]);
  if(firebaseReady && db && fb.fsMod && currentUser && navigator.onLine !== false){
    firebaseItemsPromise=(async()=>{
    try{
      const {collection,getDocs,query,orderBy,limit:queryLimit}=fb.fsMod;
      let snap=null;
      if(query && orderBy && queryLimit){
        try{
          snap=await getDocs(query(collection(db,"protocols"),orderBy("savedAt","desc"),queryLimit(80)));
        }catch(e){
          console.warn("Seřazené načtení hlavní historie selhalo, načítám bez řazení",e);
        }
      }
      if(!snap) snap=await getDocs(collection(db,"protocols"));
      const firebaseItems=[];
      snap.forEach(docSnap=>firebaseItems.push({...docSnap.data(),_type:"Protokol",_collection:"protocols",_id:docSnap.id}));
      return firebaseItems;
    }catch(e){
      console.warn("Hlavní historie protokolů nejde načíst",e);
      return [];
    }
    })();
  }
  const [localItems,firebaseItems]=await Promise.all([localItemsPromise,firebaseItemsPromise]);
  for(const item of localItems) addItem(item);
  for(const item of firebaseItems) addItem(item);
  const finalItems=selectLatestProtocolHistoryItems(items,80);
  writeMainProtocolHistoryCache(finalItems);
  return cloneDetailHistoryItems(finalItems);
}

function renderMainProtocolHistoryShell(drawer){
  const shell=renderMainProtocolHistoryShellDom(drawer,{dateFilter:mainProtocolHistoryDateFilter});
  if(!shell?.reused) mainProtocolHistoryRenderSignature="";
  return shell;
}

function renderMainProtocolHistoryRows(list,items=[]){
  mainProtocolHistoryRenderSignature=renderMainProtocolHistoryRowsDom({
    list,
    items,
    dateFilter:mainProtocolHistoryDateFilter,
    currentSignature:mainProtocolHistoryRenderSignature
  });
}

async function openMainProtocolHistoryPanel(){
  if(!canViewMainProtocolHistory()){
    showSaveConfirmation("Historii protokolů uvidí přihlášený technik.");
    return;
  }
  const drawer=drawerNode();
  if(!drawer) return;
  captureNormalDetailDrawerShell(drawer);
  drawer.classList.add("open");
  drawer.classList.remove("adding-new-site");
  drawer.scrollTop=0;
  const shell=renderMainProtocolHistoryShell(drawer);
  const {close,list,dateFilter}=shell;
  if(close) close.onclick=()=>{
    setProtocolFormOpen(false,{skipPrefill:true});
    drawer.classList.remove("open");
  };
  bindMainProtocolHistoryListClickDom(list);
  bindMainProtocolHistoryControlsDom(shell);
  if(dateFilter) dateFilter.value=mainProtocolHistoryDateFilter;
  const items=await loadMainProtocolHistoryItems();
  mainProtocolHistoryCurrentItems=items;
  if(!list) return;
  renderMainProtocolHistoryRows(list,items);
}
window.openMainProtocolHistoryPanel=openMainProtocolHistoryPanel;

if(typeof window.bindLoginButtons==="function"){
  window.bindLoginButtons();
}




bindDetailShellControls();
const {bindFilterRenderControls}=createFilterRenderScheduler({
  filterControls,
  requestRender,
  updateStatusFilterColor
});
bindFilterRenderControls();
document.getElementById("fitBtn").addEventListener("click",fit);
const mapBackBtn=document.getElementById("mapBackBtn");
if(mapBackBtn) mapBackBtn.onclick=returnFromMapFocus;
const mainProtocolHistoryBtn=document.getElementById("mainProtocolHistoryBtn");
if(mainProtocolHistoryBtn) mainProtocolHistoryBtn.addEventListener("click",openMainProtocolHistoryPanel);
document.getElementById("reloadEditBtn").onclick=async()=>{
  await loadEdits({renderAfter:false});
  await loadDeletedSites();
  if(firebaseUnifiedPrimary && typeof window.loadFirebaseSitesUnified==="function"){
    await window.loadFirebaseSitesUnified();
  }else{
    const rendered=await loadExtraSites();
    if(!rendered) render();
  }
};
document.getElementById("addSiteBtn").onclick=()=>{
  openNewSiteForm();
  const form=newSiteCardNode();
  if(form){
    form.style.display="block";
    form.scrollIntoView({behavior:"smooth",block:"start"});
  }
  runAfterPaint(()=>{
    const first=document.getElementById("newName");
    if(first){
      first.focus();
      first.click();
    }
  });
};
document.getElementById("cancelNewSiteBtn").onclick=()=>{
  const baseKey=addSourceBaseSite ? detailKey(addSourceBaseSite) : "";
  const form=newSiteCardNode();
  if(form) form.style.display="none";
  clearNewSiteMode();
  if(baseKey) window.openDetailById(baseKey);
};
document.getElementById("saveNewSiteBtn").onclick=async()=>{
  const st=document.getElementById("newSiteStatus");
  const sourceBaseSite=addSourceBaseSite;
  if(!firebaseReady){st.textContent="Firebase není nastavený.";return;}
  if(!currentUser){st.textContent="Nejdřív se přihlaš.";return;}

  const allRawData=collectNewSiteAllFields();
  const name=document.getElementById("newName").value.trim()
    || safe(allRawData["Název"] || allRawData["Adresa / umístění"] || allRawData["Adresa_GPS"]);
  const gpsAddress=document.getElementById("newGpsAddress").value.trim()
    || safe(allRawData["Adresa_GPS"] || allRawData["Adresa / umístění"] || name);
  const gpsLat=document.getElementById("newGpsLat").value.trim()
    || safe(allRawData["GPS_lat"]);
  const gpsLon=document.getElementById("newGpsLon").value.trim()
    || safe(allRawData["GPS_lon"]);

  if(!name){
    st.className="small";
    st.textContent="Je potřeba doplnit místo / název, který se bude zobrazovat na mapě.";
    const target=(newSiteFieldElementsByKey().get("Název") || [])[0] || document.getElementById("newName");
    if(target) target.focus();
    return;
  }
  if(!gpsLat || !gpsLon){
    st.className="small";
    st.textContent="Vyplň nebo dopočítej GPS, aby se bod mohl zobrazit na mapě.";
    const target=(newSiteFieldElementsByKey().get("Adresa_GPS") || [])[0] || document.getElementById("newGpsAddress");
    if(target) target.focus();
    return;
  }

  const data={
    name,
    gpsAddress,
    gpsLat,
    gpsLon,
    region:document.getElementById("newRegion").value.trim() || safe(allRawData["Kraj"]),
    contact:document.getElementById("newContact").value.trim() || safe(allRawData["Kontakt"]),
    source:document.getElementById("newSource").value.trim() || safe(allRawData["Popis_zdroje"]),
    ordered:false,
    noOrder:document.getElementById("newNoOrder").checked || yesNoFixed(allRawData["Hlídáme kontroly sami"],"ne")==="ano",
    nextCheck:document.getElementById("newNextCheck").value || safe(allRawData["Příští_kontrola"]),
    lastCheck:document.getElementById("newLastCheck").value || safe(allRawData["Poslední_kontrola"]),
    notes:document.getElementById("newNotes").value.trim(),
    extra:document.getElementById("newExtra").value.trim(),
    allRawData,
    allData:document.getElementById("newAllData") ? document.getElementById("newAllData").value.trim() : "",
    createdBy:currentUser.email,
    createdAt:new Date().toISOString(),
    updatedBy:currentUser.email,
    updatedAt:new Date().toISOString()
  };
  const newSourceType=safe(data.source || data.allRawData?.["Popis_zdroje"] || data.allRawData?.["Kontrolované zařízení"] || data.allRawData?.["Typ zařízení"]);
  const newSourceSerial=sourceSerialTextFromRaw(data.allRawData || {});
  if(sourceBaseSite && !newSourceType && !newSourceSerial){
    st.className="small";
    st.textContent="Pro další zdroj na stejné adrese doplň typ zdroje nebo výrobní číslo, aby se odlišil od ostatních.";
    const sourceInput=document.getElementById("newSource") || document.querySelector('#newAllFieldsBox [data-new-key="Popis_zdroje"]') || document.querySelector('#newAllFieldsBox [data-new-key="Zdroj"]');
    if(sourceInput) sourceInput.focus();
    return;
  }
  const newSiteDatePeriod=inferControlPeriodMonthsFromDateValues(data.lastCheck,data.nextCheck);
  if(newSiteDatePeriod){
    data.period=String(newSiteDatePeriod);
    data.controlPeriod=String(newSiteDatePeriod);
    data.allRawData={...(data.allRawData || {}), "Perioda kontrol":String(newSiteDatePeriod)};
  }

  try{
    let savedRef=null;
    let savedOffline=false;
    let savedRow=null;
    if(firebaseUnifiedPrimary){
      if(typeof window.saveUnifiedSiteRaw!=="function") throw new Error("Firebase ukládání nových bodů ještě není připravené.");
      const raw={...(data.allRawData || {})};
      raw["Název"]=data.name || raw["Název"] || "";
      raw["Adresa / umístění"]=data.gpsAddress || raw["Adresa / umístění"] || data.name || "";
      raw["Adresa_GPS"]=data.gpsAddress || raw["Adresa_GPS"] || raw["Adresa / umístění"] || "";
      raw["GPS_lat"]=data.gpsLat || raw["GPS_lat"] || "";
      raw["GPS_lon"]=data.gpsLon || raw["GPS_lon"] || "";
      raw["Kraj"]=data.region || raw["Kraj"] || "";
      raw["Kontakt"]=data.contact || raw["Kontakt"] || "";
      raw["Kontakt_mapy"]=data.contact || raw["Kontakt_mapy"] || raw["Kontakt"] || "";
      raw["Popis_zdroje"]=data.source || raw["Popis_zdroje"] || "";
      raw["Poznámky"]=data.notes || raw["Poznámky"] || "";
      raw["Poznámky_mapy"]=data.notes || raw["Poznámky_mapy"] || raw["Poznámky"] || "";
      raw["Příští_kontrola"]=data.nextCheck || raw["Příští_kontrola"] || "";
      raw["Poslední_kontrola"]=data.lastCheck || raw["Poslední_kontrola"] || "";
      if(data.period) raw["Perioda kontrol"]=data.period;
      applyWatchSelfAliases(raw, data.noOrder ? "ano" : raw["Hlídáme sami termín"] || raw["Hlídáme kontroly sami"] || "ne");
      if(sourceBaseSite){
        raw["Adresa / umístění"]=data.gpsAddress || sitePlaceLabel(sourceBaseSite) || raw["Adresa / umístění"] || raw["Název"] || "";
        raw["Adresa_GPS"]=data.gpsAddress || raw["Adresa_GPS"] || raw["Adresa / umístění"] || "";
        raw["GPS_lat"]=data.gpsLat || raw["GPS_lat"] || "";
        raw["GPS_lon"]=data.gpsLon || raw["GPS_lon"] || "";
        raw["Kraj"]=data.region || rowRegion(sourceBaseSite) || raw["Kraj"] || "";
        raw["Zdroj_dat"]="Firebase další zdroj";
      }
      const result=await window.saveUnifiedSiteRaw(raw);
      if(result.duplicate){
        st.textContent="Bod už existuje. Otevírám existující záznam.";
        addSourceBaseSite=null;
        if(navigator.onLine !== false && typeof window.refreshFirebaseSitesAfterSave==="function") await window.refreshFirebaseSitesAfterSave(result.id,result.row);
        else if(navigator.onLine !== false && typeof window.loadFirebaseSitesUnified==="function") await window.loadFirebaseSitesUnified(result.id);
        return;
      }
      savedRef={id:result.id};
      savedOffline=!!result.offline;
      savedRow=result.row || null;
    }else{
      const {collection,addDoc}=fb.fsMod;
      savedRef=await addDoc(collection(db,"sites"),data);
    }
    st.textContent=sourceBaseSite ? "Nový zdroj uložen." : "Nové místo uloženo.";
    showSaveConfirmation(sourceBaseSite ? "Nový zdroj uložen." : "Nové místo uloženo.");
    addSourceBaseSite=null;
    setInputValue("newName","");
    setInputValue("newGpsAddress","");
    setInputValue("newGpsLat","");
    setInputValue("newGpsLon","");
    setInputValue("newRegion","");
    setInputValue("newContact","");
    setInputValue("newSource","");
    
    setInputChecked("newNoOrder",false);
    setInputValue("newNextCheck","");
    setInputValue("newLastCheck","");
    setInputValue("newNotes","");
    setInputValue("newExtra","");
    clearNewSiteAllFields();
    setInputValue("newAllData","");
    if(savedOffline){
      if(typeof render==="function") render();
      if(savedRef && savedRef.id && typeof window.openDetailById==="function"){
        runAfterTwoPaints(()=>window.openDetailById(savedRef.id));
      }
    }else if(firebaseUnifiedPrimary && typeof window.refreshFirebaseSitesAfterSave==="function"){
      await window.refreshFirebaseSitesAfterSave(savedRef && savedRef.id, savedRow);
    }else if(firebaseUnifiedPrimary && typeof window.loadFirebaseSitesUnified==="function"){
      await window.loadFirebaseSitesUnified();
    }else{
      await loadExtraSites();
      fit();
    }
  }catch(e){st.textContent="Chyba uložení nového místa: "+e.message;}
};
document.getElementById("editBtn").onclick=()=>document.getElementById("editCard").style.display="block";
document.getElementById("cancelEditBtn").onclick=()=>document.getElementById("editCard").style.display="none";

function shouldUseProtocolFormFullscreen(){
  if(typeof window==="undefined") return false;
  const width=Number(window.innerWidth) || 0;
  const height=Number(window.innerHeight) || 0;
  const minSide=Math.min(width || Infinity,height || Infinity);
  const maxSide=Math.max(width,height);
  const narrow=window.matchMedia && window.matchMedia("(max-width: 760px)").matches;
  const phoneLandscape=window.matchMedia && window.matchMedia("(pointer: coarse)").matches && minSide<=480 && maxSide<=980;
  return !!(narrow || phoneLandscape);
}

function setProtocolFormFullscreen(active){
  const isActive=!!active && shouldUseProtocolFormFullscreen();
  document.body.classList.toggle("protocol-form-fullscreen",isActive);
  const drawer=drawerNode();
  if(drawer) drawer.classList.toggle("protocol-form-fullscreen",isActive);
  const btn=formFieldNode("toggleProtocolBtn");
  if(btn){
    btn.setAttribute("aria-expanded",active ? "true" : "false");
    btn.setAttribute("aria-label",active ? "Skrýt formulář protokolu" : "Otevřít formulář protokolu");
  }
}

function refreshProtocolFormFullscreenMode(){
  const f=formFieldNode("protocolForm");
  const open=!!f && (f.dataset.protocolOpen==="1" || f.style.display !== "none");
  setProtocolFormFullscreen(open);
}

function setProtocolFormOpen(open,options={}){
  const btn=formFieldNode("toggleProtocolBtn");
  const f=formFieldNode("protocolForm");
  const nextOpen=!!open;
  if(!f){
    if(!nextOpen) setProtocolFormFullscreen(false);
    return;
  }
  f.dataset.protocolOpen=nextOpen ? "1" : "0";
  f.style.display=nextOpen ? "" : "none";
  f.setAttribute("aria-hidden",nextOpen ? "false" : "true");
  setTextIfChanged(btn,nextOpen ? "Skrýt protokol" : "Vyplnit protokol");
  setProtocolFormFullscreen(nextOpen);
  if(nextOpen){
    const drawer=drawerNode();
    if(drawer) drawer.classList.add("open");
    if(typeof window.setDetailTab==="function" && drawer && !drawer.classList.contains("adding-new-site")){
      window.setDetailTab("protocol",{force:true});
    }
    initProtocolClientSignaturePad();
    if(!options.skipPrefill && typeof prefillProtocol==="function") prefillProtocol();
    requestAnimationFrame(()=>{ try{ f.scrollTo({top:0,behavior:"auto"}); }catch(e){ f.scrollTop=0; } });
  }
}
window.setProtocolFormOpen=setProtocolFormOpen;

function toggleProtocolFormFromButton(){
  const btn=formFieldNode("toggleProtocolBtn");
  const f=formFieldNode("protocolForm");
  if(!btn || !f) return;
  const open=f.dataset.protocolOpen==="1" || f.style.display !== "none";
  setProtocolFormOpen(!open,{skipPrefill:open});
}

function bindProtocolToggleButton(){
  const btn=formFieldNode("toggleProtocolBtn");
  if(btn) btn.onclick=toggleProtocolFormFromButton;
}

bindProtocolToggleButton();

document.addEventListener("keydown",event=>{
  if(event.key==="Escape" && document.body.classList.contains("protocol-form-fullscreen")){
    event.preventDefault();
    setProtocolFormOpen(false,{skipPrefill:true});
  }
});

window.addEventListener("resize",()=>{
  if(document.body.classList.contains("protocol-form-fullscreen")){
    refreshProtocolFormFullscreenMode();
  }else{
    const f=formFieldNode("protocolForm");
    if(f && f.dataset.protocolOpen==="1" && shouldUseProtocolFormFullscreen()) refreshProtocolFormFullscreenMode();
  }
},{passive:true});


const editFindGpsBtn=document.getElementById("editFindGpsBtn");
if(editFindGpsBtn) editFindGpsBtn.onclick=recalcGpsForEditedAddress;
const editPickGpsBtn=document.getElementById("editPickGpsBtn");
if(editPickGpsBtn) editPickGpsBtn.onclick=startDetailManualGpsPick;
const newPickGpsBtn=document.getElementById("newPickGpsBtn");
if(newPickGpsBtn) newPickGpsBtn.onclick=startLegacyNewManualGpsPick;

const editGpsAddressEl=document.getElementById("editGpsAddress");
if(editGpsAddressEl){
  let gpsTimer=null;
  editGpsAddressEl.addEventListener("change",recalcGpsForEditedAddress);
  editGpsAddressEl.addEventListener("blur",recalcGpsForEditedAddress);
}

const editLastCheckEl=document.getElementById("editLastCheck");
if(editLastCheckEl) editLastCheckEl.addEventListener("change",recalcEditNextCheck);

const deleteSiteBtn=document.getElementById("deleteSiteBtn");
if(deleteSiteBtn) deleteSiteBtn.onclick=deleteSelectedSite;

document.getElementById("saveEditBtn").onclick=async()=>{
  const st=document.getElementById("editStatus");
  if(!selectedSite){st.textContent="Není vybrané místo.";return;}
  const rawEdits={
    "Název":document.getElementById("editName").value,
    "Kontakt":document.getElementById("editContact").value,
    "Popis_zdroje":document.getElementById("editSource").value,
    "Kontrola objednaná":document.getElementById("editOrdered").checked ? "ANO" : "NE",
    "Objednáno":document.getElementById("editOrdered").checked ? "ANO" : "NE",
    "Adresa_GPS":document.getElementById("editGpsAddress").value,
    "GPS_lat":document.getElementById("editGpsLat").value,
    "GPS_lon":document.getElementById("editGpsLon").value,
    "Poslední_kontrola":document.getElementById("editLastCheck").value,
    "Příští_kontrola":document.getElementById("editNextCheck").value,
    "Poznámky":document.getElementById("editNotes").value
  };
  const edit={
    name:rawEdits["Název"],
    contact:rawEdits["Kontakt"],
    source:rawEdits["Popis_zdroje"],
    ordered:document.getElementById("editOrdered").checked,
    gpsAddress:rawEdits["Adresa_GPS"],
    gpsLat:rawEdits["GPS_lat"],
    gpsLon:rawEdits["GPS_lon"],
    lastCheck:rawEdits["Poslední_kontrola"],
    nextCheck:rawEdits["Příští_kontrola"],
    notes:rawEdits["Poznámky"],
    rawEdits,
    updatedBy:siteEditUserEmail(),
    updatedAt:new Date().toISOString()
  };
  try{
    const selectedKey=detailKey(selectedSite) || selectedSite.id;
    const firebaseDocId=selectedSiteDocId(selectedSite);
    const result=firebaseDocId && isFirebaseUnifiedRow(selectedSite)
      ? await saveUnifiedSiteRawPatchOrQueue(selectedSite,rawEdits,{
        docId:firebaseDocId,
        reason:"Úprava bodu ze záložního editoru"
      })
      : null;
    await saveLegacySiteEditIfNeeded(selectedKey,edit,selectedSite);
    editCache[selectedKey]={...(editCache[selectedKey]||editCache[selectedSite.id]||{}),...edit};
    selectedSite=updateSingleSelectedRowAfterEdit(selectedKey,firebaseDocId,selectedSite,edit);
    render(); window.openDetailById(selectedKey);
    st.textContent=result?.queued ? "Úpravy uloženy v tabletu. Čekají na synchronizaci." : "Úpravy uloženy.";
    showSaveConfirmation(result?.queued ? "Úpravy uloženy v tabletu, odešlou se po připojení." : "Úpravy uloženy.");
  }catch(e){st.textContent="Chyba uložení: "+e.message;}
};
const serviceForm=document.getElementById("serviceForm");
if(serviceForm){
  serviceForm.addEventListener("submit",async e=>{
    e.preventDefault();
    const st=document.getElementById("formStatus");
    if(!firebaseReady){st.textContent="Firebase není nastavený.";return;}
    if(!currentUser){st.textContent="Nejdřív se přihlaš.";return;}
    if(!selectedSite){st.textContent="Není vybrané místo.";return;}
    if(!val("protoResetDiag")){
      st.textContent="Je nutné vyplnit pole Reset diagnostiky.";
      formFieldNode("protoResetDiag")?.focus();
      return;
    }

    try{
      const {collection,doc,setDoc,serverTimestamp}=fb.fsMod;
      const identity=siteRecordIdentity(selectedSite);
      const serviceRef=doc(collection(db,"serviceRecords"));
      const servicePayload={_id:serviceRef.id,...identity,technician:val("technician"),technicianEmail:currentUser.email,checkDate:val("checkDate"),result:val("result"),issues:val("issues"),recommendation:val("recommendation"),photoLinks:val("photoLinks").split(/\n+/).map(x=>x.trim()).filter(Boolean),createdAt:new Date().toISOString()};
      const childOk=await saveSiteChildItem("serviceRecords",serviceRef.id,servicePayload,selectedSite);
      const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("serviceHistory",servicePayload,selectedSite);
      await appendEmbeddedSiteItem("serviceRefs",{
        _id:servicePayload._id,
        siteId:servicePayload.siteId,
        siteLegacyId:servicePayload.siteLegacyId,
        siteDocId:servicePayload.siteDocId,
        siteKey:servicePayload.siteKey,
        firebaseDocId:servicePayload.firebaseDocId,
        siteKeys:servicePayload.siteKeys,
        sourceGroupKey:servicePayload.sourceGroupKey,
        sourceIdentity:servicePayload.sourceIdentity,
        checkDate:servicePayload.checkDate,
        createdAt:servicePayload.createdAt
      },selectedSite);
      try{
        await setDoc(serviceRef,{...servicePayload,createdAt:serverTimestamp()});
      }catch(e){
        console.warn("Samostatný servisní záznam se neuložil, používám zálohu v bodu",e);
        if(!embeddedOk) throw e;
      }
      st.textContent="Uloženo.";
      showSaveConfirmation("Servisní záznam uložen.");
      loadHistory(selectedSite.id);
    }catch(err){st.textContent="Chyba uložení: "+err.message;}
  });
}


function checkbox(id){return formFieldNode(id)?.checked || false;}
function val(id){return formFieldNode(id)?.value || "";}
function protocolStatusNode(){
  return formFieldNode("protocolStatus");
}
function setProtocolStatusText(text){
  setTextIfChanged(protocolStatusNode(),text);
}

let protoClientSignatureDirty=false;
function protocolSignatureCanvas(){
  return formFieldNode("protoClientSignaturePad");
}
function protocolClientSignaturePanel(){
  return formFieldNode("protoClientSignaturePanel");
}
function setProtocolClientSignaturePanelOpen(open){
  const panel=protocolClientSignaturePanel();
  const btn=formFieldNode("toggleClientSignatureBtn");
  const visible=!!open;
  if(panel){
    panel.hidden=!visible;
    panel.setAttribute("aria-hidden",visible ? "false" : "true");
  }
  if(btn) btn.textContent=visible ? "Skrýt podpis zákazníka" : "Podpis zákazníka";
  if(visible) requestAnimationFrame(()=>initProtocolClientSignaturePad());
}
function protocolSignaturePoint(e,canvas){
  const rect=canvas.getBoundingClientRect();
  return {
    x:(e.clientX-rect.left)*(canvas.width/rect.width),
    y:(e.clientY-rect.top)*(canvas.height/rect.height)
  };
}
function protocolSignatureContext(){
  const canvas=protocolSignatureCanvas();
  if(!canvas) return null;
  const ctx=canvas.getContext("2d");
  if(!ctx) return null;
  ctx.lineWidth=4;
  ctx.lineCap="round";
  ctx.lineJoin="round";
  ctx.strokeStyle="#0f172a";
  return ctx;
}
function clearProtocolClientSignature(){
  const canvas=protocolSignatureCanvas();
  const ctx=protocolSignatureContext();
  if(!canvas || !ctx) return;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  protoClientSignatureDirty=false;
}
function initProtocolClientSignaturePad(){
  const canvas=protocolSignatureCanvas();
  if(!canvas) return;
  const ctx=protocolSignatureContext();
  if(!ctx) return;
  if(canvas.dataset.signatureReady==="1") return;
  canvas.dataset.signatureReady="1";
  let drawing=false;
  let last=null;
  const start=e=>{
    e.preventDefault();
    drawing=true;
    last=protocolSignaturePoint(e,canvas);
    ctx.beginPath();
    ctx.arc(last.x,last.y,2,0,Math.PI*2);
    ctx.fillStyle="#0f172a";
    ctx.fill();
    protoClientSignatureDirty=true;
    scheduleProtocolDraftSave();
    try{canvas.setPointerCapture(e.pointerId);}catch(_e){}
  };
  const move=e=>{
    if(!drawing || !last) return;
    e.preventDefault();
    const point=protocolSignaturePoint(e,canvas);
    ctx.beginPath();
    ctx.moveTo(last.x,last.y);
    ctx.lineTo(point.x,point.y);
    ctx.stroke();
    last=point;
    protoClientSignatureDirty=true;
    scheduleProtocolDraftSave();
  };
  const stop=e=>{
    if(!drawing) return;
    e.preventDefault();
    drawing=false;
    last=null;
    try{canvas.releasePointerCapture(e.pointerId);}catch(_e){}
  };
  canvas.addEventListener("pointerdown",start);
  canvas.addEventListener("pointermove",move);
  canvas.addEventListener("pointerup",stop);
  canvas.addEventListener("pointercancel",stop);
  canvas.addEventListener("pointerleave",stop);
  const clearBtn=formFieldNode("clearClientSignatureBtn");
  if(clearBtn) clearBtn.onclick=()=>{
    clearProtocolClientSignature();
    scheduleProtocolDraftSave();
  };
}
document.addEventListener("click",event=>{
  const btn=event.target && event.target.closest ? event.target.closest("#toggleClientSignatureBtn") : null;
  if(!btn) return;
  event.preventDefault();
  const panel=protocolClientSignaturePanel();
  setProtocolClientSignaturePanelOpen(panel ? panel.hidden : true);
});
function protocolClientSignatureDataUrl(){
  const canvas=protocolSignatureCanvas();
  if(!canvas || !protoClientSignatureDirty) return "";
  try{return canvas.toDataURL("image/png");}catch(e){return "";}
}


function splitPossibleSources(text){
  const s=safe(text);
  if(!s) return [];
  return s
    .split(/\s*(?:\+|\||;|\n|\r| \/ |, (?=(?:UPS|zdroj|FZ|PBZ|typ|[A-Z0-9]{3,})))\s*/i)
    .map(x=>x.trim())
    .filter(Boolean);
}

function sourceOptionsFromSite(site){
  const raw=site?.raw || {};
  const candidates=[
    protocolDeviceTypeFromSite(site),
    get(raw,"Popis_zdroje"),
    get(raw,"Kontrolované zařízení"),
    get(raw,"Jaký zdroj"),
    get(raw,"Typ zařízení"),
    get(raw,"Typ"),
    get(raw,"Serviska")
  ].filter(Boolean);

  let out=[];
  candidates.forEach(c=>{
    const parts=splitPossibleSources(c);
    if(parts.length) out.push(...parts);
    else out.push(String(c).trim());
  });

  // unique, remove empty
  const seen=new Set();
  return out.filter(x=>{
    const k=x.toLowerCase();
    if(!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

function populateProtocolDeviceSelect(){
  const oldWrap=formFieldNode("protocolDeviceSelectWrap");
  if(oldWrap) oldWrap.style.display="none";
  const inputWrap=formFieldNode("protoDeviceInputWrap");
  const selectWrap=formFieldNode("protoDeviceSelectWrap2");
  const input=formFieldNode("protoDeviceType");
  if(inputWrap) inputWrap.classList.remove("hidden");
  if(selectWrap) selectWrap.classList.add("hidden");
  if(!selectedSite || !input) return;
  input.value=protocolDeviceTypeFromSite(selectedSite) || "";
  updateProtocolSummary();
}

function resetProtocolTechnicalFieldsForNewDevice(){
  [
    "protoDeviceType","protoSerial","protoSeal","protoSeal2",
    "protoBatteryCount","protoCapacity","protoSetCount","protoAuxBatteryAh",
    "protoInputVac","protoOutput1Vac","protoOutput2Vac","protoBackup1Vac","protoBackup2Vac",
    "protoMainBatVdc","protoResetDiag","protoAuxBatVdc","protoUnbalance1","protoUnbalance2"
  ].forEach(id=>{
    const el=formFieldNode(id);
    if(el) el.value="";
  });

  updateProtocolSummary();
}

function pickRawValue(raw, names){
  for(const n of names){
    const v=safe(get(raw,n));
    if(v) return v;
  }
  return "";
}

function setIfEmpty(id,value){
  const el=formFieldNode(id);
  if(!el) return;
  if(!safe(el.value) && safe(value)) el.value=value;
}

function setCheckbox(id,value){
  const el=formFieldNode(id);
  if(!el) return;
  el.checked = value === true || String(value).toLowerCase()==="true" || String(value).toLowerCase()==="ano";
}

function protocolDeviceTypeFromSite(site){
  const raw=site?.raw || {};
  const explicit=pickRawValue(raw,[
    "Popis_zdroje","Jaký zdroj","Kontrolované zařízení","Kontrolované zařízení – typ",
    "Kontrolovane zarizeni","Typ zařízení","Typ zarizeni","Typ","Serviska"
  ]);
  if(explicit) return explicit;

  const source=safe(site?.zdroj);
  const serial=protocolSerialFromSite(site);
  if(source && dataNormFixed(source)!==dataNormFixed(serial)) return source;
  return "";
}

function protocolSerialFromSite(site){
  const raw=site?.raw || {};
  return pickRawValue(raw,[
    "Výrobní č.","Výrobní číslo","Výrobní_číslo","Vyrobni cislo",
    "Sériové číslo","Seriové číslo","Serial","SN","Zdroj"
  ]);
}

function protocolSourceLocationFromSite(site){
  const raw=site?.raw || {};
  return pickRawValue(raw,[
    "Umístění zdroje","Umístění_zdroje","Umístění","Umisteni",
    "Adresa_GPS","Adresa / umístění"
  ]);
}

const protocolSummaryNodeCache={};
function protocolSummaryNode(id){
  const cached=protocolSummaryNodeCache[id];
  if(cached && cached.isConnected) return cached;
  const el=document.getElementById(id);
  if(el) protocolSummaryNodeCache[id]=el;
  return el;
}

function updateProtocolSummary(){
  const set=(id,value)=>{
    setTextIfChanged(protocolSummaryNode(id),safe(value) || "-");
  };
  set("protoSummaryAddress", val("protoPlace"));
  set("protoSummaryDevice", val("protoDeviceType"));
  set("protoSummarySerial", val("protoSerial"));
  set("protoSummaryLocation", val("protoPbzLocation"));
  set("protoSummaryPeriod", val("protoPeriod"));
}

let protocolPrefillSiteId="";

function resetProtocolFormForSelectedSite(siteId){
  const key=String(siteId || "");
  clearProtocolEditState();
  const form=formFieldNode("protocolForm");
  if(form) form.reset();
  clearProtocolClientSignature();
  setProtocolClientSignaturePanelOpen(false);
  protocolPrefillSiteId=key;
}

function closeProtocolFormAfterSave(){
  const form=formFieldNode("protocolForm");
  if(form){
    form.reset();
    form.style.display="none";
    form.dataset.protocolOpen="0";
    form.setAttribute("aria-hidden","true");
  }
  setProtocolFormFullscreen(false);
  clearProtocolEditState();
  clearProtocolClientSignature();
  setProtocolClientSignaturePanelOpen(false);
  protocolPrefillSiteId="";
  updateProtocolSummary();
  setTextIfChanged(formFieldNode("toggleProtocolBtn"),"Vyplnit protokol");
}

const {
  photoDisplayUrl,
  photoFullUrl,
  photoThumbUrl
}=createPhotoUrlHelpers();

const {
  cloneOfflinePhotoItems,
  collectDisplayablePhotoItemsFromLists,
  collectPendingOfflinePhotoItems,
  countPendingOfflinePhotoItems,
  displayablePhotoItems,
  isPendingOfflinePhotoItem,
  offlinePhotoFileFromItem,
  siteCacheSuffixFromPhoto
}=createOfflinePhotoItemHelpers({
  photoDisplayUrl,
  photoFileName,
  safeValue:safe
});

const {
  clearOfflinePhotoAllReadCache,
  readAllOfflinePhotoItems,
  readOfflinePhotoItems,
  removeOfflinePhotoItem,
  saveOfflinePhotoItem
}=createOfflinePhotoQueueHelpers({
  appendSiteLocalArray,
  clearLocalDetailReadCacheForKind,
  cloneOfflinePhotoItems,
  collectDisplayablePhotoItemsFromLists,
  collectPendingOfflinePhotoItems,
  displayablePhotoItems,
  getDefaultSite:()=>selectedSite,
  invalidateOfflinePhotoCountCache:()=>invalidateOfflinePhotoCountCache(),
  localStorageArrayEntries,
  readCachedLocalDetailItems,
  readSiteLocalArray,
  removeLocalStorageArrayItemByKey,
  removeSiteLocalItem,
  safeValue:safe,
  siteLocalCacheKey,
  siteLocalDetailReadCacheKey,
  siteOfflinePhotoReadCache
});

const {
  cloudinaryPhotoFolderPath,
  photoFolderName,
  photoFolderNameFingerprint,
  photoFolderNameForDate,
  sitePhotoFolderGroups
}=createPhotoFolderHelpers({
  cloudinaryPhotos:CLOUDINARY_PHOTOS,
  photoCloudinaryVersionDate
});

const {
  photoRenderMeta
}=createPhotoRenderMetaHelpers({
  isAppAdmin,
  photoDateLabel,
  photoTakenLabel,
  photoInsertedLabel,
  photoFolderName
});

function canDeleteSitePhoto(item){
  return canDeleteSitePhotoForUser(item,currentUserEmail(),isAppAdmin());
}

let photoUploadModulePromise=null;
function photoUploadModule(){
  if(!photoUploadModulePromise) photoUploadModulePromise=import("./photo-upload.js");
  return photoUploadModulePromise;
}

async function prepareCloudinaryUploadFile(file){
  const mod=await photoUploadModule();
  return mod.prepareCloudinaryUploadFile(file);
}

async function prepareOfflinePhotoData(file){
  const mod=await photoUploadModule();
  return mod.prepareOfflinePhotoData(file);
}

async function uploadPhotoToCloudinary(photoId,file,site=selectedSite,folderName=""){
  const mod=await photoUploadModule();
  return mod.uploadPhotoToCloudinary({photoId,file,site,folderName,config:CLOUDINARY_PHOTOS});
}

async function deleteCloudinaryUpload(item){
  const token=safe((item && item.cloudinaryDeleteToken) || sitePhotoDeleteTokens.get(safe(item && item._id)));
  if(!token || !CLOUDINARY_PHOTOS.cloudName) return;
  const mod=await photoUploadModule();
  await mod.deleteCloudinaryUpload({token,config:CLOUDINARY_PHOTOS});
}

let sitePhotoPreviewUrls=[];
let sitePhotoItems=[];
let sitePhotoIndex=0;
let sitePhotoRenderSignature="";
let sitePhotoDeleteTokens=new Map();
function sitePhotosNode(id){
  return formFieldNode(id);
}
function sitePhotosListNode(){
  return sitePhotosNode("sitePhotosList");
}
function sitePhotosStatusNode(){
  return sitePhotosNode("sitePhotosStatus");
}
function setSitePhotosStatusText(text){
  setTextIfChanged(sitePhotosStatusNode(),text);
}

let offlinePhotoSyncRunning=false;

async function syncOfflinePhotos(options={}){
  if(offlinePhotoSyncRunning) return 0;
  if(!firebaseReady || !db || !fb.fsMod || navigator.onLine===false) return 0;
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return 0;
  const offlineItems=await readAllOfflinePhotoItems();
  if(!offlineItems.length) return 0;
  offlinePhotoSyncRunning=true;
  let synced=0;
  let failed=0;
  try{
    for(const item of offlineItems){
      const id=safe(item._id) || makeLocalRecordId("photo");
      const site=siteFromOfflineRecord(item,siteCacheSuffixFromPhoto(item));
      try{
        if(!site || !selectedSiteDocId(site)){
          throw new Error("K fotce nejde najít Firebase bod.");
        }
        const androidOperation=androidOutboxOperation(`photo:${id}`);
        if(String(androidOperation?.status || "").toUpperCase()==="SYNCED"){
          await removeOfflinePhotoItem(id,site,item);
          markAndroidOutboxSynced(`photo:${id}`);
          synced++;
          continue;
        }
        const folderName=photoFolderName(item) || photoFolderNameForDate(item.createdAt || new Date());
        const uploadFile=await offlinePhotoFileFromItem({...item,_id:id});
        const cloudinaryResult=await uploadPhotoToCloudinary(id,uploadFile,site,folderName);
        const syncedAt=new Date().toISOString();
        const payload={
          ...item,
          _id:id,
          url:cloudinaryResult.url,
          displayUrl:cloudinaryResult.displayUrl,
          fullUrl:cloudinaryResult.fullUrl,
          thumbUrl:cloudinaryResult.thumbUrl,
          storageMode:"cloudinary",
          _offline:false,
          _syncStatus:"online",
          localOnly:false,
          offlineReason:"",
          syncedAt,
          syncedBy:signedUser.email || currentUserEmail(),
          uploadedBy:item.uploadedBy || signedUser.email || currentUserEmail(),
          photoFolder:folderName,
          folderName,
          folder:folderName,
          cloudinaryFolderDate:folderName,
          cloudinaryPublicId:cloudinaryResult.cloudinaryPublicId,
          cloudinaryAssetId:cloudinaryResult.cloudinaryAssetId,
          cloudinaryVersion:cloudinaryResult.cloudinaryVersion,
          cloudinaryUploadPreset:cloudinaryResult.cloudinaryUploadPreset,
          cloudinaryFolder:cloudinaryResult.cloudinaryFolder || cloudinaryPhotoFolderPath(folderName),
          size:uploadFile.size || item.size || item.originalSize || 0
        };
        const childOk=await saveSiteChildItem("photos",id,payload,site);
        const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("photos",payload,site);
        if(!childOk && !embeddedOk) throw new Error("Firebase nepovolil uložit odkaz k bodu.");
        appendSiteLocalArray("photos",payload,site,0);
        savePhotosSnapshotToAndroid(site,[payload]);
        await removeOfflinePhotoItem(id,site,item);
        markAndroidOutboxSynced(`photo:${id}`);
        if(selectedSite && recordMatchesSite(payload,selectedSite)){
          sitePhotoItems=[payload,...sitePhotoItems.filter(photo=>safe(photo._id)!==id)];
          renderSitePhotos(sitePhotoItems,true);
        }
        synced++;
      }catch(e){
        failed++;
        console.warn("Synchronizace offline fotografie selhala",id,e);
      }
    }
  }finally{
    offlinePhotoSyncRunning=false;
  }
  if(synced && !options.silent){
    showSaveConfirmation(synced===1 ? "Offline fotografie uložena online." : `Offline fotografie uloženy online: ${synced}.`);
  }
  if(failed && !options.silent){
    setSitePhotosStatusText(`Některé offline fotografie ještě čekají na synchronizaci: ${failed}.`);
  }
  if((synced || failed) && window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  return synced;
}
window.syncOfflinePhotos=syncOfflinePhotos;

let offlineSyncRunning=false;
let offlineSyncLastStarted=0;

async function syncOfflineChanges(options={}){
  if(offlineSyncRunning) return 0;
  if(navigator.onLine===false) return 0;
  const now=Date.now();
  if(!options.force && now-offlineSyncLastStarted<2500) return 0;
  if(!firebaseReady || !db || !fb.fsMod) return 0;
  const signedUser=await waitForFirebaseUser(3000);
  if(!signedUser) return 0;
  offlineSyncRunning=true;
  offlineSyncLastStarted=now;
  if(window.noteSzzSyncState) window.noteSzzSyncState("syncing",{reason:options.reason || "auto"});
  if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(20);
  let siteCount=0;
  let protocolCount=0;
  let photoCount=0;
  try{
    const p=document.getElementById("progress");
    if(p && !options.silent) p.textContent="Synchronizuji offline změny...";
    if(typeof window.syncOfflineSites==="function"){
      siteCount=await window.syncOfflineSites({silent:true});
    }
    protocolCount=await syncAllOfflineProtocols({silent:true});
    photoCount=await syncOfflinePhotos({silent:true});
    const total=siteCount+protocolCount+photoCount;
    if(total){
      if(selectedSite){
        try{ window.refreshLoadedDetailTabs?.(selectedSite); }catch(e){}
      }
      if(!options.silent){
        showSaveConfirmation(`Offline změny odeslány online: ${total}.`);
      }
    }
    if(window.noteSzzSyncState) window.noteSzzSyncState("ok",{lastCount:total,reason:options.reason || "auto"});
    if(p && !options.silent) p.textContent="";
    return total;
  }catch(e){
    console.warn("Synchronizace offline změn selhala",e);
    if(window.noteSzzSyncState) window.noteSzzSyncState("error",{lastError:e && (e.message || e.code) || String(e),reason:options.reason || "auto"});
    const p=document.getElementById("progress");
    if(p && !options.silent) p.textContent="Offline změny zůstaly uložené lokálně a zkusí se odeslat později.";
    return protocolCount+photoCount;
  }finally{
    offlineSyncRunning=false;
    if(window.scheduleSzzOfflineAppStatus) window.scheduleSzzOfflineAppStatus(80);
  }
}
window.syncOfflineChanges=syncOfflineChanges;

const SZZ_SYNC_STATE_KEY="astipSzzSyncState:v1";
const SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY="astipMap:offlineSites:v1";
let szzOfflineStatusTimer=0;
let szzOfflineStatusRun=0;
const SZZ_OFFLINE_COUNTS_CACHE_MS=1200;
let szzOfflineCountsCache=null;
let szzOfflineCountsCacheAt=0;
const SZZ_LEGACY_OFFLINE_SITE_COUNT_CACHE_MS=1800;
let szzLegacyOfflineSiteCountCache={raw:null,count:0,savedAt:0};
const OFFLINE_SITE_COUNT_CACHE_MS=1800;
let offlineSiteCountCache={count:null,savedAt:0,storageLength:-1};
const OFFLINE_PHOTO_COUNT_CACHE_MS=1800;
let offlinePhotoCountCache={count:null,savedAt:0,storageLength:-1};

function cloneSzzOfflineCounts(counts){
  return counts ? {...counts} : counts;
}

function invalidateSzzOfflineCountsCache(){
  szzOfflineCountsCache=null;
  szzOfflineCountsCacheAt=0;
}
window.invalidateSzzOfflineCountsCache=invalidateSzzOfflineCountsCache;
function invalidateOfflineSiteCountCache(){
  offlineSiteCountCache={count:null,savedAt:0,storageLength:-1};
  szzLegacyOfflineSiteCountCache={raw:null,count:0,savedAt:0};
  clearOfflineSiteQueueReadCache();
  invalidateSzzOfflineCountsCache();
}
function invalidateOfflinePhotoCountCache(){
  offlinePhotoCountCache={count:null,savedAt:0,storageLength:-1};
  clearOfflinePhotoAllReadCache();
  invalidateSzzOfflineCountsCache();
}
window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY){
    invalidateOfflineSiteCountCache();
  }
  if(!event.key || event.key.startsWith("astipMap:offlinePhotos:")){
    invalidateOfflinePhotoCountCache();
  }
});

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
window.noteSzzSyncState=noteSzzSyncState;

async function readPendingOfflineSitesCount(){
  const now=Date.now();
  if(
    offlineSiteCountCache.count!==null &&
    offlineSiteCountCache.storageLength===localStorage.length &&
    now-offlineSiteCountCache.savedAt<OFFLINE_SITE_COUNT_CACHE_MS
  ){
    return offlineSiteCountCache.count;
  }
  const remember=count=>{
    offlineSiteCountCache={count:Number(count) || 0,savedAt:Date.now(),storageLength:localStorage.length};
    return offlineSiteCountCache.count;
  };
  try{
    const indexedItems=await readOfflineSiteQueueItems();
    if(indexedItems.length) return remember(countUniqueOfflineItems(indexedItems,"docId",isOfflineSiteQueueItem));
    const raw=localStorage.getItem(SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY) || "";
    if(szzLegacyOfflineSiteCountCache.raw===raw && Date.now()-szzLegacyOfflineSiteCountCache.savedAt<SZZ_LEGACY_OFFLINE_SITE_COUNT_CACHE_MS){
      return remember(szzLegacyOfflineSiteCountCache.count);
    }
    const items=JSON.parse(raw || "[]");
    const count=countUniqueOfflineItems(items,"docId",isOfflineSiteQueueItem);
    szzLegacyOfflineSiteCountCache={raw,count,savedAt:Date.now()};
    return remember(count);
  }catch(e){
    return remember(0);
  }
}

async function readPendingOfflineProtocolCount(){
  const now=Date.now();
  if(
    offlineProtocolCountCache.count!==null &&
    offlineProtocolCountCache.storageLength===localStorage.length &&
    now-offlineProtocolCountCache.savedAt<OFFLINE_PROTOCOL_COUNT_CACHE_MS
  ){
    return offlineProtocolCountCache.count;
  }
  const remember=count=>{
    offlineProtocolCountCache={count:Number(count) || 0,savedAt:Date.now(),storageLength:localStorage.length};
    return offlineProtocolCountCache.count;
  };
  try{
    const indexedItems=await readAllOfflineProtocolQueueItems();
    if(indexedItems.length) return remember(countUniqueOfflineItems(indexedItems));
    const entries=localStorageArrayEntries("astipMap:protocolHistory:");
    return remember(countPendingOfflineProtocolEntries(entries));
  }catch(e){}
  return remember(0);
}

async function readProtocolDraftCount(){
  const now=Date.now();
  if(
    protocolDraftCountCache!==null
    && protocolDraftCountStorageLength===localStorage.length
    && now-protocolDraftCountCacheAt<PROTOCOL_DRAFT_COUNT_CACHE_MS
  ){
    return protocolDraftCountCache;
  }
  try{
    const indexedCount=await withSzzOfflineQueueStore(SZZ_PROTOCOL_DRAFT_STORE,"readonly",(store,setResult)=>{
      const req=store.count();
      req.onsuccess=()=>setResult(Number(req.result) || 0);
      req.onerror=()=>setResult(0);
    });
    if(indexedCount){
      protocolDraftCountCache=indexedCount;
      protocolDraftCountCacheAt=Date.now();
      protocolDraftCountStorageLength=localStorage.length;
      return indexedCount;
    }
  }catch(e){}
  let count=0;
  try{
    const entries=localStorageObjectEntries("astipMap:protocolDraft:");
    for(const entry of entries){
      if(entry && entry.item && entry.item.payload) count++;
    }
  }catch(e){}
  protocolDraftCountCache=count;
  protocolDraftCountCacheAt=Date.now();
  protocolDraftCountStorageLength=localStorage.length;
  return count;
}

async function readPendingOfflinePhotoCount(){
  const now=Date.now();
  if(
    offlinePhotoCountCache.count!==null &&
    offlinePhotoCountCache.storageLength===localStorage.length &&
    now-offlinePhotoCountCache.savedAt<OFFLINE_PHOTO_COUNT_CACHE_MS
  ){
    return offlinePhotoCountCache.count;
  }
  const remember=count=>{
    offlinePhotoCountCache={count:Number(count) || 0,savedAt:Date.now(),storageLength:localStorage.length};
    return offlinePhotoCountCache.count;
  };
  if(typeof readAllOfflinePhotoItems==="function"){
    try{return remember((await readAllOfflinePhotoItems()).length);}catch(e){}
  }
  let count=0;
  try{
    const entries=localStorageArrayEntries("astipMap:offlinePhotos:");
    for(const entry of entries){
      count+=countPendingOfflinePhotoItems(entry.items);
    }
  }catch(e){}
  return remember(count);
}

async function collectSzzOfflineCounts(){
  const now=Date.now();
  if(szzOfflineCountsCache && now-szzOfflineCountsCacheAt<SZZ_OFFLINE_COUNTS_CACHE_MS){
    return cloneSzzOfflineCounts(szzOfflineCountsCache);
  }
  const ready=readSzzOfflineReadyState();
  const [sites,protocols,photos,drafts,storage,estimate,androidCounts]=await Promise.all([
    readPendingOfflineSitesCount(),
    readPendingOfflineProtocolCount(),
    readPendingOfflinePhotoCount(),
    readProtocolDraftCount(),
    requestSzzPersistentStorage({request:false}),
    szzStorageEstimate(),
    Promise.resolve(readAndroidOfflineCounts())
  ]);
  const androidPending=Math.max(0,Number(androidCounts?.pendingOutbox) || 0);
  const androidPhotos=Math.max(0,Number(androidCounts?.pendingPhotos) || 0);
  const androidAttachments=Math.max(0,Number(androidCounts?.pendingAttachments) || 0);
  const nativeVisiblePending=Math.max(androidPending,androidPhotos+androidAttachments);
  const counts={
    sites,
    protocols,
    photos:Math.max(photos,androidPhotos),
    attachments:androidAttachments,
    drafts,
    cachedRows:Math.max(readCachedFirebaseSiteCount(),Number(androidCounts?.cachedSites) || 0),
    persistentStorage:!!(storage.persisted || ready.persistentStorage),
    storageSupported:!!(storage.supported || ready.persistentStorageSupported),
    storageUsage:estimate ? estimate.usage : (Number(ready.storageUsage) || 0),
    storageQuota:estimate ? estimate.quota : (Number(ready.storageQuota) || 0),
    preparedAt:ready.preparedAt || "",
    androidPending,
    pending:Math.max(sites+protocols+photos,nativeVisiblePending)
  };
  szzOfflineCountsCache=counts;
  szzOfflineCountsCacheAt=Date.now();
  return cloneSzzOfflineCounts(counts);
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

const szzOfflineStatusNodeCache={};
function szzOfflineStatusNode(id){
  const cached=szzOfflineStatusNodeCache[id];
  if(cached && cached.isConnected) return cached;
  const el=document.getElementById(id);
  if(el) szzOfflineStatusNodeCache[id]=el;
  return el;
}

function renderSzzOfflineAppStatus(counts){
  const card=szzOfflineStatusNode("appSyncCard");
  if(!card) return;
  const state=readSzzSyncState();
  const online=navigator.onLine!==false;
  const pending=Number(counts?.pending) || 0;
  const drafts=Number(counts?.drafts) || 0;
  const syncing=state.status==="syncing" && Date.now()-new Date(state.syncStartedAt || 0).getTime()<45000;
  const dot=szzOfflineStatusNode("appConnectionDot");
  const label=szzOfflineStatusNode("appConnectionLabel");
  const text=szzOfflineStatusNode("appSyncText");
  const meta=szzOfflineStatusNode("appSyncMeta");
  const syncBtn=szzOfflineStatusNode("syncNowBtn");
  const setCount=(id,value)=>{
    setTextIfChanged(szzOfflineStatusNode(id),String(value || 0));
  };
  setCount("pendingSitesCount",counts?.sites);
  setCount("pendingProtocolsCount",counts?.protocols);
  setCount("pendingPhotosCount",counts?.photos);
  setCount("pendingDraftsCount",drafts);
  if(dot){
    dot.classList.toggle("offline",!online || pending>0);
    dot.classList.toggle("error",state.status==="error" && pending>0 && online);
  }
  if(card) card.classList.toggle("syncing",syncing);
  if(label){
    const message=!online
      ? "Offline režim"
      : syncing
        ? "Synchronizuji změny"
        : pending
          ? "Čeká na synchronizaci"
          : drafts
            ? "Jsou uložené koncepty"
            : "Synchronizováno";
    setTextIfChanged(label,message);
  }
  if(text){
    const message=!online
      ? "Práce se ukládá do telefonu. Po připojení se odešle do webu."
      : syncing
        ? "Odesílám lokální změny do Firebase a Cloudinary."
        : pending
          ? `V telefonu čeká ${pending} změn k odeslání.`
          : drafts
            ? "Rozepsané protokoly jsou uložené lokálně, odešlou se po uložení formuláře."
            : "Všechny uložené změny jsou spárované s webem.";
    setTextIfChanged(text,message);
  }
  if(meta){
    const last=szzSyncTimeLabel(state.lastSyncedAt);
    const lastCount=Number(state.lastCount) || 0;
    const error=safe(state.lastError);
    const cachedRows=Number(counts?.cachedRows) || 0;
    const usageLabel=szzBytesLabel(counts?.storageUsage);
    const storageLabel=counts?.persistentStorage ? "úložiště trvalé" : (counts?.storageSupported ? "úložiště běžné" : "úložiště nezjištěno");
    const offlineLabel=cachedRows ? `Offline data: ${cachedRows} bodů, ${storageLabel}${usageLabel ? `, ${usageLabel}` : ""}.` : `Offline data: ${storageLabel}.`;
    const message=error && pending
      ? `Poslední chyba: ${error}`
      : `Poslední synchronizace: ${last}${lastCount ? `, odesláno ${lastCount}` : ""}. ${offlineLabel}`;
    setTextIfChanged(meta,message);
  }
  if(syncBtn){
    const disabled=syncing || !online || !pending;
    if(syncBtn.disabled!==disabled) syncBtn.disabled=disabled;
    setTextIfChanged(syncBtn,syncing ? "Synchronizuji..." : "Synchronizovat teď");
  }
}

async function updateSzzOfflineAppStatus(options={}){
  if(options && options.force) invalidateSzzOfflineCountsCache();
  const runId=++szzOfflineStatusRun;
  const counts=await collectSzzOfflineCounts();
  if(runId!==szzOfflineStatusRun) return counts;
  window.__szzOfflineCounts=counts;
  renderSzzOfflineAppStatus(counts);
  return counts;
}
window.updateSzzOfflineAppStatus=updateSzzOfflineAppStatus;

function scheduleSzzOfflineAppStatus(delay=120){
  clearTimeout(szzOfflineStatusTimer);
  szzOfflineStatusTimer=setTimeout(()=>updateSzzOfflineAppStatus().catch(e=>console.warn("Offline stav se nepodařilo obnovit",e)),delay);
}
window.scheduleSzzOfflineAppStatus=scheduleSzzOfflineAppStatus;

let lastAutomaticSzzSyncTriggerAt=0;
const AUTOMATIC_SZZ_SYNC_TRIGGER_MIN_MS=60000;
async function triggerSzzSync(reason="manual",silent=false){
  const isAutomatic=reason!=="manual" && silent;
  if(isAutomatic){
    const now=Date.now();
    if(now-lastAutomaticSzzSyncTriggerAt<AUTOMATIC_SZZ_SYNC_TRIGGER_MIN_MS) return 0;
    lastAutomaticSzzSyncTriggerAt=now;
  }
  if(!silent && window.openAppToolsPanel) window.openAppToolsPanel();
  if(navigator.onLine===false){
    if(!silent && window.showSaveConfirmation) window.showSaveConfirmation("Jsi offline. Změny zůstanou uložené v telefonu.");
    scheduleSzzOfflineAppStatus(20);
    return 0;
  }
  noteSzzSyncState("syncing",{reason});
  scheduleSzzOfflineAppStatus(20);
  try{
    const synced=typeof syncOfflineChanges==="function"
      ? await syncOfflineChanges({reason,force:!silent,silent})
      : 0;
    noteSzzSyncState("ok",{reason,lastCount:synced});
    const counts=await updateSzzOfflineAppStatus({force:true});
    if(!silent && !synced && !counts.pending && window.showSaveConfirmation){
      window.showSaveConfirmation("Vše je synchronizované.");
    }
    return synced;
  }catch(e){
    noteSzzSyncState("error",{reason,lastError:e && (e.message || e.code) || String(e)});
    scheduleSzzOfflineAppStatus(20);
    throw e;
  }
}
window.triggerSzzSync=triggerSzzSync;

async function registerSzzBackgroundSync(reason="change"){
  if(!("serviceWorker" in navigator) || navigator.onLine===false) return false;
  try{
    const registration=window.registerSzzServiceWorker
      ? await window.registerSzzServiceWorker()
      : await navigator.serviceWorker.ready;
    if(registration && "sync" in registration){
      await registration.sync.register("astip-szz-offline-sync");
      return true;
    }
  }catch(e){
    console.warn("Background sync se nepodařilo naplánovat",reason,e);
  }
  return false;
}
window.registerSzzBackgroundSync=registerSzzBackgroundSync;

function bindSzzOfflineAppControls(){
  const syncBtn=document.getElementById("syncNowBtn");
  const refreshBtn=document.getElementById("refreshOfflineStateBtn");
  const prepareBtn=document.getElementById("prepareOfflineAppBtn");
  const forceFullBtn=document.getElementById("forceFullDataSyncBtn");
  if(prepareBtn && !prepareBtn.__szzPrepareBound){
    prepareBtn.__szzPrepareBound=true;
    prepareBtn.addEventListener("click",()=>prepareSzzOfflineAppData({reason:"manual"}).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Offline příprava se nepodařila.");
      console.warn("Offline příprava selhala",e);
    }));
  }
  if(syncBtn && !syncBtn.__szzSyncBound){
    syncBtn.__szzSyncBound=true;
    syncBtn.addEventListener("click",()=>triggerSzzSync("manual",false).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Synchronizace se nepodařila.");
      console.warn("Ruční synchronizace selhala",e);
    }));
  }
  if(refreshBtn && !refreshBtn.__szzRefreshBound){
    refreshBtn.__szzRefreshBound=true;
    refreshBtn.addEventListener("click",()=>updateSzzOfflineAppStatus());
  }
  if(forceFullBtn && !forceFullBtn.__szzFullSyncBound){
    forceFullBtn.__szzFullSyncBound=true;
    forceFullBtn.addEventListener("click",()=>prepareSzzOfflineAppData({
      reason:"manual-full",
      forceFull:true,
      skipOfflineMap:true
    }).catch(e=>{
      if(window.showSaveConfirmation) window.showSaveConfirmation("Úplné stažení dat se nepodařilo.");
      console.warn("Ruční úplné stažení dat selhalo",e);
    }));
  }
  if(!bindSzzOfflineAppControls.__initialStatusScheduled){
    bindSzzOfflineAppControls.__initialStatusScheduled=true;
    scheduleSzzOfflineAppStatus(1200);
  }
}
document.addEventListener("DOMContentLoaded",bindSzzOfflineAppControls);
bindSzzOfflineAppControls();

window.addEventListener("online",()=>{
  scheduleSzzOfflineAppStatus(20);
  registerSzzBackgroundSync("online");
  runWhenIdle(()=>triggerSzzSync("online",true).catch(()=>{}),1200);
});
window.addEventListener("offline",()=>scheduleSzzOfflineAppStatus(20));
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible"){
    scheduleSzzOfflineAppStatus(80);
    runWhenIdle(()=>triggerSzzSync("visible",true).catch(()=>{}),1200);
  }
});
window.addEventListener("focus",()=>{
  scheduleSzzOfflineAppStatus(80);
  runWhenIdle(()=>triggerSzzSync("focus",true).catch(()=>{}),1200);
});
window.addEventListener("storage",event=>{
  if(event.key && /^astip(Map|Szz)/.test(event.key)) scheduleSzzOfflineAppStatus(80);
});
if("serviceWorker" in navigator){
  navigator.serviceWorker.addEventListener("message",event=>{
    if(event.data && event.data.type==="SZZ_SYNC_REQUEST"){
      triggerSzzSync(event.data.reason || "background-sync",true).catch(()=>{});
    }
  });
}

function resetSitePhotoInput(){
  const input=sitePhotosNode("sitePhotosInput");
  const camera=sitePhotosNode("siteCameraInput");
  if(input) input.value="";
  if(camera) camera.value="";
  renderSitePhotoPreview();
}

function selectedSitePhotoFiles(){
  const gallery=sitePhotosNode("sitePhotosInput");
  const camera=sitePhotosNode("siteCameraInput");
  return [
    ...Array.from(gallery?.files || []),
    ...Array.from(camera?.files || [])
  ];
}

function renderSitePhotoPreview(){
  const box=sitePhotosNode("sitePhotoPreview");
  if(!box) return;
  sitePhotoPreviewUrls.forEach(url=>URL.revokeObjectURL(url));
  sitePhotoPreviewUrls=[];
  const files=selectedSitePhotoFiles();
  if(!files.length){
    box.replaceChildren();
    return;
  }
  const head=document.createElement("div");
  head.className="photo-preview-head";
  const title=document.createElement("span");
  title.textContent="Vybrané fotografie";
  const count=document.createElement("span");
  count.textContent=`${files.length} ks`;
  head.append(title,count);

  const grid=document.createElement("div");
  grid.className="photo-preview-grid";
  const fragment=document.createDocumentFragment();
  files.forEach((file,idx)=>{
    const url=URL.createObjectURL(file);
    sitePhotoPreviewUrls.push(url);
    const item=document.createElement("div");
    item.className="photo-preview-item";
    const img=document.createElement("img");
    img.src=url;
    img.alt=`Nová fotografie ${idx+1}`;
    img.decoding="async";
    const index=document.createElement("span");
    index.className="photo-preview-index";
    index.textContent=String(idx+1);
    item.append(img,index);
    fragment.appendChild(item);
  });
  grid.appendChild(fragment);
  box.replaceChildren(head,grid);
}

function sitePhotoKeys(site=selectedSite){
  return siteRecordKeys(site);
}

function sitePhotoRenderKey(items=sitePhotoItems,index=sitePhotoIndex,site=selectedSite){
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

function bindSitePhotoListClicks(list){
  if(!list || list.__szzPhotoClickBound) return;
  list.__szzPhotoClickBound=true;
  list.addEventListener("click",event=>{
    const button=event.target.closest && event.target.closest("button");
    if(button && list.contains(button)){
      if(button.id==="sitePhotoPrevBtn"){
        if(sitePhotoItems.length>1){
          sitePhotoIndex=(sitePhotoIndex-1+sitePhotoItems.length)%sitePhotoItems.length;
          renderSitePhotos(sitePhotoItems,true);
        }
        return;
      }
      if(button.id==="sitePhotoNextBtn"){
        if(sitePhotoItems.length>1){
          sitePhotoIndex=(sitePhotoIndex+1)%sitePhotoItems.length;
          renderSitePhotos(sitePhotoItems,true);
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
    if(sitePhotoIndex!==nextIndex){
      sitePhotoIndex=nextIndex;
      renderSitePhotos(sitePhotoItems,true);
    }
  });
}

function renderSitePhotos(items=sitePhotoItems,preserveIndex=false){
  const list=sitePhotosListNode();
  if(!list) return;
  bindSitePhotoListClicks(list);
  if(Array.isArray(items) && items!==sitePhotoItems){
    sitePhotoItems=items;
    if(!preserveIndex) sitePhotoIndex=0;
  }
  if(!sitePhotoItems.length){
    const emptySignature=`empty:${detailLazyKey(selectedSite) || sitePlaceGroupKey(selectedSite) || safe(selectedSite && selectedSite.id)}`;
    if(sitePhotoRenderSignature===emptySignature && list.childElementCount) return;
    sitePhotoRenderSignature=emptySignature;
    const empty=document.createElement("div");
    empty.className="site-photos-empty";
    empty.textContent="Zatím nejsou uložené žádné fotografie.";
    list.replaceChildren(empty);
    return;
  }
  sitePhotoIndex=Math.max(0,Math.min(sitePhotoIndex,sitePhotoItems.length-1));
  const renderSignature=sitePhotoRenderKey(sitePhotoItems,sitePhotoIndex,selectedSite);
  if(sitePhotoRenderSignature===renderSignature && list.childElementCount) return;
  sitePhotoRenderSignature=renderSignature;
  const item=sitePhotoItems[sitePhotoIndex];
  const mainUrl=photoDisplayUrl(item);
  const fullUrl=photoFullUrl(item);
  const thumbCount=sitePhotoItems.length;
  const photoMeta=photoRenderMeta(item,sitePhotoIndex);
  const currentFolder=photoMeta.currentFolder;
  const photoInfoRows=photoMeta.photoInfoRows;
  const downloadName=photoMeta.downloadName;
  const deleteAllowed=canDeleteSitePhoto(item);
  const viewer=document.createElement("div");
  viewer.className="site-photo-viewer";

  const stage=document.createElement("div");
  stage.className="site-photo-stage";
  const frame=document.createElement("div");
  frame.className="site-photo-frame";
  const mainLink=document.createElement("a");
  mainLink.className="site-photo-main";
  mainLink.href=fullUrl || mainUrl;
  mainLink.target="_blank";
  const mainImg=document.createElement("img");
  mainImg.src=mainUrl;
  mainImg.alt=`Fotografie bodu ${sitePhotoIndex+1}`;
  mainImg.decoding="async";
  mainLink.appendChild(mainImg);
  const prev=document.createElement("button");
  prev.className="secondary site-photo-arrow site-photo-arrow-prev";
  prev.type="button";
  prev.id="sitePhotoPrevBtn";
  prev.disabled=thumbCount<=1;
  prev.setAttribute("aria-label","Předchozí fotografie");
  prev.textContent="‹";
  const next=document.createElement("button");
  next.className="secondary site-photo-arrow site-photo-arrow-next";
  next.type="button";
  next.id="sitePhotoNextBtn";
  next.disabled=thumbCount<=1;
  next.setAttribute("aria-label","Další fotografie");
  next.textContent="›";
  const counter=document.createElement("span");
  counter.className="site-photo-counter";
  counter.textContent=`${sitePhotoIndex+1} / ${thumbCount}`;
  frame.append(mainLink,prev,next,counter);
  stage.appendChild(frame);
  viewer.appendChild(stage);

  const thumbs=document.createElement("div");
  thumbs.className="site-photo-thumbs";
  const folderGroups=sitePhotoFolderGroups(sitePhotoItems);
  const activeFolder=currentFolder || (folderGroups[0] && folderGroups[0].folder) || "";
  const thumbsFragment=document.createDocumentFragment();
  for(const group of folderGroups){
    const groupEl=document.createElement("div");
    groupEl.className=`site-photo-folder-group ${group.folder===activeFolder ? "active" : ""}`.trim();
    const folderName=safe(group.folder) || "Bez názvu složky";
    const label=document.createElement("button");
    label.className="site-photo-folder-label";
    label.type="button";
    label.dataset.photoIdx=String((group.photos[0] && group.photos[0].idx) || 0);
    label.setAttribute("aria-label",`Zobrazit složku ${folderName}`);
    label.textContent=folderName;
    const row=document.createElement("div");
    row.className="site-photo-folder-thumbs";
    for(const {photo,idx} of group.photos){
      const button=document.createElement("button");
      button.className=`site-photo-thumb ${idx===sitePhotoIndex ? "active" : ""}`.trim();
      button.type="button";
      button.dataset.photoIdx=String(idx);
      button.setAttribute("aria-label",`Zobrazit fotografii ${idx+1}`);
      const thumbImg=document.createElement("img");
      thumbImg.src=photoThumbUrl(photo);
      thumbImg.alt=`Náhled ${idx+1}`;
      thumbImg.loading="lazy";
      thumbImg.decoding="async";
      button.appendChild(thumbImg);
      row.appendChild(button);
    }
    groupEl.append(label,row);
    thumbsFragment.appendChild(groupEl);
  }
  thumbs.appendChild(thumbsFragment);
  viewer.appendChild(thumbs);

  const actions=document.createElement("div");
  actions.className="site-photo-actions";
  const download=document.createElement("a");
  download.href=fullUrl || mainUrl;
  download.target="_blank";
  download.download=downloadName;
  download.textContent="Stáhnout fotku";
  const del=document.createElement("button");
  del.className="danger";
  del.type="button";
  del.id="deleteSitePhotoBtn";
  del.disabled=!deleteAllowed;
  del.textContent="Smazat fotku";
  actions.append(download,del);
  viewer.appendChild(actions);

  const infoStrip=document.createElement("div");
  infoStrip.className="site-photo-info-strip";
  for(const [label,value] of photoInfoRows){
    const pill=document.createElement("div");
    pill.className="site-photo-info-pill";
    const labelEl=document.createElement("span");
    labelEl.textContent=safe(label);
    const valueEl=document.createElement("b");
    valueEl.textContent=safe(value);
    pill.append(labelEl,valueEl);
    infoStrip.appendChild(pill);
  }
  viewer.appendChild(infoStrip);

  if(photoMeta.meta){
    const metaEl=document.createElement("div");
    metaEl.className="site-photo-meta";
    metaEl.textContent=photoMeta.meta;
    viewer.appendChild(metaEl);
  }

  list.replaceChildren(viewer);
}

async function loadSitePhotos(site=selectedSite){
  const st=sitePhotosStatusNode();
  if(!st) return;
  const requestedKey=detailLazyKey(site);
  const stillSameSite=()=>!requestedKey || requestedKey===detailLazyKey(selectedSite);
  const items=[];
  const photoDedupe=createRecordIdDedupe(items);
  const addPhoto=item=>{
    if(!item || !photoDisplayUrl(item)) return;
    photoDedupe.add(item);
  };
  const renderLoaded=(message="")=>{
    if(!stillSameSite()) return;
    items.sort((a,b)=>historyTimeValue(b)-historyTimeValue(a));
    renderSitePhotos(items);
    setSitePhotosStatusText(message || (items.length ? `Načteno fotografií: ${items.length}.` : ""));
    savePhotosSnapshotToAndroid(site,items);
  };
  let offlinePhotosPromise=null;
  const mergeOfflinePhotosOnce=async()=>{
    if(!site) return;
    const offlinePhotos=await (offlinePhotosPromise || readOfflinePhotoItems(site));
    for(let idx=0;idx<offlinePhotos.length;idx++){
      const item=offlinePhotos[idx];
      addPhoto({...item,_id:item._id || `offline_photo_${idx}`,storageMode:item.storageMode || "offline",_offline:true});
    }
  };

  if(site){
    const androidPhotos=readAndroidCachedRecords("cachedPhotosJson",site,5000);
    for(let idx=0;idx<androidPhotos.length;idx++){
      const item=androidPhotos[idx];
      addPhoto({...item,_id:item._id || `android_photo_${idx}`,_androidRoom:true});
    }
    const localPhotos=readSiteLocalArray("photos",site);
    for(let idx=0;idx<localPhotos.length;idx++){
      const item=localPhotos[idx];
      addPhoto({...item,_id:item._id || `local_photo_${idx}`});
    }
    offlinePhotosPromise=readOfflinePhotoItems(site).catch(e=>{
      console.warn("Offline fotografie nejde načíst",e);
      return [];
    });
  }

  if(!firebaseReady || !db || !site){
    await mergeOfflinePhotosOnce();
    renderLoaded(items.length ? `Načteno lokálních fotografií: ${items.length}.` : "");
    return;
  }
  if(!stillSameSite()) return;
  setSitePhotosStatusText("Načítám fotografie...");
  const signedUser=await waitForFirebaseUser();
  if(!stillSameSite()) return;
  if(!signedUser){
    await mergeOfflinePhotosOnce();
    renderLoaded(items.length ? `Načteno lokálních fotografií: ${items.length}.` : "Čekám na přihlášení, fotografie se načtou po přihlášení.");
    return;
  }
  try{
    const [,,childPhotos]=await Promise.all([
      mergeOfflinePhotosOnce(),
      refreshSiteDataFromFirebase(site),
      loadSiteChildItems("photos",site)
    ]);
    if(!stillSameSite()) return;
    const embeddedPhotos=Array.isArray(site?.firebaseData?.photos) ? site.firebaseData.photos : [];
    for(let idx=0;idx<embeddedPhotos.length;idx++){
      const item=embeddedPhotos[idx];
      addPhoto({...item,_id:item._id || `embedded_photo_${idx}`});
    }
    for(let idx=0;idx<childPhotos.length;idx++){
      const item=childPhotos[idx];
      addPhoto({...item,_id:item._id || `site_photo_${idx}`});
    }
    renderLoaded();
  }catch(e){
    if(items.length){
      renderLoaded(`Načteno lokálních fotografií: ${items.length}. Online fotky se nepodařilo načíst.`);
    }else{
      if(stillSameSite()) setSitePhotosStatusText("Chyba načtení fotografií: "+e.message);
    }
  }
}

async function deleteCurrentSitePhoto(){
  const item=sitePhotoItems[sitePhotoIndex];
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
    sitePhotoItems=sitePhotoItems.filter(photo=>safe(photo && photo._id)!==id);
    if(sitePhotoIndex>=sitePhotoItems.length) sitePhotoIndex=Math.max(0,sitePhotoItems.length-1);
    renderSitePhotos(sitePhotoItems,true);
    setSitePhotosStatusText("Fotografie smazána z bodu.");
    showSaveConfirmation("Fotografie smazána z bodu.");
  }catch(e){
    setSitePhotosStatusText("Chyba mazání fotografie: "+e.message);
  }
}

async function uploadSitePhotos(){
  const st=sitePhotosStatusNode();
  const files=selectedSitePhotoFiles();
  if(!st) return;
  if(!selectedSite){setSitePhotosStatusText("Není vybraný bod.");return;}
  if(!files.length){setSitePhotosStatusText("Nejdřív vyber fotografie.");return;}

  try{
    const signedUser=(firebaseReady && db) ? await waitForFirebaseUser(1200) : null;
    const userEmail=signedUser?.email || currentUser?.email || lastKnownUserEmail() || "";
    const identity=siteRecordIdentity(selectedSite);
    const onlineUploadAvailable=!!(firebaseReady && db && signedUser && navigator.onLine !== false);
    const uploadFolderName=photoFolderNameForDate(new Date());
    let localOnlyCount=0;
    let offlineCount=0;
    let onlineCount=0;

    const buildBasePayload=(photoId,file,createdAt)=>({
      _id:photoId,
      ...identity,
      fileName:file.name || "",
      uploadedBy:userEmail || "nepřihlášený uživatel",
      photoFolder:uploadFolderName,
      folderName:uploadFolderName,
      folder:uploadFolderName,
      cloudinaryFolderDate:uploadFolderName,
      cloudinaryFolder:cloudinaryPhotoFolderPath(uploadFolderName),
      createdAt,
      takenAt:file.lastModified ? new Date(file.lastModified).toISOString() : createdAt
    });

    const saveOfflinePhoto=async (photoId,file,reason,index)=>{
      setSitePhotosStatusText(`Ukládám fotografii ${index+1}/${files.length} lokálně...`);
      const createdAt=new Date().toISOString();
      const offlineData=await prepareOfflinePhotoData(file);
      const photoPayload={
        ...buildBasePayload(photoId,file,createdAt),
        url:offlineData.dataUrl,
        displayUrl:offlineData.dataUrl,
        fullUrl:offlineData.dataUrl,
        thumbUrl:offlineData.dataUrl,
        storageMode:"offline",
        _offline:true,
        _syncStatus:"local",
        localOnly:true,
        offlineReason:safe(reason),
        size:offlineData.size || file.size,
        originalSize:file.size,
        type:offlineData.type || file.type || "image/jpeg",
        syncQueuedAt:createdAt
      };
      await saveOfflinePhotoItem(photoPayload,selectedSite);
      saveLocalPhotoToAndroid(selectedSite,photoPayload);
      offlineCount++;
      renderSitePhotos([photoPayload,...sitePhotoItems.filter(photo=>safe(photo._id)!==photoPayload._id)]);
    };

    for(let i=0;i<files.length;i++){
      const file=files[i];
      const photoId=(window.crypto && window.crypto.randomUUID)
        ? window.crypto.randomUUID()
        : `photo_${Date.now()}_${Math.random().toString(36).slice(2)}`;

      if(!onlineUploadAvailable){
        await saveOfflinePhoto(photoId,file,!navigator.onLine ? "Bez připojení k internetu." : "Firebase nebo přihlášení není dostupné.",i);
        continue;
      }

      setSitePhotosStatusText(`Zmenšuji fotografii ${i+1}/${files.length}...`);
      let uploadFile;
      let cloudinaryResult;
      try{
        uploadFile=await prepareCloudinaryUploadFile(file);
        setSitePhotosStatusText(`Nahrávám fotografii ${i+1}/${files.length} na Cloudinary...`);
        cloudinaryResult=await uploadPhotoToCloudinary(photoId,uploadFile,selectedSite,uploadFolderName);
      }catch(uploadError){
        console.warn("Online nahrání fotky selhalo, ukládám lokálně",uploadError);
        await saveOfflinePhoto(photoId,file,uploadError.message,i);
        continue;
      }
      if(cloudinaryResult?.cloudinaryDeleteToken){
        sitePhotoDeleteTokens.set(photoId,cloudinaryResult.cloudinaryDeleteToken);
      }

      const createdAt=new Date().toISOString();
      const photoPayload={
        ...buildBasePayload(photoId,file,createdAt),
        url:cloudinaryResult.url,
        displayUrl:cloudinaryResult.displayUrl,
        fullUrl:cloudinaryResult.fullUrl,
        thumbUrl:cloudinaryResult.thumbUrl,
        storageMode:"cloudinary",
        cloudinaryPublicId:cloudinaryResult.cloudinaryPublicId,
        cloudinaryAssetId:cloudinaryResult.cloudinaryAssetId,
        cloudinaryVersion:cloudinaryResult.cloudinaryVersion,
        cloudinaryUploadPreset:cloudinaryResult.cloudinaryUploadPreset,
        cloudinaryFolder:cloudinaryResult.cloudinaryFolder || cloudinaryPhotoFolderPath(uploadFolderName),
        size:uploadFile.size || file.size,
        originalSize:file.size
      };
      const childOk=await saveSiteChildItem("photos",photoId,photoPayload,selectedSite);
      const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("photos",photoPayload,selectedSite);
      appendSiteLocalArray("photos",photoPayload,selectedSite,0);
      savePhotosSnapshotToAndroid(selectedSite,[photoPayload]);
      if(!childOk && !embeddedOk){
        localOnlyCount++;
        setSitePhotosStatusText("Fotografie je na Cloudinary. Firebase nepovolil uložení odkazu k bodu, proto je odkaz uložen lokálně v tomto prohlížeči.");
      }
      onlineCount++;
      renderSitePhotos([photoPayload,...sitePhotoItems.filter(photo=>safe(photo._id)!==photoPayload._id)]);
    }

    if(offlineCount && onlineCount){
      setSitePhotosStatusText(`Uloženo fotografií do složky ${uploadFolderName}: ${onlineCount} online, ${offlineCount} lokálně v tomto zařízení.`);
      showSaveConfirmation("Fotografie uloženy.");
    }else if(offlineCount){
      setSitePhotosStatusText(`Fotografie uloženy lokálně do složky ${uploadFolderName}: ${offlineCount}. Po připojení se samy odešlou online.`);
      showSaveConfirmation("Fotografie uloženy lokálně.");
    }else if(localOnlyCount){
      setSitePhotosStatusText(`Fotografie nahrány na Cloudinary do složky ${uploadFolderName}. ${localOnlyCount} odkazů Firebase nepovolil uložit k bodu, proto jsou uložené lokálně v tomto prohlížeči.`);
      showSaveConfirmation("Fotografie nahrány.");
    }else{
      setSitePhotosStatusText(`Uloženo fotografií do složky ${uploadFolderName}: ${onlineCount} (Cloudinary).`);
      showSaveConfirmation("Fotografie uloženy.");
    }
    if(offlineCount && navigator.onLine!==false && typeof syncOfflineChanges==="function"){
      setTimeout(()=>syncOfflineChanges({reason:"photo-offline-save",silent:true}),2500);
    }
    resetSitePhotoInput();
    try{ refreshDetailTabLoad("gallery",selectedSite); }catch(e){}
  }catch(e){
    setSitePhotosStatusText("Chyba uložení fotografií: "+e.message);
  }
}

window.loadSitePhotos=loadSitePhotos;
window.uploadSitePhotos=uploadSitePhotos;

const ATTACHMENT_INLINE_MAX_BYTES=650*1024;
let siteAttachmentItems=[];
let siteAttachmentRenderSignature="";
function siteAttachmentsNode(id){
  return formFieldNode(id);
}
function siteAttachmentsStatusNode(){
  return siteAttachmentsNode("siteAttachmentsStatus");
}
function setSiteAttachmentsStatusText(text){
  setTextIfChanged(siteAttachmentsStatusNode(),text);
}
function selectedSiteAttachmentFiles(){
  return Array.from(siteAttachmentsNode("siteAttachmentsInput")?.files || []);
}
function resetSiteAttachmentInput(){
  const input=siteAttachmentsNode("siteAttachmentsInput");
  if(input) input.value="";
  renderSiteAttachmentPreview();
}
function renderSiteAttachmentPreview(){
  const box=siteAttachmentsNode("siteAttachmentsPreview");
  if(!box) return;
  const files=selectedSiteAttachmentFiles();
  if(!files.length){
    box.replaceChildren();
    return;
  }
  const fragment=document.createDocumentFragment();
  files.forEach(file=>{
    const row=document.createElement("div");
    row.textContent=`${file.name || "Příloha"}${bytesLabel(file.size) ? ` · ${bytesLabel(file.size)}` : ""}`;
    fragment.appendChild(row);
  });
  box.replaceChildren(fragment);
}
function readAttachmentFileData(file){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result || ""));
    reader.onerror=()=>reject(reader.error || new Error("Přílohu se nepodařilo načíst."));
    reader.readAsDataURL(file);
  });
}
function attachmentSiblingRows(site=selectedSite){
  const siblings=siteSiblingRows(site).filter(Boolean);
  return siblings.length ? siblings : (site ? [site] : []);
}
function renderSiteAttachments(items=[]){
  const list=siteAttachmentsNode("siteAttachmentsList");
  if(!list) return;
  const source=Array.isArray(items) ? items : [];
  const signature=attachmentRenderSignature(source);
  if(siteAttachmentRenderSignature===signature && list.childElementCount) return;
  siteAttachmentRenderSignature=signature;
  if(!source.length){
    const empty=document.createElement("div");
    empty.className="site-photos-empty";
    empty.textContent="Zatím nejsou uložené žádné přílohy.";
    list.replaceChildren(empty);
    return;
  }
  const fragment=document.createDocumentFragment();
  source.forEach((item,idx)=>{
    const row=document.createElement("div");
    row.className="site-attachment-item";
    const info=document.createElement("div");
    const title=document.createElement("div");
    title.className="site-attachment-title";
    title.textContent=attachmentFileName(item,idx);
    const meta=document.createElement("div");
    meta.className="site-attachment-meta";
    meta.textContent=[
      photoInsertedLabel(item),
      bytesLabel(item.size || item.originalSize),
      item.uploadedBy
    ].filter(Boolean).join(" · ");
    info.append(title,meta);
    const actions=document.createElement("div");
    actions.className="site-attachment-actions";
    const url=attachmentDisplayUrl(item);
    if(url){
      const open=document.createElement("a");
      open.className="secondary";
      open.href=url;
      open.target="_blank";
      open.rel="noopener";
      open.textContent="Otevřít";
      const download=document.createElement("a");
      download.className="secondary";
      download.href=url;
      download.download=attachmentFileName(item,idx);
      download.textContent="Stáhnout";
      actions.append(open,download);
    }
    row.append(info,actions);
    fragment.appendChild(row);
  });
  list.replaceChildren(fragment);
}
async function loadSiteAttachments(site=selectedSite){
  const st=siteAttachmentsStatusNode();
  if(!st) return;
  const requestedKey=detailLazyKey(site);
  const stillSameSite=()=>!requestedKey || requestedKey===detailLazyKey(selectedSite);
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
    siteAttachmentItems=items.slice();
    renderSiteAttachments(siteAttachmentItems);
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
  if(!firebaseReady || !db || !site){
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
async function uploadSiteAttachments(){
  const files=selectedSiteAttachmentFiles();
  if(!selectedSite){ setSiteAttachmentsStatusText("Není vybraný bod."); return; }
  if(!files.length){ setSiteAttachmentsStatusText("Nejdřív vyber přílohy."); return; }
  const oversized=files.find(file=>Number(file.size || 0)>ATTACHMENT_INLINE_MAX_BYTES);
  if(oversized){
    setSiteAttachmentsStatusText(`Příloha ${oversized.name || ""} je moc velká. V této verzi je limit ${bytesLabel(ATTACHMENT_INLINE_MAX_BYTES)} na soubor.`);
    return;
  }
  const signedUser=(firebaseReady && db) ? await waitForFirebaseUser(1200) : null;
  const userEmail=signedUser?.email || currentUser?.email || lastKnownUserEmail() || "";
  const onlineSaveAvailable=!!(firebaseReady && db && signedUser && navigator.onLine !== false);
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
  renderSiteAttachments(siteAttachmentItems);
  setSiteAttachmentsStatusText(onlineSaveAvailable ? `Uloženo příloh: ${savedCount}.` : `Přílohy uloženy lokálně: ${savedCount}.`);
  showSaveConfirmation(onlineSaveAvailable ? "Přílohy uloženy." : "Přílohy uloženy lokálně.");
  try{ refreshDetailTabLoad("attachments",selectedSite); }catch(e){}
}
function addLocalAttachmentToCurrentView(item){
  const id=safe(item && item._id);
  siteAttachmentItems=[item,...siteAttachmentItems.filter(existing=>safe(existing && existing._id)!==id)];
  siteAttachmentRenderSignature="";
}
window.loadSiteAttachments=loadSiteAttachments;
window.uploadSiteAttachments=uploadSiteAttachments;

async function getLastProtocol(site=selectedSite){
  if(!firebaseReady || !db || !site) return null;
  const cachedProtocol=readLastProtocolCache(site);
  if(cachedProtocol!==undefined) return cachedProtocol;
  const signedUser=await waitForFirebaseUser();
  if(!signedUser) return null;
  try{
    const localProtocolItemsPromise=readSiteLocalProtocolHistoryItems(site)
      .catch(e=>{
        console.warn("Lokální poslední protokol nejde načíst",e);
        return [];
      });
    const [localProtocolItems,,childProtocols]=await Promise.all([
      localProtocolItemsPromise,
      refreshSiteDataFromFirebase(site),
      loadSiteChildItems("protocols",site)
    ]);
    const {collection,query,where,getDocs,doc,getDoc}=fb.fsMod;
    const keys=siteRecordKeys(site);
    const items=[];
    const itemDedupe=createRecordIdDedupe(items);
    const addProtocolItem=item=>{
      itemDedupe.add(item);
    };
    childProtocols.forEach((item,idx)=>{
      addProtocolItem({...item,_id:item._id || `site_protocol_${idx}`});
    });
    const embeddedProtocols=Array.isArray(site?.firebaseData?.protocolHistory) ? site.firebaseData.protocolHistory : [];
    embeddedProtocols.forEach((item,idx)=>{
      addProtocolItem({...item,_id:item._id || `embedded_protocol_${idx}`});
    });
    localProtocolItems.forEach((item,idx)=>{
      const id=item._id || `local_protocol_${idx}`;
      if(!itemDedupe.has(id)) addProtocolItem({...item,_id:id});
    });
    const protocolRefs=Array.isArray(site?.firebaseData?.protocolRefs) ? site.firebaseData.protocolRefs : [];
    const protocolRefTasks=protocolRefs.map(refItem=>async()=>{
      const id=safe(refItem && refItem._id);
      if(!id || itemDedupe.has(id)) return;
      try{
        const snap=await getDoc(doc(db,"protocols",id));
        if(snap.exists()) addProtocolItem({...snap.data(),_id:snap.id});
        else addProtocolItem({...refItem,_id:id});
      }catch(e){
        addProtocolItem({...refItem,_id:id});
      }
    });
    await runBoundedFirestoreTasks(protocolRefTasks,6);
    const addProtocolDocSnap=docSnap=>{
      addProtocolItem({...docSnap.data(),_id:docSnap.id});
    };
    const addSnap=snap=>snap.forEach(addProtocolDocSnap);
    const siteKeysBatchOk=await readFirestoreArrayContainsAny(
      fb.fsMod,
      db,
      "protocols",
      "siteKeys",
      keys,
      addProtocolDocSnap,
      "Poslední protokol dávkový dotaz selhal"
    );
    const protocolQueryTasks=[];
    for(const field of SITE_RECORD_EQUALITY_FIELDS){
      protocolQueryTasks.push(()=>readFirestoreEqualsAny(
        fb.fsMod,
        db,
        "protocols",
        field,
        keys,
        addProtocolDocSnap,
        "Poslední protokol rovnostní dávkový dotaz selhal"
      ));
    }
    for(const id of keys){
      if(!siteKeysBatchOk){
        protocolQueryTasks.push(async()=>{
          try{
            addSnap(await getDocs(query(collection(db,"protocols"),where("siteKeys","array-contains",id))));
          }catch(e){
            console.warn("Poslední protokol dotaz selhal","siteKeys",e);
          }
        });
      }
    }
    await runBoundedFirestoreTasks(protocolQueryTasks,6);
    let latest=latestMatchingHistoryItemForSite(items,site);
    if(!latest){
      const textQueryTasks=[];
      const textKeys=siteRecordTextKeys(site).slice(0,8);
      for(const value of textKeys){
        for(const field of ["siteName","siteAddress","place"]){
          textQueryTasks.push(async()=>{
            try{
              addSnap(await getDocs(query(collection(db,"protocols"),where(field,"==",value))));
            }catch(e){
              console.warn("Poslední protokol textový dotaz selhal",field,e);
            }
          });
        }
      }
      await runBoundedFirestoreTasks(textQueryTasks,6);
      latest=latestMatchingHistoryItemForSite(items,site);
    }
    writeLastProtocolCache(site,latest);
    return latest;
  }catch(e){
    console.warn("Nepodařilo se načíst poslední protokol:",e);
    return null;
  }
}

async function prefillProtocol(){
  if(!selectedSite) return;

  resetProtocolFormForSelectedSite(selectedSite.id);
  const raw=selectedSite.raw || {};
  const last=await getLastProtocol(selectedSite).catch(e=>{
    console.warn("Předvyplnění z posledního protokolu selhalo",e);
    return null;
  });

  // základ z aktuálního místa
  populateProtocolDeviceSelect();
  const address=selectedSite.adresa || pickRawValue(raw,["Název","Adresa / umístění","Adresa_GPS","Umístění"]);
  const contacts=siteContactForProtocol(selectedSite);
  const period=periodMonths(selectedSite) === 12 ? "12 měsíců" : "6 měsíců";
  const deviceType=protocolDeviceTypeFromSite(selectedSite);
  const serial=protocolSerialFromSite(selectedSite);
  const sourceLocation=protocolSourceLocationFromSite(selectedSite);

  setProtocolFieldValue("protoDate",new Date().toISOString().slice(0,10));
  setProtocolFieldValue("protoPlace",address);
  setProtocolFieldValue("protoContacts",contacts);
  setProtocolFieldValue("protoTechSign",normalizeTechnicianDisplayName(currentUser?.displayName || currentUser?.email || lastKnownUserEmail() || ""));
  setProtocolFieldValue("protoPeriod",period);
  setProtocolFieldValue("protoDeviceType",deviceType);
  setProtocolFieldValue("protoSerial",serial);
  setProtocolFieldValue("protoPbzLocation",sourceLocation);

  // předvyplnění z dat v indexu / CSV
  setIfEmpty("protoBatteryCount", pickRawValue(raw,["Počet baterií","Pocet baterii","Počet baterií (ks)","Baterie ks","Počet AKU"]));
  setIfEmpty("protoCapacity", pickRawValue(raw,["Kapacita","Kapacita (Ah)","Kapacita Ah","Ah"]));
  setIfEmpty("protoSetCount", pickRawValue(raw,["Počet sad","Pocet sad","Počet sad (ks)","Sady ks"]));
  setIfEmpty("protoAuxBatteryAh", pickRawValue(raw,["Pom. Bat","Pom. Bat (Ah)","Pomocná baterie","Pom baterie"]));


  setIfEmpty("protoOperator", pickRawValue(raw,["Provozovatel","Provozovatel zařízení"]));
  setIfEmpty("protoCustomer", pickRawValue(raw,["Objednatel","Faktura na","Protokol na","Objednatel zkoušky provozuschopnosti"]));
  setIfEmpty("protoBreakersLocation", pickRawValue(raw,["Jistič UPS","Jistic UPS","Umístění jističů","Jističe UPS","Jističe"]));
  setIfEmpty("protoControlLocation", pickRawValue(raw,["Umístění ovládání","Ovládání zálohovaných zařízení"]));
  setIfEmpty("protoTestProcedure", pickRawValue(raw,["Postup testování","Postup testovani","Postup testu"]));


  // Z posledního protokolu přebíráme jen trvalé údaje: bod 4 bez teploty/plomby a body 6, 7, 8, 10.
  if(last){
    setIfEmpty("protoPbzLocation", last.pbzLocation);
    setIfEmpty("protoBatteryCount", last.batteryCount);
    setIfEmpty("protoCapacity", last.capacityAh);
    setIfEmpty("protoSetCount", last.setCount);
    setIfEmpty("protoAuxBatteryAh", last.auxBatteryAh);
    setIfEmpty("protoControlLocation", last.controlLocation);

    if(last.backedDevices){
      setCheckbox("protoLift", last.backedDevices.lift);
      setCheckbox("protoVent", last.backedDevices.vent);
      setCheckbox("protoMachineLight", last.backedDevices.machineLight);
      setCheckbox("protoChuc", last.backedDevices.chuc);
      setCheckbox("protoDamper", last.backedDevices.damper);
      setCheckbox("protoSkylight", last.backedDevices.skylight);
      setCheckbox("protoGate", last.backedDevices.gate);
      setCheckbox("protoAts", last.backedDevices.ats);
      setCheckbox("protoRpo", last.backedDevices.rpo);
      setCheckbox("protoNo", last.backedDevices.no);
      setCheckbox("protoSprinkler", last.backedDevices.sprinkler);
      setCheckbox("protoCsTs", last.backedDevices.csTs);
      setIfEmpty("protoOtherDevice", last.backedDevices.other);
    }

    if(last.access){
      setCheckbox("protoBlue", last.access.blue);
      setCheckbox("protoB", last.access.b);
      setCheckbox("protoC", last.access.c);
      setCheckbox("protoGarage", last.access.garage);
      setCheckbox("protoCarLift", last.access.carLift);
      setCheckbox("protoBarrier", last.access.barrier);
      setCheckbox("protoParkingHouse", last.access.parkingHouse);
      setCheckbox("protoPermit", last.access.permit);
      setCheckbox("protoTraining", last.access.training);
      setCheckbox("protoShoes", last.access.shoes);
      setCheckbox("protoVest", last.access.vest);
      setCheckbox("protoHelmet", last.access.helmet);
      setIfEmpty("protoOtherAccess", last.access.other);
    }

    if(last.availability){
      setCheckbox("protoWcOk", last.availability.wcOk);
      setCheckbox("protoWcNok", last.availability.wcNok);
      setCheckbox("protoLightOk", last.availability.lightOk);
      setCheckbox("protoLightNok", last.availability.lightNok);
      setCheckbox("protoLadder", last.availability.ladder);
      setCheckbox("protoStairs", last.availability.stairs);
      setCheckbox("protoLowCeiling", last.availability.lowCeiling);
      setCheckbox("protoExtremeTemp", last.availability.extremeTemp);
      setIfEmpty("protoOtherAvailability", last.availability.other);
    }

    setIfEmpty("protoChecklist", last.checklist || last.checkList || last.chceckList);
    setProtocolStatusText("Předvyplněno z posledního uloženého protokolu a dat místa.");
  }else{
    setProtocolStatusText("Předvyplněno z dat místa.");
  }

  updateProtocolSummary();
  bindProtocolDraftAutosave();
  restoreProtocolDraftIfAny(selectedSite);
  updateProtocolSourceStateUi();
}

function protocolPayload(){
  const original=protocolEditState?.item || {};
  const signature=protocolClientSignatureDataUrl() || original.clientSignatureDataUrl || "";
  const nowIso=new Date().toISOString();
  const originalCreatedAt=original.createdAt && typeof original.createdAt.toDate==="function" ? original.createdAt.toDate().toISOString() : (safe(original.createdAt) || nowIso);
  const identity=siteRecordIdentity(selectedSite);
  const originalTechnicianEmail=protocolTechnicianEmail(original,{allowCurrentFallback:false});
  const technicianEmail=originalTechnicianEmail || currentUser?.email || lastKnownUserEmail() || "";
  const originalTechnicianName=protocolTechnicianDisplayName(original,{allowCurrentFallback:false});
  return {
    _id:protocolEditId() || "",
    ...identity,
    technicianEmail,
    techEmail:original.techEmail || technicianEmail,
    createdBy:original.createdBy || originalTechnicianEmail || "",
    date:val("protoDate"),
    selectedDevice:val("protoDeviceType"),
    deviceType:val("protoDeviceType"),
    serial:val("protoSerial"),
    seal:val("protoSeal"),
    place:val("protoPlace"),
    operator:val("protoOperator"),
    customer:val("protoCustomer"),
    pbzLocation:val("protoPbzLocation"),
    batteryCount:val("protoBatteryCount"),
    capacityAh:val("protoCapacity"),
    setCount:val("protoSetCount"),
    auxBatteryAh:val("protoAuxBatteryAh"),
    temperature:val("protoTemp"),
    seal2:val("protoSeal2"),
    inputVac:val("protoInputVac"),
    output1Vac:val("protoOutput1Vac"),
    output2Vac:val("protoOutput2Vac"),
    backup1Vac:val("protoBackup1Vac"),
    backup2Vac:val("protoBackup2Vac"),
    mainBatVdc:val("protoMainBatVdc"),
    resetDiagnostics:val("protoResetDiag"),
    auxBatVdc:val("protoAuxBatVdc"),
    unbalance1:val("protoUnbalance1"),
    unbalance2:val("protoUnbalance2"),
    breakersLocation:val("protoBreakersLocation"),
    backedDevices:{
      lift:checkbox("protoLift"),
      vent:checkbox("protoVent"),
      machineLight:checkbox("protoMachineLight"),
      chuc:checkbox("protoChuc"),
      damper:checkbox("protoDamper"),
      skylight:checkbox("protoSkylight"),
      gate:checkbox("protoGate"),
      ats:checkbox("protoAts"),
      rpo:checkbox("protoRpo"),
      no:checkbox("protoNo"),
      sprinkler:checkbox("protoSprinkler"),
      csTs:checkbox("protoCsTs"),
      other:val("protoOtherDevice")
    },
    controlLocation:val("protoControlLocation"),
    testProcedure:val("protoTestProcedure"),
    access:{
      blue:checkbox("protoBlue"),
      b:checkbox("protoB"),
      c:checkbox("protoC"),
      garage:checkbox("protoGarage"),
      carLift:checkbox("protoCarLift"),
      barrier:checkbox("protoBarrier"),
      parkingHouse:checkbox("protoParkingHouse"),
      permit:checkbox("protoPermit"),
      training:checkbox("protoTraining"),
      shoes:checkbox("protoShoes"),
      vest:checkbox("protoVest"),
      helmet:checkbox("protoHelmet"),
      other:val("protoOtherAccess")
    },
    contacts:val("protoContacts"),
    availability:{
      wcOk:checkbox("protoWcOk"),
      wcNok:checkbox("protoWcNok"),
      lightOk:checkbox("protoLightOk"),
      lightNok:checkbox("protoLightNok"),
      ladder:checkbox("protoLadder"),
      stairs:checkbox("protoStairs"),
      lowCeiling:checkbox("protoLowCeiling"),
      extremeTemp:checkbox("protoExtremeTemp"),
      other:val("protoOtherAvailability")
    },
    period:val("protoPeriod"),
    conditions:val("protoConditions"),
    conditionsReason:val("protoConditionsReason"),
    notes:val("protoNotes"),
    customerNote:val("protoCustomerNote"),
    checklist:val("protoChecklist"),
    checkList:val("protoChecklist"),
    chceckList:val("protoChecklist"),
    sourceState:val("protoSourceState"),
    sourceStateLabel:protocolSourceStateLabel({sourceState:val("protoSourceState")}),
    sourceTestMethod:val("protoSourceTestMethod"),
    sourceTestMethodLabel:protocolSourceTestMethodLabel(val("protoSourceTestMethod")),
    handoffForProcessing:protocolHandoffForProcessing(original),
    submittedForProcessing:protocolHandoffForProcessing(original),
    clientSign:val("protoClientSign"),
    clientSignatureDataUrl:signature,
    techSign:normalizeTechnicianDisplayName(val("protoTechSign") || originalTechnicianName || currentUser?.displayName || currentUser?.email || lastKnownUserEmail() || ""),
    technicianName:normalizeTechnicianDisplayName(val("protoTechSign") || originalTechnicianName || ""),
    savedAt:nowIso,
    createdAt:originalCreatedAt,
    updatedAt:protocolEditId() ? nowIso : ""
  };
}

const exportProtocolFormBtn=document.getElementById("exportProtocolFormBtn");
if(exportProtocolFormBtn){
  exportProtocolFormBtn.addEventListener("click",()=>{
    if(!selectedSite){
      setProtocolStatusText("Není vybrané místo.");
      return;
    }
    const payload=protocolPayload();
    payload.createdBy=payload.createdBy || payload.technicianEmail || currentUser?.email || "";
    exportProtocolToWord(payload);
  });
}

const mailProtocolFormBtn=document.getElementById("mailProtocolFormBtn");
if(mailProtocolFormBtn){
  mailProtocolFormBtn.addEventListener("click",async()=>{
    if(!selectedSite){
      setProtocolStatusText("Není vybrané místo.");
      return;
    }
    const payload=protocolPayload();
    payload.createdBy=payload.createdBy || payload.technicianEmail || currentUser?.email || "";
    const recipient=promptProtocolMailRecipient(payload);
    if(!recipient) return;
    mailProtocolFormBtn.disabled=true;
    try{
      await sendProtocolByMail(payload,recipient);
    }catch(e){
      const message=protocolMailErrorText(e);
      setProtocolStatusText(`Chyba odeslání e-mailu: ${message}`);
      showSaveConfirmation(`E-mail: ${protocolMailToastText(e)}`);
    }finally{
      mailProtocolFormBtn.disabled=false;
    }
  });
}

let protocolSaveInFlight=false;
let lastProtocolSaveFingerprint="";
let lastProtocolSaveAt=0;
function protocolSaveFingerprint(payload={},site=selectedSite,editingId=""){
  const stable={...(payload || {})};
  delete stable._id;
  delete stable.savedAt;
  delete stable.createdAt;
  delete stable.updatedAt;
  delete stable.updatedBy;
  delete stable.clearManualStatusAfterSave;
  return JSON.stringify({
    editId:safe(editingId),
    site:detailLazyKey(site) || detailKey(site) || site?.id || "",
    protocol:stable
  });
}
function rememberProtocolSavedFingerprint(fingerprint){
  lastProtocolSaveFingerprint=fingerprint || "";
  lastProtocolSaveAt=Date.now();
}

const officialProtocolDataBtn=document.getElementById("officialProtocolDataBtn");
if(officialProtocolDataBtn){
  officialProtocolDataBtn.addEventListener("click",()=>{
    const box=officialProtocolDataBoxNode();
    if(box) setDisplayIfChanged(box,box.style.display==="none" ? "grid" : "none");
  });
}
const officialManufacturerSelect=officialManufacturerSelectNode();
if(officialManufacturerSelect){
  officialManufacturerSelect.addEventListener("change",syncOfficialManufacturerHidden);
}
const saveOfficialProtocolDataBtn=document.getElementById("saveOfficialProtocolDataBtn");
if(saveOfficialProtocolDataBtn){
  saveOfficialProtocolDataBtn.addEventListener("click",async ()=>{
    const data=await saveOfficialProtocolData();
    const box=officialProtocolDataBoxNode();
    if(data) setDisplayIfChanged(box,"none");
  });
}
const officialProtocolOkBtn=document.getElementById("officialProtocolOkBtn");
if(officialProtocolOkBtn){
  officialProtocolOkBtn.addEventListener("click",()=>exportOfficialProtocol("ok"));
}
const officialProtocolStopBtn=document.getElementById("officialProtocolStopBtn");
if(officialProtocolStopBtn){
  officialProtocolStopBtn.addEventListener("click",()=>exportOfficialProtocol("stop"));
}

const protocolFormEl=formFieldNode("protocolForm");
if(protocolFormEl){
protocolFormEl.addEventListener("submit",async e=>{
  e.preventDefault();
  if(!selectedSite){setProtocolStatusText("Není vybrané místo.");return;}

  if(!val("protoResetDiag")){
    setProtocolStatusText("Je nutné vyplnit pole Reset diagnostiky.");
    formFieldNode("protoResetDiag")?.focus();
    return;
  }
  if(!val("protoSourceState")){
    setProtocolStatusText("Je nutné vybrat stav zdroje po kontrole.");
    formFieldNode("protoSourceState")?.focus();
    return;
  }

  const payload=protocolPayload();
  const editingId=protocolEditId();
  const editing=!!editingId;
  payload.createdBy=protocolEditState?.item?.createdBy || payload.createdBy || payload.technicianEmail || currentUser?.email || lastKnownUserEmail() || "";
  payload.updatedBy=currentUser?.email || lastKnownUserEmail() || "";
  payload.clearManualStatusAfterSave=false;
  const saveFingerprint=protocolSaveFingerprint(payload,selectedSite,editingId);
  const now=Date.now();
  if(protocolSaveInFlight){
    setProtocolStatusText("Protokol se už ukládá, počkej prosím na potvrzení.");
    return;
  }
  if(!editing && lastProtocolSaveFingerprint===saveFingerprint && now-lastProtocolSaveAt<45000){
    setProtocolStatusText("Tento protokol už je uložený. Duplicitní kliknutí jsem ignoroval.");
    showSaveConfirmation("Protokol už je uložený.");
    return;
  }
  protocolSaveInFlight=true;
  const saveProtocolBtn=formFieldNode("saveProtocolBtn");
  if(saveProtocolBtn) saveProtocolBtn.disabled=true;
  const onlineSaveAvailable=!!(firebaseReady && db && fb.fsMod && currentUser && navigator.onLine !== false);
  const saveOffline=reason=>{
    const offlinePayload=saveProtocolLocally(payload,selectedSite,reason);
    clearProtocolDraft(selectedSite);
    applyProtocolFieldsToSite(offlinePayload,selectedSite);
    refreshSelectedDetailDataView();
    render();
    setProtocolStatusText("Protokol uložen lokálně v tomto prohlížeči. Internet/Firebase teď není dostupný.");
    showSaveConfirmation("Protokol uložen lokálně.");
    if(navigator.onLine!==false && typeof syncOfflineChanges==="function"){
      setTimeout(()=>syncOfflineChanges({reason:"protocol-offline-save",silent:true}),2000);
    }
    if(typeof loadHistory === "function") loadHistory(selectedSite.id);
    closeProtocolFormAfterSave();
    return offlinePayload;
  };

  if(!onlineSaveAvailable){
    try{
      const offlinePayload=saveOffline(!navigator.onLine ? "Bez připojení k internetu." : "Firebase nebo přihlášení není dostupné.");
      if(offlinePayload) rememberProtocolSavedFingerprint(saveFingerprint);
    }finally{
      protocolSaveInFlight=false;
      if(saveProtocolBtn) saveProtocolBtn.disabled=false;
    }
    return;
  }

  try{
    const {collection,doc,setDoc,serverTimestamp}=fb.fsMod;
    const ref=editing ? doc(db,"protocols",editingId) : doc(collection(db,"protocols"));
    payload._id=ref.id;
    payload.createdBy=payload.createdBy || payload.technicianEmail || currentUser.email || "";
    const childOk=await saveSiteChildItem("protocols",ref.id,payload,selectedSite);
    const embeddedOk=childOk ? true : await appendEmbeddedSiteItem("protocolHistory",payload,selectedSite);
    appendSiteLocalArray("protocolHistory",payload,selectedSite,120);
    await appendEmbeddedSiteItem("protocolRefs",{
      _id:ref.id,
      siteId:payload.siteId,
      siteLegacyId:payload.siteLegacyId,
      siteDocId:payload.siteDocId,
      siteKey:payload.siteKey,
      firebaseDocId:payload.firebaseDocId,
      siteKeys:payload.siteKeys,
      sourceGroupKey:payload.sourceGroupKey,
      sourceIdentity:payload.sourceIdentity,
      date:payload.date,
      createdAt:payload.createdAt
    },selectedSite);
    try{
      const standalonePayload={
        ...payload,
        updatedAt:serverTimestamp ? serverTimestamp() : (payload.updatedAt || new Date().toISOString())
      };
      if(!editing) standalonePayload.createdAt=serverTimestamp ? serverTimestamp() : payload.createdAt;
      await setDoc(ref,standalonePayload,{merge:true});
    }catch(e){
      console.warn("Samostatný protokol se neuložil, používám kopii pod bodem",e);
      if(!embeddedOk) throw e;
    }
    await updateSiteControlDateFromProtocol(payload,selectedSite,{clearManualStatus:false});
    clearProtocolDraft(selectedSite);
    refreshSelectedDetailDataView();
    setProtocolStatusText(editing ? "Protokol upraven." : "Protokol uložen.");
    showSaveConfirmation(editing ? "Protokol upraven." : "Protokol uložen.");
    render();
    if(typeof loadHistory === "function") loadHistory(selectedSite.id);
    closeProtocolFormAfterSave();
    rememberProtocolSavedFingerprint(saveFingerprint);
  }catch(err){
    const offlinePayload=saveOffline(err.message);
    if(offlinePayload) rememberProtocolSavedFingerprint(saveFingerprint);
  }finally{
    protocolSaveInFlight=false;
    if(saveProtocolBtn) saveProtocolBtn.disabled=false;
  }
});
}



[
  "protoPlace","protoDeviceType","protoSerial","protoPbzLocation","protoPeriod"
].forEach(id=>{
  const el=formFieldNode(id);
  if(el){
    const sync=()=>{
      updateProtocolSummary();
      if(id==="protoDeviceType") applyProtocolDeviceTypeToSelectedSiteDraft(el.value,{saveDraft:true});
    };
    el.addEventListener("input",sync);
    el.addEventListener("change",sync);
  }
});
const protoSourceStateEl=formFieldNode("protoSourceState");
if(protoSourceStateEl){
  protoSourceStateEl.addEventListener("change",updateProtocolSourceStateUi);
  protoSourceStateEl.addEventListener("input",updateProtocolSourceStateUi);
  updateProtocolSourceStateUi();
}

const selectGalleryPhotosBtn=sitePhotosNode("selectGalleryPhotosBtn");
if(selectGalleryPhotosBtn && selectGalleryPhotosBtn.tagName==="BUTTON") selectGalleryPhotosBtn.addEventListener("click",()=>sitePhotosNode("sitePhotosInput")?.click());
const selectCameraPhotosBtn=sitePhotosNode("selectCameraPhotosBtn");
if(selectCameraPhotosBtn && selectCameraPhotosBtn.tagName==="BUTTON") selectCameraPhotosBtn.addEventListener("click",()=>sitePhotosNode("siteCameraInput")?.click());
document.addEventListener("change",e=>{
  const target=e.target;
  if(!target || (target.id!=="sitePhotosInput" && target.id!=="siteCameraInput")) return;
  renderSitePhotoPreview();
  const count=selectedSitePhotoFiles().length;
  if(count) setSitePhotosStatusText(`Vybráno fotografií: ${count}.`);
});
document.addEventListener("change",e=>{
  const target=e.target;
  if(!target || target.id!=="siteAttachmentsInput") return;
  renderSiteAttachmentPreview();
  const count=selectedSiteAttachmentFiles().length;
  if(count) setSiteAttachmentsStatusText(`Vybráno příloh: ${count}.`);
});
document.addEventListener("click",e=>{
  const picker=e.target && e.target.closest ? e.target.closest("[data-photo-picker]") : null;
  if(!picker || picker.tagName!=="BUTTON") return;
  e.preventDefault();
  const inputId=picker.getAttribute("data-photo-picker")==="camera" ? "siteCameraInput" : "sitePhotosInput";
  sitePhotosNode(inputId)?.click();
});
document.addEventListener("click",e=>{
  const btn=e.target && e.target.closest ? e.target.closest("#uploadSitePhotosBtn") : null;
  if(!btn) return;
  e.preventDefault();
  uploadSitePhotos();
});
document.addEventListener("click",e=>{
  const btn=e.target && e.target.closest ? e.target.closest("#uploadSiteAttachmentsBtn") : null;
  if(!btn) return;
  e.preventDefault();
  uploadSiteAttachments();
});
document.addEventListener("keydown",e=>{
  const picker=e.target && e.target.closest ? e.target.closest("[data-photo-picker]") : null;
  if(!picker || (e.key!=="Enter" && e.key!==" ")) return;
  e.preventDefault();
  picker.click();
});
document.addEventListener("keydown",e=>{
  const picker=e.target && e.target.closest ? e.target.closest("#selectSiteAttachmentsBtn") : null;
  if(!picker || (e.key!=="Enter" && e.key!==" ")) return;
  e.preventDefault();
  siteAttachmentsNode("siteAttachmentsInput")?.click();
});

let fixMapViewTimer=0;
function scheduleFixMapView(delay=180){
  clearTimeout(fixMapViewTimer);
  fixMapViewTimer=setTimeout(()=>{ if(typeof fixMapView==="function") fixMapView(); },delay);
}
window.addEventListener("resize",()=>scheduleFixMapView());
window.addEventListener("orientationchange",()=>scheduleFixMapView(240));
window.addEventListener("DOMContentLoaded",()=>{
  runAfterTwoPaints(()=>{ if(typeof fixMapView==="function") fixMapView(); });
});
async function refreshFirebaseUnifiedPrimary(){
  await loadEdits();
  await loadDeletedSites();
  if(typeof window.loadFirebaseSitesUnified==="function"){
    const ready=readSzzOfflineReadyState();
    if(
      navigator.onLine!==false &&
      Array.isArray(rows) &&
      rows.length &&
      ready.rowsSyncedAtMs &&
      !firebaseRowsWereLoadedFromNetwork()
    ){
      runWhenIdle(()=>syncFirebaseRowsDeltaAfterAuth("startup").catch(e=>{
        console.warn("Startovní rozdílová kontrola bodů selhala",e);
      }),1800);
      return true;
    }
    if(firebaseRowsWereLoadedFromNetwork()) return true;
    const loadOptions=navigator.onLine===false
      ? {offlineCacheOnly:true,skipFirestoreCache:true,allowOnlineCache:true}
      : {auto:true,allowOnlineCache:true,skipFirestoreCache:true};
    await window.loadFirebaseSitesUnified(null,loadOptions);
    return true;
  }
  return false;
}
let firebaseUnifiedPrimaryLoadPromise=null;
let firebaseUnifiedPrimaryLoadRetryTimer=0;
async function runFirebaseUnifiedPrimaryLoad(){
  if(firebaseUnifiedPrimaryLoadPromise) return firebaseUnifiedPrimaryLoadPromise;
  firebaseUnifiedPrimaryLoadPromise=(async()=>{
    const loaded=await refreshFirebaseUnifiedPrimary();
    if(!loaded) scheduleFirebaseUnifiedPrimaryLoad(1200);
    if(firebaseUnifiedPrimary && typeof scheduleFirebaseRowsAutoReload==="function") scheduleFirebaseRowsAutoReload(12000);
  })().finally(()=>{ firebaseUnifiedPrimaryLoadPromise=null; });
  return firebaseUnifiedPrimaryLoadPromise;
}
function scheduleFirebaseUnifiedPrimaryLoad(delay=0){
  const run=()=>runFirebaseUnifiedPrimaryLoad().catch(e=>console.warn("Primární načtení Firebase selhalo",e));
  if(delay>0){
    clearTimeout(firebaseUnifiedPrimaryLoadRetryTimer);
    firebaseUnifiedPrimaryLoadRetryTimer=setTimeout(()=>{
      firebaseUnifiedPrimaryLoadRetryTimer=0;
      runWhenIdle(run,900);
    },delay);
    return;
  }
  if(firebaseUnifiedPrimaryLoadRetryTimer){
    clearTimeout(firebaseUnifiedPrimaryLoadRetryTimer);
    firebaseUnifiedPrimaryLoadRetryTimer=0;
  }
  runWhenIdle(run,900);
}
let csvLoadPromise=null;
window.loadCsvRowsForMigration=function(){
  if(!PUBLIC_CSV_DATA_ENABLED || !CSV_FILE){
    const message="Veřejný CSV export není v produkční verzi dostupný. Servisní data se načítají po přihlášení z Firebase.";
    const p=document.getElementById("progress");
    if(p) p.textContent=message;
    return Promise.resolve([]);
  }
  if(originalCsvRows.length) return Promise.resolve(originalCsvRows);
  if(csvLoadPromise) return csvLoadPromise;
  csvLoadPromise=new Promise((resolve,reject)=>{
    Papa.parse(CSV_FILE,{download:true,header:true,skipEmptyLines:true,delimiter:"",transformHeader:h=>String(h).replace(/^\uFEFF/,"").trim(),complete:async res=>{
      const data=res.data.filter(r=>Object.values(r).some(v=>safe(v)!==""));
      csvRows=normalize(data);
      originalCsvRows=csvRows.slice();
      populateNewRegionOptions();
      fixMapView();
      if(firebaseUnifiedPrimary){
        const p=document.getElementById("progress");
        if(p) p.textContent="";
        resolve(originalCsvRows);
        return;
      }
      rows=csvRows.map(applyEditToRow);
      filters(); render(); fit();
      document.getElementById("progress").textContent=`Načteno ${rows.length} řádků.`;
      await loadEdits();
      await loadDeletedSites();
      await loadExtraSites();
      resolve(originalCsvRows);
    },error:e=>{
      if(!firebaseUnifiedPrimary) document.getElementById("progress").textContent="Veřejný CSV zdroj není dostupný: "+e;
      reject(e);
    }});
  });
  return csvLoadPromise;
};
if(firebaseUnifiedPrimary){
  scheduleFirebaseUnifiedPrimaryLoad();
}else{
  window.loadCsvRowsForMigration().then(()=>{
    rows=[];
    window.rows=rows;
    filters();
    render();
  }).catch(()=>{});
}

window.addEventListener("DOMContentLoaded",()=>{
  if(typeof window.bindLoginButtons==="function"){
    window.bindLoginButtons();
  }
});
