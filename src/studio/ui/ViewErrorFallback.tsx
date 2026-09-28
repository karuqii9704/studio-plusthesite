import { useLocale } from "@/i18n/I18nProvider";

const COPY = {
    id: {
        title: "Bagian ini gagal dimuat",
        body: "Terjadi error saat menampilkan halaman ini. Sisa workspace tetap jalan - coba lagi dulu, atau kembali ke beranda.",
        retry: "Coba lagi",
        reload: "Muat ulang",
        home: "Kembali ke beranda",
        detail: "Detail teknis",
    },
    en: {
        title: "This section failed to load",
        body: "Something went wrong while rendering this page. The rest of the workspace is fine - try again first, or head back to the landing page.",
        retry: "Try again",
        reload: "Reload",
        home: "Back to landing",
        detail: "Technical detail",
    },
} as const;

/**
 * Per-view error screen. Lives inside the providers, so unlike the default
 * fallback in `components/ErrorBoundary` it can follow the active locale.
 *
 * `reset` remounts the boundary's children; `onHome` is for the case where the
 * view stays broken - the session and the rest of the shell survive either way.
 */
export function ViewErrorFallback({
    error,
    reset,
    onHome,
}: {
    error: Error;
    reset: () => void;
    onHome?: () => void;
}) {
    const copy = COPY[useLocale()];

    return (
        <div className="flex min-h-[60vh] items-center justify-center p-6">
            <div className="w-full max-w-xl rounded-3xl border border-border bg-card-bg p-8 text-center shadow-2xl">
                <h2 className="text-xl font-bold text-foreground">{copy.title}</h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-muted">
                    {copy.body}
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                        onClick={reset}
                        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-white shadow-lg transition-colors hover:bg-primary-dark"
                    >
                        {copy.retry}
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-hover"
                    >
                        {copy.reload}
                    </button>
                    {onHome ? (
                        <button
                            onClick={onHome}
                            className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-surface-hover"
                        >
                            {copy.home}
                        </button>
                    ) : null}
                </div>
                <details className="mt-6 text-left text-xs text-muted">
                    <summary className="cursor-pointer">{copy.detail}</summary>
                    <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 font-mono text-[11px]">
                        {error.message}
                    </pre>
                </details>
            </div>
        </div>
    );
}
