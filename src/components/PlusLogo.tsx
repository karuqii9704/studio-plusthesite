import { motion, useReducedMotion, type Transition } from "framer-motion";
import { useId } from "react";
import { GLYPHS, LOGO_VIEW_BOX, MARK_D, MARK_VIEW_BOX } from "@/lib/logoPaths";

/**
 * The plus. mark and wordmark.
 *
 * The mark is a plus sign, which means a quarter turn lands it back on itself -
 * so every idle and hover state here is built on 90-degree rotation. Nothing
 * ever settles anywhere the mark cannot legitimately sit.
 *
 * Three surfaces:
 *   PlusMark      the symbol alone, for icons and stage furniture
 *   PlusWordmark  the full "plus." lockup, for the navbar and footer
 *   PlusWord      an inline swap for the word "plus" inside a sentence
 */

const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1];

type MarkMotion = "idle" | "hover" | "static";

export function PlusMark({
    className = "",
    behaviour = "idle",
}: {
    className?: string;
    /** `idle` breathes on a long loop, `hover` waits for the pointer. */
    behaviour?: MarkMotion;
    }) {
    const reduced = useReducedMotion();
    const animate =
        reduced || behaviour === "static"
            ? undefined
            : behaviour === "idle"
              ? { rotate: [0, 90, 90, 180, 180, 270, 270, 360] }
              : undefined;

    return (
        <motion.svg
            viewBox={MARK_VIEW_BOX}
            role="img"
            aria-label="plus."
            className={className}
            animate={animate}
            whileHover={reduced ? undefined : { rotate: 90, scale: 1.06 }}
            transition={
                behaviour === "idle"
                    ? { duration: 24, times: [0, 0.12, 0.37, 0.49, 0.74, 0.86, 0.99, 1], repeat: Infinity, ease: "easeInOut" }
                    : { duration: 0.55, ease: EASE_OUT }
            }
            style={{ transformOrigin: "50% 50%" }}
        >
            <path d={MARK_D} fill="currentColor" />
        </motion.svg>
    );
}

/**
 * The full lockup.
 *
 * On first paint the mark draws its outline, fills, and the glyphs rise behind
 * it with a stagger - the wordmark assembling itself rather than fading in.
 */
export function PlusWordmark({
    className = "",
    withDot = true,
    animateOnMount = true,
    href,
    label = "plus. studio",
}: {
    className?: string;
    withDot?: boolean;
    animateOnMount?: boolean;
    href?: string;
    label?: string;
}) {
    const reduced = useReducedMotion();
    const id = useId();
    const play = animateOnMount && !reduced;
    const glyphs = withDot ? GLYPHS : GLYPHS.filter((g) => g.name !== "dot");

    const svg = (
        <motion.svg
            viewBox={LOGO_VIEW_BOX}
            role="img"
            aria-label={label}
            className={className}
            initial={play ? "hidden" : false}
            animate="shown"
            whileHover="lifted"
        >
            <motion.g
                variants={{
                    hidden: { opacity: 0, rotate: -90, scale: 0.7 },
                    shown: { opacity: 1, rotate: 0, scale: 1 },
                    lifted: { rotate: 90 },
                }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
                style={{ transformOrigin: "58px 176px" }}
            >
                <motion.path
                    key={`${id}-mark`}
                    d={MARK_D}
                    fill="currentColor"
                    variants={{
                        hidden: { fillOpacity: 0 },
                        shown: { fillOpacity: 1 },
                    }}
                    transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
                />
            </motion.g>

            {glyphs.map((glyph, index) => (
                <motion.path
                    key={glyph.name}
                    d={glyph.d}
                    fill="currentColor"
                    variants={{
                        hidden: { opacity: 0, y: 26 },
                        shown: { opacity: 1, y: 0 },
                    }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2 + index * 0.07,
                        ease: EASE_OUT,
                    }}
                />
            ))}
        </motion.svg>
    );

    if (!href) return svg;

    return (
        <a href={href} aria-label={label} className="inline-flex items-center">
            {svg}
        </a>
    );
}

/**
 * Inline swap for the word "plus" in running text.
 *
 * Sized in `em` and nudged onto the baseline so it behaves like a word: it
 * inherits colour, scales with its sentence, and wraps like any other token.
 * It draws itself once when scrolled into view and takes a quarter turn on
 * hover - motion that reads as a mark being set, not a spinning icon.
 */
export function PlusWord({
    className = "",
    withDot = false,
}: {
    className?: string;
    withDot?: boolean;
}) {
    const reduced = useReducedMotion();
    const glyphs = withDot ? GLYPHS : GLYPHS.filter((g) => g.name !== "dot");
    const width = withDot ? 668 : 560;

    return (
        <motion.svg
            viewBox={`0 0 ${width} 292`}
            role="img"
            aria-label="plus"
            className={`inline-block align-baseline ${className}`}
            style={{
                height: "0.86em",
                width: "auto",
                verticalAlign: "-0.17em",
                marginInline: "0.04em",
            }}
            initial={reduced ? false : "hidden"}
            whileInView="shown"
            whileHover={reduced ? undefined : "lifted"}
            viewport={{ once: true, margin: "-40px" }}
        >
            <motion.g
                variants={{
                    hidden: { opacity: 0, rotate: -90, scale: 0.6 },
                    shown: { opacity: 1, rotate: 0, scale: 1 },
                    lifted: { rotate: 90 },
                }}
                transition={{ duration: 0.7, ease: EASE_OUT }}
                style={{ transformOrigin: "58px 176px" }}
            >
                <path d={MARK_D} fill="currentColor" />
            </motion.g>

            {glyphs.map((glyph, index) => (
                <motion.path
                    key={glyph.name}
                    d={glyph.d}
                    fill="currentColor"
                    variants={{
                        hidden: { opacity: 0, y: 22 },
                        shown: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, delay: 0.12 + index * 0.06, ease: EASE_OUT }}
                />
            ))}
        </motion.svg>
    );
}
