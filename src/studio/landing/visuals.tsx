import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Authored stage furniture.
 *
 * Everything the landing page shows is drawn here rather than streamed from a
 * CDN: it themes cleanly with light and dark, weighs a few kilobytes instead of
 * megabytes, and there is no third-party host to go dark on launch day.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────────────────────────────────────────────────────────────────────────
 * Stage
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * The lighting rig behind the hero: a warm key from the upper left, a cool fill
 * from the lower right, a faint set grid, and grain over the whole thing. The
 * two lights breathe out of phase so the field never sits perfectly still.
 */
export function StageBackdrop({ className = "" }: { className?: string }) {
    return (
        <div className={`grain pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
            <div
                className="absolute inset-0 opacity-[0.55]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, var(--hairline) 1px, transparent 1px), linear-gradient(to bottom, var(--hairline) 1px, transparent 1px)",
                    backgroundSize: "72px 72px",
                    maskImage:
                        "radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 78%)",
                }}
            />

            <div
                className="light-key absolute -left-[14%] -top-[26%] h-[78vh] w-[62vw] rounded-full blur-[110px]"
                style={{ background: "var(--key-light-soft)" }}
            />
            <div
                className="light-fill absolute -bottom-[28%] -right-[12%] h-[70vh] w-[56vw] rounded-full blur-[120px]"
                style={{ background: "var(--fill-light-soft)" }}
            />
            <div
                className="absolute left-1/2 top-[-30%] h-[80vh] w-[46vw] -translate-x-1/2 blur-[90px]"
                style={{ background: "var(--stage-glow)" }}
            />

            {/* Vignette, so the frame edges fall away like a lens. */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 90% 70% at 50% 45%, transparent 40%, var(--background) 100%)",
                }}
            />
        </div>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
 * Contact sheet
 * ─────────────────────────────────────────────────────────────────────────── */

const FRAME_TINTS = [
    "var(--key-light)",
    "var(--primary)",
    "var(--fill-light)",
    "var(--tertiary)",
    "var(--key-light)",
    "var(--primary)",
];

function Frame({ tint, index }: { tint: string; index: number }) {
    return (
        <div className="relative h-full w-[186px] shrink-0 overflow-hidden rounded-[3px] bg-surface">
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(120% 100% at ${20 + index * 11}% 18%, ${tint} 0%, transparent 62%), linear-gradient(155deg, var(--elevated) 0%, var(--surface) 100%)`,
                    opacity: 0.85,
                }}
            />
            <div className="grain absolute inset-0" />
            <span className="absolute bottom-2 left-2.5 text-[9px] font-semibold tracking-[0.2em] text-muted-light">
                {String(index + 1).padStart(2, "0")}
            </span>
        </div>
    );
}

/**
 * A strip of film crawling past the viewport.
 *
 * The frames are duplicated once and the track translates exactly one set
 * width, so the loop closes on itself with no visible seam.
 */
