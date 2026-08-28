import { motion } from "framer-motion";
import { LOCALES, useI18n, type Locale } from "@/i18n/I18nProvider";

/**
 * ID / EN switch.
 *
 * A two-slot track with the active label carried by a sliding pill, so the
 * current language is legible at a glance without a dropdown.
 *
 * The pill and the label are explicitly stacked inside an isolated button. A
 * negative z-index here does not sit "behind the label" - with no stacking
 * context of its own the pill drops behind the navbar island as well, leaving
 * the active label as white type on a white bar.
 */
export function LanguageToggle({ className = "" }: { className?: string }) {
    const { locale, setLocale } = useI18n();

    return (
        <div
            role="group"
            aria-label="Language"
            className={`flex items-center gap-0.5 ${className}`}
        >
            {LOCALES.map((code: Locale) => {
                const active = code === locale;
                return (
                    <button
                        key={code}
                        type="button"
                        onClick={() => setLocale(code)}
                        aria-pressed={active}
                        className="relative isolate rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wider"
                    >
                        {active && (
                            <motion.span
                                layoutId="lang-pill"
                                className="absolute inset-0 z-0 rounded-full bg-foreground"
                                transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                        )}
                        <span
                            className={`relative z-10 transition-colors ${
                                active
                                    ? "text-primary-foreground"
                                    : "text-muted hover:text-foreground"
                            }`}
                        >
                            {code}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
