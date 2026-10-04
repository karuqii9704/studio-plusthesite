import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Auth plumbing for the landing path.
 *
 * `lib/supabase` builds the client the moment it is imported, and the client
 * drags in the auth, postgrest, realtime, and storage SDKs - 217 kB that a
 * visitor who never signs in has no use for. So the client is imported on
 * demand, and the only thing the landing runs at startup is the cheap question
 * of whether there could be a session to restore at all.
 *
 * Both signals mirror what gotrue-js itself reads:
 *  - it keeps the session in localStorage under `sb-<project-ref>-auth-token`,
 *    so a key of that shape means "restore me";
 *  - an OAuth return carries tokens in the hash (implicit) or a `code` in the
 *    query (PKCE), and the client parses them as it is constructed.
 *
 * If supabase-js ever renames that storage key, the failure is soft: a
 * signed-in visitor sees the landing page instead of the workspace and signs
 * in again. A missed URL signal would instead break the OAuth return with no
 * way back, so that check is deliberately loose.
 */
export function hasSessionToRestore(): boolean {
    return urlCarriesAuthPayload() || hasStoredAuthToken();
}

function hasStoredAuthToken(): boolean {
    try {
        for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key?.startsWith("sb-") && key.includes("-auth-token")) return true;
        }
    } catch {
        // Storage throws when it is blocked (private mode, sandboxed frame).
        // Treat that as "no session" and let the visitor sign in again.
    }
    return false;
}

function urlCarriesAuthPayload(): boolean {
    const hash = window.location.hash.replace(/^#/, "");
    const fromHash = new URLSearchParams(hash);
    return (
        fromHash.has("access_token") ||
        fromHash.has("refresh_token") ||
        fromHash.has("error_description") ||
        new URLSearchParams(window.location.search).has("code")
    );
}

let clientPromise: Promise<SupabaseClient | null> | null = null;

/** The Supabase client, loaded on first need rather than on first paint. */
export function loadSupabase(): Promise<SupabaseClient | null> {
    clientPromise ??= import("@/lib/supabase").then((module) => module.supabase);
    return clientPromise;
}
