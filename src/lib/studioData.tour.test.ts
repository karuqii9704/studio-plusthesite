import { describe, expect, it } from "vitest";
import { TOUR_STEPS } from "./studioData";
import { VIEW_LOADERS } from "@/studio/views/registry";

/**
 * Every view, as text, so a step's targetId can be checked against the anchors
 * that actually exist. A step pointing at a missing id does not crash the
 * tour: it silently skips the highlight, which is exactly the kind of break
 * nobody notices by clicking around.
 */
const sources = import.meta.glob("/src/**/*.tsx", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

/**
 * Anchors are written two ways here: straight onto the element
 * (`id="strat-input"`) and held in a field config that renders as
 * `id={field.inputId}` (the planner). Both count.
 */
const ANCHOR_PATTERNS = [/id="([^"]+)"/g, /[Ii]d:\s*"([^"]+)"/g];

const anchorIds = new Set(
    Object.values(sources)
        .join("\n")
        .split("\n")
        .flatMap((line) =>
            ANCHOR_PATTERNS.flatMap((pattern) =>
                [...line.matchAll(pattern)].map((match) => match[1]),
            ),
        ),
);

describe("tour steps", () => {
    it("covers every tab the sidebar offers", () => {
        expect(Object.keys(TOUR_STEPS).sort()).toEqual(
            Object.keys(VIEW_LOADERS).sort(),
        );
    });

    it("points every step at an anchor that exists in the source", () => {
        for (const [tab, steps] of Object.entries(TOUR_STEPS)) {
            for (const step of steps) {
                expect(
                    anchorIds.has(step.targetId),
                    `${tab}: tidak ada elemen id="${step.targetId}"`,
                ).toBe(true);
            }
        }
    });

    it("gives every tab a tour worth starting", () => {
        for (const [tab, steps] of Object.entries(TOUR_STEPS)) {
            expect(steps.length, `${tab} punya langkah`).toBeGreaterThanOrEqual(2);
            for (const step of steps) {
                expect(step.title, `${tab}: judul`).not.toBe("");
                expect(step.desc, `${tab}: deskripsi`).not.toBe("");
                expect(
                    ["top", "bottom", "left", "right"],
                    `${tab}: posisi`,
                ).toContain(step.position);
            }
        }
    });
});
