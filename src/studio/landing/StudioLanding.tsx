import { useLocale } from "@/i18n/I18nProvider";
import { LANDING_COPY } from "./copy";
import { LandingNav } from "./sections/LandingNav";
import { LandingHero } from "./sections/LandingHero";
import { LandingShift } from "./sections/LandingShift";
import { LandingMission } from "./sections/LandingMission";
import { LandingSolution } from "./sections/LandingSolution";
import { LandingCta } from "./sections/LandingCta";
import { LandingFooter } from "./sections/LandingFooter";

/**
 * The public face of the studio.
 *
 * Pinned to the dark palette regardless of the workspace theme - the whole
 * composition is built on video over pure black, and inverting it would read as
 * a different product. The theme toggle lives inside the dashboard.
 */
export function StudioLanding({
    onStart,
    onLoginClick,
}: {
    onStart: (email?: string) => void;
    onLoginClick: () => void;
}) {
    const locale = useLocale();
    const copy = LANDING_COPY[locale] ?? LANDING_COPY.id;

    return (
        <div className="dark min-h-screen bg-background font-sans text-foreground">
            <LandingNav copy={copy} onSignIn={onLoginClick} />
            <main>
                <LandingHero copy={copy} onStart={onStart} />
                <LandingShift copy={copy} />
                <LandingMission copy={copy} />
                <LandingSolution copy={copy} />
                <LandingCta
                    copy={copy}
                    onStart={() => onStart()}
                    onSignIn={onLoginClick}
                />
            </main>
            <LandingFooter copy={copy} />
        </div>
    );
}
