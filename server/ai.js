import { GoogleGenAI } from "@google/genai";

/**
 * The Gemini proxy, independent of how it is being hosted.
 *
 * The studio can run two ways - one Express process on a VPS, or Vercel's
 * serverless functions - and both need exactly this logic. Keeping it here
 * means the two entry points stay thin adapters instead of two copies that
 * drift apart.
 *
 * Returns `{ status, body }` rather than touching a response object, so the
 * caller owns the transport.
 */

const TEXT_MODEL = "gemini-2.0-flash";
const IMAGE_MODEL = "gemini-2.0-flash-preview-image-generation";

let client;

function getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server.");
    client ??= new GoogleGenAI({ apiKey });
    return client;
}

export const isAiConfigured = () => Boolean(process.env.GEMINI_API_KEY);

export async function runAi({ action, prompt, schema } = {}) {
    if (!prompt) return { status: 400, body: { error: "Prompt is required" } };

    try {
        const ai = getClient();

        if (action === "structured") {
            if (!schema) {
                return {
                    status: 400,
                    body: { error: "Schema is required for structured action" },
                };
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
                return { status: 500, body: { error: "No text returned from Gemini" } };
            }
            try {
                return { status: 200, body: { result: JSON.parse(text) } };
            } catch {
                return { status: 500, body: { error: "Gemini returned malformed JSON" } };
            }
        }

        if (action === "text") {
            const response = await ai.models.generateContent({
                model: TEXT_MODEL,
                contents: prompt,
            });
            return { status: 200, body: { result: response.text || "" } };
        }

        if (action === "image") {
            const response = await ai.models.generateContent({
                model: IMAGE_MODEL,
                contents: prompt,
                config: { responseModalities: ["TEXT", "IMAGE"] },
            });
            for (const part of response.candidates?.[0]?.content?.parts ?? []) {
                if (part.inlineData?.data) {
                    return {
                        status: 200,
                        body: {
                            result: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
                        },
                    };
                }
            }
            return { status: 500, body: { error: "No image generated from Gemini" } };
        }

        return { status: 400, body: { error: "Invalid action" } };
    } catch (error) {
        console.error("AI proxy error:", error);
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return { status: 500, body: { error: message } };
    }
}

/**
 * Fixed-window limiter, in memory.
 *
 * Good enough for a single long-lived process. On serverless it only limits
 * within one warm instance, which is a speed bump rather than a control - see
 * the note in the README.
 */
const HITS = new Map();

export function overLimit(key, limit, windowMs) {
    const now = Date.now();
    const entry = HITS.get(key);

    if (!entry || now > entry.resetAt) {
        HITS.set(key, { count: 1, resetAt: now + windowMs });
        return false;
    }

    entry.count += 1;

    // Opportunistic sweep so the map cannot grow without bound.
    if (HITS.size > 500) {
        for (const [k, v] of HITS) if (now > v.resetAt) HITS.delete(k);
    }

    return entry.count > limit;
}

export function clientIp(headers, fallback = "unknown") {
    const forwarded = headers?.["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
        return forwarded.split(",")[0].trim();
    }
    return fallback;
}
