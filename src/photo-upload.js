function safe(value){
  return String(value ?? "").trim();
}

function fileBaseName(name){
  return safe(name || "fotografie").replace(/\.[^.]+$/,"") || "fotografie";
}

function photoFileName(item,idx=0){
  const base=fileBaseName(item?.fileName || item?.originalFileName || `fotografie-${idx+1}`)
    .replace(/[^\p{L}\p{N}_-]+/gu,"_")
    .replace(/^_+|_+$/g,"")
    .slice(0,70) || `fotografie-${idx+1}`;
  return `${base}.jpg`;
}

function loadImageFileForResize(file){
  return new Promise((resolve,reject)=>{
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror=()=>{
      URL.revokeObjectURL(url);
      reject(new Error("Fotografii se nepodařilo načíst pro zmenšení."));
    };
    img.src=url;
  });
}

export async function prepareCloudinaryUploadFile(file){
  if(!file || !/^image\//i.test(file.type || "")) return file;
  if(/gif/i.test(file.type || "")) return file;
  try{
    const img=await loadImageFileForResize(file);
    const maxEdge=2200;
    const quality=.86;
    const width=img.naturalWidth || img.width;
    const height=img.naturalHeight || img.height;
    if(!width || !height) return file;
    const scale=Math.min(1,maxEdge/Math.max(width,height));
    if(scale>=1 && file.size<900*1024 && /jpe?g|webp/i.test(file.type || "")) return file;
    const canvas=document.createElement("canvas");
    canvas.width=Math.max(1,Math.round(width*scale));
    canvas.height=Math.max(1,Math.round(height*scale));
    const ctx=canvas.getContext("2d");
    if(!ctx) return file;
    ctx.fillStyle="#fff";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(img,0,0,canvas.width,canvas.height);
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",quality));
    if(!blob) return file;
    if(blob.size>=file.size && scale>=1) return file;
    const fileName=photoFileName({fileName:file.name || "fotografie"},0);
    return new File([blob],fileName,{type:"image/jpeg",lastModified:Date.now()});
  }catch(e){
    console.warn("Fotku se nepodařilo před uploadem zmenšit, nahrávám původní soubor",e);
    return file;
  }
}

function blobToDataUrl(blob){
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result || ""));
    reader.onerror=()=>reject(reader.error || new Error("Fotografii se nepodařilo načíst."));
    reader.readAsDataURL(blob);
  });
}

export async function prepareOfflinePhotoData(file){
  if(!file) throw new Error("Fotografie není vybraná.");
  let blob=file;
  if(/^image\//i.test(file.type || "") && !/gif/i.test(file.type || "")){
    try{
      const img=await loadImageFileForResize(file);
      const maxEdge=1600;
      const quality=.78;
      const width=img.naturalWidth || img.width;
      const height=img.naturalHeight || img.height;
      if(width && height){
        const scale=Math.min(1,maxEdge/Math.max(width,height));
        const canvas=document.createElement("canvas");
        canvas.width=Math.max(1,Math.round(width*scale));
        canvas.height=Math.max(1,Math.round(height*scale));
        const ctx=canvas.getContext("2d");
        if(ctx){
          ctx.fillStyle="#fff";
          ctx.fillRect(0,0,canvas.width,canvas.height);
          ctx.drawImage(img,0,0,canvas.width,canvas.height);
          blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/jpeg",quality)) || file;
        }
      }
    }catch(e){
      console.warn("Offline fotku se nepodařilo zmenšit, ukládám původní verzi",e);
    }
  }
  const dataUrl=await blobToDataUrl(blob);
  return {
    dataUrl,
    size:blob.size || file.size || dataUrl.length,
    type:blob.type || file.type || "image/jpeg"
  };
}

