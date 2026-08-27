import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PlusWordmark } from "@/components/PlusLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { LandingCopy } from "../copy";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Floating island navbar.
 *
 * Same three-island idea as the marketing site, tightened: 44px tall instead of
 * 57, hairline rims instead of borders, and the islands draw closer together as
 * the page scrolls so the bar settles into the content rather than hovering
 * above it.
 */
export function LandingNav({
    copy,
    onSignIn,
    onStart,
}: {
    copy: LandingCopy;
    onSignIn: () => void;
    onStart: () => void;
}) {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // A locked body keeps the sheet from scrolling the page underneath it.
    useEffect(() => {
        if (!open) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [open]);

    return (
        <motion.header
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4"
        >
            <nav
                className={`mx-auto flex max-w-6xl items-center transition-[gap] duration-500 ${
                    scrolled ? "gap-1.5" : "gap-3"
                }`}
            >
                {/* Island 1 - identity */}
                <a
                    href="#hero"
                    className="island sweep-on-hover flex h-11 shrink-0 items-center gap-2.5 px-4"
                >
                    <PlusWordmark className="h-auto w-[52px] text-foreground" />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                        Studio
                    </span>
                </a>

                {/* Island 2 - sections */}
                <div className="island hidden h-11 items-center gap-1 px-2 lg:flex">
                    {copy.nav.links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="group relative rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
                        >
                            {link.label}
                            <span className="absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-foreground transition-transform duration-500 ease-out group-hover:scale-x-100" />
                        </a>
                    ))}
                </div>

                {/* Island 3 - controls */}
                <div className="island ml-auto hidden h-11 shrink-0 items-center gap-1 pl-2 pr-1.5 md:flex">
                    <LanguageToggle />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <ThemeToggle />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <button
                        onClick={onSignIn}
                        className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-muted transition-colors hover:text-foreground"
                    >
                        {copy.nav.signIn}
                    </button>
                    <button
                        onClick={onStart}
                        className="group inline-flex items-center gap-1.5 rounded-full bg-foreground py-1.5 pl-3.5 pr-2 text-[12px] font-semibold text-background transition-opacity hover:opacity-90"
                    >
                        {copy.nav.open}
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-background/15 transition-transform duration-500 ease-out group-hover:rotate-45">
                            <ArrowUpRight className="h-3 w-3" />
                        </span>
                    </button>
                </div>

                {/* Mobile island */}
                <div className="island ml-auto flex h-11 items-center gap-1 px-1.5 md:hidden">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        className="grid h-8 w-8 place-items-center rounded-full text-foreground"
                    >
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="liquid-glass mx-auto mt-2 max-w-6xl rounded-3xl p-4 md:hidden"
                    >
                        <div className="flex flex-col">
                            {copy.nav.links.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="rounded-xl px-2 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                            <LanguageToggle />
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onSignIn();
                                }}
                                className="text-sm font-semibold text-muted transition-colors hover:text-foreground"
                            >
                                {copy.nav.signIn}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setOpen(false);
                                onStart();
                            }}
                            className="mt-3 w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background"
                        >
                            {copy.nav.open}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
