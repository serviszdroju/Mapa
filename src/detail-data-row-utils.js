export function createDetailDataRowHelpers({
  detailTableNode,
  isNoteUser
}){
  function addNewDataRowToTable(){
    const keyEl = document.getElementById("newDataKey");
    const valEl = document.getElementById("newDataValue");
    const table = detailTableNode();
    if(!keyEl || !valEl || !table) return;

    const key = keyEl.value.trim();
    const val = valEl.value.trim();

    if(!key){
      alert("Vyplň název nového údaje.");
      keyEl.focus();
      return;
    }
    if(!val){
      alert("Vyplň hodnotu nového údaje.");
      valEl.focus();
      return;
    }

    const row = document.createElement("tr");
    row.className = isNoteUser(key) ? "notes-red-row" : "";
    const keyCell=document.createElement("td");
    keyCell.textContent=key;
    const valueCell=document.createElement("td");
    const input=document.createElement("input");
    input.dataset.key=key;
    input.value=val;
    valueCell.appendChild(input);
    row.append(keyCell,valueCell);

    if(isNoteUser(key)){
      table.appendChild(row);
    }else{
      const firstNote = table.querySelector(".notes-red-row");
      if(firstNote) table.insertBefore(row, firstNote);
      else table.appendChild(row);
    }

    keyEl.value = "";
    valEl.value = "";
    keyEl.focus();
  }

  return {
    addNewDataRowToTable
  };
}
