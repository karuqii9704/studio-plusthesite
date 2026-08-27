import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { StageBackdrop, Aperture } from "../visuals";
import { withPlus } from "../text";
import type { LandingCopy } from "../copy";

/** Per-element entrance delay. Reading the markup gives you the timeline. */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** The badge sparkle, drawn rather than imported. */
function Sparkle() {
    return (
        <svg
            width="16"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="badge-star"
            aria-hidden="true"
        >
            <path d="M12 2.6C12.55 2.6 12.88 3.15 13.08 4.7c.62 4.7 1.52 5.6 6.22 6.22 1.55.2 2.1.53 2.1 1.08s-.55.88-2.1 1.08c-4.7.62-5.6 1.52-6.22 6.22-.2 1.55-.53 2.1-1.08 2.1s-.88-.55-1.08-2.1c-.62-4.7-1.52-5.6-6.22-6.22C3.15 12.88 2.6 12.55 2.6 12s.55-.88 2.1-1.08c4.7-.62 5.6-1.52 6.22-6.22C11.12 3.15 11.45 2.6 12 2.6Z" />
        </svg>
    );
}

/**
 * The hero holds one viewport and anchors its copy to the bottom rather than
 * the middle. Centring leaves an awkward pool of space under the buttons;
 * anchoring low gives the headline room to breathe above it and puts the stats
 * exactly where the fold is, so the first scroll reveals argument rather than
 * more hero.
 */
export function LandingHero({
    copy,
    onStart,
}: {
    copy: LandingCopy;
    onStart: () => void;
}) {
    return (
        <section id="hero" className="relative flex min-h-screen flex-col overflow-hidden">
            <StageBackdrop />

            {/* The iris sits off-centre behind the copy, as set dressing. */}
            <div
                className="pointer-events-none absolute right-[-22%] top-[6%] w-[70vw] max-w-[640px] opacity-40 md:right-[-6%] md:top-[4%] md:w-[38vw]"
                aria-hidden="true"
            >
                <Aperture className="h-full w-full text-foreground" />
            </div>

            <div className="relative z-10 flex flex-1 items-end justify-center px-6 pb-14 pt-28 md:pb-16">
                <div className="flex w-full max-w-4xl flex-col items-center text-center">
                    <span
                        className="badge appear appear--pop mb-6"
                        style={delay(0.22)}
                    >
                        <Sparkle />
                        {copy.hero.badge}
                    </span>

                    <h1 className="display flex flex-col text-[clamp(2.25rem,6.2vw,5rem)]">
                        {copy.hero.lines.map((line, index) => (
                            <span key={line} className="headline-line">
                                <span
                                    className="appear appear--mask block"
                                    style={delay(0.42 + index * 0.2)}
                                >
                                    {withPlus(line)}
                                </span>
                            </span>
                        ))}
                    </h1>

                    <p
                        className="appear appear--soft mt-6 max-w-xl text-[1rem] leading-[1.65] text-muted"
                        style={{ ...delay(0.82), animationDuration: "1.25s" }}
                    >
                        {withPlus(copy.hero.lede)}
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-2.5">
                        <button
                            onClick={onStart}
                            className="btn btn-solid appear appear--btn group h-11 rounded-full pl-6 pr-2.5 text-[13.5px]"
                            style={delay(0.96)}
                        >
                            {copy.hero.primary}
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-current/15 transition-transform duration-500 ease-out group-hover:rotate-45">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                            </span>
                        </button>

                        <a
                            href="#edge"
                            className="btn btn-ghost appear appear--side h-11 rounded-full px-6 text-[13.5px]"
                            style={delay(1.1)}
                        >
                            {copy.hero.secondary}
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats sit on the fold: the last thing above it, not a fourth CTA. */}
            <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-1 gap-6 px-6 pb-10 sm:grid-cols-3 md:pb-12">
                {copy.hero.stats.map((stat, index) => (
                    <div
                        key={stat.label}
                        className="appear appear--stat flex items-baseline justify-center gap-2.5 sm:justify-start"
                        style={delay(1.12 + index * 0.16)}
                    >
                        <span className="display text-[1.4rem] text-foreground">
                            {stat.value}
                        </span>
                        <span className="text-[12.5px] leading-5 text-muted">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
