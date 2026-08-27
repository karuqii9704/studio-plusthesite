import { GLYPHS, LOGO_VIEW_BOX, MARK_D } from "@/lib/logoPaths";

const SIZES = {
    small: "w-16",
    default: "w-24",
    large: "w-32",
} as const;

const VARIANTS = {
    dark: "text-black",
    light: "text-white",
    auto: "text-foreground",
} as const;

export type LogoProps = {
    /** Kept from the original API: `dark` on light grounds, `light` on dark ones. */
    variant?: keyof typeof VARIANTS;
    size?: keyof typeof SIZES;
    href?: string;
    className?: string;
};

/**
 * plus. wordmark.
 *
 * The vector trace from the marketing site, flattened to a single ink colour -
 * the studio palette is monochrome, so the mark and the glyphs share one fill
 * and inherit it from `currentColor`.
 */
export default function Logo({
    variant = "auto",
    size = "default",
    href,
    className = "",
}: LogoProps) {
    const mark = (
        <svg
            viewBox={LOGO_VIEW_BOX}
            role="img"
            aria-label="plus."
            className={`h-auto ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
        >
            <path d={MARK_D} fill="currentColor" />
            {GLYPHS.map((glyph) => (
                <path key={glyph.name} d={glyph.d} fill="currentColor" />
            ))}
        </svg>
    );

    if (!href) return mark;

    return (
        <a href={href} aria-label="plus. studio" className="inline-flex">
            {mark}
        </a>
    );
}
