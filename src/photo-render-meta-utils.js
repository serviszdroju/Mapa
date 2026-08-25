import { safe } from "./core-utils.js";
import {
  bytesLabel,
  photoFileName
} from "./photo-url-utils.js";

export function createPhotoRenderMetaHelpers({
  isAppAdmin,
  photoDateLabel,
  photoTakenLabel,
  photoInsertedLabel,
  photoFolderName
}={}){
  const photoRenderMetaCache=new WeakMap();
  const adminState=()=>typeof isAppAdmin==="function" && isAppAdmin() ? "admin" : "user";
  const dateLabel=item=>typeof photoDateLabel==="function" ? photoDateLabel(item) : "";
  const takenLabel=item=>typeof photoTakenLabel==="function" ? photoTakenLabel(item) : "";
  const insertedLabel=item=>typeof photoInsertedLabel==="function" ? photoInsertedLabel(item) : "";
  const folderName=item=>typeof photoFolderName==="function" ? photoFolderName(item) : "";

  function photoRenderMetaFingerprint(item,idx=0){
    if(!item || (typeof item!=="object" && typeof item!=="function")) return "";
    return [
      idx,
      adminState(),
      item.createdAt,
      item.uploadedAt,
      item.date,
      item.takenAt,
      item.photoTakenAt,
      item.lastModifiedAt,
      item.cloudinaryVersion,
      item.version,
      item.storageMode,
      item.size,
      item.originalSize,
      item.uploadedBy,
      item.createdBy,
      item.ownerEmail,
      item.fileName,
      item.originalFileName,
      item.photoFolder,
      item.folderName,
      item.folder,
      item.cloudinaryFolderDate,
      item.cloudinaryFolder
    ].map(safe).join("\u001f");
  }

  function photoRenderMeta(item,idx=0){
    const canCache=!!(item && (typeof item==="object" || typeof item==="function"));
    const fingerprint=canCache ? photoRenderMetaFingerprint(item,idx) : "";
    if(canCache && fingerprint){
      const cached=photoRenderMetaCache.get(item);
      if(cached && cached.fingerprint===fingerprint) return cached.value;
    }
    const modeLabel=item.storageMode==="cloudinary" ? "Cloudinary" : (item.storageMode==="offline" ? "lokálně v tomto zařízení" : "starší záznam");
    const insertedAt=dateLabel(item);
    const meta=[insertedAt ? `Vloženo: ${insertedAt}` : "", modeLabel, bytesLabel(item.size), item.uploadedBy].filter(Boolean).join(" · ");
    const takenAt=takenLabel(item) || "není uvedeno";
    const insertedAtFull=insertedLabel(item) || "datum není uložené";
    const uploadedBy=safe(item.uploadedBy || item.createdBy || item.ownerEmail) || "není uvedeno";
    const currentFolder=folderName(item);
    const value={
      modeLabel,
      insertedAt,
      meta,
      takenAt,
      insertedAtFull,
      uploadedBy,
      currentFolder,
      downloadName:photoFileName(item,idx),
      photoInfoRows:[
        ["Přidáno", insertedAtFull],
        ["Složka", currentFolder || "Bez data"],
        ["Uložil", uploadedBy],
        ["Pořízeno", takenAt],
        ["Velikost", bytesLabel(item.size || item.originalSize) || "není uvedeno"]
      ]
    };
    if(canCache && fingerprint) photoRenderMetaCache.set(item,{fingerprint,value});
    return value;
  }

  return {
    photoRenderMeta
  };
}

export function canDeleteSitePhotoForUser(item,email="",isAdminValue=false){
  if(item && (item.storageMode==="offline" || item._offline === true)) return true;
  const uploadedBy=safe(item && item.uploadedBy).toLowerCase();
  const userEmail=safe(email).toLowerCase();
  return !!isAdminValue || (!!uploadedBy && uploadedBy===userEmail);
}
