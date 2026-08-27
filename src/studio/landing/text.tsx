import { withPlus } from "@/components/PlusLogo";

export { withPlus };

/** A heading whose accent word is set in Instrument Serif italic. */
export function AccentHeading({
    before,
    accent,
    after = "",
    className = "",
    as: Tag = "h2",
}: {
    before: string;
    accent: string;
    after?: string;
    className?: string;
    as?: "h1" | "h2" | "h3";
}) {
    return (
        <Tag className={className}>
            {withPlus(before)}
            <span className="accent-serif">{withPlus(accent)}</span>
            {withPlus(after)}
        </Tag>
    );
}
