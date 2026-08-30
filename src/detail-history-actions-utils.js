export function createDetailHistoryActionsHelpers({
  deleteCurrentHistoryProtocol,
  editCurrentHistoryProtocol,
  exportProtocolToWord,
  getCurrentHistoryItem,
  getHistoryIndex,
  openTechnicianSignatureDialog,
  promptProtocolMailRecipient,
  protocolMailErrorText,
  protocolMailToastText,
  renderHistory,
  sendProtocolByMail,
  setDetailHistoryProtocolHandoff,
  setHistoryIndex,
  setProtocolStatusText,
  showSaveConfirmation
}){
  function bindDetailHistoryActions(history){
    if(!history || history.__szzHistoryActionClickBound) return;
    history.__szzHistoryActionClickBound=true;
    history.addEventListener("click",async event=>{
      const button=event.target.closest && event.target.closest("button");
      if(!button || !history.contains(button)) return;
      const id=button.id || "";
      if(id==="historyPrevBtn"){
        setHistoryIndex(getHistoryIndex()-1);
        renderHistory();
        return;
      }
      if(id==="historyNextBtn"){
        setHistoryIndex(getHistoryIndex()+1);
        renderHistory();
        return;
      }
      if(id==="deleteHistoryProtocolBtn"){
        await deleteCurrentHistoryProtocol();
        return;
      }
      if(id==="editHistoryProtocolBtn"){
        editCurrentHistoryProtocol();
        return;
      }
      if(id==="exportHistoryProtocolBtn"){
        exportProtocolToWord(getCurrentHistoryItem());
        return;
      }
      if(id==="mailHistoryProtocolBtn"){
        const recipient=promptProtocolMailRecipient(getCurrentHistoryItem());
        if(!recipient) return;
        button.disabled=true;
        try{
          await sendProtocolByMail(getCurrentHistoryItem(),recipient);
        }catch(e){
          const message=protocolMailErrorText(e);
          setProtocolStatusText(`Chyba odeslání e-mailu: ${message}`);
          showSaveConfirmation(`E-mail: ${protocolMailToastText(e)}`);
        }finally{
          button.disabled=false;
        }
      }
      if(id==="technicianSignatureBtn"){
        await openTechnicianSignatureDialog();
      }
    });
    history.addEventListener("change",async event=>{
      const input=event.target && event.target.closest ? event.target.closest("#historyHandoffProtocolCheck") : null;
      if(!input || !history.contains(input)) return;
      const item=getCurrentHistoryItem();
      const label=input.closest(".history-handoff-processing");
      if(label) label.classList.toggle("is-checked",input.checked);
      input.disabled=true;
      try{
        await setDetailHistoryProtocolHandoff(item,input.checked);
        showSaveConfirmation(input.checked ? "Protokol předán ke zpracování." : "Předání protokolu zrušeno.");
        renderHistory();
      }catch(e){
        input.checked=!input.checked;
        if(label) label.classList.toggle("is-checked",input.checked);
        setProtocolStatusText(`Chyba uložení předání: ${e.message}`);
        showSaveConfirmation("Předání se nepodařilo uložit.");
      }finally{
        input.disabled=false;
      }
    });
  }

  return { bindDetailHistoryActions };
}
