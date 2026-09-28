import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    /**
     * Rendered once something below throws. Receives the error and a `reset`
     * that re-mounts the children, so a view can recover without a page reload.
     */
    fallback?: (state: { error: Error; reset: () => void }) => ReactNode;
    /** Reported upward so a host can log it somewhere durable. */
    onError?: (error: Error, info: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    error: Error | null;
}

/**
 * Catches render-time errors so one broken component cannot blank the studio.
 *
 * React only routes render, lifecycle and constructor errors here. A rejected
 * promise (a failed `/api/ai` call, say) is *not* caught - the caller still has
 * to handle it, or rethrow it from inside an async boundary of its own.
 */
export default class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    state: ErrorBoundaryState = { error: null };

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("[studio] unhandled render error", error, info.componentStack);
        this.props.onError?.(error, info);
    }

    reset = () => this.setState({ error: null });

    render() {
        const { error } = this.state;
        if (!error) return this.props.children;
        if (this.props.fallback) {
            return this.props.fallback({ error, reset: this.reset });
        }
        return <DefaultErrorFallback error={error} onReset={this.reset} />;
    }
}

/**
 * Last-resort fallback. Deliberately free of context and i18n hooks: it has to
 * render even when the provider that threw is the one being caught, so the copy
 * carries both languages instead of reading the active locale.
 */
function DefaultErrorFallback({
    error,
    onReset,
}: {
    error: Error;
    onReset: () => void;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
            <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 shadow-2xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                    PLUS Studio
                </p>
                <h1 className="mt-3 text-2xl font-bold tracking-tight">
                    Terjadi kesalahan &middot; Something went wrong
                </h1>
                <p className="mt-3 text-sm leading-7 text-muted">
                    Bagian ini gagal dimuat. Sisa workspace tidak terpengaruh -
                    coba lagi atau muat ulang halaman.
                    <br />
                    This part failed to render. The rest of the workspace is fine
                    - try again, or reload the page.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <button
                        onClick={onReset}
                        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark"
                    >
                        Coba lagi &middot; Try again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-bold transition-colors hover:bg-surface-hover"
                    >
                        Muat ulang &middot; Reload
                    </button>
                </div>
                <details className="mt-6 text-xs text-muted">
                    <summary className="cursor-pointer">
                        Detail teknis &middot; Technical detail
                    </summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 font-mono text-[11px]">
                        {error.message}
                    </pre>
                </details>
            </div>
        </div>
    );
}
