window.__szzDeferredInstallPrompt=null;
window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  window.__szzDeferredInstallPrompt=event;
  window.dispatchEvent(new Event("szzinstallpromptready"));
});

const SZZ_LOGO_URL="./szz-logo-display.png";
const SZZ_APP_ICON_URL="./szz-app-icon-192.png";

function installSzzLogoAssets(){
  try{
    const logo=document.querySelector(".startup-card .logo-img");
    if(logo && !logo.dataset.logoFileApplied){
      logo.src=SZZ_LOGO_URL;
      logo.dataset.logoFileApplied="1";
    }
    document.querySelectorAll("[data-szz-logo-copy]").forEach(img=>{
      img.src=SZZ_LOGO_URL;
    });
    let icon=document.querySelector('link[rel="icon"]');
    if(!icon){
      icon=document.createElement("link");
      icon.rel="icon";
      document.head.appendChild(icon);
    }
    icon.type="image/png";
    icon.href=SZZ_APP_ICON_URL;
    let apple=document.querySelector('link[rel="apple-touch-icon"]');
    if(!apple){
      apple=document.createElement("link");
      apple.rel="apple-touch-icon";
      document.head.appendChild(apple);
    }
    apple.href=SZZ_APP_ICON_URL;
  }catch(e){}
}

window.installSzzLogoAssets=installSzzLogoAssets;
document.addEventListener("DOMContentLoaded",installSzzLogoAssets);
window.addEventListener("load",installSzzLogoAssets);

window.addEventListener("DOMContentLoaded",()=>{
  const startup=document.getElementById("startupLoginBtn");
  if(startup) startup.addEventListener("click",event=>{
    if(typeof window.startGoogleLogin==="function") window.startGoogleLogin(event);
  });
  const login=document.getElementById("loginBtn");
  if(login) login.addEventListener("click",event=>{
    if(typeof window.startGoogleLogin==="function") window.startGoogleLogin(event);
  });
});

let mobileFixMapTimer=0;
function runMobileFixMap(){
  try{
    if(window.map && window.map.invalidateSize){
      window.map.invalidateSize(true);
      if(typeof window.fit==="function"){
        window.fit();
      }
    }
  }catch(e){}
}

function mobileFixMap(){
  if(mobileFixMapTimer) cancelAnimationFrame(mobileFixMapTimer);
  mobileFixMapTimer=requestAnimationFrame(()=>{
    mobileFixMapTimer=0;
    runMobileFixMap();
  });
}

window.runMobileFixMap=runMobileFixMap;
window.mobileFixMap=mobileFixMap;
window.addEventListener("resize",mobileFixMap);
window.addEventListener("orientationchange",mobileFixMap);
window.addEventListener("pageshow",mobileFixMap);
