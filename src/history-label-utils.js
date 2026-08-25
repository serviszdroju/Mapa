import { safe } from "./core-utils.js";

export function createHistoryLabelHelpers({
  dateOnlyTextFallback,
  formatDateCz,
  formatDateTimeCz,
  isAppAdmin,
  protocolExportValue
}={}){
  const adminDateLabel=date=>typeof isAppAdmin==="function" && isAppAdmin() && typeof formatDateTimeCz==="function"
    ? formatDateTimeCz(date)
    : (typeof formatDateCz==="function" ? formatDateCz(date) : "");

  function historySavedDateLabel(item){
    const raw=item?.savedAt || item?.createdAt || item?.updatedAt || item?.offlineSavedAt || "";
    const time=typeof protocolExportValue==="function" ? protocolExportValue(raw) : "";
    if(!time) return "";
    if(raw && typeof raw.toDate==="function") return adminDateLabel(raw.toDate());
    const d=new Date(raw || 0);
    if(isNaN(d.getTime())){
      return typeof isAppAdmin==="function" && isAppAdmin()
        ? time
        : (typeof dateOnlyTextFallback==="function" ? dateOnlyTextFallback(time) : time);
    }
    return adminDateLabel(d);
  }

  function historyDateLabel(item){
    if(item?.checkDate) return item.checkDate;
    if(item?.date) return item.date;
    const raw=item?.createdAt;
    if(raw && typeof raw.toDate==="function"){
      return typeof formatDateCz==="function" ? formatDateCz(raw.toDate()) : "";
    }
    const d=new Date(raw || 0);
    return isNaN(d.getTime()) ? "bez data" : (typeof formatDateCz==="function" ? formatDateCz(d) : "bez data");
  }

  function protocolGlobalHistoryTitle(item={}){
    const title=safe(item.siteName || item.place || item.siteAddress || item.siteKey || item.firebaseDocId || "Protokol");
    const device=safe(item.deviceType || item.selectedDevice || item.siteSource || "");
    const serial=safe(item.serial || "");
    return [title, device, serial].filter(Boolean).join(" | ");
  }

  return {
    historyDateLabel,
    historySavedDateLabel,
    protocolGlobalHistoryTitle
  };
}
