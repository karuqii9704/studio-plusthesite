import { afterEach, describe, expect, it } from "vitest";
import { hasSessionToRestore, loadSupabase } from "./session";

const goTo = (url: string) => window.history.replaceState({}, "", url);

afterEach(() => {
    window.localStorage.clear();
    goTo("/");
});

describe("hasSessionToRestore", () => {
    it("is false for a visitor with nothing stored", () => {
        expect(hasSessionToRestore()).toBe(false);
    });

    it("recognises the key gotrue-js keeps the session under", () => {
        window.localStorage.setItem("sb-abcdefgh-auth-token", "{}");

        expect(hasSessionToRestore()).toBe(true);
    });

    it("ignores unrelated storage", () => {
        window.localStorage.setItem("theme", "dark");

        expect(hasSessionToRestore()).toBe(false);
    });

    it("sees an implicit-flow OAuth return in the hash", () => {
        goTo("/#access_token=abc&refresh_token=def");

        expect(hasSessionToRestore()).toBe(true);
    });

    it("sees a PKCE code in the query", () => {
        goTo("/?code=abc");

        expect(hasSessionToRestore()).toBe(true);
    });

    it("does not mistake ordinary query strings for a session", () => {
        goTo("/?utm_source=newsletter");

        expect(hasSessionToRestore()).toBe(false);
    });
});

describe("loadSupabase", () => {
    it("imports the client once and hands out the same promise after", async () => {
        const first = loadSupabase();

        expect(loadSupabase()).toBe(first);
        // No VITE_* env in the test run, so the module resolves to its
        // "not configured" null client. Here it only has to resolve at all.
        await expect(first).resolves.toBeNull();
    });
});