export function ContactSheet({ className = "" }: { className?: string }) {
    const reduced = useReducedMotion();
    const frames = [...FRAME_TINTS, ...FRAME_TINTS];

    const sprockets: CSSProperties = {
        backgroundImage:
            "repeating-linear-gradient(to right, var(--border) 0 12px, transparent 12px 34px)",
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl bg-card-bg hairline ${className}`}
            aria-hidden="true"
        >
            <div className="h-3.5 w-full opacity-70" style={sprockets} />

            <motion.div
                className="flex h-[calc(100%-1.75rem)] gap-1.5 px-1.5"
                animate={reduced ? undefined : { x: ["0%", "-50%"] }}
                transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
                style={{ width: "200%" }}
            >
                {frames.map((tint, index) => (
                    <Frame key={index} tint={tint} index={index % FRAME_TINTS.length} />
                ))}
            </motion.div>

            <div className="h-3.5 w-full opacity-70" style={sprockets} />

            {/* Fade the ends so the strip runs off the edges rather than stopping. */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
    );
}

/* ───────────────────────────────────────────────────────────────────────────
 * Tool marks
 *
 * One per capability, each drawn from the same 64-unit grid and 1.4 stroke so
 * the set reads as a family. Motion is on hover only - a wall of looping icons
 * is noise, not craft.
 * ─────────────────────────────────────────────────────────────────────────── */

type MarkProps = { className?: string };

const markShell =
    "h-full w-full stroke-current [stroke-linecap:round] [stroke-linejoin:round]";

export function PaletteMark({ className = "" }: MarkProps) {
    return (
        <motion.svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
            <motion.g
                className={markShell}
                strokeWidth="1.4"
                variants={{ rest: { rotate: 0 }, hover: { rotate: -8 } }}
                transition={{ duration: 0.6, ease: EASE }}
                style={{ transformOrigin: "32px 32px" }}
            >
                <path d="M32 6c14.4 0 26 9.8 26 21.9 0 7.4-5.6 11.6-12.2 11.6h-4.6c-3.5 0-6.2 2.6-6.2 5.9 0 1.6.7 2.9 1.5 4 .8 1.2 1.5 2.4 1.5 3.9 0 3.1-2.6 4.8-6 4.8C17.6 58 6 46.4 6 32S17.6 6 32 6Z" />
            </motion.g>
            {[
                { cx: 21, cy: 24, fill: "var(--key-light)" },
                { cx: 31, cy: 17, fill: "var(--primary)" },
                { cx: 42, cy: 20, fill: "var(--fill-light)" },
                { cx: 19, cy: 38, fill: "var(--tertiary)" },
            ].map((dot, index) => (
                <motion.circle
                    key={index}
                    cx={dot.cx}
                    cy={dot.cy}
                    r="3.4"
                    fill={dot.fill}
                    variants={{ rest: { scale: 1, opacity: 0.85 }, hover: { scale: 1.22, opacity: 1 } }}
                    transition={{ duration: 0.4, ease: EASE, delay: index * 0.05 }}
                    style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
                />
            ))}
        </motion.svg>
    );
}

export function LensMark({ className = "" }: MarkProps) {
    return (
        <motion.svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
            <g className={markShell} strokeWidth="1.4">
                <circle cx="32" cy="32" r="25" />
                <motion.g
                    variants={{ rest: { rotate: 0 }, hover: { rotate: 60 } }}
                    transition={{ duration: 0.8, ease: EASE }}
                    style={{ transformOrigin: "32px 32px" }}
                >
                    <circle cx="32" cy="32" r="15" />
                    <path d="M32 17v15l13 7.5M32 32 19 39.5M32 32l-6-13.6" />
                </motion.g>
            </g>
            <motion.circle
                cx="32"
                cy="32"
                r="7"
                fill="var(--primary)"
                variants={{ rest: { opacity: 0.18 }, hover: { opacity: 0.42 } }}
                transition={{ duration: 0.4 }}
            />
        </motion.svg>
    );
}

export function FilmMark({ className = "" }: MarkProps) {
    return (
        <motion.svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
            <g className={markShell} strokeWidth="1.4">
                <rect x="6" y="14" width="52" height="36" rx="4" />
                <path d="M6 22h52M6 42h52" />
            </g>
            <motion.g
                variants={{ rest: { x: 0 }, hover: { x: -6 } }}
                transition={{ duration: 0.6, ease: EASE }}
            >
                {[12, 22, 32, 42, 52].map((x) => (
                    <rect key={x} x={x - 2.4} y="16.4" width="4.8" height="3.6" rx="1" fill="currentColor" opacity="0.4" />
                ))}
                {[12, 22, 32, 42, 52].map((x) => (
                    <rect key={`b-${x}`} x={x - 2.4} y="44" width="4.8" height="3.6" rx="1" fill="currentColor" opacity="0.4" />
                ))}
            </motion.g>
            <motion.rect
                x="22" y="26" width="20" height="12" rx="2"
                fill="var(--fill-light)"
                variants={{ rest: { opacity: 0.2 }, hover: { opacity: 0.45 } }}
                transition={{ duration: 0.4 }}
            />
        </motion.svg>
    );
}

export function LightMark({ className = "" }: MarkProps) {
    return (
        <motion.svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
            <motion.path
                d="M32 20 8 56h48L32 20Z"
                fill="var(--key-light)"
                variants={{ rest: { opacity: 0.14 }, hover: { opacity: 0.34 } }}
                transition={{ duration: 0.5 }}
            />
            <g className={markShell} strokeWidth="1.4">
                <motion.g
                    variants={{ rest: { rotate: 0 }, hover: { rotate: -10 } }}
                    transition={{ duration: 0.6, ease: EASE }}
                    style={{ transformOrigin: "32px 14px" }}
                >
                    <rect x="20" y="6" width="24" height="15" rx="3" />
                    <path d="M32 21v3M26 6V3M38 6V3" />
                </motion.g>
                <path d="M32 24 12 56M32 24l20 32" opacity="0.5" />
            </g>
        </motion.svg>
    );
}

export const TOOL_MARKS = {
    palette: PaletteMark,
    lens: LensMark,
    film: FilmMark,
    light: LightMark,
} as const;

export type ToolMarkName = keyof typeof TOOL_MARKS;
