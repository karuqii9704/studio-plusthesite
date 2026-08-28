/**
 * Studio API + static host, for the VPS.
 *
 * One process serves both the built SPA and /api/ai, which is all a single box
 * needs. The Gemini logic itself lives in ./ai.js, shared with the Vercel
 * serverless entry in /api so the two hosts cannot drift apart.
 *
 *   npm run build && GEMINI_API_KEY=... node server/index.js
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import compression from "compression";
import { clientIp, isAiConfigured, overLimit, runAi } from "./ai.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const PORT = Number(process.env.PORT ?? 8787);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const app = express();
app.disable("x-powered-by");
app.use(compression());
app.use(express.json({ limit: "1mb" }));

/**
 * Same-origin in production means no CORS header is needed at all. The list is
 * only there for split deploys (SPA on a CDN, API on the VPS).
 */
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Vary", "Origin");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    }
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
});

app.get("/api/health", (_req, res) => {
    res.json({ ok: true, ai: isAiConfigured() });
});

app.post("/api/ai", async (req, res) => {
    const ip = clientIp(req.headers, req.socket.remoteAddress);
    if (overLimit(`ai:${ip}`, 10, 60_000)) {
        return res
            .status(429)
            .json({ error: "Too many requests. Please try again later." });
    }

    const { status, body } = await runAi(req.body ?? {});
    return res.status(status).json(body);
});

// Serve the built SPA when it exists, with a history fallback for deep links.
let hasDist = true;
try {
    await readFile(path.join(DIST, "index.html"));
} catch {
    hasDist = false;
    console.warn("dist/ not found - running as an API-only server.");
}

if (hasDist) {
    app.use(
        express.static(DIST, {
            setHeaders(res, filePath) {
                // Hashed assets are immutable; index.html must never be cached.
                if (filePath.includes(`${path.sep}assets${path.sep}`)) {
                    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
                }
            },
        }),
    );
    app.get(/^\/(?!api\/).*/, (_req, res) => {
        res.sendFile(path.join(DIST, "index.html"));
    });
}

createServer(app).listen(PORT, () => {
    console.log(`studio server listening on http://localhost:${PORT}`);
});
