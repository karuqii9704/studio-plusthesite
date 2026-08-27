import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * The concentric mark: two rings sharing a centre. Sized by the caller so the
 * navbar, the closing panel, and the footer can all reuse it.
 */
export function ConcentricMark({
    outer = "h-7 w-7",
    inner = "h-3 w-3",
    className = "",
}: {
    outer?: string;
    inner?: string;
    className?: string;
}) {
    return (
        <span
            className={`inline-flex items-center justify-center rounded-full border-2 border-foreground/60 ${outer} ${className}`}
            aria-hidden="true"
        >
            <span className={`rounded-full border border-foreground/60 ${inner}`} />
        </span>
    );
}

/**
 * Background video that never blocks the page.
 *
 * Autoplay with sound off is the only autoplay browsers allow, and a failed
 * source must not leave a broken poster behind - so the element only fades in
 * once it has actually painted a frame.
 */
export function AmbientVideo({
    src,
    className = "",
    style,
}: {
    src: string;
    className?: string;
    style?: CSSProperties;
}) {
    const ref = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        // A cached or already-buffered source can reach HAVE_CURRENT_DATA before
        // React attaches its listener, so check the state as well as the event.
        const markReady = () => setReady(true);
        if (video.readyState >= 2) markReady();
        video.addEventListener("loadeddata", markReady);
        video.addEventListener("canplay", markReady);

        // Some browsers reject the promise when the tab starts hidden; the
        // element simply stays invisible rather than throwing on the page.
        void video.play().catch(() => undefined);

        return () => {
            video.removeEventListener("loadeddata", markReady);
            video.removeEventListener("canplay", markReady);
        };
    }, [src]);

    return (
        <video
            ref={ref}
            src={src}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-hidden="true"
            style={style}
            className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"} ${className}`}
        />
    );
}

/** A heading whose accent word is set in Instrument Serif italic. */
export function AccentHeading({
    before,
    accent,
    after = "",
    className = "",
}: {
    before: string;
    accent: string;
    after?: string;
    className?: string;
}) {
    return (
        <h2 className={className}>
            {before}
            <span className="font-serif font-normal italic">{accent}</span>
            {after}
        </h2>
    );
}
