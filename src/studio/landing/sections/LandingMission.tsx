import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { AmbientVideo } from "../primitives";
import { MISSION_VIDEO } from "../media";
import type { LandingCopy } from "../copy";

/**
 * One word of the scroll-revealed paragraph.
 *
 * Each word owns its own transform so the reveal tracks scroll position rather
 * than a timed animation - the reader sets the pace. Highlighted words settle
 * at full white; the rest rest at the softer subtitle tone.
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
    const opacity = useTransform(progress, range, [0.15, 1]);
    return (
        <motion.span
            style={{ opacity }}
            className={`mr-[0.25em] inline-block ${
                highlighted ? "text-foreground" : "text-hero-subtitle"
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

export function LandingMission({ copy }: { copy: LandingCopy }) {
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "end 0.6"],
    });

    return (
        <section
            id="mission"
            ref={ref}
            className="px-6 pb-32 pt-0 md:px-28 md:pb-44"
        >
            <div className="mx-auto max-w-4xl">
                <div className="mx-auto aspect-square w-full max-w-[800px]">
                    <AmbientVideo
                        src={MISSION_VIDEO}
                        className="h-full w-full object-contain"
                    />
                </div>

                <RevealParagraph
                    text={copy.mission.paragraphOne}
                    progress={scrollYProgress}
                    highlight={copy.mission.highlight}
                    span={[0, 0.62]}
                    className="text-2xl font-medium tracking-[-1px] md:text-4xl lg:text-5xl"
                />

                <RevealParagraph
                    text={copy.mission.paragraphTwo}
                    progress={scrollYProgress}
                    highlight={[]}
                    span={[0.62, 1]}
                    className="mt-10 text-xl font-medium md:text-2xl lg:text-3xl"
                />
            </div>
        </section>
    );
}
