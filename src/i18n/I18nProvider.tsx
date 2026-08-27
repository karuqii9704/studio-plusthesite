import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export const LOCALES = ["id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "id";

const STORAGE_KEY = "plus-studio-locale";

function isLocale(value: string | null | undefined): value is Locale {
    return !!value && (LOCALES as readonly string[]).includes(value);
}

/**
 * Resolve the starting locale from, in order: an explicit `?lang=` (how the
 * marketing site hands off), a previous choice, then the browser language.
 */
function detectLocale(): Locale {
    if (typeof window === "undefined") return DEFAULT_LOCALE;

    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    if (isLocale(fromQuery)) return fromQuery;

    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (isLocale(stored)) return stored;
    } catch {
        /* private mode - fall through to the browser language */
    }

    return window.navigator.language.toLowerCase().startsWith("en") ? "en" : DEFAULT_LOCALE;
}

interface I18nContextValue {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(detectLocale);

    const setLocale = useCallback((next: Locale) => {
        setLocaleState(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            /* nothing to persist to - the in-memory choice still applies */
        }
        document.documentElement.lang = next;
    }, []);

    const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
    return ctx;
}

/** Convenience: returns just the active locale. */
export function useLocale(): Locale {
    return useI18n().locale;
}
