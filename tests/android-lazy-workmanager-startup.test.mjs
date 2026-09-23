import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const manifest=fs.readFileSync(new URL("../android/app/src/main/AndroidManifest.xml",import.meta.url),"utf8");
const repository=fs.readFileSync(new URL(
  "../android/app/src/main/java/cz/astip/serviszdroju/offline/SzzOfflineRepository.java",
  import.meta.url
),"utf8");

test("AndroidX startup provider is removed from the critical app startup path",()=>{
  assert.match(manifest,/android:name="androidx\.startup\.InitializationProvider"[\s\S]*?tools:node="remove"/);
});

test("WorkManager initializes lazily without changing sync policy",()=>{
  assert.match(repository,/WorkManager\.initialize\(context, new Configuration\.Builder\(\)\.build\(\)\)/);
  assert.match(repository,/workManager\(\)\.enqueueUniqueWork\(/);
  assert.match(repository,/ExistingWorkPolicy\.KEEP/);
  assert.match(repository,/NetworkType\.CONNECTED/);
  assert.match(repository,/BackoffPolicy\.EXPONENTIAL/);
});
