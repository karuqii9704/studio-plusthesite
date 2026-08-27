import { motion } from "framer-motion";
import type { ComponentType } from "react";
import { fadeUp } from "../motion";
import type { LandingCopy } from "../copy";

type MarkProps = { className?: string };

/**
 * Abstract monochrome marks, drawn here rather than pulled in as brand assets.
 * They read as "answer engine" without borrowing anyone trademarked logo.
 */
function KnotMark({ className = "" }: MarkProps) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M50 14 L81 32 L81 68 L50 86 L19 68 L19 32 Z" />
                <path d="M50 30 L67 40 L67 60 L50 70 L33 60 L33 40 Z" opacity="0.55" />
                <path d="M19 32 L50 50 L81 32" opacity="0.35" />
                <path d="M50 50 L50 86" opacity="0.35" />
            </g>
        </svg>
    );
}

function OrbitMark({ className = "" }: MarkProps) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="50" cy="50" r="34" />
                <circle cx="50" cy="50" r="18" opacity="0.55" />
                <path d="M50 16 L50 84" opacity="0.35" />
                <path d="M16 50 L84 50" opacity="0.35" />
                <path d="M28 28 L72 72" opacity="0.2" />
            </g>
        </svg>
    );
}

function SparkMark({ className = "" }: MarkProps) {
    return (
        <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M50 12 C54 38 62 46 88 50 C62 54 54 62 50 88 C46 62 38 54 12 50 C38 46 46 38 50 12 Z" />
                <circle cx="50" cy="50" r="30" opacity="0.25" />
            </g>
        </svg>
    );
}

const MARKS: ComponentType<MarkProps>[] = [KnotMark, OrbitMark, SparkMark];

export function LandingShift({ copy }: { copy: LandingCopy }) {
    return (
        <section id="shift" className="px-6 pb-6 pt-52 md:px-28 md:pb-9 md:pt-64">
            <div className="mx-auto max-w-5xl text-center">
                <motion.h2
                    {...fadeUp(0)}
                    className="text-5xl font-medium tracking-[-2px] md:text-7xl lg:text-8xl"
                >
                    {copy.shift.headingBefore}
                    <span className="font-serif font-normal italic">
                        {copy.shift.headingAccent}
                    </span>
                </motion.h2>

                <motion.p
                    {...fadeUp(0.1)}
                    className="mx-auto mt-6 mb-24 max-w-2xl text-lg text-muted"
                >
                    {copy.shift.subtitle}
                </motion.p>

                <div className="mb-20 grid gap-12 md:grid-cols-3 md:gap-8">
                    {copy.shift.platforms.map((platform, index) => {
                        const Mark = MARKS[index] ?? MARKS[0];
                        return (
                            <motion.article
                                key={platform.name}
                                {...fadeUp(0.1 * index)}
                                className="flex flex-col items-center"
                            >
                                <Mark className="h-40 w-40 text-foreground/80 md:h-48 md:w-48" />
                                <h3 className="mt-2 text-base font-semibold">
                                    {platform.name}
                                </h3>
                                <p className="mt-3 max-w-xs text-sm text-muted">
                                    {platform.body}
                                </p>
                            </motion.article>
                        );
                    })}
                </div>

                <motion.p {...fadeUp(0.2)} className="text-center text-sm text-muted">
                    {copy.shift.tagline}
                </motion.p>
            </div>
        </section>
    );
}
