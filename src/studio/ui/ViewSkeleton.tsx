import type { ReactNode } from "react";

/**
 * What a tab shows while its chunk is still on the wire.
 *
 * Every view is a lazy chunk, so a tab switch always paints a Suspense
 * fallback first. A lone spinner reads as "nothing happened"; these layouts
 * trace the shape of the view that is coming - same card, border, and radius
 * tokens - so the tab looks like it is filling in. Decorative only: the
 * wrapper carries the status role for screen readers.
 */

/** One shimmering placeholder block. Everything below is built from these. */
function Block({ className = "" }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-2xl border border-border bg-surface motion-reduce:animate-none ${className}`}
        />
    );
}

/** A grid of equal placeholder cards, for the list-shaped views. */
function CardGrid({ count, className }: { count: number; className: string }) {
    return (
        <div className={className}>
            {Array.from({ length: count }, (_, i) => (
                <Block key={i} className="h-48" />
            ))}
        </div>
    );
}

/** The first column, so adding a view without a shape fails its test. */
export const GENERIC_SHAPE = (
    <>
        <Block className="h-32" />
        <CardGrid count={4} className="grid grid-cols-1 gap-5 md:grid-cols-2" />
    </>
);

/**
 * One entry per tab in `views/registry.ts`. The registry test asserts the two
 * key sets match, so a new view lands here with a shape of its own.
 */
export const SKELETON_SHAPES: Record<string, ReactNode> = {
    planner: (
        <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
            <Block className="h-[420px]" />
            <Block className="h-[420px]" />
        </div>
    ),
    generator: (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-4 lg:col-span-4">
                <Block className="h-44" />
                <Block className="h-24" />
                <Block className="h-12" />
            </div>
            <CardGrid count={4} className="grid grid-cols-2 gap-4 lg:col-span-8" />
        </div>
    ),
    strategy: (
        <>
            <Block className="h-72" />
            <CardGrid count={3} className="grid grid-cols-1 gap-6 md:grid-cols-3" />
        </>
    ),
    repurpose: (
        <>
            <Block className="h-64" />
            <CardGrid count={4} className="grid grid-cols-1 gap-5 lg:grid-cols-2" />
        </>
    ),
    livestream: (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Block className="min-h-[400px] lg:col-span-2" />
            <div className="flex flex-col gap-4">
                {[0, 1, 2].map((i) => (
                    <Block key={i} className="h-28" />
                ))}
            </div>
        </div>
    ),
    analytics: (
        <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                    <Block key={i} className="h-28" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Block className="h-80 lg:col-span-3" />
                <Block className="h-80 lg:col-span-2" />
            </div>
        </>
    ),
    kol: (
        <>
            <Block className="h-20" />
            <CardGrid
                count={6}
                className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            />
        </>
    ),
    subscription: (
        <>
            <CardGrid
                count={4}
                className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
            />
            <Block className="h-56" />
        </>
    ),
};

export function ViewSkeleton({ tab }: { tab: string }) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label="Memuat workspace"
            data-skeleton={tab}
            className="space-y-6 pb-24"
        >
            {SKELETON_SHAPES[tab] ?? GENERIC_SHAPE}
        </div>
    );
}
