import { PlusWordmark } from "@/components/PlusLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MAIN_SITE_URL } from "@/lib/site";
import { useI18n } from "@/i18n/I18nProvider";
import { withPlus } from "../text";
import type { LandingCopy } from "../copy";

export function LandingFooter({ copy }: { copy: LandingCopy }) {
    const { locale } = useI18n();
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-border px-6 py-12 md:px-8">
            <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <PlusWordmark
                        className="h-auto w-14 text-foreground"
                        href={MAIN_SITE_URL}
                        label="plus. - back to the main site"
                    />
                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <p className="text-xs text-muted">
                        &copy; {year} {withPlus(copy.footer.rights)}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
                    {copy.footer.links.map((link) => (
                        <a
                            key={link.href}
                            href={`${MAIN_SITE_URL}/${locale}${link.href}`}
                            className="text-muted transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </a>
                    ))}

                    <span className="h-3.5 w-px bg-border" aria-hidden="true" />
                    <LanguageToggle />
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    );
}
