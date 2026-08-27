import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

/**
 * Light/dark switch.
 *
 * The two icons cross-fade through a quarter turn rather than swapping, so the
 * control reads as one object changing state instead of two buttons.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const reduced = useReducedMotion();
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`relative grid h-8 w-8 place-items-center overflow-hidden rounded-full text-muted transition-colors hover:text-foreground ${className}`}
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={reduced ? false : { opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduced ? undefined : { opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute grid place-items-center"
                >
                    {isDark ? <Sun size={15} /> : <Moon size={15} />}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
