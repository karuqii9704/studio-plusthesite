import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { AmbientVideo } from "../primitives";
import { fadeUp, pressable } from "../motion";
import { HERO_VIDEO } from "../media";
import type { LandingCopy } from "../copy";

/** Neutral stand-in avatars: a silhouette on a grey disc, no external assets. */
function AvatarStack() {
    return (
        <div className="flex -space-x-2" aria-hidden="true">
            {[0.22, 0.16, 0.1].map((tone, index) => (
                <span
                    key={index}
                    className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-background"
                    style={{ background: `rgba(255,255,255,${tone})` }}
                >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 translate-y-0.5">
                        <circle cx="12" cy="9" r="3.6" fill="rgba(255,255,255,0.55)" />
                        <path
                            d="M4.5 21c0-4.1 3.4-6.6 7.5-6.6s7.5 2.5 7.5 6.6z"
                            fill="rgba(255,255,255,0.55)"
                        />
                    </svg>
                </span>
            ))}
        </div>
    );
}

export function LandingHero({
    copy,
    onStart,
}: {
    copy: LandingCopy;
    onStart: (email: string) => void;
}) {
    const [email, setEmail] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onStart(email.trim());
    };

    return (
        <section id="hero" className="relative min-h-screen overflow-hidden">
            <AmbientVideo
                src={HERO_VIDEO}
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Keeps the headline readable no matter which frame is on screen. */}
            <div className="absolute inset-0 bg-background/45" />
            <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-background to-transparent" />

            <div className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 pb-20 pt-28 text-center md:pt-32">
                <motion.div
                    {...fadeUp(0)}
                    className="flex items-center gap-3 text-sm text-muted"
                >
                    <AvatarStack />
                    {copy.hero.social}
                </motion.div>

                <motion.h1
                    {...fadeUp(0.1)}
                    className="mt-7 text-5xl font-medium tracking-[-2px] md:text-7xl lg:text-8xl"
                >
                    {copy.hero.headingBefore}
                    <span className="font-serif font-normal italic">
                        {copy.hero.headingAccent}
                    </span>
                    {copy.hero.headingAfter}
                </motion.h1>

                <motion.p
                    {...fadeUp(0.2)}
                    className="mt-6 max-w-2xl text-lg text-hero-subtitle"
                >
                    {copy.hero.subtitle}
                </motion.p>

                <motion.form
                    {...fadeUp(0.3)}
                    onSubmit={handleSubmit}
                    className="liquid-glass mt-9 flex w-full max-w-lg items-center gap-2 rounded-full p-2"
                >
                    <label htmlFor="hero-email" className="sr-only">
                        {copy.hero.emailPlaceholder}
                    </label>
                    <input
                        id="hero-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder={copy.hero.emailPlaceholder}
                        className="min-w-0 flex-1 bg-transparent px-5 py-3 text-sm text-foreground outline-none placeholder:text-muted"
                    />
                    <motion.button
                        type="submit"
                        variants={pressable}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                        className="shrink-0 rounded-full bg-foreground px-8 py-3 text-sm font-bold tracking-wide text-background"
                    >
                        {copy.hero.cta}
                    </motion.button>
                </motion.form>

                <motion.p {...fadeUp(0.4)} className="mt-4 text-xs text-muted">
                    {copy.hero.note}
                </motion.p>
            </div>
        </section>
    );
}
