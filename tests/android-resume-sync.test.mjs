import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const activity = fs.readFileSync(
  new URL("../android/app/src/main/java/cz/astip/serviszdroju/MainActivity.java", import.meta.url),
  "utf8",
);
const repository = fs.readFileSync(
  new URL("../android/app/src/main/java/cz/astip/serviszdroju/offline/SzzOfflineRepository.java", import.meta.url),
  "utf8",
);

test("automaticka kontrola fronty pri rychlem navratu je omezena", () => {
  const resumeStart = activity.indexOf("protected void onResume()");
  const resumeEnd = activity.indexOf("@Override", resumeStart + 1);
  const onResume = activity.slice(resumeStart, resumeEnd);

  assert.match(onResume, /enqueueSyncWorkIfPendingOnResume\(\)/);
  assert.doesNotMatch(onResume, /enqueueSyncWorkIfPending\(\)/);
  assert.match(repository, /AUTOMATIC_PENDING_CHECK_INTERVAL_MS = 30_000L/);
  assert.match(repository, /SystemClock\.elapsedRealtime\(\)/);
});

test("rucni a zapisova synchronizace zustava bez omezeni", () => {
  assert.match(repository, /public void enqueueSyncWorkIfPending\(\)/);
  assert.match(repository, /public void enqueueSyncWork\(\)/);
  assert.match(activity, /public void requestSync\(\)[\s\S]*?enqueueSyncWorkIfPending\(\)/);
});
