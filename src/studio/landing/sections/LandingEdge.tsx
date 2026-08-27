import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { fadeUp, pressable } from "../motion";
import { TOOL_MARKS } from "../visuals";
import { withPlus } from "../text";
import { CONTACT_EMAIL } from "@/lib/site";
import type { Advantage, LandingCopy } from "../copy";

function AdvantageCard({ item, index }: { item: Advantage; index: number }) {
    const Mark = TOOL_MARKS[item.mark];

    return (
        <motion.article
            {...fadeUp(0.06 * index)}
            initial="rest"
            whileHover="hover"
            className="group relative overflow-hidden rounded-2xl bg-card-bg p-7 hairline transition-shadow duration-500 hover:shadow-lifted"
        >
            {/* A soft key light rakes in from the top-left corner on hover. */}
            <span
                className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                style={{ background: "var(--key-light-soft)" }}
                aria-hidden="true"
            />

            <div className="relative">
                <span className="grid h-12 w-12 place-items-center rounded-xl text-foreground/70 transition-colors duration-500 group-hover:text-foreground">
                    <Mark className="h-8 w-8" />
                </span>

                <h3 className="mt-6 text-[1.0625rem] font-semibold leading-6 tracking-tight">
                    {withPlus(item.title)}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted">{withPlus(item.body)}</p>
            </div>
        </motion.article>
    );
}

/**
 * The case for the studio.
 *
 * Four capabilities stated as outcomes, then the ask. The call to action sits
 * inside the same section rather than being deferred to the page footer, so a
 * reader convinced by card three does not have to scroll to act on it.
 */
export function LandingEdge({
    copy,
    onStart,
}: {
    copy: LandingCopy;
    onStart: () => void;
}) {
    return (
        <section
            id="edge"
            className="relative border-t border-border px-6 py-28 md:px-8 md:py-40"
        >
            <div className="mx-auto max-w-6xl">
                <motion.p {...fadeUp(0)} className="eyebrow">
                    {copy.edge.eyebrow}
                </motion.p>

                <motion.h2
                    {...fadeUp(0.06)}
                    className="display mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.75rem)]"
                >
                    {withPlus(copy.edge.heading)}
                </motion.h2>

                <motion.p
                    {...fadeUp(0.12)}
                    className="mt-7 max-w-2xl text-base leading-8 text-muted"
                >
                    {withPlus(copy.edge.subtitle)}
                </motion.p>

                <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {copy.edge.advantages.map((item, index) => (
                        <AdvantageCard key={item.title} item={item} index={index} />
                    ))}
                </div>

                {/* The ask. */}
                <motion.div
                    {...fadeUp(0.1)}
                    className="liquid-glass relative mt-4 flex flex-col gap-7 overflow-hidden rounded-2xl p-8 md:flex-row md:items-center md:justify-between md:p-10"
                >
                    <span
                        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                        style={{ background: "var(--fill-light-soft)" }}
                        aria-hidden="true"
                    />

                    <div className="relative max-w-lg">
                        <h3 className="text-xl font-semibold tracking-tight md:text-2xl">
                            {withPlus(copy.edge.ctaTitle)}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted">
                            {withPlus(copy.edge.ctaBody)}
                        </p>
                    </div>

                    <div className="relative flex shrink-0 flex-wrap items-center gap-3">
                        <motion.button
                            onClick={onStart}
                            variants={pressable}
                            initial="rest"
                            whileHover="hover"
                            whileTap="tap"
                            className="btn btn-solid group h-12 rounded-full pl-6 pr-2.5 text-sm"
                        >
                            {copy.edge.ctaPrimary}
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-current/15 transition-transform duration-500 ease-out group-hover:rotate-45">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                        </motion.button>

                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="rounded-full px-5 py-3 text-sm font-semibold text-muted transition-colors hover:text-foreground"
                        >
                            {copy.edge.ctaSecondary}
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
