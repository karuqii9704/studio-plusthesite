import { motion } from "framer-motion";
import { LOCALES, useI18n, type Locale } from "@/i18n/I18nProvider";

/**
 * ID / EN switch.
 *
 * A two-slot track with the active label carried by a sliding pill, so the
 * current language is legible at a glance without a dropdown.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
    const { locale, setLocale } = useI18n();

    return (
        <div
            role="group"
            aria-label="Language"
            className={`relative flex items-center rounded-full p-0.5 ${className}`}
        >
            {LOCALES.map((code: Locale) => {
                const active = code === locale;
                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => setLocale(code)}
                        aria-pressed={active}
                        className={`relative z-10 rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                            active ? "text-primary-foreground" : "text-muted hover:text-foreground"
                        }`}
                    >
                        {active && (
                            <motion.span
                                layoutId="lang-pill"
                                className="absolute inset-0 -z-10 rounded-full bg-foreground"
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                        )}
                        {code}
                    </button>
                );
            })}
        </div>
    );
}
