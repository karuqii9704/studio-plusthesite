import "@testing-library/jest-dom/vitest";

/**
 * jsdom has no matchMedia and no IntersectionObserver; framer-motion and the
 * landing-page `useAppear` hook both reach for them on mount.
 */
if (!window.matchMedia) {
    window.matchMedia = ((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}

if (!globalThis.IntersectionObserver) {
    class StubIntersectionObserver implements IntersectionObserver {
        readonly root = null;
        readonly rootMargin = "";
        readonly thresholds: ReadonlyArray<number> = [];
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords(): IntersectionObserverEntry[] {
            return [];
        }
    }
    globalThis.IntersectionObserver =
        StubIntersectionObserver as unknown as typeof IntersectionObserver;
}

if (!window.scrollTo) {
    window.scrollTo = (() => {}) as unknown as typeof window.scrollTo;
}
