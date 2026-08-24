import { cp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(rootDir, "dist", "client");
const targetArg = process.argv[2] || process.env.GH_PAGES_DIR || "";
const targetDir = targetArg ? path.resolve(targetArg) : "";

function fail(message) {
  console.error(message);
  process.exit(1);
}

if (!targetDir) {
  fail("Usage: node scripts/prepare-github-pages-build.mjs <gh-pages-worktree>");
}

if (targetDir === rootDir || targetDir === sourceDir || targetDir === path.parse(targetDir).root) {
  fail(`Refusing to deploy into unsafe target: ${targetDir}`);
}

try {
  const sourceInfo = await stat(sourceDir);
  if (!sourceInfo.isDirectory()) fail(`Build output not found: ${sourceDir}`);
} catch {
  fail(`Build output not found: ${sourceDir}. Run npm run build first.`);
}

try {
  const gitInfo = await stat(path.join(targetDir, ".git"));
  if (!gitInfo.isFile() && !gitInfo.isDirectory()) {
    fail(`Target is not a git worktree: ${targetDir}`);
  }
} catch {
  fail(`Target is not a git worktree: ${targetDir}`);
}

const keep = new Set([".git", "CNAME"]);

await mkdir(targetDir, { recursive: true });

for (const entry of await readdir(targetDir, { withFileTypes: true })) {
  if (keep.has(entry.name)) continue;
  await rm(path.join(targetDir, entry.name), { recursive: true, force: true });
}

await cp(sourceDir, targetDir, { recursive: true });
await cp(path.join(sourceDir, "index.html"), path.join(targetDir, "404.html"));
await writeFile(path.join(targetDir, ".nojekyll"), "");

console.log(`Prepared GitHub Pages build in ${targetDir}`);
