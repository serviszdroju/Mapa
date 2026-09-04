var Ml={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wd=function(r){const e=[];let t=0;for(let n=0;n<r.length;n++){let i=r.charCodeAt(n);i<128?e[t++]=i:i<2048?(e[t++]=i>>6|192,e[t++]=i&63|128):(i&64512)===55296&&n+1<r.length&&(r.charCodeAt(n+1)&64512)===56320?(i=65536+((i&1023)<<10)+(r.charCodeAt(++n)&1023),e[t++]=i>>18|240,e[t++]=i>>12&63|128,e[t++]=i>>6&63|128,e[t++]=i&63|128):(e[t++]=i>>12|224,e[t++]=i>>6&63|128,e[t++]=i&63|128)}return e},h_=function(r){const e=[];let t=0,n=0;for(;t<r.length;){const i=r[t++];if(i<128)e[n++]=String.fromCharCode(i);else if(i>191&&i<224){const s=r[t++];e[n++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=r[t++],o=r[t++],c=r[t++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|c&63)-65536;e[n++]=String.fromCharCode(55296+(u>>10)),e[n++]=String.fromCharCode(56320+(u&1023))}else{const s=r[t++],o=r[t++];e[n++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},Ad={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(r,e){if(!Array.isArray(r))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,n=[];for(let i=0;i<r.length;i+=3){const s=r[i],o=i+1<r.length,c=o?r[i+1]:0,u=i+2<r.length,h=u?r[i+2]:0,f=s>>2,p=(s&3)<<4|c>>4;let _=(c&15)<<2|h>>6,R=h&63;u||(R=64,o||(_=64)),n.push(t[f],t[p],t[_],t[R])}return n.join("")},encodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(r):this.encodeByteArray(wd(r),e)},decodeString(r,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(r):h_(this.decodeStringToByteArray(r,e))},decodeStringToByteArray(r,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,n=[];for(let i=0;i<r.length;){const s=t[r.charAt(i++)],c=i<r.length?t[r.charAt(i)]:0;++i;const h=i<r.length?t[r.charAt(i)]:64;++i;const p=i<r.length?t[r.charAt(i)]:64;if(++i,s==null||c==null||h==null||p==null)throw new d_;const _=s<<2|c>>4;if(n.push(_),h!==64){const R=c<<4&240|h>>2;if(n.push(R),p!==64){const D=h<<6&192|p;n.push(D)}}}return n},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let r=0;r<this.ENCODED_VALS.length;r++)this.byteToCharMap_[r]=this.ENCODED_VALS.charAt(r),this.charToByteMap_[this.byteToCharMap_[r]]=r,this.byteToCharMapWebSafe_[r]=this.ENCODED_VALS_WEBSAFE.charAt(r),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[r]]=r,r>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(r)]=r,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(r)]=r)}}};class d_ extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const f_=function(r){const e=wd(r);return Ad.encodeByteArray(e,!0)},Xs=function(r){return f_(r).replace(/\./g,"")},Rd=function(r){try{return Ad.decodeString(r,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p_(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m_=()=>p_().__FIREBASE_DEFAULTS__,g_=()=>{if(typeof process>"u"||typeof Ml>"u")return;const r=Ml.__FIREBASE_DEFAULTS__;if(r)return JSON.parse(r)},__=()=>{if(typeof document>"u")return;let r;try{r=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=r&&Rd(r[1]);return e&&JSON.parse(e)},Eo=()=>{try{return m_()||g_()||__()}catch(r){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${r}`);return}},bd=r=>{var e,t;return(t=(e=Eo())===null||e===void 0?void 0:e.emulatorHosts)===null||t===void 0?void 0:t[r]},Sd=r=>{const e=bd(r);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const n=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),n]:[e.substring(0,t),n]},Pd=()=>{var r;return(r=Eo())===null||r===void 0?void 0:r.config},Cd=r=>{var e;return(e=Eo())===null||e===void 0?void 0:e[`_${r}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y_{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,n))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function I_(r,e){if(r.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},n=e||"demo-project",i=r.iat||0,s=r.sub||r.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},r);return[Xs(JSON.stringify(t)),Xs(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function E_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Re())}function T_(){var r;const e=(r=Eo())===null||r===void 0?void 0:r.forceEnvironment;if(e==="node")return!0;if(e==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function v_(){return typeof window<"u"||Dd()}function Dd(){return typeof WorkerGlobalScope<"u"&&typeof self<"u"&&self instanceof WorkerGlobalScope}function w_(){const r=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof r=="object"&&r.id!==void 0}function A_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function R_(){const r=Re();return r.indexOf("MSIE ")>=0||r.indexOf("Trident/")>=0}function kd(){return!T_()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function Nd(){try{return typeof indexedDB=="object"}catch{return!1}}function b_(){return new Promise((r,e)=>{try{let t=!0;const n="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(n);i.onsuccess=()=>{i.result.close(),t||self.indexedDB.deleteDatabase(n),r(!0)},i.onupgradeneeded=()=>{t=!1},i.onerror=()=>{var s;e(((s=i.error)===null||s===void 0?void 0:s.message)||"")}}catch(t){e(t)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S_="FirebaseError";class it extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name=S_,Object.setPrototypeOf(this,it.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Wi.prototype.create)}}class Wi{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?P_(s,n):"Error",c=`${this.serviceName}: ${o} (${i}).`;return new it(i,c,n)}}function P_(r,e){return r.replace(C_,(t,n)=>{const i=e[n];return i!=null?String(i):`<${n}?>`})}const C_=/\{\$([^}]+)}/g;function D_(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}function Ht(r,e){if(r===e)return!0;const t=Object.keys(r),n=Object.keys(e);for(const i of t){if(!n.includes(i))return!1;const s=r[i],o=e[i];if(Fl(s)&&Fl(o)){if(!Ht(s,o))return!1}else if(s!==o)return!1}for(const i of n)if(!t.includes(i))return!1;return!0}function Fl(r){return r!==null&&typeof r=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pr(r){const e=[];for(const[t,n]of Object.entries(r))Array.isArray(n)?n.forEach(i=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(n));return e.length?"&"+e.join("&"):""}function mi(r){const e={};return r.replace(/^\?/,"").split("&").forEach(n=>{if(n){const[i,s]=n.split("=");e[decodeURIComponent(i)]=decodeURIComponent(s)}}),e}function gi(r){const e=r.indexOf("?");if(!e)return"";const t=r.indexOf("#",e);return r.substring(e,t>0?t:void 0)}function k_(r,e){const t=new N_(r,e);return t.subscribe.bind(t)}class N_{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(n=>{this.error(n)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,n){let i;if(e===void 0&&t===void 0&&n===void 0)throw new Error("Missing Observer.");V_(e,["next","error","complete"])?i=e:i={next:e,error:t,complete:n},i.next===void 0&&(i.next=Aa),i.error===void 0&&(i.error=Aa),i.complete===void 0&&(i.complete=Aa);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(n){typeof console<"u"&&console.error&&console.error(n)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function V_(r,e){if(typeof r!="object"||r===null)return!1;for(const t of e)if(t in r&&typeof r[t]=="function")return!0;return!1}function Aa(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(r){return r&&r._delegate?r._delegate:r}class Qt{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const In="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O_{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const n=new y_;if(this.instancesDeferred.set(t,n),this.isInitialized(t)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:t});i&&n.resolve(i)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(e?.identifier),i=(t=e?.optional)!==null&&t!==void 0?t:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(i)return null;throw s}else{if(i)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(L_(e))try{this.getOrInitializeService({instanceIdentifier:In})}catch{}for(const[t,n]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(t);try{const s=this.getOrInitializeService({instanceIdentifier:i});n.resolve(s)}catch{}}}}clearInstance(e=In){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=In){return this.instances.has(e)}getOptions(e=In){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(s);n===c&&o.resolve(i)}return i}onInit(e,t){var n;const i=this.normalizeInstanceIdentifier(t),s=(n=this.onInitCallbacks.get(i))!==null&&n!==void 0?n:new Set;s.add(e),this.onInitCallbacks.set(i,s);const o=this.instances.get(i);return o&&e(o,i),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const i of n)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:x_(e),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch{}return n||null}normalizeInstanceIdentifier(e=In){return this.component?this.component.multipleInstances?e:In:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function x_(r){return r===In?void 0:r}function L_(r){return r.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vd{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new O_(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mc=[];var J;(function(r){r[r.DEBUG=0]="DEBUG",r[r.VERBOSE=1]="VERBOSE",r[r.INFO=2]="INFO",r[r.WARN=3]="WARN",r[r.ERROR=4]="ERROR",r[r.SILENT=5]="SILENT"})(J||(J={}));const Od={debug:J.DEBUG,verbose:J.VERBOSE,info:J.INFO,warn:J.WARN,error:J.ERROR,silent:J.SILENT},M_=J.INFO,F_={[J.DEBUG]:"log",[J.VERBOSE]:"log",[J.INFO]:"info",[J.WARN]:"warn",[J.ERROR]:"error"},U_=(r,e,...t)=>{if(e<r.logLevel)return;const n=new Date().toISOString(),i=F_[e];if(i)console[i](`[${n}]  ${r.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class gc{constructor(e){this.name=e,this._logLevel=M_,this._logHandler=U_,this._userLogHandler=null,mc.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in J))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Od[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,J.DEBUG,...e),this._logHandler(this,J.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,J.VERBOSE,...e),this._logHandler(this,J.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,J.INFO,...e),this._logHandler(this,J.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,J.WARN,...e),this._logHandler(this,J.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,J.ERROR,...e),this._logHandler(this,J.ERROR,...e)}}function B_(r){mc.forEach(e=>{e.setLogLevel(r)})}function q_(r,e){for(const t of mc){let n=null;e&&e.level&&(n=Od[e.level]),r===null?t.userLogHandler=null:t.userLogHandler=(i,s,...o)=>{const c=o.map(u=>{if(u==null)return null;if(typeof u=="string")return u;if(typeof u=="number"||typeof u=="boolean")return u.toString();if(u instanceof Error)return u.message;try{return JSON.stringify(u)}catch{return null}}).filter(u=>u).join(" ");s>=(n??i.logLevel)&&r({level:J[s].toLowerCase(),message:c,args:o,type:i.name})}}}const z_=(r,e)=>e.some(t=>r instanceof t);let Ul,Bl;function G_(){return Ul||(Ul=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function j_(){return Bl||(Bl=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const xd=new WeakMap,Fa=new WeakMap,Ld=new WeakMap,Ra=new WeakMap,_c=new WeakMap;function $_(r){const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("success",s),r.removeEventListener("error",o)},s=()=>{t(Kt(r.result)),i()},o=()=>{n(r.error),i()};r.addEventListener("success",s),r.addEventListener("error",o)});return e.then(t=>{t instanceof IDBCursor&&xd.set(t,r)}).catch(()=>{}),_c.set(e,r),e}function K_(r){if(Fa.has(r))return;const e=new Promise((t,n)=>{const i=()=>{r.removeEventListener("complete",s),r.removeEventListener("error",o),r.removeEventListener("abort",o)},s=()=>{t(),i()},o=()=>{n(r.error||new DOMException("AbortError","AbortError")),i()};r.addEventListener("complete",s),r.addEventListener("error",o),r.addEventListener("abort",o)});Fa.set(r,e)}let Ua={get(r,e,t){if(r instanceof IDBTransaction){if(e==="done")return Fa.get(r);if(e==="objectStoreNames")return r.objectStoreNames||Ld.get(r);if(e==="store")return t.objectStoreNames[1]?void 0:t.objectStore(t.objectStoreNames[0])}return Kt(r[e])},set(r,e,t){return r[e]=t,!0},has(r,e){return r instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in r}};function W_(r){Ua=r(Ua)}function H_(r){return r===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...t){const n=r.call(ba(this),e,...t);return Ld.set(n,e.sort?e.sort():[e]),Kt(n)}:j_().includes(r)?function(...e){return r.apply(ba(this),e),Kt(xd.get(this))}:function(...e){return Kt(r.apply(ba(this),e))}}function Q_(r){return typeof r=="function"?H_(r):(r instanceof IDBTransaction&&K_(r),z_(r,G_())?new Proxy(r,Ua):r)}function Kt(r){if(r instanceof IDBRequest)return $_(r);if(Ra.has(r))return Ra.get(r);const e=Q_(r);return e!==r&&(Ra.set(r,e),_c.set(e,r)),e}const ba=r=>_c.get(r);function J_(r,e,{blocked:t,upgrade:n,blocking:i,terminated:s}={}){const o=indexedDB.open(r,e),c=Kt(o);return n&&o.addEventListener("upgradeneeded",u=>{n(Kt(o.result),u.oldVersion,u.newVersion,Kt(o.transaction),u)}),t&&o.addEventListener("blocked",u=>t(u.oldVersion,u.newVersion,u)),c.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),c}const Y_=["get","getKey","getAll","getAllKeys","count"],X_=["put","add","delete","clear"],Sa=new Map;function ql(r,e){if(!(r instanceof IDBDatabase&&!(e in r)&&typeof e=="string"))return;if(Sa.get(e))return Sa.get(e);const t=e.replace(/FromIndex$/,""),n=e!==t,i=X_.includes(t);if(!(t in(n?IDBIndex:IDBObjectStore).prototype)||!(i||Y_.includes(t)))return;const s=async function(o,...c){const u=this.transaction(o,i?"readwrite":"readonly");let h=u.store;return n&&(h=h.index(c.shift())),(await Promise.all([h[t](...c),i&&u.done]))[0]};return Sa.set(e,s),s}W_(r=>({...r,get:(e,t,n)=>ql(e,t)||r.get(e,t,n),has:(e,t)=>!!ql(e,t)||r.has(e,t)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Z_{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(ey(t)){const n=t.getImmediate();return`${n.library}/${n.version}`}else return null}).filter(t=>t).join(" ")}}function ey(r){const e=r.getComponent();return e?.type==="VERSION"}const Zs="@firebase/app",Ba="0.10.8";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn=new gc("@firebase/app"),ty="@firebase/app-compat",ny="@firebase/analytics-compat",ry="@firebase/analytics",iy="@firebase/app-check-compat",sy="@firebase/app-check",oy="@firebase/auth",ay="@firebase/auth-compat",cy="@firebase/database",uy="@firebase/database-compat",ly="@firebase/functions",hy="@firebase/functions-compat",dy="@firebase/installations",fy="@firebase/installations-compat",py="@firebase/messaging",my="@firebase/messaging-compat",gy="@firebase/performance",_y="@firebase/performance-compat",yy="@firebase/remote-config",Iy="@firebase/remote-config-compat",Ey="@firebase/storage",Ty="@firebase/storage-compat",vy="@firebase/firestore",wy="@firebase/vertexai-preview",Ay="@firebase/firestore-compat",Ry="firebase",by="10.12.5";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Di="[DEFAULT]",Sy={[Zs]:"fire-core",[ty]:"fire-core-compat",[ry]:"fire-analytics",[ny]:"fire-analytics-compat",[sy]:"fire-app-check",[iy]:"fire-app-check-compat",[oy]:"fire-auth",[ay]:"fire-auth-compat",[cy]:"fire-rtdb",[uy]:"fire-rtdb-compat",[ly]:"fire-fn",[hy]:"fire-fn-compat",[dy]:"fire-iid",[fy]:"fire-iid-compat",[py]:"fire-fcm",[my]:"fire-fcm-compat",[gy]:"fire-perf",[_y]:"fire-perf-compat",[yy]:"fire-rc",[Iy]:"fire-rc-compat",[Ey]:"fire-gcs",[Ty]:"fire-gcs-compat",[vy]:"fire-fst",[Ay]:"fire-fst-compat",[wy]:"fire-vertex","fire-js":"fire-js",[Ry]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Jt=new Map,ur=new Map,lr=new Map;function qa(r,e){try{r.container.addComponent(e)}catch(t){Cn.debug(`Component ${e.name} failed to register with FirebaseApp ${r.name}`,t)}}function Py(r,e){r.container.addOrOverwriteComponent(e)}function Yt(r){const e=r.name;if(lr.has(e))return Cn.debug(`There were multiple attempts to register component ${e}.`),!1;lr.set(e,r);for(const t of Jt.values())qa(t,r);for(const t of ur.values())qa(t,r);return!0}function Un(r,e){const t=r.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),r.container.getProvider(e)}function Md(r,e,t=Di){Un(r,e).clearInstance(t)}function Fd(r){return r.options!==void 0}function ye(r){return r.settings!==void 0}function Cy(){lr.clear()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dy={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Ze=new Wi("app","Firebase",Dy);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new Qt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Ze.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ky extends Ud{constructor(e,t,n,i){const s=t.automaticDataCollectionEnabled!==void 0?t.automaticDataCollectionEnabled:!1,o={name:n,automaticDataCollectionEnabled:s};if(e.apiKey!==void 0)super(e,o,i);else{const c=e;super(c.options,o,i)}this._serverConfig=Object.assign({automaticDataCollectionEnabled:s},t),this._finalizationRegistry=null,typeof FinalizationRegistry<"u"&&(this._finalizationRegistry=new FinalizationRegistry(()=>{this.automaticCleanup()})),this._refCount=0,this.incRefCount(this._serverConfig.releaseOnDeref),this._serverConfig.releaseOnDeref=void 0,t.releaseOnDeref=void 0,et(Zs,Ba,"serverapp")}toJSON(){}get refCount(){return this._refCount}incRefCount(e){this.isDeleted||(this._refCount++,e!==void 0&&this._finalizationRegistry!==null&&this._finalizationRegistry.register(e,this))}decRefCount(){return this.isDeleted?0:--this._refCount}automaticCleanup(){qd(this)}get settings(){return this.checkDestroyed(),this._serverConfig}checkDestroyed(){if(this.isDeleted)throw Ze.create("server-app-deleted")}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bn=by;function Bd(r,e={}){let t=r;typeof e!="object"&&(e={name:e});const n=Object.assign({name:Di,automaticDataCollectionEnabled:!1},e),i=n.name;if(typeof i!="string"||!i)throw Ze.create("bad-app-name",{appName:String(i)});if(t||(t=Pd()),!t)throw Ze.create("no-options");const s=Jt.get(i);if(s){if(Ht(t,s.options)&&Ht(n,s.config))return s;throw Ze.create("duplicate-app",{appName:i})}const o=new Vd(i);for(const u of lr.values())o.addComponent(u);const c=new Ud(t,n,o);return Jt.set(i,c),c}function Ny(r,e){if(v_()&&!Dd())throw Ze.create("invalid-server-app-environment");e.automaticDataCollectionEnabled===void 0&&(e.automaticDataCollectionEnabled=!1);let t;Fd(r)?t=r.options:t=r;const n=Object.assign(Object.assign({},e),t);n.releaseOnDeref!==void 0&&delete n.releaseOnDeref;const i=h=>[...h].reduce((f,p)=>Math.imul(31,f)+p.charCodeAt(0)|0,0);if(e.releaseOnDeref!==void 0&&typeof FinalizationRegistry>"u")throw Ze.create("finalization-registry-not-supported",{});const s=""+i(JSON.stringify(n)),o=ur.get(s);if(o)return o.incRefCount(e.releaseOnDeref),o;const c=new Vd(s);for(const h of lr.values())c.addComponent(h);const u=new ky(t,e,s,c);return ur.set(s,u),u}function To(r=Di){const e=Jt.get(r);if(!e&&r===Di&&Pd())return Bd();if(!e)throw Ze.create("no-app",{appName:r});return e}function Vy(){return Array.from(Jt.values())}async function qd(r){let e=!1;const t=r.name;Jt.has(t)?(e=!0,Jt.delete(t)):ur.has(t)&&r.decRefCount()<=0&&(ur.delete(t),e=!0),e&&(await Promise.all(r.container.getProviders().map(n=>n.delete())),r.isDeleted=!0)}function et(r,e,t){var n;let i=(n=Sy[r])!==null&&n!==void 0?n:r;t&&(i+=`-${t}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const c=[`Unable to register library "${i}" with version "${e}":`];s&&c.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&c.push("and"),o&&c.push(`version name "${e}" contains illegal characters (whitespace or "/")`),Cn.warn(c.join(" "));return}Yt(new Qt(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}function Oy(r,e){if(r!==null&&typeof r!="function")throw Ze.create("invalid-log-argument");q_(r,e)}function xy(r){B_(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ly="firebase-heartbeat-database",My=1,ki="firebase-heartbeat-store";let Pa=null;function zd(){return Pa||(Pa=J_(Ly,My,{upgrade:(r,e)=>{switch(e){case 0:try{r.createObjectStore(ki)}catch(t){console.warn(t)}}}}).catch(r=>{throw Ze.create("idb-open",{originalErrorMessage:r.message})})),Pa}async function Fy(r){try{const t=(await zd()).transaction(ki),n=await t.objectStore(ki).get(Gd(r));return await t.done,n}catch(e){if(e instanceof it)Cn.warn(e.message);else{const t=Ze.create("idb-get",{originalErrorMessage:e?.message});Cn.warn(t.message)}}}async function zl(r,e){try{const n=(await zd()).transaction(ki,"readwrite");await n.objectStore(ki).put(e,Gd(r)),await n.done}catch(t){if(t instanceof it)Cn.warn(t.message);else{const n=Ze.create("idb-set",{originalErrorMessage:t?.message});Cn.warn(n.message)}}}function Gd(r){return`${r.name}!${r.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uy=1024,By=720*60*60*1e3;class qy{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Gy(t),this._heartbeatsCachePromise=this._storage.read().then(n=>(this._heartbeatsCache=n,n))}async triggerHeartbeat(){var e,t;const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=Gl();if(!(((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)===null||t===void 0?void 0:t.heartbeats)==null))&&!(this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s)))return this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(o=>{const c=new Date(o.date).valueOf();return Date.now()-c<=By}),this._storage.overwrite(this._heartbeatsCache)}async getHeartbeatsHeader(){var e;if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=Gl(),{heartbeatsToSend:n,unsentEntries:i}=zy(this._heartbeatsCache.heartbeats),s=Xs(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}}function Gl(){return new Date().toISOString().substring(0,10)}function zy(r,e=Uy){const t=[];let n=r.slice();for(const i of r){const s=t.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),jl(t)>e){s.dates.pop();break}}else if(t.push({agent:i.agent,dates:[i.date]}),jl(t)>e){t.pop();break}n=n.slice(1)}return{heartbeatsToSend:t,unsentEntries:n}}class Gy{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Nd()?b_().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await Fy(this.app);return t?.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return zl(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var t;if(await this._canUseIndexedDBPromise){const i=await this.read();return zl(this.app,{lastSentHeartbeatDate:(t=e.lastSentHeartbeatDate)!==null&&t!==void 0?t:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function jl(r){return Xs(JSON.stringify({version:2,heartbeats:r})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jy(r){Yt(new Qt("platform-logger",e=>new Z_(e),"PRIVATE")),Yt(new Qt("heartbeat",e=>new qy(e),"PRIVATE")),et(Zs,Ba,r),et(Zs,Ba,"esm2017"),et("fire-js","")}jy("");var $y="firebase",Ky="10.12.5";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */et($y,Ky,"app");const SS=Object.freeze(Object.defineProperty({__proto__:null,FirebaseError:it,SDK_VERSION:Bn,_DEFAULT_ENTRY_NAME:Di,_addComponent:qa,_addOrOverwriteComponent:Py,_apps:Jt,_clearComponents:Cy,_components:lr,_getProvider:Un,_isFirebaseApp:Fd,_isFirebaseServerApp:ye,_registerComponent:Yt,_removeServiceInstance:Md,_serverApps:ur,deleteApp:qd,getApp:To,getApps:Vy,initializeApp:Bd,initializeServerApp:Ny,onLog:Oy,registerVersion:et,setLogLevel:xy},Symbol.toStringTag,{value:"Module"}));function yc(r,e){var t={};for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&e.indexOf(n)<0&&(t[n]=r[n]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,n=Object.getOwnPropertySymbols(r);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(r,n[i])&&(t[n[i]]=r[n[i]]);return t}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wy={PHONE:"phone",TOTP:"totp"},Hy={FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PASSWORD:"password",PHONE:"phone",TWITTER:"twitter.com"},Qy={EMAIL_LINK:"emailLink",EMAIL_PASSWORD:"password",FACEBOOK:"facebook.com",GITHUB:"github.com",GOOGLE:"google.com",PHONE:"phone",TWITTER:"twitter.com"},Jy={LINK:"link",REAUTHENTICATE:"reauthenticate",SIGN_IN:"signIn"},Yy={EMAIL_SIGNIN:"EMAIL_SIGNIN",PASSWORD_RESET:"PASSWORD_RESET",RECOVER_EMAIL:"RECOVER_EMAIL",REVERT_SECOND_FACTOR_ADDITION:"REVERT_SECOND_FACTOR_ADDITION",VERIFY_AND_CHANGE_EMAIL:"VERIFY_AND_CHANGE_EMAIL",VERIFY_EMAIL:"VERIFY_EMAIL"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xy(){return{"admin-restricted-operation":"This operation is restricted to administrators only.","argument-error":"","app-not-authorized":"This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.","app-not-installed":"The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.","captcha-check-failed":"The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.","code-expired":"The SMS code has expired. Please re-send the verification code to try again.","cordova-not-ready":"Cordova framework is not ready.","cors-unsupported":"This browser is not supported.","credential-already-in-use":"This credential is already associated with a different user account.","custom-token-mismatch":"The custom token corresponds to a different audience.","requires-recent-login":"This operation is sensitive and requires recent authentication. Log in again before retrying this request.","dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK.","dynamic-link-not-activated":"Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.","email-change-needs-verification":"Multi-factor users must always have a verified email.","email-already-in-use":"The email address is already in use by another account.","emulator-config-failed":'Auth instance has already been used to make a network call. Auth can no longer be configured to use the emulator. Try calling "connectAuthEmulator()" sooner.',"expired-action-code":"The action code has expired.","cancelled-popup-request":"This operation has been cancelled due to another conflicting popup being opened.","internal-error":"An internal AuthError has occurred.","invalid-app-credential":"The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.","invalid-app-id":"The mobile app identifier is not registered for the current project.","invalid-user-token":"This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.","invalid-auth-event":"An internal AuthError has occurred.","invalid-verification-code":"The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user.","invalid-continue-uri":"The continue URL provided in the request is invalid.","invalid-cordova-configuration":"The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.","invalid-custom-token":"The custom token format is incorrect. Please check the documentation.","invalid-dynamic-link-domain":"The provided dynamic link domain is not configured or authorized for the current project.","invalid-email":"The email address is badly formatted.","invalid-emulator-scheme":"Emulator URL must start with a valid scheme (http:// or https://).","invalid-api-key":"Your API key is invalid, please check you have copied it correctly.","invalid-cert-hash":"The SHA-1 certificate hash provided is invalid.","invalid-credential":"The supplied auth credential is incorrect, malformed or has expired.","invalid-message-payload":"The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-multi-factor-session":"The request does not contain a valid proof of first factor successful sign-in.","invalid-oauth-provider":"EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.","invalid-oauth-client-id":"The OAuth client ID provided is either invalid or does not match the specified API key.","unauthorized-domain":"This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.","invalid-action-code":"The action code is invalid. This can happen if the code is malformed, expired, or has already been used.","wrong-password":"The password is invalid or the user does not have a password.","invalid-persistence-type":"The specified persistence type is invalid. It can only be local, session or none.","invalid-phone-number":"The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].","invalid-provider-id":"The specified provider ID is invalid.","invalid-recipient-email":"The email corresponding to this action failed to send as the provided recipient email address is invalid.","invalid-sender":"The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.","invalid-verification-id":"The verification ID used to create the phone auth credential is invalid.","invalid-tenant-id":"The Auth instance's tenant ID is invalid.","login-blocked":"Login blocked by user-provided method: {$originalMessage}","missing-android-pkg-name":"An Android Package Name must be provided if the Android App is required to be installed.","auth-domain-config-required":"Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.","missing-app-credential":"The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.","missing-verification-code":"The phone auth credential was created with an empty SMS verification code.","missing-continue-uri":"A continue URL must be provided in the request.","missing-iframe-start":"An internal AuthError has occurred.","missing-ios-bundle-id":"An iOS Bundle ID must be provided if an App Store ID is provided.","missing-or-invalid-nonce":"The request does not contain a valid nonce. This can occur if the SHA-256 hash of the provided raw nonce does not match the hashed nonce in the ID token payload.","missing-password":"A non-empty password must be provided","missing-multi-factor-info":"No second factor identifier is provided.","missing-multi-factor-session":"The request is missing proof of first factor successful sign-in.","missing-phone-number":"To send verification codes, provide a phone number for the recipient.","missing-verification-id":"The phone auth credential was created with an empty verification ID.","app-deleted":"This instance of FirebaseApp has been deleted.","multi-factor-info-not-found":"The user does not have a second factor matching the identifier provided.","multi-factor-auth-required":"Proof of ownership of a second factor is required to complete sign-in.","account-exists-with-different-credential":"An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.","network-request-failed":"A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred.","no-auth-event":"An internal AuthError has occurred.","no-such-provider":"User was not linked to an account with the given provider.","null-user":"A null user object was provided as the argument for an operation which requires a non-null user object.","operation-not-allowed":"The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.","operation-not-supported-in-this-environment":'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',"popup-blocked":"Unable to establish a connection with the popup. It may have been blocked by the browser.","popup-closed-by-user":"The popup has been closed by the user before finalizing the operation.","provider-already-linked":"User can only be linked to one identity for the given provider.","quota-exceeded":"The project's quota for this operation has been exceeded.","redirect-cancelled-by-user":"The redirect operation has been cancelled by the user before finalizing.","redirect-operation-pending":"A redirect sign-in operation is already pending.","rejected-credential":"The request contains malformed or mismatching credentials.","second-factor-already-in-use":"The second factor is already enrolled on this account.","maximum-second-factor-count-exceeded":"The maximum allowed number of second factors on a user has been exceeded.","tenant-id-mismatch":"The provided tenant ID does not match the Auth instance's tenant ID",timeout:"The operation has timed out.","user-token-expired":"The user's credential is no longer valid. The user must sign in again.","too-many-requests":"We have blocked all requests from this device due to unusual activity. Try again later.","unauthorized-continue-uri":"The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.","unsupported-first-factor":"Enrolling a second factor or signing in with a multi-factor account requires sign-in with a supported first factor.","unsupported-persistence-type":"The current environment does not support the specified persistence type.","unsupported-tenant-operation":"This operation is not supported in a multi-tenant context.","unverified-email":"The operation requires a verified email.","user-cancelled":"The user did not grant your application the permissions it requested.","user-not-found":"There is no user record corresponding to this identifier. The user may have been deleted.","user-disabled":"The user account has been disabled by an administrator.","user-mismatch":"The supplied credentials do not correspond to the previously signed in user.","user-signed-out":"","weak-password":"The password must be 6 characters long or more.","web-storage-unsupported":"This browser is not supported or 3rd party cookies and data may be disabled.","already-initialized":"initializeAuth() has already been called with different options. To avoid this error, call initializeAuth() with the same options as when it was originally called, or call getAuth() to return the already initialized instance.","missing-recaptcha-token":"The reCAPTCHA token is missing when sending request to the backend.","invalid-recaptcha-token":"The reCAPTCHA token is invalid when sending request to the backend.","invalid-recaptcha-action":"The reCAPTCHA action is invalid when sending request to the backend.","recaptcha-not-enabled":"reCAPTCHA Enterprise integration is not enabled for this project.","missing-client-type":"The reCAPTCHA client type is missing when sending request to the backend.","missing-recaptcha-version":"The reCAPTCHA version is missing when sending request to the backend.","invalid-req-type":"Invalid request parameters.","invalid-recaptcha-version":"The reCAPTCHA version is invalid when sending request to the backend.","unsupported-password-policy-schema-version":"The password policy received from the backend uses a schema version that is not supported by this version of the Firebase SDK.","password-does-not-meet-requirements":"The password does not meet the requirements."}}function jd(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const Zy=Xy,$d=jd,Kd=new Wi("auth","Firebase",jd()),eI={ADMIN_ONLY_OPERATION:"auth/admin-restricted-operation",ARGUMENT_ERROR:"auth/argument-error",APP_NOT_AUTHORIZED:"auth/app-not-authorized",APP_NOT_INSTALLED:"auth/app-not-installed",CAPTCHA_CHECK_FAILED:"auth/captcha-check-failed",CODE_EXPIRED:"auth/code-expired",CORDOVA_NOT_READY:"auth/cordova-not-ready",CORS_UNSUPPORTED:"auth/cors-unsupported",CREDENTIAL_ALREADY_IN_USE:"auth/credential-already-in-use",CREDENTIAL_MISMATCH:"auth/custom-token-mismatch",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"auth/requires-recent-login",DEPENDENT_SDK_INIT_BEFORE_AUTH:"auth/dependent-sdk-initialized-before-auth",DYNAMIC_LINK_NOT_ACTIVATED:"auth/dynamic-link-not-activated",EMAIL_CHANGE_NEEDS_VERIFICATION:"auth/email-change-needs-verification",EMAIL_EXISTS:"auth/email-already-in-use",EMULATOR_CONFIG_FAILED:"auth/emulator-config-failed",EXPIRED_OOB_CODE:"auth/expired-action-code",EXPIRED_POPUP_REQUEST:"auth/cancelled-popup-request",INTERNAL_ERROR:"auth/internal-error",INVALID_API_KEY:"auth/invalid-api-key",INVALID_APP_CREDENTIAL:"auth/invalid-app-credential",INVALID_APP_ID:"auth/invalid-app-id",INVALID_AUTH:"auth/invalid-user-token",INVALID_AUTH_EVENT:"auth/invalid-auth-event",INVALID_CERT_HASH:"auth/invalid-cert-hash",INVALID_CODE:"auth/invalid-verification-code",INVALID_CONTINUE_URI:"auth/invalid-continue-uri",INVALID_CORDOVA_CONFIGURATION:"auth/invalid-cordova-configuration",INVALID_CUSTOM_TOKEN:"auth/invalid-custom-token",INVALID_DYNAMIC_LINK_DOMAIN:"auth/invalid-dynamic-link-domain",INVALID_EMAIL:"auth/invalid-email",INVALID_EMULATOR_SCHEME:"auth/invalid-emulator-scheme",INVALID_IDP_RESPONSE:"auth/invalid-credential",INVALID_LOGIN_CREDENTIALS:"auth/invalid-credential",INVALID_MESSAGE_PAYLOAD:"auth/invalid-message-payload",INVALID_MFA_SESSION:"auth/invalid-multi-factor-session",INVALID_OAUTH_CLIENT_ID:"auth/invalid-oauth-client-id",INVALID_OAUTH_PROVIDER:"auth/invalid-oauth-provider",INVALID_OOB_CODE:"auth/invalid-action-code",INVALID_ORIGIN:"auth/unauthorized-domain",INVALID_PASSWORD:"auth/wrong-password",INVALID_PERSISTENCE:"auth/invalid-persistence-type",INVALID_PHONE_NUMBER:"auth/invalid-phone-number",INVALID_PROVIDER_ID:"auth/invalid-provider-id",INVALID_RECIPIENT_EMAIL:"auth/invalid-recipient-email",INVALID_SENDER:"auth/invalid-sender",INVALID_SESSION_INFO:"auth/invalid-verification-id",INVALID_TENANT_ID:"auth/invalid-tenant-id",MFA_INFO_NOT_FOUND:"auth/multi-factor-info-not-found",MFA_REQUIRED:"auth/multi-factor-auth-required",MISSING_ANDROID_PACKAGE_NAME:"auth/missing-android-pkg-name",MISSING_APP_CREDENTIAL:"auth/missing-app-credential",MISSING_AUTH_DOMAIN:"auth/auth-domain-config-required",MISSING_CODE:"auth/missing-verification-code",MISSING_CONTINUE_URI:"auth/missing-continue-uri",MISSING_IFRAME_START:"auth/missing-iframe-start",MISSING_IOS_BUNDLE_ID:"auth/missing-ios-bundle-id",MISSING_OR_INVALID_NONCE:"auth/missing-or-invalid-nonce",MISSING_MFA_INFO:"auth/missing-multi-factor-info",MISSING_MFA_SESSION:"auth/missing-multi-factor-session",MISSING_PHONE_NUMBER:"auth/missing-phone-number",MISSING_SESSION_INFO:"auth/missing-verification-id",MODULE_DESTROYED:"auth/app-deleted",NEED_CONFIRMATION:"auth/account-exists-with-different-credential",NETWORK_REQUEST_FAILED:"auth/network-request-failed",NULL_USER:"auth/null-user",NO_AUTH_EVENT:"auth/no-auth-event",NO_SUCH_PROVIDER:"auth/no-such-provider",OPERATION_NOT_ALLOWED:"auth/operation-not-allowed",OPERATION_NOT_SUPPORTED:"auth/operation-not-supported-in-this-environment",POPUP_BLOCKED:"auth/popup-blocked",POPUP_CLOSED_BY_USER:"auth/popup-closed-by-user",PROVIDER_ALREADY_LINKED:"auth/provider-already-linked",QUOTA_EXCEEDED:"auth/quota-exceeded",REDIRECT_CANCELLED_BY_USER:"auth/redirect-cancelled-by-user",REDIRECT_OPERATION_PENDING:"auth/redirect-operation-pending",REJECTED_CREDENTIAL:"auth/rejected-credential",SECOND_FACTOR_ALREADY_ENROLLED:"auth/second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"auth/maximum-second-factor-count-exceeded",TENANT_ID_MISMATCH:"auth/tenant-id-mismatch",TIMEOUT:"auth/timeout",TOKEN_EXPIRED:"auth/user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"auth/too-many-requests",UNAUTHORIZED_DOMAIN:"auth/unauthorized-continue-uri",UNSUPPORTED_FIRST_FACTOR:"auth/unsupported-first-factor",UNSUPPORTED_PERSISTENCE:"auth/unsupported-persistence-type",UNSUPPORTED_TENANT_OPERATION:"auth/unsupported-tenant-operation",UNVERIFIED_EMAIL:"auth/unverified-email",USER_CANCELLED:"auth/user-cancelled",USER_DELETED:"auth/user-not-found",USER_DISABLED:"auth/user-disabled",USER_MISMATCH:"auth/user-mismatch",USER_SIGNED_OUT:"auth/user-signed-out",WEAK_PASSWORD:"auth/weak-password",WEB_STORAGE_UNSUPPORTED:"auth/web-storage-unsupported",ALREADY_INITIALIZED:"auth/already-initialized",RECAPTCHA_NOT_ENABLED:"auth/recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"auth/missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"auth/invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"auth/invalid-recaptcha-action",MISSING_CLIENT_TYPE:"auth/missing-client-type",MISSING_RECAPTCHA_VERSION:"auth/missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"auth/invalid-recaptcha-version",INVALID_REQ_TYPE:"auth/invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eo=new gc("@firebase/auth");function tI(r,...e){eo.logLevel<=J.WARN&&eo.warn(`Auth (${Bn}): ${r}`,...e)}function Us(r,...e){eo.logLevel<=J.ERROR&&eo.error(`Auth (${Bn}): ${r}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qe(r,...e){throw Ec(r,...e)}function $e(r,...e){return Ec(r,...e)}function Ic(r,e,t){const n=Object.assign(Object.assign({},$d()),{[e]:t});return new Wi("auth","Firebase",n).create(e,{appName:r.name})}function De(r){return Ic(r,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Cr(r,e,t){const n=t;if(!(e instanceof n))throw n.name!==e.constructor.name&&Qe(r,"argument-error"),Ic(r,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function Ec(r,...e){if(typeof r!="string"){const t=e[0],n=[...e.slice(1)];return n[0]&&(n[0].appName=r.name),r._errorFactory.create(t,...n)}return Kd.create(r,...e)}function O(r,e,...t){if(!r)throw Ec(e,...t)}function st(r){const e="INTERNAL ASSERTION FAILED: "+r;throw Us(e),new Error(e)}function At(r,e){r||st(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ni(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.href)||""}function Tc(){return $l()==="http:"||$l()==="https:"}function $l(){var r;return typeof self<"u"&&((r=self.location)===null||r===void 0?void 0:r.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nI(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Tc()||w_()||"connection"in navigator)?navigator.onLine:!0}function rI(){if(typeof navigator>"u")return null;const r=navigator;return r.languages&&r.languages[0]||r.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hi{constructor(e,t){this.shortDelay=e,this.longDelay=t,At(t>e,"Short delay should be less than long delay!"),this.isMobile=E_()||A_()}get(){return nI()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vc(r,e){At(r.emulator,"Emulator should always be set here");const{url:t}=r.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wd{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;st("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;st("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;st("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iI={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sI=new Hi(3e4,6e4);function le(r,e){return r.tenantId&&!e.tenantId?Object.assign(Object.assign({},e),{tenantId:r.tenantId}):e}async function he(r,e,t,n,i={}){return Hd(r,i,async()=>{let s={},o={};n&&(e==="GET"?o=n:s={body:JSON.stringify(n)});const c=Pr(Object.assign({key:r.config.apiKey},o)).slice(1),u=await r._getAdditionalHeaders();return u["Content-Type"]="application/json",r.languageCode&&(u["X-Firebase-Locale"]=r.languageCode),Wd.fetch()(Qd(r,r.config.apiHost,t,c),Object.assign({method:e,headers:u,referrerPolicy:"no-referrer"},s))})}async function Hd(r,e,t){r._canInitEmulator=!1;const n=Object.assign(Object.assign({},iI),e);try{const i=new aI(r),s=await Promise.race([t(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw _i(r,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const c=s.ok?o.errorMessage:o.error.message,[u,h]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw _i(r,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw _i(r,"email-already-in-use",o);if(u==="USER_DISABLED")throw _i(r,"user-disabled",o);const f=n[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Ic(r,f,h);Qe(r,f)}}catch(i){if(i instanceof it)throw i;Qe(r,"network-request-failed",{message:String(i)})}}async function Pt(r,e,t,n,i={}){const s=await he(r,e,t,n,i);return"mfaPendingCredential"in s&&Qe(r,"multi-factor-auth-required",{_serverResponse:s}),s}function Qd(r,e,t,n){const i=`${e}${t}?${n}`;return r.config.emulator?vc(r.config,i):`${r.config.apiScheme}://${i}`}function oI(r){switch(r){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class aI{constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,n)=>{this.timer=setTimeout(()=>n($e(this.auth,"network-request-failed")),sI.get())})}clearNetworkTimeout(){clearTimeout(this.timer)}}function _i(r,e,t){const n={appName:r.name};t.email&&(n.email=t.email),t.phoneNumber&&(n.phoneNumber=t.phoneNumber);const i=$e(r,e,n);return i.customData._tokenResponse=t,i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kl(r){return r!==void 0&&r.getResponse!==void 0}function Wl(r){return r!==void 0&&r.enterprise!==void 0}class Jd{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return oI(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cI(r){return(await he(r,"GET","/v1/recaptchaParams")).recaptchaSiteKey||""}async function Yd(r,e){return he(r,"GET","/v2/recaptchaConfig",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function uI(r,e){return he(r,"POST","/v1/accounts:delete",e)}async function lI(r,e){return he(r,"POST","/v1/accounts:update",e)}async function Xd(r,e){return he(r,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vi(r){if(r)try{const e=new Date(Number(r));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hI(r,e=!1){return B(r).getIdToken(e)}async function Zd(r,e=!1){const t=B(r),n=await t.getIdToken(e),i=vo(n);O(i&&i.exp&&i.auth_time&&i.iat,t.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s?.sign_in_provider;return{claims:i,token:n,authTime:vi(Ca(i.auth_time)),issuedAtTime:vi(Ca(i.iat)),expirationTime:vi(Ca(i.exp)),signInProvider:o||null,signInSecondFactor:s?.sign_in_second_factor||null}}function Ca(r){return Number(r)*1e3}function vo(r){const[e,t,n]=r.split(".");if(e===void 0||t===void 0||n===void 0)return Us("JWT malformed, contained fewer than 3 sections"),null;try{const i=Rd(t);return i?JSON.parse(i):(Us("Failed to decode base64 JWT payload"),null)}catch(i){return Us("Caught error parsing JWT payload as JSON",i?.toString()),null}}function Hl(r){const e=vo(r);return O(e,"internal-error"),O(typeof e.exp<"u","internal-error"),O(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Rt(r,e,t=!1){if(t)return e;try{return await e}catch(n){throw n instanceof it&&dI(n)&&r.auth.currentUser===r&&await r.auth.signOut(),n}}function dI({code:r}){return r==="auth/user-disabled"||r==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fI{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const n=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),n}else{this.errorBackoff=3e4;const i=((t=this.user.stsTokenManager.expirationTime)!==null&&t!==void 0?t:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class za{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=vi(this.lastLoginAt),this.creationTime=vi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Vi(r){var e;const t=r.auth,n=await r.getIdToken(),i=await Rt(r,Xd(t,{idToken:n}));O(i?.users.length,t,"internal-error");const s=i.users[0];r._notifyReloadListener(s);const o=!((e=s.providerUserInfo)===null||e===void 0)&&e.length?tf(s.providerUserInfo):[],c=pI(r.providerData,o),u=r.isAnonymous,h=!(r.email&&s.passwordHash)&&!c?.length,f=u?h:!1,p={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:c,metadata:new za(s.createdAt,s.lastLoginAt),isAnonymous:f};Object.assign(r,p)}async function ef(r){const e=B(r);await Vi(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function pI(r,e){return[...r.filter(n=>!e.some(i=>i.providerId===n.providerId)),...e]}function tf(r){return r.map(e=>{var{providerId:t}=e,n=yc(e,["providerId"]);return{providerId:t,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mI(r,e){const t=await Hd(r,{},async()=>{const n=Pr({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=r.config,o=Qd(r,i,"/v1/token",`key=${s}`),c=await r._getAdditionalHeaders();return c["Content-Type"]="application/x-www-form-urlencoded",Wd.fetch()(o,{method:"POST",headers:c,body:n})});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function gI(r,e){return he(r,"POST","/v2/accounts:revokeToken",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rr{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){O(e.idToken,"internal-error"),O(typeof e.idToken<"u","internal-error"),O(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):Hl(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){O(e.length!==0,"internal-error");const t=Hl(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(O(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:i,expiresIn:s}=await mI(e,t);this.updateTokensAndExpiration(n,i,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+n*1e3}static fromJSON(e,t){const{refreshToken:n,accessToken:i,expirationTime:s}=t,o=new rr;return n&&(O(typeof n=="string","internal-error",{appName:e}),o.refreshToken=n),i&&(O(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(O(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new rr,this.toJSON())}_performRefresh(){return st("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(r,e){O(typeof r=="string"||typeof r>"u","internal-error",{appName:e})}class It{constructor(e){var{uid:t,auth:n,stsTokenManager:i}=e,s=yc(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new fI(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=t,this.auth=n,this.stsTokenManager=i,this.accessToken=i.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new za(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await Rt(this,this.stsTokenManager.getToken(this.auth,e));return O(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return Zd(this,e)}reload(){return ef(this)}_assign(e){this!==e&&(O(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>Object.assign({},t)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new It(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){O(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Vi(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(ye(this.auth.app))return Promise.reject(De(this.auth));const e=await this.getIdToken();return await Rt(this,uI(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>Object.assign({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,i,s,o,c,u,h,f;const p=(n=t.displayName)!==null&&n!==void 0?n:void 0,_=(i=t.email)!==null&&i!==void 0?i:void 0,R=(s=t.phoneNumber)!==null&&s!==void 0?s:void 0,D=(o=t.photoURL)!==null&&o!==void 0?o:void 0,V=(c=t.tenantId)!==null&&c!==void 0?c:void 0,C=(u=t._redirectEventId)!==null&&u!==void 0?u:void 0,z=(h=t.createdAt)!==null&&h!==void 0?h:void 0,j=(f=t.lastLoginAt)!==null&&f!==void 0?f:void 0,{uid:U,emailVerified:H,isAnonymous:ee,providerData:K,stsTokenManager:E}=t;O(U&&E,e,"internal-error");const g=rr.fromJSON(this.name,E);O(typeof U=="string",e,"internal-error"),Ft(p,e.name),Ft(_,e.name),O(typeof H=="boolean",e,"internal-error"),O(typeof ee=="boolean",e,"internal-error"),Ft(R,e.name),Ft(D,e.name),Ft(V,e.name),Ft(C,e.name),Ft(z,e.name),Ft(j,e.name);const I=new It({uid:U,auth:e,email:_,emailVerified:H,displayName:p,isAnonymous:ee,photoURL:D,phoneNumber:R,tenantId:V,stsTokenManager:g,createdAt:z,lastLoginAt:j});return K&&Array.isArray(K)&&(I.providerData=K.map(T=>Object.assign({},T))),C&&(I._redirectEventId=C),I}static async _fromIdTokenResponse(e,t,n=!1){const i=new rr;i.updateFromServerResponse(t);const s=new It({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:n});return await Vi(s),s}static async _fromGetAccountInfoResponse(e,t,n){const i=t.users[0];O(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?tf(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!s?.length,c=new rr;c.updateFromIdToken(n);const u=new It({uid:i.localId,auth:e,stsTokenManager:c,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new za(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!s?.length};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ql=new Map;function Et(r){At(r instanceof Function,"Expected a class definition");let e=Ql.get(r);return e?(At(e instanceof r,"Instance stored in cache mismatched with class"),e):(e=new r,Ql.set(r,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nf{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}nf.type="NONE";const Ga=nf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bs(r,e,t){return`firebase:${r}:${e}:${t}`}class ir{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:i,name:s}=this.auth;this.fullUserKey=Bs(this.userKey,i.apiKey,s),this.fullPersistenceKey=Bs("persistence",i.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);return e?It._fromJSON(this.auth,e):null}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new ir(Et(Ga),e,n);const i=(await Promise.all(t.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||Et(Ga);const o=Bs(n,e.config.apiKey,e.name);let c=null;for(const h of t)try{const f=await h._get(o);if(f){const p=It._fromJSON(e,f);h!==s&&(c=p),s=h;break}}catch{}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new ir(s,e,n):(s=u[0],c&&await s._set(o,c.toJSON()),await Promise.all(t.map(async h=>{if(h!==s)try{await h._remove(o)}catch{}})),new ir(s,e,n))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jl(r){const e=r.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(of(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(rf(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(cf(e))return"Blackberry";if(uf(e))return"Webos";if(wc(e))return"Safari";if((e.includes("chrome/")||sf(e))&&!e.includes("edge/"))return"Chrome";if(af(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=r.match(t);if(n?.length===2)return n[1]}return"Other"}function rf(r=Re()){return/firefox\//i.test(r)}function wc(r=Re()){const e=r.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function sf(r=Re()){return/crios\//i.test(r)}function of(r=Re()){return/iemobile/i.test(r)}function af(r=Re()){return/android/i.test(r)}function cf(r=Re()){return/blackberry/i.test(r)}function uf(r=Re()){return/webos/i.test(r)}function wo(r=Re()){return/iphone|ipad|ipod/i.test(r)||/macintosh/i.test(r)&&/mobile/i.test(r)}function _I(r=Re()){var e;return wo(r)&&!!(!((e=window.navigator)===null||e===void 0)&&e.standalone)}function yI(){return R_()&&document.documentMode===10}function lf(r=Re()){return wo(r)||af(r)||uf(r)||cf(r)||/windows phone/i.test(r)||of(r)}function II(){try{return!!(window&&window!==window.top)}catch{return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hf(r,e=[]){let t;switch(r){case"Browser":t=Jl(Re());break;case"Worker":t=`${Jl(Re())}-${r}`;break;default:t=r}const n=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Bn}/${n}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EI{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=s=>new Promise((o,c)=>{try{const u=e(s);o(u)}catch(u){c(u)}});n.onAbort=t,this.queue.push(n);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const i of t)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:n?.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TI(r,e={}){return he(r,"GET","/v2/passwordPolicy",le(r,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vI=6;class wI{constructor(e){var t,n,i,s;const o=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(t=o.minPasswordLength)!==null&&t!==void 0?t:vI,o.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=o.maxPasswordLength),o.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=o.containsLowercaseCharacter),o.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=o.containsUppercaseCharacter),o.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=o.containsNumericCharacter),o.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=o.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(i=(n=e.allowedNonAlphanumericCharacters)===null||n===void 0?void 0:n.join(""))!==null&&i!==void 0?i:"",this.forceUpgradeOnSignin=(s=e.forceUpgradeOnSignin)!==null&&s!==void 0?s:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,i,s,o,c;const u={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,u),this.validatePasswordCharacterOptions(e,u),u.isValid&&(u.isValid=(t=u.meetsMinPasswordLength)!==null&&t!==void 0?t:!0),u.isValid&&(u.isValid=(n=u.meetsMaxPasswordLength)!==null&&n!==void 0?n:!0),u.isValid&&(u.isValid=(i=u.containsLowercaseLetter)!==null&&i!==void 0?i:!0),u.isValid&&(u.isValid=(s=u.containsUppercaseLetter)!==null&&s!==void 0?s:!0),u.isValid&&(u.isValid=(o=u.containsNumericCharacter)!==null&&o!==void 0?o:!0),u.isValid&&(u.isValid=(c=u.containsNonAlphanumericCharacter)!==null&&c!==void 0?c:!0),u}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let n;for(let i=0;i<e.length;i++)n=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AI{constructor(e,t,n,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Yl(this),this.idTokenSubscription=new Yl(this),this.beforeStateQueue=new EI(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Kd,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Et(t)),this._initializationPromise=this.queue(async()=>{var n,i;if(!this._deleted&&(this.persistenceManager=await ir.create(this,e),!this._deleted)){if(!((n=this._popupRedirectResolver)===null||n===void 0)&&n._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)===null||i===void 0?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Xd(this,{idToken:e}),n=await It._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(ye(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let i=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(t=this.redirectUser)===null||t===void 0?void 0:t._redirectEventId,c=i?._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&u?.user&&(i=u.user,s=!0)}if(!i)return this.directlySetCurrentUser(null);if(!i._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(i)}catch(o){i=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return i?this.reloadAndSetCurrentUserOrClear(i):this.directlySetCurrentUser(null)}return O(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===i._redirectEventId?this.directlySetCurrentUser(i):this.reloadAndSetCurrentUserOrClear(i)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Vi(e)}catch(t){if(t?.code!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=rI()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(ye(this.app))return Promise.reject(De(this));const t=e?B(e):null;return t&&O(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&O(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return ye(this.app)?Promise.reject(De(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return ye(this.app)?Promise.reject(De(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Et(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await TI(this),t=new wI(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistence(){return this.assertedPersistence.persistence.type}_updateErrorMap(e){this._errorFactory=new Wi("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged(()=>{n(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),n={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(n.tenantId=this.tenantId),await gI(this,n)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)===null||e===void 0?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return e===null?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Et(e)||this._popupRedirectResolver;O(t,this,"argument-error"),this.redirectPersistenceManager=await ir.create(this,[Et(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)===null||t===void 0?void 0:t._redirectEventId)===e?this._currentUser:((n=this.redirectUser)===null||n===void 0?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=(t=(e=this.currentUser)===null||e===void 0?void 0:e.uid)!==null&&t!==void 0?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,i){if(this._deleted)return()=>{};const s=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(O(c,this,"internal-error"),c.then(()=>{o||s(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,n,i);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return O(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=hf(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await((e=this.heartbeatServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const i=await this._getAppCheckToken();return i&&(t["X-Firebase-AppCheck"]=i),t}async _getAppCheckToken(){var e;const t=await((e=this.appCheckServiceProvider.getImmediate({optional:!0}))===null||e===void 0?void 0:e.getToken());return t?.error&&tI(`Error while retrieving App Check token: ${t.error}`),t?.token}}function Ee(r){return B(r)}class Yl{constructor(e){this.auth=e,this.observer=null,this.addObserver=k_(t=>this.observer=t)}get next(){return O(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qi={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function RI(r){Qi=r}function Ac(r){return Qi.loadJS(r)}function bI(){return Qi.recaptchaV2Script}function SI(){return Qi.recaptchaEnterpriseScript}function PI(){return Qi.gapiScript}function df(r){return`__${r}${Math.floor(Math.random()*1e6)}`}const CI="recaptcha-enterprise",DI="NO_RECAPTCHA";class ff{constructor(e){this.type=CI,this.auth=Ee(e)}async verify(e="verify",t=!1){async function n(s){if(!t){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,c)=>{Yd(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const h=new Jd(u);return s.tenantId==null?s._agentRecaptchaConfig=h:s._tenantRecaptchaConfigs[s.tenantId]=h,o(h.siteKey)}}).catch(u=>{c(u)})})}function i(s,o,c){const u=window.grecaptcha;Wl(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(h=>{o(h)}).catch(()=>{o(DI)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return new Promise((s,o)=>{n(this.auth).then(c=>{if(!t&&Wl(window.grecaptcha))i(c,s,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=SI();u.length!==0&&(u+=c),Ac(u).then(()=>{i(c,s,o)}).catch(h=>{o(h)})}}).catch(c=>{o(c)})})}}async function Xl(r,e,t,n=!1){const i=new ff(r);let s;try{s=await i.verify(t)}catch{s=await i.verify(t,!0)}const o=Object.assign({},e);return n?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function Oi(r,e,t,n){var i;if(!((i=r._getRecaptchaConfig())===null||i===void 0)&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await Xl(r,e,t,t==="getOobCode");return n(r,s)}else return n(r,e).catch(async s=>{if(s.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const o=await Xl(r,e,t,t==="getOobCode");return n(r,o)}else return Promise.reject(s)})}async function kI(r){const e=Ee(r),t=await Yd(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),n=new Jd(t);e.tenantId==null?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,n.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")&&new ff(e).verify()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pf(r,e){const t=Un(r,"auth");if(t.isInitialized()){const i=t.getImmediate(),s=t.getOptions();if(Ht(s,e??{}))return i;Qe(i,"already-initialized")}return t.initialize({options:e})}function NI(r,e){const t=e?.persistence||[],n=(Array.isArray(t)?t:[t]).map(Et);e?.errorMap&&r._updateErrorMap(e.errorMap),r._initializeWithPersistence(n,e?.popupRedirectResolver)}function mf(r,e,t){const n=Ee(r);O(n._canInitEmulator,n,"emulator-config-failed"),O(/^https?:\/\//.test(e),n,"invalid-emulator-scheme");const i=!!t?.disableWarnings,s=gf(e),{host:o,port:c}=VI(e),u=c===null?"":`:${c}`;n.config.emulator={url:`${s}//${o}${u}/`},n.settings.appVerificationDisabledForTesting=!0,n.emulatorConfig=Object.freeze({host:o,port:c,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})}),i||OI()}function gf(r){const e=r.indexOf(":");return e<0?"":r.substr(0,e+1)}function VI(r){const e=gf(r),t=/(\/\/)?([^?#/]+)/.exec(r.substr(e.length));if(!t)return{host:"",port:null};const n=t[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(n);if(i){const s=i[1];return{host:s,port:Zl(n.substr(s.length+1))}}else{const[s,o]=n.split(":");return{host:s,port:Zl(o)}}}function Zl(r){if(!r)return null;const e=Number(r);return isNaN(e)?null:e}function OI(){function r(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",r):r())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dr{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return st("not implemented")}_getIdTokenResponse(e){return st("not implemented")}_linkToIdToken(e,t){return st("not implemented")}_getReauthenticationResolver(e){return st("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _f(r,e){return he(r,"POST","/v1/accounts:resetPassword",le(r,e))}async function xI(r,e){return he(r,"POST","/v1/accounts:update",e)}async function LI(r,e){return he(r,"POST","/v1/accounts:signUp",e)}async function MI(r,e){return he(r,"POST","/v1/accounts:update",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function FI(r,e){return Pt(r,"POST","/v1/accounts:signInWithPassword",le(r,e))}async function Ao(r,e){return he(r,"POST","/v1/accounts:sendOobCode",le(r,e))}async function UI(r,e){return Ao(r,e)}async function BI(r,e){return Ao(r,e)}async function qI(r,e){return Ao(r,e)}async function zI(r,e){return Ao(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function GI(r,e){return Pt(r,"POST","/v1/accounts:signInWithEmailLink",le(r,e))}async function jI(r,e){return Pt(r,"POST","/v1/accounts:signInWithEmailLink",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hr extends Dr{constructor(e,t,n,i=null){super("password",n),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new hr(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new hr(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t?.email&&t?.password){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oi(e,t,"signInWithPassword",FI);case"emailLink":return GI(e,{email:this._email,oobCode:this._password});default:Qe(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const n={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return Oi(e,n,"signUpPassword",LI);case"emailLink":return jI(e,{idToken:t,email:this._email,oobCode:this._password});default:Qe(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wt(r,e){return Pt(r,"POST","/v1/accounts:signInWithIdp",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $I="http://localhost";class lt extends Dr{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new lt(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):Qe("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i}=t,s=yc(t,["providerId","signInMethod"]);if(!n||!i)return null;const o=new lt(n,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return wt(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,wt(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,wt(e,t)}buildRequest(){const e={requestUri:$I,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=Pr(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function KI(r,e){return he(r,"POST","/v1/accounts:sendVerificationCode",le(r,e))}async function WI(r,e){return Pt(r,"POST","/v1/accounts:signInWithPhoneNumber",le(r,e))}async function HI(r,e){const t=await Pt(r,"POST","/v1/accounts:signInWithPhoneNumber",le(r,e));if(t.temporaryProof)throw _i(r,"account-exists-with-different-credential",t);return t}const QI={USER_NOT_FOUND:"user-not-found"};async function JI(r,e){const t=Object.assign(Object.assign({},e),{operation:"REAUTH"});return Pt(r,"POST","/v1/accounts:signInWithPhoneNumber",le(r,t),QI)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt extends Dr{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new Wt({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new Wt({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return WI(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return HI(e,Object.assign({idToken:t},this._makeVerificationRequest()))}_getReauthenticationResolver(e){return JI(e,this._makeVerificationRequest())}_makeVerificationRequest(){const{temporaryProof:e,phoneNumber:t,verificationId:n,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:n,code:i}}toJSON(){const e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){typeof e=="string"&&(e=JSON.parse(e));const{verificationId:t,verificationCode:n,phoneNumber:i,temporaryProof:s}=e;return!n&&!t&&!i&&!s?null:new Wt({verificationId:t,verificationCode:n,phoneNumber:i,temporaryProof:s})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function YI(r){switch(r){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function XI(r){const e=mi(gi(r)).link,t=e?mi(gi(e)).deep_link_id:null,n=mi(gi(r)).deep_link_id;return(n?mi(gi(n)).link:null)||n||t||e||r}class kr{constructor(e){var t,n,i,s,o,c;const u=mi(gi(e)),h=(t=u.apiKey)!==null&&t!==void 0?t:null,f=(n=u.oobCode)!==null&&n!==void 0?n:null,p=YI((i=u.mode)!==null&&i!==void 0?i:null);O(h&&f&&p,"argument-error"),this.apiKey=h,this.operation=p,this.code=f,this.continueUrl=(s=u.continueUrl)!==null&&s!==void 0?s:null,this.languageCode=(o=u.languageCode)!==null&&o!==void 0?o:null,this.tenantId=(c=u.tenantId)!==null&&c!==void 0?c:null}static parseLink(e){const t=XI(e);try{return new kr(t)}catch{return null}}}function ZI(r){return kr.parseLink(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class on{constructor(){this.providerId=on.PROVIDER_ID}static credential(e,t){return hr._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=kr.parseLink(t);return O(n,"argument-error"),hr._fromEmailAndCode(e,n.code,n.tenantId)}}on.PROVIDER_ID="password";on.EMAIL_PASSWORD_SIGN_IN_METHOD="password";on.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nr extends Ct{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}class wi extends Nr{static credentialFromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;return O("providerId"in t&&"signInMethod"in t,"argument-error"),lt._fromParams(t)}credential(e){return this._credential(Object.assign(Object.assign({},e),{nonce:e.rawNonce}))}_credential(e){return O(e.idToken||e.accessToken,"argument-error"),lt._fromParams(Object.assign(Object.assign({},e),{providerId:this.providerId,signInMethod:this.providerId}))}static credentialFromResult(e){return wi.oauthCredentialFromTaggedObject(e)}static credentialFromError(e){return wi.oauthCredentialFromTaggedObject(e.customData||{})}static oauthCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n,oauthTokenSecret:i,pendingToken:s,nonce:o,providerId:c}=e;if(!n&&!i&&!t&&!s||!c)return null;try{return new wi(c)._credential({idToken:t,accessToken:n,nonce:o,pendingToken:s})}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt extends Nr{constructor(){super("facebook.com")}static credential(e){return lt._fromParams({providerId:mt.PROVIDER_ID,signInMethod:mt.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return mt.credentialFromTaggedObject(e)}static credentialFromError(e){return mt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return mt.credential(e.oauthAccessToken)}catch{return null}}}mt.FACEBOOK_SIGN_IN_METHOD="facebook.com";mt.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt extends Nr{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return lt._fromParams({providerId:gt.PROVIDER_ID,signInMethod:gt.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return gt.credentialFromTaggedObject(e)}static credentialFromError(e){return gt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return gt.credential(t,n)}catch{return null}}}gt.GOOGLE_SIGN_IN_METHOD="google.com";gt.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t extends Nr{constructor(){super("github.com")}static credential(e){return lt._fromParams({providerId:_t.PROVIDER_ID,signInMethod:_t.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return _t.credentialFromTaggedObject(e)}static credentialFromError(e){return _t.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return _t.credential(e.oauthAccessToken)}catch{return null}}}_t.GITHUB_SIGN_IN_METHOD="github.com";_t.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const eE="http://localhost";class xi extends Dr{constructor(e,t){super(e,e),this.pendingToken=t}_getIdTokenResponse(e){const t=this.buildRequest();return wt(e,t)}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,wt(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,wt(e,t)}toJSON(){return{signInMethod:this.signInMethod,providerId:this.providerId,pendingToken:this.pendingToken}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:n,signInMethod:i,pendingToken:s}=t;return!n||!i||!s||n!==i?null:new xi(n,s)}static _create(e,t){return new xi(e,t)}buildRequest(){return{requestUri:eE,returnSecureToken:!0,pendingToken:this.pendingToken}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tE="saml.";class to extends Ct{constructor(e){O(e.startsWith(tE),"argument-error"),super(e)}static credentialFromResult(e){return to.samlCredentialFromTaggedObject(e)}static credentialFromError(e){return to.samlCredentialFromTaggedObject(e.customData||{})}static credentialFromJSON(e){const t=xi.fromJSON(e);return O(t,"argument-error"),t}static samlCredentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{pendingToken:t,providerId:n}=e;if(!t||!n)return null;try{return xi._create(n,t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt extends Nr{constructor(){super("twitter.com")}static credential(e,t){return lt._fromParams({providerId:yt.PROVIDER_ID,signInMethod:yt.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return yt.credentialFromTaggedObject(e)}static credentialFromError(e){return yt.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return yt.credential(t,n)}catch{return null}}}yt.TWITTER_SIGN_IN_METHOD="twitter.com";yt.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yf(r,e){return Pt(r,"POST","/v1/accounts:signUp",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,i=!1){const s=await It._fromIdTokenResponse(e,n,i),o=eh(n);return new tt({user:s,providerId:o,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const i=eh(n);return new tt({user:e,providerId:i,_tokenResponse:n,operationType:t})}}function eh(r){return r.providerId?r.providerId:"phoneNumber"in r?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function nE(r){var e;if(ye(r.app))return Promise.reject(De(r));const t=Ee(r);if(await t._initializationPromise,!((e=t.currentUser)===null||e===void 0)&&e.isAnonymous)return new tt({user:t.currentUser,providerId:null,operationType:"signIn"});const n=await yf(t,{returnSecureToken:!0}),i=await tt._fromIdTokenResponse(t,"signIn",n,!0);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class no extends it{constructor(e,t,n,i){var s;super(t.code,t.message),this.operationType=n,this.user=i,Object.setPrototypeOf(this,no.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!==null&&s!==void 0?s:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,i){return new no(e,t,n,i)}}function If(r,e,t,n){return(e==="reauthenticate"?t._getReauthenticationResolver(r):t._getIdTokenResponse(r)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?no._fromErrorAndOperation(r,s,e,n):s})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ef(r){return new Set(r.map(({providerId:e})=>e).filter(e=>!!e))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function rE(r,e){const t=B(r);await Ro(!0,t,e);const{providerUserInfo:n}=await lI(t.auth,{idToken:await t.getIdToken(),deleteProvider:[e]}),i=Ef(n||[]);return t.providerData=t.providerData.filter(s=>i.has(s.providerId)),i.has("phone")||(t.phoneNumber=null),await t.auth._persistUserIfCurrent(t),t}async function Rc(r,e,t=!1){const n=await Rt(r,e._linkToIdToken(r.auth,await r.getIdToken()),t);return tt._forOperation(r,"link",n)}async function Ro(r,e,t){await Vi(e);const n=Ef(e.providerData),i=r===!1?"provider-already-linked":"no-such-provider";O(n.has(t)===r,e.auth,i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Tf(r,e,t=!1){const{auth:n}=r;if(ye(n.app))return Promise.reject(De(n));const i="reauthenticate";try{const s=await Rt(r,If(n,i,e,r),t);O(s.idToken,n,"internal-error");const o=vo(s.idToken);O(o,n,"internal-error");const{sub:c}=o;return O(r.uid===c,n,"user-mismatch"),tt._forOperation(r,i,s)}catch(s){throw s?.code==="auth/user-not-found"&&Qe(n,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vf(r,e,t=!1){if(ye(r.app))return Promise.reject(De(r));const n="signIn",i=await If(r,n,e),s=await tt._fromIdTokenResponse(r,n,i);return t||await r._updateCurrentUser(s.user),s}async function bo(r,e){return vf(Ee(r),e)}async function wf(r,e){const t=B(r);return await Ro(!1,t,e.providerId),Rc(t,e)}async function Af(r,e){return Tf(B(r),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function iE(r,e){return Pt(r,"POST","/v1/accounts:signInWithCustomToken",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sE(r,e){if(ye(r.app))return Promise.reject(De(r));const t=Ee(r),n=await iE(t,{token:e,returnSecureToken:!0}),i=await tt._fromIdTokenResponse(t,"signIn",n);return await t._updateCurrentUser(i.user),i}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(e,t){this.factorId=e,this.uid=t.mfaEnrollmentId,this.enrollmentTime=new Date(t.enrolledAt).toUTCString(),this.displayName=t.displayName}static _fromServerResponse(e,t){return"phoneInfo"in t?bc._fromServerResponse(e,t):"totpInfo"in t?Sc._fromServerResponse(e,t):Qe(e,"internal-error")}}class bc extends Ji{constructor(e){super("phone",e),this.phoneNumber=e.phoneInfo}static _fromServerResponse(e,t){return new bc(t)}}class Sc extends Ji{constructor(e){super("totp",e)}static _fromServerResponse(e,t){return new Sc(t)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function So(r,e,t){var n;O(((n=t.url)===null||n===void 0?void 0:n.length)>0,r,"invalid-continue-uri"),O(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,r,"invalid-dynamic-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(O(t.iOS.bundleId.length>0,r,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(O(t.android.packageName.length>0,r,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Pc(r){const e=Ee(r);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function oE(r,e,t){const n=Ee(r),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&So(n,i,t),await Oi(n,i,"getOobCode",BI)}async function aE(r,e,t){await _f(B(r),{oobCode:e,newPassword:t}).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Pc(r),n})}async function cE(r,e){await MI(B(r),{oobCode:e})}async function Rf(r,e){const t=B(r),n=await _f(t,{oobCode:e}),i=n.requestType;switch(O(i,t,"internal-error"),i){case"EMAIL_SIGNIN":break;case"VERIFY_AND_CHANGE_EMAIL":O(n.newEmail,t,"internal-error");break;case"REVERT_SECOND_FACTOR_ADDITION":O(n.mfaInfo,t,"internal-error");default:O(n.email,t,"internal-error")}let s=null;return n.mfaInfo&&(s=Ji._fromServerResponse(Ee(t),n.mfaInfo)),{data:{email:(n.requestType==="VERIFY_AND_CHANGE_EMAIL"?n.newEmail:n.email)||null,previousEmail:(n.requestType==="VERIFY_AND_CHANGE_EMAIL"?n.email:n.newEmail)||null,multiFactorInfo:s},operation:i}}async function uE(r,e){const{data:t}=await Rf(B(r),e);return t.email}async function lE(r,e,t){if(ye(r.app))return Promise.reject(De(r));const n=Ee(r),o=await Oi(n,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",yf).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Pc(r),u}),c=await tt._fromIdTokenResponse(n,"signIn",o);return await n._updateCurrentUser(c.user),c}function hE(r,e,t){return ye(r.app)?Promise.reject(De(r)):bo(B(r),on.credential(e,t)).catch(async n=>{throw n.code==="auth/password-does-not-meet-requirements"&&Pc(r),n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function dE(r,e,t){const n=Ee(r),i={requestType:"EMAIL_SIGNIN",email:e,clientType:"CLIENT_TYPE_WEB"};function s(o,c){O(c.handleCodeInApp,n,"argument-error"),c&&So(n,o,c)}s(i,t),await Oi(n,i,"getOobCode",qI)}function fE(r,e){const t=kr.parseLink(e);return t?.operation==="EMAIL_SIGNIN"}async function pE(r,e,t){if(ye(r.app))return Promise.reject(De(r));const n=B(r),i=on.credentialWithLink(e,t||Ni());return O(i._tenantId===(n.tenantId||null),n,"tenant-id-mismatch"),bo(n,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mE(r,e){return he(r,"POST","/v1/accounts:createAuthUri",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function gE(r,e){const t=Tc()?Ni():"http://localhost",n={identifier:e,continueUri:t},{signinMethods:i}=await mE(B(r),n);return i||[]}async function _E(r,e){const t=B(r),i={requestType:"VERIFY_EMAIL",idToken:await r.getIdToken()};e&&So(t.auth,i,e);const{email:s}=await UI(t.auth,i);s!==r.email&&await r.reload()}async function yE(r,e,t){const n=B(r),s={requestType:"VERIFY_AND_CHANGE_EMAIL",idToken:await r.getIdToken(),newEmail:e};t&&So(n.auth,s,t);const{email:o}=await zI(n.auth,s);o!==r.email&&await r.reload()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function IE(r,e){return he(r,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function EE(r,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const n=B(r),s={idToken:await n.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await Rt(n,IE(n.auth,s));n.displayName=o.displayName||null,n.photoURL=o.photoUrl||null;const c=n.providerData.find(({providerId:u})=>u==="password");c&&(c.displayName=n.displayName,c.photoURL=n.photoURL),await n._updateTokensIfNecessary(o)}function TE(r,e){const t=B(r);return ye(t.auth.app)?Promise.reject(De(t.auth)):bf(t,e,null)}function vE(r,e){return bf(B(r),null,e)}async function bf(r,e,t){const{auth:n}=r,s={idToken:await r.getIdToken(),returnSecureToken:!0};e&&(s.email=e),t&&(s.password=t);const o=await Rt(r,xI(n,s));await r._updateTokensIfNecessary(o,!0)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wE(r){var e,t;if(!r)return null;const{providerId:n}=r,i=r.rawUserInfo?JSON.parse(r.rawUserInfo):{},s=r.isNewUser||r.kind==="identitytoolkit#SignupNewUserResponse";if(!n&&r?.idToken){const o=(t=(e=vo(r.idToken))===null||e===void 0?void 0:e.firebase)===null||t===void 0?void 0:t.sign_in_provider;if(o){const c=o!=="anonymous"&&o!=="custom"?o:null;return new sr(s,c)}}if(!n)return null;switch(n){case"facebook.com":return new AE(s,i);case"github.com":return new RE(s,i);case"google.com":return new bE(s,i);case"twitter.com":return new SE(s,i,r.screenName||null);case"custom":case"anonymous":return new sr(s,null);default:return new sr(s,n,i)}}class sr{constructor(e,t,n={}){this.isNewUser=e,this.providerId=t,this.profile=n}}class Sf extends sr{constructor(e,t,n,i){super(e,t,n),this.username=i}}class AE extends sr{constructor(e,t){super(e,"facebook.com",t)}}class RE extends Sf{constructor(e,t){super(e,"github.com",t,typeof t?.login=="string"?t?.login:null)}}class bE extends sr{constructor(e,t){super(e,"google.com",t)}}class SE extends Sf{constructor(e,t,n){super(e,"twitter.com",t,n)}}function PE(r){const{user:e,_tokenResponse:t}=r;return e.isAnonymous&&!t?{providerId:null,isNewUser:!1,profile:null}:wE(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CE(r,e){return B(r).setPersistence(e)}function DE(r){return kI(r)}async function kE(r,e){return Ee(r).validatePassword(e)}function Pf(r,e,t,n){return B(r).onIdTokenChanged(e,t,n)}function Cf(r,e,t){return B(r).beforeAuthStateChanged(e,t)}function NE(r,e,t,n){return B(r).onAuthStateChanged(e,t,n)}function VE(r){B(r).useDeviceLanguage()}function OE(r,e){return B(r).updateCurrentUser(e)}function xE(r){return B(r).signOut()}function LE(r,e){return Ee(r).revokeAccessToken(e)}async function ME(r){return B(r).delete()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rn{constructor(e,t,n){this.type=e,this.credential=t,this.user=n}static _fromIdtoken(e,t){return new Rn("enroll",e,t)}static _fromMfaPendingCredential(e){return new Rn("signin",e)}toJSON(){return{multiFactorSession:{[this.type==="enroll"?"idToken":"pendingCredential"]:this.credential}}}static fromJSON(e){var t,n;if(e?.multiFactorSession){if(!((t=e.multiFactorSession)===null||t===void 0)&&t.pendingCredential)return Rn._fromMfaPendingCredential(e.multiFactorSession.pendingCredential);if(!((n=e.multiFactorSession)===null||n===void 0)&&n.idToken)return Rn._fromIdtoken(e.multiFactorSession.idToken)}return null}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cc{constructor(e,t,n){this.session=e,this.hints=t,this.signInResolver=n}static _fromError(e,t){const n=Ee(e),i=t.customData._serverResponse,s=(i.mfaInfo||[]).map(c=>Ji._fromServerResponse(n,c));O(i.mfaPendingCredential,n,"internal-error");const o=Rn._fromMfaPendingCredential(i.mfaPendingCredential);return new Cc(o,s,async c=>{const u=await c._process(n,o);delete i.mfaInfo,delete i.mfaPendingCredential;const h=Object.assign(Object.assign({},i),{idToken:u.idToken,refreshToken:u.refreshToken});switch(t.operationType){case"signIn":const f=await tt._fromIdTokenResponse(n,t.operationType,h);return await n._updateCurrentUser(f.user),f;case"reauthenticate":return O(t.user,n,"internal-error"),tt._forOperation(t.user,t.operationType,h);default:Qe(n,"internal-error")}})}async resolveSignIn(e){const t=e;return this.signInResolver(t)}}function FE(r,e){var t;const n=B(r),i=e;return O(e.customData.operationType,n,"argument-error"),O((t=i.customData._serverResponse)===null||t===void 0?void 0:t.mfaPendingCredential,n,"argument-error"),Cc._fromError(n,i)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UE(r,e){return he(r,"POST","/v2/accounts/mfaEnrollment:start",le(r,e))}function BE(r,e){return he(r,"POST","/v2/accounts/mfaEnrollment:finalize",le(r,e))}function qE(r,e){return he(r,"POST","/v2/accounts/mfaEnrollment:start",le(r,e))}function zE(r,e){return he(r,"POST","/v2/accounts/mfaEnrollment:finalize",le(r,e))}function GE(r,e){return he(r,"POST","/v2/accounts/mfaEnrollment:withdraw",le(r,e))}class Dc{constructor(e){this.user=e,this.enrolledFactors=[],e._onReload(t=>{t.mfaInfo&&(this.enrolledFactors=t.mfaInfo.map(n=>Ji._fromServerResponse(e.auth,n)))})}static _fromUser(e){return new Dc(e)}async getSession(){return Rn._fromIdtoken(await this.user.getIdToken(),this.user)}async enroll(e,t){const n=e,i=await this.getSession(),s=await Rt(this.user,n._process(this.user.auth,i,t));return await this.user._updateTokensIfNecessary(s),this.user.reload()}async unenroll(e){const t=typeof e=="string"?e:e.uid,n=await this.user.getIdToken();try{const i=await Rt(this.user,GE(this.user.auth,{idToken:n,mfaEnrollmentId:t}));this.enrolledFactors=this.enrolledFactors.filter(({uid:s})=>s!==t),await this.user._updateTokensIfNecessary(i),await this.user.reload()}catch(i){throw i}}}const Da=new WeakMap;function jE(r){const e=B(r);return Da.has(e)||Da.set(e,Dc._fromUser(e)),Da.get(e)}const ro="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Df{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(ro,"1"),this.storage.removeItem(ro),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $E(){const r=Re();return wc(r)||wo(r)}const KE=1e3,WE=10;class kf extends Df{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.safariLocalStorageNotSynced=$E()&&II(),this.fallbackToPolling=lf(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),i=this.localCache[t];n!==i&&e(t,i,n)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const n=e.key;if(t?this.detachListener():this.stopPolling(),this.safariLocalStorageNotSynced){const o=this.storage.getItem(n);if(e.newValue!==o)e.newValue!==null?this.storage.setItem(n,e.newValue):this.storage.removeItem(n);else if(this.localCache[n]===e.newValue&&!t)return}const i=()=>{const o=this.storage.getItem(n);!t&&this.localCache[n]===o||this.notifyListeners(n,o)},s=this.storage.getItem(n);yI()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,WE):i()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)})},KE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}kf.type="LOCAL";const Nf=kf;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vf extends Df{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Vf.type="SESSION";const kc=Vf;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function HE(r){return Promise.all(r.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Po{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(i=>i.isListeningto(e));if(t)return t;const n=new Po(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:i,data:s}=t.data,o=this.handlersMap[i];if(!o?.size)return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:i});const c=Array.from(o).map(async h=>h(t.origin,s)),u=await HE(c);t.ports[0].postMessage({status:"done",eventId:n,eventType:i,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Po.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Co(r="",e=10){let t="";for(let n=0;n<e;n++)t+=Math.floor(Math.random()*10);return r+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QE{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const i=typeof MessageChannel<"u"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((c,u)=>{const h=Co("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},n);o={messageChannel:i,onMessage(p){const _=p;if(_.data.eventId===h)switch(_.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),c(_.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:t},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ae(){return window}function JE(r){Ae().location.href=r}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nc(){return typeof Ae().WorkerGlobalScope<"u"&&typeof Ae().importScripts=="function"}async function YE(){if(!navigator?.serviceWorker)return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function XE(){var r;return((r=navigator?.serviceWorker)===null||r===void 0?void 0:r.controller)||null}function ZE(){return Nc()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Of="firebaseLocalStorageDb",eT=1,io="firebaseLocalStorage",xf="fbase_key";class Yi{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function Do(r,e){return r.transaction([io],e?"readwrite":"readonly").objectStore(io)}function tT(){const r=indexedDB.deleteDatabase(Of);return new Yi(r).toPromise()}function ja(){const r=indexedDB.open(Of,eT);return new Promise((e,t)=>{r.addEventListener("error",()=>{t(r.error)}),r.addEventListener("upgradeneeded",()=>{const n=r.result;try{n.createObjectStore(io,{keyPath:xf})}catch(i){t(i)}}),r.addEventListener("success",async()=>{const n=r.result;n.objectStoreNames.contains(io)?e(n):(n.close(),await tT(),e(await ja()))})})}async function th(r,e,t){const n=Do(r,!0).put({[xf]:e,value:t});return new Yi(n).toPromise()}async function nT(r,e){const t=Do(r,!1).get(e),n=await new Yi(t).toPromise();return n===void 0?null:n.value}function nh(r,e){const t=Do(r,!0).delete(e);return new Yi(t).toPromise()}const rT=800,iT=3;class Lf{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await ja(),this.db)}async _withRetries(e){let t=0;for(;;)try{const n=await this._openDb();return await e(n)}catch(n){if(t++>iT)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Nc()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Po._getInstance(ZE()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var e,t;if(this.activeServiceWorker=await YE(),!this.activeServiceWorker)return;this.sender=new QE(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&!((e=n[0])===null||e===void 0)&&e.fulfilled&&!((t=n[0])===null||t===void 0)&&t.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||XE()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await ja();return await th(e,ro,"1"),await nh(e,ro),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(n=>th(n,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(n=>nT(n,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>nh(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=Do(i,!1).getAll();return new Yi(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],n=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)n.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),t.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!n.has(i)&&(this.notifyListeners(i,null),t.push(i));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const i of Array.from(n))i(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),rT)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Lf.type="LOCAL";const Mf=Lf;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sT(r,e){return he(r,"POST","/v2/accounts/mfaSignIn:start",le(r,e))}function oT(r,e){return he(r,"POST","/v2/accounts/mfaSignIn:finalize",le(r,e))}function aT(r,e){return he(r,"POST","/v2/accounts/mfaSignIn:finalize",le(r,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cT=500,uT=6e4,Ds=1e12;class lT{constructor(e){this.auth=e,this.counter=Ds,this._widgets=new Map}render(e,t){const n=this.counter;return this._widgets.set(n,new hT(e,this.auth.name,t||{})),this.counter++,n}reset(e){var t;const n=e||Ds;(t=this._widgets.get(n))===null||t===void 0||t.delete(),this._widgets.delete(n)}getResponse(e){var t;const n=e||Ds;return((t=this._widgets.get(n))===null||t===void 0?void 0:t.getResponse())||""}async execute(e){var t;const n=e||Ds;return(t=this._widgets.get(n))===null||t===void 0||t.execute(),""}}class hT{constructor(e,t,n){this.params=n,this.timerId=null,this.deleted=!1,this.responseToken=null,this.clickHandler=()=>{this.execute()};const i=typeof e=="string"?document.getElementById(e):e;O(i,"argument-error",{appName:t}),this.container=i,this.isVisible=this.params.size!=="invisible",this.isVisible?this.execute():this.container.addEventListener("click",this.clickHandler)}getResponse(){return this.checkIfDeleted(),this.responseToken}delete(){this.checkIfDeleted(),this.deleted=!0,this.timerId&&(clearTimeout(this.timerId),this.timerId=null),this.container.removeEventListener("click",this.clickHandler)}execute(){this.checkIfDeleted(),!this.timerId&&(this.timerId=window.setTimeout(()=>{this.responseToken=dT(50);const{callback:e,"expired-callback":t}=this.params;if(e)try{e(this.responseToken)}catch{}this.timerId=window.setTimeout(()=>{if(this.timerId=null,this.responseToken=null,t)try{t()}catch{}this.isVisible&&this.execute()},uT)},cT))}checkIfDeleted(){if(this.deleted)throw new Error("reCAPTCHA mock was already deleted!")}}function dT(r){const e=[],t="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";for(let n=0;n<r;n++)e.push(t.charAt(Math.floor(Math.random()*t.length)));return e.join("")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ka=df("rcb"),fT=new Hi(3e4,6e4);class pT{constructor(){var e;this.hostLanguage="",this.counter=0,this.librarySeparatelyLoaded=!!(!((e=Ae().grecaptcha)===null||e===void 0)&&e.render)}load(e,t=""){return O(mT(t),e,"argument-error"),this.shouldResolveImmediately(t)&&Kl(Ae().grecaptcha)?Promise.resolve(Ae().grecaptcha):new Promise((n,i)=>{const s=Ae().setTimeout(()=>{i($e(e,"network-request-failed"))},fT.get());Ae()[ka]=()=>{Ae().clearTimeout(s),delete Ae()[ka];const c=Ae().grecaptcha;if(!c||!Kl(c)){i($e(e,"internal-error"));return}const u=c.render;c.render=(h,f)=>{const p=u(h,f);return this.counter++,p},this.hostLanguage=t,n(c)};const o=`${bI()}?${Pr({onload:ka,render:"explicit",hl:t})}`;Ac(o).catch(()=>{clearTimeout(s),i($e(e,"internal-error"))})})}clearedOneInstance(){this.counter--}shouldResolveImmediately(e){var t;return!!(!((t=Ae().grecaptcha)===null||t===void 0)&&t.render)&&(e===this.hostLanguage||this.counter>0||this.librarySeparatelyLoaded)}}function mT(r){return r.length<=6&&/^\s*[a-zA-Z0-9\-]*\s*$/.test(r)}class gT{async load(e){return new lT(e)}clearedOneInstance(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ff="recaptcha",_T={theme:"light",type:"image"};class yT{constructor(e,t,n=Object.assign({},_T)){this.parameters=n,this.type=Ff,this.destroyed=!1,this.widgetId=null,this.tokenChangeListeners=new Set,this.renderPromise=null,this.recaptcha=null,this.auth=Ee(e),this.isInvisible=this.parameters.size==="invisible",O(typeof document<"u",this.auth,"operation-not-supported-in-this-environment");const i=typeof t=="string"?document.getElementById(t):t;O(i,this.auth,"argument-error"),this.container=i,this.parameters.callback=this.makeTokenCallback(this.parameters.callback),this._recaptchaLoader=this.auth.settings.appVerificationDisabledForTesting?new gT:new pT,this.validateStartingState()}async verify(){this.assertNotDestroyed();const e=await this.render(),t=this.getAssertedRecaptcha(),n=t.getResponse(e);return n||new Promise(i=>{const s=o=>{o&&(this.tokenChangeListeners.delete(s),i(o))};this.tokenChangeListeners.add(s),this.isInvisible&&t.execute(e)})}render(){try{this.assertNotDestroyed()}catch(e){return Promise.reject(e)}return this.renderPromise?this.renderPromise:(this.renderPromise=this.makeRenderPromise().catch(e=>{throw this.renderPromise=null,e}),this.renderPromise)}_reset(){this.assertNotDestroyed(),this.widgetId!==null&&this.getAssertedRecaptcha().reset(this.widgetId)}clear(){this.assertNotDestroyed(),this.destroyed=!0,this._recaptchaLoader.clearedOneInstance(),this.isInvisible||this.container.childNodes.forEach(e=>{this.container.removeChild(e)})}validateStartingState(){O(!this.parameters.sitekey,this.auth,"argument-error"),O(this.isInvisible||!this.container.hasChildNodes(),this.auth,"argument-error"),O(typeof document<"u",this.auth,"operation-not-supported-in-this-environment")}makeTokenCallback(e){return t=>{if(this.tokenChangeListeners.forEach(n=>n(t)),typeof e=="function")e(t);else if(typeof e=="string"){const n=Ae()[e];typeof n=="function"&&n(t)}}}assertNotDestroyed(){O(!this.destroyed,this.auth,"internal-error")}async makeRenderPromise(){if(await this.init(),!this.widgetId){let e=this.container;if(!this.isInvisible){const t=document.createElement("div");e.appendChild(t),e=t}this.widgetId=this.getAssertedRecaptcha().render(e,this.parameters)}return this.widgetId}async init(){O(Tc()&&!Nc(),this.auth,"internal-error"),await IT(),this.recaptcha=await this._recaptchaLoader.load(this.auth,this.auth.languageCode||void 0);const e=await cI(this.auth);O(e,this.auth,"internal-error"),this.parameters.sitekey=e}getAssertedRecaptcha(){return O(this.recaptcha,this.auth,"internal-error"),this.recaptcha}}function IT(){let r=null;return new Promise(e=>{if(document.readyState==="complete"){e();return}r=()=>e(),window.addEventListener("load",r)}).catch(e=>{throw r&&window.removeEventListener("load",r),e})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc{constructor(e,t){this.verificationId=e,this.onConfirmation=t}confirm(e){const t=Wt._fromVerification(this.verificationId,e);return this.onConfirmation(t)}}async function ET(r,e,t){if(ye(r.app))return Promise.reject(De(r));const n=Ee(r),i=await ko(n,e,B(t));return new Vc(i,s=>bo(n,s))}async function TT(r,e,t){const n=B(r);await Ro(!1,n,"phone");const i=await ko(n.auth,e,B(t));return new Vc(i,s=>wf(n,s))}async function vT(r,e,t){const n=B(r);if(ye(n.auth.app))return Promise.reject(De(n.auth));const i=await ko(n.auth,e,B(t));return new Vc(i,s=>Af(n,s))}async function ko(r,e,t){var n;const i=await t.verify();try{O(typeof i=="string",r,"argument-error"),O(t.type===Ff,r,"argument-error");let s;if(typeof e=="string"?s={phoneNumber:e}:s=e,"session"in s){const o=s.session;if("phoneNumber"in s)return O(o.type==="enroll",r,"internal-error"),(await UE(r,{idToken:o.credential,phoneEnrollmentInfo:{phoneNumber:s.phoneNumber,recaptchaToken:i}})).phoneSessionInfo.sessionInfo;{O(o.type==="signin",r,"internal-error");const c=((n=s.multiFactorHint)===null||n===void 0?void 0:n.uid)||s.multiFactorUid;return O(c,r,"missing-multi-factor-info"),(await sT(r,{mfaPendingCredential:o.credential,mfaEnrollmentId:c,phoneSignInInfo:{recaptchaToken:i}})).phoneResponseInfo.sessionInfo}}else{const{sessionInfo:o}=await KI(r,{phoneNumber:s.phoneNumber,recaptchaToken:i});return o}}finally{t._reset()}}async function wT(r,e){const t=B(r);if(ye(t.auth.app))return Promise.reject(De(t.auth));await Rc(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e){this.providerId=bn.PROVIDER_ID,this.auth=Ee(e)}verifyPhoneNumber(e,t){return ko(this.auth,e,B(t))}static credential(e,t){return Wt._fromVerification(e,t)}static credentialFromResult(e){const t=e;return bn.credentialFromTaggedObject(t)}static credentialFromError(e){return bn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{phoneNumber:t,temporaryProof:n}=e;return t&&n?Wt._fromTokenResponse(t,n):null}}bn.PROVIDER_ID="phone";bn.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qn(r,e){return e?Et(e):(O(r._popupRedirectResolver,r,"argument-error"),r._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oc extends Dr{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return wt(e,this._buildIdpRequest())}_linkToIdToken(e,t){return wt(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return wt(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function AT(r){return vf(r.auth,new Oc(r),r.bypassAuthState)}function RT(r){const{auth:e,user:t}=r;return O(t,e,"internal-error"),Tf(t,new Oc(r),r.bypassAuthState)}async function bT(r){const{auth:e,user:t}=r;return O(t,e,"internal-error"),Rc(t,new Oc(r),r.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uf{constructor(e,t,n,i,s=!1){this.auth=e,this.resolver=n,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:i,tenantId:s,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return AT;case"linkViaPopup":case"linkViaRedirect":return bT;case"reauthViaPopup":case"reauthViaRedirect":return RT;default:Qe(this.auth,"internal-error")}}resolve(e){At(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){At(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ST=new Hi(2e3,1e4);async function PT(r,e,t){if(ye(r.app))return Promise.reject($e(r,"operation-not-supported-in-this-environment"));const n=Ee(r);Cr(r,e,Ct);const i=qn(n,t);return new Tt(n,"signInViaPopup",e,i).executeNotNull()}async function CT(r,e,t){const n=B(r);if(ye(n.auth.app))return Promise.reject($e(n.auth,"operation-not-supported-in-this-environment"));Cr(n.auth,e,Ct);const i=qn(n.auth,t);return new Tt(n.auth,"reauthViaPopup",e,i,n).executeNotNull()}async function DT(r,e,t){const n=B(r);Cr(n.auth,e,Ct);const i=qn(n.auth,t);return new Tt(n.auth,"linkViaPopup",e,i,n).executeNotNull()}class Tt extends Uf{constructor(e,t,n,i,s){super(e,t,i,s),this.provider=n,this.authWindow=null,this.pollId=null,Tt.currentPopupAction&&Tt.currentPopupAction.cancel(),Tt.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return O(e,this.auth,"internal-error"),e}async onExecution(){At(this.filter.length===1,"Popup operations only handle one event");const e=Co();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject($e(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)===null||e===void 0?void 0:e.associatedEvent)||null}cancel(){this.reject($e(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,Tt.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;if(!((n=(t=this.authWindow)===null||t===void 0?void 0:t.window)===null||n===void 0)&&n.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject($e(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,ST.get())};e()}}Tt.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kT="pendingRedirect",qs=new Map;class NT extends Uf{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=qs.get(this.auth._key());if(!e){try{const n=await VT(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(n)}catch(t){e=()=>Promise.reject(t)}qs.set(this.auth._key(),e)}return this.bypassAuthState||qs.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function VT(r,e){const t=qf(e),n=Bf(r);if(!await n._isAvailable())return!1;const i=await n._get(t)==="true";return await n._remove(t),i}async function xc(r,e){return Bf(r)._set(qf(e),"true")}function OT(r,e){qs.set(r._key(),e)}function Bf(r){return Et(r._redirectPersistence)}function qf(r){return Bs(kT,r.config.apiKey,r.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xT(r,e,t){return LT(r,e,t)}async function LT(r,e,t){if(ye(r.app))return Promise.reject(De(r));const n=Ee(r);Cr(r,e,Ct),await n._initializationPromise;const i=qn(n,t);return await xc(i,n),i._openRedirect(n,e,"signInViaRedirect")}function MT(r,e,t){return FT(r,e,t)}async function FT(r,e,t){const n=B(r);if(Cr(n.auth,e,Ct),ye(n.auth.app))return Promise.reject(De(n.auth));await n.auth._initializationPromise;const i=qn(n.auth,t);await xc(i,n.auth);const s=await Gf(n);return i._openRedirect(n.auth,e,"reauthViaRedirect",s)}function UT(r,e,t){return BT(r,e,t)}async function BT(r,e,t){const n=B(r);Cr(n.auth,e,Ct),await n.auth._initializationPromise;const i=qn(n.auth,t);await Ro(!1,n,e.providerId),await xc(i,n.auth);const s=await Gf(n);return i._openRedirect(n.auth,e,"linkViaRedirect",s)}async function qT(r,e){return await Ee(r)._initializationPromise,zf(r,e,!1)}async function zf(r,e,t=!1){if(ye(r.app))return Promise.reject(De(r));const n=Ee(r),i=qn(n,e),o=await new NT(n,i,t).execute();return o&&!t&&(delete o.user._redirectEventId,await n._persistUserIfCurrent(o.user),await n._setRedirectUser(null,e)),o}async function Gf(r){const e=Co(`${r.uid}:::`);return r._redirectEventId=e,await r.auth._setRedirectUser(r),await r.auth._persistUserIfCurrent(r),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zT=600*1e3;class GT{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!jT(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!jf(e)){const i=((n=e.error.code)===null||n===void 0?void 0:n.split("auth/")[1])||"internal-error";t.onError($e(this.auth,i))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=zT&&this.cachedEventUids.clear(),this.cachedEventUids.has(rh(e))}saveEventToCache(e){this.cachedEventUids.add(rh(e)),this.lastProcessedEventTime=Date.now()}}function rh(r){return[r.type,r.eventId,r.sessionId,r.tenantId].filter(e=>e).join("-")}function jf({type:r,error:e}){return r==="unknown"&&e?.code==="auth/no-auth-event"}function jT(r){switch(r.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return jf(r);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function $T(r,e={}){return he(r,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const KT=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,WT=/^https?/;async function HT(r){if(r.config.emulator)return;const{authorizedDomains:e}=await $T(r);for(const t of e)try{if(QT(t))return}catch{}Qe(r,"unauthorized-domain")}function QT(r){const e=Ni(),{protocol:t,hostname:n}=new URL(e);if(r.startsWith("chrome-extension://")){const o=new URL(r);return o.hostname===""&&n===""?t==="chrome-extension:"&&r.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===n}if(!WT.test(t))return!1;if(KT.test(r))return n===r;const i=r.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(n)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JT=new Hi(3e4,6e4);function ih(){const r=Ae().___jsl;if(r?.H){for(const e of Object.keys(r.H))if(r.H[e].r=r.H[e].r||[],r.H[e].L=r.H[e].L||[],r.H[e].r=[...r.H[e].L],r.CP)for(let t=0;t<r.CP.length;t++)r.CP[t]=null}}function YT(r){return new Promise((e,t)=>{var n,i,s;function o(){ih(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{ih(),t($e(r,"network-request-failed"))},timeout:JT.get()})}if(!((i=(n=Ae().gapi)===null||n===void 0?void 0:n.iframes)===null||i===void 0)&&i.Iframe)e(gapi.iframes.getContext());else if(!((s=Ae().gapi)===null||s===void 0)&&s.load)o();else{const c=df("iframefcb");return Ae()[c]=()=>{gapi.load?o():t($e(r,"network-request-failed"))},Ac(`${PI()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw zs=null,e})}let zs=null;function XT(r){return zs=zs||YT(r),zs}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZT=new Hi(5e3,15e3),ev="__/auth/iframe",tv="emulator/auth/iframe",nv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},rv=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function iv(r){const e=r.config;O(e.authDomain,r,"auth-domain-config-required");const t=e.emulator?vc(e,tv):`https://${r.config.authDomain}/${ev}`,n={apiKey:e.apiKey,appName:r.name,v:Bn},i=rv.get(r.config.apiHost);i&&(n.eid=i);const s=r._getFrameworks();return s.length&&(n.fw=s.join(",")),`${t}?${Pr(n).slice(1)}`}async function sv(r){const e=await XT(r),t=Ae().gapi;return O(t,r,"internal-error"),e.open({where:document.body,url:iv(r),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:nv,dontclear:!0},n=>new Promise(async(i,s)=>{await n.restyle({setHideOnLeave:!1});const o=$e(r,"network-request-failed"),c=Ae().setTimeout(()=>{s(o)},ZT.get());function u(){Ae().clearTimeout(c),i(n)}n.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ov={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},av=500,cv=600,uv="_blank",lv="http://localhost";class sh{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function hv(r,e,t,n=av,i=cv){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-n)/2,0).toString();let c="";const u=Object.assign(Object.assign({},ov),{width:n.toString(),height:i.toString(),top:s,left:o}),h=Re().toLowerCase();t&&(c=sf(h)?uv:t),rf(h)&&(e=e||lv,u.scrollbars="yes");const f=Object.entries(u).reduce((_,[R,D])=>`${_}${R}=${D},`,"");if(_I(h)&&c!=="_self")return dv(e||"",c),new sh(null);const p=window.open(e||"",c,f);O(p,r,"popup-blocked");try{p.focus()}catch{}return new sh(p)}function dv(r,e){const t=document.createElement("a");t.href=r,t.target=e;const n=document.createEvent("MouseEvent");n.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(n)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fv="__/auth/handler",pv="emulator/auth/handler",mv=encodeURIComponent("fac");async function oh(r,e,t,n,i,s){O(r.config.authDomain,r,"auth-domain-config-required"),O(r.config.apiKey,r,"invalid-api-key");const o={apiKey:r.config.apiKey,appName:r.name,authType:t,redirectUrl:n,v:Bn,eventId:i};if(e instanceof Ct){e.setDefaultLanguage(r.languageCode),o.providerId=e.providerId||"",D_(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,p]of Object.entries({}))o[f]=p}if(e instanceof Nr){const f=e.getScopes().filter(p=>p!=="");f.length>0&&(o.scopes=f.join(","))}r.tenantId&&(o.tid=r.tenantId);const c=o;for(const f of Object.keys(c))c[f]===void 0&&delete c[f];const u=await r._getAppCheckToken(),h=u?`#${mv}=${encodeURIComponent(u)}`:"";return`${gv(r)}?${Pr(c).slice(1)}${h}`}function gv({config:r}){return r.emulator?vc(r,pv):`https://${r.authDomain}/${fv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Na="webStorageSupport";class _v{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=kc,this._completeRedirectFn=zf,this._overrideRedirectResult=OT}async _openPopup(e,t,n,i){var s;At((s=this.eventManagers[e._key()])===null||s===void 0?void 0:s.manager,"_initialize() not called before _openPopup()");const o=await oh(e,t,n,Ni(),i);return hv(e,o,Co())}async _openRedirect(e,t,n,i){await this._originValidation(e);const s=await oh(e,t,n,Ni(),i);return JE(s),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:i,promise:s}=this.eventManagers[t];return i?Promise.resolve(i):(At(s,"If manager is not set, promise should be"),s)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch(()=>{delete this.eventManagers[t]}),n}async initAndGetManager(e){const t=await sv(e),n=new GT(e);return t.register("authEvent",i=>(O(i?.authEvent,e,"invalid-auth-event"),{status:n.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Na,{type:Na},i=>{var s;const o=(s=i?.[0])===null||s===void 0?void 0:s[Na];o!==void 0&&t(!!o),Qe(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=HT(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return lf()||wc()||wo()}}const $f=_v;class Kf{constructor(e){this.factorId=e}_process(e,t,n){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,n);case"signin":return this._finalizeSignIn(e,t.credential);default:return st("unexpected MultiFactorSessionType")}}}class Lc extends Kf{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new Lc(e)}_finalizeEnroll(e,t,n){return BE(e,{idToken:t,displayName:n,phoneVerificationInfo:this.credential._makeVerificationRequest()})}_finalizeSignIn(e,t){return oT(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()})}}class Wf{constructor(){}static assertion(e){return Lc._fromCredential(e)}}Wf.FACTOR_ID="phone";class Hf{static assertionForEnrollment(e,t){return Li._fromSecret(e,t)}static assertionForSignIn(e,t){return Li._fromEnrollmentId(e,t)}static async generateSecret(e){var t;const n=e;O(typeof((t=n.user)===null||t===void 0?void 0:t.auth)<"u","internal-error");const i=await qE(n.user.auth,{idToken:n.credential,totpEnrollmentInfo:{}});return No._fromStartTotpMfaEnrollmentResponse(i,n.user.auth)}}Hf.FACTOR_ID="totp";class Li extends Kf{constructor(e,t,n){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=n}static _fromSecret(e,t){return new Li(t,void 0,e)}static _fromEnrollmentId(e,t){return new Li(t,e)}async _finalizeEnroll(e,t,n){return O(typeof this.secret<"u",e,"argument-error"),zE(e,{idToken:t,displayName:n,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)})}async _finalizeSignIn(e,t){O(this.enrollmentId!==void 0&&this.otp!==void 0,e,"argument-error");const n={verificationCode:this.otp};return aT(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:n})}}class No{constructor(e,t,n,i,s,o,c){this.sessionInfo=o,this.auth=c,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=n,this.codeIntervalSeconds=i,this.enrollmentCompletionDeadline=s}static _fromStartTotpMfaEnrollmentResponse(e,t){return new No(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){var n;let i=!1;return(ks(e)||ks(t))&&(i=!0),i&&(ks(e)&&(e=((n=this.auth.currentUser)===null||n===void 0?void 0:n.email)||"unknownuser"),ks(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}}function ks(r){return typeof r>"u"||r?.length===0}var ah="@firebase/auth",ch="1.7.6";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)===null||e===void 0?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(n=>{e(n?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){O(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iv(r){switch(r){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Ev(r){Yt(new Qt("auth",(e,{options:t})=>{const n=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=n.options;O(o&&!o.includes(":"),"invalid-api-key",{appName:n.name});const u={apiKey:o,authDomain:c,clientPlatform:r,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:hf(r)},h=new AI(n,i,s,u);return NI(h,t),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider("auth-internal").initialize()})),Yt(new Qt("auth-internal",e=>{const t=Ee(e.getProvider("auth").getImmediate());return(n=>new yv(n))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),et(ah,ch,Iv(r)),et(ah,ch,"esm2017")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tv=300,vv=Cd("authIdTokenMaxAge")||Tv;let uh=null;const wv=r=>async e=>{const t=e&&await e.getIdTokenResult(),n=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>vv)return;const i=t?.token;uh!==i&&(uh=i,await fetch(r,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function Av(r=To()){const e=Un(r,"auth");if(e.isInitialized())return e.getImmediate();const t=pf(r,{popupRedirectResolver:$f,persistence:[Mf,Nf,kc]}),n=Cd("authTokenSyncURL");if(n&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(n,location.origin);if(location.origin===s.origin){const o=wv(s.toString());Cf(t,o,()=>o(t.currentUser)),Pf(t,c=>o(c))}}const i=bd("auth");return i&&mf(t,`http://${i}`),t}function Rv(){var r,e;return(e=(r=document.getElementsByTagName("head"))===null||r===void 0?void 0:r[0])!==null&&e!==void 0?e:document}RI({loadJS(r){return new Promise((e,t)=>{const n=document.createElement("script");n.setAttribute("src",r),n.onload=e,n.onerror=i=>{const s=$e("internal-error");s.customData=i,t(s)},n.type="text/javascript",n.charset="UTF-8",Rv().appendChild(n)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Ev("Browser");const PS=Object.freeze(Object.defineProperty({__proto__:null,ActionCodeOperation:Yy,ActionCodeURL:kr,AuthCredential:Dr,AuthErrorCodes:eI,EmailAuthCredential:hr,EmailAuthProvider:on,FacebookAuthProvider:mt,FactorId:Wy,GithubAuthProvider:_t,GoogleAuthProvider:gt,OAuthCredential:lt,OAuthProvider:wi,OperationType:Jy,PhoneAuthCredential:Wt,PhoneAuthProvider:bn,PhoneMultiFactorGenerator:Wf,ProviderId:Hy,RecaptchaVerifier:yT,SAMLAuthProvider:to,SignInMethod:Qy,TotpMultiFactorGenerator:Hf,TotpSecret:No,TwitterAuthProvider:yt,applyActionCode:cE,beforeAuthStateChanged:Cf,browserLocalPersistence:Nf,browserPopupRedirectResolver:$f,browserSessionPersistence:kc,checkActionCode:Rf,confirmPasswordReset:aE,connectAuthEmulator:mf,createUserWithEmailAndPassword:lE,debugErrorMap:Zy,deleteUser:ME,fetchSignInMethodsForEmail:gE,getAdditionalUserInfo:PE,getAuth:Av,getIdToken:hI,getIdTokenResult:Zd,getMultiFactorResolver:FE,getRedirectResult:qT,inMemoryPersistence:Ga,indexedDBLocalPersistence:Mf,initializeAuth:pf,initializeRecaptchaConfig:DE,isSignInWithEmailLink:fE,linkWithCredential:wf,linkWithPhoneNumber:TT,linkWithPopup:DT,linkWithRedirect:UT,multiFactor:jE,onAuthStateChanged:NE,onIdTokenChanged:Pf,parseActionCodeURL:ZI,prodErrorMap:$d,reauthenticateWithCredential:Af,reauthenticateWithPhoneNumber:vT,reauthenticateWithPopup:CT,reauthenticateWithRedirect:MT,reload:ef,revokeAccessToken:LE,sendEmailVerification:_E,sendPasswordResetEmail:oE,sendSignInLinkToEmail:dE,setPersistence:CE,signInAnonymously:nE,signInWithCredential:bo,signInWithCustomToken:sE,signInWithEmailAndPassword:hE,signInWithEmailLink:pE,signInWithPhoneNumber:ET,signInWithPopup:PT,signInWithRedirect:xT,signOut:xE,unlink:rE,updateCurrentUser:OE,updateEmail:TE,updatePassword:vE,updatePhoneNumber:wT,updateProfile:EE,useDeviceLanguage:VE,validatePassword:kE,verifyBeforeUpdateEmail:yE,verifyPasswordResetCode:uE},Symbol.toStringTag,{value:"Module"}));var lh=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Sn,Qf;(function(){var r;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,g){function I(){}I.prototype=g.prototype,E.D=g.prototype,E.prototype=new I,E.prototype.constructor=E,E.C=function(T,v,b){for(var y=Array(arguments.length-2),dt=2;dt<arguments.length;dt++)y[dt-2]=arguments[dt];return g.prototype[v].apply(T,y)}}function t(){this.blockSize=-1}function n(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}e(n,t),n.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(E,g,I){I||(I=0);var T=Array(16);if(typeof g=="string")for(var v=0;16>v;++v)T[v]=g.charCodeAt(I++)|g.charCodeAt(I++)<<8|g.charCodeAt(I++)<<16|g.charCodeAt(I++)<<24;else for(v=0;16>v;++v)T[v]=g[I++]|g[I++]<<8|g[I++]<<16|g[I++]<<24;g=E.g[0],I=E.g[1],v=E.g[2];var b=E.g[3],y=g+(b^I&(v^b))+T[0]+3614090360&4294967295;g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+T[1]+3905402710&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+T[2]+606105819&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+T[3]+3250441966&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(b^I&(v^b))+T[4]+4118548399&4294967295,g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+T[5]+1200080426&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+T[6]+2821735955&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+T[7]+4249261313&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(b^I&(v^b))+T[8]+1770035416&4294967295,g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+T[9]+2336552879&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+T[10]+4294925233&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+T[11]+2304563134&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(b^I&(v^b))+T[12]+1804603682&4294967295,g=I+(y<<7&4294967295|y>>>25),y=b+(v^g&(I^v))+T[13]+4254626195&4294967295,b=g+(y<<12&4294967295|y>>>20),y=v+(I^b&(g^I))+T[14]+2792965006&4294967295,v=b+(y<<17&4294967295|y>>>15),y=I+(g^v&(b^g))+T[15]+1236535329&4294967295,I=v+(y<<22&4294967295|y>>>10),y=g+(v^b&(I^v))+T[1]+4129170786&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+T[6]+3225465664&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+T[11]+643717713&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+T[0]+3921069994&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(v^b&(I^v))+T[5]+3593408605&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+T[10]+38016083&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+T[15]+3634488961&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+T[4]+3889429448&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(v^b&(I^v))+T[9]+568446438&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+T[14]+3275163606&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+T[3]+4107603335&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+T[8]+1163531501&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(v^b&(I^v))+T[13]+2850285829&4294967295,g=I+(y<<5&4294967295|y>>>27),y=b+(I^v&(g^I))+T[2]+4243563512&4294967295,b=g+(y<<9&4294967295|y>>>23),y=v+(g^I&(b^g))+T[7]+1735328473&4294967295,v=b+(y<<14&4294967295|y>>>18),y=I+(b^g&(v^b))+T[12]+2368359562&4294967295,I=v+(y<<20&4294967295|y>>>12),y=g+(I^v^b)+T[5]+4294588738&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+T[8]+2272392833&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+T[11]+1839030562&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+T[14]+4259657740&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(I^v^b)+T[1]+2763975236&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+T[4]+1272893353&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+T[7]+4139469664&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+T[10]+3200236656&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(I^v^b)+T[13]+681279174&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+T[0]+3936430074&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+T[3]+3572445317&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+T[6]+76029189&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(I^v^b)+T[9]+3654602809&4294967295,g=I+(y<<4&4294967295|y>>>28),y=b+(g^I^v)+T[12]+3873151461&4294967295,b=g+(y<<11&4294967295|y>>>21),y=v+(b^g^I)+T[15]+530742520&4294967295,v=b+(y<<16&4294967295|y>>>16),y=I+(v^b^g)+T[2]+3299628645&4294967295,I=v+(y<<23&4294967295|y>>>9),y=g+(v^(I|~b))+T[0]+4096336452&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+T[7]+1126891415&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+T[14]+2878612391&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+T[5]+4237533241&4294967295,I=v+(y<<21&4294967295|y>>>11),y=g+(v^(I|~b))+T[12]+1700485571&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+T[3]+2399980690&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+T[10]+4293915773&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+T[1]+2240044497&4294967295,I=v+(y<<21&4294967295|y>>>11),y=g+(v^(I|~b))+T[8]+1873313359&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+T[15]+4264355552&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+T[6]+2734768916&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+T[13]+1309151649&4294967295,I=v+(y<<21&4294967295|y>>>11),y=g+(v^(I|~b))+T[4]+4149444226&4294967295,g=I+(y<<6&4294967295|y>>>26),y=b+(I^(g|~v))+T[11]+3174756917&4294967295,b=g+(y<<10&4294967295|y>>>22),y=v+(g^(b|~I))+T[2]+718787259&4294967295,v=b+(y<<15&4294967295|y>>>17),y=I+(b^(v|~g))+T[9]+3951481745&4294967295,E.g[0]=E.g[0]+g&4294967295,E.g[1]=E.g[1]+(v+(y<<21&4294967295|y>>>11))&4294967295,E.g[2]=E.g[2]+v&4294967295,E.g[3]=E.g[3]+b&4294967295}n.prototype.u=function(E,g){g===void 0&&(g=E.length);for(var I=g-this.blockSize,T=this.B,v=this.h,b=0;b<g;){if(v==0)for(;b<=I;)i(this,E,b),b+=this.blockSize;if(typeof E=="string"){for(;b<g;)if(T[v++]=E.charCodeAt(b++),v==this.blockSize){i(this,T),v=0;break}}else for(;b<g;)if(T[v++]=E[b++],v==this.blockSize){i(this,T),v=0;break}}this.h=v,this.o+=g},n.prototype.v=function(){var E=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);E[0]=128;for(var g=1;g<E.length-8;++g)E[g]=0;var I=8*this.o;for(g=E.length-8;g<E.length;++g)E[g]=I&255,I/=256;for(this.u(E),E=Array(16),g=I=0;4>g;++g)for(var T=0;32>T;T+=8)E[I++]=this.g[g]>>>T&255;return E};function s(E,g){var I=c;return Object.prototype.hasOwnProperty.call(I,E)?I[E]:I[E]=g(E)}function o(E,g){this.h=g;for(var I=[],T=!0,v=E.length-1;0<=v;v--){var b=E[v]|0;T&&b==g||(I[v]=b,T=!1)}this.g=I}var c={};function u(E){return-128<=E&&128>E?s(E,function(g){return new o([g|0],0>g?-1:0)}):new o([E|0],0>E?-1:0)}function h(E){if(isNaN(E)||!isFinite(E))return p;if(0>E)return C(h(-E));for(var g=[],I=1,T=0;E>=I;T++)g[T]=E/I|0,I*=4294967296;return new o(g,0)}function f(E,g){if(E.length==0)throw Error("number format error: empty string");if(g=g||10,2>g||36<g)throw Error("radix out of range: "+g);if(E.charAt(0)=="-")return C(f(E.substring(1),g));if(0<=E.indexOf("-"))throw Error('number format error: interior "-" character');for(var I=h(Math.pow(g,8)),T=p,v=0;v<E.length;v+=8){var b=Math.min(8,E.length-v),y=parseInt(E.substring(v,v+b),g);8>b?(b=h(Math.pow(g,b)),T=T.j(b).add(h(y))):(T=T.j(I),T=T.add(h(y)))}return T}var p=u(0),_=u(1),R=u(16777216);r=o.prototype,r.m=function(){if(V(this))return-C(this).m();for(var E=0,g=1,I=0;I<this.g.length;I++){var T=this.i(I);E+=(0<=T?T:4294967296+T)*g,g*=4294967296}return E},r.toString=function(E){if(E=E||10,2>E||36<E)throw Error("radix out of range: "+E);if(D(this))return"0";if(V(this))return"-"+C(this).toString(E);for(var g=h(Math.pow(E,6)),I=this,T="";;){var v=H(I,g).g;I=z(I,v.j(g));var b=((0<I.g.length?I.g[0]:I.h)>>>0).toString(E);if(I=v,D(I))return b+T;for(;6>b.length;)b="0"+b;T=b+T}},r.i=function(E){return 0>E?0:E<this.g.length?this.g[E]:this.h};function D(E){if(E.h!=0)return!1;for(var g=0;g<E.g.length;g++)if(E.g[g]!=0)return!1;return!0}function V(E){return E.h==-1}r.l=function(E){return E=z(this,E),V(E)?-1:D(E)?0:1};function C(E){for(var g=E.g.length,I=[],T=0;T<g;T++)I[T]=~E.g[T];return new o(I,~E.h).add(_)}r.abs=function(){return V(this)?C(this):this},r.add=function(E){for(var g=Math.max(this.g.length,E.g.length),I=[],T=0,v=0;v<=g;v++){var b=T+(this.i(v)&65535)+(E.i(v)&65535),y=(b>>>16)+(this.i(v)>>>16)+(E.i(v)>>>16);T=y>>>16,b&=65535,y&=65535,I[v]=y<<16|b}return new o(I,I[I.length-1]&-2147483648?-1:0)};function z(E,g){return E.add(C(g))}r.j=function(E){if(D(this)||D(E))return p;if(V(this))return V(E)?C(this).j(C(E)):C(C(this).j(E));if(V(E))return C(this.j(C(E)));if(0>this.l(R)&&0>E.l(R))return h(this.m()*E.m());for(var g=this.g.length+E.g.length,I=[],T=0;T<2*g;T++)I[T]=0;for(T=0;T<this.g.length;T++)for(var v=0;v<E.g.length;v++){var b=this.i(T)>>>16,y=this.i(T)&65535,dt=E.i(v)>>>16,Kr=E.i(v)&65535;I[2*T+2*v]+=y*Kr,j(I,2*T+2*v),I[2*T+2*v+1]+=b*Kr,j(I,2*T+2*v+1),I[2*T+2*v+1]+=y*dt,j(I,2*T+2*v+1),I[2*T+2*v+2]+=b*dt,j(I,2*T+2*v+2)}for(T=0;T<g;T++)I[T]=I[2*T+1]<<16|I[2*T];for(T=g;T<2*g;T++)I[T]=0;return new o(I,0)};function j(E,g){for(;(E[g]&65535)!=E[g];)E[g+1]+=E[g]>>>16,E[g]&=65535,g++}function U(E,g){this.g=E,this.h=g}function H(E,g){if(D(g))throw Error("division by zero");if(D(E))return new U(p,p);if(V(E))return g=H(C(E),g),new U(C(g.g),C(g.h));if(V(g))return g=H(E,C(g)),new U(C(g.g),g.h);if(30<E.g.length){if(V(E)||V(g))throw Error("slowDivide_ only works with positive integers.");for(var I=_,T=g;0>=T.l(E);)I=ee(I),T=ee(T);var v=K(I,1),b=K(T,1);for(T=K(T,2),I=K(I,2);!D(T);){var y=b.add(T);0>=y.l(E)&&(v=v.add(I),b=y),T=K(T,1),I=K(I,1)}return g=z(E,v.j(g)),new U(v,g)}for(v=p;0<=E.l(g);){for(I=Math.max(1,Math.floor(E.m()/g.m())),T=Math.ceil(Math.log(I)/Math.LN2),T=48>=T?1:Math.pow(2,T-48),b=h(I),y=b.j(g);V(y)||0<y.l(E);)I-=T,b=h(I),y=b.j(g);D(b)&&(b=_),v=v.add(b),E=z(E,y)}return new U(v,E)}r.A=function(E){return H(this,E).h},r.and=function(E){for(var g=Math.max(this.g.length,E.g.length),I=[],T=0;T<g;T++)I[T]=this.i(T)&E.i(T);return new o(I,this.h&E.h)},r.or=function(E){for(var g=Math.max(this.g.length,E.g.length),I=[],T=0;T<g;T++)I[T]=this.i(T)|E.i(T);return new o(I,this.h|E.h)},r.xor=function(E){for(var g=Math.max(this.g.length,E.g.length),I=[],T=0;T<g;T++)I[T]=this.i(T)^E.i(T);return new o(I,this.h^E.h)};function ee(E){for(var g=E.g.length+1,I=[],T=0;T<g;T++)I[T]=E.i(T)<<1|E.i(T-1)>>>31;return new o(I,E.h)}function K(E,g){var I=g>>5;g%=32;for(var T=E.g.length-I,v=[],b=0;b<T;b++)v[b]=0<g?E.i(b+I)>>>g|E.i(b+I+1)<<32-g:E.i(b+I);return new o(v,E.h)}n.prototype.digest=n.prototype.v,n.prototype.reset=n.prototype.s,n.prototype.update=n.prototype.u,Qf=n,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.A,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Sn=o}).apply(typeof lh<"u"?lh:typeof self<"u"?self:typeof window<"u"?window:{});var Ns=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Jf,Yf,yi,Xf,Gs,$a,Zf,ep,tp;(function(){var r,e=typeof Object.defineProperties=="function"?Object.defineProperty:function(a,l,d){return a==Array.prototype||a==Object.prototype||(a[l]=d.value),a};function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ns=="object"&&Ns];for(var l=0;l<a.length;++l){var d=a[l];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var n=t(this);function i(a,l){if(l)e:{var d=n;a=a.split(".");for(var m=0;m<a.length-1;m++){var A=a[m];if(!(A in d))break e;d=d[A]}a=a[a.length-1],m=d[a],l=l(m),l!=m&&l!=null&&e(d,a,{configurable:!0,writable:!0,value:l})}}function s(a,l){a instanceof String&&(a+="");var d=0,m=!1,A={next:function(){if(!m&&d<a.length){var P=d++;return{value:l(P,a[P]),done:!1}}return m=!0,{done:!0,value:void 0}}};return A[Symbol.iterator]=function(){return A},A}i("Array.prototype.values",function(a){return a||function(){return s(this,function(l,d){return d})}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},c=this||self;function u(a){var l=typeof a;return l=l!="object"?l:a?Array.isArray(a)?"array":l:"null",l=="array"||l=="object"&&typeof a.length=="number"}function h(a){var l=typeof a;return l=="object"&&a!=null||l=="function"}function f(a,l,d){return a.call.apply(a.bind,arguments)}function p(a,l,d){if(!a)throw Error();if(2<arguments.length){var m=Array.prototype.slice.call(arguments,2);return function(){var A=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(A,m),a.apply(l,A)}}return function(){return a.apply(l,arguments)}}function _(a,l,d){return _=Function.prototype.bind&&Function.prototype.bind.toString().indexOf("native code")!=-1?f:p,_.apply(null,arguments)}function R(a,l){var d=Array.prototype.slice.call(arguments,1);return function(){var m=d.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function D(a,l){function d(){}d.prototype=l.prototype,a.aa=l.prototype,a.prototype=new d,a.prototype.constructor=a,a.Qb=function(m,A,P){for(var L=Array(arguments.length-2),se=2;se<arguments.length;se++)L[se-2]=arguments[se];return l.prototype[A].apply(m,L)}}function V(a){const l=a.length;if(0<l){const d=Array(l);for(let m=0;m<l;m++)d[m]=a[m];return d}return[]}function C(a,l){for(let d=1;d<arguments.length;d++){const m=arguments[d];if(u(m)){const A=a.length||0,P=m.length||0;a.length=A+P;for(let L=0;L<P;L++)a[A+L]=m[L]}else a.push(m)}}class z{constructor(l,d){this.i=l,this.j=d,this.h=0,this.g=null}get(){let l;return 0<this.h?(this.h--,l=this.g,this.g=l.next,l.next=null):l=this.i(),l}}function j(a){return/^[\s\xa0]*$/.test(a)}function U(){var a=c.navigator;return a&&(a=a.userAgent)?a:""}function H(a){return H[" "](a),a}H[" "]=function(){};var ee=U().indexOf("Gecko")!=-1&&!(U().toLowerCase().indexOf("webkit")!=-1&&U().indexOf("Edge")==-1)&&!(U().indexOf("Trident")!=-1||U().indexOf("MSIE")!=-1)&&U().indexOf("Edge")==-1;function K(a,l,d){for(const m in a)l.call(d,a[m],m,a)}function E(a,l){for(const d in a)l.call(void 0,a[d],d,a)}function g(a){const l={};for(const d in a)l[d]=a[d];return l}const I="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function T(a,l){let d,m;for(let A=1;A<arguments.length;A++){m=arguments[A];for(d in m)a[d]=m[d];for(let P=0;P<I.length;P++)d=I[P],Object.prototype.hasOwnProperty.call(m,d)&&(a[d]=m[d])}}function v(a){var l=1;a=a.split(":");const d=[];for(;0<l&&a.length;)d.push(a.shift()),l--;return a.length&&d.push(a.join(":")),d}function b(a){c.setTimeout(()=>{throw a},0)}function y(){var a=ea;let l=null;return a.g&&(l=a.g,a.g=a.g.next,a.g||(a.h=null),l.next=null),l}class dt{constructor(){this.h=this.g=null}add(l,d){const m=Kr.get();m.set(l,d),this.h?this.h.next=m:this.g=m,this.h=m}}var Kr=new z(()=>new Dg,a=>a.reset());class Dg{constructor(){this.next=this.g=this.h=null}set(l,d){this.h=l,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let Wr,Hr=!1,ea=new dt,Mu=()=>{const a=c.Promise.resolve(void 0);Wr=()=>{a.then(kg)}};var kg=()=>{for(var a;a=y();){try{a.h.call(a.g)}catch(d){b(d)}var l=Kr;l.j(a),100>l.h&&(l.h++,a.next=l.g,l.g=a)}Hr=!1};function Ot(){this.s=this.s,this.C=this.C}Ot.prototype.s=!1,Ot.prototype.ma=function(){this.s||(this.s=!0,this.N())},Ot.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function xe(a,l){this.type=a,this.g=this.target=l,this.defaultPrevented=!1}xe.prototype.h=function(){this.defaultPrevented=!0};var Ng=(function(){if(!c.addEventListener||!Object.defineProperty)return!1;var a=!1,l=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};c.addEventListener("test",d,l),c.removeEventListener("test",d,l)}catch{}return a})();function Qr(a,l){if(xe.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a){var d=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;if(this.target=a.target||a.srcElement,this.g=l,l=a.relatedTarget){if(ee){e:{try{H(l.nodeName);var A=!0;break e}catch{}A=!1}A||(l=null)}}else d=="mouseover"?l=a.fromElement:d=="mouseout"&&(l=a.toElement);this.relatedTarget=l,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=typeof a.pointerType=="string"?a.pointerType:Vg[a.pointerType]||"",this.state=a.state,this.i=a,a.defaultPrevented&&Qr.aa.h.call(this)}}D(Qr,xe);var Vg={2:"touch",3:"pen",4:"mouse"};Qr.prototype.h=function(){Qr.aa.h.call(this);var a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var ds="closure_listenable_"+(1e6*Math.random()|0),Og=0;function xg(a,l,d,m,A){this.listener=a,this.proxy=null,this.src=l,this.type=d,this.capture=!!m,this.ha=A,this.key=++Og,this.da=this.fa=!1}function fs(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function ps(a){this.src=a,this.g={},this.h=0}ps.prototype.add=function(a,l,d,m,A){var P=a.toString();a=this.g[P],a||(a=this.g[P]=[],this.h++);var L=na(a,l,m,A);return-1<L?(l=a[L],d||(l.fa=!1)):(l=new xg(l,this.src,P,!!m,A),l.fa=d,a.push(l)),l};function ta(a,l){var d=l.type;if(d in a.g){var m=a.g[d],A=Array.prototype.indexOf.call(m,l,void 0),P;(P=0<=A)&&Array.prototype.splice.call(m,A,1),P&&(fs(l),a.g[d].length==0&&(delete a.g[d],a.h--))}}function na(a,l,d,m){for(var A=0;A<a.length;++A){var P=a[A];if(!P.da&&P.listener==l&&P.capture==!!d&&P.ha==m)return A}return-1}var ra="closure_lm_"+(1e6*Math.random()|0),ia={};function Fu(a,l,d,m,A){if(Array.isArray(l)){for(var P=0;P<l.length;P++)Fu(a,l[P],d,m,A);return null}return d=qu(d),a&&a[ds]?a.K(l,d,h(m)?!!m.capture:!1,A):Lg(a,l,d,!1,m,A)}function Lg(a,l,d,m,A,P){if(!l)throw Error("Invalid event type");var L=h(A)?!!A.capture:!!A,se=oa(a);if(se||(a[ra]=se=new ps(a)),d=se.add(l,d,m,L,P),d.proxy)return d;if(m=Mg(),d.proxy=m,m.src=a,m.listener=d,a.addEventListener)Ng||(A=L),A===void 0&&(A=!1),a.addEventListener(l.toString(),m,A);else if(a.attachEvent)a.attachEvent(Bu(l.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return d}function Mg(){function a(d){return l.call(a.src,a.listener,d)}const l=Fg;return a}function Uu(a,l,d,m,A){if(Array.isArray(l))for(var P=0;P<l.length;P++)Uu(a,l[P],d,m,A);else m=h(m)?!!m.capture:!!m,d=qu(d),a&&a[ds]?(a=a.i,l=String(l).toString(),l in a.g&&(P=a.g[l],d=na(P,d,m,A),-1<d&&(fs(P[d]),Array.prototype.splice.call(P,d,1),P.length==0&&(delete a.g[l],a.h--)))):a&&(a=oa(a))&&(l=a.g[l.toString()],a=-1,l&&(a=na(l,d,m,A)),(d=-1<a?l[a]:null)&&sa(d))}function sa(a){if(typeof a!="number"&&a&&!a.da){var l=a.src;if(l&&l[ds])ta(l.i,a);else{var d=a.type,m=a.proxy;l.removeEventListener?l.removeEventListener(d,m,a.capture):l.detachEvent?l.detachEvent(Bu(d),m):l.addListener&&l.removeListener&&l.removeListener(m),(d=oa(l))?(ta(d,a),d.h==0&&(d.src=null,l[ra]=null)):fs(a)}}}function Bu(a){return a in ia?ia[a]:ia[a]="on"+a}function Fg(a,l){if(a.da)a=!0;else{l=new Qr(l,this);var d=a.listener,m=a.ha||a.src;a.fa&&sa(a),a=d.call(m,l)}return a}function oa(a){return a=a[ra],a instanceof ps?a:null}var aa="__closure_events_fn_"+(1e9*Math.random()>>>0);function qu(a){return typeof a=="function"?a:(a[aa]||(a[aa]=function(l){return a.handleEvent(l)}),a[aa])}function Le(){Ot.call(this),this.i=new ps(this),this.M=this,this.F=null}D(Le,Ot),Le.prototype[ds]=!0,Le.prototype.removeEventListener=function(a,l,d,m){Uu(this,a,l,d,m)};function Ge(a,l){var d,m=a.F;if(m)for(d=[];m;m=m.F)d.push(m);if(a=a.M,m=l.type||l,typeof l=="string")l=new xe(l,a);else if(l instanceof xe)l.target=l.target||a;else{var A=l;l=new xe(m,a),T(l,A)}if(A=!0,d)for(var P=d.length-1;0<=P;P--){var L=l.g=d[P];A=ms(L,m,!0,l)&&A}if(L=l.g=a,A=ms(L,m,!0,l)&&A,A=ms(L,m,!1,l)&&A,d)for(P=0;P<d.length;P++)L=l.g=d[P],A=ms(L,m,!1,l)&&A}Le.prototype.N=function(){if(Le.aa.N.call(this),this.i){var a=this.i,l;for(l in a.g){for(var d=a.g[l],m=0;m<d.length;m++)fs(d[m]);delete a.g[l],a.h--}}this.F=null},Le.prototype.K=function(a,l,d,m){return this.i.add(String(a),l,!1,d,m)},Le.prototype.L=function(a,l,d,m){return this.i.add(String(a),l,!0,d,m)};function ms(a,l,d,m){if(l=a.i.g[String(l)],!l)return!0;l=l.concat();for(var A=!0,P=0;P<l.length;++P){var L=l[P];if(L&&!L.da&&L.capture==d){var se=L.listener,Ne=L.ha||L.src;L.fa&&ta(a.i,L),A=se.call(Ne,m)!==!1&&A}}return A&&!m.defaultPrevented}function zu(a,l,d){if(typeof a=="function")d&&(a=_(a,d));else if(a&&typeof a.handleEvent=="function")a=_(a.handleEvent,a);else throw Error("Invalid listener argument");return 2147483647<Number(l)?-1:c.setTimeout(a,l||0)}function Gu(a){a.g=zu(()=>{a.g=null,a.i&&(a.i=!1,Gu(a))},a.l);const l=a.h;a.h=null,a.m.apply(null,l)}class Ug extends Ot{constructor(l,d){super(),this.m=l,this.l=d,this.h=null,this.i=!1,this.g=null}j(l){this.h=arguments,this.g?this.i=!0:Gu(this)}N(){super.N(),this.g&&(c.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function Jr(a){Ot.call(this),this.h=a,this.g={}}D(Jr,Ot);var ju=[];function $u(a){K(a.g,function(l,d){this.g.hasOwnProperty(d)&&sa(l)},a),a.g={}}Jr.prototype.N=function(){Jr.aa.N.call(this),$u(this)},Jr.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ca=c.JSON.stringify,Bg=c.JSON.parse,qg=class{stringify(a){return c.JSON.stringify(a,void 0)}parse(a){return c.JSON.parse(a,void 0)}};function ua(){}ua.prototype.h=null;function Ku(a){return a.h||(a.h=a.i())}function Wu(){}var Yr={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function la(){xe.call(this,"d")}D(la,xe);function ha(){xe.call(this,"c")}D(ha,xe);var pn={},Hu=null;function gs(){return Hu=Hu||new Le}pn.La="serverreachability";function Qu(a){xe.call(this,pn.La,a)}D(Qu,xe);function Xr(a){const l=gs();Ge(l,new Qu(l))}pn.STAT_EVENT="statevent";function Ju(a,l){xe.call(this,pn.STAT_EVENT,a),this.stat=l}D(Ju,xe);function je(a){const l=gs();Ge(l,new Ju(l,a))}pn.Ma="timingevent";function Yu(a,l){xe.call(this,pn.Ma,a),this.size=l}D(Yu,xe);function Zr(a,l){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return c.setTimeout(function(){a()},l)}function ei(){this.g=!0}ei.prototype.xa=function(){this.g=!1};function zg(a,l,d,m,A,P){a.info(function(){if(a.g)if(P)for(var L="",se=P.split("&"),Ne=0;Ne<se.length;Ne++){var te=se[Ne].split("=");if(1<te.length){var Me=te[0];te=te[1];var Fe=Me.split("_");L=2<=Fe.length&&Fe[1]=="type"?L+(Me+"="+te+"&"):L+(Me+"=redacted&")}}else L=null;else L=P;return"XMLHTTP REQ ("+m+") [attempt "+A+"]: "+l+`
`+d+`
`+L})}function Gg(a,l,d,m,A,P,L){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+A+"]: "+l+`
`+d+`
`+P+" "+L})}function $n(a,l,d,m){a.info(function(){return"XMLHTTP TEXT ("+l+"): "+$g(a,d)+(m?" "+m:"")})}function jg(a,l){a.info(function(){return"TIMEOUT: "+l})}ei.prototype.info=function(){};function $g(a,l){if(!a.g)return l;if(!l)return null;try{var d=JSON.parse(l);if(d){for(a=0;a<d.length;a++)if(Array.isArray(d[a])){var m=d[a];if(!(2>m.length)){var A=m[1];if(Array.isArray(A)&&!(1>A.length)){var P=A[0];if(P!="noop"&&P!="stop"&&P!="close")for(var L=1;L<A.length;L++)A[L]=""}}}}return ca(d)}catch{return l}}var _s={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Xu={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"},da;function ys(){}D(ys,ua),ys.prototype.g=function(){return new XMLHttpRequest},ys.prototype.i=function(){return{}},da=new ys;function xt(a,l,d,m){this.j=a,this.i=l,this.l=d,this.R=m||1,this.U=new Jr(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Zu}function Zu(){this.i=null,this.g="",this.h=!1}var el={},fa={};function pa(a,l,d){a.L=1,a.v=vs(ft(l)),a.m=d,a.P=!0,tl(a,null)}function tl(a,l){a.F=Date.now(),Is(a),a.A=ft(a.v);var d=a.A,m=a.R;Array.isArray(m)||(m=[String(m)]),ml(d.i,"t",m),a.C=0,d=a.j.J,a.h=new Zu,a.g=Vl(a.j,d?l:null,!a.m),0<a.O&&(a.M=new Ug(_(a.Y,a,a.g),a.O)),l=a.U,d=a.g,m=a.ca;var A="readystatechange";Array.isArray(A)||(A&&(ju[0]=A.toString()),A=ju);for(var P=0;P<A.length;P++){var L=Fu(d,A[P],m||l.handleEvent,!1,l.h||l);if(!L)break;l.g[L.key]=L}l=a.H?g(a.H):{},a.m?(a.u||(a.u="POST"),l["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.A,a.u,a.m,l)):(a.u="GET",a.g.ea(a.A,a.u,null,l)),Xr(),zg(a.i,a.u,a.A,a.l,a.R,a.m)}xt.prototype.ca=function(a){a=a.target;const l=this.M;l&&pt(a)==3?l.j():this.Y(a)},xt.prototype.Y=function(a){try{if(a==this.g)e:{const Fe=pt(this.g);var l=this.g.Ba();const Hn=this.g.Z();if(!(3>Fe)&&(Fe!=3||this.g&&(this.h.h||this.g.oa()||vl(this.g)))){this.J||Fe!=4||l==7||(l==8||0>=Hn?Xr(3):Xr(2)),ma(this);var d=this.g.Z();this.X=d;t:if(nl(this)){var m=vl(this.g);a="";var A=m.length,P=pt(this.g)==4;if(!this.h.i){if(typeof TextDecoder>"u"){mn(this),ti(this);var L="";break t}this.h.i=new c.TextDecoder}for(l=0;l<A;l++)this.h.h=!0,a+=this.h.i.decode(m[l],{stream:!(P&&l==A-1)});m.length=0,this.h.g+=a,this.C=0,L=this.h.g}else L=this.g.oa();if(this.o=d==200,Gg(this.i,this.u,this.A,this.l,this.R,Fe,d),this.o){if(this.T&&!this.K){t:{if(this.g){var se,Ne=this.g;if((se=Ne.g?Ne.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!j(se)){var te=se;break t}}te=null}if(d=te)$n(this.i,this.l,d,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,ga(this,d);else{this.o=!1,this.s=3,je(12),mn(this),ti(this);break e}}if(this.P){d=!0;let nt;for(;!this.J&&this.C<L.length;)if(nt=Kg(this,L),nt==fa){Fe==4&&(this.s=4,je(14),d=!1),$n(this.i,this.l,null,"[Incomplete Response]");break}else if(nt==el){this.s=4,je(15),$n(this.i,this.l,L,"[Invalid Chunk]"),d=!1;break}else $n(this.i,this.l,nt,null),ga(this,nt);if(nl(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Fe!=4||L.length!=0||this.h.h||(this.s=1,je(16),d=!1),this.o=this.o&&d,!d)$n(this.i,this.l,L,"[Invalid Chunked Response]"),mn(this),ti(this);else if(0<L.length&&!this.W){this.W=!0;var Me=this.j;Me.g==this&&Me.ba&&!Me.M&&(Me.j.info("Great, no buffering proxy detected. Bytes received: "+L.length),va(Me),Me.M=!0,je(11))}}else $n(this.i,this.l,L,null),ga(this,L);Fe==4&&mn(this),this.o&&!this.J&&(Fe==4?Cl(this.j,this):(this.o=!1,Is(this)))}else u_(this.g),d==400&&0<L.indexOf("Unknown SID")?(this.s=3,je(12)):(this.s=0,je(13)),mn(this),ti(this)}}}catch{}finally{}};function nl(a){return a.g?a.u=="GET"&&a.L!=2&&a.j.Ca:!1}function Kg(a,l){var d=a.C,m=l.indexOf(`
`,d);return m==-1?fa:(d=Number(l.substring(d,m)),isNaN(d)?el:(m+=1,m+d>l.length?fa:(l=l.slice(m,m+d),a.C=m+d,l)))}xt.prototype.cancel=function(){this.J=!0,mn(this)};function Is(a){a.S=Date.now()+a.I,rl(a,a.I)}function rl(a,l){if(a.B!=null)throw Error("WatchDog timer not null");a.B=Zr(_(a.ba,a),l)}function ma(a){a.B&&(c.clearTimeout(a.B),a.B=null)}xt.prototype.ba=function(){this.B=null;const a=Date.now();0<=a-this.S?(jg(this.i,this.A),this.L!=2&&(Xr(),je(17)),mn(this),this.s=2,ti(this)):rl(this,this.S-a)};function ti(a){a.j.G==0||a.J||Cl(a.j,a)}function mn(a){ma(a);var l=a.M;l&&typeof l.ma=="function"&&l.ma(),a.M=null,$u(a.U),a.g&&(l=a.g,a.g=null,l.abort(),l.ma())}function ga(a,l){try{var d=a.j;if(d.G!=0&&(d.g==a||_a(d.h,a))){if(!a.K&&_a(d.h,a)&&d.G==3){try{var m=d.Da.g.parse(l)}catch{m=null}if(Array.isArray(m)&&m.length==3){var A=m;if(A[0]==0){e:if(!d.u){if(d.g)if(d.g.F+3e3<a.F)Ss(d),Rs(d);else break e;Ta(d),je(18)}}else d.za=A[1],0<d.za-d.T&&37500>A[2]&&d.F&&d.v==0&&!d.C&&(d.C=Zr(_(d.Za,d),6e3));if(1>=ol(d.h)&&d.ca){try{d.ca()}catch{}d.ca=void 0}}else _n(d,11)}else if((a.K||d.g==a)&&Ss(d),!j(l))for(A=d.Da.g.parse(l),l=0;l<A.length;l++){let te=A[l];if(d.T=te[0],te=te[1],d.G==2)if(te[0]=="c"){d.K=te[1],d.ia=te[2];const Me=te[3];Me!=null&&(d.la=Me,d.j.info("VER="+d.la));const Fe=te[4];Fe!=null&&(d.Aa=Fe,d.j.info("SVER="+d.Aa));const Hn=te[5];Hn!=null&&typeof Hn=="number"&&0<Hn&&(m=1.5*Hn,d.L=m,d.j.info("backChannelRequestTimeoutMs_="+m)),m=d;const nt=a.g;if(nt){const Cs=nt.g?nt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(Cs){var P=m.h;P.g||Cs.indexOf("spdy")==-1&&Cs.indexOf("quic")==-1&&Cs.indexOf("h2")==-1||(P.j=P.l,P.g=new Set,P.h&&(ya(P,P.h),P.h=null))}if(m.D){const wa=nt.g?nt.g.getResponseHeader("X-HTTP-Session-Id"):null;wa&&(m.ya=wa,ae(m.I,m.D,wa))}}d.G=3,d.l&&d.l.ua(),d.ba&&(d.R=Date.now()-a.F,d.j.info("Handshake RTT: "+d.R+"ms")),m=d;var L=a;if(m.qa=Nl(m,m.J?m.ia:null,m.W),L.K){al(m.h,L);var se=L,Ne=m.L;Ne&&(se.I=Ne),se.B&&(ma(se),Is(se)),m.g=L}else Sl(m);0<d.i.length&&bs(d)}else te[0]!="stop"&&te[0]!="close"||_n(d,7);else d.G==3&&(te[0]=="stop"||te[0]=="close"?te[0]=="stop"?_n(d,7):Ea(d):te[0]!="noop"&&d.l&&d.l.ta(te),d.v=0)}}Xr(4)}catch{}}var Wg=class{constructor(a,l){this.g=a,this.map=l}};function il(a){this.l=a||10,c.PerformanceNavigationTiming?(a=c.performance.getEntriesByType("navigation"),a=0<a.length&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(c.chrome&&c.chrome.loadTimes&&c.chrome.loadTimes()&&c.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function sl(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function ol(a){return a.h?1:a.g?a.g.size:0}function _a(a,l){return a.h?a.h==l:a.g?a.g.has(l):!1}function ya(a,l){a.g?a.g.add(l):a.h=l}function al(a,l){a.h&&a.h==l?a.h=null:a.g&&a.g.has(l)&&a.g.delete(l)}il.prototype.cancel=function(){if(this.i=cl(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function cl(a){if(a.h!=null)return a.i.concat(a.h.D);if(a.g!=null&&a.g.size!==0){let l=a.i;for(const d of a.g.values())l=l.concat(d.D);return l}return V(a.i)}function Hg(a){if(a.V&&typeof a.V=="function")return a.V();if(typeof Map<"u"&&a instanceof Map||typeof Set<"u"&&a instanceof Set)return Array.from(a.values());if(typeof a=="string")return a.split("");if(u(a)){for(var l=[],d=a.length,m=0;m<d;m++)l.push(a[m]);return l}l=[],d=0;for(m in a)l[d++]=a[m];return l}function Qg(a){if(a.na&&typeof a.na=="function")return a.na();if(!a.V||typeof a.V!="function"){if(typeof Map<"u"&&a instanceof Map)return Array.from(a.keys());if(!(typeof Set<"u"&&a instanceof Set)){if(u(a)||typeof a=="string"){var l=[];a=a.length;for(var d=0;d<a;d++)l.push(d);return l}l=[],d=0;for(const m in a)l[d++]=m;return l}}}function ul(a,l){if(a.forEach&&typeof a.forEach=="function")a.forEach(l,void 0);else if(u(a)||typeof a=="string")Array.prototype.forEach.call(a,l,void 0);else for(var d=Qg(a),m=Hg(a),A=m.length,P=0;P<A;P++)l.call(void 0,m[P],d&&d[P],a)}var ll=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function Jg(a,l){if(a){a=a.split("&");for(var d=0;d<a.length;d++){var m=a[d].indexOf("="),A=null;if(0<=m){var P=a[d].substring(0,m);A=a[d].substring(m+1)}else P=a[d];l(P,A?decodeURIComponent(A.replace(/\+/g," ")):"")}}}function gn(a){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,a instanceof gn){this.h=a.h,Es(this,a.j),this.o=a.o,this.g=a.g,Ts(this,a.s),this.l=a.l;var l=a.i,d=new ii;d.i=l.i,l.g&&(d.g=new Map(l.g),d.h=l.h),hl(this,d),this.m=a.m}else a&&(l=String(a).match(ll))?(this.h=!1,Es(this,l[1]||"",!0),this.o=ni(l[2]||""),this.g=ni(l[3]||"",!0),Ts(this,l[4]),this.l=ni(l[5]||"",!0),hl(this,l[6]||"",!0),this.m=ni(l[7]||"")):(this.h=!1,this.i=new ii(null,this.h))}gn.prototype.toString=function(){var a=[],l=this.j;l&&a.push(ri(l,dl,!0),":");var d=this.g;return(d||l=="file")&&(a.push("//"),(l=this.o)&&a.push(ri(l,dl,!0),"@"),a.push(encodeURIComponent(String(d)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.s,d!=null&&a.push(":",String(d))),(d=this.l)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(ri(d,d.charAt(0)=="/"?Zg:Xg,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",ri(d,t_)),a.join("")};function ft(a){return new gn(a)}function Es(a,l,d){a.j=d?ni(l,!0):l,a.j&&(a.j=a.j.replace(/:$/,""))}function Ts(a,l){if(l){if(l=Number(l),isNaN(l)||0>l)throw Error("Bad port number "+l);a.s=l}else a.s=null}function hl(a,l,d){l instanceof ii?(a.i=l,n_(a.i,a.h)):(d||(l=ri(l,e_)),a.i=new ii(l,a.h))}function ae(a,l,d){a.i.set(l,d)}function vs(a){return ae(a,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),a}function ni(a,l){return a?l?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function ri(a,l,d){return typeof a=="string"?(a=encodeURI(a).replace(l,Yg),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function Yg(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var dl=/[#\/\?@]/g,Xg=/[#\?:]/g,Zg=/[#\?]/g,e_=/[#\?@]/g,t_=/#/g;function ii(a,l){this.h=this.g=null,this.i=a||null,this.j=!!l}function Lt(a){a.g||(a.g=new Map,a.h=0,a.i&&Jg(a.i,function(l,d){a.add(decodeURIComponent(l.replace(/\+/g," ")),d)}))}r=ii.prototype,r.add=function(a,l){Lt(this),this.i=null,a=Kn(this,a);var d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(l),this.h+=1,this};function fl(a,l){Lt(a),l=Kn(a,l),a.g.has(l)&&(a.i=null,a.h-=a.g.get(l).length,a.g.delete(l))}function pl(a,l){return Lt(a),l=Kn(a,l),a.g.has(l)}r.forEach=function(a,l){Lt(this),this.g.forEach(function(d,m){d.forEach(function(A){a.call(l,A,m,this)},this)},this)},r.na=function(){Lt(this);const a=Array.from(this.g.values()),l=Array.from(this.g.keys()),d=[];for(let m=0;m<l.length;m++){const A=a[m];for(let P=0;P<A.length;P++)d.push(l[m])}return d},r.V=function(a){Lt(this);let l=[];if(typeof a=="string")pl(this,a)&&(l=l.concat(this.g.get(Kn(this,a))));else{a=Array.from(this.g.values());for(let d=0;d<a.length;d++)l=l.concat(a[d])}return l},r.set=function(a,l){return Lt(this),this.i=null,a=Kn(this,a),pl(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[l]),this.h+=1,this},r.get=function(a,l){return a?(a=this.V(a),0<a.length?String(a[0]):l):l};function ml(a,l,d){fl(a,l),0<d.length&&(a.i=null,a.g.set(Kn(a,l),V(d)),a.h+=d.length)}r.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],l=Array.from(this.g.keys());for(var d=0;d<l.length;d++){var m=l[d];const P=encodeURIComponent(String(m)),L=this.V(m);for(m=0;m<L.length;m++){var A=P;L[m]!==""&&(A+="="+encodeURIComponent(String(L[m]))),a.push(A)}}return this.i=a.join("&")};function Kn(a,l){return l=String(l),a.j&&(l=l.toLowerCase()),l}function n_(a,l){l&&!a.j&&(Lt(a),a.i=null,a.g.forEach(function(d,m){var A=m.toLowerCase();m!=A&&(fl(this,m),ml(this,A,d))},a)),a.j=l}function r_(a,l){const d=new ei;if(c.Image){const m=new Image;m.onload=R(Mt,d,"TestLoadImage: loaded",!0,l,m),m.onerror=R(Mt,d,"TestLoadImage: error",!1,l,m),m.onabort=R(Mt,d,"TestLoadImage: abort",!1,l,m),m.ontimeout=R(Mt,d,"TestLoadImage: timeout",!1,l,m),c.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else l(!1)}function i_(a,l){const d=new ei,m=new AbortController,A=setTimeout(()=>{m.abort(),Mt(d,"TestPingServer: timeout",!1,l)},1e4);fetch(a,{signal:m.signal}).then(P=>{clearTimeout(A),P.ok?Mt(d,"TestPingServer: ok",!0,l):Mt(d,"TestPingServer: server error",!1,l)}).catch(()=>{clearTimeout(A),Mt(d,"TestPingServer: error",!1,l)})}function Mt(a,l,d,m,A){try{A&&(A.onload=null,A.onerror=null,A.onabort=null,A.ontimeout=null),m(d)}catch{}}function s_(){this.g=new qg}function o_(a,l,d){const m=d||"";try{ul(a,function(A,P){let L=A;h(A)&&(L=ca(A)),l.push(m+P+"="+encodeURIComponent(L))})}catch(A){throw l.push(m+"type="+encodeURIComponent("_badmap")),A}}function si(a){this.l=a.Ub||null,this.j=a.eb||!1}D(si,ua),si.prototype.g=function(){return new ws(this.l,this.j)},si.prototype.i=(function(a){return function(){return a}})({});function ws(a,l){Le.call(this),this.D=a,this.o=l,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}D(ws,Le),r=ws.prototype,r.open=function(a,l){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.B=a,this.A=l,this.readyState=1,ai(this)},r.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");this.g=!0;const l={headers:this.u,method:this.B,credentials:this.m,cache:void 0};a&&(l.body=a),(this.D||c).fetch(new Request(this.A,l)).then(this.Sa.bind(this),this.ga.bind(this))},r.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&this.readyState!=4&&(this.g=!1,oi(this)),this.readyState=0},r.Sa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,ai(this)),this.g&&(this.readyState=3,ai(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(typeof c.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;gl(this)}else a.text().then(this.Ra.bind(this),this.ga.bind(this))};function gl(a){a.j.read().then(a.Pa.bind(a)).catch(a.ga.bind(a))}r.Pa=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var l=a.value?a.value:new Uint8Array(0);(l=this.v.decode(l,{stream:!a.done}))&&(this.response=this.responseText+=l)}a.done?oi(this):ai(this),this.readyState==3&&gl(this)}},r.Ra=function(a){this.g&&(this.response=this.responseText=a,oi(this))},r.Qa=function(a){this.g&&(this.response=a,oi(this))},r.ga=function(){this.g&&oi(this)};function oi(a){a.readyState=4,a.l=null,a.j=null,a.v=null,ai(a)}r.setRequestHeader=function(a,l){this.u.append(a,l)},r.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},r.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],l=this.h.entries();for(var d=l.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=l.next();return a.join(`\r
`)};function ai(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ws.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function _l(a){let l="";return K(a,function(d,m){l+=m,l+=":",l+=d,l+=`\r
`}),l}function Ia(a,l,d){e:{for(m in d){var m=!1;break e}m=!0}m||(d=_l(d),typeof a=="string"?d!=null&&encodeURIComponent(String(d)):ae(a,l,d))}function ge(a){Le.call(this),this.headers=new Map,this.o=a||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}D(ge,Le);var a_=/^https?$/i,c_=["POST","PUT"];r=ge.prototype,r.Ha=function(a){this.J=a},r.ea=function(a,l,d,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);l=l?l.toUpperCase():"GET",this.D=a,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():da.g(),this.v=this.o?Ku(this.o):Ku(da),this.g.onreadystatechange=_(this.Ea,this);try{this.B=!0,this.g.open(l,String(a),!0),this.B=!1}catch(P){yl(this,P);return}if(a=d||"",d=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var A in m)d.set(A,m[A]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const P of m.keys())d.set(P,m.get(P));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(d.keys()).find(P=>P.toLowerCase()=="content-type"),A=c.FormData&&a instanceof c.FormData,!(0<=Array.prototype.indexOf.call(c_,l,void 0))||m||A||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[P,L]of d)this.g.setRequestHeader(P,L);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Tl(this),this.u=!0,this.g.send(a),this.u=!1}catch(P){yl(this,P)}};function yl(a,l){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=l,a.m=5,Il(a),As(a)}function Il(a){a.A||(a.A=!0,Ge(a,"complete"),Ge(a,"error"))}r.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=a||7,Ge(this,"complete"),Ge(this,"abort"),As(this))},r.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),As(this,!0)),ge.aa.N.call(this)},r.Ea=function(){this.s||(this.B||this.u||this.j?El(this):this.bb())},r.bb=function(){El(this)};function El(a){if(a.h&&typeof o<"u"&&(!a.v[1]||pt(a)!=4||a.Z()!=2)){if(a.u&&pt(a)==4)zu(a.Ea,0,a);else if(Ge(a,"readystatechange"),pt(a)==4){a.h=!1;try{const L=a.Z();e:switch(L){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var l=!0;break e;default:l=!1}var d;if(!(d=l)){var m;if(m=L===0){var A=String(a.D).match(ll)[1]||null;!A&&c.self&&c.self.location&&(A=c.self.location.protocol.slice(0,-1)),m=!a_.test(A?A.toLowerCase():"")}d=m}if(d)Ge(a,"complete"),Ge(a,"success");else{a.m=6;try{var P=2<pt(a)?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.Z()+"]",Il(a)}}finally{As(a)}}}}function As(a,l){if(a.g){Tl(a);const d=a.g,m=a.v[0]?()=>{}:null;a.g=null,a.v=null,l||Ge(a,"ready");try{d.onreadystatechange=m}catch{}}}function Tl(a){a.I&&(c.clearTimeout(a.I),a.I=null)}r.isActive=function(){return!!this.g};function pt(a){return a.g?a.g.readyState:0}r.Z=function(){try{return 2<pt(this)?this.g.status:-1}catch{return-1}},r.oa=function(){try{return this.g?this.g.responseText:""}catch{return""}},r.Oa=function(a){if(this.g){var l=this.g.responseText;return a&&l.indexOf(a)==0&&(l=l.substring(a.length)),Bg(l)}};function vl(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.H){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function u_(a){const l={};a=(a.g&&2<=pt(a)&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(j(a[m]))continue;var d=v(a[m]);const A=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const P=l[A]||[];l[A]=P,P.push(d)}E(l,function(m){return m.join(", ")})}r.Ba=function(){return this.m},r.Ka=function(){return typeof this.l=="string"?this.l:String(this.l)};function ci(a,l,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||l}function wl(a){this.Aa=0,this.i=[],this.j=new ei,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=ci("failFast",!1,a),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=ci("baseRetryDelayMs",5e3,a),this.cb=ci("retryDelaySeedMs",1e4,a),this.Wa=ci("forwardChannelMaxRetries",2,a),this.wa=ci("forwardChannelRequestTimeoutMs",2e4,a),this.pa=a&&a.xmlHttpFactory||void 0,this.Xa=a&&a.Tb||void 0,this.Ca=a&&a.useFetchStreams||!1,this.L=void 0,this.J=a&&a.supportsCrossDomainXhr||!1,this.K="",this.h=new il(a&&a.concurrentRequestLimit),this.Da=new s_,this.P=a&&a.fastHandshake||!1,this.O=a&&a.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=a&&a.Rb||!1,a&&a.xa&&this.j.xa(),a&&a.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&a&&a.detectBufferingProxy||!1,this.ja=void 0,a&&a.longPollingTimeout&&0<a.longPollingTimeout&&(this.ja=a.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}r=wl.prototype,r.la=8,r.G=1,r.connect=function(a,l,d,m){je(0),this.W=a,this.H=l||{},d&&m!==void 0&&(this.H.OSID=d,this.H.OAID=m),this.F=this.X,this.I=Nl(this,null,this.W),bs(this)};function Ea(a){if(Al(a),a.G==3){var l=a.U++,d=ft(a.I);if(ae(d,"SID",a.K),ae(d,"RID",l),ae(d,"TYPE","terminate"),ui(a,d),l=new xt(a,a.j,l),l.L=2,l.v=vs(ft(d)),d=!1,c.navigator&&c.navigator.sendBeacon)try{d=c.navigator.sendBeacon(l.v.toString(),"")}catch{}!d&&c.Image&&(new Image().src=l.v,d=!0),d||(l.g=Vl(l.j,null),l.g.ea(l.v)),l.F=Date.now(),Is(l)}kl(a)}function Rs(a){a.g&&(va(a),a.g.cancel(),a.g=null)}function Al(a){Rs(a),a.u&&(c.clearTimeout(a.u),a.u=null),Ss(a),a.h.cancel(),a.s&&(typeof a.s=="number"&&c.clearTimeout(a.s),a.s=null)}function bs(a){if(!sl(a.h)&&!a.s){a.s=!0;var l=a.Ga;Wr||Mu(),Hr||(Wr(),Hr=!0),ea.add(l,a),a.B=0}}function l_(a,l){return ol(a.h)>=a.h.j-(a.s?1:0)?!1:a.s?(a.i=l.D.concat(a.i),!0):a.G==1||a.G==2||a.B>=(a.Va?0:a.Wa)?!1:(a.s=Zr(_(a.Ga,a,l),Dl(a,a.B)),a.B++,!0)}r.Ga=function(a){if(this.s)if(this.s=null,this.G==1){if(!a){this.U=Math.floor(1e5*Math.random()),a=this.U++;const A=new xt(this,this.j,a);let P=this.o;if(this.S&&(P?(P=g(P),T(P,this.S)):P=this.S),this.m!==null||this.O||(A.H=P,P=null),this.P)e:{for(var l=0,d=0;d<this.i.length;d++){t:{var m=this.i[d];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(l+=m,4096<l){l=d;break e}if(l===4096||d===this.i.length-1){l=d+1;break e}}l=1e3}else l=1e3;l=bl(this,A,l),d=ft(this.I),ae(d,"RID",a),ae(d,"CVER",22),this.D&&ae(d,"X-HTTP-Session-Id",this.D),ui(this,d),P&&(this.O?l="headers="+encodeURIComponent(String(_l(P)))+"&"+l:this.m&&Ia(d,this.m,P)),ya(this.h,A),this.Ua&&ae(d,"TYPE","init"),this.P?(ae(d,"$req",l),ae(d,"SID","null"),A.T=!0,pa(A,d,null)):pa(A,d,l),this.G=2}}else this.G==3&&(a?Rl(this,a):this.i.length==0||sl(this.h)||Rl(this))};function Rl(a,l){var d;l?d=l.l:d=a.U++;const m=ft(a.I);ae(m,"SID",a.K),ae(m,"RID",d),ae(m,"AID",a.T),ui(a,m),a.m&&a.o&&Ia(m,a.m,a.o),d=new xt(a,a.j,d,a.B+1),a.m===null&&(d.H=a.o),l&&(a.i=l.D.concat(a.i)),l=bl(a,d,1e3),d.I=Math.round(.5*a.wa)+Math.round(.5*a.wa*Math.random()),ya(a.h,d),pa(d,m,l)}function ui(a,l){a.H&&K(a.H,function(d,m){ae(l,m,d)}),a.l&&ul({},function(d,m){ae(l,m,d)})}function bl(a,l,d){d=Math.min(a.i.length,d);var m=a.l?_(a.l.Na,a.l,a):null;e:{var A=a.i;let P=-1;for(;;){const L=["count="+d];P==-1?0<d?(P=A[0].g,L.push("ofs="+P)):P=0:L.push("ofs="+P);let se=!0;for(let Ne=0;Ne<d;Ne++){let te=A[Ne].g;const Me=A[Ne].map;if(te-=P,0>te)P=Math.max(0,A[Ne].g-100),se=!1;else try{o_(Me,L,"req"+te+"_")}catch{m&&m(Me)}}if(se){m=L.join("&");break e}}}return a=a.i.splice(0,d),l.D=a,m}function Sl(a){if(!a.g&&!a.u){a.Y=1;var l=a.Fa;Wr||Mu(),Hr||(Wr(),Hr=!0),ea.add(l,a),a.v=0}}function Ta(a){return a.g||a.u||3<=a.v?!1:(a.Y++,a.u=Zr(_(a.Fa,a),Dl(a,a.v)),a.v++,!0)}r.Fa=function(){if(this.u=null,Pl(this),this.ba&&!(this.M||this.g==null||0>=this.R)){var a=2*this.R;this.j.info("BP detection timer enabled: "+a),this.A=Zr(_(this.ab,this),a)}},r.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,je(10),Rs(this),Pl(this))};function va(a){a.A!=null&&(c.clearTimeout(a.A),a.A=null)}function Pl(a){a.g=new xt(a,a.j,"rpc",a.Y),a.m===null&&(a.g.H=a.o),a.g.O=0;var l=ft(a.qa);ae(l,"RID","rpc"),ae(l,"SID",a.K),ae(l,"AID",a.T),ae(l,"CI",a.F?"0":"1"),!a.F&&a.ja&&ae(l,"TO",a.ja),ae(l,"TYPE","xmlhttp"),ui(a,l),a.m&&a.o&&Ia(l,a.m,a.o),a.L&&(a.g.I=a.L);var d=a.g;a=a.ia,d.L=1,d.v=vs(ft(l)),d.m=null,d.P=!0,tl(d,a)}r.Za=function(){this.C!=null&&(this.C=null,Rs(this),Ta(this),je(19))};function Ss(a){a.C!=null&&(c.clearTimeout(a.C),a.C=null)}function Cl(a,l){var d=null;if(a.g==l){Ss(a),va(a),a.g=null;var m=2}else if(_a(a.h,l))d=l.D,al(a.h,l),m=1;else return;if(a.G!=0){if(l.o)if(m==1){d=l.m?l.m.length:0,l=Date.now()-l.F;var A=a.B;m=gs(),Ge(m,new Yu(m,d)),bs(a)}else Sl(a);else if(A=l.s,A==3||A==0&&0<l.X||!(m==1&&l_(a,l)||m==2&&Ta(a)))switch(d&&0<d.length&&(l=a.h,l.i=l.i.concat(d)),A){case 1:_n(a,5);break;case 4:_n(a,10);break;case 3:_n(a,6);break;default:_n(a,2)}}}function Dl(a,l){let d=a.Ta+Math.floor(Math.random()*a.cb);return a.isActive()||(d*=2),d*l}function _n(a,l){if(a.j.info("Error code "+l),l==2){var d=_(a.fb,a),m=a.Xa;const A=!m;m=new gn(m||"//www.google.com/images/cleardot.gif"),c.location&&c.location.protocol=="http"||Es(m,"https"),vs(m),A?r_(m.toString(),d):i_(m.toString(),d)}else je(2);a.G=0,a.l&&a.l.sa(l),kl(a),Al(a)}r.fb=function(a){a?(this.j.info("Successfully pinged google.com"),je(2)):(this.j.info("Failed to ping google.com"),je(1))};function kl(a){if(a.G=0,a.ka=[],a.l){const l=cl(a.h);(l.length!=0||a.i.length!=0)&&(C(a.ka,l),C(a.ka,a.i),a.h.i.length=0,V(a.i),a.i.length=0),a.l.ra()}}function Nl(a,l,d){var m=d instanceof gn?ft(d):new gn(d);if(m.g!="")l&&(m.g=l+"."+m.g),Ts(m,m.s);else{var A=c.location;m=A.protocol,l=l?l+"."+A.hostname:A.hostname,A=+A.port;var P=new gn(null);m&&Es(P,m),l&&(P.g=l),A&&Ts(P,A),d&&(P.l=d),m=P}return d=a.D,l=a.ya,d&&l&&ae(m,d,l),ae(m,"VER",a.la),ui(a,m),m}function Vl(a,l,d){if(l&&!a.J)throw Error("Can't create secondary domain capable XhrIo object.");return l=a.Ca&&!a.pa?new ge(new si({eb:d})):new ge(a.pa),l.Ha(a.J),l}r.isActive=function(){return!!this.l&&this.l.isActive(this)};function Ol(){}r=Ol.prototype,r.ua=function(){},r.ta=function(){},r.sa=function(){},r.ra=function(){},r.isActive=function(){return!0},r.Na=function(){};function Ps(){}Ps.prototype.g=function(a,l){return new Ye(a,l)};function Ye(a,l){Le.call(this),this.g=new wl(l),this.l=a,this.h=l&&l.messageUrlParams||null,a=l&&l.messageHeaders||null,l&&l.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=l&&l.initMessageHeaders||null,l&&l.messageContentType&&(a?a["X-WebChannel-Content-Type"]=l.messageContentType:a={"X-WebChannel-Content-Type":l.messageContentType}),l&&l.va&&(a?a["X-WebChannel-Client-Profile"]=l.va:a={"X-WebChannel-Client-Profile":l.va}),this.g.S=a,(a=l&&l.Sb)&&!j(a)&&(this.g.m=a),this.v=l&&l.supportsCrossDomainXhr||!1,this.u=l&&l.sendRawJson||!1,(l=l&&l.httpSessionIdParam)&&!j(l)&&(this.g.D=l,a=this.h,a!==null&&l in a&&(a=this.h,l in a&&delete a[l])),this.j=new Wn(this)}D(Ye,Le),Ye.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Ye.prototype.close=function(){Ea(this.g)},Ye.prototype.o=function(a){var l=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.u&&(d={},d.__data__=ca(a),a=d);l.i.push(new Wg(l.Ya++,a)),l.G==3&&bs(l)},Ye.prototype.N=function(){this.g.l=null,delete this.j,Ea(this.g),delete this.g,Ye.aa.N.call(this)};function xl(a){la.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var l=a.__sm__;if(l){e:{for(const d in l){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,l=l!==null&&a in l?l[a]:void 0),this.data=l}else this.data=a}D(xl,la);function Ll(){ha.call(this),this.status=1}D(Ll,ha);function Wn(a){this.g=a}D(Wn,Ol),Wn.prototype.ua=function(){Ge(this.g,"a")},Wn.prototype.ta=function(a){Ge(this.g,new xl(a))},Wn.prototype.sa=function(a){Ge(this.g,new Ll)},Wn.prototype.ra=function(){Ge(this.g,"b")},Ps.prototype.createWebChannel=Ps.prototype.g,Ye.prototype.send=Ye.prototype.o,Ye.prototype.open=Ye.prototype.m,Ye.prototype.close=Ye.prototype.close,tp=function(){return new Ps},ep=function(){return gs()},Zf=pn,$a={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},_s.NO_ERROR=0,_s.TIMEOUT=8,_s.HTTP_ERROR=6,Gs=_s,Xu.COMPLETE="complete",Xf=Xu,Wu.EventType=Yr,Yr.OPEN="a",Yr.CLOSE="b",Yr.ERROR="c",Yr.MESSAGE="d",Le.prototype.listen=Le.prototype.K,yi=Wu,Yf=si,ge.prototype.listenOnce=ge.prototype.L,ge.prototype.getLastError=ge.prototype.Ka,ge.prototype.getLastErrorCode=ge.prototype.Ba,ge.prototype.getStatus=ge.prototype.Z,ge.prototype.getResponseJson=ge.prototype.Oa,ge.prototype.getResponseText=ge.prototype.oa,ge.prototype.send=ge.prototype.ea,ge.prototype.setWithCredentials=ge.prototype.Ha,Jf=ge}).apply(typeof Ns<"u"?Ns:typeof self<"u"?self:typeof window<"u"?window:{});const hh="@firebase/firestore";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ce{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Ce.UNAUTHENTICATED=new Ce(null),Ce.GOOGLE_CREDENTIALS=new Ce("google-credentials-uid"),Ce.FIRST_PARTY=new Ce("first-party-uid"),Ce.MOCK_USER=new Ce("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Vr="10.12.5";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xt=new gc("@firebase/firestore");function Zn(){return Xt.logLevel}function bv(r){Xt.setLogLevel(r)}function N(r,...e){if(Xt.logLevel<=J.DEBUG){const t=e.map(Mc);Xt.debug(`Firestore (${Vr}): ${r}`,...t)}}function Te(r,...e){if(Xt.logLevel<=J.ERROR){const t=e.map(Mc);Xt.error(`Firestore (${Vr}): ${r}`,...t)}}function Je(r,...e){if(Xt.logLevel<=J.WARN){const t=e.map(Mc);Xt.warn(`Firestore (${Vr}): ${r}`,...t)}}function Mc(r){if(typeof r=="string")return r;try{/**
* @license
* Copyright 2020 Google LLC
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/return(function(t){return JSON.stringify(t)})(r)}catch{return r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(r="Unexpected state"){const e=`FIRESTORE (${Vr}) INTERNAL ASSERTION FAILED: `+r;throw Te(e),new Error(e)}function q(r,e){r||F()}function Sv(r,e){r||F()}function x(r,e){return r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const S={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class k extends it{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class be{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class rp{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Ce.UNAUTHENTICATED)))}shutdown(){}}class Pv{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Cv{constructor(e){this.t=e,this.currentUser=Ce.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){let n=this.i;const i=u=>this.i!==n?(n=this.i,t(u)):Promise.resolve();let s=new be;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new be,e.enqueueRetryable((()=>i(this.currentUser)))};const o=()=>{const u=s;e.enqueueRetryable((async()=>{await u.promise,await i(this.currentUser)}))},c=u=>{N("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.auth.addAuthTokenListener(this.o),o()};this.t.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?c(u):(N("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new be)}}),0),o()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((n=>this.i!==e?(N("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):n?(q(typeof n.accessToken=="string"),new np(n.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.auth.removeAuthTokenListener(this.o)}u(){const e=this.auth&&this.auth.getUid();return q(e===null||typeof e=="string"),new Ce(e)}}class Dv{constructor(e,t,n){this.l=e,this.h=t,this.P=n,this.type="FirstParty",this.user=Ce.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const e=this.T();return e&&this.I.set("Authorization",e),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class kv{constructor(e,t,n){this.l=e,this.h=t,this.P=n}getToken(){return Promise.resolve(new Dv(this.l,this.h,this.P))}start(e,t){e.enqueueRetryable((()=>t(Ce.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ip{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Nv{constructor(e){this.A=e,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(e,t){const n=s=>{s.error!=null&&N("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.R;return this.R=s.token,N("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable((()=>n(s)))};const i=s=>{N("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.appCheck.addTokenListener(this.o)};this.A.onInit((s=>i(s))),setTimeout((()=>{if(!this.appCheck){const s=this.A.getImmediate({optional:!0});s?i(s):N("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(q(typeof t.token=="string"),this.R=t.token,new ip(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.appCheck.removeTokenListener(this.o)}}class Vv{getToken(){return Promise.resolve(new ip(""))}invalidateToken(){}start(e,t){}shutdown(){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ov(r){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(r);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let n=0;n<r;n++)t[n]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fc{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=Math.floor(256/e.length)*e.length;let n="";for(;n.length<20;){const i=Ov(40);for(let s=0;s<i.length;++s)n.length<20&&i[s]<t&&(n+=e.charAt(i[s]%e.length))}return n}}function $(r,e){return r<e?-1:r>e?1:0}function dr(r,e,t){return r.length===e.length&&r.every(((n,i)=>t(n,e[i])))}function sp(r){return r+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fe{constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new k(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new k(S.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800)throw new k(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new k(S.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}static now(){return fe.fromMillis(Date.now())}static fromDate(e){return fe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor(1e6*(e-1e3*t));return new fe(t,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?$(this.nanoseconds,e.nanoseconds):$(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds- -62135596800;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class G{constructor(e){this.timestamp=e}static fromTimestamp(e){return new G(e)}static min(){return new G(new fe(0,0))}static max(){return new G(new fe(253402300799,999999999))}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mi{constructor(e,t,n){t===void 0?t=0:t>e.length&&F(),n===void 0?n=e.length-t:n>e.length-t&&F(),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return Mi.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Mi?e.forEach((n=>{t.push(n)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let i=0;i<n;i++){const s=e.get(i),o=t.get(i);if(s<o)return-1;if(s>o)return 1}return e.length<t.length?-1:e.length>t.length?1:0}}class Y extends Mi{construct(e,t,n){return new Y(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new k(S.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((i=>i.length>0)))}return new Y(t)}static emptyPath(){return new Y([])}}const xv=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ue extends Mi{construct(e,t,n){return new ue(e,t,n)}static isValidIdentifier(e){return xv.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ue.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)==="__name__"}static keyField(){return new ue(["__name__"])}static fromServerFormat(e){const t=[];let n="",i=0;const s=()=>{if(n.length===0)throw new k(S.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let o=!1;for(;i<e.length;){const c=e[i];if(c==="\\"){if(i+1===e.length)throw new k(S.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new k(S.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=u,i+=2}else c==="`"?(o=!o,i++):c!=="."||o?(n+=c,i++):(s(),i++)}if(s(),o)throw new k(S.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ue(t)}static emptyPath(){return new ue([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.path=e}static fromPath(e){return new M(Y.fromString(e))}static fromName(e){return new M(Y.fromString(e).popFirst(5))}static empty(){return new M(Y.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&Y.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return Y.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new M(new Y(e.slice()))}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e,t,n,i){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=i}}function Ka(r){return r.fields.find((e=>e.kind===2))}function En(r){return r.fields.filter((e=>e.kind!==2))}function Lv(r,e){let t=$(r.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let n=0;n<Math.min(r.fields.length,e.fields.length);++n)if(t=Mv(r.fields[n],e.fields[n]),t!==0)return t;return $(r.fields.length,e.fields.length)}fr.UNKNOWN_ID=-1;class Pn{constructor(e,t){this.fieldPath=e,this.kind=t}}function Mv(r,e){const t=ue.comparator(r.fieldPath,e.fieldPath);return t!==0?t:$(r.kind,e.kind)}class pr{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new pr(0,Xe.min())}}function op(r,e){const t=r.toTimestamp().seconds,n=r.toTimestamp().nanoseconds+1,i=G.fromTimestamp(n===1e9?new fe(t+1,0):new fe(t,n));return new Xe(i,M.empty(),e)}function ap(r){return new Xe(r.readTime,r.key,-1)}class Xe{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new Xe(G.min(),M.empty(),-1)}static max(){return new Xe(G.max(),M.empty(),-1)}}function Uc(r,e){let t=r.readTime.compareTo(e.readTime);return t!==0?t:(t=M.comparator(r.documentKey,e.documentKey),t!==0?t:$(r.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cp="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class up{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function an(r){if(r.code!==S.FAILED_PRECONDITION||r.message!==cp)throw r;N("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class w{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&F(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new w(((n,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(n,i)},this.catchCallback=s=>{this.wrapFailure(t,s).next(n,i)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof w?t:w.resolve(t)}catch(t){return w.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):w.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):w.reject(t)}static resolve(e){return new w(((t,n)=>{t(e)}))}static reject(e){return new w(((t,n)=>{n(e)}))}static waitFor(e){return new w(((t,n)=>{let i=0,s=0,o=!1;e.forEach((c=>{++i,c.next((()=>{++s,o&&s===i&&t()}),(u=>n(u)))})),o=!0,s===i&&t()}))}static or(e){let t=w.resolve(!1);for(const n of e)t=t.next((i=>i?w.resolve(i):n()));return t}static forEach(e,t){const n=[];return e.forEach(((i,s)=>{n.push(t.call(this,i,s))})),this.waitFor(n)}static mapArray(e,t){return new w(((n,i)=>{const s=e.length,o=new Array(s);let c=0;for(let u=0;u<s;u++){const h=u;t(e[h]).next((f=>{o[h]=f,++c,c===s&&n(o)}),(f=>i(f)))}}))}static doWhile(e,t){return new w(((n,i)=>{const s=()=>{e()===!0?t().next((()=>{s()}),i):n()};s()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.V=new be,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{t.error?this.V.reject(new Ai(e,t.error)):this.V.resolve()},this.transaction.onerror=n=>{const i=Bc(n.target.error);this.V.reject(new Ai(e,i))}}static open(e,t,n,i){try{return new Vo(t,e.transaction(i,n))}catch(s){throw new Ai(t,s)}}get m(){return this.V.promise}abort(e){e&&this.V.reject(e),this.aborted||(N("SimpleDb","Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Uv(t)}}class ct{constructor(e,t,n){this.name=e,this.version=t,this.p=n,ct.S(Re())===12.2&&Te("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(e){return N("SimpleDb","Removing database:",e),Tn(window.indexedDB.deleteDatabase(e)).toPromise()}static D(){if(!Nd())return!1;if(ct.C())return!0;const e=Re(),t=ct.S(e),n=0<t&&t<10,i=lp(e),s=0<i&&i<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static C(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)===null||e===void 0?void 0:e.v)==="YES"}static F(e,t){return e.store(t)}static S(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}async M(e){return this.db||(N("SimpleDb","Opening database:",this.name),this.db=await new Promise(((t,n)=>{const i=indexedDB.open(this.name,this.version);i.onsuccess=s=>{const o=s.target.result;t(o)},i.onblocked=()=>{n(new Ai(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},i.onerror=s=>{const o=s.target.error;o.name==="VersionError"?n(new k(S.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?n(new k(S.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):n(new Ai(e,o))},i.onupgradeneeded=s=>{N("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',s.oldVersion);const o=s.target.result;this.p.O(o,i.transaction,s.oldVersion,this.version).next((()=>{N("SimpleDb","Database upgrade to version "+this.version+" complete")}))}}))),this.N&&(this.db.onversionchange=t=>this.N(t)),this.db}L(e){this.N=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,i){const s=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.M(e);const c=Vo.open(this.db,e,s?"readonly":"readwrite",n),u=i(c).next((h=>(c.g(),h))).catch((h=>(c.abort(h),w.reject(h)))).toPromise();return u.catch((()=>{})),await c.m,u}catch(c){const u=c,h=u.name!=="FirebaseError"&&o<3;if(N("SimpleDb","Transaction failed with error:",u.message,"Retrying:",h),this.close(),!h)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function lp(r){const e=r.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class Fv{constructor(e){this.B=e,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(e){this.B=e}done(){this.k=!0}$(e){this.q=e}delete(){return Tn(this.B.delete())}}class Ai extends k{constructor(e,t){super(S.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function cn(r){return r.name==="IndexedDbTransactionError"}class Uv{constructor(e){this.store=e}put(e,t){let n;return t!==void 0?(N("SimpleDb","PUT",this.store.name,e,t),n=this.store.put(t,e)):(N("SimpleDb","PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Tn(n)}add(e){return N("SimpleDb","ADD",this.store.name,e,e),Tn(this.store.add(e))}get(e){return Tn(this.store.get(e)).next((t=>(t===void 0&&(t=null),N("SimpleDb","GET",this.store.name,e,t),t)))}delete(e){return N("SimpleDb","DELETE",this.store.name,e),Tn(this.store.delete(e))}count(){return N("SimpleDb","COUNT",this.store.name),Tn(this.store.count())}U(e,t){const n=this.options(e,t),i=n.index?this.store.index(n.index):this.store;if(typeof i.getAll=="function"){const s=i.getAll(n.range);return new w(((o,c)=>{s.onerror=u=>{c(u.target.error)},s.onsuccess=u=>{o(u.target.result)}}))}{const s=this.cursor(n),o=[];return this.W(s,((c,u)=>{o.push(u)})).next((()=>o))}}G(e,t){const n=this.store.getAll(e,t===null?void 0:t);return new w(((i,s)=>{n.onerror=o=>{s(o.target.error)},n.onsuccess=o=>{i(o.target.result)}}))}j(e,t){N("SimpleDb","DELETE ALL",this.store.name);const n=this.options(e,t);n.H=!1;const i=this.cursor(n);return this.W(i,((s,o,c)=>c.delete()))}J(e,t){let n;t?n=e:(n={},t=e);const i=this.cursor(n);return this.W(i,t)}Y(e){const t=this.cursor({});return new w(((n,i)=>{t.onerror=s=>{const o=Bc(s.target.error);i(o)},t.onsuccess=s=>{const o=s.target.result;o?e(o.primaryKey,o.value).next((c=>{c?o.continue():n()})):n()}}))}W(e,t){const n=[];return new w(((i,s)=>{e.onerror=o=>{s(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void i();const u=new Fv(c),h=t(c.primaryKey,c.value,u);if(h instanceof w){const f=h.catch((p=>(u.done(),w.reject(p))));n.push(f)}u.isDone?i():u.K===null?c.continue():c.continue(u.K)}})).next((()=>w.waitFor(n)))}options(e,t){let n;return e!==void 0&&(typeof e=="string"?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.H?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Tn(r){return new w(((e,t)=>{r.onsuccess=n=>{const i=n.target.result;e(i)},r.onerror=n=>{const i=Bc(n.target.error);t(i)}}))}let dh=!1;function Bc(r){const e=ct.S(Re());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(r.message.indexOf(t)>=0){const n=new k("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return dh||(dh=!0,setTimeout((()=>{throw n}),0)),n}}return r}class Bv{constructor(e,t){this.asyncQueue=e,this.Z=t,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}X(e){N("IndexBackfiller",`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{N("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(t){cn(t)?N("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",t):await an(t)}await this.X(6e4)}))}}class qv{constructor(e,t){this.localStore=e,this.persistence=t}async ee(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.te(t,e)))}te(e,t){const n=new Set;let i=t,s=!0;return w.doWhile((()=>s===!0&&i>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!n.has(o))return N("IndexBackfiller",`Processing collection: ${o}`),this.ne(e,o,i).next((c=>{i-=c,n.add(o)}));s=!1})))).next((()=>t-i))}ne(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((i=>this.localStore.localDocuments.getNextDocuments(e,t,i,n).next((s=>{const o=s.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this.re(i,s))).next((c=>(N("IndexBackfiller",`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c)))).next((()=>o.size))}))))}re(e,t){let n=e;return t.changes.forEach(((i,s)=>{const o=ap(s);Uc(o,n)>0&&(n=o)})),new Xe(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ke{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=n=>this.ie(n),this.se=n=>t.writeSequenceNumber(n))}ie(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.se&&this.se(e),e}}Ke.oe=-1;function Xi(r){return r==null}function Fi(r){return r===0&&1/r==-1/0}function hp(r){return typeof r=="number"&&Number.isInteger(r)&&!Fi(r)&&r<=Number.MAX_SAFE_INTEGER&&r>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function qe(r){let e="";for(let t=0;t<r.length;t++)e.length>0&&(e=fh(e)),e=zv(r.get(t),e);return fh(e)}function zv(r,e){let t=e;const n=r.length;for(let i=0;i<n;i++){const s=r.charAt(i);switch(s){case"\0":t+="";break;case"":t+="";break;default:t+=s}}return t}function fh(r){return r+""}function ot(r){const e=r.length;if(q(e>=2),e===2)return q(r.charAt(0)===""&&r.charAt(1)===""),Y.emptyPath();const t=e-2,n=[];let i="";for(let s=0;s<e;){const o=r.indexOf("",s);switch((o<0||o>t)&&F(),r.charAt(o+1)){case"":const c=r.substring(s,o);let u;i.length===0?u=c:(i+=c,u=i,i=""),n.push(u);break;case"":i+=r.substring(s,o),i+="\0";break;case"":i+=r.substring(s,o+1);break;default:F()}s=o+2}return new Y(n)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ph=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function js(r,e){return[r,qe(e)]}function dp(r,e,t){return[r,qe(e),t]}const Gv={},jv=["prefixPath","collectionGroup","readTime","documentId"],$v=["prefixPath","collectionGroup","documentId"],Kv=["collectionGroup","readTime","prefixPath","documentId"],Wv=["canonicalId","targetId"],Hv=["targetId","path"],Qv=["path","targetId"],Jv=["collectionId","parent"],Yv=["indexId","uid"],Xv=["uid","sequenceNumber"],Zv=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],ew=["indexId","uid","orderedDocumentKey"],tw=["userId","collectionPath","documentId"],nw=["userId","collectionPath","largestBatchId"],rw=["userId","collectionGroup","largestBatchId"],fp=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],iw=[...fp,"documentOverlays"],pp=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],mp=pp,qc=[...mp,"indexConfiguration","indexState","indexEntries"],sw=qc,ow=[...qc,"globals"];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa extends up{constructor(e,t){super(),this._e=e,this.currentSequenceNumber=t}}function Se(r,e){const t=x(r);return ct.F(t._e,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mh(r){let e=0;for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e++;return e}function un(r,e){for(const t in r)Object.prototype.hasOwnProperty.call(r,t)&&e(t,r[t])}function gp(r,e){const t=[];for(const n in r)Object.prototype.hasOwnProperty.call(r,n)&&t.push(e(r[n],n,r));return t}function _p(r){for(const e in r)if(Object.prototype.hasOwnProperty.call(r,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oe{constructor(e,t){this.comparator=e,this.root=t||Ve.EMPTY}insert(e,t){return new oe(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ve.BLACK,null,null))}remove(e){return new oe(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ve.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(n===0)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const i=this.comparator(e,n.key);if(i===0)return t+n.left.size;i<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Vs(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Vs(this.root,e,this.comparator,!1)}getReverseIterator(){return new Vs(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Vs(this.root,e,this.comparator,!0)}}class Vs{constructor(e,t,n,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ve{constructor(e,t,n,i,s){this.key=e,this.value=t,this.color=n??Ve.RED,this.left=i??Ve.EMPTY,this.right=s??Ve.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,i,s){return new Ve(e??this.key,t??this.value,n??this.color,i??this.left,s??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let i=this;const s=n(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,t,n),null):s===0?i.copy(null,t,null,null,null):i.copy(null,null,null,null,i.right.insert(e,t,n)),i.fixUp()}removeMin(){if(this.left.isEmpty())return Ve.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,i=this;if(t(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,t),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),t(e,i.key)===0){if(i.right.isEmpty())return Ve.EMPTY;n=i.right.min(),i=i.copy(n.key,n.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,t))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ve.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ve.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed()||this.right.isRed())throw F();const e=this.left.check();if(e!==this.right.check())throw F();return e+(this.isRed()?0:1)}}Ve.EMPTY=null,Ve.RED=!0,Ve.BLACK=!1;Ve.EMPTY=new class{constructor(){this.size=0}get key(){throw F()}get value(){throw F()}get color(){throw F()}get left(){throw F()}get right(){throw F()}copy(e,t,n,i,s){return this}insert(e,t,n){return new Ve(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ie{constructor(e){this.comparator=e,this.data=new oe(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const i=n.getNext();if(this.comparator(i.key,e[1])>=0)return;t(i.key)}}forEachWhile(e,t){let n;for(n=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new gh(this.data.getIterator())}getIteratorFrom(e){return new gh(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((n=>{t=t.add(n)})),t}isEqual(e){if(!(e instanceof ie)||this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ie(this.comparator);return t.data=e,t}}class gh{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Qn(r){return r.hasNext()?r.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(e){this.fields=e,e.sort(ue.comparator)}static empty(){return new We([])}unionWith(e){let t=new ie(ue.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new We(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return dr(this.fields,e.fields,((t,n)=>t.isEqual(n)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yp extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function aw(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class me{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(i){try{return atob(i)}catch(s){throw typeof DOMException<"u"&&s instanceof DOMException?new yp("Invalid base64 string: "+s):s}})(e);return new me(t)}static fromUint8Array(e){const t=(function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s})(e);return new me(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const n=new Uint8Array(t.length);for(let i=0;i<t.length;i++)n[i]=t.charCodeAt(i);return n})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return $(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}me.EMPTY_BYTE_STRING=new me("");const cw=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function bt(r){if(q(!!r),typeof r=="string"){let e=0;const t=cw.exec(r);if(q(!!t),t[1]){let i=t[1];i=(i+"000000000").substr(0,9),e=Number(i)}const n=new Date(r);return{seconds:Math.floor(n.getTime()/1e3),nanos:e}}return{seconds:_e(r.seconds),nanos:_e(r.nanos)}}function _e(r){return typeof r=="number"?r:typeof r=="string"?Number(r):0}function St(r){return typeof r=="string"?me.fromBase64String(r):me.fromUint8Array(r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oo(r){var e,t;return((t=(((e=r?.mapValue)===null||e===void 0?void 0:e.fields)||{}).__type__)===null||t===void 0?void 0:t.stringValue)==="server_timestamp"}function xo(r){const e=r.mapValue.fields.__previous_value__;return Oo(e)?xo(e):e}function Ui(r){const e=bt(r.mapValue.fields.__local_write_time__.timestampValue);return new fe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uw{constructor(e,t,n,i,s,o,c,u,h){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=h}}class Zt{constructor(e,t){this.projectId=e,this.database=t||"(default)"}static empty(){return new Zt("","")}get isDefaultDatabase(){return this.database==="(default)"}isEqual(e){return e instanceof Zt&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jt={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},$s={nullValue:"NULL_VALUE"};function en(r){return"nullValue"in r?0:"booleanValue"in r?1:"integerValue"in r||"doubleValue"in r?2:"timestampValue"in r?3:"stringValue"in r?5:"bytesValue"in r?6:"referenceValue"in r?7:"geoPointValue"in r?8:"arrayValue"in r?9:"mapValue"in r?Oo(r)?4:Ip(r)?9007199254740991:10:F()}function ht(r,e){if(r===e)return!0;const t=en(r);if(t!==en(e))return!1;switch(t){case 0:case 9007199254740991:return!0;case 1:return r.booleanValue===e.booleanValue;case 4:return Ui(r).isEqual(Ui(e));case 3:return(function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=bt(i.timestampValue),c=bt(s.timestampValue);return o.seconds===c.seconds&&o.nanos===c.nanos})(r,e);case 5:return r.stringValue===e.stringValue;case 6:return(function(i,s){return St(i.bytesValue).isEqual(St(s.bytesValue))})(r,e);case 7:return r.referenceValue===e.referenceValue;case 8:return(function(i,s){return _e(i.geoPointValue.latitude)===_e(s.geoPointValue.latitude)&&_e(i.geoPointValue.longitude)===_e(s.geoPointValue.longitude)})(r,e);case 2:return(function(i,s){if("integerValue"in i&&"integerValue"in s)return _e(i.integerValue)===_e(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=_e(i.doubleValue),c=_e(s.doubleValue);return o===c?Fi(o)===Fi(c):isNaN(o)&&isNaN(c)}return!1})(r,e);case 9:return dr(r.arrayValue.values||[],e.arrayValue.values||[],ht);case 10:return(function(i,s){const o=i.mapValue.fields||{},c=s.mapValue.fields||{};if(mh(o)!==mh(c))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(c[u]===void 0||!ht(o[u],c[u])))return!1;return!0})(r,e);default:return F()}}function Bi(r,e){return(r.values||[]).find((t=>ht(t,e)))!==void 0}function tn(r,e){if(r===e)return 0;const t=en(r),n=en(e);if(t!==n)return $(t,n);switch(t){case 0:case 9007199254740991:return 0;case 1:return $(r.booleanValue,e.booleanValue);case 2:return(function(s,o){const c=_e(s.integerValue||s.doubleValue),u=_e(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(r,e);case 3:return _h(r.timestampValue,e.timestampValue);case 4:return _h(Ui(r),Ui(e));case 5:return $(r.stringValue,e.stringValue);case 6:return(function(s,o){const c=St(s),u=St(o);return c.compareTo(u)})(r.bytesValue,e.bytesValue);case 7:return(function(s,o){const c=s.split("/"),u=o.split("/");for(let h=0;h<c.length&&h<u.length;h++){const f=$(c[h],u[h]);if(f!==0)return f}return $(c.length,u.length)})(r.referenceValue,e.referenceValue);case 8:return(function(s,o){const c=$(_e(s.latitude),_e(o.latitude));return c!==0?c:$(_e(s.longitude),_e(o.longitude))})(r.geoPointValue,e.geoPointValue);case 9:return(function(s,o){const c=s.values||[],u=o.values||[];for(let h=0;h<c.length&&h<u.length;++h){const f=tn(c[h],u[h]);if(f)return f}return $(c.length,u.length)})(r.arrayValue,e.arrayValue);case 10:return(function(s,o){if(s===jt.mapValue&&o===jt.mapValue)return 0;if(s===jt.mapValue)return 1;if(o===jt.mapValue)return-1;const c=s.fields||{},u=Object.keys(c),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let p=0;p<u.length&&p<f.length;++p){const _=$(u[p],f[p]);if(_!==0)return _;const R=tn(c[u[p]],h[f[p]]);if(R!==0)return R}return $(u.length,f.length)})(r.mapValue,e.mapValue);default:throw F()}}function _h(r,e){if(typeof r=="string"&&typeof e=="string"&&r.length===e.length)return $(r,e);const t=bt(r),n=bt(e),i=$(t.seconds,n.seconds);return i!==0?i:$(t.nanos,n.nanos)}function mr(r){return Ha(r)}function Ha(r){return"nullValue"in r?"null":"booleanValue"in r?""+r.booleanValue:"integerValue"in r?""+r.integerValue:"doubleValue"in r?""+r.doubleValue:"timestampValue"in r?(function(t){const n=bt(t);return`time(${n.seconds},${n.nanos})`})(r.timestampValue):"stringValue"in r?r.stringValue:"bytesValue"in r?(function(t){return St(t).toBase64()})(r.bytesValue):"referenceValue"in r?(function(t){return M.fromName(t).toString()})(r.referenceValue):"geoPointValue"in r?(function(t){return`geo(${t.latitude},${t.longitude})`})(r.geoPointValue):"arrayValue"in r?(function(t){let n="[",i=!0;for(const s of t.values||[])i?i=!1:n+=",",n+=Ha(s);return n+"]"})(r.arrayValue):"mapValue"in r?(function(t){const n=Object.keys(t.fields||{}).sort();let i="{",s=!0;for(const o of n)s?s=!1:i+=",",i+=`${o}:${Ha(t.fields[o])}`;return i+"}"})(r.mapValue):F()}function Ks(r){switch(en(r)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=xo(r);return e?16+Ks(e):16;case 5:return 2*r.stringValue.length;case 6:return St(r.bytesValue).approximateByteSize();case 7:return r.referenceValue.length;case 9:return(function(n){return(n.values||[]).reduce(((i,s)=>i+Ks(s)),0)})(r.arrayValue);case 10:return(function(n){let i=0;return un(n.fields,((s,o)=>{i+=s.length+Ks(o)})),i})(r.mapValue);default:throw F()}}function Dn(r,e){return{referenceValue:`projects/${r.projectId}/databases/${r.database}/documents/${e.path.canonicalString()}`}}function Qa(r){return!!r&&"integerValue"in r}function qi(r){return!!r&&"arrayValue"in r}function yh(r){return!!r&&"nullValue"in r}function Ih(r){return!!r&&"doubleValue"in r&&isNaN(Number(r.doubleValue))}function Ws(r){return!!r&&"mapValue"in r}function Ri(r){if(r.geoPointValue)return{geoPointValue:Object.assign({},r.geoPointValue)};if(r.timestampValue&&typeof r.timestampValue=="object")return{timestampValue:Object.assign({},r.timestampValue)};if(r.mapValue){const e={mapValue:{fields:{}}};return un(r.mapValue.fields,((t,n)=>e.mapValue.fields[t]=Ri(n))),e}if(r.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(r.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ri(r.arrayValue.values[t]);return e}return Object.assign({},r)}function Ip(r){return(((r.mapValue||{}).fields||{}).__type__||{}).stringValue==="__max__"}function lw(r){return"nullValue"in r?$s:"booleanValue"in r?{booleanValue:!1}:"integerValue"in r||"doubleValue"in r?{doubleValue:NaN}:"timestampValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in r?{stringValue:""}:"bytesValue"in r?{bytesValue:""}:"referenceValue"in r?Dn(Zt.empty(),M.empty()):"geoPointValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in r?{arrayValue:{}}:"mapValue"in r?{mapValue:{}}:F()}function hw(r){return"nullValue"in r?{booleanValue:!1}:"booleanValue"in r?{doubleValue:NaN}:"integerValue"in r||"doubleValue"in r?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in r?{stringValue:""}:"stringValue"in r?{bytesValue:""}:"bytesValue"in r?Dn(Zt.empty(),M.empty()):"referenceValue"in r?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in r?{arrayValue:{}}:"arrayValue"in r?{mapValue:{}}:"mapValue"in r?jt:F()}function Eh(r,e){const t=tn(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?-1:!r.inclusive&&e.inclusive?1:0}function Th(r,e){const t=tn(r.value,e.value);return t!==0?t:r.inclusive&&!e.inclusive?1:!r.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e){this.value=e}static empty(){return new Oe({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!Ws(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ri(t)}setAll(e){let t=ue.emptyPath(),n={},i=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,n,i),n={},i=[],t=c.popLast()}o?n[c.lastSegment()]=Ri(o):i.push(c.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,n,i)}delete(e){const t=this.field(e.popLast());Ws(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return ht(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let i=t.mapValue.fields[e.get(n)];Ws(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=i),t=i}return t.mapValue.fields}applyChanges(e,t,n){un(t,((i,s)=>e[i]=s));for(const i of n)delete e[i]}clone(){return new Oe(Ri(this.value))}}function Ep(r){const e=[];return un(r.fields,((t,n)=>{const i=new ue([t]);if(Ws(n)){const s=Ep(n.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)})),new We(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e,t,n,i,s,o,c){this.key=e,this.documentType=t,this.version=n,this.readTime=i,this.createTime=s,this.data=o,this.documentState=c}static newInvalidDocument(e){return new ce(e,0,G.min(),G.min(),G.min(),Oe.empty(),0)}static newFoundDocument(e,t,n,i){return new ce(e,1,t,G.min(),n,i,0)}static newNoDocument(e,t){return new ce(e,2,t,G.min(),G.min(),Oe.empty(),0)}static newUnknownDocument(e,t){return new ce(e,3,t,G.min(),G.min(),Oe.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(G.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Oe.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Oe.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=G.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ce&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ce(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nn{constructor(e,t){this.position=e,this.inclusive=t}}function vh(r,e,t){let n=0;for(let i=0;i<r.position.length;i++){const s=e[i],o=r.position[i];if(s.field.isKeyField()?n=M.comparator(M.fromName(o.referenceValue),t.key):n=tn(o,t.data.field(s.field)),s.dir==="desc"&&(n*=-1),n!==0)break}return n}function wh(r,e){if(r===null)return e===null;if(e===null||r.inclusive!==e.inclusive||r.position.length!==e.position.length)return!1;for(let t=0;t<r.position.length;t++)if(!ht(r.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zi{constructor(e,t="asc"){this.field=e,this.dir=t}}function dw(r,e){return r.dir===e.dir&&r.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tp{}class X extends Tp{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,n):new fw(e,t,n):t==="array-contains"?new gw(e,n):t==="in"?new Sp(e,n):t==="not-in"?new _w(e,n):t==="array-contains-any"?new yw(e,n):new X(e,t,n)}static createKeyFieldInFilter(e,t,n){return t==="in"?new pw(e,n):new mw(e,n)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&this.matchesComparison(tn(t,this.value)):t!==null&&en(this.value)===en(t)&&this.matchesComparison(tn(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return F()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ne extends Tp{constructor(e,t){super(),this.filters=e,this.op=t,this.ae=null}static create(e,t){return new ne(e,t)}matches(e){return gr(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.ae!==null||(this.ae=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function gr(r){return r.op==="and"}function Ja(r){return r.op==="or"}function zc(r){return vp(r)&&gr(r)}function vp(r){for(const e of r.filters)if(e instanceof ne)return!1;return!0}function Ya(r){if(r instanceof X)return r.field.canonicalString()+r.op.toString()+mr(r.value);if(zc(r))return r.filters.map((e=>Ya(e))).join(",");{const e=r.filters.map((t=>Ya(t))).join(",");return`${r.op}(${e})`}}function wp(r,e){return r instanceof X?(function(n,i){return i instanceof X&&n.op===i.op&&n.field.isEqual(i.field)&&ht(n.value,i.value)})(r,e):r instanceof ne?(function(n,i){return i instanceof ne&&n.op===i.op&&n.filters.length===i.filters.length?n.filters.reduce(((s,o,c)=>s&&wp(o,i.filters[c])),!0):!1})(r,e):void F()}function Ap(r,e){const t=r.filters.concat(e);return ne.create(t,r.op)}function Rp(r){return r instanceof X?(function(t){return`${t.field.canonicalString()} ${t.op} ${mr(t.value)}`})(r):r instanceof ne?(function(t){return t.op.toString()+" {"+t.getFilters().map(Rp).join(" ,")+"}"})(r):"Filter"}class fw extends X{constructor(e,t,n){super(e,t,n),this.key=M.fromName(n.referenceValue)}matches(e){const t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class pw extends X{constructor(e,t){super(e,"in",t),this.keys=bp("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class mw extends X{constructor(e,t){super(e,"not-in",t),this.keys=bp("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function bp(r,e){var t;return(((t=e.arrayValue)===null||t===void 0?void 0:t.values)||[]).map((n=>M.fromName(n.referenceValue)))}class gw extends X{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return qi(t)&&Bi(t.arrayValue,this.value)}}class Sp extends X{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Bi(this.value.arrayValue,t)}}class _w extends X{constructor(e,t){super(e,"not-in",t)}matches(e){if(Bi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&!Bi(this.value.arrayValue,t)}}class yw extends X{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!qi(t)||!t.arrayValue.values)&&t.arrayValue.values.some((n=>Bi(this.value.arrayValue,n)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Iw{constructor(e,t=null,n=[],i=[],s=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=i,this.limit=s,this.startAt=o,this.endAt=c,this.ue=null}}function Xa(r,e=null,t=[],n=[],i=null,s=null,o=null){return new Iw(r,e,t,n,i,s,o)}function kn(r){const e=x(r);if(e.ue===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((n=>Ya(n))).join(","),t+="|ob:",t+=e.orderBy.map((n=>(function(s){return s.field.canonicalString()+s.dir})(n))).join(","),Xi(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((n=>mr(n))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((n=>mr(n))).join(",")),e.ue=t}return e.ue}function Zi(r,e){if(r.limit!==e.limit||r.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<r.orderBy.length;t++)if(!dw(r.orderBy[t],e.orderBy[t]))return!1;if(r.filters.length!==e.filters.length)return!1;for(let t=0;t<r.filters.length;t++)if(!wp(r.filters[t],e.filters[t]))return!1;return r.collectionGroup===e.collectionGroup&&!!r.path.isEqual(e.path)&&!!wh(r.startAt,e.startAt)&&wh(r.endAt,e.endAt)}function so(r){return M.isDocumentKey(r.path)&&r.collectionGroup===null&&r.filters.length===0}function oo(r,e){return r.filters.filter((t=>t instanceof X&&t.field.isEqual(e)))}function Ah(r,e,t){let n=$s,i=!0;for(const s of oo(r,e)){let o=$s,c=!0;switch(s.op){case"<":case"<=":o=lw(s.value);break;case"==":case"in":case">=":o=s.value;break;case">":o=s.value,c=!1;break;case"!=":case"not-in":o=$s}Eh({value:n,inclusive:i},{value:o,inclusive:c})<0&&(n=o,i=c)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const o=t.position[s];Eh({value:n,inclusive:i},{value:o,inclusive:t.inclusive})<0&&(n=o,i=t.inclusive);break}}return{value:n,inclusive:i}}function Rh(r,e,t){let n=jt,i=!0;for(const s of oo(r,e)){let o=jt,c=!0;switch(s.op){case">=":case">":o=hw(s.value),c=!1;break;case"==":case"in":case"<=":o=s.value;break;case"<":o=s.value,c=!1;break;case"!=":case"not-in":o=jt}Th({value:n,inclusive:i},{value:o,inclusive:c})>0&&(n=o,i=c)}if(t!==null){for(let s=0;s<r.orderBy.length;++s)if(r.orderBy[s].field.isEqual(e)){const o=t.position[s];Th({value:n,inclusive:i},{value:o,inclusive:t.inclusive})>0&&(n=o,i=t.inclusive);break}}return{value:n,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(e,t=null,n=[],i=[],s=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=i,this.limit=s,this.limitType=o,this.startAt=c,this.endAt=u,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function Pp(r,e,t,n,i,s,o,c){return new Dt(r,e,t,n,i,s,o,c)}function Or(r){return new Dt(r)}function bh(r){return r.filters.length===0&&r.limit===null&&r.startAt==null&&r.endAt==null&&(r.explicitOrderBy.length===0||r.explicitOrderBy.length===1&&r.explicitOrderBy[0].field.isKeyField())}function Gc(r){return r.collectionGroup!==null}function or(r){const e=x(r);if(e.ce===null){e.ce=[];const t=new Set;for(const s of e.explicitOrderBy)e.ce.push(s),t.add(s.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new ie(ue.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((h=>{h.isInequality()&&(c=c.add(h.field))}))})),c})(e).forEach((s=>{t.has(s.canonicalString())||s.isKeyField()||e.ce.push(new zi(s,n))})),t.has(ue.keyField().canonicalString())||e.ce.push(new zi(ue.keyField(),n))}return e.ce}function ze(r){const e=x(r);return e.le||(e.le=Dp(e,or(r))),e.le}function Cp(r){const e=x(r);return e.he||(e.he=Dp(e,r.explicitOrderBy)),e.he}function Dp(r,e){if(r.limitType==="F")return Xa(r.path,r.collectionGroup,e,r.filters,r.limit,r.startAt,r.endAt);{e=e.map((i=>{const s=i.dir==="desc"?"asc":"desc";return new zi(i.field,s)}));const t=r.endAt?new nn(r.endAt.position,r.endAt.inclusive):null,n=r.startAt?new nn(r.startAt.position,r.startAt.inclusive):null;return Xa(r.path,r.collectionGroup,e,r.filters,r.limit,t,n)}}function Za(r,e){const t=r.filters.concat([e]);return new Dt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),t,r.limit,r.limitType,r.startAt,r.endAt)}function ao(r,e,t){return new Dt(r.path,r.collectionGroup,r.explicitOrderBy.slice(),r.filters.slice(),e,t,r.startAt,r.endAt)}function es(r,e){return Zi(ze(r),ze(e))&&r.limitType===e.limitType}function kp(r){return`${kn(ze(r))}|lt:${r.limitType}`}function er(r){return`Query(target=${(function(t){let n=t.path.canonicalString();return t.collectionGroup!==null&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map((i=>Rp(i))).join(", ")}]`),Xi(t.limit)||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map((i=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(i))).join(", ")}]`),t.startAt&&(n+=", startAt: ",n+=t.startAt.inclusive?"b:":"a:",n+=t.startAt.position.map((i=>mr(i))).join(",")),t.endAt&&(n+=", endAt: ",n+=t.endAt.inclusive?"a:":"b:",n+=t.endAt.position.map((i=>mr(i))).join(",")),`Target(${n})`})(ze(r))}; limitType=${r.limitType})`}function ts(r,e){return e.isFoundDocument()&&(function(n,i){const s=i.key.path;return n.collectionGroup!==null?i.key.hasCollectionId(n.collectionGroup)&&n.path.isPrefixOf(s):M.isDocumentKey(n.path)?n.path.isEqual(s):n.path.isImmediateParentOf(s)})(r,e)&&(function(n,i){for(const s of or(n))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0})(r,e)&&(function(n,i){for(const s of n.filters)if(!s.matches(i))return!1;return!0})(r,e)&&(function(n,i){return!(n.startAt&&!(function(o,c,u){const h=vh(o,c,u);return o.inclusive?h<=0:h<0})(n.startAt,or(n),i)||n.endAt&&!(function(o,c,u){const h=vh(o,c,u);return o.inclusive?h>=0:h>0})(n.endAt,or(n),i))})(r,e)}function Np(r){return r.collectionGroup||(r.path.length%2==1?r.path.lastSegment():r.path.get(r.path.length-2))}function Vp(r){return(e,t)=>{let n=!1;for(const i of or(r)){const s=Ew(i,e,t);if(s!==0)return s;n=n||i.field.isKeyField()}return 0}}function Ew(r,e,t){const n=r.field.isKeyField()?M.comparator(e.key,t.key):(function(s,o,c){const u=o.data.field(s),h=c.data.field(s);return u!==null&&h!==null?tn(u,h):F()})(r.field,e,t);switch(r.dir){case"asc":return n;case"desc":return-1*n;default:return F()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kt{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n!==void 0){for(const[i,s]of n)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,t){const n=this.mapKeyFn(e),i=this.inner[n];if(i===void 0)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,t]);i.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(n===void 0)return!1;for(let i=0;i<n.length;i++)if(this.equalsFn(n[i][0],e))return n.length===1?delete this.inner[t]:n.splice(i,1),this.innerSize--,!0;return!1}forEach(e){un(this.inner,((t,n)=>{for(const[i,s]of n)e(i,s)}))}isEmpty(){return _p(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tw=new oe(M.comparator);function He(){return Tw}const Op=new oe(M.comparator);function Ii(...r){let e=Op;for(const t of r)e=e.insert(t.key,t);return e}function xp(r){let e=Op;return r.forEach(((t,n)=>e=e.insert(t,n.overlayedDocument))),e}function at(){return bi()}function Lp(){return bi()}function bi(){return new kt((r=>r.toString()),((r,e)=>r.isEqual(e)))}const vw=new oe(M.comparator),ww=new ie(M.comparator);function W(...r){let e=ww;for(const t of r)e=e.add(t);return e}const Aw=new ie($);function jc(){return Aw}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mp(r,e){if(r.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Fi(e)?"-0":e}}function Fp(r){return{integerValue:""+r}}function Up(r,e){return hp(e)?Fp(e):Mp(r,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lo{constructor(){this._=void 0}}function Rw(r,e,t){return r instanceof _r?(function(i,s){const o={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&Oo(s)&&(s=xo(s)),s&&(o.fields.__previous_value__=s),{mapValue:o}})(t,e):r instanceof Nn?qp(r,e):r instanceof Vn?zp(r,e):(function(i,s){const o=Bp(i,s),c=Sh(o)+Sh(i.Pe);return Qa(o)&&Qa(i.Pe)?Fp(c):Mp(i.serializer,c)})(r,e)}function bw(r,e,t){return r instanceof Nn?qp(r,e):r instanceof Vn?zp(r,e):t}function Bp(r,e){return r instanceof yr?(function(n){return Qa(n)||(function(s){return!!s&&"doubleValue"in s})(n)})(e)?e:{integerValue:0}:null}class _r extends Lo{}class Nn extends Lo{constructor(e){super(),this.elements=e}}function qp(r,e){const t=Gp(e);for(const n of r.elements)t.some((i=>ht(i,n)))||t.push(n);return{arrayValue:{values:t}}}class Vn extends Lo{constructor(e){super(),this.elements=e}}function zp(r,e){let t=Gp(e);for(const n of r.elements)t=t.filter((i=>!ht(i,n)));return{arrayValue:{values:t}}}class yr extends Lo{constructor(e,t){super(),this.serializer=e,this.Pe=t}}function Sh(r){return _e(r.integerValue||r.doubleValue)}function Gp(r){return qi(r)&&r.arrayValue.values?r.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(e,t){this.field=e,this.transform=t}}function Sw(r,e){return r.field.isEqual(e.field)&&(function(n,i){return n instanceof Nn&&i instanceof Nn||n instanceof Vn&&i instanceof Vn?dr(n.elements,i.elements,ht):n instanceof yr&&i instanceof yr?ht(n.Pe,i.Pe):n instanceof _r&&i instanceof _r})(r.transform,e.transform)}class Pw{constructor(e,t){this.version=e,this.transformResults=t}}class de{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new de}static exists(e){return new de(void 0,e)}static updateTime(e){return new de(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Hs(r,e){return r.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(r.updateTime):r.exists===void 0||r.exists===e.isFoundDocument()}class Mo{}function jp(r,e){if(!r.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return r.isNoDocument()?new Lr(r.key,de.none()):new xr(r.key,r.data,de.none());{const t=r.data,n=Oe.empty();let i=new ie(ue.comparator);for(let s of e.fields)if(!i.has(s)){let o=t.field(s);o===null&&s.length>1&&(s=s.popLast(),o=t.field(s)),o===null?n.delete(s):n.set(s,o),i=i.add(s)}return new Nt(r.key,n,new We(i.toArray()),de.none())}}function Cw(r,e,t){r instanceof xr?(function(i,s,o){const c=i.value.clone(),u=Ch(i.fieldTransforms,s,o.transformResults);c.setAll(u),s.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(r,e,t):r instanceof Nt?(function(i,s,o){if(!Hs(i.precondition,s))return void s.convertToUnknownDocument(o.version);const c=Ch(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll($p(i)),u.setAll(c),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(r,e,t):(function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Si(r,e,t,n){return r instanceof xr?(function(s,o,c,u){if(!Hs(s.precondition,o))return c;const h=s.value.clone(),f=Dh(s.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null})(r,e,t,n):r instanceof Nt?(function(s,o,c,u){if(!Hs(s.precondition,o))return c;const h=Dh(s.fieldTransforms,u,o),f=o.data;return f.setAll($p(s)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),c===null?null:c.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map((p=>p.field)))})(r,e,t,n):(function(s,o,c){return Hs(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(r,e,t)}function Dw(r,e){let t=null;for(const n of r.fieldTransforms){const i=e.data.field(n.field),s=Bp(n.transform,i||null);s!=null&&(t===null&&(t=Oe.empty()),t.set(n.field,s))}return t||null}function Ph(r,e){return r.type===e.type&&!!r.key.isEqual(e.key)&&!!r.precondition.isEqual(e.precondition)&&!!(function(n,i){return n===void 0&&i===void 0||!(!n||!i)&&dr(n,i,((s,o)=>Sw(s,o)))})(r.fieldTransforms,e.fieldTransforms)&&(r.type===0?r.value.isEqual(e.value):r.type!==1||r.data.isEqual(e.data)&&r.fieldMask.isEqual(e.fieldMask))}class xr extends Mo{constructor(e,t,n,i=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class Nt extends Mo{constructor(e,t,n,i,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function $p(r){const e=new Map;return r.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const n=r.data.field(t);e.set(t,n)}})),e}function Ch(r,e,t){const n=new Map;q(r.length===t.length);for(let i=0;i<t.length;i++){const s=r[i],o=s.transform,c=e.data.field(s.field);n.set(s.field,bw(o,c,t[i]))}return n}function Dh(r,e,t){const n=new Map;for(const i of r){const s=i.transform,o=t.data.field(i.field);n.set(i.field,Rw(s,o,e))}return n}class Lr extends Mo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class $c extends Mo{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kc{constructor(e,t,n,i){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=i}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&Cw(s,e,n[i])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Si(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Si(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=Lp();return this.mutations.forEach((i=>{const s=e.get(i.key),o=s.overlayedDocument;let c=this.applyToLocalView(o,s.mutatedFields);c=t.has(i.key)?null:c;const u=jp(o,c);u!==null&&n.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(G.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),W())}isEqual(e){return this.batchId===e.batchId&&dr(this.mutations,e.mutations,((t,n)=>Ph(t,n)))&&dr(this.baseMutations,e.baseMutations,((t,n)=>Ph(t,n)))}}class Wc{constructor(e,t,n,i){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=i}static from(e,t,n){q(e.mutations.length===n.length);let i=(function(){return vw})();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,n[o].version);return new Wc(e,t,n,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hc{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kp{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kw{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var we,Z;function Wp(r){switch(r){default:return F();case S.CANCELLED:case S.UNKNOWN:case S.DEADLINE_EXCEEDED:case S.RESOURCE_EXHAUSTED:case S.INTERNAL:case S.UNAVAILABLE:case S.UNAUTHENTICATED:return!1;case S.INVALID_ARGUMENT:case S.NOT_FOUND:case S.ALREADY_EXISTS:case S.PERMISSION_DENIED:case S.FAILED_PRECONDITION:case S.ABORTED:case S.OUT_OF_RANGE:case S.UNIMPLEMENTED:case S.DATA_LOSS:return!0}}function Hp(r){if(r===void 0)return Te("GRPC error has no .code"),S.UNKNOWN;switch(r){case we.OK:return S.OK;case we.CANCELLED:return S.CANCELLED;case we.UNKNOWN:return S.UNKNOWN;case we.DEADLINE_EXCEEDED:return S.DEADLINE_EXCEEDED;case we.RESOURCE_EXHAUSTED:return S.RESOURCE_EXHAUSTED;case we.INTERNAL:return S.INTERNAL;case we.UNAVAILABLE:return S.UNAVAILABLE;case we.UNAUTHENTICATED:return S.UNAUTHENTICATED;case we.INVALID_ARGUMENT:return S.INVALID_ARGUMENT;case we.NOT_FOUND:return S.NOT_FOUND;case we.ALREADY_EXISTS:return S.ALREADY_EXISTS;case we.PERMISSION_DENIED:return S.PERMISSION_DENIED;case we.FAILED_PRECONDITION:return S.FAILED_PRECONDITION;case we.ABORTED:return S.ABORTED;case we.OUT_OF_RANGE:return S.OUT_OF_RANGE;case we.UNIMPLEMENTED:return S.UNIMPLEMENTED;case we.DATA_LOSS:return S.DATA_LOSS;default:return F()}}(Z=we||(we={}))[Z.OK=0]="OK",Z[Z.CANCELLED=1]="CANCELLED",Z[Z.UNKNOWN=2]="UNKNOWN",Z[Z.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Z[Z.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Z[Z.NOT_FOUND=5]="NOT_FOUND",Z[Z.ALREADY_EXISTS=6]="ALREADY_EXISTS",Z[Z.PERMISSION_DENIED=7]="PERMISSION_DENIED",Z[Z.UNAUTHENTICATED=16]="UNAUTHENTICATED",Z[Z.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Z[Z.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Z[Z.ABORTED=10]="ABORTED",Z[Z.OUT_OF_RANGE=11]="OUT_OF_RANGE",Z[Z.UNIMPLEMENTED=12]="UNIMPLEMENTED",Z[Z.INTERNAL=13]="INTERNAL",Z[Z.UNAVAILABLE=14]="UNAVAILABLE",Z[Z.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let co=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qp(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nw=new Sn([4294967295,4294967295],0);function kh(r){const e=Qp().encode(r),t=new Qf;return t.update(e),new Uint8Array(t.digest())}function Nh(r){const e=new DataView(r.buffer),t=e.getUint32(0,!0),n=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Sn([t,n],0),new Sn([i,s],0)]}class Qc{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new Ei(`Invalid padding: ${t}`);if(n<0)throw new Ei(`Invalid hash count: ${n}`);if(e.length>0&&this.hashCount===0)throw new Ei(`Invalid hash count: ${n}`);if(e.length===0&&t!==0)throw new Ei(`Invalid padding when bitmap length is 0: ${t}`);this.Ie=8*e.length-t,this.Te=Sn.fromNumber(this.Ie)}Ee(e,t,n){let i=e.add(t.multiply(Sn.fromNumber(n)));return i.compare(Nw)===1&&(i=new Sn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.Te).toNumber()}de(e){return(this.bitmap[Math.floor(e/8)]&1<<e%8)!=0}mightContain(e){if(this.Ie===0)return!1;const t=kh(e),[n,i]=Nh(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(n,i,s);if(!this.de(o))return!1}return!0}static create(e,t,n){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Qc(s,i,t);return n.forEach((c=>o.insert(c))),o}insert(e){if(this.Ie===0)return;const t=kh(e),[n,i]=Nh(t);for(let s=0;s<this.hashCount;s++){const o=this.Ee(n,i,s);this.Ae(o)}}Ae(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class Ei extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rs{constructor(e,t,n,i,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const i=new Map;return i.set(e,is.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new rs(G.min(),i,new oe($),He(),W())}}class is{constructor(e,t,n,i,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new is(n,t,W(),W(),W())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs{constructor(e,t,n,i){this.Re=e,this.removedTargetIds=t,this.key=n,this.Ve=i}}class Jp{constructor(e,t){this.targetId=e,this.me=t}}class Yp{constructor(e,t,n=me.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=i}}class Vh{constructor(){this.fe=0,this.ge=xh(),this.pe=me.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return this.fe!==0}get be(){return this.we}De(e){e.approximateByteSize()>0&&(this.we=!0,this.pe=e)}Ce(){let e=W(),t=W(),n=W();return this.ge.forEach(((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:t=t.add(i);break;case 1:n=n.add(i);break;default:F()}})),new is(this.pe,this.ye,e,t,n)}ve(){this.we=!1,this.ge=xh()}Fe(e,t){this.we=!0,this.ge=this.ge.insert(e,t)}Me(e){this.we=!0,this.ge=this.ge.remove(e)}xe(){this.fe+=1}Oe(){this.fe-=1,q(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Vw{constructor(e){this.Le=e,this.Be=new Map,this.ke=He(),this.qe=Oh(),this.Qe=new oe($)}Ke(e){for(const t of e.Re)e.Ve&&e.Ve.isFoundDocument()?this.$e(t,e.Ve):this.Ue(t,e.key,e.Ve);for(const t of e.removedTargetIds)this.Ue(t,e.key,e.Ve)}We(e){this.forEachTarget(e,(t=>{const n=this.Ge(t);switch(e.state){case 0:this.ze(t)&&n.De(e.resumeToken);break;case 1:n.Oe(),n.Se||n.ve(),n.De(e.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(t);break;case 3:this.ze(t)&&(n.Ne(),n.De(e.resumeToken));break;case 4:this.ze(t)&&(this.je(t),n.De(e.resumeToken));break;default:F()}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.Be.forEach(((n,i)=>{this.ze(i)&&t(i)}))}He(e){const t=e.targetId,n=e.me.count,i=this.Je(t);if(i){const s=i.target;if(so(s))if(n===0){const o=new M(s.path);this.Ue(t,o,ce.newNoDocument(o,G.min()))}else q(n===1);else{const o=this.Ye(t);if(o!==n){const c=this.Ze(e),u=c?this.Xe(c,e,o):1;if(u!==0){this.je(t);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(t,h)}co?.et((function(f,p,_,R,D){var V,C,z,j,U,H;const ee={localCacheCount:f,existenceFilterCount:p.count,databaseId:_.database,projectId:_.projectId},K=p.unchangedNames;return K&&(ee.bloomFilter={applied:D===0,hashCount:(V=K?.hashCount)!==null&&V!==void 0?V:0,bitmapLength:(j=(z=(C=K?.bits)===null||C===void 0?void 0:C.bitmap)===null||z===void 0?void 0:z.length)!==null&&j!==void 0?j:0,padding:(H=(U=K?.bits)===null||U===void 0?void 0:U.padding)!==null&&H!==void 0?H:0,mightContain:E=>{var g;return(g=R?.mightContain(E))!==null&&g!==void 0&&g}}),ee})(o,e.me,this.Le.tt(),c,u))}}}}Ze(e){const t=e.me.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:i=0},hashCount:s=0}=t;let o,c;try{o=St(n).toUint8Array()}catch(u){if(u instanceof yp)return Je("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new Qc(o,i,s)}catch(u){return Je(u instanceof Ei?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.Ie===0?null:c}Xe(e,t,n){return t.me.count===n-this.nt(e,t.targetId)?0:2}nt(e,t){const n=this.Le.getRemoteKeysForTarget(t);let i=0;return n.forEach((s=>{const o=this.Le.tt(),c=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(c)||(this.Ue(t,s,null),i++)})),i}rt(e){const t=new Map;this.Be.forEach(((s,o)=>{const c=this.Je(o);if(c){if(s.current&&so(c.target)){const u=new M(c.target.path);this.ke.get(u)!==null||this.it(o,u)||this.Ue(o,u,ce.newNoDocument(u,e))}s.be&&(t.set(o,s.Ce()),s.ve())}}));let n=W();this.qe.forEach(((s,o)=>{let c=!0;o.forEachWhile((u=>{const h=this.Je(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(n=n.add(s))})),this.ke.forEach(((s,o)=>o.setReadTime(e)));const i=new rs(e,t,this.Qe,this.ke,n);return this.ke=He(),this.qe=Oh(),this.Qe=new oe($),i}$e(e,t){if(!this.ze(e))return;const n=this.it(e,t.key)?2:0;this.Ge(e).Fe(t.key,n),this.ke=this.ke.insert(t.key,t),this.qe=this.qe.insert(t.key,this.st(t.key).add(e))}Ue(e,t,n){if(!this.ze(e))return;const i=this.Ge(e);this.it(e,t)?i.Fe(t,1):i.Me(t),this.qe=this.qe.insert(t,this.st(t).delete(e)),n&&(this.ke=this.ke.insert(t,n))}removeTarget(e){this.Be.delete(e)}Ye(e){const t=this.Ge(e).Ce();return this.Le.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}xe(e){this.Ge(e).xe()}Ge(e){let t=this.Be.get(e);return t||(t=new Vh,this.Be.set(e,t)),t}st(e){let t=this.qe.get(e);return t||(t=new ie($),this.qe=this.qe.insert(e,t)),t}ze(e){const t=this.Je(e)!==null;return t||N("WatchChangeAggregator","Detected inactive target",e),t}Je(e){const t=this.Be.get(e);return t&&t.Se?null:this.Le.ot(e)}je(e){this.Be.set(e,new Vh),this.Le.getRemoteKeysForTarget(e).forEach((t=>{this.Ue(e,t,null)}))}it(e,t){return this.Le.getRemoteKeysForTarget(e).has(t)}}function Oh(){return new oe(M.comparator)}function xh(){return new oe(M.comparator)}const Ow={asc:"ASCENDING",desc:"DESCENDING"},xw={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},Lw={and:"AND",or:"OR"};class Mw{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ec(r,e){return r.useProto3Json||Xi(e)?e:{value:e}}function Ir(r,e){return r.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Xp(r,e){return r.useProto3Json?e.toBase64():e.toUint8Array()}function Fw(r,e){return Ir(r,e.toTimestamp())}function ve(r){return q(!!r),G.fromTimestamp((function(t){const n=bt(t);return new fe(n.seconds,n.nanos)})(r))}function Jc(r,e){return tc(r,e).canonicalString()}function tc(r,e){const t=(function(i){return new Y(["projects",i.projectId,"databases",i.database])})(r).child("documents");return e===void 0?t:t.child(e)}function Zp(r){const e=Y.fromString(r);return q(um(e)),e}function Gi(r,e){return Jc(r.databaseId,e.path)}function ut(r,e){const t=Zp(e);if(t.get(1)!==r.databaseId.projectId)throw new k(S.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+r.databaseId.projectId);if(t.get(3)!==r.databaseId.database)throw new k(S.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+r.databaseId.database);return new M(nm(t))}function em(r,e){return Jc(r.databaseId,e)}function tm(r){const e=Zp(r);return e.length===4?Y.emptyPath():nm(e)}function nc(r){return new Y(["projects",r.databaseId.projectId,"databases",r.databaseId.database]).canonicalString()}function nm(r){return q(r.length>4&&r.get(4)==="documents"),r.popFirst(5)}function Lh(r,e,t){return{name:Gi(r,e),fields:t.value.mapValue.fields}}function rm(r,e,t){const n=ut(r,e.name),i=ve(e.updateTime),s=e.createTime?ve(e.createTime):G.min(),o=new Oe({mapValue:{fields:e.fields}}),c=ce.newFoundDocument(n,i,s,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function Uw(r,e){return"found"in e?(function(n,i){q(!!i.found),i.found.name,i.found.updateTime;const s=ut(n,i.found.name),o=ve(i.found.updateTime),c=i.found.createTime?ve(i.found.createTime):G.min(),u=new Oe({mapValue:{fields:i.found.fields}});return ce.newFoundDocument(s,o,c,u)})(r,e):"missing"in e?(function(n,i){q(!!i.missing),q(!!i.readTime);const s=ut(n,i.missing),o=ve(i.readTime);return ce.newNoDocument(s,o)})(r,e):F()}function Bw(r,e){let t;if("targetChange"in e){e.targetChange;const n=(function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:F()})(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=(function(h,f){return h.useProto3Json?(q(f===void 0||typeof f=="string"),me.fromBase64String(f||"")):(q(f===void 0||f instanceof Buffer||f instanceof Uint8Array),me.fromUint8Array(f||new Uint8Array))})(r,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(h){const f=h.code===void 0?S.UNKNOWN:Hp(h.code);return new k(f,h.message||"")})(o);t=new Yp(n,i,s,c||null)}else if("documentChange"in e){e.documentChange;const n=e.documentChange;n.document,n.document.name,n.document.updateTime;const i=ut(r,n.document.name),s=ve(n.document.updateTime),o=n.document.createTime?ve(n.document.createTime):G.min(),c=new Oe({mapValue:{fields:n.document.fields}}),u=ce.newFoundDocument(i,s,o,c),h=n.targetIds||[],f=n.removedTargetIds||[];t=new Qs(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const n=e.documentDelete;n.document;const i=ut(r,n.document),s=n.readTime?ve(n.readTime):G.min(),o=ce.newNoDocument(i,s),c=n.removedTargetIds||[];t=new Qs([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const n=e.documentRemove;n.document;const i=ut(r,n.document),s=n.removedTargetIds||[];t=new Qs([],s,i,null)}else{if(!("filter"in e))return F();{e.filter;const n=e.filter;n.targetId;const{count:i=0,unchangedNames:s}=n,o=new kw(i,s),c=n.targetId;t=new Jp(c,o)}}return t}function ji(r,e){let t;if(e instanceof xr)t={update:Lh(r,e.key,e.value)};else if(e instanceof Lr)t={delete:Gi(r,e.key)};else if(e instanceof Nt)t={update:Lh(r,e.key,e.data),updateMask:Kw(e.fieldMask)};else{if(!(e instanceof $c))return F();t={verify:Gi(r,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((n=>(function(s,o){const c=o.transform;if(c instanceof _r)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Nn)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Vn)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof yr)return{fieldPath:o.field.canonicalString(),increment:c.Pe};throw F()})(0,n)))),e.precondition.isNone||(t.currentDocument=(function(i,s){return s.updateTime!==void 0?{updateTime:Fw(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:F()})(r,e.precondition)),t}function rc(r,e){const t=e.currentDocument?(function(s){return s.updateTime!==void 0?de.updateTime(ve(s.updateTime)):s.exists!==void 0?de.exists(s.exists):de.none()})(e.currentDocument):de.none(),n=e.updateTransforms?e.updateTransforms.map((i=>(function(o,c){let u=null;if("setToServerValue"in c)q(c.setToServerValue==="REQUEST_TIME"),u=new _r;else if("appendMissingElements"in c){const f=c.appendMissingElements.values||[];u=new Nn(f)}else if("removeAllFromArray"in c){const f=c.removeAllFromArray.values||[];u=new Vn(f)}else"increment"in c?u=new yr(o,c.increment):F();const h=ue.fromServerFormat(c.fieldPath);return new ns(h,u)})(r,i))):[];if(e.update){e.update.name;const i=ut(r,e.update.name),s=new Oe({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const h=u.fieldPaths||[];return new We(h.map((f=>ue.fromServerFormat(f))))})(e.updateMask);return new Nt(i,s,o,t,n)}return new xr(i,s,t,n)}if(e.delete){const i=ut(r,e.delete);return new Lr(i,t)}if(e.verify){const i=ut(r,e.verify);return new $c(i,t)}return F()}function qw(r,e){return r&&r.length>0?(q(e!==void 0),r.map((t=>(function(i,s){let o=i.updateTime?ve(i.updateTime):ve(s);return o.isEqual(G.min())&&(o=ve(s)),new Pw(o,i.transformResults||[])})(t,e)))):[]}function im(r,e){return{documents:[em(r,e.path)]}}function Fo(r,e){const t={structuredQuery:{}},n=e.path;let i;e.collectionGroup!==null?(i=n,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=n.popLast(),t.structuredQuery.from=[{collectionId:n.lastSegment()}]),t.parent=em(r,i);const s=(function(h){if(h.length!==0)return cm(ne.create(h,"and"))})(e.filters);s&&(t.structuredQuery.where=s);const o=(function(h){if(h.length!==0)return h.map((f=>(function(_){return{field:qt(_.field),direction:Gw(_.dir)}})(f)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=ec(r,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(h){return{before:h.inclusive,values:h.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(h){return{before:!h.inclusive,values:h.position}})(e.endAt)),{_t:t,parent:i}}function sm(r,e,t,n){const{_t:i,parent:s}=Fo(r,e),o={},c=[];let u=0;return t.forEach((h=>{const f=n?h.alias:"aggregate_"+u++;o[f]=h.alias,h.aggregateType==="count"?c.push({alias:f,count:{}}):h.aggregateType==="avg"?c.push({alias:f,avg:{field:qt(h.fieldPath)}}):h.aggregateType==="sum"&&c.push({alias:f,sum:{field:qt(h.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:c,structuredQuery:i.structuredQuery},parent:i.parent},ut:o,parent:s}}function om(r){let e=tm(r.parent);const t=r.structuredQuery,n=t.from?t.from.length:0;let i=null;if(n>0){q(n===1);const f=t.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];t.where&&(s=(function(p){const _=am(p);return _ instanceof ne&&zc(_)?_.getFilters():[_]})(t.where));let o=[];t.orderBy&&(o=(function(p){return p.map((_=>(function(D){return new zi(tr(D.field),(function(C){switch(C){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(D.direction))})(_)))})(t.orderBy));let c=null;t.limit&&(c=(function(p){let _;return _=typeof p=="object"?p.value:p,Xi(_)?null:_})(t.limit));let u=null;t.startAt&&(u=(function(p){const _=!!p.before,R=p.values||[];return new nn(R,_)})(t.startAt));let h=null;return t.endAt&&(h=(function(p){const _=!p.before,R=p.values||[];return new nn(R,_)})(t.endAt)),Pp(e,i,o,s,c,"F",u,h)}function zw(r,e){const t=(function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return F()}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function am(r){return r.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const n=tr(t.unaryFilter.field);return X.create(n,"==",{doubleValue:NaN});case"IS_NULL":const i=tr(t.unaryFilter.field);return X.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=tr(t.unaryFilter.field);return X.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=tr(t.unaryFilter.field);return X.create(o,"!=",{nullValue:"NULL_VALUE"});default:return F()}})(r):r.fieldFilter!==void 0?(function(t){return X.create(tr(t.fieldFilter.field),(function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return F()}})(t.fieldFilter.op),t.fieldFilter.value)})(r):r.compositeFilter!==void 0?(function(t){return ne.create(t.compositeFilter.filters.map((n=>am(n))),(function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return F()}})(t.compositeFilter.op))})(r):F()}function Gw(r){return Ow[r]}function jw(r){return xw[r]}function $w(r){return Lw[r]}function qt(r){return{fieldPath:r.canonicalString()}}function tr(r){return ue.fromServerFormat(r.fieldPath)}function cm(r){return r instanceof X?(function(t){if(t.op==="=="){if(Ih(t.value))return{unaryFilter:{field:qt(t.field),op:"IS_NAN"}};if(yh(t.value))return{unaryFilter:{field:qt(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(Ih(t.value))return{unaryFilter:{field:qt(t.field),op:"IS_NOT_NAN"}};if(yh(t.value))return{unaryFilter:{field:qt(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:qt(t.field),op:jw(t.op),value:t.value}}})(r):r instanceof ne?(function(t){const n=t.getFilters().map((i=>cm(i)));return n.length===1?n[0]:{compositeFilter:{op:$w(t.op),filters:n}}})(r):F()}function Kw(r){const e=[];return r.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function um(r){return r.length>=4&&r.get(0)==="projects"&&r.get(2)==="databases"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e,t,n,i,s=G.min(),o=G.min(),c=me.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new vt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new vt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new vt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new vt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lm{constructor(e){this.ct=e}}function Ww(r,e){let t;if(e.document)t=rm(r.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const n=M.fromSegments(e.noDocument.path),i=xn(e.noDocument.readTime);t=ce.newNoDocument(n,i),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return F();{const n=M.fromSegments(e.unknownDocument.path),i=xn(e.unknownDocument.version);t=ce.newUnknownDocument(n,i)}}return e.readTime&&t.setReadTime((function(i){const s=new fe(i[0],i[1]);return G.fromTimestamp(s)})(e.readTime)),t}function Mh(r,e){const t=e.key,n={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:uo(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())n.document=(function(s,o){return{name:Gi(s,o.key),fields:o.data.value.mapValue.fields,updateTime:Ir(s,o.version.toTimestamp()),createTime:Ir(s,o.createTime.toTimestamp())}})(r.ct,e);else if(e.isNoDocument())n.noDocument={path:t.path.toArray(),readTime:On(e.version)};else{if(!e.isUnknownDocument())return F();n.unknownDocument={path:t.path.toArray(),version:On(e.version)}}return n}function uo(r){const e=r.toTimestamp();return[e.seconds,e.nanoseconds]}function On(r){const e=r.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function xn(r){const e=new fe(r.seconds,r.nanoseconds);return G.fromTimestamp(e)}function vn(r,e){const t=(e.baseMutations||[]).map((s=>rc(r.ct,s)));for(let s=0;s<e.mutations.length-1;++s){const o=e.mutations[s];if(s+1<e.mutations.length&&e.mutations[s+1].transform!==void 0){const c=e.mutations[s+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const n=e.mutations.map((s=>rc(r.ct,s))),i=fe.fromMillis(e.localWriteTimeMs);return new Kc(e.batchId,i,t,n)}function Ti(r){const e=xn(r.readTime),t=r.lastLimboFreeSnapshotVersion!==void 0?xn(r.lastLimboFreeSnapshotVersion):G.min();let n;return n=(function(s){return s.documents!==void 0})(r.query)?(function(s){return q(s.documents.length===1),ze(Or(tm(s.documents[0])))})(r.query):(function(s){return ze(om(s))})(r.query),new vt(n,r.targetId,"TargetPurposeListen",r.lastListenSequenceNumber,e,t,me.fromBase64String(r.resumeToken))}function hm(r,e){const t=On(e.snapshotVersion),n=On(e.lastLimboFreeSnapshotVersion);let i;i=so(e.target)?im(r.ct,e.target):Fo(r.ct,e.target)._t;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:kn(e.target),readTime:t,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:n,query:i}}function Yc(r){const e=om({parent:r.parent,structuredQuery:r.structuredQuery});return r.limitType==="LAST"?ao(e,e.limit,"L"):e}function Va(r,e){return new Hc(e.largestBatchId,rc(r.ct,e.overlayMutation))}function Fh(r,e){const t=e.path.lastSegment();return[r,qe(e.path.popLast()),t]}function Uh(r,e,t,n){return{indexId:r,uid:e,sequenceNumber:t,readTime:On(n.readTime),documentKey:qe(n.documentKey.path),largestBatchId:n.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hw{getBundleMetadata(e,t){return Bh(e).get(t).next((n=>{if(n)return(function(s){return{id:s.bundleId,createTime:xn(s.createTime),version:s.version}})(n)}))}saveBundleMetadata(e,t){return Bh(e).put((function(i){return{bundleId:i.id,createTime:On(ve(i.createTime)),version:i.version}})(t))}getNamedQuery(e,t){return qh(e).get(t).next((n=>{if(n)return(function(s){return{name:s.name,query:Yc(s.bundledQuery),readTime:xn(s.readTime)}})(n)}))}saveNamedQuery(e,t){return qh(e).put((function(i){return{name:i.name,readTime:On(ve(i.readTime)),bundledQuery:i.bundledQuery}})(t))}}function Bh(r){return Se(r,"bundles")}function qh(r){return Se(r,"namedQueries")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(e,t){this.serializer=e,this.userId=t}static lt(e,t){const n=t.uid||"";return new Uo(e,n)}getOverlay(e,t){return li(e).get(Fh(this.userId,t)).next((n=>n?Va(this.serializer,n):null))}getOverlays(e,t){const n=at();return w.forEach(t,(i=>this.getOverlay(e,i).next((s=>{s!==null&&n.set(i,s)})))).next((()=>n))}saveOverlays(e,t,n){const i=[];return n.forEach(((s,o)=>{const c=new Hc(t,o);i.push(this.ht(e,c))})),w.waitFor(i)}removeOverlaysForBatchId(e,t,n){const i=new Set;t.forEach((o=>i.add(qe(o.getCollectionPath()))));const s=[];return i.forEach((o=>{const c=IDBKeyRange.bound([this.userId,o,n],[this.userId,o,n+1],!1,!0);s.push(li(e).j("collectionPathOverlayIndex",c))})),w.waitFor(s)}getOverlaysForCollection(e,t,n){const i=at(),s=qe(t),o=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return li(e).U("collectionPathOverlayIndex",o).next((c=>{for(const u of c){const h=Va(this.serializer,u);i.set(h.getKey(),h)}return i}))}getOverlaysForCollectionGroup(e,t,n,i){const s=at();let o;const c=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return li(e).J({index:"collectionGroupOverlayIndex",range:c},((u,h,f)=>{const p=Va(this.serializer,h);s.size()<i||p.largestBatchId===o?(s.set(p.getKey(),p),o=p.largestBatchId):f.done()})).next((()=>s))}ht(e,t){return li(e).put((function(i,s,o){const[c,u,h]=Fh(s,o.mutation.key);return{userId:s,collectionPath:u,documentId:h,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:ji(i.ct,o.mutation)}})(this.serializer,this.userId,t))}}function li(r){return Se(r,"documentOverlays")}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qw{Pt(e){return Se(e,"globals")}getSessionToken(e){return this.Pt(e).get("sessionToken").next((t=>{const n=t?.value;return n?me.fromUint8Array(n):me.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Pt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wn{constructor(){}It(e,t){this.Tt(e,t),t.Et()}Tt(e,t){if("nullValue"in e)this.dt(t,5);else if("booleanValue"in e)this.dt(t,10),t.At(e.booleanValue?1:0);else if("integerValue"in e)this.dt(t,15),t.At(_e(e.integerValue));else if("doubleValue"in e){const n=_e(e.doubleValue);isNaN(n)?this.dt(t,13):(this.dt(t,15),Fi(n)?t.At(0):t.At(n))}else if("timestampValue"in e){let n=e.timestampValue;this.dt(t,20),typeof n=="string"&&(n=bt(n)),t.Rt(`${n.seconds||""}`),t.At(n.nanos||0)}else if("stringValue"in e)this.Vt(e.stringValue,t),this.ft(t);else if("bytesValue"in e)this.dt(t,30),t.gt(St(e.bytesValue)),this.ft(t);else if("referenceValue"in e)this.yt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.dt(t,45),t.At(n.latitude||0),t.At(n.longitude||0)}else"mapValue"in e?Ip(e)?this.dt(t,Number.MAX_SAFE_INTEGER):(this.wt(e.mapValue,t),this.ft(t)):"arrayValue"in e?(this.St(e.arrayValue,t),this.ft(t)):F()}Vt(e,t){this.dt(t,25),this.bt(e,t)}bt(e,t){t.Rt(e)}wt(e,t){const n=e.fields||{};this.dt(t,55);for(const i of Object.keys(n))this.Vt(i,t),this.Tt(n[i],t)}St(e,t){const n=e.values||[];this.dt(t,50);for(const i of n)this.Tt(i,t)}yt(e,t){this.dt(t,37),M.fromName(e).path.forEach((n=>{this.dt(t,60),this.bt(n,t)}))}dt(e,t){e.At(t)}ft(e){e.At(2)}}wn.Dt=new wn;function Jw(r){if(r===0)return 8;let e=0;return r>>4==0&&(e+=4,r<<=4),r>>6==0&&(e+=2,r<<=2),r>>7==0&&(e+=1),e}function zh(r){const e=64-(function(n){let i=0;for(let s=0;s<8;++s){const o=Jw(255&n[s]);if(i+=o,o!==8)break}return i})(r);return Math.ceil(e/8)}class Yw{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.vt(n.value),n=t.next();this.Ft()}Mt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.xt(n.value),n=t.next();this.Ot()}Nt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.vt(n);else if(n<2048)this.vt(960|n>>>6),this.vt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.vt(480|n>>>12),this.vt(128|63&n>>>6),this.vt(128|63&n);else{const i=t.codePointAt(0);this.vt(240|i>>>18),this.vt(128|63&i>>>12),this.vt(128|63&i>>>6),this.vt(128|63&i)}}this.Ft()}Lt(e){for(const t of e){const n=t.charCodeAt(0);if(n<128)this.xt(n);else if(n<2048)this.xt(960|n>>>6),this.xt(128|63&n);else if(t<"\uD800"||"\uDBFF"<t)this.xt(480|n>>>12),this.xt(128|63&n>>>6),this.xt(128|63&n);else{const i=t.codePointAt(0);this.xt(240|i>>>18),this.xt(128|63&i>>>12),this.xt(128|63&i>>>6),this.xt(128|63&i)}}this.Ot()}Bt(e){const t=this.kt(e),n=zh(t);this.qt(1+n),this.buffer[this.position++]=255&n;for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=255&t[i]}Qt(e){const t=this.kt(e),n=zh(t);this.qt(1+n),this.buffer[this.position++]=~(255&n);for(let i=t.length-n;i<t.length;++i)this.buffer[this.position++]=~(255&t[i])}Kt(){this.$t(255),this.$t(255)}Ut(){this.Wt(255),this.Wt(255)}reset(){this.position=0}seed(e){this.qt(e.length),this.buffer.set(e,this.position),this.position+=e.length}Gt(){return this.buffer.slice(0,this.position)}kt(e){const t=(function(s){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,s,!1),new Uint8Array(o.buffer)})(e),n=(128&t[0])!=0;t[0]^=n?255:128;for(let i=1;i<t.length;++i)t[i]^=n?255:0;return t}vt(e){const t=255&e;t===0?(this.$t(0),this.$t(255)):t===255?(this.$t(255),this.$t(0)):this.$t(t)}xt(e){const t=255&e;t===0?(this.Wt(0),this.Wt(255)):t===255?(this.Wt(255),this.Wt(0)):this.Wt(e)}Ft(){this.$t(0),this.$t(1)}Ot(){this.Wt(0),this.Wt(1)}$t(e){this.qt(1),this.buffer[this.position++]=e}Wt(e){this.qt(1),this.buffer[this.position++]=~e}qt(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const i=new Uint8Array(n);i.set(this.buffer),this.buffer=i}}class Xw{constructor(e){this.zt=e}gt(e){this.zt.Ct(e)}Rt(e){this.zt.Nt(e)}At(e){this.zt.Bt(e)}Et(){this.zt.Kt()}}class Zw{constructor(e){this.zt=e}gt(e){this.zt.Mt(e)}Rt(e){this.zt.Lt(e)}At(e){this.zt.Qt(e)}Et(){this.zt.Ut()}}class hi{constructor(){this.zt=new Yw,this.jt=new Xw(this.zt),this.Ht=new Zw(this.zt)}seed(e){this.zt.seed(e)}Jt(e){return e===0?this.jt:this.Ht}Gt(){return this.zt.Gt()}reset(){this.zt.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class An{constructor(e,t,n,i){this.indexId=e,this.documentKey=t,this.arrayValue=n,this.directionalValue=i}Yt(){const e=this.directionalValue.length,t=e===0||this.directionalValue[e-1]===255?e+1:e,n=new Uint8Array(t);return n.set(this.directionalValue,0),t!==e?n.set([0],this.directionalValue.length):++n[n.length-1],new An(this.indexId,this.documentKey,this.arrayValue,n)}}function Ut(r,e){let t=r.indexId-e.indexId;return t!==0?t:(t=Gh(r.arrayValue,e.arrayValue),t!==0?t:(t=Gh(r.directionalValue,e.directionalValue),t!==0?t:M.comparator(r.documentKey,e.documentKey)))}function Gh(r,e){for(let t=0;t<r.length&&t<e.length;++t){const n=r[t]-e[t];if(n!==0)return n}return r.length-e.length}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(e){this.Zt=new ie(((t,n)=>ue.comparator(t.field,n.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Xt=e.orderBy,this.en=[];for(const t of e.filters){const n=t;n.isInequality()?this.Zt=this.Zt.add(n):this.en.push(n)}}get tn(){return this.Zt.size>1}nn(e){if(q(e.collectionGroup===this.collectionId),this.tn)return!1;const t=Ka(e);if(t!==void 0&&!this.rn(t))return!1;const n=En(e);let i=new Set,s=0,o=0;for(;s<n.length&&this.rn(n[s]);++s)i=i.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.Zt.size>0){const c=this.Zt.getIterator().getNext();if(!i.has(c.field.canonicalString())){const u=n[s];if(!this.sn(c,u)||!this.on(this.Xt[o++],u))return!1}++s}for(;s<n.length;++s){const c=n[s];if(o>=this.Xt.length||!this.on(this.Xt[o++],c))return!1}return!0}_n(){if(this.tn)return null;let e=new ie(ue.comparator);const t=[];for(const n of this.en)if(!n.field.isKeyField())if(n.op==="array-contains"||n.op==="array-contains-any")t.push(new Pn(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new Pn(n.field,0))}for(const n of this.Xt)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new Pn(n.field,n.dir==="asc"?0:1)));return new fr(fr.UNKNOWN_ID,this.collectionId,t,pr.empty())}rn(e){for(const t of this.en)if(this.sn(t,e))return!0;return!1}sn(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const n=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===n}on(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dm(r){var e,t;if(q(r instanceof X||r instanceof ne),r instanceof X){if(r instanceof Sp){const i=((t=(e=r.value.arrayValue)===null||e===void 0?void 0:e.values)===null||t===void 0?void 0:t.map((s=>X.create(r.field,"==",s))))||[];return ne.create(i,"or")}return r}const n=r.filters.map((i=>dm(i)));return ne.create(n,r.op)}function eA(r){if(r.getFilters().length===0)return[];const e=oc(dm(r));return q(fm(e)),ic(e)||sc(e)?[e]:e.getFilters()}function ic(r){return r instanceof X}function sc(r){return r instanceof ne&&zc(r)}function fm(r){return ic(r)||sc(r)||(function(t){if(t instanceof ne&&Ja(t)){for(const n of t.getFilters())if(!ic(n)&&!sc(n))return!1;return!0}return!1})(r)}function oc(r){if(q(r instanceof X||r instanceof ne),r instanceof X)return r;if(r.filters.length===1)return oc(r.filters[0]);const e=r.filters.map((n=>oc(n)));let t=ne.create(e,r.op);return t=lo(t),fm(t)?t:(q(t instanceof ne),q(gr(t)),q(t.filters.length>1),t.filters.reduce(((n,i)=>Xc(n,i))))}function Xc(r,e){let t;return q(r instanceof X||r instanceof ne),q(e instanceof X||e instanceof ne),t=r instanceof X?e instanceof X?(function(i,s){return ne.create([i,s],"and")})(r,e):$h(r,e):e instanceof X?$h(e,r):(function(i,s){if(q(i.filters.length>0&&s.filters.length>0),gr(i)&&gr(s))return Ap(i,s.getFilters());const o=Ja(i)?i:s,c=Ja(i)?s:i,u=o.filters.map((h=>Xc(h,c)));return ne.create(u,"or")})(r,e),lo(t)}function $h(r,e){if(gr(e))return Ap(e,r.getFilters());{const t=e.filters.map((n=>Xc(r,n)));return ne.create(t,"or")}}function lo(r){if(q(r instanceof X||r instanceof ne),r instanceof X)return r;const e=r.getFilters();if(e.length===1)return lo(e[0]);if(vp(r))return r;const t=e.map((i=>lo(i))),n=[];return t.forEach((i=>{i instanceof X?n.push(i):i instanceof ne&&(i.op===r.op?n.push(...i.filters):n.push(i))})),n.length===1?n[0]:ne.create(n,r.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tA{constructor(){this.an=new Zc}addToCollectionParentIndex(e,t){return this.an.add(t),w.resolve()}getCollectionParents(e,t){return w.resolve(this.an.getEntries(t))}addFieldIndex(e,t){return w.resolve()}deleteFieldIndex(e,t){return w.resolve()}deleteAllFieldIndexes(e){return w.resolve()}createTargetIndexes(e,t){return w.resolve()}getDocumentsMatchingTarget(e,t){return w.resolve(null)}getIndexType(e,t){return w.resolve(0)}getFieldIndexes(e,t){return w.resolve([])}getNextCollectionGroupToUpdate(e){return w.resolve(null)}getMinOffset(e,t){return w.resolve(Xe.min())}getMinOffsetFromCollectionGroup(e,t){return w.resolve(Xe.min())}updateCollectionGroup(e,t,n){return w.resolve()}updateIndexEntries(e,t){return w.resolve()}}class Zc{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t]||new ie(Y.comparator),s=!i.has(n);return this.index[t]=i.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),i=this.index[t];return i&&i.has(n)}getEntries(e){return(this.index[e]||new ie(Y.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Os=new Uint8Array(0);class nA{constructor(e,t){this.databaseId=t,this.un=new Zc,this.cn=new kt((n=>kn(n)),((n,i)=>Zi(n,i))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.un.has(t)){const n=t.lastSegment(),i=t.popLast();e.addOnCommittedListener((()=>{this.un.add(t)}));const s={collectionId:n,parent:qe(i)};return Kh(e).put(s)}return w.resolve()}getCollectionParents(e,t){const n=[],i=IDBKeyRange.bound([t,""],[sp(t),""],!1,!0);return Kh(e).U(i).next((s=>{for(const o of s){if(o.collectionId!==t)break;n.push(ot(o.parent))}return n}))}addFieldIndex(e,t){const n=di(e),i=(function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete i.indexId;const s=n.add(i);if(t.indexState){const o=Yn(e);return s.next((c=>{o.put(Uh(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return s.next()}deleteFieldIndex(e,t){const n=di(e),i=Yn(e),s=Jn(e);return n.delete(t.indexId).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=di(e),n=Jn(e),i=Yn(e);return t.j().next((()=>n.j())).next((()=>i.j()))}createTargetIndexes(e,t){return w.forEach(this.ln(t),(n=>this.getIndexType(e,n).next((i=>{if(i===0||i===1){const s=new jh(n)._n();if(s!=null)return this.addFieldIndex(e,s)}}))))}getDocumentsMatchingTarget(e,t){const n=Jn(e);let i=!0;const s=new Map;return w.forEach(this.ln(t),(o=>this.hn(e,o).next((c=>{i&&(i=!!c),s.set(o,c)})))).next((()=>{if(i){let o=W();const c=[];return w.forEach(s,((u,h)=>{N("IndexedDbIndexManager",`Using index ${(function(U){return`id=${U.indexId}|cg=${U.collectionGroup}|f=${U.fields.map((H=>`${H.fieldPath}:${H.kind}`)).join(",")}`})(u)} to execute ${kn(t)}`);const f=(function(U,H){const ee=Ka(H);if(ee===void 0)return null;for(const K of oo(U,ee.fieldPath))switch(K.op){case"array-contains-any":return K.value.arrayValue.values||[];case"array-contains":return[K.value]}return null})(h,u),p=(function(U,H){const ee=new Map;for(const K of En(H))for(const E of oo(U,K.fieldPath))switch(E.op){case"==":case"in":ee.set(K.fieldPath.canonicalString(),E.value);break;case"not-in":case"!=":return ee.set(K.fieldPath.canonicalString(),E.value),Array.from(ee.values())}return null})(h,u),_=(function(U,H){const ee=[];let K=!0;for(const E of En(H)){const g=E.kind===0?Ah(U,E.fieldPath,U.startAt):Rh(U,E.fieldPath,U.startAt);ee.push(g.value),K&&(K=g.inclusive)}return new nn(ee,K)})(h,u),R=(function(U,H){const ee=[];let K=!0;for(const E of En(H)){const g=E.kind===0?Rh(U,E.fieldPath,U.endAt):Ah(U,E.fieldPath,U.endAt);ee.push(g.value),K&&(K=g.inclusive)}return new nn(ee,K)})(h,u),D=this.Pn(u,h,_),V=this.Pn(u,h,R),C=this.In(u,h,p),z=this.Tn(u.indexId,f,D,_.inclusive,V,R.inclusive,C);return w.forEach(z,(j=>n.G(j,t.limit).next((U=>{U.forEach((H=>{const ee=M.fromSegments(H.documentKey);o.has(ee)||(o=o.add(ee),c.push(ee))}))}))))})).next((()=>c))}return w.resolve(null)}))}ln(e){let t=this.cn.get(e);return t||(e.filters.length===0?t=[e]:t=eA(ne.create(e.filters,"and")).map((n=>Xa(e.path,e.collectionGroup,e.orderBy,n.getFilters(),e.limit,e.startAt,e.endAt))),this.cn.set(e,t),t)}Tn(e,t,n,i,s,o,c){const u=(t!=null?t.length:1)*Math.max(n.length,s.length),h=u/(t!=null?t.length:1),f=[];for(let p=0;p<u;++p){const _=t?this.En(t[p/h]):Os,R=this.dn(e,_,n[p%h],i),D=this.An(e,_,s[p%h],o),V=c.map((C=>this.dn(e,_,C,!0)));f.push(...this.createRange(R,D,V))}return f}dn(e,t,n,i){const s=new An(e,M.empty(),t,n);return i?s:s.Yt()}An(e,t,n,i){const s=new An(e,M.empty(),t,n);return i?s.Yt():s}hn(e,t){const n=new jh(t),i=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,i).next((s=>{let o=null;for(const c of s)n.nn(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o}))}getIndexType(e,t){let n=2;const i=this.ln(t);return w.forEach(i,(s=>this.hn(e,s).next((o=>{o?n!==0&&o.fields.length<(function(u){let h=new ie(ue.comparator),f=!1;for(const p of u.filters)for(const _ of p.getFlattenedFilters())_.field.isKeyField()||(_.op==="array-contains"||_.op==="array-contains-any"?f=!0:h=h.add(_.field));for(const p of u.orderBy)p.field.isKeyField()||(h=h.add(p.field));return h.size+(f?1:0)})(s)&&(n=1):n=0})))).next((()=>(function(o){return o.limit!==null})(t)&&i.length>1&&n===2?1:n))}Rn(e,t){const n=new hi;for(const i of En(e)){const s=t.data.field(i.fieldPath);if(s==null)return null;const o=n.Jt(i.kind);wn.Dt.It(s,o)}return n.Gt()}En(e){const t=new hi;return wn.Dt.It(e,t.Jt(0)),t.Gt()}Vn(e,t){const n=new hi;return wn.Dt.It(Dn(this.databaseId,t),n.Jt((function(s){const o=En(s);return o.length===0?0:o[o.length-1].kind})(e))),n.Gt()}In(e,t,n){if(n===null)return[];let i=[];i.push(new hi);let s=0;for(const o of En(e)){const c=n[s++];for(const u of i)if(this.mn(t,o.fieldPath)&&qi(c))i=this.fn(i,o,c);else{const h=u.Jt(o.kind);wn.Dt.It(c,h)}}return this.gn(i)}Pn(e,t,n){return this.In(e,t,n.position)}gn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].Gt();return t}fn(e,t,n){const i=[...e],s=[];for(const o of n.arrayValue.values||[])for(const c of i){const u=new hi;u.seed(c.Gt()),wn.Dt.It(o,u.Jt(t.kind)),s.push(u)}return s}mn(e,t){return!!e.filters.find((n=>n instanceof X&&n.field.isEqual(t)&&(n.op==="in"||n.op==="not-in")))}getFieldIndexes(e,t){const n=di(e),i=Yn(e);return(t?n.U("collectionGroupIndex",IDBKeyRange.bound(t,t)):n.U()).next((s=>{const o=[];return w.forEach(s,(c=>i.get([c.indexId,this.uid]).next((u=>{o.push((function(f,p){const _=p?new pr(p.sequenceNumber,new Xe(xn(p.readTime),new M(ot(p.documentKey)),p.largestBatchId)):pr.empty(),R=f.fields.map((([D,V])=>new Pn(ue.fromServerFormat(D),V)));return new fr(f.indexId,f.collectionGroup,R,_)})(c,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((n,i)=>{const s=n.indexState.sequenceNumber-i.indexState.sequenceNumber;return s!==0?s:$(n.collectionGroup,i.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,n){const i=di(e),s=Yn(e);return this.pn(e).next((o=>i.U("collectionGroupIndex",IDBKeyRange.bound(t,t)).next((c=>w.forEach(c,(u=>s.put(Uh(u.indexId,this.uid,o,n))))))))}updateIndexEntries(e,t){const n=new Map;return w.forEach(t,((i,s)=>{const o=n.get(i.collectionGroup);return(o?w.resolve(o):this.getFieldIndexes(e,i.collectionGroup)).next((c=>(n.set(i.collectionGroup,c),w.forEach(c,(u=>this.yn(e,i,u).next((h=>{const f=this.wn(s,u);return h.isEqual(f)?w.resolve():this.Sn(e,s,u,h,f)})))))))}))}bn(e,t,n,i){return Jn(e).put({indexId:i.indexId,uid:this.uid,arrayValue:i.arrayValue,directionalValue:i.directionalValue,orderedDocumentKey:this.Vn(n,t.key),documentKey:t.key.path.toArray()})}Dn(e,t,n,i){return Jn(e).delete([i.indexId,this.uid,i.arrayValue,i.directionalValue,this.Vn(n,t.key),t.key.path.toArray()])}yn(e,t,n){const i=Jn(e);let s=new ie(Ut);return i.J({index:"documentKeyIndex",range:IDBKeyRange.only([n.indexId,this.uid,this.Vn(n,t)])},((o,c)=>{s=s.add(new An(n.indexId,t,c.arrayValue,c.directionalValue))})).next((()=>s))}wn(e,t){let n=new ie(Ut);const i=this.Rn(t,e);if(i==null)return n;const s=Ka(t);if(s!=null){const o=e.data.field(s.fieldPath);if(qi(o))for(const c of o.arrayValue.values||[])n=n.add(new An(t.indexId,e.key,this.En(c),i))}else n=n.add(new An(t.indexId,e.key,Os,i));return n}Sn(e,t,n,i,s){N("IndexedDbIndexManager","Updating index entries for document '%s'",t.key);const o=[];return(function(u,h,f,p,_){const R=u.getIterator(),D=h.getIterator();let V=Qn(R),C=Qn(D);for(;V||C;){let z=!1,j=!1;if(V&&C){const U=f(V,C);U<0?j=!0:U>0&&(z=!0)}else V!=null?j=!0:z=!0;z?(p(C),C=Qn(D)):j?(_(V),V=Qn(R)):(V=Qn(R),C=Qn(D))}})(i,s,Ut,(c=>{o.push(this.bn(e,t,n,c))}),(c=>{o.push(this.Dn(e,t,n,c))})),w.waitFor(o)}pn(e){let t=1;return Yn(e).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((n,i,s)=>{s.done(),t=i.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((o,c)=>Ut(o,c))).filter(((o,c,u)=>!c||Ut(o,u[c-1])!==0));const i=[];i.push(e);for(const o of n){const c=Ut(o,e),u=Ut(o,t);if(c===0)i[0]=e.Yt();else if(c>0&&u<0)i.push(o),i.push(o.Yt());else if(u>0)break}i.push(t);const s=[];for(let o=0;o<i.length;o+=2){if(this.Cn(i[o],i[o+1]))return[];const c=[i[o].indexId,this.uid,i[o].arrayValue,i[o].directionalValue,Os,[]],u=[i[o+1].indexId,this.uid,i[o+1].arrayValue,i[o+1].directionalValue,Os,[]];s.push(IDBKeyRange.bound(c,u))}return s}Cn(e,t){return Ut(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Wh)}getMinOffset(e,t){return w.mapArray(this.ln(t),(n=>this.hn(e,n).next((i=>i||F())))).next(Wh)}}function Kh(r){return Se(r,"collectionParents")}function Jn(r){return Se(r,"indexEntries")}function di(r){return Se(r,"indexConfiguration")}function Yn(r){return Se(r,"indexState")}function Wh(r){q(r.length!==0);let e=r[0].indexState.offset,t=e.largestBatchId;for(let n=1;n<r.length;n++){const i=r[n].indexState.offset;Uc(i,e)<0&&(e=i),t<i.largestBatchId&&(t=i.largestBatchId)}return new Xe(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Hh={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class Be{constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}static withCacheSize(e){return new Be(e,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pm(r,e,t){const n=r.store("mutations"),i=r.store("documentMutations"),s=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=n.J({range:o},((f,p,_)=>(c++,_.delete())));s.push(u.next((()=>{q(c===1)})));const h=[];for(const f of t.mutations){const p=dp(e,f.key.path,t.batchId);s.push(i.delete(p)),h.push(f.key)}return w.waitFor(s).next((()=>h))}function ho(r){if(!r)return 0;let e;if(r.document)e=r.document;else if(r.unknownDocument)e=r.unknownDocument;else{if(!r.noDocument)throw F();e=r.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Be.DEFAULT_COLLECTION_PERCENTILE=10,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Be.DEFAULT=new Be(41943040,Be.DEFAULT_COLLECTION_PERCENTILE,Be.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Be.DISABLED=new Be(-1,0,0);class Bo{constructor(e,t,n,i){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=i,this.vn={}}static lt(e,t,n,i){q(e.uid!=="");const s=e.isAuthenticated()?e.uid:"";return new Bo(s,t,n,i)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Bt(e).J({index:"userMutationsIndex",range:n},((i,s,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,n,i){const s=nr(e),o=Bt(e);return o.add({}).next((c=>{q(typeof c=="number");const u=new Kc(c,t,n,i),h=(function(R,D,V){const C=V.baseMutations.map((j=>ji(R.ct,j))),z=V.mutations.map((j=>ji(R.ct,j)));return{userId:D,batchId:V.batchId,localWriteTimeMs:V.localWriteTime.toMillis(),baseMutations:C,mutations:z}})(this.serializer,this.userId,u),f=[];let p=new ie(((_,R)=>$(_.canonicalString(),R.canonicalString())));for(const _ of i){const R=dp(this.userId,_.key.path,c);p=p.add(_.key.path.popLast()),f.push(o.put(h)),f.push(s.put(R,Gv))}return p.forEach((_=>{f.push(this.indexManager.addToCollectionParentIndex(e,_))})),e.addOnCommittedListener((()=>{this.vn[c]=u.keys()})),w.waitFor(f).next((()=>u))}))}lookupMutationBatch(e,t){return Bt(e).get(t).next((n=>n?(q(n.userId===this.userId),vn(this.serializer,n)):null))}Fn(e,t){return this.vn[t]?w.resolve(this.vn[t]):this.lookupMutationBatch(e,t).next((n=>{if(n){const i=n.keys();return this.vn[t]=i,i}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return Bt(e).J({index:"userMutationsIndex",range:i},((o,c,u)=>{c.userId===this.userId&&(q(c.batchId>=n),s=vn(this.serializer,c)),u.done()})).next((()=>s))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=-1;return Bt(e).J({index:"userMutationsIndex",range:t,reverse:!0},((i,s,o)=>{n=s.batchId,o.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return Bt(e).U("userMutationsIndex",t).next((n=>n.map((i=>vn(this.serializer,i)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=js(this.userId,t.path),i=IDBKeyRange.lowerBound(n),s=[];return nr(e).J({range:i},((o,c,u)=>{const[h,f,p]=o,_=ot(f);if(h===this.userId&&t.path.isEqual(_))return Bt(e).get(p).next((R=>{if(!R)throw F();q(R.userId===this.userId),s.push(vn(this.serializer,R))}));u.done()})).next((()=>s))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ie($);const i=[];return t.forEach((s=>{const o=js(this.userId,s.path),c=IDBKeyRange.lowerBound(o),u=nr(e).J({range:c},((h,f,p)=>{const[_,R,D]=h,V=ot(R);_===this.userId&&s.path.isEqual(V)?n=n.add(D):p.done()}));i.push(u)})),w.waitFor(i).next((()=>this.Mn(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1,s=js(this.userId,n),o=IDBKeyRange.lowerBound(s);let c=new ie($);return nr(e).J({range:o},((u,h,f)=>{const[p,_,R]=u,D=ot(_);p===this.userId&&n.isPrefixOf(D)?D.length===i&&(c=c.add(R)):f.done()})).next((()=>this.Mn(e,c)))}Mn(e,t){const n=[],i=[];return t.forEach((s=>{i.push(Bt(e).get(s).next((o=>{if(o===null)throw F();q(o.userId===this.userId),n.push(vn(this.serializer,o))})))})),w.waitFor(i).next((()=>n))}removeMutationBatch(e,t){return pm(e._e,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.xn(t.batchId)})),w.forEach(n,(i=>this.referenceDelegate.markPotentiallyOrphaned(e,i))))))}xn(e){delete this.vn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return w.resolve();const n=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),i=[];return nr(e).J({range:n},((s,o,c)=>{if(s[0]===this.userId){const u=ot(s[1]);i.push(u)}else c.done()})).next((()=>{q(i.length===0)}))}))}containsKey(e,t){return mm(e,this.userId,t)}On(e){return gm(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""}))}}function mm(r,e,t){const n=js(e,t.path),i=n[1],s=IDBKeyRange.lowerBound(n);let o=!1;return nr(r).J({range:s,H:!0},((c,u,h)=>{const[f,p,_]=c;f===e&&p===i&&(o=!0),h.done()})).next((()=>o))}function Bt(r){return Se(r,"mutations")}function nr(r){return Se(r,"documentMutations")}function gm(r){return Se(r,"mutationQueues")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ln{constructor(e){this.Nn=e}next(){return this.Nn+=2,this.Nn}static Ln(){return new Ln(0)}static Bn(){return new Ln(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rA{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.kn(e).next((t=>{const n=new Ln(t.highestTargetId);return t.highestTargetId=n.next(),this.qn(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.kn(e).next((t=>G.fromTimestamp(new fe(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.kn(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.kn(e).next((i=>(i.highestListenSequenceNumber=t,n&&(i.lastRemoteSnapshotVersion=n.toTimestamp()),t>i.highestListenSequenceNumber&&(i.highestListenSequenceNumber=t),this.qn(e,i))))}addTargetData(e,t){return this.Qn(e,t).next((()=>this.kn(e).next((n=>(n.targetCount+=1,this.Kn(t,n),this.qn(e,n))))))}updateTargetData(e,t){return this.Qn(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>Xn(e).delete(t.targetId))).next((()=>this.kn(e))).next((n=>(q(n.targetCount>0),n.targetCount-=1,this.qn(e,n))))}removeTargets(e,t,n){let i=0;const s=[];return Xn(e).J(((o,c)=>{const u=Ti(c);u.sequenceNumber<=t&&n.get(u.targetId)===null&&(i++,s.push(this.removeTargetData(e,u)))})).next((()=>w.waitFor(s))).next((()=>i))}forEachTarget(e,t){return Xn(e).J(((n,i)=>{const s=Ti(i);t(s)}))}kn(e){return Qh(e).get("targetGlobalKey").next((t=>(q(t!==null),t)))}qn(e,t){return Qh(e).put("targetGlobalKey",t)}Qn(e,t){return Xn(e).put(hm(this.serializer,t))}Kn(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.kn(e).next((t=>t.targetCount))}getTargetData(e,t){const n=kn(t),i=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return Xn(e).J({range:i,index:"queryTargetsIndex"},((o,c,u)=>{const h=Ti(c);Zi(t,h.target)&&(s=h,u.done())})).next((()=>s))}addMatchingKeys(e,t,n){const i=[],s=zt(e);return t.forEach((o=>{const c=qe(o.path);i.push(s.put({targetId:n,path:c})),i.push(this.referenceDelegate.addReference(e,n,o))})),w.waitFor(i)}removeMatchingKeys(e,t,n){const i=zt(e);return w.forEach(t,(s=>{const o=qe(s.path);return w.waitFor([i.delete([n,o]),this.referenceDelegate.removeReference(e,n,s)])}))}removeMatchingKeysForTargetId(e,t){const n=zt(e),i=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(i)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),i=zt(e);let s=W();return i.J({range:n,H:!0},((o,c,u)=>{const h=ot(o[1]),f=new M(h);s=s.add(f)})).next((()=>s))}containsKey(e,t){const n=qe(t.path),i=IDBKeyRange.bound([n],[sp(n)],!1,!0);let s=0;return zt(e).J({index:"documentTargetsIndex",H:!0,range:i},(([o,c],u,h)=>{o!==0&&(s++,h.done())})).next((()=>s>0))}ot(e,t){return Xn(e).get(t).next((n=>n?Ti(n):null))}}function Xn(r){return Se(r,"targets")}function Qh(r){return Se(r,"targetGlobal")}function zt(r){return Se(r,"targetDocuments")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jh([r,e],[t,n]){const i=$(r,t);return i===0?$(e,n):i}class iA{constructor(e){this.$n=e,this.buffer=new ie(Jh),this.Un=0}Wn(){return++this.Un}Gn(e){const t=[e,this.Wn()];if(this.buffer.size<this.$n)this.buffer=this.buffer.add(t);else{const n=this.buffer.last();Jh(t,n)<0&&(this.buffer=this.buffer.delete(n).add(t))}}get maxValue(){return this.buffer.last()[0]}}class _m{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.zn=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.jn(6e4)}stop(){this.zn&&(this.zn.cancel(),this.zn=null)}get started(){return this.zn!==null}jn(e){N("LruGarbageCollector",`Garbage collection scheduled in ${e}ms`),this.zn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.zn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){cn(t)?N("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await an(t)}await this.jn(3e5)}))}}class sA{constructor(e,t){this.Hn=e,this.params=t}calculateTargetCount(e,t){return this.Hn.Jn(e).next((n=>Math.floor(t/100*n)))}nthSequenceNumber(e,t){if(t===0)return w.resolve(Ke.oe);const n=new iA(t);return this.Hn.forEachTarget(e,(i=>n.Gn(i.sequenceNumber))).next((()=>this.Hn.Yn(e,(i=>n.Gn(i))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Hn.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Hn.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(N("LruGarbageCollector","Garbage collection skipped; disabled"),w.resolve(Hh)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(N("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Hh):this.Zn(e,t)))}getCacheSize(e){return this.Hn.getCacheSize(e)}Zn(e,t){let n,i,s,o,c,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(N("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),i=this.params.maximumSequenceNumbersToCollect):i=p,o=Date.now(),this.nthSequenceNumber(e,i)))).next((p=>(n=p,c=Date.now(),this.removeTargets(e,n,t)))).next((p=>(s=p,u=Date.now(),this.removeOrphanedDocuments(e,n)))).next((p=>(h=Date.now(),Zn()<=J.DEBUG&&N("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${i} in `+(c-o)+`ms
	Removed ${s} targets in `+(u-c)+`ms
	Removed ${p} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),w.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:p}))))}}function ym(r,e){return new sA(r,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oA{constructor(e,t){this.db=e,this.garbageCollector=ym(this,t)}Jn(e){const t=this.Xn(e);return this.db.getTargetCache().getTargetCount(e).next((n=>t.next((i=>n+i))))}Xn(e){let t=0;return this.Yn(e,(n=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Yn(e,t){return this.er(e,((n,i)=>t(i)))}addReference(e,t,n){return xs(e,n)}removeReference(e,t,n){return xs(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return xs(e,t)}tr(e,t){return(function(i,s){let o=!1;return gm(i).Y((c=>mm(i,c,s).next((u=>(u&&(o=!0),w.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),i=[];let s=0;return this.er(e,((o,c)=>{if(c<=t){const u=this.tr(e,o).next((h=>{if(!h)return s++,n.getEntry(e,o).next((()=>(n.removeEntry(o,G.min()),zt(e).delete((function(p){return[0,qe(p.path)]})(o)))))}));i.push(u)}})).next((()=>w.waitFor(i))).next((()=>n.apply(e))).next((()=>s))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return xs(e,t)}er(e,t){const n=zt(e);let i,s=Ke.oe;return n.J({index:"documentTargetsIndex"},(([o,c],{path:u,sequenceNumber:h})=>{o===0?(s!==Ke.oe&&t(new M(ot(i)),s),s=h,i=u):s=Ke.oe})).next((()=>{s!==Ke.oe&&t(new M(ot(i)),s)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function xs(r,e){return zt(r).put((function(n,i){return{targetId:0,path:qe(n.path),sequenceNumber:i}})(e,r.currentSequenceNumber))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Im{constructor(){this.changes=new kt((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ce.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return n!==void 0?w.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aA{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return yn(e).put(n)}removeEntry(e,t,n){return yn(e).delete((function(s,o){const c=s.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],uo(o),c[c.length-1]]})(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.nr(e,n))))}getEntry(e,t){let n=ce.newInvalidDocument(t);return yn(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(fi(t))},((i,s)=>{n=this.rr(t,s)})).next((()=>n))}ir(e,t){let n={size:0,document:ce.newInvalidDocument(t)};return yn(e).J({index:"documentKeyIndex",range:IDBKeyRange.only(fi(t))},((i,s)=>{n={document:this.rr(t,s),size:ho(s)}})).next((()=>n))}getEntries(e,t){let n=He();return this.sr(e,t,((i,s)=>{const o=this.rr(i,s);n=n.insert(i,o)})).next((()=>n))}_r(e,t){let n=He(),i=new oe(M.comparator);return this.sr(e,t,((s,o)=>{const c=this.rr(s,o);n=n.insert(s,c),i=i.insert(s,ho(o))})).next((()=>({documents:n,ar:i})))}sr(e,t,n){if(t.isEmpty())return w.resolve();let i=new ie(Zh);t.forEach((u=>i=i.add(u)));const s=IDBKeyRange.bound(fi(i.first()),fi(i.last())),o=i.getIterator();let c=o.getNext();return yn(e).J({index:"documentKeyIndex",range:s},((u,h,f)=>{const p=M.fromSegments([...h.prefixPath,h.collectionGroup,h.documentId]);for(;c&&Zh(c,p)<0;)n(c,null),c=o.getNext();c&&c.isEqual(p)&&(n(c,h),c=o.hasNext()?o.getNext():null),c?f.$(fi(c)):f.done()})).next((()=>{for(;c;)n(c,null),c=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,n,i,s){const o=t.path,c=[o.popLast().toArray(),o.lastSegment(),uo(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return yn(e).U(IDBKeyRange.bound(c,u,!0)).next((h=>{s?.incrementDocumentReadCount(h.length);let f=He();for(const p of h){const _=this.rr(M.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);_.isFoundDocument()&&(ts(t,_)||i.has(_.key))&&(f=f.insert(_.key,_))}return f}))}getAllFromCollectionGroup(e,t,n,i){let s=He();const o=Xh(t,n),c=Xh(t,Xe.max());return yn(e).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(o,c,!0)},((u,h,f)=>{const p=this.rr(M.fromSegments(h.prefixPath.concat(h.collectionGroup,h.documentId)),h);s=s.insert(p.key,p),s.size===i&&f.done()})).next((()=>s))}newChangeBuffer(e){return new cA(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return Yh(e).get("remoteDocumentGlobalKey").next((t=>(q(!!t),t)))}nr(e,t){return Yh(e).put("remoteDocumentGlobalKey",t)}rr(e,t){if(t){const n=Ww(this.serializer,t);if(!(n.isNoDocument()&&n.version.isEqual(G.min())))return n}return ce.newInvalidDocument(e)}}function Em(r){return new aA(r)}class cA extends Im{constructor(e,t){super(),this.ur=e,this.trackRemovals=t,this.cr=new kt((n=>n.toString()),((n,i)=>n.isEqual(i)))}applyChanges(e){const t=[];let n=0,i=new ie(((s,o)=>$(s.canonicalString(),o.canonicalString())));return this.changes.forEach(((s,o)=>{const c=this.cr.get(s);if(t.push(this.ur.removeEntry(e,s,c.readTime)),o.isValidDocument()){const u=Mh(this.ur.serializer,o);i=i.add(s.path.popLast());const h=ho(u);n+=h-c.size,t.push(this.ur.addEntry(e,s,u))}else if(n-=c.size,this.trackRemovals){const u=Mh(this.ur.serializer,o.convertToNoDocument(G.min()));t.push(this.ur.addEntry(e,s,u))}})),i.forEach((s=>{t.push(this.ur.indexManager.addToCollectionParentIndex(e,s))})),t.push(this.ur.updateMetadata(e,n)),w.waitFor(t)}getFromCache(e,t){return this.ur.ir(e,t).next((n=>(this.cr.set(t,{size:n.size,readTime:n.document.readTime}),n.document)))}getAllFromCache(e,t){return this.ur._r(e,t).next((({documents:n,ar:i})=>(i.forEach(((s,o)=>{this.cr.set(s,{size:o,readTime:n.get(s).readTime})})),n)))}}function Yh(r){return Se(r,"remoteDocumentGlobal")}function yn(r){return Se(r,"remoteDocumentsV14")}function fi(r){const e=r.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Xh(r,e){const t=e.documentKey.path.toArray();return[r,uo(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function Zh(r,e){const t=r.path.toArray(),n=e.path.toArray();let i=0;for(let s=0;s<t.length-2&&s<n.length-2;++s)if(i=$(t[s],n[s]),i)return i;return i=$(t.length,n.length),i||(i=$(t[t.length-2],n[n.length-2]),i||$(t[t.length-1],n[n.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uA{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tm{constructor(e,t,n,i){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=i}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((i=>(n=i,this.remoteDocumentCache.getEntry(e,t)))).next((i=>(n!==null&&Si(n.mutation,i,We.empty(),fe.now()),i)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.getLocalViewOfDocuments(e,n,W()).next((()=>n))))}getLocalViewOfDocuments(e,t,n=W()){const i=at();return this.populateOverlays(e,i,t).next((()=>this.computeViews(e,t,i,n).next((s=>{let o=Ii();return s.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const n=at();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,W())))}populateOverlays(e,t,n){const i=[];return n.forEach((s=>{t.has(s)||i.push(s)})),this.documentOverlayCache.getOverlays(e,i).next((s=>{s.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,n,i){let s=He();const o=bi(),c=(function(){return bi()})();return t.forEach(((u,h)=>{const f=n.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof Nt)?s=s.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Si(f.mutation,h,f.mutation.getFieldMask(),fe.now())):o.set(h.key,We.empty())})),this.recalculateAndSaveOverlays(e,s).next((u=>(u.forEach(((h,f)=>o.set(h,f))),t.forEach(((h,f)=>{var p;return c.set(h,new uA(f,(p=o.get(h))!==null&&p!==void 0?p:null))})),c)))}recalculateAndSaveOverlays(e,t){const n=bi();let i=new oe(((o,c)=>o-c)),s=W();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const c of o)c.keys().forEach((u=>{const h=t.get(u);if(h===null)return;let f=n.get(u)||We.empty();f=c.applyToLocalView(h,f),n.set(u,f);const p=(i.get(c.batchId)||W()).add(u);i=i.insert(c.batchId,p)}))})).next((()=>{const o=[],c=i.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),h=u.key,f=u.value,p=Lp();f.forEach((_=>{if(!s.has(_)){const R=jp(t.get(_),n.get(_));R!==null&&p.set(_,R),s=s.add(_)}})),o.push(this.documentOverlayCache.saveOverlays(e,h,p))}return w.waitFor(o)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((n=>this.recalculateAndSaveOverlays(e,n)))}getDocumentsMatchingQuery(e,t,n,i){return(function(o){return M.isDocumentKey(o.path)&&o.collectionGroup===null&&o.filters.length===0})(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Gc(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,i):this.getDocumentsMatchingCollectionQuery(e,t,n,i)}getNextDocuments(e,t,n,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,i).next((s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,i-s.size):w.resolve(at());let c=-1,u=s;return o.next((h=>w.forEach(h,((f,p)=>(c<p.largestBatchId&&(c=p.largestBatchId),s.get(f)?w.resolve():this.remoteDocumentCache.getEntry(e,f).next((_=>{u=u.insert(f,_)}))))).next((()=>this.populateOverlays(e,h,s))).next((()=>this.computeViews(e,u,h,W()))).next((f=>({batchId:c,changes:xp(f)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new M(t)).next((n=>{let i=Ii();return n.isFoundDocument()&&(i=i.insert(n.key,n)),i}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,i){const s=t.collectionGroup;let o=Ii();return this.indexManager.getCollectionParents(e,s).next((c=>w.forEach(c,(u=>{const h=(function(p,_){return new Dt(_,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,n,i).next((f=>{f.forEach(((p,_)=>{o=o.insert(p,_)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,n,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,i)))).next((o=>{s.forEach(((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,ce.newInvalidDocument(f)))}));let c=Ii();return o.forEach(((u,h)=>{const f=s.get(u);f!==void 0&&Si(f.mutation,h,We.empty(),fe.now()),ts(t,h)&&(c=c.insert(u,h))})),c}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lA{constructor(e){this.serializer=e,this.lr=new Map,this.hr=new Map}getBundleMetadata(e,t){return w.resolve(this.lr.get(t))}saveBundleMetadata(e,t){return this.lr.set(t.id,(function(i){return{id:i.id,version:i.version,createTime:ve(i.createTime)}})(t)),w.resolve()}getNamedQuery(e,t){return w.resolve(this.hr.get(t))}saveNamedQuery(e,t){return this.hr.set(t.name,(function(i){return{name:i.name,query:Yc(i.bundledQuery),readTime:ve(i.readTime)}})(t)),w.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hA{constructor(){this.overlays=new oe(M.comparator),this.Pr=new Map}getOverlay(e,t){return w.resolve(this.overlays.get(t))}getOverlays(e,t){const n=at();return w.forEach(t,(i=>this.getOverlay(e,i).next((s=>{s!==null&&n.set(i,s)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((i,s)=>{this.ht(e,t,s)})),w.resolve()}removeOverlaysForBatchId(e,t,n){const i=this.Pr.get(n);return i!==void 0&&(i.forEach((s=>this.overlays=this.overlays.remove(s))),this.Pr.delete(n)),w.resolve()}getOverlaysForCollection(e,t,n){const i=at(),s=t.length+1,o=new M(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,h=u.getKey();if(!t.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>n&&i.set(u.getKey(),u)}return w.resolve(i)}getOverlaysForCollectionGroup(e,t,n,i){let s=new oe(((h,f)=>h-f));const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===t&&h.largestBatchId>n){let f=s.get(h.largestBatchId);f===null&&(f=at(),s=s.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const c=at(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((h,f)=>c.set(h,f))),!(c.size()>=i)););return w.resolve(c)}ht(e,t,n){const i=this.overlays.get(n.key);if(i!==null){const o=this.Pr.get(i.largestBatchId).delete(n.key);this.Pr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(n.key,new Hc(t,n));let s=this.Pr.get(t);s===void 0&&(s=W(),this.Pr.set(t,s)),this.Pr.set(t,s.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dA{constructor(){this.sessionToken=me.EMPTY_BYTE_STRING}getSessionToken(e){return w.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,w.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eu{constructor(){this.Ir=new ie(Pe.Tr),this.Er=new ie(Pe.dr)}isEmpty(){return this.Ir.isEmpty()}addReference(e,t){const n=new Pe(e,t);this.Ir=this.Ir.add(n),this.Er=this.Er.add(n)}Ar(e,t){e.forEach((n=>this.addReference(n,t)))}removeReference(e,t){this.Rr(new Pe(e,t))}Vr(e,t){e.forEach((n=>this.removeReference(n,t)))}mr(e){const t=new M(new Y([])),n=new Pe(t,e),i=new Pe(t,e+1),s=[];return this.Er.forEachInRange([n,i],(o=>{this.Rr(o),s.push(o.key)})),s}gr(){this.Ir.forEach((e=>this.Rr(e)))}Rr(e){this.Ir=this.Ir.delete(e),this.Er=this.Er.delete(e)}pr(e){const t=new M(new Y([])),n=new Pe(t,e),i=new Pe(t,e+1);let s=W();return this.Er.forEachInRange([n,i],(o=>{s=s.add(o.key)})),s}containsKey(e){const t=new Pe(e,0),n=this.Ir.firstAfterOrEqual(t);return n!==null&&e.isEqual(n.key)}}class Pe{constructor(e,t){this.key=e,this.yr=t}static Tr(e,t){return M.comparator(e.key,t.key)||$(e.yr,t.yr)}static dr(e,t){return $(e.yr,t.yr)||M.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fA{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.wr=1,this.Sr=new ie(Pe.Tr)}checkEmpty(e){return w.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,n,i){const s=this.wr;this.wr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new Kc(s,t,n,i);this.mutationQueue.push(o);for(const c of i)this.Sr=this.Sr.add(new Pe(c.key,s)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return w.resolve(o)}lookupMutationBatch(e,t){return w.resolve(this.br(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,i=this.Dr(n),s=i<0?0:i;return w.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return w.resolve(this.mutationQueue.length===0?-1:this.wr-1)}getAllMutationBatches(e){return w.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Pe(t,0),i=new Pe(t,Number.POSITIVE_INFINITY),s=[];return this.Sr.forEachInRange([n,i],(o=>{const c=this.br(o.yr);s.push(c)})),w.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new ie($);return t.forEach((i=>{const s=new Pe(i,0),o=new Pe(i,Number.POSITIVE_INFINITY);this.Sr.forEachInRange([s,o],(c=>{n=n.add(c.yr)}))})),w.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,i=n.length+1;let s=n;M.isDocumentKey(s)||(s=s.child(""));const o=new Pe(new M(s),0);let c=new ie($);return this.Sr.forEachWhile((u=>{const h=u.key.path;return!!n.isPrefixOf(h)&&(h.length===i&&(c=c.add(u.yr)),!0)}),o),w.resolve(this.Cr(c))}Cr(e){const t=[];return e.forEach((n=>{const i=this.br(n);i!==null&&t.push(i)})),t}removeMutationBatch(e,t){q(this.vr(t.batchId,"removed")===0),this.mutationQueue.shift();let n=this.Sr;return w.forEach(t.mutations,(i=>{const s=new Pe(i.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)})).next((()=>{this.Sr=n}))}xn(e){}containsKey(e,t){const n=new Pe(t,0),i=this.Sr.firstAfterOrEqual(n);return w.resolve(t.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,w.resolve()}vr(e,t){return this.Dr(e)}Dr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}br(e){const t=this.Dr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pA{constructor(e){this.Fr=e,this.docs=(function(){return new oe(M.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,i=this.docs.get(n),s=i?i.size:0,o=this.Fr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return w.resolve(n?n.document.mutableCopy():ce.newInvalidDocument(t))}getEntries(e,t){let n=He();return t.forEach((i=>{const s=this.docs.get(i);n=n.insert(i,s?s.document.mutableCopy():ce.newInvalidDocument(i))})),w.resolve(n)}getDocumentsMatchingQuery(e,t,n,i){let s=He();const o=t.path,c=new M(o.child("")),u=this.docs.getIteratorFrom(c);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||Uc(ap(f),n)<=0||(i.has(f.key)||ts(t,f))&&(s=s.insert(f.key,f.mutableCopy()))}return w.resolve(s)}getAllFromCollectionGroup(e,t,n,i){F()}Mr(e,t){return w.forEach(this.docs,(n=>t(n)))}newChangeBuffer(e){return new mA(this)}getSize(e){return w.resolve(this.size)}}class mA extends Im{constructor(e){super(),this.ur=e}applyChanges(e){const t=[];return this.changes.forEach(((n,i)=>{i.isValidDocument()?t.push(this.ur.addEntry(e,i)):this.ur.removeEntry(n)})),w.waitFor(t)}getFromCache(e,t){return this.ur.getEntry(e,t)}getAllFromCache(e,t){return this.ur.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gA{constructor(e){this.persistence=e,this.Or=new kt((t=>kn(t)),Zi),this.lastRemoteSnapshotVersion=G.min(),this.highestTargetId=0,this.Nr=0,this.Lr=new eu,this.targetCount=0,this.Br=Ln.Ln()}forEachTarget(e,t){return this.Or.forEach(((n,i)=>t(i))),w.resolve()}getLastRemoteSnapshotVersion(e){return w.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return w.resolve(this.Nr)}allocateTargetId(e){return this.highestTargetId=this.Br.next(),w.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.Nr&&(this.Nr=t),w.resolve()}Qn(e){this.Or.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.Br=new Ln(t),this.highestTargetId=t),e.sequenceNumber>this.Nr&&(this.Nr=e.sequenceNumber)}addTargetData(e,t){return this.Qn(t),this.targetCount+=1,w.resolve()}updateTargetData(e,t){return this.Qn(t),w.resolve()}removeTargetData(e,t){return this.Or.delete(t.target),this.Lr.mr(t.targetId),this.targetCount-=1,w.resolve()}removeTargets(e,t,n){let i=0;const s=[];return this.Or.forEach(((o,c)=>{c.sequenceNumber<=t&&n.get(c.targetId)===null&&(this.Or.delete(o),s.push(this.removeMatchingKeysForTargetId(e,c.targetId)),i++)})),w.waitFor(s).next((()=>i))}getTargetCount(e){return w.resolve(this.targetCount)}getTargetData(e,t){const n=this.Or.get(t)||null;return w.resolve(n)}addMatchingKeys(e,t,n){return this.Lr.Ar(t,n),w.resolve()}removeMatchingKeys(e,t,n){this.Lr.Vr(t,n);const i=this.persistence.referenceDelegate,s=[];return i&&t.forEach((o=>{s.push(i.markPotentiallyOrphaned(e,o))})),w.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.Lr.mr(t),w.resolve()}getMatchingKeysForTargetId(e,t){const n=this.Lr.pr(t);return w.resolve(n)}containsKey(e,t){return w.resolve(this.Lr.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(e,t){this.kr={},this.overlays={},this.qr=new Ke(0),this.Qr=!1,this.Qr=!0,this.Kr=new dA,this.referenceDelegate=e(this),this.$r=new gA(this),this.indexManager=new tA,this.remoteDocumentCache=(function(i){return new pA(i)})((n=>this.referenceDelegate.Ur(n))),this.serializer=new lm(t),this.Wr=new lA(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Qr=!1,Promise.resolve()}get started(){return this.Qr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new hA,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.kr[e.toKey()];return n||(n=new fA(t,this.referenceDelegate),this.kr[e.toKey()]=n),n}getGlobalsCache(){return this.Kr}getTargetCache(){return this.$r}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Wr}runTransaction(e,t,n){N("MemoryPersistence","Starting transaction:",e);const i=new _A(this.qr.next());return this.referenceDelegate.Gr(),n(i).next((s=>this.referenceDelegate.zr(i).next((()=>s)))).toPromise().then((s=>(i.raiseOnCommittedEvent(),s)))}jr(e,t){return w.or(Object.values(this.kr).map((n=>()=>n.containsKey(e,t))))}}class _A extends up{constructor(e){super(),this.currentSequenceNumber=e}}class qo{constructor(e){this.persistence=e,this.Hr=new eu,this.Jr=null}static Yr(e){return new qo(e)}get Zr(){if(this.Jr)return this.Jr;throw F()}addReference(e,t,n){return this.Hr.addReference(n,t),this.Zr.delete(n.toString()),w.resolve()}removeReference(e,t,n){return this.Hr.removeReference(n,t),this.Zr.add(n.toString()),w.resolve()}markPotentiallyOrphaned(e,t){return this.Zr.add(t.toString()),w.resolve()}removeTarget(e,t){this.Hr.mr(t.targetId).forEach((i=>this.Zr.add(i.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((i=>{i.forEach((s=>this.Zr.add(s.toString())))})).next((()=>n.removeTargetData(e,t)))}Gr(){this.Jr=new Set}zr(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return w.forEach(this.Zr,(n=>{const i=M.fromPath(n);return this.Xr(e,i).next((s=>{s||t.removeEntry(i,G.min())}))})).next((()=>(this.Jr=null,t.apply(e))))}updateLimboDocument(e,t){return this.Xr(e,t).next((n=>{n?this.Zr.delete(t.toString()):this.Zr.add(t.toString())}))}Ur(e){return 0}Xr(e,t){return w.or([()=>w.resolve(this.Hr.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.jr(e,t)])}}class fo{constructor(e,t){this.persistence=e,this.ei=new kt((n=>qe(n.path)),((n,i)=>n.isEqual(i))),this.garbageCollector=ym(this,t)}static Yr(e,t){return new fo(e,t)}Gr(){}zr(e){return w.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}Jn(e){const t=this.Xn(e);return this.persistence.getTargetCache().getTargetCount(e).next((n=>t.next((i=>n+i))))}Xn(e){let t=0;return this.Yn(e,(n=>{t++})).next((()=>t))}Yn(e,t){return w.forEach(this.ei,((n,i)=>this.tr(e,n,i).next((s=>s?w.resolve():t(i)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.Mr(e,(o=>this.tr(e,o,t).next((c=>{c||(n++,s.removeEntry(o,G.min()))})))).next((()=>s.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.ei.set(t,e.currentSequenceNumber),w.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.ei.set(n,e.currentSequenceNumber),w.resolve()}removeReference(e,t,n){return this.ei.set(n,e.currentSequenceNumber),w.resolve()}updateLimboDocument(e,t){return this.ei.set(t,e.currentSequenceNumber),w.resolve()}Ur(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ks(e.data.value)),t}tr(e,t,n){return w.or([()=>this.persistence.jr(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const i=this.ei.get(t);return w.resolve(i!==void 0&&i>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yA{constructor(e){this.serializer=e}O(e,t,n,i){const s=new Vo("createOrUpgrade",t);n<1&&i>=1&&((function(u){u.createObjectStore("owner")})(e),(function(u){u.createObjectStore("mutationQueues",{keyPath:"userId"}),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",ph,{unique:!0}),u.createObjectStore("documentMutations")})(e),ed(e),(function(u){u.createObjectStore("remoteDocuments")})(e));let o=w.resolve();return n<3&&i>=3&&(n!==0&&((function(u){u.deleteObjectStore("targetDocuments"),u.deleteObjectStore("targets"),u.deleteObjectStore("targetGlobal")})(e),ed(e)),o=o.next((()=>(function(u){const h=u.store("targetGlobal"),f={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:G.min().toTimestamp(),targetCount:0};return h.put("targetGlobalKey",f)})(s)))),n<4&&i>=4&&(n!==0&&(o=o.next((()=>(function(u,h){return h.store("mutations").U().next((f=>{u.deleteObjectStore("mutations"),u.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",ph,{unique:!0});const p=h.store("mutations"),_=f.map((R=>p.put(R)));return w.waitFor(_)}))})(e,s)))),o=o.next((()=>{(function(u){u.createObjectStore("clientMetadata",{keyPath:"clientId"})})(e)}))),n<5&&i>=5&&(o=o.next((()=>this.ti(s)))),n<6&&i>=6&&(o=o.next((()=>((function(u){u.createObjectStore("remoteDocumentGlobal")})(e),this.ni(s))))),n<7&&i>=7&&(o=o.next((()=>this.ri(s)))),n<8&&i>=8&&(o=o.next((()=>this.ii(e,s)))),n<9&&i>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),n<10&&i>=10&&(o=o.next((()=>this.si(s)))),n<11&&i>=11&&(o=o.next((()=>{(function(u){u.createObjectStore("bundles",{keyPath:"bundleId"})})(e),(function(u){u.createObjectStore("namedQueries",{keyPath:"name"})})(e)}))),n<12&&i>=12&&(o=o.next((()=>{(function(u){const h=u.createObjectStore("documentOverlays",{keyPath:tw});h.createIndex("collectionPathOverlayIndex",nw,{unique:!1}),h.createIndex("collectionGroupOverlayIndex",rw,{unique:!1})})(e)}))),n<13&&i>=13&&(o=o.next((()=>(function(u){const h=u.createObjectStore("remoteDocumentsV14",{keyPath:jv});h.createIndex("documentKeyIndex",$v),h.createIndex("collectionGroupIndex",Kv)})(e))).next((()=>this.oi(e,s))).next((()=>e.deleteObjectStore("remoteDocuments")))),n<14&&i>=14&&(o=o.next((()=>this._i(e,s)))),n<15&&i>=15&&(o=o.next((()=>(function(u){u.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),u.createObjectStore("indexState",{keyPath:Yv}).createIndex("sequenceNumberIndex",Xv,{unique:!1}),u.createObjectStore("indexEntries",{keyPath:Zv}).createIndex("documentKeyIndex",ew,{unique:!1})})(e)))),n<16&&i>=16&&(o=o.next((()=>{t.objectStore("indexState").clear()})).next((()=>{t.objectStore("indexEntries").clear()}))),n<17&&i>=17&&(o=o.next((()=>{(function(u){u.createObjectStore("globals",{keyPath:"name"})})(e)}))),o}ni(e){let t=0;return e.store("remoteDocuments").J(((n,i)=>{t+=ho(i)})).next((()=>{const n={byteSize:t};return e.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",n)}))}ti(e){const t=e.store("mutationQueues"),n=e.store("mutations");return t.U().next((i=>w.forEach(i,(s=>{const o=IDBKeyRange.bound([s.userId,-1],[s.userId,s.lastAcknowledgedBatchId]);return n.U("userMutationsIndex",o).next((c=>w.forEach(c,(u=>{q(u.userId===s.userId);const h=vn(this.serializer,u);return pm(e,s.userId,h).next((()=>{}))}))))}))))}ri(e){const t=e.store("targetDocuments"),n=e.store("remoteDocuments");return e.store("targetGlobal").get("targetGlobalKey").next((i=>{const s=[];return n.J(((o,c)=>{const u=new Y(o),h=(function(p){return[0,qe(p)]})(u);s.push(t.get(h).next((f=>f?w.resolve():(p=>t.put({targetId:0,path:qe(p),sequenceNumber:i.highestListenSequenceNumber}))(u))))})).next((()=>w.waitFor(s)))}))}ii(e,t){e.createObjectStore("collectionParents",{keyPath:Jv});const n=t.store("collectionParents"),i=new Zc,s=o=>{if(i.add(o)){const c=o.lastSegment(),u=o.popLast();return n.put({collectionId:c,parent:qe(u)})}};return t.store("remoteDocuments").J({H:!0},((o,c)=>{const u=new Y(o);return s(u.popLast())})).next((()=>t.store("documentMutations").J({H:!0},(([o,c,u],h)=>{const f=ot(c);return s(f.popLast())}))))}si(e){const t=e.store("targets");return t.J(((n,i)=>{const s=Ti(i),o=hm(this.serializer,s);return t.put(o)}))}oi(e,t){const n=t.store("remoteDocuments"),i=[];return n.J(((s,o)=>{const c=t.store("remoteDocumentsV14"),u=(function(p){return p.document?new M(Y.fromString(p.document.name).popFirst(5)):p.noDocument?M.fromSegments(p.noDocument.path):p.unknownDocument?M.fromSegments(p.unknownDocument.path):F()})(o).path.toArray(),h={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};i.push(c.put(h))})).next((()=>w.waitFor(i)))}_i(e,t){const n=t.store("mutations"),i=Em(this.serializer),s=new tu(qo.Yr,this.serializer.ct);return n.U().next((o=>{const c=new Map;return o.forEach((u=>{var h;let f=(h=c.get(u.userId))!==null&&h!==void 0?h:W();vn(this.serializer,u).keys().forEach((p=>f=f.add(p))),c.set(u.userId,f)})),w.forEach(c,((u,h)=>{const f=new Ce(h),p=Uo.lt(this.serializer,f),_=s.getIndexManager(f),R=Bo.lt(f,this.serializer,_,s.referenceDelegate);return new Tm(i,R,p,_).recalculateAndSaveOverlaysForDocumentKeys(new Wa(t,Ke.oe),u).next()}))}))}}function ed(r){r.createObjectStore("targetDocuments",{keyPath:Hv}).createIndex("documentTargetsIndex",Qv,{unique:!0}),r.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",Wv,{unique:!0}),r.createObjectStore("targetGlobal")}const Oa="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class nu{constructor(e,t,n,i,s,o,c,u,h,f,p=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.ai=s,this.window=o,this.document=c,this.ui=h,this.ci=f,this.li=p,this.qr=null,this.Qr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.hi=null,this.inForeground=!1,this.Pi=null,this.Ii=null,this.Ti=Number.NEGATIVE_INFINITY,this.Ei=_=>Promise.resolve(),!nu.D())throw new k(S.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new oA(this,i),this.di=t+"main",this.serializer=new lm(u),this.Ai=new ct(this.di,this.li,new yA(this.serializer)),this.Kr=new Qw,this.$r=new rA(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Em(this.serializer),this.Wr=new Hw,this.window&&this.window.localStorage?this.Ri=this.window.localStorage:(this.Ri=null,f===!1&&Te("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Vi().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new k(S.FAILED_PRECONDITION,Oa);return this.mi(),this.fi(),this.gi(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.$r.getHighestSequenceNumber(e)))})).then((e=>{this.qr=new Ke(e,this.ui)})).then((()=>{this.Qr=!0})).catch((e=>(this.Ai&&this.Ai.close(),Promise.reject(e))))}pi(e){return this.Ei=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ai.L((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.ai.enqueueAndForget((async()=>{this.started&&await this.Vi()})))}Vi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Ls(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.yi(e).next((t=>{t||(this.isPrimary=!1,this.ai.enqueueRetryable((()=>this.Ei(!1))))}))})).next((()=>this.wi(e))).next((t=>this.isPrimary&&!t?this.Si(e).next((()=>!1)):!!t&&this.bi(e).next((()=>!0)))))).catch((e=>{if(cn(e))return N("IndexedDbPersistence","Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return N("IndexedDbPersistence","Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.ai.enqueueRetryable((()=>this.Ei(e))),this.isPrimary=e}))}yi(e){return pi(e).get("owner").next((t=>w.resolve(this.Di(t))))}Ci(e){return Ls(e).delete(this.clientId)}async vi(){if(this.isPrimary&&!this.Fi(this.Ti,18e5)){this.Ti=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const n=Se(t,"clientMetadata");return n.U().next((i=>{const s=this.Mi(i,18e5),o=i.filter((c=>s.indexOf(c)===-1));return w.forEach(o,(c=>n.delete(c.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.Ri)for(const t of e)this.Ri.removeItem(this.xi(t.clientId))}}gi(){this.Ii=this.ai.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.Vi().then((()=>this.vi())).then((()=>this.gi()))))}Di(e){return!!e&&e.ownerId===this.clientId}wi(e){return this.ci?w.resolve(!0):pi(e).get("owner").next((t=>{if(t!==null&&this.Fi(t.leaseTimestampMs,5e3)&&!this.Oi(t.ownerId)){if(this.Di(t)&&this.networkEnabled)return!0;if(!this.Di(t)){if(!t.allowTabSynchronization)throw new k(S.FAILED_PRECONDITION,Oa);return!1}}return!(!this.networkEnabled||!this.inForeground)||Ls(e).U().next((n=>this.Mi(n,5e3).find((i=>{if(this.clientId!==i.clientId){const s=!this.networkEnabled&&i.networkEnabled,o=!this.inForeground&&i.inForeground,c=this.networkEnabled===i.networkEnabled;if(s||o&&c)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&N("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.Qr=!1,this.Ni(),this.Ii&&(this.Ii.cancel(),this.Ii=null),this.Li(),this.Bi(),await this.Ai.runTransaction("shutdown","readwrite",["owner","clientMetadata"],(e=>{const t=new Wa(e,Ke.oe);return this.Si(t).next((()=>this.Ci(t)))})),this.Ai.close(),this.ki()}Mi(e,t){return e.filter((n=>this.Fi(n.updateTimeMs,t)&&!this.Oi(n.clientId)))}qi(){return this.runTransaction("getActiveClients","readonly",(e=>Ls(e).U().next((t=>this.Mi(t,18e5).map((n=>n.clientId))))))}get started(){return this.Qr}getGlobalsCache(){return this.Kr}getMutationQueue(e,t){return Bo.lt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.$r}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new nA(e,this.serializer.ct.databaseId)}getDocumentOverlayCache(e){return Uo.lt(this.serializer,e)}getBundleCache(){return this.Wr}runTransaction(e,t,n){N("IndexedDbPersistence","Starting transaction:",e);const i=t==="readonly"?"readonly":"readwrite",s=(function(u){return u===17?ow:u===16?sw:u===15?qc:u===14?mp:u===13?pp:u===12?iw:u===11?fp:void F()})(this.li);let o;return this.Ai.runTransaction(e,i,s,(c=>(o=new Wa(c,this.qr?this.qr.next():Ke.oe),t==="readwrite-primary"?this.yi(o).next((u=>!!u||this.wi(o))).next((u=>{if(!u)throw Te(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.ai.enqueueRetryable((()=>this.Ei(!1))),new k(S.FAILED_PRECONDITION,cp);return n(o)})).next((u=>this.bi(o).next((()=>u)))):this.Qi(o).next((()=>n(o)))))).then((c=>(o.raiseOnCommittedEvent(),c)))}Qi(e){return pi(e).get("owner").next((t=>{if(t!==null&&this.Fi(t.leaseTimestampMs,5e3)&&!this.Oi(t.ownerId)&&!this.Di(t)&&!(this.ci||this.allowTabSynchronization&&t.allowTabSynchronization))throw new k(S.FAILED_PRECONDITION,Oa)}))}bi(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return pi(e).put("owner",t)}static D(){return ct.D()}Si(e){const t=pi(e);return t.get("owner").next((n=>this.Di(n)?(N("IndexedDbPersistence","Releasing primary lease."),t.delete("owner")):w.resolve()))}Fi(e,t){const n=Date.now();return!(e<n-t)&&(!(e>n)||(Te(`Detected an update time that is in the future: ${e} > ${n}`),!1))}mi(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.Pi=()=>{this.ai.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.Vi())))},this.document.addEventListener("visibilitychange",this.Pi),this.inForeground=this.document.visibilityState==="visible")}Li(){this.Pi&&(this.document.removeEventListener("visibilitychange",this.Pi),this.Pi=null)}fi(){var e;typeof((e=this.window)===null||e===void 0?void 0:e.addEventListener)=="function"&&(this.hi=()=>{this.Ni();const t=/(?:Version|Mobile)\/1[456]/;kd()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.ai.enterRestrictedMode(!0),this.ai.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.hi))}Bi(){this.hi&&(this.window.removeEventListener("pagehide",this.hi),this.hi=null)}Oi(e){var t;try{const n=((t=this.Ri)===null||t===void 0?void 0:t.getItem(this.xi(e)))!==null;return N("IndexedDbPersistence",`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return Te("IndexedDbPersistence","Failed to get zombied client id.",n),!1}}Ni(){if(this.Ri)try{this.Ri.setItem(this.xi(this.clientId),String(Date.now()))}catch(e){Te("Failed to set zombie client id.",e)}}ki(){if(this.Ri)try{this.Ri.removeItem(this.xi(this.clientId))}catch{}}xi(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function pi(r){return Se(r,"owner")}function Ls(r){return Se(r,"clientMetadata")}function ru(r,e){let t=r.projectId;return r.isDefaultDatabase||(t+="."+r.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iu{constructor(e,t,n,i){this.targetId=e,this.fromCache=t,this.Ki=n,this.$i=i}static Ui(e,t){let n=W(),i=W();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new iu(e,t.fromCache,n,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IA{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vm{constructor(){this.Wi=!1,this.Gi=!1,this.zi=100,this.ji=(function(){return kd()?8:lp(Re())>0?6:4})()}initialize(e,t){this.Hi=e,this.indexManager=t,this.Wi=!0}getDocumentsMatchingQuery(e,t,n,i){const s={result:null};return this.Ji(e,t).next((o=>{s.result=o})).next((()=>{if(!s.result)return this.Yi(e,t,i,n).next((o=>{s.result=o}))})).next((()=>{if(s.result)return;const o=new IA;return this.Zi(e,t,o).next((c=>{if(s.result=c,this.Gi)return this.Xi(e,t,o,c.size)}))})).next((()=>s.result))}Xi(e,t,n,i){return n.documentReadCount<this.zi?(Zn()<=J.DEBUG&&N("QueryEngine","SDK will not create cache indexes for query:",er(t),"since it only creates cache indexes for collection contains","more than or equal to",this.zi,"documents"),w.resolve()):(Zn()<=J.DEBUG&&N("QueryEngine","Query:",er(t),"scans",n.documentReadCount,"local documents and returns",i,"documents as results."),n.documentReadCount>this.ji*i?(Zn()<=J.DEBUG&&N("QueryEngine","The SDK decides to create cache indexes for query:",er(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,ze(t))):w.resolve())}Ji(e,t){if(bh(t))return w.resolve(null);let n=ze(t);return this.indexManager.getIndexType(e,n).next((i=>i===0?null:(t.limit!==null&&i===1&&(t=ao(t,null,"F"),n=ze(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((s=>{const o=W(...s);return this.Hi.getDocuments(e,o).next((c=>this.indexManager.getMinOffset(e,n).next((u=>{const h=this.es(t,c);return this.ts(t,h,o,u.readTime)?this.Ji(e,ao(t,null,"F")):this.ns(e,h,t,u)}))))})))))}Yi(e,t,n,i){return bh(t)||i.isEqual(G.min())?w.resolve(null):this.Hi.getDocuments(e,n).next((s=>{const o=this.es(t,s);return this.ts(t,o,n,i)?w.resolve(null):(Zn()<=J.DEBUG&&N("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),er(t)),this.ns(e,o,t,op(i,-1)).next((c=>c)))}))}es(e,t){let n=new ie(Vp(e));return t.forEach(((i,s)=>{ts(e,s)&&(n=n.add(s))})),n}ts(e,t,n,i){if(e.limit===null)return!1;if(n.size!==t.size)return!0;const s=e.limitType==="F"?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}Zi(e,t,n){return Zn()<=J.DEBUG&&N("QueryEngine","Using full collection scan to execute query:",er(t)),this.Hi.getDocumentsMatchingQuery(e,t,Xe.min(),n)}ns(e,t,n,i){return this.Hi.getDocumentsMatchingQuery(e,n,i).next((s=>(t.forEach((o=>{s=s.insert(o.key,o)})),s)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class EA{constructor(e,t,n,i){this.persistence=e,this.rs=t,this.serializer=i,this.ss=new oe($),this.os=new kt((s=>kn(s)),Zi),this._s=new Map,this.us=e.getRemoteDocumentCache(),this.$r=e.getTargetCache(),this.Wr=e.getBundleCache(),this.cs(n)}cs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Tm(this.us,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.us.setIndexManager(this.indexManager),this.rs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.ss)))}}function wm(r,e,t,n){return new EA(r,e,t,n)}async function Am(r,e){const t=x(r);return await t.persistence.runTransaction("Handle user change","readonly",(n=>{let i;return t.mutationQueue.getAllMutationBatches(n).next((s=>(i=s,t.cs(e),t.mutationQueue.getAllMutationBatches(n)))).next((s=>{const o=[],c=[];let u=W();for(const h of i){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of s){c.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return t.localDocuments.getDocuments(n,u).next((h=>({ls:h,removedBatchIds:o,addedBatchIds:c})))}))}))}function TA(r,e){const t=x(r);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(n=>{const i=e.batch.keys(),s=t.us.newChangeBuffer({trackRemovals:!0});return(function(c,u,h,f){const p=h.batch,_=p.keys();let R=w.resolve();return _.forEach((D=>{R=R.next((()=>f.getEntry(u,D))).next((V=>{const C=h.docVersions.get(D);q(C!==null),V.version.compareTo(C)<0&&(p.applyToRemoteDocument(V,h),V.isValidDocument()&&(V.setReadTime(h.commitVersion),f.addEntry(V)))}))})),R.next((()=>c.mutationQueue.removeMutationBatch(u,p)))})(t,n,e,s).next((()=>s.apply(n))).next((()=>t.mutationQueue.performConsistencyCheck(n))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(n,i,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(n,(function(c){let u=W();for(let h=0;h<c.mutationResults.length;++h)c.mutationResults[h].transformResults.length>0&&(u=u.add(c.batch.mutations[h].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(n,i)))}))}function Rm(r){const e=x(r);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.$r.getLastRemoteSnapshotVersion(t)))}function vA(r,e){const t=x(r),n=e.snapshotVersion;let i=t.ss;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(s=>{const o=t.us.newChangeBuffer({trackRemovals:!0});i=t.ss;const c=[];e.targetChanges.forEach(((f,p)=>{const _=i.get(p);if(!_)return;c.push(t.$r.removeMatchingKeys(s,f.removedDocuments,p).next((()=>t.$r.addMatchingKeys(s,f.addedDocuments,p))));let R=_.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(p)!==null?R=R.withResumeToken(me.EMPTY_BYTE_STRING,G.min()).withLastLimboFreeSnapshotVersion(G.min()):f.resumeToken.approximateByteSize()>0&&(R=R.withResumeToken(f.resumeToken,n)),i=i.insert(p,R),(function(V,C,z){return V.resumeToken.approximateByteSize()===0||C.snapshotVersion.toMicroseconds()-V.snapshotVersion.toMicroseconds()>=3e8?!0:z.addedDocuments.size+z.modifiedDocuments.size+z.removedDocuments.size>0})(_,R,f)&&c.push(t.$r.updateTargetData(s,R))}));let u=He(),h=W();if(e.documentUpdates.forEach((f=>{e.resolvedLimboDocuments.has(f)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(s,f))})),c.push(bm(s,o,e.documentUpdates).next((f=>{u=f.hs,h=f.Ps}))),!n.isEqual(G.min())){const f=t.$r.getLastRemoteSnapshotVersion(s).next((p=>t.$r.setTargetsMetadata(s,s.currentSequenceNumber,n)));c.push(f)}return w.waitFor(c).next((()=>o.apply(s))).next((()=>t.localDocuments.getLocalViewOfDocuments(s,u,h))).next((()=>u))})).then((s=>(t.ss=i,s)))}function bm(r,e,t){let n=W(),i=W();return t.forEach((s=>n=n.add(s))),e.getEntries(r,n).next((s=>{let o=He();return t.forEach(((c,u)=>{const h=s.get(c);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(c)),u.isNoDocument()&&u.version.isEqual(G.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):N("LocalStore","Ignoring outdated watch update for ",c,". Current version:",h.version," Watch version:",u.version)})),{hs:o,Ps:i}}))}function wA(r,e){const t=x(r);return t.persistence.runTransaction("Get next mutation batch","readonly",(n=>(e===void 0&&(e=-1),t.mutationQueue.getNextMutationBatchAfterBatchId(n,e))))}function Er(r,e){const t=x(r);return t.persistence.runTransaction("Allocate target","readwrite",(n=>{let i;return t.$r.getTargetData(n,e).next((s=>s?(i=s,w.resolve(i)):t.$r.allocateTargetId(n).next((o=>(i=new vt(e,o,"TargetPurposeListen",n.currentSequenceNumber),t.$r.addTargetData(n,i).next((()=>i)))))))})).then((n=>{const i=t.ss.get(n.targetId);return(i===null||n.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(t.ss=t.ss.insert(n.targetId,n),t.os.set(e,n.targetId)),n}))}async function Tr(r,e,t){const n=x(r),i=n.ss.get(e),s=t?"readwrite":"readwrite-primary";try{t||await n.persistence.runTransaction("Release target",s,(o=>n.persistence.referenceDelegate.removeTarget(o,i)))}catch(o){if(!cn(o))throw o;N("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}n.ss=n.ss.remove(e),n.os.delete(i.target)}function po(r,e,t){const n=x(r);let i=G.min(),s=W();return n.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,h,f){const p=x(u),_=p.os.get(f);return _!==void 0?w.resolve(p.ss.get(_)):p.$r.getTargetData(h,f)})(n,o,ze(e)).next((c=>{if(c)return i=c.lastLimboFreeSnapshotVersion,n.$r.getMatchingKeysForTargetId(o,c.targetId).next((u=>{s=u}))})).next((()=>n.rs.getDocumentsMatchingQuery(o,e,t?i:G.min(),t?s:W()))).next((c=>(Cm(n,Np(e),c),{documents:c,Is:s})))))}function Sm(r,e){const t=x(r),n=x(t.$r),i=t.ss.get(e);return i?Promise.resolve(i.target):t.persistence.runTransaction("Get target data","readonly",(s=>n.ot(s,e).next((o=>o?o.target:null))))}function Pm(r,e){const t=x(r),n=t._s.get(e)||G.min();return t.persistence.runTransaction("Get new document changes","readonly",(i=>t.us.getAllFromCollectionGroup(i,e,op(n,-1),Number.MAX_SAFE_INTEGER))).then((i=>(Cm(t,e,i),i)))}function Cm(r,e,t){let n=r._s.get(e)||G.min();t.forEach(((i,s)=>{s.readTime.compareTo(n)>0&&(n=s.readTime)})),r._s.set(e,n)}async function AA(r,e,t,n){const i=x(r);let s=W(),o=He();for(const h of t){const f=e.Ts(h.metadata.name);h.document&&(s=s.add(f));const p=e.Es(h);p.setReadTime(e.ds(h.metadata.readTime)),o=o.insert(f,p)}const c=i.us.newChangeBuffer({trackRemovals:!0}),u=await Er(i,(function(f){return ze(Or(Y.fromString(`__bundle__/docs/${f}`)))})(n));return i.persistence.runTransaction("Apply bundle documents","readwrite",(h=>bm(h,c,o).next((f=>(c.apply(h),f))).next((f=>i.$r.removeMatchingKeysForTargetId(h,u.targetId).next((()=>i.$r.addMatchingKeys(h,s,u.targetId))).next((()=>i.localDocuments.getLocalViewOfDocuments(h,f.hs,f.Ps))).next((()=>f.hs))))))}async function RA(r,e,t=W()){const n=await Er(r,ze(Yc(e.bundledQuery))),i=x(r);return i.persistence.runTransaction("Save named query","readwrite",(s=>{const o=ve(e.readTime);if(n.snapshotVersion.compareTo(o)>=0)return i.Wr.saveNamedQuery(s,e);const c=n.withResumeToken(me.EMPTY_BYTE_STRING,o);return i.ss=i.ss.insert(c.targetId,c),i.$r.updateTargetData(s,c).next((()=>i.$r.removeMatchingKeysForTargetId(s,n.targetId))).next((()=>i.$r.addMatchingKeys(s,t,n.targetId))).next((()=>i.Wr.saveNamedQuery(s,e)))}))}function td(r,e){return`firestore_clients_${r}_${e}`}function nd(r,e,t){let n=`firestore_mutations_${r}_${t}`;return e.isAuthenticated()&&(n+=`_${e.uid}`),n}function xa(r,e){return`firestore_targets_${r}_${e}`}class mo{constructor(e,t,n,i){this.user=e,this.batchId=t,this.state=n,this.error=i}static As(e,t,n){const i=JSON.parse(n);let s,o=typeof i=="object"&&["pending","acknowledged","rejected"].indexOf(i.state)!==-1&&(i.error===void 0||typeof i.error=="object");return o&&i.error&&(o=typeof i.error.message=="string"&&typeof i.error.code=="string",o&&(s=new k(i.error.code,i.error.message))),o?new mo(e,t,i.state,s):(Te("SharedClientState",`Failed to parse mutation state for ID '${t}': ${n}`),null)}Rs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Pi{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static As(e,t){const n=JSON.parse(t);let i,s=typeof n=="object"&&["not-current","current","rejected"].indexOf(n.state)!==-1&&(n.error===void 0||typeof n.error=="object");return s&&n.error&&(s=typeof n.error.message=="string"&&typeof n.error.code=="string",s&&(i=new k(n.error.code,n.error.message))),s?new Pi(e,n.state,i):(Te("SharedClientState",`Failed to parse target state for ID '${e}': ${t}`),null)}Rs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class go{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static As(e,t){const n=JSON.parse(t);let i=typeof n=="object"&&n.activeTargetIds instanceof Array,s=jc();for(let o=0;i&&o<n.activeTargetIds.length;++o)i=hp(n.activeTargetIds[o]),s=s.add(n.activeTargetIds[o]);return i?new go(e,s):(Te("SharedClientState",`Failed to parse client data for instance '${e}': ${t}`),null)}}class su{constructor(e,t){this.clientId=e,this.onlineState=t}static As(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new su(t.clientId,t.onlineState):(Te("SharedClientState",`Failed to parse online state: ${e}`),null)}}class ac{constructor(){this.activeTargetIds=jc()}Vs(e){this.activeTargetIds=this.activeTargetIds.add(e)}fs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Rs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class La{constructor(e,t,n,i,s){this.window=e,this.ai=t,this.persistenceKey=n,this.gs=i,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ps=this.ys.bind(this),this.ws=new oe($),this.started=!1,this.Ss=[];const o=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.bs=td(this.persistenceKey,this.gs),this.Ds=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.ws=this.ws.insert(this.gs,new ac),this.Cs=new RegExp(`^firestore_clients_${o}_([^_]*)$`),this.vs=new RegExp(`^firestore_mutations_${o}_(\\d+)(?:_(.*))?$`),this.Fs=new RegExp(`^firestore_targets_${o}_(\\d+)$`),this.Ms=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.xs=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.ps)}static D(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.qi();for(const n of e){if(n===this.gs)continue;const i=this.getItem(td(this.persistenceKey,n));if(i){const s=go.As(n,i);s&&(this.ws=this.ws.insert(s.clientId,s))}}this.Os();const t=this.storage.getItem(this.Ms);if(t){const n=this.Ns(t);n&&this.Ls(n)}for(const n of this.Ss)this.ys(n);this.Ss=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Ds,JSON.stringify(e))}getAllActiveQueryTargets(){return this.Bs(this.ws)}isActiveQueryTarget(e){let t=!1;return this.ws.forEach(((n,i)=>{i.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.ks(e,"pending")}updateMutationState(e,t,n){this.ks(e,t,n),this.qs(e)}addLocalQueryTarget(e){let t="not-current";if(this.isActiveQueryTarget(e)){const n=this.storage.getItem(xa(this.persistenceKey,e));if(n){const i=Pi.As(e,n);i&&(t=i.state)}}return this.Qs.Vs(e),this.Os(),t}removeLocalQueryTarget(e){this.Qs.fs(e),this.Os()}isLocalQueryTarget(e){return this.Qs.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(xa(this.persistenceKey,e))}updateQueryState(e,t,n){this.Ks(e,t,n)}handleUserChange(e,t,n){t.forEach((i=>{this.qs(i)})),this.currentUser=e,n.forEach((i=>{this.addPendingMutation(i)}))}setOnlineState(e){this.$s(e)}notifyBundleLoaded(e){this.Us(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ps),this.removeItem(this.bs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return N("SharedClientState","READ",e,t),t}setItem(e,t){N("SharedClientState","SET",e,t),this.storage.setItem(e,t)}removeItem(e){N("SharedClientState","REMOVE",e),this.storage.removeItem(e)}ys(e){const t=e;if(t.storageArea===this.storage){if(N("SharedClientState","EVENT",t.key,t.newValue),t.key===this.bs)return void Te("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.ai.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.Cs.test(t.key)){if(t.newValue==null){const n=this.Ws(t.key);return this.Gs(n,null)}{const n=this.zs(t.key,t.newValue);if(n)return this.Gs(n.clientId,n)}}else if(this.vs.test(t.key)){if(t.newValue!==null){const n=this.js(t.key,t.newValue);if(n)return this.Hs(n)}}else if(this.Fs.test(t.key)){if(t.newValue!==null){const n=this.Js(t.key,t.newValue);if(n)return this.Ys(n)}}else if(t.key===this.Ms){if(t.newValue!==null){const n=this.Ns(t.newValue);if(n)return this.Ls(n)}}else if(t.key===this.Ds){const n=(function(s){let o=Ke.oe;if(s!=null)try{const c=JSON.parse(s);q(typeof c=="number"),o=c}catch(c){Te("SharedClientState","Failed to read sequence number from WebStorage",c)}return o})(t.newValue);n!==Ke.oe&&this.sequenceNumberHandler(n)}else if(t.key===this.xs){const n=this.Zs(t.newValue);await Promise.all(n.map((i=>this.syncEngine.Xs(i))))}}}else this.Ss.push(t)}))}}get Qs(){return this.ws.get(this.gs)}Os(){this.setItem(this.bs,this.Qs.Rs())}ks(e,t,n){const i=new mo(this.currentUser,e,t,n),s=nd(this.persistenceKey,this.currentUser,e);this.setItem(s,i.Rs())}qs(e){const t=nd(this.persistenceKey,this.currentUser,e);this.removeItem(t)}$s(e){const t={clientId:this.gs,onlineState:e};this.storage.setItem(this.Ms,JSON.stringify(t))}Ks(e,t,n){const i=xa(this.persistenceKey,e),s=new Pi(e,t,n);this.setItem(i,s.Rs())}Us(e){const t=JSON.stringify(Array.from(e));this.setItem(this.xs,t)}Ws(e){const t=this.Cs.exec(e);return t?t[1]:null}zs(e,t){const n=this.Ws(e);return go.As(n,t)}js(e,t){const n=this.vs.exec(e),i=Number(n[1]),s=n[2]!==void 0?n[2]:null;return mo.As(new Ce(s),i,t)}Js(e,t){const n=this.Fs.exec(e),i=Number(n[1]);return Pi.As(i,t)}Ns(e){return su.As(e)}Zs(e){return JSON.parse(e)}async Hs(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.eo(e.batchId,e.state,e.error);N("SharedClientState",`Ignoring mutation for non-active user ${e.user.uid}`)}Ys(e){return this.syncEngine.no(e.targetId,e.state,e.error)}Gs(e,t){const n=t?this.ws.insert(e,t):this.ws.remove(e),i=this.Bs(this.ws),s=this.Bs(n),o=[],c=[];return s.forEach((u=>{i.has(u)||o.push(u)})),i.forEach((u=>{s.has(u)||c.push(u)})),this.syncEngine.ro(o,c).then((()=>{this.ws=n}))}Ls(e){this.ws.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}Bs(e){let t=jc();return e.forEach(((n,i)=>{t=t.unionWith(i.activeTargetIds)})),t}}class Dm{constructor(){this.io=new ac,this.so={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e){return this.io.Vs(e),this.so[e]||"not-current"}updateQueryState(e,t,n){this.so[e]=t}removeLocalQueryTarget(e){this.io.fs(e)}isLocalQueryTarget(e){return this.io.activeTargetIds.has(e)}clearQueryState(e){delete this.so[e]}getAllActiveQueryTargets(){return this.io.activeTargetIds}isActiveQueryTarget(e){return this.io.activeTargetIds.has(e)}start(){return this.io=new ac,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bA{oo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rd{constructor(){this._o=()=>this.ao(),this.uo=()=>this.co(),this.lo=[],this.ho()}oo(e){this.lo.push(e)}shutdown(){window.removeEventListener("online",this._o),window.removeEventListener("offline",this.uo)}ho(){window.addEventListener("online",this._o),window.addEventListener("offline",this.uo)}ao(){N("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const e of this.lo)e(0)}co(){N("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const e of this.lo)e(1)}static D(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Ms=null;function Ma(){return Ms===null?Ms=(function(){return 268435456+Math.round(2147483648*Math.random())})():Ms++,"0x"+Ms.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PA{constructor(e){this.Po=e.Po,this.Io=e.Io}To(e){this.Eo=e}Ao(e){this.Ro=e}Vo(e){this.mo=e}onMessage(e){this.fo=e}close(){this.Io()}send(e){this.Po(e)}po(){this.Eo()}yo(){this.Ro()}wo(e){this.mo(e)}So(e){this.fo(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ue="WebChannelConnection";class CA extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const n=t.ssl?"https":"http",i=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.bo=n+"://"+t.host,this.Do=`projects/${i}/databases/${s}`,this.Co=this.databaseId.database==="(default)"?`project_id=${i}`:`project_id=${i}&database_id=${s}`}get vo(){return!1}Fo(t,n,i,s,o){const c=Ma(),u=this.Mo(t,n.toUriEncodedString());N("RestConnection",`Sending RPC '${t}' ${c}:`,u,i);const h={"google-cloud-resource-prefix":this.Do,"x-goog-request-params":this.Co};return this.xo(h,s,o),this.Oo(t,u,h,i).then((f=>(N("RestConnection",`Received RPC '${t}' ${c}: `,f),f)),(f=>{throw Je("RestConnection",`RPC '${t}' ${c} failed with error: `,f,"url: ",u,"request:",i),f}))}No(t,n,i,s,o,c){return this.Fo(t,n,i,s,o)}xo(t,n,i){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Vr})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach(((s,o)=>t[o]=s)),i&&i.headers.forEach(((s,o)=>t[o]=s))}Mo(t,n){const i=SA[t];return`${this.bo}/v1/${n}:${i}`}terminate(){}}{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Oo(e,t,n,i){const s=Ma();return new Promise(((o,c)=>{const u=new Jf;u.setWithCredentials(!0),u.listenOnce(Xf.COMPLETE,(()=>{try{switch(u.getLastErrorCode()){case Gs.NO_ERROR:const f=u.getResponseJson();N(Ue,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(f)),o(f);break;case Gs.TIMEOUT:N(Ue,`RPC '${e}' ${s} timed out`),c(new k(S.DEADLINE_EXCEEDED,"Request time out"));break;case Gs.HTTP_ERROR:const p=u.getStatus();if(N(Ue,`RPC '${e}' ${s} failed with status:`,p,"response text:",u.getResponseText()),p>0){let _=u.getResponseJson();Array.isArray(_)&&(_=_[0]);const R=_?.error;if(R&&R.status&&R.message){const D=(function(C){const z=C.toLowerCase().replace(/_/g,"-");return Object.values(S).indexOf(z)>=0?z:S.UNKNOWN})(R.status);c(new k(D,R.message))}else c(new k(S.UNKNOWN,"Server responded with status "+u.getStatus()))}else c(new k(S.UNAVAILABLE,"Connection failed."));break;default:F()}}finally{N(Ue,`RPC '${e}' ${s} completed.`)}}));const h=JSON.stringify(i);N(Ue,`RPC '${e}' ${s} sending request:`,i),u.send(t,"POST",h,n,15)}))}Lo(e,t,n){const i=Ma(),s=[this.bo,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=tp(),c=ep(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.xmlHttpFactory=new Yf({})),this.xo(u.initMessageHeaders,t,n),u.encodeInitMessageHeaders=!0;const f=s.join("");N(Ue,`Creating RPC '${e}' stream ${i}: ${f}`,u);const p=o.createWebChannel(f,u);let _=!1,R=!1;const D=new PA({Po:C=>{R?N(Ue,`Not sending because RPC '${e}' stream ${i} is closed:`,C):(_||(N(Ue,`Opening RPC '${e}' stream ${i} transport.`),p.open(),_=!0),N(Ue,`RPC '${e}' stream ${i} sending:`,C),p.send(C))},Io:()=>p.close()}),V=(C,z,j)=>{C.listen(z,(U=>{try{j(U)}catch(H){setTimeout((()=>{throw H}),0)}}))};return V(p,yi.EventType.OPEN,(()=>{R||(N(Ue,`RPC '${e}' stream ${i} transport opened.`),D.po())})),V(p,yi.EventType.CLOSE,(()=>{R||(R=!0,N(Ue,`RPC '${e}' stream ${i} transport closed`),D.wo())})),V(p,yi.EventType.ERROR,(C=>{R||(R=!0,Je(Ue,`RPC '${e}' stream ${i} transport errored:`,C),D.wo(new k(S.UNAVAILABLE,"The operation could not be completed")))})),V(p,yi.EventType.MESSAGE,(C=>{var z;if(!R){const j=C.data[0];q(!!j);const U=j,H=U.error||((z=U[0])===null||z===void 0?void 0:z.error);if(H){N(Ue,`RPC '${e}' stream ${i} received error:`,H);const ee=H.status;let K=(function(I){const T=we[I];if(T!==void 0)return Hp(T)})(ee),E=H.message;K===void 0&&(K=S.INTERNAL,E="Unknown error status: "+ee+" with message "+H.message),R=!0,D.wo(new k(K,E)),p.close()}else N(Ue,`RPC '${e}' stream ${i} received:`,j),D.So(j)}})),V(c,Zf.STAT_EVENT,(C=>{C.stat===$a.PROXY?N(Ue,`RPC '${e}' stream ${i} detected buffering proxy`):C.stat===$a.NOPROXY&&N(Ue,`RPC '${e}' stream ${i} detected no buffering proxy`)})),setTimeout((()=>{D.yo()}),0),D}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function km(){return typeof window<"u"?window:null}function Js(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ss(r){return new Mw(r,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ou{constructor(e,t,n=1e3,i=1.5,s=6e4){this.ai=e,this.timerId=t,this.Bo=n,this.ko=i,this.qo=s,this.Qo=0,this.Ko=null,this.$o=Date.now(),this.reset()}reset(){this.Qo=0}Uo(){this.Qo=this.qo}Wo(e){this.cancel();const t=Math.floor(this.Qo+this.Go()),n=Math.max(0,Date.now()-this.$o),i=Math.max(0,t-n);i>0&&N("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.Qo} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.Ko=this.ai.enqueueAfterDelay(this.timerId,i,(()=>(this.$o=Date.now(),e()))),this.Qo*=this.ko,this.Qo<this.Bo&&(this.Qo=this.Bo),this.Qo>this.qo&&(this.Qo=this.qo)}zo(){this.Ko!==null&&(this.Ko.skipDelay(),this.Ko=null)}cancel(){this.Ko!==null&&(this.Ko.cancel(),this.Ko=null)}Go(){return(Math.random()-.5)*this.Qo}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nm{constructor(e,t,n,i,s,o,c,u){this.ai=e,this.jo=n,this.Ho=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Jo=0,this.Yo=null,this.Zo=null,this.stream=null,this.Xo=0,this.e_=new ou(e,t)}t_(){return this.state===1||this.state===5||this.n_()}n_(){return this.state===2||this.state===3}start(){this.Xo=0,this.state!==4?this.auth():this.r_()}async stop(){this.t_()&&await this.close(0)}i_(){this.state=0,this.e_.reset()}s_(){this.n_()&&this.Yo===null&&(this.Yo=this.ai.enqueueAfterDelay(this.jo,6e4,(()=>this.o_())))}__(e){this.a_(),this.stream.send(e)}async o_(){if(this.n_())return this.close(0)}a_(){this.Yo&&(this.Yo.cancel(),this.Yo=null)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}async close(e,t){this.a_(),this.u_(),this.e_.cancel(),this.Jo++,e!==4?this.e_.reset():t&&t.code===S.RESOURCE_EXHAUSTED?(Te(t.toString()),Te("Using maximum backoff delay to prevent overloading the backend."),this.e_.Uo()):t&&t.code===S.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.c_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Vo(t)}c_(){}auth(){this.state=1;const e=this.l_(this.Jo),t=this.Jo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([n,i])=>{this.Jo===t&&this.h_(n,i)}),(n=>{e((()=>{const i=new k(S.UNKNOWN,"Fetching auth token failed: "+n.message);return this.P_(i)}))}))}h_(e,t){const n=this.l_(this.Jo);this.stream=this.I_(e,t),this.stream.To((()=>{n((()=>this.listener.To()))})),this.stream.Ao((()=>{n((()=>(this.state=2,this.Zo=this.ai.enqueueAfterDelay(this.Ho,1e4,(()=>(this.n_()&&(this.state=3),Promise.resolve()))),this.listener.Ao())))})),this.stream.Vo((i=>{n((()=>this.P_(i)))})),this.stream.onMessage((i=>{n((()=>++this.Xo==1?this.T_(i):this.onNext(i)))}))}r_(){this.state=5,this.e_.Wo((async()=>{this.state=0,this.start()}))}P_(e){return N("PersistentStream",`close with error: ${e}`),this.stream=null,this.close(4,e)}l_(e){return t=>{this.ai.enqueueAndForget((()=>this.Jo===e?t():(N("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class DA extends Nm{constructor(e,t,n,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}I_(e,t){return this.connection.Lo("Listen",e,t)}T_(e){return this.onNext(e)}onNext(e){this.e_.reset();const t=Bw(this.serializer,e),n=(function(s){if(!("targetChange"in s))return G.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?G.min():o.readTime?ve(o.readTime):G.min()})(e);return this.listener.E_(t,n)}d_(e){const t={};t.database=nc(this.serializer),t.addTarget=(function(s,o){let c;const u=o.target;if(c=so(u)?{documents:im(s,u)}:{query:Fo(s,u)._t},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Xp(s,o.resumeToken);const h=ec(s,o.expectedCount);h!==null&&(c.expectedCount=h)}else if(o.snapshotVersion.compareTo(G.min())>0){c.readTime=Ir(s,o.snapshotVersion.toTimestamp());const h=ec(s,o.expectedCount);h!==null&&(c.expectedCount=h)}return c})(this.serializer,e);const n=zw(this.serializer,e);n&&(t.labels=n),this.__(t)}A_(e){const t={};t.database=nc(this.serializer),t.removeTarget=e,this.__(t)}}class kA extends Nm{constructor(e,t,n,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,i,o),this.serializer=s}get R_(){return this.Xo>0}start(){this.lastStreamToken=void 0,super.start()}c_(){this.R_&&this.V_([])}I_(e,t){return this.connection.Lo("Write",e,t)}T_(e){return q(!!e.streamToken),this.lastStreamToken=e.streamToken,q(!e.writeResults||e.writeResults.length===0),this.listener.m_()}onNext(e){q(!!e.streamToken),this.lastStreamToken=e.streamToken,this.e_.reset();const t=qw(e.writeResults,e.commitTime),n=ve(e.commitTime);return this.listener.f_(n,t)}g_(){const e={};e.database=nc(this.serializer),this.__(e)}V_(e){const t={streamToken:this.lastStreamToken,writes:e.map((n=>ji(this.serializer,n)))};this.__(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class NA extends class{}{constructor(e,t,n,i){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=i,this.p_=!1}y_(){if(this.p_)throw new k(S.FAILED_PRECONDITION,"The client has already been terminated.")}Fo(e,t,n,i){return this.y_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,o])=>this.connection.Fo(e,tc(t,n),i,s,o))).catch((s=>{throw s.name==="FirebaseError"?(s.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new k(S.UNKNOWN,s.toString())}))}No(e,t,n,i,s){return this.y_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.No(e,tc(t,n),i,o,c,s))).catch((o=>{throw o.name==="FirebaseError"?(o.code===S.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new k(S.UNKNOWN,o.toString())}))}terminate(){this.p_=!0,this.connection.terminate()}}class VA{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.w_=0,this.S_=null,this.b_=!0}D_(){this.w_===0&&(this.C_("Unknown"),this.S_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.S_=null,this.v_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve()))))}F_(e){this.state==="Online"?this.C_("Unknown"):(this.w_++,this.w_>=1&&(this.M_(),this.v_(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.C_("Offline")))}set(e){this.M_(),this.w_=0,e==="Online"&&(this.b_=!1),this.C_(e)}C_(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}v_(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.b_?(Te(t),this.b_=!1):N("OnlineStateTracker",t)}M_(){this.S_!==null&&(this.S_.cancel(),this.S_=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class OA{constructor(e,t,n,i,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.x_=[],this.O_=new Map,this.N_=new Set,this.L_=[],this.B_=s,this.B_.oo((o=>{n.enqueueAndForget((async()=>{ln(this)&&(N("RemoteStore","Restarting streams for network reachability change."),await(async function(u){const h=x(u);h.N_.add(4),await Mr(h),h.k_.set("Unknown"),h.N_.delete(4),await os(h)})(this))}))})),this.k_=new VA(n,i)}}async function os(r){if(ln(r))for(const e of r.L_)await e(!0)}async function Mr(r){for(const e of r.L_)await e(!1)}function zo(r,e){const t=x(r);t.O_.has(e.targetId)||(t.O_.set(e.targetId,e),uu(t)?cu(t):Ur(t).n_()&&au(t,e))}function vr(r,e){const t=x(r),n=Ur(t);t.O_.delete(e),n.n_()&&Vm(t,e),t.O_.size===0&&(n.n_()?n.s_():ln(t)&&t.k_.set("Unknown"))}function au(r,e){if(r.q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(G.min())>0){const t=r.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(t)}Ur(r).d_(e)}function Vm(r,e){r.q_.xe(e),Ur(r).A_(e)}function cu(r){r.q_=new Vw({getRemoteKeysForTarget:e=>r.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>r.O_.get(e)||null,tt:()=>r.datastore.serializer.databaseId}),Ur(r).start(),r.k_.D_()}function uu(r){return ln(r)&&!Ur(r).t_()&&r.O_.size>0}function ln(r){return x(r).N_.size===0}function Om(r){r.q_=void 0}async function xA(r){r.k_.set("Online")}async function LA(r){r.O_.forEach(((e,t)=>{au(r,e)}))}async function MA(r,e){Om(r),uu(r)?(r.k_.F_(e),cu(r)):r.k_.set("Unknown")}async function FA(r,e,t){if(r.k_.set("Online"),e instanceof Yp&&e.state===2&&e.cause)try{await(async function(i,s){const o=s.cause;for(const c of s.targetIds)i.O_.has(c)&&(await i.remoteSyncer.rejectListen(c,o),i.O_.delete(c),i.q_.removeTarget(c))})(r,e)}catch(n){N("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),n),await _o(r,n)}else if(e instanceof Qs?r.q_.Ke(e):e instanceof Jp?r.q_.He(e):r.q_.We(e),!t.isEqual(G.min()))try{const n=await Rm(r.localStore);t.compareTo(n)>=0&&await(function(s,o){const c=s.q_.rt(o);return c.targetChanges.forEach(((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=s.O_.get(h);f&&s.O_.set(h,f.withResumeToken(u.resumeToken,o))}})),c.targetMismatches.forEach(((u,h)=>{const f=s.O_.get(u);if(!f)return;s.O_.set(u,f.withResumeToken(me.EMPTY_BYTE_STRING,f.snapshotVersion)),Vm(s,u);const p=new vt(f.target,u,h,f.sequenceNumber);au(s,p)})),s.remoteSyncer.applyRemoteEvent(c)})(r,t)}catch(n){N("RemoteStore","Failed to raise snapshot:",n),await _o(r,n)}}async function _o(r,e,t){if(!cn(e))throw e;r.N_.add(1),await Mr(r),r.k_.set("Offline"),t||(t=()=>Rm(r.localStore)),r.asyncQueue.enqueueRetryable((async()=>{N("RemoteStore","Retrying IndexedDB access"),await t(),r.N_.delete(1),await os(r)}))}function xm(r,e){return e().catch((t=>_o(r,t,e)))}async function Fr(r){const e=x(r),t=rn(e);let n=e.x_.length>0?e.x_[e.x_.length-1].batchId:-1;for(;UA(e);)try{const i=await wA(e.localStore,n);if(i===null){e.x_.length===0&&t.s_();break}n=i.batchId,BA(e,i)}catch(i){await _o(e,i)}Lm(e)&&Mm(e)}function UA(r){return ln(r)&&r.x_.length<10}function BA(r,e){r.x_.push(e);const t=rn(r);t.n_()&&t.R_&&t.V_(e.mutations)}function Lm(r){return ln(r)&&!rn(r).t_()&&r.x_.length>0}function Mm(r){rn(r).start()}async function qA(r){rn(r).g_()}async function zA(r){const e=rn(r);for(const t of r.x_)e.V_(t.mutations)}async function GA(r,e,t){const n=r.x_.shift(),i=Wc.from(n,e,t);await xm(r,(()=>r.remoteSyncer.applySuccessfulWrite(i))),await Fr(r)}async function jA(r,e){e&&rn(r).R_&&await(async function(n,i){if((function(o){return Wp(o)&&o!==S.ABORTED})(i.code)){const s=n.x_.shift();rn(n).i_(),await xm(n,(()=>n.remoteSyncer.rejectFailedWrite(s.batchId,i))),await Fr(n)}})(r,e),Lm(r)&&Mm(r)}async function id(r,e){const t=x(r);t.asyncQueue.verifyOperationInProgress(),N("RemoteStore","RemoteStore received new credentials");const n=ln(t);t.N_.add(3),await Mr(t),n&&t.k_.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.N_.delete(3),await os(t)}async function cc(r,e){const t=x(r);e?(t.N_.delete(2),await os(t)):e||(t.N_.add(2),await Mr(t),t.k_.set("Unknown"))}function Ur(r){return r.Q_||(r.Q_=(function(t,n,i){const s=x(t);return s.y_(),new DA(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(r.datastore,r.asyncQueue,{To:xA.bind(null,r),Ao:LA.bind(null,r),Vo:MA.bind(null,r),E_:FA.bind(null,r)}),r.L_.push((async e=>{e?(r.Q_.i_(),uu(r)?cu(r):r.k_.set("Unknown")):(await r.Q_.stop(),Om(r))}))),r.Q_}function rn(r){return r.K_||(r.K_=(function(t,n,i){const s=x(t);return s.y_(),new kA(n,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)})(r.datastore,r.asyncQueue,{To:()=>Promise.resolve(),Ao:qA.bind(null,r),Vo:jA.bind(null,r),m_:zA.bind(null,r),f_:GA.bind(null,r)}),r.L_.push((async e=>{e?(r.K_.i_(),await Fr(r)):(await r.K_.stop(),r.x_.length>0&&(N("RemoteStore",`Stopping write stream with ${r.x_.length} pending writes`),r.x_=[]))}))),r.K_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lu{constructor(e,t,n,i,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=i,this.removalCallback=s,this.deferred=new be,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,i,s){const o=Date.now()+n,c=new lu(e,t,o,i,s);return c.start(n),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new k(S.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Br(r,e){if(Te("AsyncQueue",`${e}: ${r}`),cn(r))return new k(S.UNAVAILABLE,`${e}: ${r}`);throw r}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(e){this.comparator=e?(t,n)=>e(t,n)||M.comparator(t.key,n.key):(t,n)=>M.comparator(t.key,n.key),this.keyedMap=Ii(),this.sortedSet=new oe(this.comparator)}static emptySet(e){return new ar(e.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ar)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const i=t.getNext().key,s=n.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,t){const n=new ar;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sd{constructor(){this.U_=new oe(M.comparator)}track(e){const t=e.doc.key,n=this.U_.get(t);n?e.type!==0&&n.type===3?this.U_=this.U_.insert(t,e):e.type===3&&n.type!==1?this.U_=this.U_.insert(t,{type:n.type,doc:e.doc}):e.type===2&&n.type===2?this.U_=this.U_.insert(t,{type:2,doc:e.doc}):e.type===2&&n.type===0?this.U_=this.U_.insert(t,{type:0,doc:e.doc}):e.type===1&&n.type===0?this.U_=this.U_.remove(t):e.type===1&&n.type===2?this.U_=this.U_.insert(t,{type:1,doc:n.doc}):e.type===0&&n.type===1?this.U_=this.U_.insert(t,{type:2,doc:e.doc}):F():this.U_=this.U_.insert(t,e)}W_(){const e=[];return this.U_.inorderTraversal(((t,n)=>{e.push(n)})),e}}class wr{constructor(e,t,n,i,s,o,c,u,h){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,t,n,i,s){const o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new wr(e,t,ar.emptySet(t),o,n,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&es(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let i=0;i<t.length;i++)if(t[i].type!==n[i].type||!t[i].doc.isEqual(n[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $A{constructor(){this.G_=void 0,this.z_=[]}j_(){return this.z_.some((e=>e.H_()))}}class KA{constructor(){this.queries=od(),this.onlineState="Unknown",this.J_=new Set}terminate(){(function(t,n){const i=x(t),s=i.queries;i.queries=od(),s.forEach(((o,c)=>{for(const u of c.z_)u.onError(n)}))})(this,new k(S.ABORTED,"Firestore shutting down"))}}function od(){return new kt((r=>kp(r)),es)}async function hu(r,e){const t=x(r);let n=3;const i=e.query;let s=t.queries.get(i);s?!s.j_()&&e.H_()&&(n=2):(s=new $A,n=e.H_()?0:1);try{switch(n){case 0:s.G_=await t.onListen(i,!0);break;case 1:s.G_=await t.onListen(i,!1);break;case 2:await t.onFirstRemoteStoreListen(i)}}catch(o){const c=Br(o,`Initialization of query '${er(e.query)}' failed`);return void e.onError(c)}t.queries.set(i,s),s.z_.push(e),e.Y_(t.onlineState),s.G_&&e.Z_(s.G_)&&fu(t)}async function du(r,e){const t=x(r),n=e.query;let i=3;const s=t.queries.get(n);if(s){const o=s.z_.indexOf(e);o>=0&&(s.z_.splice(o,1),s.z_.length===0?i=e.H_()?0:1:!s.j_()&&e.H_()&&(i=2))}switch(i){case 0:return t.queries.delete(n),t.onUnlisten(n,!0);case 1:return t.queries.delete(n),t.onUnlisten(n,!1);case 2:return t.onLastRemoteStoreUnlisten(n);default:return}}function WA(r,e){const t=x(r);let n=!1;for(const i of e){const s=i.query,o=t.queries.get(s);if(o){for(const c of o.z_)c.Z_(i)&&(n=!0);o.G_=i}}n&&fu(t)}function HA(r,e,t){const n=x(r),i=n.queries.get(e);if(i)for(const s of i.z_)s.onError(t);n.queries.delete(e)}function fu(r){r.J_.forEach((e=>{e.next()}))}var uc,ad;(ad=uc||(uc={})).X_="default",ad.Cache="cache";class pu{constructor(e,t,n){this.query=e,this.ea=t,this.ta=!1,this.na=null,this.onlineState="Unknown",this.options=n||{}}Z_(e){if(!this.options.includeMetadataChanges){const n=[];for(const i of e.docChanges)i.type!==3&&n.push(i);e=new wr(e.query,e.docs,e.oldDocs,n,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ta?this.ra(e)&&(this.ea.next(e),t=!0):this.ia(e,this.onlineState)&&(this.sa(e),t=!0),this.na=e,t}onError(e){this.ea.error(e)}Y_(e){this.onlineState=e;let t=!1;return this.na&&!this.ta&&this.ia(this.na,e)&&(this.sa(this.na),t=!0),t}ia(e,t){if(!e.fromCache||!this.H_())return!0;const n=t!=="Offline";return(!this.options.oa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}ra(e){if(e.docChanges.length>0)return!0;const t=this.na&&this.na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}sa(e){e=wr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ta=!0,this.ea.next(e)}H_(){return this.options.source!==uc.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QA{constructor(e,t){this._a=e,this.byteLength=t}aa(){return"metadata"in this._a}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cd{constructor(e){this.serializer=e}Ts(e){return ut(this.serializer,e)}Es(e){return e.metadata.exists?rm(this.serializer,e.document,!1):ce.newNoDocument(this.Ts(e.metadata.name),this.ds(e.metadata.readTime))}ds(e){return ve(e)}}class JA{constructor(e,t,n){this.ua=e,this.localStore=t,this.serializer=n,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=Fm(e)}ca(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e._a.namedQuery)this.queries.push(e._a.namedQuery);else if(e._a.documentMetadata){this.documents.push({metadata:e._a.documentMetadata}),e._a.documentMetadata.exists||++t;const n=Y.fromString(e._a.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e._a.document&&(this.documents[this.documents.length-1].document=e._a.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}la(e){const t=new Map,n=new cd(this.serializer);for(const i of e)if(i.metadata.queries){const s=n.Ts(i.metadata.name);for(const o of i.metadata.queries){const c=(t.get(o)||W()).add(s);t.set(o,c)}}return t}async complete(){const e=await AA(this.localStore,new cd(this.serializer),this.documents,this.ua.id),t=this.la(this.documents);for(const n of this.queries)await RA(this.localStore,n,t.get(n.name));return this.progress.taskState="Success",{progress:this.progress,ha:this.collectionGroups,Pa:e}}}function Fm(r){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(e){this.key=e}}class Bm{constructor(e){this.key=e}}class qm{constructor(e,t){this.query=e,this.Ia=t,this.Ta=null,this.hasCachedResults=!1,this.current=!1,this.Ea=W(),this.mutatedKeys=W(),this.da=Vp(e),this.Aa=new ar(this.da)}get Ra(){return this.Ia}Va(e,t){const n=t?t.ma:new sd,i=t?t.Aa:this.Aa;let s=t?t.mutatedKeys:this.mutatedKeys,o=i,c=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal(((f,p)=>{const _=i.get(f),R=ts(this.query,p)?p:null,D=!!_&&this.mutatedKeys.has(_.key),V=!!R&&(R.hasLocalMutations||this.mutatedKeys.has(R.key)&&R.hasCommittedMutations);let C=!1;_&&R?_.data.isEqual(R.data)?D!==V&&(n.track({type:3,doc:R}),C=!0):this.fa(_,R)||(n.track({type:2,doc:R}),C=!0,(u&&this.da(R,u)>0||h&&this.da(R,h)<0)&&(c=!0)):!_&&R?(n.track({type:0,doc:R}),C=!0):_&&!R&&(n.track({type:1,doc:_}),C=!0,(u||h)&&(c=!0)),C&&(R?(o=o.add(R),s=V?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))})),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),n.track({type:1,doc:f})}return{Aa:o,ma:n,ts:c,mutatedKeys:s}}fa(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,i){const s=this.Aa;this.Aa=e.Aa,this.mutatedKeys=e.mutatedKeys;const o=e.ma.W_();o.sort(((f,p)=>(function(R,D){const V=C=>{switch(C){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return F()}};return V(R)-V(D)})(f.type,p.type)||this.da(f.doc,p.doc))),this.ga(n),i=i!=null&&i;const c=t&&!i?this.pa():[],u=this.Ea.size===0&&this.current&&!i?1:0,h=u!==this.Ta;return this.Ta=u,o.length!==0||h?{snapshot:new wr(this.query,e.Aa,s,o,e.mutatedKeys,u===0,h,!1,!!n&&n.resumeToken.approximateByteSize()>0),ya:c}:{ya:c}}Y_(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Aa:this.Aa,ma:new sd,mutatedKeys:this.mutatedKeys,ts:!1},!1)):{ya:[]}}wa(e){return!this.Ia.has(e)&&!!this.Aa.has(e)&&!this.Aa.get(e).hasLocalMutations}ga(e){e&&(e.addedDocuments.forEach((t=>this.Ia=this.Ia.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Ia=this.Ia.delete(t))),this.current=e.current)}pa(){if(!this.current)return[];const e=this.Ea;this.Ea=W(),this.Aa.forEach((n=>{this.wa(n.key)&&(this.Ea=this.Ea.add(n.key))}));const t=[];return e.forEach((n=>{this.Ea.has(n)||t.push(new Bm(n))})),this.Ea.forEach((n=>{e.has(n)||t.push(new Um(n))})),t}Sa(e){this.Ia=e.Is,this.Ea=W();const t=this.Va(e.documents);return this.applyChanges(t,!0)}ba(){return wr.fromInitialDocuments(this.query,this.Aa,this.mutatedKeys,this.Ta===0,this.hasCachedResults)}}class YA{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class XA{constructor(e){this.key=e,this.Da=!1}}class ZA{constructor(e,t,n,i,s,o){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Ca={},this.va=new kt((c=>kp(c)),es),this.Fa=new Map,this.Ma=new Set,this.xa=new oe(M.comparator),this.Oa=new Map,this.Na=new eu,this.La={},this.Ba=new Map,this.ka=Ln.Bn(),this.onlineState="Unknown",this.qa=void 0}get isPrimaryClient(){return this.qa===!0}}async function eR(r,e,t=!0){const n=Go(r);let i;const s=n.va.get(e);return s?(n.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.ba()):i=await zm(n,e,t,!0),i}async function tR(r,e){const t=Go(r);await zm(t,e,!0,!1)}async function zm(r,e,t,n){const i=await Er(r.localStore,ze(e)),s=i.targetId,o=t?r.sharedClientState.addLocalQueryTarget(s):"not-current";let c;return n&&(c=await mu(r,e,s,o==="current",i.resumeToken)),r.isPrimaryClient&&t&&zo(r.remoteStore,i),c}async function mu(r,e,t,n,i){r.Qa=(p,_,R)=>(async function(V,C,z,j){let U=C.view.Va(z);U.ts&&(U=await po(V.localStore,C.query,!1).then((({documents:E})=>C.view.Va(E,U))));const H=j&&j.targetChanges.get(C.targetId),ee=j&&j.targetMismatches.get(C.targetId)!=null,K=C.view.applyChanges(U,V.isPrimaryClient,H,ee);return lc(V,C.targetId,K.ya),K.snapshot})(r,p,_,R);const s=await po(r.localStore,e,!0),o=new qm(e,s.Is),c=o.Va(s.documents),u=is.createSynthesizedTargetChangeForCurrentChange(t,n&&r.onlineState!=="Offline",i),h=o.applyChanges(c,r.isPrimaryClient,u);lc(r,t,h.ya);const f=new YA(e,t,o);return r.va.set(e,f),r.Fa.has(t)?r.Fa.get(t).push(e):r.Fa.set(t,[e]),h.snapshot}async function nR(r,e,t){const n=x(r),i=n.va.get(e),s=n.Fa.get(i.targetId);if(s.length>1)return n.Fa.set(i.targetId,s.filter((o=>!es(o,e)))),void n.va.delete(e);n.isPrimaryClient?(n.sharedClientState.removeLocalQueryTarget(i.targetId),n.sharedClientState.isActiveQueryTarget(i.targetId)||await Tr(n.localStore,i.targetId,!1).then((()=>{n.sharedClientState.clearQueryState(i.targetId),t&&vr(n.remoteStore,i.targetId),Ar(n,i.targetId)})).catch(an)):(Ar(n,i.targetId),await Tr(n.localStore,i.targetId,!0))}async function rR(r,e){const t=x(r),n=t.va.get(e),i=t.Fa.get(n.targetId);t.isPrimaryClient&&i.length===1&&(t.sharedClientState.removeLocalQueryTarget(n.targetId),vr(t.remoteStore,n.targetId))}async function iR(r,e,t){const n=Iu(r);try{const i=await(function(o,c){const u=x(o),h=fe.now(),f=c.reduce(((R,D)=>R.add(D.key)),W());let p,_;return u.persistence.runTransaction("Locally write mutations","readwrite",(R=>{let D=He(),V=W();return u.us.getEntries(R,f).next((C=>{D=C,D.forEach(((z,j)=>{j.isValidDocument()||(V=V.add(z))}))})).next((()=>u.localDocuments.getOverlayedDocuments(R,D))).next((C=>{p=C;const z=[];for(const j of c){const U=Dw(j,p.get(j.key).overlayedDocument);U!=null&&z.push(new Nt(j.key,U,Ep(U.value.mapValue),de.exists(!0)))}return u.mutationQueue.addMutationBatch(R,h,z,c)})).next((C=>{_=C;const z=C.applyToLocalDocumentSet(p,V);return u.documentOverlayCache.saveOverlays(R,C.batchId,z)}))})).then((()=>({batchId:_.batchId,changes:xp(p)})))})(n.localStore,e);n.sharedClientState.addPendingMutation(i.batchId),(function(o,c,u){let h=o.La[o.currentUser.toKey()];h||(h=new oe($)),h=h.insert(c,u),o.La[o.currentUser.toKey()]=h})(n,i.batchId,t),await Vt(n,i.changes),await Fr(n.remoteStore)}catch(i){const s=Br(i,"Failed to persist write");t.reject(s)}}async function Gm(r,e){const t=x(r);try{const n=await vA(t.localStore,e);e.targetChanges.forEach(((i,s)=>{const o=t.Oa.get(s);o&&(q(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1),i.addedDocuments.size>0?o.Da=!0:i.modifiedDocuments.size>0?q(o.Da):i.removedDocuments.size>0&&(q(o.Da),o.Da=!1))})),await Vt(t,n,e)}catch(n){await an(n)}}function ud(r,e,t){const n=x(r);if(n.isPrimaryClient&&t===0||!n.isPrimaryClient&&t===1){const i=[];n.va.forEach(((s,o)=>{const c=o.view.Y_(e);c.snapshot&&i.push(c.snapshot)})),(function(o,c){const u=x(o);u.onlineState=c;let h=!1;u.queries.forEach(((f,p)=>{for(const _ of p.z_)_.Y_(c)&&(h=!0)})),h&&fu(u)})(n.eventManager,e),i.length&&n.Ca.E_(i),n.onlineState=e,n.isPrimaryClient&&n.sharedClientState.setOnlineState(e)}}async function sR(r,e,t){const n=x(r);n.sharedClientState.updateQueryState(e,"rejected",t);const i=n.Oa.get(e),s=i&&i.key;if(s){let o=new oe(M.comparator);o=o.insert(s,ce.newNoDocument(s,G.min()));const c=W().add(s),u=new rs(G.min(),new Map,new oe($),o,c);await Gm(n,u),n.xa=n.xa.remove(s),n.Oa.delete(e),yu(n)}else await Tr(n.localStore,e,!1).then((()=>Ar(n,e,t))).catch(an)}async function oR(r,e){const t=x(r),n=e.batch.batchId;try{const i=await TA(t.localStore,e);_u(t,n,null),gu(t,n),t.sharedClientState.updateMutationState(n,"acknowledged"),await Vt(t,i)}catch(i){await an(i)}}async function aR(r,e,t){const n=x(r);try{const i=await(function(o,c){const u=x(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(h=>{let f;return u.mutationQueue.lookupMutationBatch(h,c).next((p=>(q(p!==null),f=p.keys(),u.mutationQueue.removeMutationBatch(h,p)))).next((()=>u.mutationQueue.performConsistencyCheck(h))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f))).next((()=>u.localDocuments.getDocuments(h,f)))}))})(n.localStore,e);_u(n,e,t),gu(n,e),n.sharedClientState.updateMutationState(e,"rejected",t),await Vt(n,i)}catch(i){await an(i)}}async function cR(r,e){const t=x(r);ln(t.remoteStore)||N("SyncEngine","The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const n=await(function(o){const c=x(o);return c.persistence.runTransaction("Get highest unacknowledged batch id","readonly",(u=>c.mutationQueue.getHighestUnacknowledgedBatchId(u)))})(t.localStore);if(n===-1)return void e.resolve();const i=t.Ba.get(n)||[];i.push(e),t.Ba.set(n,i)}catch(n){const i=Br(n,"Initialization of waitForPendingWrites() operation failed");e.reject(i)}}function gu(r,e){(r.Ba.get(e)||[]).forEach((t=>{t.resolve()})),r.Ba.delete(e)}function _u(r,e,t){const n=x(r);let i=n.La[n.currentUser.toKey()];if(i){const s=i.get(e);s&&(t?s.reject(t):s.resolve(),i=i.remove(e)),n.La[n.currentUser.toKey()]=i}}function Ar(r,e,t=null){r.sharedClientState.removeLocalQueryTarget(e);for(const n of r.Fa.get(e))r.va.delete(n),t&&r.Ca.Ka(n,t);r.Fa.delete(e),r.isPrimaryClient&&r.Na.mr(e).forEach((n=>{r.Na.containsKey(n)||jm(r,n)}))}function jm(r,e){r.Ma.delete(e.path.canonicalString());const t=r.xa.get(e);t!==null&&(vr(r.remoteStore,t),r.xa=r.xa.remove(e),r.Oa.delete(t),yu(r))}function lc(r,e,t){for(const n of t)n instanceof Um?(r.Na.addReference(n.key,e),uR(r,n)):n instanceof Bm?(N("SyncEngine","Document no longer in limbo: "+n.key),r.Na.removeReference(n.key,e),r.Na.containsKey(n.key)||jm(r,n.key)):F()}function uR(r,e){const t=e.key,n=t.path.canonicalString();r.xa.get(t)||r.Ma.has(n)||(N("SyncEngine","New document in limbo: "+t),r.Ma.add(n),yu(r))}function yu(r){for(;r.Ma.size>0&&r.xa.size<r.maxConcurrentLimboResolutions;){const e=r.Ma.values().next().value;r.Ma.delete(e);const t=new M(Y.fromString(e)),n=r.ka.next();r.Oa.set(n,new XA(t)),r.xa=r.xa.insert(t,n),zo(r.remoteStore,new vt(ze(Or(t.path)),n,"TargetPurposeLimboResolution",Ke.oe))}}async function Vt(r,e,t){const n=x(r),i=[],s=[],o=[];n.va.isEmpty()||(n.va.forEach(((c,u)=>{o.push(n.Qa(u,e,t).then((h=>{var f;if((h||t)&&n.isPrimaryClient){const p=h?!h.fromCache:(f=t?.targetChanges.get(u.targetId))===null||f===void 0?void 0:f.current;n.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(h){i.push(h);const p=iu.Ui(u.targetId,h);s.push(p)}})))})),await Promise.all(o),n.Ca.E_(i),await(async function(u,h){const f=x(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>w.forEach(h,(_=>w.forEach(_.Ki,(R=>f.persistence.referenceDelegate.addReference(p,_.targetId,R))).next((()=>w.forEach(_.$i,(R=>f.persistence.referenceDelegate.removeReference(p,_.targetId,R)))))))))}catch(p){if(!cn(p))throw p;N("LocalStore","Failed to update sequence numbers: "+p)}for(const p of h){const _=p.targetId;if(!p.fromCache){const R=f.ss.get(_),D=R.snapshotVersion,V=R.withLastLimboFreeSnapshotVersion(D);f.ss=f.ss.insert(_,V)}}})(n.localStore,s))}async function lR(r,e){const t=x(r);if(!t.currentUser.isEqual(e)){N("SyncEngine","User change. New user:",e.toKey());const n=await Am(t.localStore,e);t.currentUser=e,(function(s,o){s.Ba.forEach((c=>{c.forEach((u=>{u.reject(new k(S.CANCELLED,o))}))})),s.Ba.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,n.removedBatchIds,n.addedBatchIds),await Vt(t,n.ls)}}function hR(r,e){const t=x(r),n=t.Oa.get(e);if(n&&n.Da)return W().add(n.key);{let i=W();const s=t.Fa.get(e);if(!s)return i;for(const o of s){const c=t.va.get(o);i=i.unionWith(c.view.Ra)}return i}}async function dR(r,e){const t=x(r),n=await po(t.localStore,e.query,!0),i=e.view.Sa(n);return t.isPrimaryClient&&lc(t,e.targetId,i.ya),i}async function fR(r,e){const t=x(r);return Pm(t.localStore,e).then((n=>Vt(t,n)))}async function pR(r,e,t,n){const i=x(r),s=await(function(c,u){const h=x(c),f=x(h.mutationQueue);return h.persistence.runTransaction("Lookup mutation documents","readonly",(p=>f.Fn(p,u).next((_=>_?h.localDocuments.getDocuments(p,_):w.resolve(null)))))})(i.localStore,e);s!==null?(t==="pending"?await Fr(i.remoteStore):t==="acknowledged"||t==="rejected"?(_u(i,e,n||null),gu(i,e),(function(c,u){x(x(c).mutationQueue).xn(u)})(i.localStore,e)):F(),await Vt(i,s)):N("SyncEngine","Cannot apply mutation batch with id: "+e)}async function mR(r,e){const t=x(r);if(Go(t),Iu(t),e===!0&&t.qa!==!0){const n=t.sharedClientState.getAllActiveQueryTargets(),i=await ld(t,n.toArray());t.qa=!0,await cc(t.remoteStore,!0);for(const s of i)zo(t.remoteStore,s)}else if(e===!1&&t.qa!==!1){const n=[];let i=Promise.resolve();t.Fa.forEach(((s,o)=>{t.sharedClientState.isLocalQueryTarget(o)?n.push(o):i=i.then((()=>(Ar(t,o),Tr(t.localStore,o,!0)))),vr(t.remoteStore,o)})),await i,await ld(t,n),(function(o){const c=x(o);c.Oa.forEach(((u,h)=>{vr(c.remoteStore,h)})),c.Na.gr(),c.Oa=new Map,c.xa=new oe(M.comparator)})(t),t.qa=!1,await cc(t.remoteStore,!1)}}async function ld(r,e,t){const n=x(r),i=[],s=[];for(const o of e){let c;const u=n.Fa.get(o);if(u&&u.length!==0){c=await Er(n.localStore,ze(u[0]));for(const h of u){const f=n.va.get(h),p=await dR(n,f);p.snapshot&&s.push(p.snapshot)}}else{const h=await Sm(n.localStore,o);c=await Er(n.localStore,h),await mu(n,$m(h),o,!1,c.resumeToken)}i.push(c)}return n.Ca.E_(s),i}function $m(r){return Pp(r.path,r.collectionGroup,r.orderBy,r.filters,r.limit,"F",r.startAt,r.endAt)}function gR(r){return(function(t){return x(x(t).persistence).qi()})(x(r).localStore)}async function _R(r,e,t,n){const i=x(r);if(i.qa)return void N("SyncEngine","Ignoring unexpected query state notification.");const s=i.Fa.get(e);if(s&&s.length>0)switch(t){case"current":case"not-current":{const o=await Pm(i.localStore,Np(s[0])),c=rs.createSynthesizedRemoteEventForCurrentChange(e,t==="current",me.EMPTY_BYTE_STRING);await Vt(i,o,c);break}case"rejected":await Tr(i.localStore,e,!0),Ar(i,e,n);break;default:F()}}async function yR(r,e,t){const n=Go(r);if(n.qa){for(const i of e){if(n.Fa.has(i)&&n.sharedClientState.isActiveQueryTarget(i)){N("SyncEngine","Adding an already active target "+i);continue}const s=await Sm(n.localStore,i),o=await Er(n.localStore,s);await mu(n,$m(s),o.targetId,!1,o.resumeToken),zo(n.remoteStore,o)}for(const i of t)n.Fa.has(i)&&await Tr(n.localStore,i,!1).then((()=>{vr(n.remoteStore,i),Ar(n,i)})).catch(an)}}function Go(r){const e=x(r);return e.remoteStore.remoteSyncer.applyRemoteEvent=Gm.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=hR.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=sR.bind(null,e),e.Ca.E_=WA.bind(null,e.eventManager),e.Ca.Ka=HA.bind(null,e.eventManager),e}function Iu(r){const e=x(r);return e.remoteStore.remoteSyncer.applySuccessfulWrite=oR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=aR.bind(null,e),e}function IR(r,e,t){const n=x(r);(async function(s,o,c){try{const u=await o.getMetadata();if(await(function(R,D){const V=x(R),C=ve(D.createTime);return V.persistence.runTransaction("hasNewerBundle","readonly",(z=>V.Wr.getBundleMetadata(z,D.id))).then((z=>!!z&&z.createTime.compareTo(C)>=0))})(s.localStore,u))return await o.close(),c._completeWith((function(R){return{taskState:"Success",documentsLoaded:R.totalDocuments,bytesLoaded:R.totalBytes,totalDocuments:R.totalDocuments,totalBytes:R.totalBytes}})(u)),Promise.resolve(new Set);c._updateProgress(Fm(u));const h=new JA(u,s.localStore,o.serializer);let f=await o.$a();for(;f;){const _=await h.ca(f);_&&c._updateProgress(_),f=await o.$a()}const p=await h.complete();return await Vt(s,p.Pa,void 0),await(function(R,D){const V=x(R);return V.persistence.runTransaction("Save bundle","readwrite",(C=>V.Wr.saveBundleMetadata(C,D)))})(s.localStore,u),c._completeWith(p.progress),Promise.resolve(p.ha)}catch(u){return Je("SyncEngine",`Loading bundle failed with ${u}`),c._failWith(u),Promise.resolve(new Set)}})(n,e,t).then((i=>{n.sharedClientState.notifyBundleLoaded(i)}))}class Rr{constructor(){this.synchronizeTabs=!1}async initialize(e){this.serializer=ss(e.databaseInfo.databaseId),this.sharedClientState=this.createSharedClientState(e),this.persistence=this.createPersistence(e),await this.persistence.start(),this.localStore=this.createLocalStore(e),this.gcScheduler=this.createGarbageCollectionScheduler(e,this.localStore),this.indexBackfillerScheduler=this.createIndexBackfillerScheduler(e,this.localStore)}createGarbageCollectionScheduler(e,t){return null}createIndexBackfillerScheduler(e,t){return null}createLocalStore(e){return wm(this.persistence,new vm,e.initialUser,this.serializer)}createPersistence(e){return new tu(qo.Yr,this.serializer)}createSharedClientState(e){return new Dm}async terminate(){var e,t;(e=this.gcScheduler)===null||e===void 0||e.stop(),(t=this.indexBackfillerScheduler)===null||t===void 0||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}class ER extends Rr{constructor(e){super(),this.cacheSizeBytes=e}createGarbageCollectionScheduler(e,t){q(this.persistence.referenceDelegate instanceof fo);const n=this.persistence.referenceDelegate.garbageCollector;return new _m(n,e.asyncQueue,t)}createPersistence(e){const t=this.cacheSizeBytes!==void 0?Be.withCacheSize(this.cacheSizeBytes):Be.DEFAULT;return new tu((n=>fo.Yr(n,t)),this.serializer)}}class Eu extends Rr{constructor(e,t,n){super(),this.Ua=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Ua.initialize(this,e),await Iu(this.Ua.syncEngine),await Fr(this.Ua.remoteStore),await this.persistence.pi((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}createLocalStore(e){return wm(this.persistence,new vm,e.initialUser,this.serializer)}createGarbageCollectionScheduler(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new _m(n,e.asyncQueue,t)}createIndexBackfillerScheduler(e,t){const n=new qv(t,this.persistence);return new Bv(e.asyncQueue,n)}createPersistence(e){const t=ru(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=this.cacheSizeBytes!==void 0?Be.withCacheSize(this.cacheSizeBytes):Be.DEFAULT;return new nu(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,km(),Js(),this.serializer,this.sharedClientState,!!this.forceOwnership)}createSharedClientState(e){return new Dm}}class Km extends Eu{constructor(e,t){super(e,t,!1),this.Ua=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Ua.syncEngine;this.sharedClientState instanceof La&&(this.sharedClientState.syncEngine={eo:pR.bind(null,t),no:_R.bind(null,t),ro:yR.bind(null,t),qi:gR.bind(null,t),Xs:fR.bind(null,t)},await this.sharedClientState.start()),await this.persistence.pi((async n=>{await mR(this.Ua.syncEngine,n),this.gcScheduler&&(n&&!this.gcScheduler.started?this.gcScheduler.start():n||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(n&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():n||this.indexBackfillerScheduler.stop())}))}createSharedClientState(e){const t=km();if(!La.D(t))throw new k(S.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=ru(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new La(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class qr{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=n=>ud(this.syncEngine,n,1),this.remoteStore.remoteSyncer.handleCredentialChange=lR.bind(null,this.syncEngine),await cc(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new KA})()}createDatastore(e){const t=ss(e.databaseInfo.databaseId),n=(function(s){return new CA(s)})(e.databaseInfo);return(function(s,o,c,u){return new NA(s,o,c,u)})(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return(function(n,i,s,o,c){return new OA(n,i,s,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>ud(this.syncEngine,t,0)),(function(){return rd.D()?new rd:new bA})())}createSyncEngine(e,t){return(function(i,s,o,c,u,h,f){const p=new ZA(i,s,o,c,u,h);return f&&(p.qa=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(i){const s=x(i);N("RemoteStore","RemoteStore shutting down."),s.N_.add(5),await Mr(s),s.B_.shutdown(),s.k_.set("Unknown")})(this.remoteStore),(e=this.datastore)===null||e===void 0||e.terminate(),(t=this.eventManager)===null||t===void 0||t.terminate()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hd(r,e=10240){let t=0;return{async read(){if(t<r.byteLength){const n={value:r.slice(t,t+e),done:!1};return t+=e,n}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jo{constructor(e){this.observer=e,this.muted=!1}next(e){this.observer.next&&this.Wa(this.observer.next,e)}error(e){this.observer.error?this.Wa(this.observer.error,e):Te("Uncaught Error in snapshot listener:",e.toString())}Ga(){this.muted=!0}Wa(e,t){this.muted||setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TR{constructor(e,t){this.za=e,this.serializer=t,this.metadata=new be,this.buffer=new Uint8Array,this.ja=(function(){return new TextDecoder("utf-8")})(),this.Ha().then((n=>{n&&n.aa()?this.metadata.resolve(n._a.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(n?._a)}`))}),(n=>this.metadata.reject(n)))}close(){return this.za.cancel()}async getMetadata(){return this.metadata.promise}async $a(){return await this.getMetadata(),this.Ha()}async Ha(){const e=await this.Ja();if(e===null)return null;const t=this.ja.decode(e),n=Number(t);isNaN(n)&&this.Ya(`length string (${t}) is not valid number`);const i=await this.Za(n);return new QA(JSON.parse(i),e.length+n)}Xa(){return this.buffer.findIndex((e=>e===123))}async Ja(){for(;this.Xa()<0&&!await this.eu(););if(this.buffer.length===0)return null;const e=this.Xa();e<0&&this.Ya("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Za(e){for(;this.buffer.length<e;)await this.eu()&&this.Ya("Reached the end of bundle when more is expected.");const t=this.ja.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}Ya(e){throw this.za.cancel(),new Error(`Invalid bundle format: ${e}`)}async eu(){const e=await this.za.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vR{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new k(S.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(i,s){const o=x(i),c={documents:s.map((p=>Gi(o.serializer,p)))},u=await o.No("BatchGetDocuments",o.serializer.databaseId,Y.emptyPath(),c,s.length),h=new Map;u.forEach((p=>{const _=Uw(o.serializer,p);h.set(_.key.toString(),_)}));const f=[];return s.forEach((p=>{const _=h.get(p.toString());q(!!_),f.push(_)})),f})(this.datastore,e);return t.forEach((n=>this.recordVersion(n))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new Lr(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,n)=>{const i=M.fromPath(n);this.mutations.push(new $c(i,this.precondition(i)))})),await(async function(n,i){const s=x(n),o={writes:i.map((c=>ji(s.serializer,c)))};await s.Fo("Commit",s.serializer.databaseId,Y.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw F();t=G.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new k(S.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(G.min())?de.exists(!1):de.updateTime(t):de.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(G.min()))throw new k(S.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return de.updateTime(t)}return de.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wR{constructor(e,t,n,i,s){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=i,this.deferred=s,this.tu=n.maxAttempts,this.e_=new ou(this.asyncQueue,"transaction_retry")}nu(){this.tu-=1,this.ru()}ru(){this.e_.Wo((async()=>{const e=new vR(this.datastore),t=this.iu(e);t&&t.then((n=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(n)})).catch((i=>{this.su(i)}))))})).catch((n=>{this.su(n)}))}))}iu(e){try{const t=this.updateFunction(e);return!Xi(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}su(e){this.tu>0&&this.ou(e)?(this.tu-=1,this.asyncQueue.enqueueAndForget((()=>(this.ru(),Promise.resolve())))):this.deferred.reject(e)}ou(e){if(e.name==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Wp(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class AR{constructor(e,t,n,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=i,this.user=Ce.UNAUTHENTICATED,this.clientId=Fc.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this.authCredentials.start(n,(async s=>{N("FirestoreClient","Received user=",s.uid),await this.authCredentialListener(s),this.user=s})),this.appCheckCredentials.start(n,(s=>(N("FirestoreClient","Received new app check token=",s),this.appCheckCredentialListener(s,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}verifyNotTerminated(){if(this.asyncQueue.isShuttingDown)throw new k(S.FAILED_PRECONDITION,"The client has already been terminated.")}terminate(){this.asyncQueue.enterRestrictedMode();const e=new be;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Br(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function Ys(r,e){r.asyncQueue.verifyOperationInProgress(),N("FirestoreClient","Initializing OfflineComponentProvider");const t=r.configuration;await e.initialize(t);let n=t.initialUser;r.setCredentialChangeListener((async i=>{n.isEqual(i)||(await Am(e.localStore,i),n=i)})),e.persistence.setDatabaseDeletedListener((()=>r.terminate())),r._offlineComponents=e}async function hc(r,e){r.asyncQueue.verifyOperationInProgress();const t=await Tu(r);N("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(t,r.configuration),r.setCredentialChangeListener((n=>id(e.remoteStore,n))),r.setAppCheckTokenChangeListener(((n,i)=>id(e.remoteStore,i))),r._onlineComponents=e}function Wm(r){return r.name==="FirebaseError"?r.code===S.FAILED_PRECONDITION||r.code===S.UNIMPLEMENTED:!(typeof DOMException<"u"&&r instanceof DOMException)||r.code===22||r.code===20||r.code===11}async function Tu(r){if(!r._offlineComponents)if(r._uninitializedComponentsProvider){N("FirestoreClient","Using user provided OfflineComponentProvider");try{await Ys(r,r._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!Wm(t))throw t;Je("Error using user provided cache. Falling back to memory cache: "+t),await Ys(r,new Rr)}}else N("FirestoreClient","Using default OfflineComponentProvider"),await Ys(r,new Rr);return r._offlineComponents}async function $o(r){return r._onlineComponents||(r._uninitializedComponentsProvider?(N("FirestoreClient","Using user provided OnlineComponentProvider"),await hc(r,r._uninitializedComponentsProvider._online)):(N("FirestoreClient","Using default OnlineComponentProvider"),await hc(r,new qr))),r._onlineComponents}function Hm(r){return Tu(r).then((e=>e.persistence))}function zr(r){return Tu(r).then((e=>e.localStore))}function Qm(r){return $o(r).then((e=>e.remoteStore))}function vu(r){return $o(r).then((e=>e.syncEngine))}function Jm(r){return $o(r).then((e=>e.datastore))}async function br(r){const e=await $o(r),t=e.eventManager;return t.onListen=eR.bind(null,e.syncEngine),t.onUnlisten=nR.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=tR.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=rR.bind(null,e.syncEngine),t}function RR(r){return r.asyncQueue.enqueue((async()=>{const e=await Hm(r),t=await Qm(r);return e.setNetworkEnabled(!0),(function(i){const s=x(i);return s.N_.delete(0),os(s)})(t)}))}function bR(r){return r.asyncQueue.enqueue((async()=>{const e=await Hm(r),t=await Qm(r);return e.setNetworkEnabled(!1),(async function(i){const s=x(i);s.N_.add(0),await Mr(s),s.k_.set("Offline")})(t)}))}function SR(r,e){const t=new be;return r.asyncQueue.enqueueAndForget((async()=>(async function(i,s,o){try{const c=await(function(h,f){const p=x(h);return p.persistence.runTransaction("read document","readonly",(_=>p.localDocuments.getDocument(_,f)))})(i,s);c.isFoundDocument()?o.resolve(c):c.isNoDocument()?o.resolve(null):o.reject(new k(S.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(c){const u=Br(c,`Failed to get document '${s} from cache`);o.reject(u)}})(await zr(r),e,t))),t.promise}function Ym(r,e,t={}){const n=new be;return r.asyncQueue.enqueueAndForget((async()=>(function(s,o,c,u,h){const f=new jo({next:_=>{o.enqueueAndForget((()=>du(s,p)));const R=_.docs.has(c);!R&&_.fromCache?h.reject(new k(S.UNAVAILABLE,"Failed to get document because the client is offline.")):R&&_.fromCache&&u&&u.source==="server"?h.reject(new k(S.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(_)},error:_=>h.reject(_)}),p=new pu(Or(c.path),f,{includeMetadataChanges:!0,oa:!0});return hu(s,p)})(await br(r),r.asyncQueue,e,t,n))),n.promise}function PR(r,e){const t=new be;return r.asyncQueue.enqueueAndForget((async()=>(async function(i,s,o){try{const c=await po(i,s,!0),u=new qm(s,c.Is),h=u.Va(c.documents),f=u.applyChanges(h,!1);o.resolve(f.snapshot)}catch(c){const u=Br(c,`Failed to execute query '${s} against cache`);o.reject(u)}})(await zr(r),e,t))),t.promise}function Xm(r,e,t={}){const n=new be;return r.asyncQueue.enqueueAndForget((async()=>(function(s,o,c,u,h){const f=new jo({next:_=>{o.enqueueAndForget((()=>du(s,p))),_.fromCache&&u.source==="server"?h.reject(new k(S.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(_)},error:_=>h.reject(_)}),p=new pu(c,f,{includeMetadataChanges:!0,oa:!0});return hu(s,p)})(await br(r),r.asyncQueue,e,t,n))),n.promise}function CR(r,e,t){const n=new be;return r.asyncQueue.enqueueAndForget((async()=>{try{const i=await Jm(r);n.resolve((async function(o,c,u){var h;const f=x(o),{request:p,ut:_,parent:R}=sm(f.serializer,Cp(c),u);f.connection.vo||delete p.parent;const D=(await f.No("RunAggregationQuery",f.serializer.databaseId,R,p,1)).filter((C=>!!C.result));q(D.length===1);const V=(h=D[0].result)===null||h===void 0?void 0:h.aggregateFields;return Object.keys(V).reduce(((C,z)=>(C[_[z]]=V[z],C)),{})})(i,e,t))}catch(i){n.reject(i)}})),n.promise}function DR(r,e){const t=new jo(e);return r.asyncQueue.enqueueAndForget((async()=>(function(i,s){x(i).J_.add(s),s.next()})(await br(r),t))),()=>{t.Ga(),r.asyncQueue.enqueueAndForget((async()=>(function(i,s){x(i).J_.delete(s)})(await br(r),t)))}}function kR(r,e,t,n){const i=(function(o,c){let u;return u=typeof o=="string"?Qp().encode(o):o,(function(f,p){return new TR(f,p)})((function(f,p){if(f instanceof Uint8Array)return hd(f,p);if(f instanceof ArrayBuffer)return hd(new Uint8Array(f),p);if(f instanceof ReadableStream)return f.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")})(u),c)})(t,ss(e));r.asyncQueue.enqueueAndForget((async()=>{IR(await vu(r),i,n)}))}function NR(r,e){return r.asyncQueue.enqueue((async()=>(function(n,i){const s=x(n);return s.persistence.runTransaction("Get named query","readonly",(o=>s.Wr.getNamedQuery(o,i)))})(await zr(r),e)))}function VR(r,e){return r.asyncQueue.enqueue((async()=>(async function(n,i){const s=x(n),o=s.indexManager,c=[];return s.persistence.runTransaction("Configure indexes","readwrite",(u=>o.getFieldIndexes(u).next((h=>(function(p,_,R,D,V){p=[...p],_=[..._],p.sort(R),_.sort(R);const C=p.length,z=_.length;let j=0,U=0;for(;j<z&&U<C;){const H=R(p[U],_[j]);H<0?V(p[U++]):H>0?D(_[j++]):(j++,U++)}for(;j<z;)D(_[j++]);for(;U<C;)V(p[U++])})(h,i,Lv,(f=>{c.push(o.addFieldIndex(u,f))}),(f=>{c.push(o.deleteFieldIndex(u,f))})))).next((()=>w.waitFor(c)))))})(await zr(r),e)))}function OR(r,e){return r.asyncQueue.enqueue((async()=>(function(n,i){x(n).rs.Gi=i})(await zr(r),e)))}function xR(r){return r.asyncQueue.enqueue((async()=>(function(t){const n=x(t),i=n.indexManager;return n.persistence.runTransaction("Delete All Indexes","readwrite",(s=>i.deleteAllFieldIndexes(s)))})(await zr(r))))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zm(r){const e={};return r.timeoutSeconds!==void 0&&(e.timeoutSeconds=r.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dd=new Map;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wu(r,e,t){if(!t)throw new k(S.INVALID_ARGUMENT,`Function ${r}() cannot be called with an empty ${e}.`)}function eg(r,e,t,n){if(e===!0&&n===!0)throw new k(S.INVALID_ARGUMENT,`${r} and ${t} cannot be used together.`)}function fd(r){if(!M.isDocumentKey(r))throw new k(S.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${r} has ${r.length}.`)}function pd(r){if(M.isDocumentKey(r))throw new k(S.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${r} has ${r.length}.`)}function Ko(r){if(r===void 0)return"undefined";if(r===null)return"null";if(typeof r=="string")return r.length>20&&(r=`${r.substring(0,20)}...`),JSON.stringify(r);if(typeof r=="number"||typeof r=="boolean")return""+r;if(typeof r=="object"){if(r instanceof Array)return"an array";{const e=(function(n){return n.constructor?n.constructor.name:null})(r);return e?`a custom ${e} object`:"an object"}}return typeof r=="function"?"a function":F()}function Q(r,e){if("_delegate"in r&&(r=r._delegate),!(r instanceof e)){if(e.name===r.constructor.name)throw new k(S.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=Ko(r);throw new k(S.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return r}function tg(r,e){if(e<=0)throw new k(S.INVALID_ARGUMENT,`Function ${r}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{constructor(e){var t,n;if(e.host===void 0){if(e.ssl!==void 0)throw new k(S.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=e.host,this.ssl=(t=e.ssl)===null||t===void 0||t;if(this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=41943040;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new k(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}eg("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=Zm((n=e.experimentalLongPollingOptions)!==null&&n!==void 0?n:{}),(function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new k(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new k(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new k(S.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(n,i){return n.timeoutSeconds===i.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class as{constructor(e,t,n,i){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new md({}),this._settingsFrozen=!1}get app(){if(!this._app)throw new k(S.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!==void 0}_setSettings(e){if(this._settingsFrozen)throw new k(S.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new md(e),e.credentials!==void 0&&(this._authCredentials=(function(n){if(!n)return new rp;switch(n.type){case"firstParty":return new kv(n.sessionIndex||"0",n.iamToken||null,n.authTokenFactory||null);case"provider":return n.client;default:throw new k(S.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask||(this._terminateTask=this._terminate()),this._terminateTask}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const n=dd.get(t);n&&(N("ComponentProvider","Removing Datastore"),dd.delete(t),n.terminate())})(this),Promise.resolve()}}function ng(r,e,t,n={}){var i;const s=(r=Q(r,as))._getSettings(),o=`${e}:${t}`;if(s.host!=="firestore.googleapis.com"&&s.host!==o&&Je("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),r._setSettings(Object.assign(Object.assign({},s),{host:o,ssl:!1})),n.mockUserToken){let c,u;if(typeof n.mockUserToken=="string")c=n.mockUserToken,u=Ce.MOCK_USER;else{c=I_(n.mockUserToken,(i=r._app)===null||i===void 0?void 0:i.options.projectId);const h=n.mockUserToken.sub||n.mockUserToken.user_id;if(!h)throw new k(S.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");u=new Ce(h)}r._authCredentials=new Pv(new np(c,u))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new ke(this.firestore,e,this._query)}}class Ie{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new rt(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new Ie(this.firestore,e,this._key)}}class rt extends ke{constructor(e,t,n){super(e,t,Or(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new Ie(this.firestore,null,new M(e))}withConverter(e){return new rt(this.firestore,e,this._path)}}function LR(r,e,...t){if(r=B(r),wu("collection","path",e),r instanceof as){const n=Y.fromString(e,...t);return pd(n),new rt(r,null,n)}{if(!(r instanceof Ie||r instanceof rt))throw new k(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Y.fromString(e,...t));return pd(n),new rt(r.firestore,null,n)}}function MR(r,e){if(r=Q(r,as),wu("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new k(S.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new ke(r,null,(function(n){return new Dt(Y.emptyPath(),n)})(e))}function rg(r,e,...t){if(r=B(r),arguments.length===1&&(e=Fc.newId()),wu("doc","path",e),r instanceof as){const n=Y.fromString(e,...t);return fd(n),new Ie(r,null,new M(n))}{if(!(r instanceof Ie||r instanceof rt))throw new k(S.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const n=r._path.child(Y.fromString(e,...t));return fd(n),new Ie(r.firestore,r instanceof rt?r.converter:null,new M(n))}}function FR(r,e){return r=B(r),e=B(e),(r instanceof Ie||r instanceof rt)&&(e instanceof Ie||e instanceof rt)&&r.firestore===e.firestore&&r.path===e.path&&r.converter===e.converter}function Au(r,e){return r=B(r),e=B(e),r instanceof ke&&e instanceof ke&&r.firestore===e.firestore&&es(r._query,e._query)&&r.converter===e.converter}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UR{constructor(){this._u=Promise.resolve(),this.au=[],this.uu=!1,this.cu=[],this.lu=null,this.hu=!1,this.Pu=!1,this.Iu=[],this.e_=new ou(this,"async_queue_retry"),this.Tu=()=>{const t=Js();t&&N("AsyncQueue","Visibility state changed to "+t.visibilityState),this.e_.zo()};const e=Js();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.Tu)}get isShuttingDown(){return this.uu}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Eu(),this.du(e)}enterRestrictedMode(e){if(!this.uu){this.uu=!0,this.Pu=e||!1;const t=Js();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Tu)}}enqueue(e){if(this.Eu(),this.uu)return new Promise((()=>{}));const t=new be;return this.du((()=>this.uu&&this.Pu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.au.push(e),this.Au())))}async Au(){if(this.au.length!==0){try{await this.au[0](),this.au.shift(),this.e_.reset()}catch(e){if(!cn(e))throw e;N("AsyncQueue","Operation failed with retryable error: "+e)}this.au.length>0&&this.e_.Wo((()=>this.Au()))}}du(e){const t=this._u.then((()=>(this.hu=!0,e().catch((n=>{this.lu=n,this.hu=!1;const i=(function(o){let c=o.message||"";return o.stack&&(c=o.stack.includes(o.message)?o.stack:o.message+`
`+o.stack),c})(n);throw Te("INTERNAL UNHANDLED ERROR: ",i),n})).then((n=>(this.hu=!1,n))))));return this._u=t,t}enqueueAfterDelay(e,t,n){this.Eu(),this.Iu.indexOf(e)>-1&&(t=0);const i=lu.createAndSchedule(this,e,t,n,(s=>this.Ru(s)));return this.cu.push(i),i}Eu(){this.lu&&F()}verifyOperationInProgress(){}async Vu(){let e;do e=this._u,await e;while(e!==this._u)}mu(e){for(const t of this.cu)if(t.timerId===e)return!0;return!1}fu(e){return this.Vu().then((()=>{this.cu.sort(((t,n)=>t.targetTimeMs-n.targetTimeMs));for(const t of this.cu)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.Vu()}))}gu(e){this.Iu.push(e)}Ru(e){const t=this.cu.indexOf(e);this.cu.splice(t,1)}}function dc(r){return(function(t,n){if(typeof t!="object"||t===null)return!1;const i=t;for(const s of n)if(s in i&&typeof i[s]=="function")return!0;return!1})(r,["next","error","complete"])}class ig{constructor(){this._progressObserver={},this._taskCompletionResolver=new be,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BR=-1;class re extends as{constructor(e,t,n,i){super(e,t,n,i),this.type="firestore",this._queue=(function(){return new UR})(),this._persistenceKey=i?.name||"[DEFAULT]"}_terminate(){return this._firestoreClient||sg(this),this._firestoreClient.terminate()}}function qR(r,e,t){t||(t="(default)");const n=Un(r,"firestore");if(n.isInitialized(t)){const i=n.getImmediate({identifier:t}),s=n.getOptions(t);if(Ht(s,e))return i;throw new k(S.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new k(S.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<1048576)throw new k(S.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return n.initialize({options:e,instanceIdentifier:t})}function zR(r,e){const t=typeof r=="object"?r:To(),n=typeof r=="string"?r:e||"(default)",i=Un(t,"firestore").getImmediate({identifier:n});if(!i._initialized){const s=Sd("firestore");s&&ng(i,...s)}return i}function pe(r){return r._firestoreClient||sg(r),r._firestoreClient.verifyNotTerminated(),r._firestoreClient}function sg(r){var e,t,n;const i=r._freezeSettings(),s=(function(c,u,h,f){return new uw(c,u,h,f.host,f.ssl,f.experimentalForceLongPolling,f.experimentalAutoDetectLongPolling,Zm(f.experimentalLongPollingOptions),f.useFetchStreams)})(r._databaseId,((e=r._app)===null||e===void 0?void 0:e.options.appId)||"",r._persistenceKey,i);r._firestoreClient=new AR(r._authCredentials,r._appCheckCredentials,r._queue,s),!((t=i.localCache)===null||t===void 0)&&t._offlineComponentProvider&&(!((n=i.localCache)===null||n===void 0)&&n._onlineComponentProvider)&&(r._firestoreClient._uninitializedComponentsProvider={_offlineKind:i.localCache.kind,_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider})}function GR(r,e){ag(r=Q(r,re));const t=pe(r);if(t._uninitializedComponentsProvider)throw new k(S.FAILED_PRECONDITION,"SDK cache is already specified.");Je("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=r._freezeSettings(),i=new qr;return og(t,i,new Eu(i,n.cacheSizeBytes,e?.forceOwnership))}function jR(r){ag(r=Q(r,re));const e=pe(r);if(e._uninitializedComponentsProvider)throw new k(S.FAILED_PRECONDITION,"SDK cache is already specified.");Je("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=r._freezeSettings(),n=new qr;return og(e,n,new Km(n,t.cacheSizeBytes))}function og(r,e,t){const n=new be;return r.asyncQueue.enqueue((async()=>{try{await Ys(r,t),await hc(r,e),n.resolve()}catch(i){const s=i;if(!Wm(s))throw s;Je("Error enabling indexeddb cache. Falling back to memory cache: "+s),n.reject(s)}})).then((()=>n.promise))}function $R(r){if(r._initialized&&!r._terminated)throw new k(S.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new be;return r._queue.enqueueAndForgetEvenWhileRestricted((async()=>{try{await(async function(n){if(!ct.D())return Promise.resolve();const i=n+"main";await ct.delete(i)})(ru(r._databaseId,r._persistenceKey)),e.resolve()}catch(t){e.reject(t)}})),e.promise}function KR(r){return(function(t){const n=new be;return t.asyncQueue.enqueueAndForget((async()=>cR(await vu(t),n))),n.promise})(pe(r=Q(r,re)))}function WR(r){return RR(pe(r=Q(r,re)))}function HR(r){return bR(pe(r=Q(r,re)))}function QR(r){return Md(r.app,"firestore",r._databaseId.database),r._delete()}function JR(r,e){const t=pe(r=Q(r,re)),n=new ig;return kR(t,r._databaseId,e,n),n}function YR(r,e){return NR(pe(r=Q(r,re)),e).then((t=>t?new ke(r,null,t.query):null))}function ag(r){if(r._initialized||r._terminated)throw new k(S.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sr{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class cg{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sn{constructor(e){this._byteString=e}static fromBase64String(e){try{return new sn(me.fromBase64String(e))}catch(t){throw new k(S.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new sn(me.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hn{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new k(S.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ue(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function XR(){return new hn("__name__")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wo{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new k(S.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new k(S.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return $(this._lat,e._lat)||$(this._long,e._long)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZR=/^__.*__$/;class eb{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return this.fieldMask!==null?new Nt(e,this.data,this.fieldMask,t,this.fieldTransforms):new xr(e,this.data,t,this.fieldTransforms)}}class ug{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Nt(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function lg(r){switch(r){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw F()}}class Ho{constructor(e,t,n,i,s,o){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=i,s===void 0&&this.pu(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get yu(){return this.settings.yu}wu(e){return new Ho(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Su(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.wu({path:n,bu:!1});return i.Du(e),i}Cu(e){var t;const n=(t=this.path)===null||t===void 0?void 0:t.child(e),i=this.wu({path:n,bu:!1});return i.pu(),i}vu(e){return this.wu({path:void 0,bu:!0})}Fu(e){return yo(e,this.settings.methodName,this.settings.Mu||!1,this.path,this.settings.xu)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}pu(){if(this.path)for(let e=0;e<this.path.length;e++)this.Du(this.path.get(e))}Du(e){if(e.length===0)throw this.Fu("Document fields must not be empty");if(lg(this.yu)&&ZR.test(e))throw this.Fu('Document fields cannot begin and end with "__"')}}class tb{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||ss(e)}Ou(e,t,n,i=!1){return new Ho({yu:e,methodName:t,xu:n,path:ue.emptyPath(),bu:!1,Mu:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function zn(r){const e=r._freezeSettings(),t=ss(r._databaseId);return new tb(r._databaseId,!!e.ignoreUndefinedProperties,t)}function Qo(r,e,t,n,i,s={}){const o=r.Ou(s.merge||s.mergeFields?2:0,e,t,i);ku("Data must be an object, but it was:",o,n);const c=fg(n,o);let u,h;if(s.merge)u=new We(o.fieldMask),h=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const p of s.mergeFields){const _=$i(e,p,t);if(!o.contains(_))throw new k(S.INVALID_ARGUMENT,`Field '${_}' is specified in your field mask but missing from your input data.`);mg(f,_)||f.push(_)}u=new We(f),h=o.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,h=o.fieldTransforms;return new eb(new Oe(c),u,h)}class cs extends dn{_toFieldTransform(e){if(e.yu!==2)throw e.yu===1?e.Fu(`${this._methodName}() can only appear at the top level of your update data`):e.Fu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof cs}}function hg(r,e,t){return new Ho({yu:3,xu:e.settings.xu,methodName:r._methodName,bu:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Ru extends dn{_toFieldTransform(e){return new ns(e.path,new _r)}isEqual(e){return e instanceof Ru}}class bu extends dn{constructor(e,t){super(e),this.Nu=t}_toFieldTransform(e){const t=hg(this,e,!0),n=this.Nu.map((s=>Gn(s,t))),i=new Nn(n);return new ns(e.path,i)}isEqual(e){return e instanceof bu&&Ht(this.Nu,e.Nu)}}class Su extends dn{constructor(e,t){super(e),this.Nu=t}_toFieldTransform(e){const t=hg(this,e,!0),n=this.Nu.map((s=>Gn(s,t))),i=new Vn(n);return new ns(e.path,i)}isEqual(e){return e instanceof Su&&Ht(this.Nu,e.Nu)}}class Pu extends dn{constructor(e,t){super(e),this.Lu=t}_toFieldTransform(e){const t=new yr(e.serializer,Up(e.serializer,this.Lu));return new ns(e.path,t)}isEqual(e){return e instanceof Pu&&this.Lu===e.Lu}}function Cu(r,e,t,n){const i=r.Ou(1,e,t);ku("Data must be an object, but it was:",i,n);const s=[],o=Oe.empty();un(n,((u,h)=>{const f=Jo(e,u,t);h=B(h);const p=i.Cu(f);if(h instanceof cs)s.push(f);else{const _=Gn(h,p);_!=null&&(s.push(f),o.set(f,_))}}));const c=new We(s);return new ug(o,c,i.fieldTransforms)}function Du(r,e,t,n,i,s){const o=r.Ou(1,e,t),c=[$i(e,n,t)],u=[i];if(s.length%2!=0)throw new k(S.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let _=0;_<s.length;_+=2)c.push($i(e,s[_])),u.push(s[_+1]);const h=[],f=Oe.empty();for(let _=c.length-1;_>=0;--_)if(!mg(h,c[_])){const R=c[_];let D=u[_];D=B(D);const V=o.Cu(R);if(D instanceof cs)h.push(R);else{const C=Gn(D,V);C!=null&&(h.push(R),f.set(R,C))}}const p=new We(h);return new ug(f,p,o.fieldTransforms)}function dg(r,e,t,n=!1){return Gn(t,r.Ou(n?4:3,e))}function Gn(r,e){if(pg(r=B(r)))return ku("Unsupported field value:",e,r),fg(r,e);if(r instanceof dn)return(function(n,i){if(!lg(i.yu))throw i.Fu(`${n._methodName}() can only be used with update() and set()`);if(!i.path)throw i.Fu(`${n._methodName}() is not currently supported inside arrays`);const s=n._toFieldTransform(i);s&&i.fieldTransforms.push(s)})(r,e),null;if(r===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),r instanceof Array){if(e.settings.bu&&e.yu!==4)throw e.Fu("Nested arrays are not supported");return(function(n,i){const s=[];let o=0;for(const c of n){let u=Gn(c,i.vu(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}})(r,e)}return(function(n,i){if((n=B(n))===null)return{nullValue:"NULL_VALUE"};if(typeof n=="number")return Up(i.serializer,n);if(typeof n=="boolean")return{booleanValue:n};if(typeof n=="string")return{stringValue:n};if(n instanceof Date){const s=fe.fromDate(n);return{timestampValue:Ir(i.serializer,s)}}if(n instanceof fe){const s=new fe(n.seconds,1e3*Math.floor(n.nanoseconds/1e3));return{timestampValue:Ir(i.serializer,s)}}if(n instanceof Wo)return{geoPointValue:{latitude:n.latitude,longitude:n.longitude}};if(n instanceof sn)return{bytesValue:Xp(i.serializer,n._byteString)};if(n instanceof Ie){const s=i.databaseId,o=n.firestore._databaseId;if(!o.isEqual(s))throw i.Fu(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:Jc(n.firestore._databaseId||i.databaseId,n._key.path)}}throw i.Fu(`Unsupported field value: ${Ko(n)}`)})(r,e)}function fg(r,e){const t={};return _p(r)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):un(r,((n,i)=>{const s=Gn(i,e.Su(n));s!=null&&(t[n]=s)})),{mapValue:{fields:t}}}function pg(r){return!(typeof r!="object"||r===null||r instanceof Array||r instanceof Date||r instanceof fe||r instanceof Wo||r instanceof sn||r instanceof Ie||r instanceof dn)}function ku(r,e,t){if(!pg(t)||!(function(i){return typeof i=="object"&&i!==null&&(Object.getPrototypeOf(i)===Object.prototype||Object.getPrototypeOf(i)===null)})(t)){const n=Ko(t);throw n==="an object"?e.Fu(r+" a custom object"):e.Fu(r+" "+n)}}function $i(r,e,t){if((e=B(e))instanceof hn)return e._internalPath;if(typeof e=="string")return Jo(r,e);throw yo("Field path arguments must be of type string or ",r,!1,void 0,t)}const nb=new RegExp("[~\\*/\\[\\]]");function Jo(r,e,t){if(e.search(nb)>=0)throw yo(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,r,!1,void 0,t);try{return new hn(...e.split("."))._internalPath}catch{throw yo(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,r,!1,void 0,t)}}function yo(r,e,t,n,i){const s=n&&!n.isEmpty(),o=i!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${n}`),o&&(u+=` in document ${i}`),u+=")"),new k(S.INVALID_ARGUMENT,c+r+u)}function mg(r,e){return r.some((t=>t.isEqual(e)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(e,t,n,i,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new Ie(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new rb(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(Yo("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}}class rb extends Ki{data(){return super.data()}}function Yo(r,e){return typeof e=="string"?Jo(r,e):e instanceof hn?e._internalPath:e._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gg(r){if(r.limitType==="L"&&r.explicitOrderBy.length===0)throw new k(S.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Nu{}class Gr extends Nu{}function ib(r,e,...t){let n=[];e instanceof Nu&&n.push(e),n=n.concat(t),(function(s){const o=s.filter((u=>u instanceof jn)).length,c=s.filter((u=>u instanceof jr)).length;if(o>1||o>0&&c>0)throw new k(S.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(n);for(const i of n)r=i._apply(r);return r}class jr extends Gr{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new jr(e,t,n)}_apply(e){const t=this._parse(e);return yg(e._query,t),new ke(e.firestore,e.converter,Za(e._query,t))}_parse(e){const t=zn(e.firestore);return(function(s,o,c,u,h,f,p){let _;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new k(S.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){_d(p,f);const R=[];for(const D of p)R.push(gd(u,s,D));_={arrayValue:{values:R}}}else _=gd(u,s,p)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||_d(p,f),_=dg(c,o,p,f==="in"||f==="not-in");return X.create(h,f,_)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function sb(r,e,t){const n=e,i=Yo("where",r);return jr._create(i,n,t)}class jn extends Nu{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new jn(e,t)}_parse(e){const t=this._queryConstraints.map((n=>n._parse(e))).filter((n=>n.getFilters().length>0));return t.length===1?t[0]:ne.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(i,s){let o=i;const c=s.getFlattenedFilters();for(const u of c)yg(o,u),o=Za(o,u)})(e._query,t),new ke(e.firestore,e.converter,Za(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function ob(...r){return r.forEach((e=>Ig("or",e))),jn._create("or",r)}function ab(...r){return r.forEach((e=>Ig("and",e))),jn._create("and",r)}class Xo extends Gr{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Xo(e,t)}_apply(e){const t=(function(i,s,o){if(i.startAt!==null)throw new k(S.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new k(S.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new zi(s,o)})(e._query,this._field,this._direction);return new ke(e.firestore,e.converter,(function(i,s){const o=i.explicitOrderBy.concat([s]);return new Dt(i.path,i.collectionGroup,o,i.filters.slice(),i.limit,i.limitType,i.startAt,i.endAt)})(e._query,t))}}function cb(r,e="asc"){const t=e,n=Yo("orderBy",r);return Xo._create(n,t)}class us extends Gr{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new us(e,t,n)}_apply(e){return new ke(e.firestore,e.converter,ao(e._query,this._limit,this._limitType))}}function ub(r){return tg("limit",r),us._create("limit",r,"F")}function lb(r){return tg("limitToLast",r),us._create("limitToLast",r,"L")}class ls extends Gr{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new ls(e,t,n)}_apply(e){const t=_g(e,this.type,this._docOrFields,this._inclusive);return new ke(e.firestore,e.converter,(function(i,s){return new Dt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,s,i.endAt)})(e._query,t))}}function hb(...r){return ls._create("startAt",r,!0)}function db(...r){return ls._create("startAfter",r,!1)}class hs extends Gr{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new hs(e,t,n)}_apply(e){const t=_g(e,this.type,this._docOrFields,this._inclusive);return new ke(e.firestore,e.converter,(function(i,s){return new Dt(i.path,i.collectionGroup,i.explicitOrderBy.slice(),i.filters.slice(),i.limit,i.limitType,i.startAt,s)})(e._query,t))}}function fb(...r){return hs._create("endBefore",r,!1)}function pb(...r){return hs._create("endAt",r,!0)}function _g(r,e,t,n){if(t[0]=B(t[0]),t[0]instanceof Ki)return(function(s,o,c,u,h){if(!u)throw new k(S.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);const f=[];for(const p of or(s))if(p.field.isKeyField())f.push(Dn(o,u.key));else{const _=u.data.field(p.field);if(Oo(_))throw new k(S.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+p.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(_===null){const R=p.field.canonicalString();throw new k(S.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${R}' (used as the orderBy) does not exist.`)}f.push(_)}return new nn(f,h)})(r._query,r.firestore._databaseId,e,t[0]._document,n);{const i=zn(r.firestore);return(function(o,c,u,h,f,p){const _=o.explicitOrderBy;if(f.length>_.length)throw new k(S.INVALID_ARGUMENT,`Too many arguments provided to ${h}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const R=[];for(let D=0;D<f.length;D++){const V=f[D];if(_[D].field.isKeyField()){if(typeof V!="string")throw new k(S.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${h}(), but got a ${typeof V}`);if(!Gc(o)&&V.indexOf("/")!==-1)throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${h}() must be a plain document ID, but '${V}' contains a slash.`);const C=o.path.child(Y.fromString(V));if(!M.isDocumentKey(C))throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${h}() must result in a valid document path, but '${C}' is not because it contains an odd number of segments.`);const z=new M(C);R.push(Dn(c,z))}else{const C=dg(u,h,V);R.push(C)}}return new nn(R,p)})(r._query,r.firestore._databaseId,i,e,t,n)}}function gd(r,e,t){if(typeof(t=B(t))=="string"){if(t==="")throw new k(S.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Gc(e)&&t.indexOf("/")!==-1)throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const n=e.path.child(Y.fromString(t));if(!M.isDocumentKey(n))throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${n}' is not because it has an odd number of segments (${n.length}).`);return Dn(r,new M(n))}if(t instanceof Ie)return Dn(r,t._key);throw new k(S.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Ko(t)}.`)}function _d(r,e){if(!Array.isArray(r)||r.length===0)throw new k(S.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function yg(r,e){const t=(function(i,s){for(const o of i)for(const c of o.getFlattenedFilters())if(s.indexOf(c.op)>=0)return c.op;return null})(r.filters,(function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new k(S.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new k(S.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function Ig(r,e){if(!(e instanceof jr||e instanceof jn))throw new k(S.INVALID_ARGUMENT,`Function ${r}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class Vu{convertValue(e,t="none"){switch(en(e)){case 0:return null;case 1:return e.booleanValue;case 2:return _e(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(St(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 10:return this.convertObject(e.mapValue,t);default:throw F()}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return un(e,((i,s)=>{n[i]=this.convertValue(s,t)})),n}convertGeoPoint(e){return new Wo(_e(e.latitude),_e(e.longitude))}convertArray(e,t){return(e.values||[]).map((n=>this.convertValue(n,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=xo(e);return n==null?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(Ui(e));default:return null}}convertTimestamp(e){const t=bt(e);return new fe(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Y.fromString(e);q(um(n));const i=new Zt(n.get(1),n.get(3)),s=new M(n.popFirst(5));return i.isEqual(t)||Te(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zo(r,e,t){let n;return n=r?t&&(t.merge||t.mergeFields)?r.toFirestore(e,t):r.toFirestore(e):e,n}class mb extends Vu{constructor(e){super(),this.firestore=e}convertBytes(e){return new sn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ie(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gb(r){return new Sr("sum",$i("sum",r))}function _b(r){return new Sr("avg",$i("average",r))}function Eg(){return new Sr("count")}function yb(r,e){var t,n;return r instanceof Sr&&e instanceof Sr&&r.aggregateType===e.aggregateType&&((t=r._internalFieldPath)===null||t===void 0?void 0:t.canonicalString())===((n=e._internalFieldPath)===null||n===void 0?void 0:n.canonicalString())}function Ib(r,e){return Au(r.query,e.query)&&Ht(r.data(),e.data())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $t{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Mn extends Ki{constructor(e,t,n,i,s,o){super(e,t,n,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new Ci(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(Yo("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class Ci extends Mn{data(e={}){return super.data(e)}}class Fn{constructor(e,t,n,i){this._firestore=e,this._userDataWriter=t,this._snapshot=i,this.metadata=new $t(i.hasPendingWrites,i.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new Ci(this._firestore,this._userDataWriter,n.key,n,new $t(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new k(S.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map((c=>{const u=new Ci(i._firestore,i._userDataWriter,c.doc.key,c.doc,new $t(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter((c=>s||c.type!==3)).map((c=>{const u=new Ci(i._firestore,i._userDataWriter,c.doc.key,c.doc,new $t(i._snapshot.mutatedKeys.has(c.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return c.type!==0&&(h=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),f=o.indexOf(c.doc.key)),{type:Eb(c.type),doc:u,oldIndex:h,newIndex:f}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Eb(r){switch(r){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return F()}}function Tb(r,e){return r instanceof Mn&&e instanceof Mn?r._firestore===e._firestore&&r._key.isEqual(e._key)&&(r._document===null?e._document===null:r._document.isEqual(e._document))&&r._converter===e._converter:r instanceof Fn&&e instanceof Fn&&r._firestore===e._firestore&&Au(r.query,e.query)&&r.metadata.isEqual(e.metadata)&&r._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vb(r){r=Q(r,Ie);const e=Q(r.firestore,re);return Ym(pe(e),r._key).then((t=>Ou(e,r,t)))}class fn extends Vu{constructor(e){super(),this.firestore=e}convertBytes(e){return new sn(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new Ie(this.firestore,null,t)}}function wb(r){r=Q(r,Ie);const e=Q(r.firestore,re),t=pe(e),n=new fn(e);return SR(t,r._key).then((i=>new Mn(e,n,r._key,i,new $t(i!==null&&i.hasLocalMutations,!0),r.converter)))}function Ab(r){r=Q(r,Ie);const e=Q(r.firestore,re);return Ym(pe(e),r._key,{source:"server"}).then((t=>Ou(e,r,t)))}function Rb(r){r=Q(r,ke);const e=Q(r.firestore,re),t=pe(e),n=new fn(e);return gg(r._query),Xm(t,r._query).then((i=>new Fn(e,n,r,i)))}function bb(r){r=Q(r,ke);const e=Q(r.firestore,re),t=pe(e),n=new fn(e);return PR(t,r._query).then((i=>new Fn(e,n,r,i)))}function Sb(r){r=Q(r,ke);const e=Q(r.firestore,re),t=pe(e),n=new fn(e);return Xm(t,r._query,{source:"server"}).then((i=>new Fn(e,n,r,i)))}function Pb(r,e,t){r=Q(r,Ie);const n=Q(r.firestore,re),i=Zo(r.converter,e,t);return $r(n,[Qo(zn(n),"setDoc",r._key,i,r.converter!==null,t).toMutation(r._key,de.none())])}function Cb(r,e,t,...n){r=Q(r,Ie);const i=Q(r.firestore,re),s=zn(i);let o;return o=typeof(e=B(e))=="string"||e instanceof hn?Du(s,"updateDoc",r._key,e,t,n):Cu(s,"updateDoc",r._key,e),$r(i,[o.toMutation(r._key,de.exists(!0))])}function Db(r){return $r(Q(r.firestore,re),[new Lr(r._key,de.none())])}function kb(r,e){const t=Q(r.firestore,re),n=rg(r),i=Zo(r.converter,e);return $r(t,[Qo(zn(r.firestore),"addDoc",n._key,i,r.converter!==null,{}).toMutation(n._key,de.exists(!1))]).then((()=>n))}function Nb(r,...e){var t,n,i;r=B(r);let s={includeMetadataChanges:!1,source:"default"},o=0;typeof e[o]!="object"||dc(e[o])||(s=e[o],o++);const c={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(dc(e[o])){const p=e[o];e[o]=(t=p.next)===null||t===void 0?void 0:t.bind(p),e[o+1]=(n=p.error)===null||n===void 0?void 0:n.bind(p),e[o+2]=(i=p.complete)===null||i===void 0?void 0:i.bind(p)}let u,h,f;if(r instanceof Ie)h=Q(r.firestore,re),f=Or(r._key.path),u={next:p=>{e[o]&&e[o](Ou(h,r,p))},error:e[o+1],complete:e[o+2]};else{const p=Q(r,ke);h=Q(p.firestore,re),f=p._query;const _=new fn(h);u={next:R=>{e[o]&&e[o](new Fn(h,_,p,R))},error:e[o+1],complete:e[o+2]},gg(r._query)}return(function(_,R,D,V){const C=new jo(V),z=new pu(R,C,D);return _.asyncQueue.enqueueAndForget((async()=>hu(await br(_),z))),()=>{C.Ga(),_.asyncQueue.enqueueAndForget((async()=>du(await br(_),z)))}})(pe(h),f,c,u)}function Vb(r,e){return DR(pe(r=Q(r,re)),dc(e)?e:{next:e})}function $r(r,e){return(function(n,i){const s=new be;return n.asyncQueue.enqueueAndForget((async()=>iR(await vu(n),i,s))),s.promise})(pe(r),e)}function Ou(r,e,t){const n=t.docs.get(e._key),i=new fn(r);return new Mn(r,i,e._key,n,new $t(t.hasPendingWrites,t.fromCache),e.converter)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ob(r){return Tg(r,{count:Eg()})}function Tg(r,e){const t=Q(r.firestore,re),n=pe(t),i=gp(e,((s,o)=>new Kp(o,s.aggregateType,s._internalFieldPath)));return CR(n,r._query,i).then((s=>(function(c,u,h){const f=new fn(c);return new cg(u,f,h)})(t,r,s)))}class xb{constructor(e){this.kind="memory",this._onlineComponentProvider=new qr,e?.garbageCollector?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider=new Rr}toJSON(){return{kind:this.kind}}}class Lb{constructor(e){let t;this.kind="persistent",e?.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=vg(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class Mb{constructor(){this.kind="memoryEager",this._offlineComponentProvider=new Rr}toJSON(){return{kind:this.kind}}}class Fb{constructor(e){this.kind="memoryLru",this._offlineComponentProvider=new ER(e)}toJSON(){return{kind:this.kind}}}function Ub(){return new Mb}function Bb(r){return new Fb(r?.cacheSizeBytes)}function qb(r){return new xb(r)}function zb(r){return new Lb(r)}class Gb{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=new qr,this._offlineComponentProvider=new Eu(this._onlineComponentProvider,e?.cacheSizeBytes,this.forceOwnership)}}class jb{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=new qr,this._offlineComponentProvider=new Km(this._onlineComponentProvider,e?.cacheSizeBytes)}}function vg(r){return new Gb(r?.forceOwnership)}function $b(){return new jb}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kb={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wg{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=zn(e)}set(e,t,n){this._verifyNotCommitted();const i=Gt(e,this._firestore),s=Zo(i.converter,t,n),o=Qo(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,n);return this._mutations.push(o.toMutation(i._key,de.none())),this}update(e,t,n,...i){this._verifyNotCommitted();const s=Gt(e,this._firestore);let o;return o=typeof(t=B(t))=="string"||t instanceof hn?Du(this._dataReader,"WriteBatch.update",s._key,t,n,i):Cu(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(o.toMutation(s._key,de.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=Gt(e,this._firestore);return this._mutations=this._mutations.concat(new Lr(t._key,de.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new k(S.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Gt(r,e){if((r=B(r)).firestore!==e)throw new k(S.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ag extends class{constructor(t,n){this._firestore=t,this._transaction=n,this._dataReader=zn(t)}get(t){const n=Gt(t,this._firestore),i=new mb(this._firestore);return this._transaction.lookup([n._key]).then((s=>{if(!s||s.length!==1)return F();const o=s[0];if(o.isFoundDocument())return new Ki(this._firestore,i,o.key,o,n.converter);if(o.isNoDocument())return new Ki(this._firestore,i,n._key,null,n.converter);throw F()}))}set(t,n,i){const s=Gt(t,this._firestore),o=Zo(s.converter,n,i),c=Qo(this._dataReader,"Transaction.set",s._key,o,s.converter!==null,i);return this._transaction.set(s._key,c),this}update(t,n,i,...s){const o=Gt(t,this._firestore);let c;return c=typeof(n=B(n))=="string"||n instanceof hn?Du(this._dataReader,"Transaction.update",o._key,n,i,s):Cu(this._dataReader,"Transaction.update",o._key,n),this._transaction.update(o._key,c),this}delete(t){const n=Gt(t,this._firestore);return this._transaction.delete(n._key),this}}{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=Gt(e,this._firestore),n=new fn(this._firestore);return super.get(e).then((i=>new Mn(this._firestore,n,t._key,i._document,new $t(!1,!1),t.converter)))}}function Wb(r,e,t){r=Q(r,re);const n=Object.assign(Object.assign({},Kb),t);return(function(s){if(s.maxAttempts<1)throw new k(S.INVALID_ARGUMENT,"Max attempts must be at least 1")})(n),(function(s,o,c){const u=new be;return s.asyncQueue.enqueueAndForget((async()=>{const h=await Jm(s);new wR(s.asyncQueue,h,c,o,u).nu()})),u.promise})(pe(r),(i=>e(new Ag(r,i))),n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hb(){return new cs("deleteField")}function Qb(){return new Ru("serverTimestamp")}function Jb(...r){return new bu("arrayUnion",r)}function Yb(...r){return new Su("arrayRemove",r)}function Xb(r){return new Pu("increment",r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zb(r){return pe(r=Q(r,re)),new wg(r,(e=>$r(r,e)))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eS(r,e){var t;const n=pe(r=Q(r,re));if(!n._uninitializedComponentsProvider||((t=n._uninitializedComponentsProvider)===null||t===void 0?void 0:t._offlineKind)==="memory")return Je("Cannot enable indexes when persistence is disabled"),Promise.resolve();const i=(function(o){const c=typeof o=="string"?(function(f){try{return JSON.parse(f)}catch(p){throw new k(S.INVALID_ARGUMENT,"Failed to parse JSON: "+p?.message)}})(o):o,u=[];if(Array.isArray(c.indexes))for(const h of c.indexes){const f=yd(h,"collectionGroup"),p=[];if(Array.isArray(h.fields))for(const _ of h.fields){const R=Jo("setIndexConfiguration",yd(_,"fieldPath"));_.arrayConfig==="CONTAINS"?p.push(new Pn(R,2)):_.order==="ASCENDING"?p.push(new Pn(R,0)):_.order==="DESCENDING"&&p.push(new Pn(R,1))}u.push(new fr(fr.UNKNOWN_ID,f,p,pr.empty()))}return u})(e);return VR(n,i)}function yd(r,e){if(typeof r[e]!="string")throw new k(S.INVALID_ARGUMENT,"Missing string value for: "+e);return r[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rg{constructor(e){this._client=e,this.type="PersistentCacheIndexManager"}}function tS(r){var e;r=Q(r,re);const t=Id.get(r);if(t)return t;const n=pe(r);if(((e=n._uninitializedComponentsProvider)===null||e===void 0?void 0:e._offlineKind)!=="persistent")return null;const i=new Rg(n);return Id.set(r,i),i}function nS(r){bg(r,!0)}function rS(r){bg(r,!1)}function iS(r){r._client.verifyNotTerminated(),xR(r._client).then((e=>N("deleting all persistent cache indexes succeeded"))).catch((e=>Je("deleting all persistent cache indexes failed",e)))}function bg(r,e){r._client.verifyNotTerminated(),OR(r._client,e).then((t=>N(`setting persistent cache index auto creation isEnabled=${e} succeeded`))).catch((t=>Je(`setting persistent cache index auto creation isEnabled=${e} failed`,t)))}const Id=new WeakMap;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function sS(r){var e;const t=(e=pe(Q(r.firestore,re))._onlineComponents)===null||e===void 0?void 0:e.datastore.serializer;return t===void 0?null:Fo(t,ze(r._query))._t}function oS(r,e){var t;const n=gp(e,((s,o)=>new Kp(o,s.aggregateType,s._internalFieldPath))),i=(t=pe(Q(r.firestore,re))._onlineComponents)===null||t===void 0?void 0:t.datastore.serializer;return i===void 0?null:sm(i,Cp(r._query),n,!0).request}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aS{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return xu.instance.onExistenceFilterMismatch(e)}}class xu{constructor(){this.Bu=new Map}static get instance(){return Fs||(Fs=new xu,(function(t){if(co)throw new Error("a TestingHooksSpi instance is already set");co=t})(Fs)),Fs}et(e){this.Bu.forEach((t=>t(e)))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.Bu;return n.set(t,e),()=>n.delete(t)}}let Fs=null;(function(e,t=!0){(function(i){Vr=i})(Bn),Yt(new Qt("firestore",((n,{instanceIdentifier:i,options:s})=>{const o=n.getProvider("app").getImmediate(),c=new re(new Cv(n.getProvider("auth-internal")),new Nv(n.getProvider("app-check-internal")),(function(h,f){if(!Object.prototype.hasOwnProperty.apply(h.options,["projectId"]))throw new k(S.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Zt(h.options.projectId,f)})(o,i),o);return s=Object.assign({useFetchStreams:t},s),c._setSettings(s),c}),"PUBLIC").setMultipleInstances(!0)),et(hh,"4.6.5",e),et(hh,"4.6.5","esm2017")})();const VS=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Vu,AggregateField:Sr,AggregateQuerySnapshot:cg,Bytes:sn,CACHE_SIZE_UNLIMITED:BR,CollectionReference:rt,DocumentReference:Ie,DocumentSnapshot:Mn,FieldPath:hn,FieldValue:dn,Firestore:re,FirestoreError:k,GeoPoint:Wo,LoadBundleTask:ig,PersistentCacheIndexManager:Rg,Query:ke,QueryCompositeFilterConstraint:jn,QueryConstraint:Gr,QueryDocumentSnapshot:Ci,QueryEndAtConstraint:hs,QueryFieldFilterConstraint:jr,QueryLimitConstraint:us,QueryOrderByConstraint:Xo,QuerySnapshot:Fn,QueryStartAtConstraint:ls,SnapshotMetadata:$t,Timestamp:fe,Transaction:Ag,WriteBatch:wg,_AutoId:Fc,_ByteString:me,_DatabaseId:Zt,_DocumentKey:M,_EmptyAppCheckTokenProvider:Vv,_EmptyAuthCredentialsProvider:rp,_FieldPath:ue,_TestingHooks:aS,_cast:Q,_debugAssert:Sv,_internalAggregationQueryToProtoRunAggregationQueryRequest:oS,_internalQueryToProtoQueryTarget:sS,_isBase64Available:aw,_logWarn:Je,_validateIsNotUsedTogether:eg,addDoc:kb,aggregateFieldEqual:yb,aggregateQuerySnapshotEqual:Ib,and:ab,arrayRemove:Yb,arrayUnion:Jb,average:_b,clearIndexedDbPersistence:$R,collection:LR,collectionGroup:MR,connectFirestoreEmulator:ng,count:Eg,deleteAllPersistentCacheIndexes:iS,deleteDoc:Db,deleteField:Hb,disableNetwork:HR,disablePersistentCacheIndexAutoCreation:rS,doc:rg,documentId:XR,enableIndexedDbPersistence:GR,enableMultiTabIndexedDbPersistence:jR,enableNetwork:WR,enablePersistentCacheIndexAutoCreation:nS,endAt:pb,endBefore:fb,ensureFirestoreConfigured:pe,executeWrite:$r,getAggregateFromServer:Tg,getCountFromServer:Ob,getDoc:vb,getDocFromCache:wb,getDocFromServer:Ab,getDocs:Rb,getDocsFromCache:bb,getDocsFromServer:Sb,getFirestore:zR,getPersistentCacheIndexManager:tS,increment:Xb,initializeFirestore:qR,limit:ub,limitToLast:lb,loadBundle:JR,memoryEagerGarbageCollector:Ub,memoryLocalCache:qb,memoryLruGarbageCollector:Bb,namedQuery:YR,onSnapshot:Nb,onSnapshotsInSync:Vb,or:ob,orderBy:cb,persistentLocalCache:zb,persistentMultipleTabManager:$b,persistentSingleTabManager:vg,query:ib,queryEqual:Au,refEqual:FR,runTransaction:Wb,serverTimestamp:Qb,setDoc:Pb,setIndexConfiguration:eS,setLogLevel:bv,snapshotEqual:Tb,startAfter:db,startAt:hb,sum:gb,terminate:QR,updateDoc:Cb,waitForPendingWrites:KR,where:sb,writeBatch:Zb},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cS="type.googleapis.com/google.protobuf.Int64Value",uS="type.googleapis.com/google.protobuf.UInt64Value";function Sg(r,e){const t={};for(const n in r)r.hasOwnProperty(n)&&(t[n]=e(r[n]));return t}function fc(r){if(r==null)return null;if(r instanceof Number&&(r=r.valueOf()),typeof r=="number"&&isFinite(r)||r===!0||r===!1||Object.prototype.toString.call(r)==="[object String]")return r;if(r instanceof Date)return r.toISOString();if(Array.isArray(r))return r.map(e=>fc(e));if(typeof r=="function"||typeof r=="object")return Sg(r,e=>fc(e));throw new Error("Data cannot be encoded in JSON: "+r)}function Io(r){if(r==null)return r;if(r["@type"])switch(r["@type"]){case cS:case uS:{const e=Number(r.value);if(isNaN(e))throw new Error("Data cannot be decoded from JSON: "+r);return e}default:throw new Error("Data cannot be decoded from JSON: "+r)}return Array.isArray(r)?r.map(e=>Io(e)):typeof r=="function"||typeof r=="object"?Sg(r,e=>Io(e)):r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lu="functions";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ed={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class cr extends it{constructor(e,t,n){super(`${Lu}/${e}`,t||""),this.details=n}}function lS(r){if(r>=200&&r<300)return"ok";switch(r){case 0:return"internal";case 400:return"invalid-argument";case 401:return"unauthenticated";case 403:return"permission-denied";case 404:return"not-found";case 409:return"aborted";case 429:return"resource-exhausted";case 499:return"cancelled";case 500:return"internal";case 501:return"unimplemented";case 503:return"unavailable";case 504:return"deadline-exceeded"}return"unknown"}function hS(r,e){let t=lS(r),n=t,i;try{const s=e&&e.error;if(s){const o=s.status;if(typeof o=="string"){if(!Ed[o])return new cr("internal","internal");t=Ed[o],n=o}const c=s.message;typeof c=="string"&&(n=c),i=s.details,i!==void 0&&(i=Io(i))}}catch{}return t==="ok"?null:new cr(t,n,i)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dS{constructor(e,t,n){this.auth=null,this.messaging=null,this.appCheck=null,this.auth=e.getImmediate({optional:!0}),this.messaging=t.getImmediate({optional:!0}),this.auth||e.get().then(i=>this.auth=i,()=>{}),this.messaging||t.get().then(i=>this.messaging=i,()=>{}),this.appCheck||n.get().then(i=>this.appCheck=i,()=>{})}async getAuthToken(){if(this.auth)try{const e=await this.auth.getToken();return e?.accessToken}catch{return}}async getMessagingToken(){if(!(!this.messaging||!("Notification"in self)||Notification.permission!=="granted"))try{return await this.messaging.getToken()}catch{return}}async getAppCheckToken(e){if(this.appCheck){const t=e?await this.appCheck.getLimitedUseToken():await this.appCheck.getToken();return t.error?null:t.token}return null}async getContext(e){const t=await this.getAuthToken(),n=await this.getMessagingToken(),i=await this.getAppCheckToken(e);return{authToken:t,messagingToken:n,appCheckToken:i}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pc="us-central1";function fS(r){let e=null;return{promise:new Promise((t,n)=>{e=setTimeout(()=>{n(new cr("deadline-exceeded","deadline-exceeded"))},r)}),cancel:()=>{e&&clearTimeout(e)}}}class pS{constructor(e,t,n,i,s=pc,o){this.app=e,this.fetchImpl=o,this.emulatorOrigin=null,this.contextProvider=new dS(t,n,i),this.cancelAllRequests=new Promise(c=>{this.deleteService=()=>Promise.resolve(c())});try{const c=new URL(s);this.customDomain=c.origin,this.region=pc}catch{this.customDomain=null,this.region=s}}_delete(){return this.deleteService()}_url(e){const t=this.app.options.projectId;return this.emulatorOrigin!==null?`${this.emulatorOrigin}/${t}/${this.region}/${e}`:this.customDomain!==null?`${this.customDomain}/${e}`:`https://${this.region}-${t}.cloudfunctions.net/${e}`}}function mS(r,e,t){r.emulatorOrigin=`http://${e}:${t}`}function gS(r,e,t){return(n=>IS(r,e,n,t||{}))}function _S(r,e,t){return(n=>Pg(r,e,n,t||{}))}async function yS(r,e,t,n){t["Content-Type"]="application/json";let i;try{i=await n(r,{method:"POST",body:JSON.stringify(e),headers:t})}catch{return{status:0,json:null}}let s=null;try{s=await i.json()}catch{}return{status:i.status,json:s}}function IS(r,e,t,n){const i=r._url(e);return Pg(r,i,t,n)}async function Pg(r,e,t,n){t=fc(t);const i={data:t},s={},o=await r.contextProvider.getContext(n.limitedUseAppCheckTokens);o.authToken&&(s.Authorization="Bearer "+o.authToken),o.messagingToken&&(s["Firebase-Instance-ID-Token"]=o.messagingToken),o.appCheckToken!==null&&(s["X-Firebase-AppCheck"]=o.appCheckToken);const c=n.timeout||7e4,u=fS(c),h=await Promise.race([yS(e,i,s,r.fetchImpl),u.promise,r.cancelAllRequests]);if(u.cancel(),!h)throw new cr("cancelled","Firebase Functions instance was deleted.");const f=hS(h.status,h.json);if(f)throw f;if(!h.json)throw new cr("internal","Response is not valid JSON object.");let p=h.json.data;if(typeof p>"u"&&(p=h.json.result),typeof p>"u")throw new cr("internal","Response is missing data field.");return{data:Io(p)}}const Td="@firebase/functions",vd="0.11.6";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ES="auth-internal",TS="app-check-internal",vS="messaging-internal";function wS(r,e){const t=(n,{instanceIdentifier:i})=>{const s=n.getProvider("app").getImmediate(),o=n.getProvider(ES),c=n.getProvider(vS),u=n.getProvider(TS);return new pS(s,o,c,u,i,r)};Yt(new Qt(Lu,t,"PUBLIC").setMultipleInstances(!0)),et(Td,vd,e),et(Td,vd,"esm2017")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AS(r=To(),e=pc){const n=Un(B(r),Lu).getImmediate({identifier:e}),i=Sd("functions");return i&&Cg(n,...i),n}function Cg(r,e,t){mS(B(r),e,t)}function RS(r,e,t){return gS(B(r),e,t)}function bS(r,e,t){return _S(B(r),e,t)}wS(fetch.bind(self));const OS=Object.freeze(Object.defineProperty({__proto__:null,connectFunctionsEmulator:Cg,getFunctions:AS,httpsCallable:RS,httpsCallableFromURL:bS},Symbol.toStringTag,{value:"Module"}));export{SS as firebaseAppMod,PS as firebaseAuthMod,VS as firebaseFirestoreMod,OS as firebaseFunctionsMod};
