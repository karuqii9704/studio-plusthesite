import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [react(), tailwindcss()],
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
});
