import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

const isConfigured =
    supabaseUrl.startsWith("https://") && supabaseAnonKey.length > 0;

/**
 * Browser Supabase client. Stays `null` when env vars are absent so the app
 * still builds and renders - auth-backed features degrade instead of crashing.
 */
export const supabase: SupabaseClient | null = isConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => isConfigured;
