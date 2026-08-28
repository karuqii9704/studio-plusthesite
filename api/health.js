import { isAiConfigured } from "../server/ai.js";

/** Wiring check: confirms the function runs and whether the Gemini key landed. */
export default function handler(_request, response) {
    response.status(200).json({ ok: true, ai: isAiConfigured() });
}
