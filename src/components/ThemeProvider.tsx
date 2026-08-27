import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "plus-studio-theme";

/**
 * Minimal stand-in for next-themes: one class on <html>, one localStorage key.
 * The palette is monochrome in both directions, so light mode is the exact
 * inverse rather than a separate design.
 */
interface ThemeContextValue {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(): Theme {
    if (typeof window === "undefined") return "dark";
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "light" || stored === "dark") return stored;
    } catch {
        /* private mode - fall back to the default */
    }
    return "dark";
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(readStoredTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        root.style.colorScheme = theme;
        try {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            /* nothing to persist to - the in-memory choice still applies */
        }
    }, [theme]);

    const setTheme = useCallback((next: Theme) => setThemeState(next), []);
    const toggleTheme = useCallback(
        () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
        [],
    );

    const value = useMemo(
        () => ({ theme, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme],
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
    return ctx;
}
