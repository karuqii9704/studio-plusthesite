import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const LETTERS = "Studio".split("");

/**
 * The word "Studio", treated as part of the mark rather than as body text.
 *
 * Set in Fraunces italic with the WONK axis on, so the terminals splay and the
 * word carries the same drawn quality as the plus. logo beside it. Letters
 * arrive one at a time and a hairline rule draws underneath - the name being
 * signed, not typed.
 */
export function StudioWord({
    className = "",
    rule = true,
}: {
    className?: string;
    /** The rule under the word. Off for tight spots like the navbar. */
    rule?: boolean;
}) {
    const reduced = useReducedMotion();

    return (
        <motion.span
            className={`relative inline-block whitespace-nowrap ${className}`}
            style={{
                fontFamily: '"Fraunces Variable", Fraunces, Georgia, serif',
                fontStyle: "italic",
                fontVariationSettings: '"WONK" 1, "SOFT" 4, "opsz" 96',
                fontWeight: 500,
                letterSpacing: "-0.015em",
                paddingRight: "0.06em",
            }}
            initial={reduced ? false : "hidden"}
            whileInView="shown"
            viewport={{ once: true, margin: "-60px" }}
            aria-label="Studio"
        >
            {LETTERS.map((letter, index) => (
                <motion.span
                    key={index}
                    aria-hidden="true"
                    className="inline-block"
                    variants={{
                        hidden: { opacity: 0, y: "0.32em", rotate: -4 },
                        shown: { opacity: 1, y: 0, rotate: 0 },
                    }}
                    transition={{
                        duration: 0.65,
                        delay: 0.06 * index,
                        ease: EASE,
                    }}
                >
                    {letter}
                </motion.span>
            ))}

            {rule && (
                <motion.span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-[0.06em] block h-px origin-left"
                    style={{ background: "currentColor", opacity: 0.35 }}
                    variants={{
                        hidden: { scaleX: 0 },
                        shown: { scaleX: 1 },
                    }}
                    transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
                />
            )}
        </motion.span>
    );
}

/**
 * The small "STUDIO" tag that rides beside the logo in the navbar.
 *
 * Wide-tracked caps in the display face, revealed letter by letter so the
 * lockup assembles alongside the wordmark rather than appearing whole.
 */
export function StudioTag({ className = "" }: { className?: string }) {
    const reduced = useReducedMotion();

    return (
        <motion.span
            className={`inline-flex ${className}`}
            style={{
                fontFamily: '"Bricolage Grotesque Variable", ui-sans-serif, sans-serif',
                fontVariationSettings: '"wdth" 90, "opsz" 12',
            }}
            initial={reduced ? false : "hidden"}
            animate="shown"
            aria-label="Studio"
        >
            {"STUDIO".split("").map((letter, index) => (
                <motion.span
                    key={index}
                    aria-hidden="true"
                    variants={{
                        hidden: { opacity: 0, y: 4 },
                        shown: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.45, delay: 0.5 + index * 0.05, ease: EASE }}
                >
                    {letter}
                </motion.span>
            ))}
        </motion.span>
    );
}
