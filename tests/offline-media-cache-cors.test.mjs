import assert from "node:assert/strict";
import test from "node:test";

import {createOfflinePrefetchItemHelpers} from "../src/offline-prefetch-item-utils.js";

test("cross-origin offline photos use cacheable CORS responses",async()=>{
  const originalWindow=globalThis.window;
  const originalLocation=globalThis.location;
  const originalRequest=globalThis.Request;
  const originalFetch=globalThis.fetch;
  const originalCaches=globalThis.caches;
  const requests=[];
  const stored=[];

  globalThis.window={caches:{}};
  globalThis.location={href:"https://serviszdroju.github.io/Mapa/",origin:"https://serviszdroju.github.io"};
  globalThis.Request=class RequestStub{
    constructor(url,options){this.url=url;this.options=options;requests.push(this);}
  };
  globalThis.fetch=async request=>({ok:true,type:"cors",clone(){return this;},request});
  globalThis.caches={
    async open(){
      return {
        async match(){return null;},
        async put(request,response){stored.push({request,response});}
      };
    }
  };

  try{
    const {cacheOfflineMediaUrls}=createOfflinePrefetchItemHelpers({mediaFetchConcurrency:1});
    const count=await cacheOfflineMediaUrls(["https://res.cloudinary.com/demo/image/upload/sample.jpg"]);
    assert.equal(count,1);
    assert.equal(requests[0].options.mode,"cors");
    assert.equal(requests[0].options.credentials,"omit");
    assert.equal(stored.length,1);
  }finally{
    globalThis.window=originalWindow;
    globalThis.location=originalLocation;
    globalThis.Request=originalRequest;
    globalThis.fetch=originalFetch;
    globalThis.caches=originalCaches;
  }
});
