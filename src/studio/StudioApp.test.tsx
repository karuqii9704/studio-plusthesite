import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

const hasSessionToRestore = vi.fn<() => boolean>();
const loadSupabase = vi.fn();

vi.mock("@/lib/session", () => ({
    hasSessionToRestore: () => hasSessionToRestore(),
    loadSupabase: () => loadSupabase(),
}));

// The three screens are lazy chunks; mocking them keeps this test about the
// routing decision rather than about what they render.
vi.mock("./landing/StudioLanding", () => ({
    StudioLanding: () => <p>landing</p>,
}));
vi.mock("./StudioDashboard", () => ({
    StudioDashboard: () => <p>workspace</p>,
}));
vi.mock("./StudioLogin", () => ({ StudioLogin: () => <p>login</p> }));

const { default: StudioApp } = await import("./StudioApp");

function fakeClient(session: unknown) {
    return {
        auth: {
            getSession: async () => ({ data: { session } }),
            onAuthStateChange: () => ({
                data: { subscription: { unsubscribe: () => {} } },
            }),
        },
    } as unknown as SupabaseClient;
}

describe("StudioApp session handling", () => {
    beforeEach(() => {
        hasSessionToRestore.mockReset();
        loadSupabase.mockReset();
    });

    it("never asks for the Supabase SDK when there is no session to restore", async () => {
        hasSessionToRestore.mockReturnValue(false);

        render(<StudioApp />);

        expect(screen.getByText("landing")).toBeInTheDocument();
        // The whole point of the session module: a visitor who never signed in
        // does not pay for the 217 kB client.
        expect(loadSupabase).not.toHaveBeenCalled();
    });

    it("opens the workspace when a stored session comes back", async () => {
        hasSessionToRestore.mockReturnValue(true);
        loadSupabase.mockResolvedValue(
            fakeClient({ user: { id: "u1", email: "a@b.c" } }),
        );

        render(<StudioApp />);

        await waitFor(() => {
            expect(screen.getByText("workspace")).toBeInTheDocument();
        });
        expect(loadSupabase).toHaveBeenCalledTimes(1);
    });

    it("stays on the landing when the stored session is gone", async () => {
        hasSessionToRestore.mockReturnValue(true);
        loadSupabase.mockResolvedValue(fakeClient(null));

        render(<StudioApp />);

        await waitFor(() => {
            expect(loadSupabase).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("landing")).toBeInTheDocument();
        expect(screen.queryByText("workspace")).not.toBeInTheDocument();
    });

    it("stays on the landing when Supabase is not configured", async () => {
        hasSessionToRestore.mockReturnValue(true);
        loadSupabase.mockResolvedValue(null);

        render(<StudioApp />);

        await waitFor(() => {
            expect(loadSupabase).toHaveBeenCalledTimes(1);
        });
        expect(screen.getByText("landing")).toBeInTheDocument();
    });
});
