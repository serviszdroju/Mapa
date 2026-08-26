import {cp, mkdir, readdir, rm, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(rootDir, "dist", "client");
const targetDir = path.join(rootDir, "android", "app", "src", "main", "assets", "Mapa");

function fail(message) {
  console.error(message);
  process.exit(1);
}

async function assertDirectory(dir, label) {
  try {
    const info = await stat(dir);
    if (!info.isDirectory()) fail(`${label} neni adresar: ${dir}`);
  } catch {
    fail(`${label} neexistuje: ${dir}`);
  }
}

function shouldSkipAsset(relativePath, entry) {
  if (entry.name === ".DS_Store") return true;
  if (/^downloads\/.+\.apk$/i.test(relativePath)) return true;
  return false;
}

async function copyTree(source, target, relative = "") {
  await mkdir(target, {recursive: true});
  const entries = await readdir(source, {withFileTypes: true});
  for (const entry of entries) {
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    const childRelative = path.posix.join(relative.split(path.sep).join(path.posix.sep), entry.name);
    if (shouldSkipAsset(childRelative, entry)) continue;
    if (entry.isDirectory()) {
      await copyTree(from, to, childRelative);
    } else if (entry.isFile()) {
      await cp(from, to);
    }
  }
}

await assertDirectory(sourceDir, "Vite build vystup");
await mkdir(path.dirname(targetDir), {recursive: true});
await rm(targetDir, {recursive: true, force: true});
await copyTree(sourceDir, targetDir);
await writeFile(
  path.join(targetDir, "szz-apk-assets.json"),
  JSON.stringify(
    {
      source: "dist/client",
      target: "android/app/src/main/assets/Mapa",
      excludes: ["downloads/*.apk"]
    },
    null,
    2
  ) + "\n"
);

console.log(`Android web assets prepared in ${targetDir}`);
