import type { Schema } from "@google/genai";

type AiAction = "structured" | "text" | "image";

interface AiRequest {
    action: AiAction;
    prompt: string;
    schema?: Schema;
}

/**
 * Single entry point to the server-side Gemini proxy.
 *
 * The key lives on the server, so every call goes through /api/ai. A proxy that
 * is down answers with an HTML error page rather than JSON, so the failure path
 * reads the body as text first - parsing it blindly is what turns "502 from
 * nginx" into a confusing JSON syntax error.
 */
async function callAi<T>(body: AiRequest): Promise<T | null> {
    try {
        const response = await fetch("/api/ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const raw = await response.text();
        let payload: { result?: unknown; error?: string } = {};
        try {
            payload = raw ? JSON.parse(raw) : {};
        } catch {
            payload = {};
        }

        if (!response.ok) {
            throw new Error(
                payload.error ?? `AI request failed with status ${response.status}`,
            );
        }

        return payload.result as T;
    } catch (error) {
        console.error(`Gemini ${body.action} error (client proxy):`, error);
        return null;
    }
}

export const callGeminiStructured = <T,>(prompt: string, schema: Schema) =>
    callAi<T>({ action: "structured", prompt, schema });

export const callGeminiText = (prompt: string) =>
    callAi<string>({ action: "text", prompt });

export const callGeminiImage = (prompt: string) =>
    callAi<string>({ action: "image", prompt });

/** Save a data URL to disk without a round trip through the server. */
export const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
