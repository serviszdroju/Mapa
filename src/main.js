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
  AUTH_LOADING,
  AUTH_LOGGED_IN,
  AUTH_LOGGED_OUT,
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
  createOfflineAppShellControlHelpers,
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
  createOfflineCountsCacheHelpers
} from "./offline-counts-cache-utils.js";
import {
  createOfflineCountInvalidationHelpers
} from "./offline-count-invalidation-utils.js";
import {
  createOfflineCountsCollectorHelpers
} from "./offline-counts-collector-utils.js";
import {
  createOfflineStatusRenderHelpers
} from "./offline-status-render-utils.js";
import {
  createOfflineStatusUpdateHelpers
} from "./offline-status-update-utils.js";
import {
  SZZ_SYNC_STATE_KEY,
  createOfflineSyncStateHelpers
} from "./offline-sync-state-utils.js";
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
  createOfflineAppControlsHelpers
} from "./offline-app-controls-utils.js";
import {
  bindLegacyOfflineSyncListeners,
  bindOfflineConnectivityListeners
} from "./offline-connectivity-listeners-utils.js";
import {
  createLegacyOfflineSyncRunner
} from "./offline-sync-runner-utils.js";
import {
  createOfflineSyncTriggerHelpers
} from "./offline-sync-trigger-utils.js";
import {
  createSitePhotoRenderKeyHelpers
} from "./site-photo-render-key-utils.js";
import {
  createSitePhotoClickHelpers
} from "./site-photo-click-utils.js";
import {
  createSitePhotoDeleteHelpers
} from "./site-photo-delete-utils.js";
import {
  createSitePhotoViewerRenderHelpers
} from "./site-photo-viewer-render-utils.js";
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
  createPhotoUploadRuntimeHelpers
} from "./photo-upload-runtime-utils.js";
import {
  attachmentDisplayUrl,
  attachmentFileName,
  attachmentRenderSignature
} from "./attachment-utils.js";
import {
  createPhotoDateHelpers
} from "./photo-date-utils.js";
import {
  createBrowserFileHelpers
} from "./browser-file-utils.js";
import {
  createPdfByteWriterHelpers
} from "./pdf-byte-writer-utils.js";
import {
  createProtocolPdfRenderHelpers
} from "./protocol-pdf-render-utils.js";
import {
  createProtocolProcessingStateHelpers
} from "./protocol-processing-state-utils.js";
import {
  createProtocolSignatureImageHelpers
} from "./protocol-signature-image-utils.js";
import {
  createProtocolTechnicianIdentityHelpers
} from "./protocol-technician-identity-utils.js";
import {
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel
} from "./protocol-source-state-utils.js";
import {
  createProtocolSiteApplyHelpers
} from "./protocol-site-apply-utils.js";
import {
  createProtocolExportHelpers,
  historyObjectSummary,
  isProtocolHistoryItem
} from "./protocol-export-utils.js";
import {
  createProtocolFileExportHelpers
} from "./protocol-file-export-utils.js";
import {
  createProtocolCheckTextHelpers
} from "./protocol-check-text-utils.js";
import {
  createProtocolMailHelpers
} from "./protocol-mail-utils.js";
import {
  protocolMeasurementTableSpec
} from "./protocol-measurement-table-utils.js";
import {
  createProtocolWordBlobHelpers
} from "./protocol-word-blob-utils.js";
import {
  createProtocolWordDocumentHelpers
} from "./protocol-word-document-utils.js";
import {
  createProtocolWordSignatureHelpers
} from "./protocol-word-signature-utils.js";
import {
  createProtocolWordXmlHelpers
} from "./protocol-word-xml-utils.js";
import {
  createTechnicianSignatureHelpers
} from "./technician-signature-utils.js";
import {
  createHistoryLabelHelpers
} from "./history-label-utils.js";
import {
  createHistoryMatchHelpers
} from "./history-match-utils.js";
import {
  createDetailHistoryDeleteHelpers
} from "./detail-history-delete-utils.js";
import {
  createDetailDataRefreshHelpers
} from "./detail-data-refresh-utils.js";
import {
  createDetailHistoryActionsHelpers
} from "./detail-history-actions-utils.js";
import {
  createDetailHistoryViewHelpers
} from "./detail-history-view-utils.js";
import {
  createProtocolHandoffHelpers
} from "./protocol-handoff-utils.js";
import {
  createProtocolWorkflowHelpers
} from "./protocol-workflow-utils.js";
import {
  createOfficialProtocolFileNameHelpers
} from "./official-protocol-file-name-utils.js";
import {
  createOfficialProtocolDataHelpers
} from "./official-protocol-data-utils.js";
import {
  createOfficialProtocolTextHelpers
} from "./official-protocol-text-utils.js";
import {
  createOfficialRtfAssetHelpers
} from "./official-rtf-asset-utils.js";
import {
  createOfficialRtfExportHelpers
} from "./official-rtf-export-utils.js";
import {
  createOfficialRtfTemplateHelpers
} from "./official-rtf-template-utils.js";
import {
  createOfficialProtocolWordDocumentHelpers
} from "./official-protocol-word-document-utils.js";
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
import {
  createDetailDataRowHelpers
} from "./detail-data-row-utils.js";
import {
  createDetailHistoryCacheHelpers
} from "./detail-history-cache-utils.js";
import {
  createSiteAttachmentDataHelpers
} from "./site-attachment-data-utils.js";
import {
  createSiteAttachmentInputHelpers
} from "./site-attachment-input-utils.js";
import {
  createSiteAttachmentLoadHelpers
} from "./site-attachment-load-utils.js";
import {
  createSiteAttachmentRenderHelpers
} from "./site-attachment-render-utils.js";
import {
  createSiteAttachmentUploadHelpers
} from "./site-attachment-upload-utils.js";
import {
  createSitePhotoInputHelpers
} from "./site-photo-input-utils.js";
import {
  createProtocolDomHelpers
} from "./protocol-dom-utils.js";
import {
  createProtocolSignatureHelpers
} from "./protocol-signature-utils.js";
import {
  createProtocolSiteFieldHelpers
} from "./protocol-site-field-utils.js";
import {
  createRecordAccessFallbackHelpers
} from "./record-access-fallback-utils.js";

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
const allLocalProtocolHistoryReadCache=new Map();
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
const APP_BUILD_VERSION="2026-08-30-protocol-processing-state-module-v634";
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
const FIREBASE_MODULE_IMPORT_TIMEOUT_MS=9000;
function withTimeout(promise,timeoutMs,message){
  let timer=null;
  const timeout=new Promise((_,reject)=>{
    timer=setTimeout(()=>reject(new Error(message || "Operace trvala příliš dlouho.")),timeoutMs);
  });
  return Promise.race([promise,timeout]).finally(()=>{ if(timer) clearTimeout(timer); });
}
function showStartupLoading(message="Načítám aplikaci"){
  const hasCachedRows=!!((Array.isArray(rows) && rows.length) || (Array.isArray(window.rows) && window.rows.length));
  if(navigator.onLine===false && knownSignedIn() && !explicitSignOutPending() && hasCachedRows){
    window.__mapAppUnlocked=true;
    const startup=document.getElementById("startupScreen");
    const appEl=document.getElementById("mainApp");
    const loginRow=document.getElementById("mainLoginRow");
    const topLogout=document.getElementById("topLogoutBtn");
    setDisplayIfChanged(startup,"none");
    setDisplayIfChanged(appEl,"grid");
    setDisplayIfChanged(loginRow,"none");
    setDisplayIfChanged(topLogout,"block");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    setTextIfChanged(document.getElementById("progress"),"Offline režim. Body jsou načtené z lokální cache.");
    return;
  }
  try{ setStartupAuthChecking(true); }catch(e){}
  if(typeof window.__szzSetAuthState==="function"){
    window.__szzSetAuthState(AUTH_LOADING,{intro:"Načítám aplikaci",message});
    return;
  }
  const startup=document.getElementById("startupScreen");
  const appEl=document.getElementById("mainApp");
  const startupButton=document.getElementById("startupLoginBtn");
  const status=document.getElementById("startupStatus");
  setDisplayIfChanged(startup,"flex");
  setDisplayIfChanged(appEl,"none");
  setDisplayIfChanged(startupButton,"none");
  if(startupButton){
    startupButton.disabled=true;
    startupButton.setAttribute("aria-disabled","true");
  }
  setTextIfChanged(document.getElementById("startupIntro"),"Načítám aplikaci");
  if(message) setTextIfChanged(status,message);
}
function showAppShellFast(message=""){
  if(window.__szzFastShellShown) return;
  const hasUser=!!(window.currentUser || window.__authReadyUser);
  const canResumeKnownSession=!hasUser && !explicitSignOutPending() && knownSignedIn();
  if(canResumeKnownSession){
    window.__szzFastShellShown=true;
    window.__mapAppUnlocked=true;
    window.__szzAuthResumeStartedAt=Date.now();
    try{document.documentElement.classList.add("auth-resume");}catch(e){}
    if(typeof window.__szzSetAuthState==="function"){
      window.__szzSetAuthState(AUTH_LOGGED_IN,{message:""});
    }else{
      const startup=document.getElementById("startupScreen");
      const appEl=document.getElementById("mainApp");
      const topLogout=document.getElementById("topLogoutBtn");
      const progress=document.getElementById("progress");
      setDisplayIfChanged(startup,"none");
      setDisplayIfChanged(appEl,"grid");
      setDisplayIfChanged(topLogout,"block");
      setTextIfChanged(progress,"");
    }
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    if(!window.__szzKnownSessionBootCacheRequested){
      window.__szzKnownSessionBootCacheRequested=true;
      setTimeout(()=>loadOfflineRowsFromLocalCacheWhenAvailable("",4500),0);
    }
    return;
  }
  if(!hasUser && !explicitSignOutPending() && knownSignedIn()){
    if(typeof window.__szzSetAuthState==="function"){
      window.__szzSetAuthState(AUTH_LOADING,{
        intro:"Načítám aplikaci",
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
      if(startupButton){
        startupButton.disabled=true;
        startupButton.setAttribute("aria-disabled","true");
      }
      setTextIfChanged(document.getElementById("startupIntro"),"Načítám aplikaci");
      setTextIfChanged(status,message || "Obnovuji přihlášení...");
    }
    return;
  }
  if(!hasUser){
    showStartupLoading(message || "Načítám aplikaci");
    return;
  }
  window.__szzFastShellShown=true;
  window.__mapAppUnlocked=true;
  try{ if(window.setStartupAuthChecking) window.setStartupAuthChecking(false); }catch(e){}
  if(typeof window.__szzSetAuthState==="function"){
    window.__szzSetAuthState(AUTH_LOGGED_IN,{message});
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
      const count=(Array.isArray(loadedRows) && loadedRows.length)
        ? loadedRows.length
        : ((Array.isArray(rows) && rows.length) || (Array.isArray(window.rows) && window.rows.length) || 0);
      if(message || navigator.onLine===false){
        setTextIfChanged(progress,count
          ? `Offline režim. Načteno ${count} bodů z telefonu.`
          : (message || "Offline režim. Uložená data zatím nejsou v tomto zařízení připravená."));
      }else if(count){
        setTextIfChanged(progress,"");
      }
      if(count && navigator.onLine===false && knownSignedIn() && !explicitSignOutPending()){
        window.__szzAuthResumeStartedAt=window.__szzAuthResumeStartedAt || Date.now();
        if(typeof showApp==="function") showApp({allowWithoutUser:true});
        else if(typeof window.__szzSetAuthState==="function") window.__szzSetAuthState(AUTH_LOGGED_IN,{message:""});
        const startup=document.getElementById("startupScreen");
        const appEl=document.getElementById("mainApp");
        const loginRow=document.getElementById("mainLoginRow");
        const topLogout=document.getElementById("topLogoutBtn");
        setDisplayIfChanged(startup,"none");
        setDisplayIfChanged(appEl,"grid");
        setDisplayIfChanged(loginRow,"none");
        setDisplayIfChanged(topLogout,"block");
        if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
        window.__mapAppUnlocked=true;
        setTextIfChanged(progress,"Offline režim. Body jsou načtené z lokální cache.");
      }
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

const {
  fallbackRecordKeys,
  mergeSiteLocalArray,
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
  waitForFirebaseUser
}=createRecordAccessFallbackHelpers({
  getAuth:()=>auth,
  getAuthAccessWaitForFirebaseUser:()=>authAccessWaitForFirebaseUser,
  getCompatAuthClient,
  getMergeSiteLocalArrayImpl:()=>mergeSiteLocalArrayImpl,
  getRecordMatchTextKeysImpl:()=>recordMatchTextKeysImpl,
  getRowLookupKeysImpl:()=>rowLookupKeysImpl,
  getSelectedSite:()=>selectedSite,
  getSelectedSiteDocIdImpl:()=>selectedSiteDocIdImpl,
  getSiteRecordIdentityImpl:()=>siteRecordIdentityImpl,
  getSiteRecordKeysImpl:()=>siteRecordKeysImpl,
  getSiteRecordKeySetImpl:()=>siteRecordKeySetImpl,
  getSiteRecordNormTextKeysImpl:()=>siteRecordNormTextKeysImpl,
  getSiteRecordTextKeysImpl:()=>siteRecordTextKeysImpl,
  getSiteLocalArrayMetaReader:()=>readSiteLocalArrayMeta,
  getUpdateAdminAppControls:()=>updateAdminAppControls,
  searchNorm,
  setCurrentUser:user=>{
    currentUser=user;
    window.currentUser=user;
    window.__authReadyUser=user;
  },
  uniqueNonEmptyStrings
});

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
const {
  cacheAppShellForOffline,
  cachedAppShellCountIfCurrent,
  setOfflineMapButtonState,
  setOfflineMapStatus
}=createOfflineAppShellControlHelpers({
  appBuildVersion:APP_BUILD_VERSION,
  cachedPostAppShellUrlsToServiceWorker,
  currentAppShellUrls,
  isCzechOfflineMapReady:()=>czechOfflineMapReady(),
  readOfflineReadyState:()=>readSzzOfflineReadyState(),
  setClassNameIfChanged,
  setDisabledIfChanged,
  setDisplayIfChanged,
  setTextIfChanged,
  writeOfflineReadyState:update=>writeSzzOfflineReadyState(update)
});
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
    [appMod,authMod,fsMod] = await withTimeout(Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]),FIREBASE_MODULE_IMPORT_TIMEOUT_MS,"Firebase knihovny se nenačetly včas.");
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
  function isHardAuthRejection(e){
    const code=safe(e && e.code);
    const message=safe(e && e.message);
    return /auth\/user-disabled|auth\/invalid-user-token|auth\/user-token-expired|refresh token.*(invalid|revoked|expired)|token.*(revoked|disabled)|account.*disabled/i.test(`${code} ${message}`);
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
      const timeoutMs=options.silent ? 9000 : 90000;
      setTimeout(()=>{
        finish(reject,new Error("Android Google přihlášení nevrátilo výsledek včas. Zkus tlačítko znovu."));
      },timeoutMs);
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
  function isPopupClosedAuthError(e){
    const code=safe(e && e.code);
    const message=safe(e && e.message);
    return /popup-closed-by-user|popup_closed/i.test(`${code} ${message}`);
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
    return Number.isFinite(at) && at>0 && Date.now()-at<GOOGLE_LOGIN_INTERACTION_MAX_AGE_MS;
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
        window.__szzSetAuthState(AUTH_LOGGED_OUT,{message,intro:"Přihlaste se Google účtem @astip.cz."});
      }else{
        showLogin();
        setStartupStatus(message);
      }
      return;
    }
    if(authLoginInProgress){
      setStartupAuthChecking(true);
      setStartupStatus("Google přihlášení už běží. Dokonči otevřené přihlašovací okno.");
      if(typeof window.__szzSetAuthState==="function"){
        window.__szzSetAuthState("logging-in",{
          intro:"Dokonči Google přihlášení v otevřeném okně.",
          message:"Google přihlášení už běží."
        });
      }
      return true;
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
      if(isPopupClosedAuthError(e)){
        console.warn("Firebase popup hlásí zavření předčasně, čekám na dokončení Google okna",e);
        setStartupAuthChecking(true);
        setStartupStatus("Dokonči Google přihlášení v otevřeném okně.");
        if(typeof window.__szzSetAuthState==="function"){
          window.__szzSetAuthState("logging-in",{
            intro:"Dokonči Google přihlášení v otevřeném okně.",
            message:"Čekám na dokončení Google přihlášení."
          });
        }
        const restored=await waitForAuthCandidate(90000);
        if(restored){
          await handleAuthorizedUser(restored);
          return;
        }
        clearAuthPending();
        if(!knownSignedIn()) try{document.documentElement.classList.remove("auth-resume");}catch(err){}
        setStartupAuthChecking(false);
        showLogin();
        setStartupStatus("Google přihlášení se nedokončilo. Zkus tlačítko znovu a vyber účet @astip.cz.");
        return;
      }
      clearAuthPending();
      if(isAndroidTransientAuthError(e) && appIsOpenOrHasRows() && !explicitSignOutPending()){
        console.warn("Android přihlášení se obnoví na pozadí, mapa zůstává otevřená",e);
        keepAppOpenDuringAuthRestore("");
        return;
      }
      if(isHardAuthRejection(e)) forgetKnownSignedIn();
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
    if(navigator.onLine===false){
      setStartupStatus("Jsi offline. Přihlášení přes Google půjde znovu po připojení k internetu.");
      return false;
    }
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
    window.__szzAuthResumeStartedAt=window.__szzAuthResumeStartedAt || Date.now();
    showApp({allowWithoutUser:true});
    const topLogoutBtn=document.getElementById("topLogoutBtn");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    setDisplayIfChanged(topLogoutBtn,"block");
    setProgressStatus(message === undefined ? "Přihlášení se obnovuje na pozadí. Mapa zůstává otevřená z uložených dat." : message);
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
  window.syncFirebaseRowsDeltaAfterAuth=syncFirebaseRowsDeltaAfterAuth;
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
    clearStartupAuthFallback();
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
    setProgressStatus("");
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
    if(lastAuthMessage && !/^(Kontroluji přihlášení|Načítám aplikaci)\.?$/i.test(lastAuthMessage)){
      setStartupStatus(lastAuthMessage);
    }else{
      setStartupStatus("");
    }
  }
  function showSignedOutLogin(message){
    if(navigator.onLine===false && knownSignedIn() && !explicitSignOutPending() && appIsOpenOrHasRows()){
      keepAppOpenDuringAuthRestore("Offline režim. Používám lokálně uložené body, protokoly a fotky.");
      return;
    }
    clearStartupAuthFallback();
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
      setStartupStatus("Načítám aplikaci");
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
        showSignedOutLogin("Přihlášení se neobnovilo. Přihlas se znovu Google účtem @astip.cz.");
      });
      return;
    }
    const knownSession=knownSignedIn() && !explicitSignOutPending();
    if(knownSession && navigator.onLine===false){
      keepAppOpenDuringAuthRestore("");
      loadOfflineRowsFromLocalCacheWhenAvailable("",4500);
      return;
    }
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
      const keepVisibleCacheQuiet=appIsOpenOrHasRows();
      setStartupAuthChecking(!keepVisibleCacheQuiet);
      setProgressStatus(keepVisibleCacheQuiet ? "" : "Obnovuji přihlášení...");
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
    showSignedOutLogin();
  }

  let startupAuthFallbackTimer=null;
  function clearStartupAuthFallback(){
    if(startupAuthFallbackTimer){
      clearTimeout(startupAuthFallbackTimer);
      startupAuthFallbackTimer=null;
    }
  }
  function scheduleStartupAuthFallback(){
    clearStartupAuthFallback();
    startupAuthFallbackTimer=setTimeout(()=>{
      startupAuthFallbackTimer=null;
      if(authLoginInProgress || currentAuthCandidate() || explicitSignOutPending()) return;
      const startup=document.getElementById("startupScreen");
      const appEl=document.getElementById("mainApp");
      const intro=document.getElementById("startupIntro");
      const appVisible=!!(appEl && appEl.style.display && appEl.style.display!=="none");
      const startupStillChecking=!!(startup && (startup.classList.contains("auth-checking") || /Načítám|Kontroluji|Obnovuji/i.test(String(intro && intro.textContent || ""))));
      if(!startupStillChecking || appVisible) return;
      if(navigator.onLine===false && knownSignedIn() && appIsOpenOrHasRows()){
        keepAppOpenDuringAuthRestore("Offline režim. Používám lokálně uložené body, protokoly a fotky.");
        return;
      }
      clearAuthPending();
      setStartupAuthChecking(false);
      if(typeof window.__szzReleaseStuckStartupChecking==="function"){
        window.__szzReleaseStuckStartupChecking();
      }else{
        showSignedOutLogin("Přihlášení se zatím neověřilo. Klikni na Přihlásit přes Google.");
      }
    },AUTH_RESTORE_GRACE_MS+3000);
  }

  window.__startFirebaseRedirectLogin=startGoogleLoginFromUi;
  window.__signOutFirebase=signOutFirebase;
  window.startFirebaseGoogleLogin=startGoogleLoginFromUi;
  if(typeof window.startGoogleLogin!=="function") window.startGoogleLogin=startGoogleLoginFromUi;
  if(typeof window.loginPopup!=="function") window.loginPopup=startGoogleLoginFromUi;
  window.__startCompatGoogleLoginFallback=startGoogleLoginFromUi;
  if(typeof window.bindLoginButtons==="function") window.bindLoginButtons();
  scheduleStartupAuthFallback();
  try{
    if(knownSignedIn() && !explicitSignOutPending()) showAppShellFast("");
    else showStartupLoading("Načítám aplikaci");
    await primeCompatAuthPersistence();
    if(authPending()){
      await finishRedirectLoginIfPending();
    }else{
      const restored=currentAuthCandidate() || await tryRestoreAuthCandidate(1200) || await googleRedirectResultUser() || await tryRestoreAuthCandidate(2500);
      if(restored) await handleAuthorizedUser(restored);
      else if(androidHasStoredAuth()){
        const androidUser=await tryAndroidSilentAuth("startup");
        if(!androidUser && !currentAuthCandidate()) handleSignedOut();
      }
    }
  }catch(e){
    clearAuthPending();
    if(isHardAuthRejection(e)){
      forgetKnownSignedIn();
      showSignedOutLogin("Přihlášení bylo serverem odmítnuté. Přihlas se znovu Google účtem @astip.cz.");
    }else if(shouldKeepAppOpenOnAuthNull()){
      keepAppOpenDuringAuthRestore("Přihlášení se obnovuje na pozadí. Mapa zůstává otevřená z uložených dat.");
    }else{
      showSignedOutLogin("Chyba kontroly přihlášení: " + authErrorText(e));
    }
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
  runtimeCacheName:"astip-szz-v570-runtime",
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
  hasMatchingHistoryItemForSite:(items,site)=>hasMatchingHistoryItemForSite(items,site),
  isFirebaseReady:()=>firebaseReady,
  isOnline:()=>navigator.onLine!==false,
  matchingHistoryItemsForSite:(items,site)=>matchingHistoryItemsForSite(items,site),
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
  refreshSiteDataFromFirebase:(site)=>refreshSiteDataFromFirebase(site),
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
  bindNewSiteOfferLookupControls,
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
  refreshSiteDataFromFirebase:(site)=>refreshSiteDataFromFirebase(site),
  applyLatestProtocolDateToRaw:(raw,options)=>applyLatestProtocolDateToRaw(raw,options),
  applyLatestProtocolToSite:(protocol,site)=>applyLatestProtocolToSite(protocol,site),
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
  {label:"Datum předání zdroje", key:"Datum předání zdroje", keys:["Datum předání zdroje","Datum_predani_zdroje","Datum předání","Předání zdroje"], type:"date"},
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
  {label:"Číslo nabídky", key:"Číslo nabídky", keys:["Číslo nabídky","Cislo nabidky","Nabídka","Nabidka","Offer number","Offer"], hideWhenEmpty:true},
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

const SOURCE_HANDOVER_DATE_KEYS=["Datum předání zdroje","Datum_predani_zdroje","Datum předání","Předání zdroje"];
const OFFER_NUMBER_KEYS=["Číslo nabídky","Cislo nabidky","Nabídka","Nabidka","Offer number","Offer"];
const SOURCE_OFFER_LOOKUP_COLLECTION="sourceOfferLookup";
const offerLookupCache=new Map();
const offerAutofillInProgress=new Set();

function normalizeSerialForOfferLookup(value){
  const clean=safe(value)
    .replace(/\u00a0/g," ")
    .replace(/[,.]0+$/,"")
    .toUpperCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .replace(/\s+/g,"")
    .replace(/[^A-Z0-9_-]/g,"");
  return clean;
}

function serialLookupKeysForValue(value){
  const source=safe(value);
  if(!source) return [];
  const keys=new Set();
  const add=part=>{
    const key=normalizeSerialForOfferLookup(part);
    if(key) keys.add(key);
  };
  add(source);
  source.split(/[;\n\r,|/]+/).forEach(add);
  const tokenMatches=source.match(/[A-Za-z0-9][A-Za-z0-9 ._-]{2,}/g) || [];
  tokenMatches.forEach(add);
  return [...keys].slice(0,12);
}

function siteHandoverDateValue(site,raw=rawForSiteFieldLookup(site)){
  return firstSiteField(raw,SOURCE_HANDOVER_DATE_KEYS);
}

function siteOfferNumberValue(site,raw=rawForSiteFieldLookup(site)){
  return firstSiteField(raw,OFFER_NUMBER_KEYS);
}

function warrantyYearsFromValue(value){
  const norm=dataNormFixed(value);
  if(!norm || norm.includes("zrus")) return 0;
  if(norm.includes("5")) return 5;
  if(norm.includes("2")) return 2;
  return 0;
}

function siteWarrantyStatus(site,raw=rawForSiteFieldLookup(site)){
  const warranty=firstSiteField(raw,["Záruka","Zaruka","Warranty"]);
  const years=warrantyYearsFromValue(warranty);
  if(!years) return {state:"",expiresAt:null};
  const handover=parseDateValue(siteHandoverDateValue(site,raw));
  if(!handover) return {state:"",expiresAt:null};
  const expiresAt=addMonths(handover,years*12);
  const today=new Date();
  today.setHours(0,0,0,0);
  const expiryLimit=new Date(expiresAt.getTime());
  expiryLimit.setHours(23,59,59,999);
  return {
    state:today.getTime()<=expiryLimit.getTime() ? "valid" : "expired",
    expiresAt
  };
}

function detailWarrantyRowClassName(spec,value,site,raw=rawForSiteFieldLookup(site)){
  if(spec.key!=="Záruka" && spec.key!=="Datum předání zdroje") return "";
  const status=siteWarrantyStatus(site,raw);
  if(status.state==="valid") return "detail-warranty-valid";
  if(status.state==="expired") return "detail-warranty-expired";
  return "";
}

function canReadOfferLookupNow(){
  return !!(firebaseReady && currentUser && db && fb.fsMod && typeof fb.fsMod.doc==="function" && typeof fb.fsMod.getDoc==="function" && navigator.onLine!==false);
}

async function lookupOfferNumberForSerial(serial){
  if(!canReadOfferLookupNow()) return "";
  const keys=serialLookupKeysForValue(serial);
  const {doc,getDoc}=fb.fsMod;
  for(const key of keys){
    if(offerLookupCache.has(key)){
      const cached=offerLookupCache.get(key);
      if(cached) return cached;
      continue;
    }
    try{
      const snap=await getDoc(doc(db,SOURCE_OFFER_LOOKUP_COLLECTION,key));
      const data=snap && snap.exists && snap.exists() ? snap.data() || {} : {};
      const offer=safe(data.offerNumber || data["Číslo nabídky"] || data.cisloNabidky || data.nabidka || data.offer || "");
      offerLookupCache.set(key,offer);
      if(offer) return offer;
    }catch(e){
      console.warn("Číslo nabídky se nepodařilo načíst podle výrobního čísla",e);
      offerLookupCache.set(key,"");
    }
  }
  return "";
}

async function ensureRawOfferNumberFromSerial(raw={}){
  if(!raw || typeof raw!=="object") return "";
  const existing=siteOfferNumberValue({raw},raw);
  if(existing){
    raw["Číslo nabídky"]=existing;
    return existing;
  }
  const serial=sourceSerialTextFromRaw(raw) || firstSiteField(raw,["Zdroj","Výrobní číslo","Výrobní_číslo","Serial","SN"]);
  const offer=await lookupOfferNumberForSerial(serial);
  if(offer) raw["Číslo nabídky"]=offer;
  return offer;
}

async function autofillOfferInputForSerial(serial,offerInput,options={}){
  if(!offerInput) return "";
  const existing=safe(offerInput.value);
  if(existing && offerInput.dataset.autoOfferFilled!=="1" && !options.force) return existing;
  const offer=await lookupOfferNumberForSerial(serial);
  if(offer && (options.force || !safe(offerInput.value) || offerInput.dataset.autoOfferFilled==="1")){
    offerInput.value=offer;
    offerInput.dataset.autoOfferFilled="1";
    offerInput.dispatchEvent(new Event("change",{bubbles:true}));
  }
  return offer;
}

function bindOfferLookupControlsForElements(serialEls=[],offerEls=[]){
  const serialInputs=Array.from(serialEls || []).filter(Boolean);
  const offerInput=Array.from(offerEls || []).find(Boolean);
  if(!serialInputs.length || !offerInput) return;
  const run=()=>autofillOfferInputForSerial(serialInputs.map(el=>el.value).find(Boolean) || "",offerInput);
  serialInputs.forEach(el=>{
    if(el.__szzOfferLookupBound) return;
    el.__szzOfferLookupBound=true;
    let timer=null;
    const schedule=()=>{
      clearTimeout(timer);
      timer=setTimeout(run,250);
    };
    el.addEventListener("input",schedule);
    el.addEventListener("change",run);
  });
  run();
}

function bindNewSiteOfferLookupControls({newSiteFieldElementsByKey}= {}){
  bindOfferLookupControlsForElements(
    newSiteFieldElementsByKey ? newSiteFieldElementsByKey().get("Zdroj") : [],
    newSiteFieldElementsByKey ? newSiteFieldElementsByKey().get("Číslo nabídky") : []
  );
}

function bindDetailOfferLookupControls(){
  const table=detailTableNode();
  if(!table) return;
  bindOfferLookupControlsForElements(
    table.querySelectorAll('[data-key="Zdroj"]'),
    table.querySelectorAll('[data-key="Číslo nabídky"]')
  );
}

async function ensureOfferNumberForSelectedSite(site){
  if(!site || !isFirebaseUnifiedRow(site)) return "";
  const raw=rawForSiteFieldLookup(site);
  if(siteOfferNumberValue(site,raw)) return "";
  const serial=sourceSerialTextFromRaw(raw) || firstSiteField(raw,["Zdroj","Výrobní číslo","Výrobní_číslo","Serial","SN"]);
  const serialKey=normalizeSerialForOfferLookup(serial);
  const docId=selectedSiteDocId(site);
  const lockKey=`${docId || detailKey(site) || site.id || ""}:${serialKey}`;
  if(!serialKey || offerAutofillInProgress.has(lockKey)) return "";
  offerAutofillInProgress.add(lockKey);
  try{
    const offer=await lookupOfferNumberForSerial(serial);
    if(!offer || selectedSite!==site) return offer || "";
    const patch={"Číslo nabídky":offer};
    const nextRaw={...(site.raw || {}),...patch};
    site.raw=nextRaw;
    site.firebaseData={...(site.firebaseData || {}),raw:nextRaw};
    if(docId) await saveUnifiedSiteRawPatchOrQueue(site,patch,{docId,reason:"Automatické doplnění čísla nabídky"});
    const table=detailTableNode();
    if(table && table.dataset.detailTableMode==="display") renderDetailTable(table,site);
    return offer;
  }finally{
    offerAutofillInProgress.delete(lockKey);
  }
}

window.szzBindOfferLookupControls=function(root=document){
  const base=root && root.querySelectorAll ? root : document;
  bindOfferLookupControlsForElements(
    base.querySelectorAll('[data-new-key="Zdroj"], #detailTable [data-key="Zdroj"]'),
    base.querySelectorAll('[data-new-key="Číslo nabídky"], #detailTable [data-key="Číslo nabídky"]')
  );
};
window.szzEnsureRawOfferNumberFromSerial=ensureRawOfferNumberFromSerial;
window.szzLookupOfferNumberForSerial=lookupOfferNumberForSerial;

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
  if(spec.type==="date"){
    const input=document.createElement("input");
    input.type="date";
    input.dataset.key=spec.key;
    input.value=dateInputValueFromAny(value);
    return input;
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
    const warrantyClass=detailWarrantyRowClassName(spec,value,r,raw);
    if(warrantyClass) row.classList.add(warrantyClass);
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
  bindDetailOfferLookupControls();
}

function userSiteDisplayValue(spec, value, site=null){
  return esc(userSiteDisplayText(spec,value,site));
}

function userSiteDisplayText(spec, value, site=null){
  if(spec.type==="period") return value ? `${safe(value)} měsíců` : "";
  if(spec.type==="yesno") return yesNoFixed(value, "ne");
  if(spec.type==="date"){
    const d=parseDateValue(value);
    return d ? formatDateCz(d) : safe(value);
  }
  if(spec.type==="warranty"){
    const text=warrantyValueFixed(value);
    const status=site ? siteWarrantyStatus(site) : {state:"",expiresAt:null};
    if(text && status.expiresAt){
      const label=status.state==="valid" ? "platná do" : "propadlá od";
      return `${text} (${label} ${formatDateCz(status.expiresAt)})`;
    }
    return text;
  }
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


const {
  addNewDataRowToTable
}=createDetailDataRowHelpers({
  detailTableNode,
  isNoteUser
});

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
    if(spec.type==="date") value=dateInputValueFromAny(value) || value;
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
  await ensureRawOfferNumberFromSerial(editedRaw);

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
  detailRowClassName:detailWarrantyRowClassName,
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
  ensureOfferNumberForSelectedSite(r);
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
      bindDetailOfferLookupControls();
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
let mainProtocolHistoryRenderSignature="";
let mainProtocolHistoryCurrentItems=[];
let mainProtocolHistoryDateFilter="";

const {
  clearDetailHistoryCache,
  clearDetailHistoryCacheForKind,
  clearLastProtocolCache,
  clearMainProtocolHistoryCache,
  cloneDetailHistoryItem,
  cloneDetailHistoryItems,
  detailHistoryCacheKey,
  mainProtocolHistoryCacheKey,
  patchMainProtocolHistoryCacheItems,
  readDetailHistoryCache,
  readLastProtocolCache,
  readMainProtocolHistoryCache,
  writeDetailHistoryCache,
  writeLastProtocolCache,
  writeMainProtocolHistoryCache
}=createDetailHistoryCacheHelpers({
  clearAllLocalProtocolHistoryReadCache:()=>allLocalProtocolHistoryReadCache.clear(),
  clearLocalDetailReadCacheForKind:(kind,site)=>clearLocalDetailReadCacheForKind(kind,site),
  currentUserEmail,
  detailLazyKey:(site)=>detailLazyKey(site),
  getSelectedSite:()=>selectedSite,
  resetDetailHistoryRenderSignature:()=>{ detailHistoryRenderSignature=""; },
  resetMainProtocolHistoryRenderSignature:()=>{ mainProtocolHistoryRenderSignature=""; },
  selectedSiteDocId,
  siteRecordKeys
});
window.clearDetailHistoryCache=clearDetailHistoryCache;
window.clearMainProtocolHistoryCache=clearMainProtocolHistoryCache;

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
  attachmentSiblingRows,
  readAttachmentFileData
}=createSiteAttachmentDataHelpers({
  getSelectedSite:()=>selectedSite,
  siteSiblingRows
});

const {
  renderSiteAttachmentPreview,
  resetSiteAttachmentInput,
  selectedSiteAttachmentFiles,
  setSiteAttachmentsStatusText,
  siteAttachmentsNode,
  siteAttachmentsStatusNode
}=createSiteAttachmentInputHelpers({
  bytesLabel,
  formFieldNode,
  setTextIfChanged
});

const {
  renderSitePhotoPreview,
  resetSitePhotoInput,
  selectedSitePhotoFiles,
  setSitePhotosStatusText,
  sitePhotosListNode,
  sitePhotosNode,
  sitePhotosStatusNode
}=createSitePhotoInputHelpers({
  formFieldNode,
  setTextIfChanged
});

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
  loadSiteAttachments:(site)=>loadSiteAttachments(site),
  loadSitePhotos,
  resetDetailHistory:()=>{
    detailHistoryItems=[];
    detailHistoryIndex=0;
    detailHistoryRenderSignature="";
  },
  resetSiteAttachmentInput,
  resetSiteAttachments:()=>{
    siteAttachmentItems=[];
    resetSiteAttachmentRenderSignature();
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
  updateOfficialProtocolSourceInfo:()=>updateOfficialProtocolSourceInfo()
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
  renderSiteAttachments,
  resetSiteAttachmentRenderSignature
}=createSiteAttachmentRenderHelpers({
  attachmentDisplayUrl,
  attachmentFileName,
  attachmentRenderSignature,
  bytesLabel,
  photoInsertedLabel,
  siteAttachmentsNode
});

const {
  protocolExportDatePart,
  protocolExportValue,
  protocolWordFileNamePart
}=createProtocolExportHelpers({
  formatDateTimeCz
});

const {
  wordBlank,
  wordFormField,
  wordFormGrid,
  wordParagraph,
  wordParagraphXml,
  wordRun,
  wordTable,
  wordXmlEscape
}=createProtocolWordXmlHelpers({
  protocolExportValue
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

const {
  base64ToBytes,
  protocolSignatureImageBytes,
  protocolTechnicianSignatureImageBytes
}=createProtocolSignatureImageHelpers({ safe });

const {
  normalizeProtocolTechnicianFields,
  normalizeTechnicianDisplayName,
  protocolTechnicianDisplayName,
  protocolTechnicianEmail,
  technicianKnownKeyFromValue
}=createProtocolTechnicianIdentityHelpers({
  currentUserEmail,
  getCurrentUser:()=>currentUser,
  lastKnownUserEmail,
  safe,
  simpleNorm
});

const {
  wordClientSignatureCellXml,
  wordSignatureGrid
}=createProtocolWordSignatureHelpers({
  protocolSignatureImageBytes,
  protocolTechnicianDisplayName,
  protocolTechnicianSignatureImageBytes,
  safe,
  wordParagraph,
  wordParagraphXml,
  wordTable,
  wordXmlEscape
});

const {
  protocolAccessText,
  protocolAvailabilityText,
  protocolBackedDevicesText,
  protocolConditionsText,
  protocolPeriodText,
  wordCheck
}=createProtocolCheckTextHelpers({
  safe,
  simpleNorm
});

const {
  buildProtocolWordEntries,
  buildProtocolWordStylesXml
}=createProtocolWordDocumentHelpers({
  getCurrentUser:()=>currentUser,
  getSelectedSite:()=>selectedSite,
  protocolAccessText,
  protocolAvailabilityText,
  protocolBackedDevicesText,
  protocolConditionsText,
  protocolDisplayDate,
  protocolMeasurementTableSpec,
  protocolPeriodText,
  protocolSignatureImageBytes,
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel,
  protocolTechnicianSignatureImageBytes,
  wordBlank,
  wordFormField,
  wordFormGrid,
  wordParagraph,
  wordParagraphXml,
  wordRun,
  wordSignatureGrid,
  wordTable,
  wordXmlEscape
});

const {
  checkbox,
  protocolStatusNode,
  setProtocolStatusText,
  updateProtocolSummary,
  val
}=createProtocolDomHelpers({
  formFieldNode,
  safeValue:safe,
  setTextIfChanged
});

const {
  pickRawValue,
  populateProtocolDeviceSelect,
  protocolDeviceTypeFromSite,
  protocolSerialFromSite,
  protocolSourceLocationFromSite,
  resetProtocolTechnicalFieldsForNewDevice,
  setCheckbox,
  setIfEmpty,
  sourceOptionsFromSite,
  splitPossibleSources
}=createProtocolSiteFieldHelpers({
  dataNormFixed,
  formFieldNode,
  getRawValue:get,
  getSelectedSite:()=>selectedSite,
  safeValue:safe,
  updateProtocolSummary
});

const {
  applyLatestProtocolDateToRaw,
  applyLatestProtocolToSite,
  applyProtocolFieldsToRaw,
  applyProtocolFieldsToSite,
  latestProtocolDateFromSiteData,
  protocolDateIso,
  protocolTimeValue
}=createProtocolSiteApplyHelpers({
  addMonths,
  applyStopStatusRawPatch,
  dateInputValueFromAny,
  detailKey,
  detectControlPeriod,
  getSelectedSite:()=>selectedSite,
  historyObjectSummary,
  historyTimeValue,
  isoDateFromAny,
  normalize,
  parseDateValue,
  periodMonths,
  protocolDisplayDate,
  protocolSavedTimeValue,
  protocolSourceStateValue,
  safe,
  setSelectedSite:site=>{ selectedSite=site; }
});
window.applyLatestProtocolDateToRaw=applyLatestProtocolDateToRaw;

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

const {
  compactOfficialRtfMeasurementSection,
  officialManufacturerText,
  officialManufacturerTextByKey,
  officialMultiline,
  officialOneLine,
  officialOperatorLines,
  officialOperatorText,
  officialProtocolConditionsText,
  officialProtocolCustomerNote,
  officialProtocolDeviceLine,
  officialProtocolFunctionalText,
  officialProtocolMeasurementNotesXml,
  officialProtocolNextDate,
  officialProtocolResultText,
  officialProtocolTemplateValues,
  officialRtfEscape
}=createOfficialProtocolTextHelpers({
  NEXT_CHECK_KEYS,
  OFFICIAL_DEFAULT_MANUFACTURER_TEXT,
  OFFICIAL_MANUFACTURERS,
  addMonths,
  first,
  formatDateCz,
  getSelectedSite:()=>selectedSite,
  parseDateValue,
  periodMonths,
  protocolDeviceTypeFromSite:(site)=>protocolDeviceTypeFromSite(site),
  protocolDisplayDate,
  protocolExportValue,
  protocolSerialFromSite:(site)=>protocolSerialFromSite(site),
  protocolSourceLocationFromSite:(site)=>protocolSourceLocationFromSite(site),
  safe,
  simpleNorm,
  wordBlank,
  wordParagraph,
  wordTable
});

const {
  fillOfficialProtocolInputs,
  officialManufacturerKeyFromText,
  officialProtocolDataForSite,
  officialProtocolInputData,
  propagateOfficialProtocolDataToSiblingSources,
  protocolForOfficialDocument,
  resetOfficialProtocolSection,
  saveOfficialProtocolData,
  selectedHistoryProtocol,
  sharedOfficialProtocolData,
  syncOfficialManufacturerHidden,
  updateOfficialProtocolSourceInfo
}=createOfficialProtocolDataHelpers({
  detailKey,
  getCurrentUser:()=>currentUser,
  getDb:()=>db,
  getDetailHistoryIndex:()=>detailHistoryIndex,
  getDetailHistoryItems:()=>detailHistoryItems,
  getFirebaseReady:()=>firebaseReady,
  getFsMod:()=>fb.fsMod,
  getLastProtocol:(site)=>getLastProtocol(site),
  getRows:()=>rows,
  getSelectedSite:()=>selectedSite,
  historyDateLabel,
  historySavedDateLabel,
  isProtocolHistoryItem,
  officialManufacturerSelectNode,
  officialManufacturerTextByKey,
  officialProtocolDataBoxNode,
  officialProtocolSourceInfoNode,
  officialProtocolStatusNode,
  pickRawValue,
  protocolTimeValue,
  readSiteLocalArray,
  readSiteLocalObject,
  recordMatchesSite,
  rowIdentityKeys,
  rowMatchesIdentity,
  safe,
  selectedSiteDocId,
  selectedSiteMatchForSave,
  setDisplayIfChanged,
  setInputValue,
  setRows:nextRows=>{
    rows=nextRows;
    window.rows=rows;
  },
  setTextIfChanged,
  showSaveConfirmation,
  simpleNorm,
  siteSiblingRows,
  timeValueFromAny,
  val,
  waitForFirebaseUser,
  writeSiteLocalObject
});

const {
  buildOfficialProtocolWordEntries
}=createOfficialProtocolWordDocumentHelpers({
  OFFICIAL_CONTROL_SUBJECT_TEXT,
  buildProtocolWordStylesXml,
  getCurrentUser:()=>currentUser,
  getSelectedSite:()=>selectedSite,
  officialManufacturerText,
  officialOperatorText,
  officialProtocolConditionsText,
  officialProtocolCustomerNote,
  officialProtocolDeviceLine,
  officialProtocolFunctionalText,
  officialProtocolMeasurementNotesXml,
  officialProtocolNextDate,
  officialProtocolResultText,
  protocolDisplayDate,
  protocolSignatureImageBytes,
  protocolSourceLocationFromSite,
  safe,
  wordBlank,
  wordClientSignatureCellXml,
  wordParagraph,
  wordParagraphXml,
  wordRun,
  wordTable,
  wordXmlEscape
});

const OFFICIAL_RTF_TEMPLATE_URL="official-template.rtf";
const OFFICIAL_STOP_RTF_TEMPLATE_URL="official-stop-template.rtf";
const OFFICIAL_TIPEK_SIGNATURE_URL="./podpis-tipek.png";
const OFFICIAL_WATERMARK_LOGO_URL="./szz-logo-display.png";

const {
  addOfficialRtfSignatures,
  addOfficialRtfWatermark
}=createOfficialRtfAssetHelpers({
  base64ToBytes,
  officialOneLine,
  officialRtfEscape,
  protocolSignatureImageBytes,
  safe
});

const {
  fillOfficialRtfTemplate
}=createOfficialRtfTemplateHelpers({
  OFFICIAL_CONTROL_SUBJECT_TEXT,
  addOfficialRtfSignatures,
  addOfficialRtfWatermark,
  compactOfficialRtfMeasurementSection,
  officialManufacturerText,
  officialMultiline,
  officialOneLine,
  officialOperatorLines,
  officialProtocolCustomerNote,
  officialProtocolTemplateValues,
  officialRtfEscape,
  safe
});

const {
  officialProtocolAddressFileName,
  officialProtocolFileDatePart
}=createOfficialProtocolFileNameHelpers({
  getSelectedSite:()=>selectedSite,
  officialOneLine,
  parseDateValue,
  pickRawValue,
  protocolWordFileNamePart,
  safe,
  siteHasMultipleSources,
  siteSourceLabel,
  sourceTypeTextFromRaw
});

const {
  preparedOfficialProtocolExport
}=createOfficialRtfExportHelpers({
  OFFICIAL_RTF_TEMPLATE_URL,
  OFFICIAL_STOP_RTF_TEMPLATE_URL,
  OFFICIAL_TIPEK_SIGNATURE_URL,
  OFFICIAL_WATERMARK_LOGO_URL,
  fillOfficialRtfTemplate,
  getCurrentUser:()=>currentUser,
  getSelectedSite:()=>selectedSite,
  officialProtocolAddressFileName,
  officialProtocolFileDatePart
});

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

const {
  promptProtocolMailRecipient,
  protocolMailBody,
  protocolMailErrorText,
  protocolMailSubject,
  protocolMailToastText,
  validProtocolMailRecipient
}=createProtocolMailHelpers({
  currentUserEmail,
  getCurrentUser:()=>currentUser,
  getSelectedSite:()=>selectedSite,
  normalizeTechnicianDisplayName,
  protocolDisplayDate,
  safe
});

const {
  buildProtocolWordBlob
}=createProtocolWordBlobHelpers({
  buildProtocolWordEntries
});

const {
  blobToBase64,
  downloadBlobFile,
  drawImageContained,
  loadDataUrlImage,
  protocolPdfFileNameFromWord
}=createBrowserFileHelpers({ safe });

const {
  renderProtocolPdfPageCanvases
}=createProtocolPdfRenderHelpers({
  drawImageContained,
  getSelectedSite:()=>selectedSite,
  loadDataUrlImage,
  protocolAccessText,
  protocolAvailabilityText,
  protocolBackedDevicesText,
  protocolConditionsText,
  protocolDisplayDate,
  protocolExportValue,
  protocolMeasurementTableSpec,
  protocolPeriodText,
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel,
  protocolTechnicianDisplayName,
  safe
});

const TECHNICIAN_SIGNATURE_COLLECTION="technicianSignatures";
const {
  enrichProtocolWithTechnicianSignature,
  openTechnicianSignatureDialog
}=createTechnicianSignatureHelpers({
  collectionName:TECHNICIAN_SIGNATURE_COLLECTION,
  currentUserEmail,
  drawImageContained,
  getDb:()=>db,
  getFbFsMod:()=>fb.fsMod,
  getFirebaseReady:()=>firebaseReady,
  loadDataUrlImage,
  officialTipekSignatureUrl:OFFICIAL_TIPEK_SIGNATURE_URL,
  protocolTechnicianEmail,
  protocolTechnicianSignatureImageBytes,
  safe,
  setProtocolStatusText:message=>setProtocolStatusText(message),
  showSaveConfirmation,
  simpleNorm,
  technicianKnownKeyFromValue,
  uniqueNonEmptyStrings
});
window.openTechnicianSignatureDialog=openTechnicianSignatureDialog;

const {
  buildPdfFromJpegPages
}=createPdfByteWriterHelpers({
  base64ToBytes,
  safe
});

const {
  buildProtocolPdfBlob,
  exportProtocolToWord,
  preparedProtocolExport,
  preparedProtocolFilled,
  preparedProtocolPdfExport,
  sendProtocolByMail
}=createProtocolFileExportHelpers({
  blobToBase64,
  buildPdfFromJpegPages,
  buildProtocolWordBlob,
  downloadBlobFile,
  enrichProtocolWithTechnicianSignature,
  ensureMailFunctions,
  getFbFnMod:()=>fb.fnMod,
  getFirebaseReady:()=>firebaseReady,
  getMailFunctions:()=>mailFunctions,
  getSelectedSite:()=>selectedSite,
  normalizeProtocolTechnicianFields,
  protocolExportDatePart,
  protocolMailBody,
  protocolMailSubject,
  protocolPdfFileNameFromWord,
  protocolTechnicianDisplayName,
  protocolTechnicianSignatureImageBytes,
  protocolWordFileNamePart,
  renderProtocolPdfPageCanvases,
  safe,
  setProtocolStatusText,
  showSaveConfirmation,
  validProtocolMailRecipient
});

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

const {
  refreshSelectedDetailDataView,
  refreshSiteDataFromFirebase
}=createDetailDataRefreshHelpers({
  applyLatestProtocolDateToRaw,
  detailKey,
  detailSubNode,
  detailTableNode,
  getDb:()=>db,
  getFbFsMod:()=>fb.fsMod,
  getFirebaseReady:()=>firebaseReady,
  getSelectedSite:()=>selectedSite,
  normalize,
  renderDetailTable,
  selectedSiteDocId,
  setSelectedSite:site=>{ selectedSite=site; },
  showControlDateDisplay,
  siteSourceLabel,
  syncOpenProtocolContactFromDetail,
  syncOpenProtocolDeviceTypeFromDetail
});

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

const isHistoryAdmin=()=>isAppAdmin();

const {
  deleteCurrentHistoryProtocol,
  prependHistoryNotice
}=createDetailHistoryDeleteHelpers({
  detailHistoryNode,
  getCurrentHistoryItem:()=>detailHistoryItems[detailHistoryIndex],
  getDb:()=>db,
  getFsMod:()=>fb.fsMod,
  getSelectedSite:()=>selectedSite,
  isHistoryAdmin,
  loadHistory,
  removeSiteLocalItem,
  selectedSiteDocId,
  showSaveConfirmation
});

const { bindDetailHistoryActions }=createDetailHistoryActionsHelpers({
  deleteCurrentHistoryProtocol,
  editCurrentHistoryProtocol,
  exportProtocolToWord,
  getCurrentHistoryItem:()=>detailHistoryItems[detailHistoryIndex],
  getHistoryIndex:()=>detailHistoryIndex,
  openTechnicianSignatureDialog,
  promptProtocolMailRecipient,
  protocolMailErrorText,
  protocolMailToastText,
  renderHistory:()=>renderHistory(),
  sendProtocolByMail,
  setDetailHistoryProtocolHandoff:(item,checked)=>setDetailHistoryProtocolHandoff(item,checked),
  setHistoryIndex:value=>{ detailHistoryIndex=value; },
  setProtocolStatusText:message=>setProtocolStatusText(message),
  showSaveConfirmation
});

const {
  renderHistory
}=createDetailHistoryViewHelpers({
  bindDetailHistoryActions,
  canViewProtocolHistory,
  detailHistoryNode,
  detailLazyKey,
  getDetailHistoryIndex:()=>detailHistoryIndex,
  getDetailHistoryItems:()=>detailHistoryItems,
  getDetailHistoryRenderSignature:()=>detailHistoryRenderSignature,
  getSelectedSite:()=>selectedSite,
  historyDateLabel,
  historyObjectSummary,
  historySavedDateLabel,
  isHistoryAdmin,
  isProtocolHistoryItem,
  protocolHandoffForProcessing,
  protocolSourceStateLabel,
  protocolSourceStateValue,
  protocolSourceTestMethodLabel,
  protocolTechnicianDisplayName,
  protocolTimeValue,
  safe,
  setDetailHistoryIndex:value=>{ detailHistoryIndex=value; },
  setDetailHistoryItems:items=>{ detailHistoryItems=items; },
  setDetailHistoryRenderSignature:value=>{ detailHistoryRenderSignature=value; },
  updateOfficialProtocolSourceInfo
});

const {
  firstProtocolHistoryItem,
  hasMatchingHistoryItemForSite,
  latestMatchingHistoryItemForSite,
  matchingHistoryItemsForSite,
  sortedMatchingHistoryItemsForSite
}=createHistoryMatchHelpers({
  getSelectedSite:()=>selectedSite,
  protocolTimeValue,
  recordMatchesSite
});

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

const { runOfflineSync }=createLegacyOfflineSyncRunner({
  getSelectedSite:()=>selectedSite,
  syncOfflineChanges,
  syncOfflineProtocolsForSite
});

bindLegacyOfflineSyncListeners({
  getSelectedSite:()=>selectedSite,
  refreshLoadedDetailTabs:window.refreshLoadedDetailTabs,
  runOfflineSync,
  showSaveConfirmation
});



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
    window.__szzSetAuthState(AUTH_LOGGED_IN);
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
  const hasCachedRows=!!((Array.isArray(rows) && rows.length) || (Array.isArray(window.rows) && window.rows.length));
  if(navigator.onLine===false && knownSignedIn() && !explicitSignOutPending() && hasCachedRows){
    if(window.setStartupAuthChecking) window.setStartupAuthChecking(false);
    if(window.updateAdminAppControls) window.updateAdminAppControls();
    window.__mapAppUnlocked=true;
    try{document.documentElement.classList.add("auth-resume");}catch(e){}
    const startup=document.getElementById("startupScreen");
    const app=document.getElementById("mainApp");
    const loginRow=document.getElementById("mainLoginRow");
    const topLogout=document.getElementById("topLogoutBtn");
    setDisplayIfChanged(startup,"none");
    setDisplayIfChanged(app,"grid");
    setDisplayIfChanged(loginRow,"none");
    setDisplayIfChanged(topLogout,"block");
    if(window.setTopAuthButtonMode) window.setTopAuthButtonMode("login");
    setProgressStatus("Offline režim. Používám lokálně uložené body, protokoly a fotky.");
    return;
  }
  if(window.setStartupAuthChecking) window.setStartupAuthChecking(false);
  if(window.updateAdminAppControls) window.updateAdminAppControls();
  window.__mapAppUnlocked=false;
  if(typeof window.__szzSetAuthState==="function"){
    window.__szzSetAuthState(AUTH_LOGGED_OUT,{message:""});
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
  setMainProtocolHistoryProcessed:(item,checked)=>setMainProtocolHistoryProcessed(item,checked),
  showSaveConfirmation
});

window.addEventListener("storage",event=>{
  if(!event.key || event.key===SZZ_PROTOCOL_HANDOFF_OVERRIDES_KEY) clearProtocolHandoffOverridesCache();
});

const {
  setDetailHistoryProtocolHandoff,
  setMainProtocolHistoryProcessed
}=createProtocolProcessingStateHelpers({
  clearDetailHistoryCacheForKind,
  clearLocalDetailReadCacheForKind,
  clearLocalStorageArrayEntriesCache,
  clearSiteChildItemsCache,
  getCurrentUser:()=>currentUser,
  getDb:()=>db,
  getDetailHistoryItems:()=>detailHistoryItems,
  getFirebaseReady:()=>firebaseReady,
  getFsMod:()=>fb.fsMod,
  getMainProtocolHistoryCurrentItems:()=>mainProtocolHistoryCurrentItems,
  getSelectedSite:()=>selectedSite,
  mainProtocolProcessedLocalPatch,
  mainProtocolProcessedRemotePatch,
  patchMainProtocolHistoryCacheItems,
  patchProtocolProcessedItems,
  protocolHandoffLocalPatch,
  protocolHandoffRemotePatch,
  rememberProtocolHandoffOverride,
  rememberSiteLocalArrayReadCache,
  safe,
  selectedSiteDocId,
  setDetailHistoryItems:items=>{ detailHistoryItems=items; },
  setMainProtocolHistoryCurrentItems:items=>{ mainProtocolHistoryCurrentItems=items; },
  setSelectedSite:site=>{ selectedSite=site; },
  uniqueNonEmptyStrings,
  withSzzOfflineQueueStore,
  SZZ_OFFLINE_PROTOCOL_QUEUE_STORE
});

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
  await ensureRawOfferNumberFromSerial(allRawData);
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


const {
  bindProtocolSignatureToggle,
  clearProtocolClientSignature,
  drawSavedProtocolSignature,
  initProtocolClientSignaturePad,
  protocolClientSignatureDataUrl,
  protocolClientSignaturePanel,
  protocolSignatureCanvas,
  protocolSignatureContext,
  setProtocolClientSignaturePanelOpen
}=createProtocolSignatureHelpers({
  formFieldNode,
  safeValue:safe,
  scheduleProtocolDraftSave
});
bindProtocolSignatureToggle();


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

const {
  deleteCloudinaryUpload,
  prepareCloudinaryUploadFile,
  prepareOfflinePhotoData,
  uploadPhotoToCloudinary
}=createPhotoUploadRuntimeHelpers({
  cloudinaryPhotos:CLOUDINARY_PHOTOS,
  getDefaultSite:()=>selectedSite,
  getDeleteToken:item=>safe((item && item.cloudinaryDeleteToken) || sitePhotoDeleteTokens.get(safe(item && item._id)))
});

let sitePhotoItems=[];
let sitePhotoIndex=0;
let sitePhotoRenderSignature="";
let sitePhotoDeleteTokens=new Map();

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

const SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY="astipMap:offlineSites:v1";
const SZZ_LEGACY_OFFLINE_SITE_COUNT_CACHE_MS=1800;
let szzLegacyOfflineSiteCountCache={raw:null,count:0,savedAt:0};
const OFFLINE_SITE_COUNT_CACHE_MS=1800;
let offlineSiteCountCache={count:null,savedAt:0,storageLength:-1};
const OFFLINE_PHOTO_COUNT_CACHE_MS=1800;
let offlinePhotoCountCache={count:null,savedAt:0,storageLength:-1};

const {
  cloneSzzOfflineCounts,
  invalidateSzzOfflineCountsCache,
  readSzzOfflineCountsCache,
  writeSzzOfflineCountsCache
}=createOfflineCountsCacheHelpers({cacheMs:1200});
window.invalidateSzzOfflineCountsCache=invalidateSzzOfflineCountsCache;
const {
  bindOfflineCountStorageInvalidation,
  invalidateOfflinePhotoCountCache,
  invalidateOfflineSiteCountCache
}=createOfflineCountInvalidationHelpers({
  clearOfflinePhotoAllReadCache,
  clearOfflineSiteQueueReadCache,
  invalidateSzzOfflineCountsCache,
  legacyOfflineSiteQueueKey:SZZ_LEGACY_OFFLINE_SITE_QUEUE_KEY,
  resetLegacyOfflineSiteCountCache:()=>{ szzLegacyOfflineSiteCountCache={raw:null,count:0,savedAt:0}; },
  resetOfflinePhotoCountCache:()=>{ offlinePhotoCountCache={count:null,savedAt:0,storageLength:-1}; },
  resetOfflineSiteCountCache:()=>{ offlineSiteCountCache={count:null,savedAt:0,storageLength:-1}; }
});
bindOfflineCountStorageInvalidation();

const {
  noteSzzSyncState,
  readSzzSyncState,
  szzSyncTimeLabel,
  writeSzzSyncState
}=createOfflineSyncStateHelpers({
  readSzzLocalStateObject,
  safeValue:safe,
  writeSzzLocalStateObject
});
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

const { collectSzzOfflineCounts }=createOfflineCountsCollectorHelpers({
  readAndroidOfflineCounts,
  readCachedFirebaseSiteCount,
  readPendingOfflinePhotoCount,
  readPendingOfflineProtocolCount,
  readPendingOfflineSitesCount,
  readProtocolDraftCount,
  readSzzOfflineCountsCache,
  readSzzOfflineReadyState,
  requestSzzPersistentStorage,
  szzStorageEstimate,
  writeSzzOfflineCountsCache
});

const {
  renderSzzOfflineAppStatus,
  szzOfflineStatusNode
}=createOfflineStatusRenderHelpers({
  isOnline:()=>navigator.onLine!==false,
  readSzzSyncState,
  safeValue:safe,
  setTextIfChanged,
  szzBytesLabel,
  szzSyncTimeLabel
});

const {
  scheduleSzzOfflineAppStatus,
  updateSzzOfflineAppStatus
}=createOfflineStatusUpdateHelpers({
  collectSzzOfflineCounts,
  invalidateSzzOfflineCountsCache,
  renderSzzOfflineAppStatus
});
window.updateSzzOfflineAppStatus=updateSzzOfflineAppStatus;
window.scheduleSzzOfflineAppStatus=scheduleSzzOfflineAppStatus;

const {
  registerSzzBackgroundSync,
  triggerSzzSync
}=createOfflineSyncTriggerHelpers({
  noteSzzSyncState,
  openAppToolsPanel:()=>{ if(window.openAppToolsPanel) window.openAppToolsPanel(); },
  registerServiceWorker:()=>window.registerSzzServiceWorker
    ? window.registerSzzServiceWorker()
    : navigator.serviceWorker.ready,
  scheduleSzzOfflineAppStatus,
  showSaveConfirmation:message=>{ if(window.showSaveConfirmation) window.showSaveConfirmation(message); },
  syncOfflineChanges,
  updateSzzOfflineAppStatus
});
window.triggerSzzSync=triggerSzzSync;
window.registerSzzBackgroundSync=registerSzzBackgroundSync;

const {
  bindSzzOfflineAppControls
}=createOfflineAppControlsHelpers({
  prepareSzzOfflineAppData,
  scheduleSzzOfflineAppStatus,
  showSaveConfirmation,
  triggerSzzSync,
  updateSzzOfflineAppStatus
});
document.addEventListener("DOMContentLoaded",bindSzzOfflineAppControls);
bindSzzOfflineAppControls();

bindOfflineConnectivityListeners({
  registerSzzBackgroundSync,
  runWhenIdle,
  scheduleSzzOfflineAppStatus,
  triggerSzzSync
});

const {
  sitePhotoKeys,
  sitePhotoRenderKey
}=createSitePhotoRenderKeyHelpers({
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
});

const {
  createSitePhotoEmptyNode,
  createSitePhotoViewer
}=createSitePhotoViewerRenderHelpers({
  canDeleteSitePhoto,
  photoDisplayUrl,
  photoFullUrl,
  photoRenderMeta,
  photoThumbUrl,
  safe,
  sitePhotoFolderGroups
});

const { deleteCurrentSitePhoto }=createSitePhotoDeleteHelpers({
  canDeleteSitePhoto,
  deleteCloudinaryUpload,
  deleteSiteChildItem,
  getSelectedSite:()=>selectedSite,
  getSitePhotoIndex:()=>sitePhotoIndex,
  getSitePhotoItems:()=>sitePhotoItems,
  removeEmbeddedSiteItem,
  removeOfflinePhotoItem,
  removeSiteLocalItem,
  renderSitePhotos:(items,preserveIndex)=>renderSitePhotos(items,preserveIndex),
  safe,
  setSitePhotoIndex:index=>{ sitePhotoIndex=index; },
  setSitePhotoItems:items=>{ sitePhotoItems=items; },
  setSitePhotosStatusText,
  showSaveConfirmation,
  sitePhotoDeleteTokens
});

const { bindSitePhotoListClicks }=createSitePhotoClickHelpers({
  deleteCurrentSitePhoto,
  getSitePhotoIndex:()=>sitePhotoIndex,
  getSitePhotoItems:()=>sitePhotoItems,
  renderSitePhotos:(items,preserveIndex)=>renderSitePhotos(items,preserveIndex),
  setSitePhotoIndex:index=>{ sitePhotoIndex=index; }
});

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
    list.replaceChildren(createSitePhotoEmptyNode());
    return;
  }
  sitePhotoIndex=Math.max(0,Math.min(sitePhotoIndex,sitePhotoItems.length-1));
  const renderSignature=sitePhotoRenderKey(sitePhotoItems,sitePhotoIndex,selectedSite);
  if(sitePhotoRenderSignature===renderSignature && list.childElementCount) return;
  sitePhotoRenderSignature=renderSignature;
  list.replaceChildren(createSitePhotoViewer(sitePhotoItems,sitePhotoIndex));
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
const { loadSiteAttachments }=createSiteAttachmentLoadHelpers({
  attachmentDisplayUrl,
  attachmentSiblingRows,
  detailLazyKey,
  getDb:()=>db,
  getFirebaseReady:()=>firebaseReady,
  getSelectedSite:()=>selectedSite,
  historyTimeValue,
  loadSiteChildItems,
  readAndroidCachedRecords,
  readSiteLocalArray,
  refreshSiteDataFromFirebase,
  renderSiteAttachments,
  safe,
  saveAttachmentsSnapshotToAndroid,
  setSiteAttachmentItems:items=>{ siteAttachmentItems=items; },
  setSiteAttachmentsStatusText,
  siteAttachmentsStatusNode,
  waitForFirebaseUser
});

const { uploadSiteAttachments }=createSiteAttachmentUploadHelpers({
  addLocalAttachmentToCurrentView,
  appendEmbeddedSiteItem,
  appendSiteLocalArray,
  attachmentInlineMaxBytes:ATTACHMENT_INLINE_MAX_BYTES,
  attachmentSiblingRows,
  bytesLabel,
  getCurrentUserEmail:()=>currentUser?.email || lastKnownUserEmail() || "",
  getDb:()=>db,
  getFirebaseReady:()=>firebaseReady,
  getSelectedSite:()=>selectedSite,
  getSiteAttachmentItems:()=>siteAttachmentItems,
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
});
function addLocalAttachmentToCurrentView(item){
  const id=safe(item && item._id);
  siteAttachmentItems=[item,...siteAttachmentItems.filter(existing=>safe(existing && existing._id)!==id)];
  resetSiteAttachmentRenderSignature();
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
      runWhenIdle(()=>window.syncFirebaseRowsDeltaAfterAuth?.("startup")?.catch(e=>{
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
