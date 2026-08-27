import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PlusMark } from "@/components/PlusLogo";
import { fadeUp, pressable } from "../motion";
import { withPlus } from "../text";
import type { LandingCopy } from "../copy";

/**
 * Closing call to action.
 *
 * The lights come up: the warm key and cool fill from the hero return, brighter
 * and closer together, so the page ends on the same stage it opened on.
 */
export function LandingStart({
    copy,
    onStart,
    onSignIn,
}: {
    copy: LandingCopy;
    onStart: () => void;
    onSignIn: () => void;
}) {
    return (
        <section className="relative overflow-hidden border-t border-border px-6 py-28 md:px-8 md:py-44">
            <div className="grain pointer-events-none absolute inset-0" aria-hidden="true">
                <div
                    className="light-key absolute -top-1/3 left-1/4 h-[70vh] w-[46vw] rounded-full blur-[120px]"
                    style={{ background: "var(--key-light-soft)" }}
                />
                <div
                    className="light-fill absolute -bottom-1/3 right-1/4 h-[60vh] w-[42vw] rounded-full blur-[120px]"
                    style={{ background: "var(--fill-light-soft)" }}
                />
            </div>

            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
                <motion.div {...fadeUp(0)}>
                    <PlusMark className="h-10 w-10 text-foreground" behaviour="idle" />
                </motion.div>

                <motion.h2
                    {...fadeUp(0.08)}
                    className="display mt-9 text-balance text-[clamp(2.25rem,5.4vw,4.25rem)]"
                >
                    {withPlus(copy.start.headingBefore)}
                    <span className="accent-serif">{copy.start.headingAccent}</span>
                </motion.h2>

                <motion.p {...fadeUp(0.16)} className="mt-6 text-base leading-8 text-muted">
                    {withPlus(copy.start.subtitle)}
                </motion.p>

                <motion.div {...fadeUp(0.24)} className="mt-11 flex flex-wrap justify-center gap-3">
                    <motion.button
                        onClick={onStart}
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="group inline-flex items-center gap-2 rounded-full bg-foreground py-3.5 pl-7 pr-3 text-sm font-semibold text-background"
                    >
                        {copy.start.primary}
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-background/15 transition-transform duration-500 ease-out group-hover:rotate-45">
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                    </motion.button>

                    <motion.button
                        onClick={onSignIn}
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="liquid-glass rounded-full px-7 py-3.5 text-sm font-semibold text-foreground"
                    >
                        {copy.start.secondary}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
