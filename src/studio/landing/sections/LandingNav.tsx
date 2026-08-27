import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { PlusWordmark } from "@/components/PlusLogo";
import { StudioTag } from "@/components/StudioWord";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import type { LandingCopy } from "../copy";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Per-element entrance delay, so the bar assembles left to right. */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/**
 * Floating island navbar.
 *
 * Same three-island idea as the marketing site, tightened: 44px tall instead of
 * 57, hairline rims instead of borders, and the islands draw closer together as
 * the page scrolls so the bar settles into the content rather than hovering
 * above it. Nav links are lit metal with a specular pass on hover.
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

    // Escape closes the sheet; so does growing past the mobile breakpoint.
    useEffect(() => {
        if (!open) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        const media = window.matchMedia("(min-width: 768px)");
        const onChange = () => media.matches && setOpen(false);
        window.addEventListener("keydown", onKey);
        media.addEventListener("change", onChange);
        return () => {
            window.removeEventListener("keydown", onKey);
            media.removeEventListener("change", onChange);
        };
    }, [open]);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 md:px-6 md:pt-4">
            <nav
                className={`mx-auto flex max-w-6xl items-center transition-[gap] duration-500 ${
                    scrolled ? "gap-1.5" : "gap-3"
                }`}
            >
                {/* Island 1 - identity */}
                <a
                    href="#hero"
                    aria-label="plus. Studio"
                    className="island appear appear--scale flex h-11 shrink-0 items-center gap-2.5 px-4"
                    style={delay(0.08)}
                >
                    <PlusWordmark className="h-auto w-[52px] text-foreground" />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <StudioTag className="text-[10.5px] font-semibold tracking-[0.2em] text-muted" />
                </a>

                {/* Island 2 - sections */}
                <div className="hidden items-center gap-2 lg:flex">
                    {copy.nav.links.map((link, index) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="pill appear appear--scale h-11 px-[18px] text-[13px]"
                            style={delay(0.16 + index * 0.12)}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Island 3 - controls */}
                <div
                    className="island appear appear--scale ml-auto hidden h-11 shrink-0 items-center gap-1 pl-2 pr-1.5 md:flex"
                    style={delay(0.34)}
                >
                    <LanguageToggle />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <ThemeToggle />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <button
                        onClick={onSignIn}
                        className="rounded-full px-3 py-1.5 text-[12.5px] font-medium text-muted transition-colors hover:text-foreground"
                    >
                        {copy.nav.signIn}
                    </button>
                    <button
                        onClick={onStart}
                        className="btn btn-solid group h-8 rounded-full py-0 pl-3.5 pr-1.5 text-[12.5px]"
                    >
                        {copy.nav.open}
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-current/15 transition-transform duration-500 ease-out group-hover:rotate-45">
                            <ArrowUpRight className="h-3 w-3" />
                        </span>
                    </button>
                </div>

                {/* Mobile island */}
                <div
                    className="island appear appear--scale ml-auto flex h-11 items-center gap-1 px-1.5 md:hidden"
                    style={delay(0.34)}
                >
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        aria-label={open ? "Close menu" : "Open menu"}
                        aria-expanded={open}
                        aria-controls="site-nav"
                        className="grid h-8 w-8 place-items-center rounded-full text-foreground"
                    >
                        {open ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {open && (
                    <motion.div
                        id="site-nav"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="liquid-glass mx-auto mt-2 max-w-6xl rounded-3xl p-4 md:hidden"
                    >
                        <div className="flex flex-col gap-2">
                            {copy.nav.links.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="pill h-12 justify-start px-4 text-[15px]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                            <LanguageToggle />
                            <button
                                onClick={() => {
                                    setOpen(false);
                                    onSignIn();
                                }}
                                className="text-sm font-medium text-muted transition-colors hover:text-foreground"
                            >
                                {copy.nav.signIn}
                            </button>
                        </div>

                        <button
                            onClick={() => {
                                setOpen(false);
                                onStart();
                            }}
                            className="btn btn-solid mt-3 h-12 w-full rounded-full text-sm"
                        >
                            {copy.nav.open}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
