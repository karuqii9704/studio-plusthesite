import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { WaveForm } from "../WaveForm";
import type { LandingCopy } from "../copy";

/**
 * One word of the scroll-revealed paragraph.
 *
 * Each word owns its own transform, so the reveal tracks scroll position rather
 * than a timed animation: the reader sets the pace. Highlighted words settle at
 * full contrast, the rest at the muted tone.
 */
function Word({
    children,
    progress,
    range,
    highlighted,
}: {
    children: string;
    progress: MotionValue<number>;
    range: [number, number];
    highlighted: boolean;
}) {
    const opacity = useTransform(progress, range, [0.16, 1]);

    return (
        <motion.span
            style={{ opacity }}
            className={`mr-[0.25em] inline-block ${
                highlighted ? "text-foreground" : "text-foreground-secondary"
            }`}
        >
            {children}
        </motion.span>
    );
}

function RevealParagraph({
    text,
    progress,
    highlight,
    className,
    span,
}: {
    text: string;
    progress: MotionValue<number>;
    highlight: string[];
    className: string;
    /** Slice of the section scroll this paragraph consumes. */
    span: [number, number];
}) {
    const words = text.split(" ");
    const [from, to] = span;
    const step = (to - from) / words.length;
    const normalised = highlight.map((word) => word.toLowerCase());

    return (
        <p className={className}>
            {words.map((word, index) => {
                const start = from + step * index;
                return (
                    <Word
                        key={`${word}-${index}`}
                        progress={progress}
                        range={[start, start + step]}
                        highlighted={normalised.includes(
                            word.toLowerCase().replace(/[^\p{L}]/gu, ""),
                        )}
                    >
                        {word}
                    </Word>
                );
            })}
        </p>
    );
}

/**
 * The principles section.
 *
 * The wave above the text is driven by the same scroll value that reveals the
 * paragraph, so the form crests exactly as the statement lands. One input, two
 * outputs - the motion is the reading, not decoration beside it.
 */
export function LandingCraft({ copy }: { copy: LandingCopy }) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.92", "end 0.55"],
    });

    // The wave crests as the statement reveals itself, so scrolling drives both.
    const wavePhase = useTransform(scrollYProgress, [0, 1], [0, 0.85]);
    const waveOpacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.3, 0.8, 0.6]);

    return (
        <section
            id="craft"
            ref={ref}
            className="relative border-t border-border px-6 py-28 md:px-8 md:py-40"
        >
            <div className="mx-auto max-w-4xl">
                <motion.div
                    style={{ opacity: waveOpacity }}
                    className="mx-auto h-[28vh] max-h-[260px] w-full"
                    aria-hidden="true"
                >
                    <WaveForm drive={wavePhase} />
                </motion.div>

                <RevealParagraph
                    text={copy.craft.paragraphOne}
                    progress={scrollYProgress}
                    highlight={copy.craft.highlight}
                    span={[0.05, 0.66]}
                    className="display mt-16 text-[clamp(1.5rem,3.6vw,3rem)]"
                />

                <RevealParagraph
                    text={copy.craft.paragraphTwo}
                    progress={scrollYProgress}
                    highlight={[]}
                    span={[0.66, 1]}
                    className="mt-10 text-[clamp(1.125rem,2.2vw,1.75rem)] font-medium leading-snug tracking-[-0.02em]"
                />
            </div>
        </section>
    );
}