function cloudinaryTransformUrl(url,transformation){
  const s=safe(url);
  const t=safe(transformation);
  if(!s || !t || !s.includes("/image/upload/")) return s;
  if(s.includes(`/image/upload/${t}/`)) return s;
  const marker="/image/upload/";
  const markerIndex=s.indexOf(marker);
  const prefix=s.slice(0,markerIndex+marker.length);
  const rest=s.slice(markerIndex+marker.length);
  const slashIndex=rest.indexOf("/");
  if(slashIndex<0) return s;
  const firstSegment=rest.slice(0,slashIndex);
  const remaining=rest.slice(slashIndex+1);
  const firstSegmentIsVersion=/^v\d+$/i.test(firstSegment);
  const firstSegmentLooksTransform=/(^|,)(?:f_auto|q_auto|w_\d+|h_\d+|c_[a-z0-9_]+|dpr_|fl_|e_|g_|r_|ar_)/i.test(firstSegment);
  return firstSegmentLooksTransform && !firstSegmentIsVersion
    ? `${prefix}${t}/${remaining}`
    : `${prefix}${t}/${rest}`;
}

function cloudinaryUploadPresets(config={}){
  return [config.uploadPreset,...(config.fallbackUploadPresets || [])]
    .map(p=>safe(p))
    .filter((p,idx,arr)=>p && arr.indexOf(p)===idx);
}

function cloudinaryUploadErrorMessage(errors){
  const messages=(errors || []).map(e=>safe(e && e.message)).filter(Boolean);
  const joined=messages.join(" | ");
  if(/whitelist|unsigned|upload preset/i.test(joined)){
    return "Cloudinary odmítlo nahrání: preset astip_mapy není nastavený jako Unsigned. Otevři Cloudinary > Settings > Upload > Upload presets > astip_mapy a přepni Signing mode na Unsigned.";
  }
  return messages[0] || "Cloudinary upload selhal.";
}

function cloudinaryPhotoFolderPath(config={},folderName=""){
  const base=safe(config.folder);
  const folder=safe(folderName);
  return [base,folder].filter(Boolean).join("/");
}

async function uploadPhotoToCloudinaryPreset({file,preset,config={},folderName=""}){
  if(!config.cloudName || !preset){
    throw new Error("Cloudinary není nastavené.");
  }
  const endpoint=`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/image/upload`;
  const form=new FormData();
  form.append("file",file,photoFileName({fileName:file?.name},0));
  form.append("upload_preset",preset);
  const folderPath=cloudinaryPhotoFolderPath(config,folderName);
  if(folderPath) form.append("folder",folderPath);

  const response=await fetch(endpoint,{method:"POST",body:form});
  const data=await response.json().catch(()=>({}));
  if(!response.ok || !data.secure_url){
    const msg=data?.error?.message || `Cloudinary upload selhal (${response.status}).`;
    throw new Error(msg);
  }
  const fullUrl=data.secure_url;
  return {
    url:cloudinaryTransformUrl(fullUrl,"f_auto,q_auto,w_1600,c_limit"),
    displayUrl:cloudinaryTransformUrl(fullUrl,"f_auto,q_auto,w_1600,c_limit"),
    thumbUrl:cloudinaryTransformUrl(fullUrl,"f_auto,q_auto,w_240,c_limit"),
    fullUrl,
    storagePath:folderPath,
    cloudinaryFolder:folderPath,
    cloudinaryPublicId:data.public_id || "",
    cloudinaryAssetId:data.asset_id || "",
    cloudinaryVersion:data.version || "",
    cloudinaryUploadPreset:preset,
    cloudinaryDeleteToken:""
  };
}

export async function uploadPhotoToCloudinary(options={}){
  const presets=cloudinaryUploadPresets(options.config || {});
  if(!presets.length) throw new Error("Cloudinary není nastavené.");
  const errors=[];
  for(const preset of presets){
    try{
      return await uploadPhotoToCloudinaryPreset({...options,preset});
    }catch(e){
      errors.push(e);
    }
  }
  throw new Error(cloudinaryUploadErrorMessage(errors));
}

export async function deleteCloudinaryUpload(options={}){
  const token=safe(options.token);
  const config=options.config || {};
  if(!token || !config.cloudName) return;
  try{
    const form=new FormData();
    form.append("token",token);
    await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(config.cloudName)}/delete_by_token`,{
      method:"POST",
      body:form
    });
  }catch(e){
    console.warn("Cloudinary fotku se nepodařilo smazat přes delete token",e);
  }
}
