import { Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { ConcentricMark } from "../primitives";
import type { LandingCopy } from "../copy";

const SOCIALS = [
    { Icon: Instagram, label: "Instagram", href: "https://instagram.com/plusthesite" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com/company/plusthesite" },
    { Icon: Twitter, label: "X", href: "https://x.com/plusthesite" },
];

export function LandingNav({
    copy,
    onSignIn,
}: {
    copy: LandingCopy;
    onSignIn: () => void;
}) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed inset-x-0 top-0 z-50 px-6 py-4 md:px-28"
        >
            <nav className="flex items-center gap-8">
                <a href="#hero" className="flex shrink-0 items-center gap-2.5">
                    <ConcentricMark />
                    <span className="text-base font-bold tracking-tight">PLUS Studio</span>
                </a>

                <div className="hidden items-center gap-2 text-sm lg:flex">
                    {copy.nav.links.map((link, index) => (
                        <span key={link.href} className="flex items-center gap-2">
                            {index > 0 && <span className="text-muted-light">&bull;</span>}
                            <a
                                href={link.href}
                                className="text-muted transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </a>
                        </span>
                    ))}
                </div>

                <div className="ml-auto flex items-center gap-2">
                    <div className="hidden items-center gap-2 sm:flex">
                        {SOCIALS.map(({ Icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label={label}
                                className="liquid-glass flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:text-foreground"
                            >
                                <Icon size={16} />
                            </a>
                        ))}
                    </div>
                    <button
                        onClick={onSignIn}
                        className="liquid-glass rounded-full px-5 py-2.5 text-sm font-semibold text-foreground"
                    >
                        {copy.nav.signIn}
                    </button>
                </div>
            </nav>
        </motion.header>
    );
}
