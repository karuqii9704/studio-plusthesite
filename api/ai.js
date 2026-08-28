import { clientIp, overLimit, runAi } from "../server/ai.js";

/**
 * Vercel serverless entry for the Gemini proxy.
 *
 * A thin adapter: the logic lives in server/ai.js so the VPS Express process
 * and this function cannot drift apart. Same contract either way - POST
 * { action, prompt, schema? } and get { result } or { error }.
 */
export default async function handler(request, response) {
    if (request.method === "OPTIONS") return response.status(204).end();
    if (request.method !== "POST") {
        return response.status(405).json({ error: "Method not allowed" });
    }

    const ip = clientIp(request.headers, request.socket?.remoteAddress);
    if (overLimit(`ai:${ip}`, 10, 60_000)) {
        return response
            .status(429)
            .json({ error: "Too many requests. Please try again later." });
    }

    // Vercel parses JSON bodies, but a string body still arrives on some paths.
    const payload =
        typeof request.body === "string" ? safeParse(request.body) : (request.body ?? {});

    const { status, body } = await runAi(payload);
    return response.status(status).json(body);
}

function safeParse(text) {
    try {
        return JSON.parse(text);
    } catch {
        return {};
    }
}
