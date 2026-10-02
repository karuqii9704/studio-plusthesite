import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    build: {
        rollupOptions: {
            output: {
                /**
                 * The entry chunk was one 599 kB blob - the app plus every
                 * dependency in it - so a copy tweak invalidated React and a
                 * React bump invalidated the copy. Three named groups carry
                 * what a first paint actually needs; Rollup places the rest.
                 *
                 * Only groups that are always loaded together, because a named
                 * chunk is fetched whole: a "vendor" catch-all for the
                 * leftovers (lucide, genai, iceberg) measured 20 kB heavier on
                 * first load than leaving them to Rollup, which can keep a
                 * module that only a lazy view uses off the landing path.
                 *
                 * Measured with a walk of the static import graph from
                 * dist/index.html: 585 kB before, 584 kB after, in 4 chunks
                 * instead of 1. Same bytes, but only the 52 kB app chunk
                 * changes per deploy - the 532 kB of React, Supabase, and
                 * Motion stay in cache.
                 */
                manualChunks(id: string) {
                    if (!id.includes("node_modules/")) return;
                    // react-dom needs react and scheduler beside it.
                    if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) {
                        return "react";
                    }
                    if (/node_modules\/@supabase\//.test(id)) return "supabase";
                    if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) {
                        return "motion";
                    }
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    server: {
        port: Number(process.env.PORT) || 5173,
        // The Gemini key stays server-side. `npm run dev:api` serves /api here.
        proxy: {
            "/api": {
                target: "http://localhost:8787",
                changeOrigin: true,
            },
        },
    },
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"],
        restoreMocks: true,
    },
});
