import { useLocale } from "@/i18n/I18nProvider";
import { LANDING_COPY } from "./copy";
import { LandingNav } from "./sections/LandingNav";
import { LandingHero } from "./sections/LandingHero";
import { LandingEdge } from "./sections/LandingEdge";
import { LandingCraft } from "./sections/LandingCraft";
import { LandingWorkspace } from "./sections/LandingWorkspace";
import { LandingStart } from "./sections/LandingStart";
import { LandingFooter } from "./sections/LandingFooter";

/**
 * The public face of the studio.
 *
 * Follows the workspace theme in both directions - the lighting palette is
 * built to invert, so light mode reads as a bright studio rather than a
 * washed-out dark one.
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
    const start = () => onStart();

    return (
        <div className="min-h-screen bg-background font-sans text-foreground">
            <LandingNav copy={copy} onSignIn={onLoginClick} onStart={start} />
            <main>
                <LandingHero copy={copy} onStart={start} />
                <LandingEdge copy={copy} onStart={start} />
                <LandingCraft copy={copy} />
                <LandingWorkspace copy={copy} />
                <LandingStart copy={copy} onStart={start} onSignIn={onLoginClick} />
            </main>
            <LandingFooter copy={copy} />
        </div>
    );
}
