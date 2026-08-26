export function createSharedPlaceEditHelpers({
  applyWatchSelfAliases,
  dataNormFixed,
  detailKey,
  safe,
  selectedSiteDocId
}){
  function selectedSiteMatchForSave(row, selectedKey, firebaseDocId){
    if(!row) return false;
    const rowDocId=safe(row.firebaseDocId || (row.raw && row.raw["Firebase_doc_id"]) || "");
    return detailKey(row)===selectedKey || row.id===selectedKey || (firebaseDocId && rowDocId===firebaseDocId);
  }

  function copySharedDetailEdit(editedRaw,out,keys=[]){
    const sourceKey=(keys || []).find(key=>Object.prototype.hasOwnProperty.call(editedRaw,key));
    if(!sourceKey) return;
    const value=editedRaw[sourceKey];
    (keys || []).forEach(key=>{out[key]=value;});
  }

  function sharedPlaceEditsFromRaw(editedRaw={}){
    const out={};
    const copy=(from,to=from)=>{
      if(Object.prototype.hasOwnProperty.call(editedRaw,from)){
        out[to]=editedRaw[from];
      }
    };
    copy("Adresa / umístění");
    copy("Adresa / umístění","Původní adresa / umístění");
    copy("Adresa_GPS");
    copy("GPS_lat");
    copy("GPS_lon");
    copy("Kraj");
    copySharedDetailEdit(editedRaw,out,["Název"]);
    copySharedDetailEdit(editedRaw,out,["Kontakt","Kontakt_mapy","Hlavní kontakt","Upravený kontakt"]);
    copySharedDetailEdit(editedRaw,out,["Perioda kontrol","Perioda zkoušky","Perioda zkoušek","Perioda kontroly","Perioda","Četnost","Cetnost","Interval"]);
    copySharedDetailEdit(editedRaw,out,["Hlídáme sami termín","Hlídáme termín sami","Hlídat termín sami","Hlidat termin sami","Hlídáme kontroly sami","Hlidame kontroly sami","Jezdit hlídáme termín sami","Bez objednávky"]);
    copySharedDetailEdit(editedRaw,out,["Smlouva ano/ne","Smlouva (ano/ne)","Smlouva ano ne","Smlouva ano","Smlouva"]);
    copySharedDetailEdit(editedRaw,out,["Důležitá poznámka","DŮLEŽITÁ POZNÁMKA","Důležité poznámky"]);
    copySharedDetailEdit(editedRaw,out,["Poznámky","Poznámky_mapy","Upravené poznámky"]);
    const watchValue=out["Hlídáme sami termín"] || out["Hlídáme kontroly sami"] || out["Hlídat termín sami"];
    if(Object.keys(out).some(key=>dataNormFixed(key).includes("hlidame") || dataNormFixed(key).includes("hlidat"))){
      applyWatchSelfAliases(out,watchValue || "ne");
    }
    return out;
  }

  function rowIdentityKeys(row){
    return [
      selectedSiteDocId(row),
      row && row.firebaseDocId,
      row && row.id,
      detailKey(row),
      row && row.raw && row.raw["Firebase_doc_id"]
    ].map(safe).filter(Boolean);
  }

  function rowMatchesIdentity(row,identityKeys){
    if(!row || !identityKeys || !identityKeys.size) return false;
    return rowIdentityKeys(row).some(key=>identityKeys.has(key));
  }

  return {
    rowIdentityKeys,
    rowMatchesIdentity,
    selectedSiteMatchForSave,
    sharedPlaceEditsFromRaw
  };
}
