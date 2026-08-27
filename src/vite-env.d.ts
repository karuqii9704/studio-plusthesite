/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SUPABASE_URL?: string;
    readonly VITE_SUPABASE_ANON_KEY?: string;
    readonly VITE_MAIN_SITE_URL?: string;
    readonly VITE_HERO_VIDEO?: string;
    readonly VITE_MISSION_VIDEO?: string;
    readonly VITE_SOLUTION_VIDEO?: string;
    readonly VITE_CTA_STREAM?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
