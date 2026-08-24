export function runAfterPaint(fn){
  requestAnimationFrame(()=>{
    try{ fn(); }catch(e){}
  });
}

export function runAfterTwoPaints(fn){
  requestAnimationFrame(()=>runAfterPaint(fn));
}

export function runWhenIdle(fn,timeout=1000){
  const run=()=>{
    Promise.resolve()
      .then(fn)
      .catch(e=>console.warn("Odložená úloha selhala",e));
  };
  if(typeof requestIdleCallback==="function"){
    requestIdleCallback(run,{timeout});
  }else{
    runAfterTwoPaints(run);
  }
}

export function szzYieldToBrowser(timeout=120){
  return new Promise(resolve=>{
    const done=()=>resolve();
    if(typeof requestIdleCallback==="function"){
      requestIdleCallback(done,{timeout});
    }else if(typeof requestAnimationFrame==="function"){
      requestAnimationFrame(()=>setTimeout(done,0));
    }else{
      setTimeout(done,0);
    }
  });
}
