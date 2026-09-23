export function createProtocolMailContentHelpers({
  currentUserEmail,
  getCurrentUser,
  getSelectedSite,
  normalizeTechnicianDisplayName,
  protocolDisplayDate,
  safe
}){
  function protocolMailSubject(){
    return "Protokol zkoušky provozuschopnosti záložního zdroje";
  }

  function protocolMailSenderName(protocol={}){
    const currentUser=getCurrentUser();
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
    const selectedSite=getSelectedSite();
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

  return {
    protocolMailBody,
    protocolMailSubject
  };
}
