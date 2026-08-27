import { useEffect, useRef } from "react";
import { useReducedMotion, type MotionValue } from "framer-motion";

/**
 * The wave.
 *
 * A twisted ribbon, rendered as vertical slices on a canvas. Each column knows
 * the centre of the band, its half-thickness, and how face-on the surface is at
 * that point, and paints a soft gradient through it. Shading from the local
 * slope is what makes a flat gradient read as a solid, lit form.
 *
 * Drawn rather than streamed: it inverts for light mode, weighs nothing, and
 * there is no third-party host to go dark on launch day. Two passes half a
 * period apart give the crossing at the centre.
 */

const COLUMN = 2;

type Palette = { ink: string; glow: string; alpha: number };

function readPalette(root: HTMLElement): Palette {
    const styles = getComputedStyle(root);
    const dark = document.documentElement.classList.contains("dark");
    return {
        // The form is light on a blacked-out stage, and ink on paper.
        ink: dark ? "255,255,255" : "24,24,28",
        glow: styles.getPropertyValue("--key-light").trim() || "#e2a76f",
        alpha: dark ? 0.8 : 0.3,
    };
}

/** Fades the ribbon out at both ends so it runs off frame instead of stopping. */
function envelope(x: number) {
    return Math.sin(Math.PI * x) ** 0.42;
}

/** Thick at the shoulders, pinched through the middle, like the reference. */
function halfThickness(x: number, phase: number, height: number) {
    const pinch = 0.42 + 0.58 * Math.abs(Math.cos(Math.PI * x + phase * 0.35));
    return height * 0.24 * envelope(x) * pinch;
}

export function WaveForm({
    className = "",
    /** Optional scroll driver. Omit for a slow ambient drift. */
    drive,
    speed = 0.00016,
}: {
    className?: string;
    drive?: MotionValue<number>;
    speed?: number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const reduced = useReducedMotion();

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        let width = 0;
        let height = 0;
        let palette = readPalette(canvas);
        let frame = 0;
        let visible = true;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const ratio = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.max(1, Math.round(rect.width));
            height = Math.max(1, Math.round(rect.height));
            canvas.width = width * ratio;
            canvas.height = height * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
        };

        /** One ribbon pass. `offset` shifts the phase to make the crossing. */
        const ribbon = (phase: number, offset: number, weight: number) => {
            const amplitude = height * 0.22;
            const midline = height * 0.5;

            for (let px = 0; px <= width; px += COLUMN) {
                const x = px / width;
                const angle = Math.PI * 2 * x + phase + offset;
                const centre = midline + Math.sin(angle) * amplitude * envelope(x);
                const half = halfThickness(x, phase + offset, height);
                if (half < 0.5) continue;

                // How face-on the surface is here: flatter slope, brighter band.
                const slope = (Math.cos(angle) * amplitude * Math.PI * 2) / width;
                const facing = 1 / Math.sqrt(1 + slope * slope * 4);
                const intensity = palette.alpha * weight * (0.35 + 0.65 * facing);

                const gradient = context.createLinearGradient(
                    0,
                    centre - half,
                    0,
                    centre + half,
                );
                gradient.addColorStop(0, `rgba(${palette.ink},0)`);
                gradient.addColorStop(0.32, `rgba(${palette.ink},${intensity * 0.55})`);
                gradient.addColorStop(0.5, `rgba(${palette.ink},${intensity})`);
                gradient.addColorStop(0.7, `rgba(${palette.ink},${intensity * 0.45})`);
                gradient.addColorStop(1, `rgba(${palette.ink},0)`);

                context.fillStyle = gradient;
                context.fillRect(px, centre - half, COLUMN + 1, half * 2);
            }
        };

        const draw = (time: number) => {
            // Scroll adds to the ambient drift rather than replacing it. A
            // purely scroll-bound wave sits still whenever the reader does, and
            // it only ever gets the slice of its range that overlaps the time
            // the form is actually on screen - which reads as a static image.
            const drift = reduced ? 1.2 : time * speed * Math.PI * 2;
            const phase = drift + (drive ? drive.get() * Math.PI * 2 : 0);

            context.clearRect(0, 0, width, height);
            // Back of the twist first, then the face, so the crossing reads.
            ribbon(phase, Math.PI, 0.4);
            ribbon(phase, 0, 1);
        };

        let last = 0;

        const loop = (time: number) => {
            last = time;
            if (visible) draw(time);
            frame = requestAnimationFrame(loop);
        };

        // Paint once, synchronously, before handing over to the frame loop.
        // requestAnimationFrame does not fire in a background tab or a stalled
        // compositor, and unlike the CSS entrances there is no resting state to
        // fall back on - without this the wave is simply absent.
        resize();
        draw(0);
        frame = requestAnimationFrame(loop);

        const observer = new ResizeObserver(() => {
            resize();
            draw(last);
        });
        observer.observe(canvas);

        // Repaint on theme change: the palette is read from the DOM, not props.
        const themeWatcher = new MutationObserver(() => {
            palette = readPalette(canvas);
            draw(last);
        });
        themeWatcher.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        // Stop burning frames while the section is off screen or the tab hides.
        const intersection = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
            },
            { rootMargin: "120px" },
        );
        intersection.observe(canvas);

        const onVisibility = () => {
            visible = !document.hidden;
        };
        document.addEventListener("visibilitychange", onVisibility);

        const unsubscribe = drive?.on("change", () => draw(last));

        return () => {
            cancelAnimationFrame(frame);
            observer.disconnect();
            themeWatcher.disconnect();
            intersection.disconnect();
            document.removeEventListener("visibilitychange", onVisibility);
            unsubscribe?.();
        };
    }, [drive, reduced, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            aria-hidden="true"
            style={{ display: "block", width: "100%", height: "100%" }}
        />
    );
}
