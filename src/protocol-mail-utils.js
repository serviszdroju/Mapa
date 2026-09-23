export function createProtocolMailHelpers({
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
    protocolMailErrorText,
    protocolMailToastText,
    validProtocolMailRecipient
  };
}
