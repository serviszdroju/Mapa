export function setTextIfChanged(el,text){
  if(el && el.textContent!==String(text)) el.textContent=String(text);
}

export function setDisplayIfChanged(el,value){
  if(el && el.style.display!==value) el.style.display=value;
}

export function setClassNameIfChanged(el,value){
  if(el && el.className!==value) el.className=value;
}

export function setDisabledIfChanged(el,value){
  if(el && el.disabled!==!!value) el.disabled=!!value;
}
