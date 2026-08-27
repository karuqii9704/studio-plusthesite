import { Fragment, type ReactNode } from "react";
import { PlusWord } from "@/components/PlusLogo";
import { StudioWord } from "@/components/StudioWord";

/**
 * Copy markup.
 *
 * Three tokens, so every string in `copy.ts` stays a plain string in every
 * locale and there is exactly one place to change if the lockup changes:
 *
 *   {plus}     the animated plus. mark, inline and on the baseline
 *   {studio}   the Fraunces lockup of the word Studio
 *   *word*     an accent word, set in Fraunces italic
 *
 * The product name is drawn, never typeset.
 */
const SPLITTER = /(\{plus\}|\{studio\}|\*[^*]+\*)/g;

export function withPlus(text: string): ReactNode {
    if (!/[{*]/.test(text)) return text;

    return text.split(SPLITTER).map((chunk, index) => {
        let node: ReactNode = chunk;

        if (chunk === "{plus}") {
            node = <PlusWord />;
        } else if (chunk === "{studio}") {
            node = <StudioWord />;
        } else if (chunk.length > 2 && chunk.startsWith("*") && chunk.endsWith("*")) {
            node = <span className="accent-serif">{chunk.slice(1, -1)}</span>;
        }

        return <Fragment key={index}>{node}</Fragment>;
    });
}
