#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithEsbuild } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const index = path.join(dist, "client", "index.html");
const worker = path.join(root, "worker", "index.js");
const hosting = path.join(root, ".openai", "hosting.json");
const lateScript = path.join(dist, "client", "late.js");
const serviceWorkerScript = path.join(dist, "client", "sw.js");

for (const file of [index, worker, hosting]) {
  if (!existsSync(file)) throw new Error("Missing Sites build input: " + file);
}

mkdirSync(path.join(dist, "server"), { recursive: true });
mkdirSync(path.join(dist, ".openai"), { recursive: true });

for (const standaloneScript of [lateScript, serviceWorkerScript]) {
  if (!existsSync(standaloneScript)) continue;
  const source = readFileSync(standaloneScript, "utf8");
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
