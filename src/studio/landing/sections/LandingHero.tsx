import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp, pressable } from "../motion";
import { StageBackdrop, Aperture } from "../visuals";
import { withPlus } from "../text";
import type { LandingCopy } from "../copy";

export function LandingHero({
    copy,
    onStart,
}: {
    copy: LandingCopy;
    onStart: () => void;
}) {
    const reduced = useReducedMotion();

    return (
        <section id="hero" className="relative min-h-screen overflow-hidden">
            <StageBackdrop />

            {/* The iris sits behind the headline, off-centre, as set dressing. */}
            <motion.div
                initial={{ opacity: 0, scale: 0.86 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="pointer-events-none absolute right-[-18%] top-[8%] w-[62vw] max-w-[720px] opacity-[0.5] md:right-[-8%] md:top-[6%] md:w-[44vw]"
                aria-hidden="true"
            >
                <Aperture className="h-full w-full text-foreground" />
            </motion.div>

            <div className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 pb-24 pt-32 md:px-8">
                <motion.div {...fadeUp(0)} className="flex items-center gap-3">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                    </span>
                    <span className="eyebrow">{copy.hero.eyebrow}</span>
                </motion.div>

                <motion.h1
                    {...fadeUp(0.08)}
                    className="display mt-7 max-w-4xl text-balance text-[clamp(2.75rem,7.4vw,6.5rem)]"
                >
                    {copy.hero.headingBefore}
                    <span className="accent-serif">{copy.hero.headingAccent}</span>
                    {copy.hero.headingAfter}
                </motion.h1>

                <motion.p
                    {...fadeUp(0.16)}
                    className="mt-8 max-w-xl text-[1.0625rem] leading-8 text-muted"
                >
                    {withPlus(copy.hero.subtitle)}
                </motion.p>

                <motion.div {...fadeUp(0.24)} className="mt-10 flex flex-wrap items-center gap-3">
                    <motion.button
                        onClick={onStart}
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="group inline-flex items-center gap-2 rounded-full bg-foreground py-3 pl-6 pr-3 text-sm font-semibold text-background"
                    >
                        {copy.hero.primary}
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-background/15 transition-transform duration-500 ease-out group-hover:rotate-45">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                    </motion.button>

                    <motion.a
                        href="#edge"
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="liquid-glass rounded-full px-6 py-3 text-sm font-semibold text-foreground"
                    >
                        {copy.hero.secondary}
                    </motion.a>
                </motion.div>

                {/* Numbers, set on a hairline rule rather than in boxes. */}
                <motion.dl
                    {...fadeUp(0.34)}
                    className="mt-16 grid max-w-2xl grid-cols-1 gap-px overflow-hidden rounded-2xl sm:grid-cols-3"
                    style={{ background: "var(--border)" }}
                >
                    {copy.hero.stats.map((stat) => (
                        <div key={stat.label} className="bg-background px-5 py-5">
                            <dt className="text-2xl font-medium tracking-tight text-foreground">
                                {stat.value}
                            </dt>
                            <dd className="mt-1.5 text-xs leading-5 text-muted">{stat.label}</dd>
                        </div>
                    ))}
                </motion.dl>
            </div>

            {!reduced && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block"
                    aria-hidden="true"
                >
                    <motion.span
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        className="block h-9 w-px"
                        style={{
                            background:
                                "linear-gradient(to bottom, transparent, var(--border-strong))",
                        }}
                    />
                </motion.div>
            )}
        </section>
    );
}
