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
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            // react-dom and react share internal circular imports in React 19 —
            // keeping them in the same chunk eliminates that cycle.
            if (id.includes("react-dom") || id.includes("react") || id.includes("scheduler"))
              return "react";
            if (id.includes("@tanstack")) return "tanstack";
            if (id.includes("@radix-ui")) return "radix";
            if (id.includes("@supabase")) return "supabase";
            // lucide-react in its own chunk prevents it from participating in the
            // vendor↔react cycle that caused "Cannot set properties of undefined
            // (setting 'Activity')" at runtime.
            if (id.includes("lucide-react")) return "lucide";
            // React UI component libraries go in a separate "ui" chunk so the
            // pure-JS "vendor" chunk has no React dependency, fully eliminating
            // any remaining vendor↔react circular chunk cycles.
            if (
              id.includes("recharts") ||
              id.includes("cmdk") ||
              id.includes("embla-carousel") ||
              id.includes("react-hook-form") ||
              id.includes("sonner") ||
              id.includes("vaul") ||
              id.includes("react-day-picker") ||
              id.includes("react-resizable-panels") ||
              id.includes("input-otp")
            )
              return "ui";
            return "vendor";
          },
        },
      },
    },
  },
});
