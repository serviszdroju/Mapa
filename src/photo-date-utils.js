export function createPhotoDateHelpers({
  formatDateCz,
  formatDateTimeCz,
  isAppAdmin
}={}){
  const adminState=()=>typeof isAppAdmin==="function" && isAppAdmin();
  const dateLabel=date=>{
    if(typeof formatDateCz==="function") return formatDateCz(date);
    return "";
  };
  const dateTimeLabel=date=>{
    if(adminState() && typeof formatDateTimeCz==="function") return formatDateTimeCz(date);
    return dateLabel(date);
  };

  function photoDateLabel(item){
    const raw=item?.createdAt || item?.uploadedAt || item?.date || "";
    if(raw && typeof raw.toDate==="function") return dateLabel(raw.toDate());
    const d=new Date(raw || 0);
    return isNaN(d.getTime()) ? "" : dateLabel(d);
  }

  function photoDateTimeLabel(raw){
    if(raw && typeof raw.toDate==="function") return dateTimeLabel(raw.toDate());
    const d=new Date(raw || 0);
    return isNaN(d.getTime()) ? "" : dateTimeLabel(d);
  }

  function photoCloudinaryVersionDate(item){
    const version=Number(item?.cloudinaryVersion || item?.version || 0);
    if(!Number.isFinite(version) || version<1000000000) return "";
    return new Date(version*1000).toISOString();
  }

  function photoTakenLabel(item){
    return photoDateTimeLabel(item?.takenAt || item?.photoTakenAt || item?.lastModifiedAt || item?.createdAt || item?.uploadedAt || item?.date || photoCloudinaryVersionDate(item));
  }

  function photoInsertedLabel(item){
    return photoDateTimeLabel(item?.createdAt || item?.uploadedAt || item?.date || photoCloudinaryVersionDate(item));
  }

  return {
    photoCloudinaryVersionDate,
    photoDateLabel,
    photoDateTimeLabel,
    photoInsertedLabel,
    photoTakenLabel
  };
}
