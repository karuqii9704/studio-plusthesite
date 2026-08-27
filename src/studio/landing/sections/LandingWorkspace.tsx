import { motion } from "framer-motion";
import { fadeUp } from "../motion";
import { ContactSheet } from "../visuals";
import { withPlus } from "../text";
import type { LandingCopy } from "../copy";

/**
 * What is actually inside.
 *
 * The contact sheet running above the list does the work a product screenshot
 * usually does: it says "this is a place where things get made" without
 * pretending to show a UI that will look different next month.
 */
export function LandingWorkspace({ copy }: { copy: LandingCopy }) {
    return (
        <section
            id="workspace"
            className="relative border-t border-border px-6 py-28 md:px-8 md:py-40"
        >
            <div className="mx-auto max-w-6xl">
                <motion.p {...fadeUp(0)} className="eyebrow">
                    {copy.workspace.eyebrow}
                </motion.p>

                <motion.h2
                    {...fadeUp(0.06)}
                    className="display mt-6 max-w-3xl text-balance text-[clamp(2rem,4.6vw,3.75rem)]"
                >
                    {withPlus(copy.workspace.heading)}
                </motion.h2>

                <motion.div {...fadeUp(0.14)} className="mt-14">
                    <ContactSheet className="h-44 md:h-56" />
                </motion.div>

                <div
                    className="mt-16 grid gap-px overflow-hidden rounded-2xl md:grid-cols-2 lg:grid-cols-4"
                    style={{ background: "var(--border)" }}
                >
                    {copy.workspace.features.map((feature, index) => (
                        <motion.article
                            key={feature.title}
                            {...fadeUp(0.06 * index)}
                            className="group relative overflow-hidden bg-background p-7 transition-colors duration-500 hover:bg-surface"
                        >
                            <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-light">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <h3 className="mt-4 text-[1.0625rem] font-semibold tracking-tight">
                                {withPlus(feature.title)}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-muted">
                                {withPlus(feature.body)}
                            </p>
                            <span className="absolute inset-x-7 bottom-0 h-px origin-left scale-x-0 bg-foreground/40 transition-transform duration-700 ease-out group-hover:scale-x-100" />
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
