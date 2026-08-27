import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ConcentricMark } from "../primitives";
import { fadeUp, pressable } from "../motion";
import { CTA_STREAM } from "../media";
import type { LandingCopy } from "../copy";

/**
 * HLS background.
 *
 * Safari plays .m3u8 natively; everywhere else hls.js is loaded on demand so
 * the library never lands in the initial bundle. A stream that fails to attach
 * leaves the panel on flat black, which is the intended ground anyway.
 */
function useHlsBackground(src: string) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        let cancelled = false;
        let destroy: (() => void) | undefined;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src;
            void video.play().catch(() => undefined);
            return;
        }

        void import("hls.js").then(({ default: Hls }) => {
            if (cancelled || !Hls.isSupported()) return;
            const hls = new Hls({ capLevelToPlayerSize: true });
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                void video.play().catch(() => undefined);
            });
            destroy = () => hls.destroy();
        });

        return () => {
            cancelled = true;
            destroy?.();
        };
    }, [src]);

    return ref;
}

export function LandingCta({
    copy,
    onStart,
    onSignIn,
}: {
    copy: LandingCopy;
    onStart: () => void;
    onSignIn: () => void;
}) {
    const videoRef = useHlsBackground(CTA_STREAM);

    return (
        <section className="relative overflow-hidden border-t border-border/30 px-6 py-32 md:px-28 md:py-44">
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
                className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 z-[1] bg-background/45" />

            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
                <motion.div {...fadeUp(0)}>
                    <ConcentricMark outer="h-10 w-10" inner="h-5 w-5" />
                </motion.div>

                <motion.h2
                    {...fadeUp(0.1)}
                    className="mt-8 text-4xl font-medium tracking-[-1px] md:text-6xl"
                >
                    {copy.cta.headingBefore}
                    <span className="font-serif font-normal italic">
                        {copy.cta.headingAccent}
                    </span>
                </motion.h2>

                <motion.p {...fadeUp(0.2)} className="mt-6 text-muted">
                    {copy.cta.subtitle}
                </motion.p>

                <motion.div
                    {...fadeUp(0.3)}
                    className="mt-10 flex flex-col gap-3 sm:flex-row"
                >
                    <motion.button
                        onClick={onStart}
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="rounded-lg bg-foreground px-8 py-3.5 font-semibold text-background"
                    >
                        {copy.cta.primary}
                    </motion.button>
                    <motion.button
                        onClick={onSignIn}
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="liquid-glass rounded-lg px-8 py-3.5 font-semibold text-foreground"
                    >
                        {copy.cta.secondary}
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
