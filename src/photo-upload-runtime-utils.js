export function createPhotoUploadRuntimeHelpers({
  cloudinaryPhotos,
  getDefaultSite,
  getDeleteToken
}){
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

  async function uploadPhotoToCloudinary(photoId,file,site=getDefaultSite(),folderName=""){
    const mod=await photoUploadModule();
    return mod.uploadPhotoToCloudinary({photoId,file,site,folderName,config:cloudinaryPhotos});
  }

  async function deleteCloudinaryUpload(item){
    const token=getDeleteToken(item);
    if(!token || !cloudinaryPhotos.cloudName) return;
    const mod=await photoUploadModule();
    await mod.deleteCloudinaryUpload({token,config:cloudinaryPhotos});
  }

  return {
    deleteCloudinaryUpload,
    prepareCloudinaryUploadFile,
    prepareOfflinePhotoData,
    uploadPhotoToCloudinary
  };
}
