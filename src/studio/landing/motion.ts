import type { Variants } from "framer-motion";

/**
 * One entrance for the whole page: 20px rise, 0.6s, staggered by caller.
 * Sections pass an increasing delay so elements arrive in reading order.
 */
export const fadeUp = (delay: number) =>
    ({
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, delay, ease: "easeOut" },
    }) as const;

export const pressable: Variants = {
    rest: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.98 },
};
