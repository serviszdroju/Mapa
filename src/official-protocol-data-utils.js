export function createOfficialProtocolDataHelpers({
  detailKey,
  getCurrentUser,
  getDb,
  getDetailHistoryIndex,
  getDetailHistoryItems,
  getFirebaseReady,
  getFsMod,
  getLastProtocol,
  getRows,
  getSelectedSite,
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
  setRows,
  setTextIfChanged,
  showSaveConfirmation,
  simpleNorm,
  siteSiblingRows,
  timeValueFromAny,
  val,
  waitForFirebaseUser,
  writeSiteLocalObject
}){
  function officialProtocolDataForSite(site=getSelectedSite()){
    const remote=(site?.firebaseData?.officialProtocolData && typeof site.firebaseData.officialProtocolData==="object") ? site.firebaseData.officialProtocolData : {};
    const local=readSiteLocalObject("officialProtocolData",site);
    const remoteTime=timeValueFromAny(remote.updatedAt || remote.savedAt || remote.createdAt || 0);
    const localTime=timeValueFromAny(local.updatedAt || local.savedAt || local.createdAt || 0);
    return localTime>remoteTime ? {...remote,...local} : {...local,...remote};
  }

  function officialManufacturerKeyFromText(value){
    const normalized=simpleNorm(value);
    if(normalized.includes("astip servis")) return "astip";
    if(normalized.includes("tipo electric")) return "tipo";
    if(normalized.includes("servis zaloznich zdroju")) return "szz";
    return "szz";
  }

  function syncOfficialManufacturerHidden(){
    const select=officialManufacturerSelectNode();
    const key=select?.value || "szz";
    setInputValue("officialManufacturerData",officialManufacturerTextByKey(key));
    return key;
  }

  function officialProtocolInputData(){
    const currentUser=getCurrentUser();
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
    const currentUser=getCurrentUser();
    return {
      operator:data.operator || "",
      objectAddress:data.objectAddress || "",
      manufacturerKey:data.manufacturerKey || "szz",
      manufacturer:data.manufacturer || officialManufacturerTextByKey(data.manufacturerKey || "szz"),
      updatedAt:data.updatedAt || new Date().toISOString(),
      updatedBy:data.updatedBy || currentUser?.email || ""
    };
  }

  async function propagateOfficialProtocolDataToSiblingSources(data={},site=getSelectedSite(),signedUser=null){
    if(!site) return 0;
    const siblings=siteSiblingRows(site)
      .filter(row=>row && !selectedSiteMatchForSave(row,detailKey(site) || site.id || "",selectedSiteDocId(site)));
    if(!siblings.length) return 0;

    const shared=sharedOfficialProtocolData(data);
    const identityKeys=new Set();
    const db=getDb();
    const fsMod=getFsMod();
    const currentUser=getCurrentUser();
    const canSaveRemote=!!(getFirebaseReady() && db && fsMod && signedUser);
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
          const {doc,setDoc,serverTimestamp}=fsMod;
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
      const rows=getRows().map(row=>{
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
      setRows(rows);
    }
    return saved;
  }

  function fillOfficialProtocolInputs(site=getSelectedSite()){
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
    for(const item of getDetailHistoryItems() || []){
      if(!isProtocolHistoryItem(item)) continue;
      const time=protocolTimeValue(item);
      if(!latest || time>latestTime){
        latest=item;
        latestTime=time;
      }
    }
    return latest;
  }

  function latestLocalProtocolForSite(site=getSelectedSite()){
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
    const current=getDetailHistoryItems()[getDetailHistoryIndex()];
    return isProtocolHistoryItem(current) ? current : null;
  }

  function updateOfficialProtocolSourceInfo(){
    const info=officialProtocolSourceInfoNode();
    if(!info) return;
    const selectedProtocol=selectedHistoryProtocol();
    const selectedSite=getSelectedSite();
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

  function resetOfficialProtocolSection(site=getSelectedSite()){
    fillOfficialProtocolInputs(site);
    const box=officialProtocolDataBoxNode();
    const status=officialProtocolStatusNode();
    setDisplayIfChanged(box,"none");
    setTextIfChanged(status,"");
    updateOfficialProtocolSourceInfo();
  }

  async function saveOfficialProtocolData(options={}){
    const status=officialProtocolStatusNode();
    const selectedSite=getSelectedSite();
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
    const db=getDb();
    const fsMod=getFsMod();
    if(docId && getFirebaseReady() && db && fsMod){
      signedUser=await waitForFirebaseUser(1200);
      if(signedUser){
        try{
          const {doc,setDoc,serverTimestamp}=fsMod;
          await setDoc(doc(db,"sitesUnified",docId),{
            officialProtocolData:data,
            updatedAt:serverTimestamp ? serverTimestamp() : data.updatedAt,
            updatedBy:getCurrentUser()?.email || ""
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
    const selectedSite=getSelectedSite();
    const visible=selectedHistoryProtocol() || latestDisplayedProtocol();
    if(visible) return visible;
    const local=latestLocalProtocolForSite(selectedSite);
    if(local) return local;
    if(!getFirebaseReady() || !getDb()) return null;
    try{
      const last=await getLastProtocol(selectedSite);
      return last || null;
    }catch(e){
      console.warn("Poslední protokol pro doklad se nepodařilo načíst",e);
      return null;
    }
  }

  return {
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
  };
}
