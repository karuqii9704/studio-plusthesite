import { describe, expect, it } from "vitest";
import { DEFAULT_TAB, getStudioView, STUDIO_VIEWS, VIEW_LOADERS } from "./registry";

describe("studio view registry", () => {
    it("registers a view for every tab the sidebar offers", () => {
        expect(Object.keys(STUDIO_VIEWS).sort()).toEqual([
            "analytics",
            "generator",
            "kol",
            "livestream",
            "planner",
            "repurpose",
            "strategy",
            "subscription",
        ]);
    });

    it("wraps every entry in a lazy component", () => {
        for (const [tab, view] of Object.entries(STUDIO_VIEWS)) {
            expect(typeof view, `${tab} is a component`).not.toBe("function");
            expect(view, `${tab} carries the lazy marker`).toHaveProperty("$$typeof");
        }
    });

    it("resolves every chunk the tabs point at", async () => {
        for (const [tab, load] of Object.entries(VIEW_LOADERS)) {
            const mod = await load();
            expect(mod.default, `${tab} chunk export`).toBeDefined();
            expect(
                ["function", "object"],
                `${tab} chunk exports a component`,
            ).toContain(typeof mod.default);
        }
    });

    it("falls back to the default tab for an unknown id", () => {
        expect(getStudioView("tidak-ada")).toBe(STUDIO_VIEWS[DEFAULT_TAB]);
    });
});
