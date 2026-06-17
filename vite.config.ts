// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Force-enable Nitro outside of Lovable (e.g. Vercel CI).
  // NITRO_PRESET env var switches the deployment target:
  //   unset  → cloudflare (Lovable's default)
  //   vercel → Vercel serverless (set NITRO_PRESET=vercel in Vercel project env vars)
  nitro: { preset: process.env.NITRO_PRESET || "cloudflare" },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Only split packages that have NO React dependency so Rollup never
          // has to wire live bindings across a React-adjacent circular reference.
          // The supabase client is framework-agnostic; everything else (react,
          // tanstack, radix, lucide, ui libs) stays in the main chunks together.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("@supabase")) return "supabase";
          },
        },
      },
    },
  },
});
