let activeSilentAuthPromise=null;
let activeSilentAuthStartedAt=0;

export function runAndroidSilentAuthOnce(start,{reuseMs=12000,now=Date.now}={}){
  const measuredTime=Number(now());
  const currentTime=Number.isFinite(measuredTime) ? measuredTime : Date.now();
  if(activeSilentAuthPromise && currentTime-activeSilentAuthStartedAt<reuseMs){
    return activeSilentAuthPromise;
  }
  activeSilentAuthStartedAt=currentTime;
  activeSilentAuthPromise=Promise.resolve().then(start);
  return activeSilentAuthPromise;
}

export function resetAndroidSilentAuthCoordinator(){
  activeSilentAuthPromise=null;
  activeSilentAuthStartedAt=0;
}

export async function waitForExistingAuthUser(getUser,{
  timeoutMs=8000,
  pollMs=100,
  delay=ms=>new Promise(resolve=>setTimeout(resolve,ms)),
  now=Date.now
}={}){
  if(typeof getUser!=="function") return null;
  const measuredStart=Number(now());
  const started=Number.isFinite(measuredStart) ? measuredStart : Date.now();
  while(true){
    const user=getUser();
    if(user) return user;
    const measuredNow=Number(now());
    const currentTime=Number.isFinite(measuredNow) ? measuredNow : Date.now();
    const elapsed=currentTime-started;
    if(elapsed>=timeoutMs) return null;
    await delay(Math.min(pollMs,Math.max(0,timeoutMs-elapsed)));
  }
}
