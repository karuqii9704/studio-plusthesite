import { useEffect } from "react";

/** Longest delay (1.44s) plus the longest duration (1.25s), plus slack. */
const SAFETY_MS = 4000;

/**
 * Drives the CSS entrance choreography.
 *
 * Three jobs, all of them about not trusting the animation to finish:
 *
 *  1. When an element finishes, mark it `.is-in` so it stops being animated -
 *     otherwise a later hover or theme change fights a finished keyframe.
 *  2. If nothing is running two frames after mount (reduced motion, an engine
 *     that skipped it), mark everything arrived immediately.
 *  3. If an animation starts but never advances - a backgrounded tab, a
 *     throttled device, a compositor that stopped producing frames - settle
 *     everything on a timer. `animationend` never fires in that state, and the
 *     rAF check sees `running` and steps aside, so without this the copy stays
 *     invisible. Content is not allowed to depend on an animation completing.
 */
export function useAppear(active = true) {
    useEffect(() => {
        if (!active) return;

        const elements = Array.from(
            document.querySelectorAll<HTMLElement>(".appear"),
        );

        const settle = (element: HTMLElement) => element.classList.add("is-in");
        const settleAll = () => elements.forEach(settle);

        for (const element of elements) {
            element.addEventListener("animationend", () => settle(element), {
                once: true,
            });
        }

        let secondFrame = 0;
        const firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => {
                const running = elements.some((element) =>
                    element
                        .getAnimations?.()
                        .some((a) => a.playState === "running" || a.playState === "finished"),
                );
                if (!running) settleAll();
            });
        });

        const safety = window.setTimeout(settleAll, SAFETY_MS);

        return () => {
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);
            window.clearTimeout(safety);
        };
    }, [active]);
}
