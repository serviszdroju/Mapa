export function createProtocolMailHelpers({
  currentUserEmail,
  getCurrentUser,
  getSelectedSite,
  normalizeTechnicianDisplayName,
  protocolDisplayDate,
  safe
}){
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

  function protocolMailSubject(protocol={}){
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

  return {
    promptProtocolMailRecipient,
    protocolMailBody,
    protocolMailErrorText,
    protocolMailSubject,
    protocolMailToastText,
    validProtocolMailRecipient
  };
}
