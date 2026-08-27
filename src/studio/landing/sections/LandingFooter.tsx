import { MAIN_SITE_URL } from "@/lib/site";
import type { LandingCopy } from "../copy";
import { useI18n } from "@/i18n/I18nProvider";

export function LandingFooter({ copy }: { copy: LandingCopy }) {
    const { locale, setLocale } = useI18n();
    const year = new Date().getFullYear();

    return (
        <footer className="flex flex-col items-center justify-between gap-6 px-6 py-12 text-sm md:flex-row md:px-28">
            <p className="text-muted">
                &copy; {year} {copy.footer.rights}
            </p>

            <div className="flex items-center gap-6">
                {copy.footer.links.map((link) => (
                    <a
                        key={link.href}
                        href={`${MAIN_SITE_URL}/${locale}${link.href}`}
                        className="text-muted transition-colors hover:text-foreground"
                    >
                        {link.label}
                    </a>
                ))}
                <button
                    onClick={() => setLocale(locale === "id" ? "en" : "id")}
                    className="text-muted uppercase transition-colors hover:text-foreground"
                >
                    {locale === "id" ? "EN" : "ID"}
                </button>
            </div>
        </footer>
    );
}
