// Ensures .vercel/output/ has a valid Vercel Build Output API v3 structure.
//
// With @lovable.dev/vite-tanstack-config >= 2.3.2, Nitro's vercel preset writes
// directly to .vercel/output/ (instead of dist/). When dist/client is absent we
// skip the copy steps and only write config.json with the /_vercel exclusion that
// keeps Vercel Analytics / Speed Insights working.
import { writeFileSync, cpSync, existsSync, mkdirSync } from "fs";

const OUT = ".vercel/output";

if (existsSync("dist/client")) {
  // Legacy path: build wrote to dist/ (older @lovable.dev/vite-tanstack-config).
  mkdirSync(`${OUT}/static`, { recursive: true });
  mkdirSync(`${OUT}/functions/index.func`, { recursive: true });

  cpSync("dist/client", `${OUT}/static`, { recursive: true });
  cpSync("dist/server", `${OUT}/functions/index.func`, { recursive: true });

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

  // config.json routes to / → index.func
  writeFileSync(
    `${OUT}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          { handle: "filesystem" },
          { src: "^(?!/_vercel)/(.*)$", dest: "/" },
        ],
      },
      null,
      2,
    ),
  );

  console.log("✓ .vercel/output structure created from dist/");
} else {
  // Nitro's vercel preset already populated .vercel/output/ (new default).
  // Just write config.json so the /_vercel/* exclusion is in place for
  // Vercel Analytics and Speed Insights, routing everything else to __server.func.
  writeFileSync(
    `${OUT}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          { handle: "filesystem" },
          { src: "^(?!/_vercel)/(.*)$", dest: "/__server" },
        ],
      },
      null,
      2,
    ),
  );

  console.log("✓ .vercel/output already populated by Nitro; config.json written");
}
