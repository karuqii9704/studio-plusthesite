import { motion } from "framer-motion";
import { AmbientVideo } from "../primitives";
import { fadeUp } from "../motion";
import { SOLUTION_VIDEO } from "../media";
import type { LandingCopy } from "../copy";

export function LandingSolution({ copy }: { copy: LandingCopy }) {
    return (
        <section
            id="solution"
            className="border-t border-border/30 px-6 py-32 md:px-28 md:py-44"
        >
            <div className="mx-auto max-w-6xl">
                <motion.p
                    {...fadeUp(0)}
                    className="text-xs uppercase tracking-[3px] text-muted"
                >
                    {copy.solution.label}
                </motion.p>

                <motion.h2
                    {...fadeUp(0.1)}
                    className="mt-6 max-w-3xl text-4xl font-medium tracking-[-1px] md:text-6xl"
                >
                    {copy.solution.headingBefore}
                    <span className="font-serif font-normal italic">
                        {copy.solution.headingAccent}
                    </span>
                    {copy.solution.headingAfter}
                </motion.h2>

                <motion.div
                    {...fadeUp(0.2)}
                    className="mt-14 overflow-hidden rounded-2xl"
                >
                    <AmbientVideo
                        src={SOLUTION_VIDEO}
                        className="aspect-[3/1] w-full object-cover"
                    />
                </motion.div>

                <div className="mt-16 grid gap-8 md:grid-cols-4">
                    {copy.solution.features.map((feature, index) => (
                        <motion.article key={feature.title} {...fadeUp(0.1 * index)}>
                            <h3 className="text-base font-semibold">{feature.title}</h3>
                            <p className="mt-3 text-sm text-muted">{feature.body}</p>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}
