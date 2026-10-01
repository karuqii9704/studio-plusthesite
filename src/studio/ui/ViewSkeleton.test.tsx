import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GENERIC_SHAPE, SKELETON_SHAPES, ViewSkeleton } from "./ViewSkeleton";
import { VIEW_LOADERS } from "@/studio/views/registry";

const blocksIn = (container: HTMLElement) =>
    container.querySelectorAll(".animate-pulse").length;

describe("ViewSkeleton", () => {
    it("has a shape for every tab the sidebar offers", () => {
        expect(Object.keys(SKELETON_SHAPES).sort()).toEqual(
            Object.keys(VIEW_LOADERS).sort(),
        );
    });

    it.each(Object.keys(VIEW_LOADERS))("draws %s with its own blocks", (tab) => {
        const { container } = render(<ViewSkeleton tab={tab} />);

        expect(container.querySelector(`[data-skeleton="${tab}"]`)).not.toBeNull();
        expect(blocksIn(container)).toBeGreaterThan(1);
    });

    it("announces itself as a busy region", () => {
        render(<ViewSkeleton tab="planner" />);

        expect(screen.getByRole("status")).toHaveAttribute("aria-busy", "true");
    });

    it("falls back to the generic shape for a tab it does not know", () => {
        // The dashboard already falls back to the planner for an unknown tab;
        // the skeleton must not be the one thing that throws.
        const unknown = render(<ViewSkeleton tab="entah-apa" />);
        const generic = render(<>{GENERIC_SHAPE}</>);

        expect(unknown.container.querySelector('[data-skeleton="entah-apa"]')).not.toBeNull();
        expect(blocksIn(unknown.container)).toBe(blocksIn(generic.container));
    });
});
