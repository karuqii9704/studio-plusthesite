import { Fragment, type ReactNode } from "react";
import { PlusWord } from "@/components/PlusLogo";

const TOKEN = "{plus}";

/**
 * Swap every `{plus}` token in a copy string for the animated mark.
 *
 * The brand name is a logo, not a word, so it never gets typeset - this keeps
 * that rule in one place instead of scattering JSX through the copy file.
 */
export function withPlus(text: string): ReactNode {
    if (!text.includes(TOKEN)) return text;

    return text.split(TOKEN).map((chunk, index, all) => (
        <Fragment key={index}>
            {chunk}
            {index < all.length - 1 && <PlusWord />}
        </Fragment>
    ));
}

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
