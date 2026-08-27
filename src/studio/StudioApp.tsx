import { Suspense, lazy, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
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

    useEffect(() => {
        if (!supabase) return;

        void supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUser(session.user);
                setView("app");
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                setView("app");
            } else {
                setUser(null);
                setView("landing");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase?.auth.signOut();
        setUser(null);
        setView("landing");
    };

    const openLogin = (email?: string) => {
        setPrefillEmail(email ?? "");
        setView("login");
    };

    if (view === "login") {
        return (
            <Suspense fallback={<ChunkFallback />}>
                <StudioLogin
                    initialEmail={prefillEmail}
                    onLoginSuccess={() => setView("app")}
                    onBack={() => setView("landing")}
                />
            </Suspense>
        );
    }

    if (view === "app") {
        return (
            <Suspense fallback={<ChunkFallback />}>
                <StudioDashboard onLogout={handleLogout} user={user} />
            </Suspense>
        );
    }

    return <StudioLanding onStart={openLogin} onLoginClick={() => openLogin()} />;
}
