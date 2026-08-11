#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithEsbuild } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const index = path.join(client, "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const lateScript = path.join(client, "late.js");
const serviceWorkerScript = path.join(client, "sw.js");
const clientAssets = path.join(client, "assets");
const precachedAssetExtensions = new Set([
  ".css",
  ".gif",
  ".jpg",
  ".jpeg",
  ".js",
  ".png",
  ".svg",
  ".webmanifest",
  ".webp"
]);

function productionAssetPrecacheUrls() {
  if (!existsSync(clientAssets)) return [];
  return readdirSync(clientAssets)
    .filter((file) => precachedAssetExtensions.has(path.extname(file).toLowerCase()))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => `./assets/${file}`);
}

function augmentServiceWorkerPrecache(source, extraUrls) {
  if (!extraUrls.length) return source;
  const arrayMatch = source.match(/const PRECACHE_URLS = \[([\s\S]*?)\];/);
  if (!arrayMatch) throw new Error("Missing PRECACHE_URLS in service worker");
  const existingUrls = [...arrayMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
  const merged = [...existingUrls];
  const seen = new Set(existingUrls);
  for (const url of extraUrls) {
    if (!seen.has(url)) {
      seen.add(url);
      merged.push(url);
    }
  }
  const replacement = `const PRECACHE_URLS = [\n${merged
    .map((url, index) => `  ${JSON.stringify(url)}${index < merged.length - 1 ? "," : ""}`)
    .join("\n")}\n];`;
  return source.slice(0, arrayMatch.index) + replacement + source.slice(arrayMatch.index + arrayMatch[0].length);
}

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });

for (const standaloneScript of [lateScript, serviceWorkerScript]) {
  if (!existsSync(standaloneScript)) continue;
  let source = readFileSync(standaloneScript, "utf8");
  if (standaloneScript === serviceWorkerScript) {
    source = augmentServiceWorkerPrecache(source, productionAssetPrecacheUrls());
  }
  const result = await transformWithEsbuild(source, standaloneScript, {
    loader: "js",
    minify: true,
    target: "es2019"
  });
  writeFileSync(standaloneScript, result.code);
}

copyFileSync(worker, path.join(dist, "server", "index.js"));
copyFileSync(hosting, path.join(dist, ".openai", "hosting.json"));

console.log("Prepared Sites build: dist/server/index.js and dist/.openai/hosting.json");
