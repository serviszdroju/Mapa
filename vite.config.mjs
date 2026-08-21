import { defineConfig } from "vite";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "szz-root-pwa-assets",
      writeBundle(options) {
        const outputDir=options.dir || path.resolve("dist/client");
        const indexFile=path.join(outputDir,"index.html");
        const html=readFileSync(indexFile,"utf8");
        const patched=html
          .replace(/<link rel="manifest" href="\.\/assets\/manifest-[^"]+\.webmanifest">/, '<link rel="manifest" href="./manifest.webmanifest">')
          .replace(/<link rel="icon" href="\.\/assets\/szz-app-icon-192-[^"]+\.png" type="image\/png">/, '<link rel="icon" href="./szz-app-icon-192.png" type="image/png">')
          .replace(/<link rel="apple-touch-icon" href="\.\/assets\/szz-app-icon-192-[^"]+\.png">/, '<link rel="apple-touch-icon" href="./szz-app-icon-192.png">')
          .replace(/src="\.\/assets\/szz-logo-display-[^"]+\.png"/g, 'src="./szz-logo-display.png"');
        if(patched!==html) writeFileSync(indexFile,patched);
      },
    },
  ],
  build: {
    outDir: "dist/client",
    target: "esnext",
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: ["terminal.local"],
  },
});
