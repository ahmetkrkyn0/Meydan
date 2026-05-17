// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [imagetools()],
    // Leaflet SSR'da window'a dokunuyor; SSR bundler'ından dışla. Sayfa
    // tarafında zaten `mounted` flag ile sadece client'ta mount ediyoruz.
    ssr: {
      external: ["leaflet"],
      noExternal: ["@turf/boolean-point-in-polygon"],
    },
  },
});
