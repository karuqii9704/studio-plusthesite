/**
 * Studio API + static host.
 *
 * The Gemini key must never reach the browser, so the SPA calls /api/ai here
 * and this process talks to Google. In production the same process also serves
 * the built SPA from dist/, which is all a single VPS needs:
 *
 *   npm run build && GEMINI_API_KEY=... node server/index.js
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import compression from "compression";
import { GoogleGenAI } from "@google/genai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "..", "dist");
const PORT = Number(process.env.PORT ?? 8787);

const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const TEXT_MODEL = "gemini-2.0-flash";
const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";

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

/**
 * Fixed-window limiter, in memory. Enough for a single-process VPS; move to
 * Redis the day this runs on more than one node.
 */
const HITS = new Map();
function overLimit(key, limit, windowMs) {
    const now = Date.now();
    const entry = HITS.get(key);
    if (!entry || now > entry.resetAt) {
        HITS.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }
    entry.count += 1;
    return entry.count > limit;
}

// Keep the map from growing without bound on a long-lived process.
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of HITS) if (now > entry.resetAt) HITS.delete(key);
}, 60_000).unref();

function clientIp(req) {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0].trim();
    }
    return req.socket.remoteAddress ?? "unknown";
}

let genAI;
function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server.");
    genAI ??= new GoogleGenAI({ apiKey });
    return genAI;
}

app.get("/api/health", (_req, res) => {
    res.json({ ok: true, ai: Boolean(process.env.GEMINI_API_KEY) });
});

app.post("/api/ai", async (req, res) => {
    if (overLimit(`ai:${clientIp(req)}`, 10, 60_000)) {
        return res
            .status(429)
            .json({ error: "Too many requests. Please try again later." });
    }

    const { action, prompt, schema } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const ai = getGenAI();

        if (action === "structured") {
            if (!schema) {
                return res
                    .status(400)
                    .json({ error: "Schema is required for structured action" });
            }
            const response = await ai.models.generateContent({
                model: TEXT_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema,
                    temperature: 0.7,
                },
            });
            const text = response.text;
            if (!text) {
                return res.status(500).json({ error: "No text returned from Gemini" });
            }
            try {
                return res.json({ result: JSON.parse(text) });
            } catch {
                return res.status(500).json({ error: "Gemini returned malformed JSON" });
            }
        }

        if (action === "text") {
            const response = await ai.models.generateContent({
                model: TEXT_MODEL,
                contents: prompt,
            });
            return res.json({ result: response.text || "" });
        }

        if (action === "image") {
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: prompt,
                config: { responseModalities: ["TEXT", "IMAGE"] },
            });
            for (const part of response.candidates?.[0]?.content?.parts ?? []) {
                if (part.inlineData?.data) {
                    return res.json({
                        result: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                    });
                }
            }
            return res.status(500).json({ error: "No image generated from Gemini" });
        }

        return res.status(400).json({ error: "Invalid action" });
    } catch (error) {
        console.error("AI proxy error:", error);
        const message =
            error instanceof Error ? error.message : "Internal Server Error";
        return res.status(500).json({ error: message });
    }
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
