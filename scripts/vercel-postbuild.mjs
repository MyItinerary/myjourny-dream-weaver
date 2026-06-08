// Restructures the @lovable.dev/vite-tanstack-config output into Vercel Build Output API v3.
// Lovable's config always writes to dist/ regardless of the Nitro preset, so we
// manually create .vercel/output/ after the build instead of relying on Nitro's vercel preset
// to write there directly.
import { mkdirSync, writeFileSync, cpSync } from "fs";

const OUT = ".vercel/output";

mkdirSync(`${OUT}/static`, { recursive: true });
mkdirSync(`${OUT}/functions/index.func`, { recursive: true });

// Static client assets
cpSync("dist/client", `${OUT}/static`, { recursive: true });

// Serverless function bundle (all of dist/server/)
cpSync("dist/server", `${OUT}/functions/index.func`, { recursive: true });

// Vercel Build Output config — filesystem-first, then SSR catch-all
writeFileSync(
  `${OUT}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [{ handle: "filesystem" }, { src: "/(.*)", dest: "/" }],
    },
    null,
    2,
  ),
);

// Function runtime config — nodejs24.x, web/fetch handler format
writeFileSync(
  `${OUT}/functions/index.func/.vc-config.json`,
  JSON.stringify(
    {
      runtime: "nodejs24.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
    },
    null,
    2,
  ),
);

console.log("✓ .vercel/output structure created from dist/");
