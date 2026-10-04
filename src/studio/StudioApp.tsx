import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import ErrorBoundary from "@/components/ErrorBoundary";
import { hasSessionToRestore, loadSupabase } from "@/lib/session";
import { ViewErrorFallback } from "./ui/ViewErrorFallback";
import { StudioLanding } from "./landing/StudioLanding";

/**
 * The workspace pulls in Gemini, the tour, and every view; the landing page
 * needs none of it. Splitting here keeps first paint to the landing bundle.
 */
const StudioDashboard = lazy(() =>
    import("./StudioDashboard").then((m) => ({ default: m.StudioDashboard })),
);
const StudioLogin = lazy(() =>
    import("./StudioLogin").then((m) => ({ default: m.StudioLogin })),
);

function ChunkFallback() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        </div>
    );
}

type View = "landing" | "login" | "app";

/**
 * Top-level routing for the studio.
 *
 * Three states, no router: the landing page, the auth panel, and the
 * workspace. Supabase owns the session, so the view follows auth state rather
 * than the URL - a signed-in visitor lands straight in the dashboard.
 */
export default function StudioApp() {
    // Dev-only escape hatch: ?view=app renders the workspace without a session,
    // so the dashboard can be worked on before Supabase is wired up locally.
    const [view, setView] = useState<View>(() => {
        if (!import.meta.env.DEV) return "landing";
        const requested = new URLSearchParams(window.location.search).get("view");
        return requested === "app" || requested === "login" ? requested : "landing";
    });
    const [user, setUser] = useState<User | null>(null);
    const [prefillEmail, setPrefillEmail] = useState("");
    const clientRef = useRef<SupabaseClient | null>(null);

    useEffect(() => {
        // Nothing to restore: the landing stays on screen and the Supabase SDK
        // is never fetched. See lib/session.ts for what counts as a session.
        if (!hasSessionToRestore()) return;

        let active = true;
        let unsubscribe: (() => void) | undefined;

        void loadSupabase().then((client) => {
            if (!client || !active) return;
            clientRef.current = client;

            void client.auth.getSession().then(({ data: { session } }) => {
                if (!active || !session) return;
                setUser(session.user);
                setView("app");
            });

            const { data } = client.auth.onAuthStateChange((_event, session) => {
                if (!active) return;
                if (session) {
                    setUser(session.user);
                    setView("app");
                } else {
                    setUser(null);
                    setView("landing");
                }
            });
            unsubscribe = () => data.subscription.unsubscribe();
        });

        return () => {
            active = false;
            unsubscribe?.();
        };
    }, []);

    const handleLogout = async () => {
        const client = clientRef.current ?? (await loadSupabase());
        await client?.auth.signOut();
        setUser(null);
        setView("landing");
    };

    const openLogin = (email?: string) => {
        setPrefillEmail(email ?? "");
        setView("login");
    };

    if (view === "login") {
        return (
            <ErrorBoundary
                fallback={({ error, reset }) => (
                    <ViewErrorFallback
                        error={error}
                        reset={reset}
                        onHome={() => setView("landing")}
                    />
                )}
            >
                <Suspense fallback={<ChunkFallback />}>
                    <StudioLogin
                        initialEmail={prefillEmail}
                        onLoginSuccess={() => setView("app")}
                        onBack={() => setView("landing")}
                    />
                </Suspense>
            </ErrorBoundary>
        );
    }

    if (view === "app") {
        return (
            // A crash inside the workspace - a broken view, a failed chunk -
            // stays here: the landing page and the session survive it.
            <ErrorBoundary
                fallback={({ error, reset }) => (
                    <ViewErrorFallback
                        error={error}
                        reset={reset}
                        onHome={() => setView("landing")}
                    />
                )}
            >
                <Suspense fallback={<ChunkFallback />}>
                    <StudioDashboard onLogout={handleLogout} user={user} />
                </Suspense>
            </ErrorBoundary>
        );
    }

    return (
        <ErrorBoundary
            fallback={({ error, reset }) => (
                <ViewErrorFallback error={error} reset={reset} />
            )}
        >
            <StudioLanding onStart={openLogin} onLoginClick={() => openLogin()} />
        </ErrorBoundary>
    );
}
