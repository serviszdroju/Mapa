import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source=fs.readFileSync(new URL("../src/firebase-bundled-sdk.js",import.meta.url),"utf8");
const functionsSource=fs.readFileSync(new URL("../src/firebase-functions-sdk.js",import.meta.url),"utf8");

function objectMembers(name,text=source){
  const body=text.match(new RegExp(`const ${name}=\\{([\\s\\S]*?)\\};`));
  assert.ok(body,`Missing ${name}`);
  return new Set(body[1].split(",").map(value=>value.trim()).filter(Boolean));
}

test("Firebase facade keeps the complete app and auth surface used by main",()=>{
  assert.deepEqual(objectMembers("firebaseAppMod"),new Set(["getApp","getApps","initializeApp"]));
  assert.deepEqual(objectMembers("firebaseAuthMod"),new Set([
    "GoogleAuthProvider","browserLocalPersistence","browserPopupRedirectResolver",
    "browserSessionPersistence","getAuth","getRedirectResult","indexedDBLocalPersistence",
    "onAuthStateChanged","setPersistence","signInWithCredential","signInWithPopup","signOut",
    "useDeviceLanguage"
  ]));
});

test("Firebase facade keeps every Firestore primitive used by the app",()=>{
  assert.deepEqual(objectMembers("firebaseFirestoreMod"),new Set([
    "Timestamp","addDoc","collection","deleteDoc","doc","getDoc","getDocs","getFirestore",
    "initializeFirestore","limit","memoryLocalCache","orderBy","query","serverTimestamp","setDoc","where"
  ]));
});

test("lazy Functions facade exposes only the two mail APIs",()=>{
  assert.deepEqual(objectMembers("firebaseFunctionsMod",functionsSource),new Set(["getFunctions","httpsCallable"]));
});
