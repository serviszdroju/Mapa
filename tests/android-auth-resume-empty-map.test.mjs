import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const hostedLogin = fs.readFileSync(new URL("../src/hosted-login.js", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../src/main.js", import.meta.url), "utf8");

test("znama Android relace neodkryje prazdnou mapu", () => {
  const resumeStart = hostedLogin.indexOf("if(showCachedApp){");
  const resumeEnd = hostedLogin.indexOf("}else{", resumeStart);
  const resumeBranch = hostedLogin.slice(resumeStart, resumeEnd);

  assert.match(resumeBranch, /showAuthState\(AUTH_LOADING/);
  assert.doesNotMatch(resumeBranch, /showAuthState\(AUTH_LOGGED_IN/);
});

test("obnova na pozadi odkryje aplikaci az s lokalnimi body", () => {
  const start = main.indexOf("function keepAppOpenDuringAuthRestore(message)");
  const end = main.indexOf("async function finishRedirectLoginIfPending", start);
  const body = main.slice(start, end);

  assert.match(body, /if\(!Array\.isArray\(rows\) \|\| !rows\.length\) return false/);
  assert.match(body, /await window\.loadFirebaseSitesUnified\(null,\{offlineCacheOnly:true\}\)/);
  assert.match(body, /setDisplayIfChanged\(document\.getElementById\("mainApp"\),"none"\)/);
  assert.match(body, /revealCachedMap\(\)/);
});

test("uvodni logo zustane do prvniho skutecneho vykresleni mapy", () => {
  const start = main.indexOf("function keepAppOpenDuringAuthRestore(message)");
  const end = main.indexOf("async function finishRedirectLoginIfPending", start);
  const body = main.slice(start, end);

  assert.match(body, /document\.getElementById\("shownCount"\)/);
  assert.match(body, /document\.getElementById\("list"\)\?\.firstElementChild/);
  assert.match(body, /requestAnimationFrame\(\(\)=>requestAnimationFrame\(\(\)=>revealAfterRender\(\)\)\)/);
  assert.match(body, /setDisplayIfChanged\(document\.getElementById\("startupScreen"\),"none"\)/);
});
