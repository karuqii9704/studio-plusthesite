import { lazy, type ComponentType, type LazyExoticComponent } from "react";

export type AddNotification = (
    type: "success" | "error",
    message: string,
) => void;

export interface ViewProps {
    addNotification: AddNotification;
}

/**
 * One chunk per tab, so the dashboard ships the shell instead of all eight
 * views. Split by importer rather than by hand: the loaders below are the
 * single place a view is named, and `STUDIO_VIEWS` derives from them.
 */
export const VIEW_LOADERS = {
    planner: () =>
        import("./core/ViewPlanner").then((m) => ({ default: m.ViewPlanner })),
    generator: () =>
        import("./core/ViewGenerator").then((m) => ({ default: m.ViewGenerator })),
    strategy: () =>
        import("./core/ViewStrategy").then((m) => ({ default: m.ViewStrategy })),
    repurpose: () =>
        import("./core/ViewRepurpose").then((m) => ({ default: m.ViewRepurpose })),
    livestream: () =>
        import("./growth/ViewLiveStream").then((m) => ({
            default: m.ViewLiveStream,
        })),
    analytics: () =>
        import("./growth/ViewAnalytics").then((m) => ({ default: m.ViewAnalytics })),
    kol: () => import("./growth/ViewKOL").then((m) => ({ default: m.ViewKOL })),
    subscription: () =>
        import("./growth/ViewSubscription").then((m) => ({
            default: m.ViewSubscription,
        })),
} satisfies Record<string, () => Promise<{ default: ComponentType<ViewProps> }>>;

export type StudioTab = keyof typeof VIEW_LOADERS;

export const DEFAULT_TAB: StudioTab = "planner";

export const STUDIO_VIEWS = Object.fromEntries(
    Object.entries(VIEW_LOADERS).map(([tab, load]) => [tab, lazy(load)]),
) as Record<StudioTab, LazyExoticComponent<ComponentType<ViewProps>>>;

/** The tab's view, falling back to the planner for an unknown tab id. */
export function getStudioView(tab: string): ComponentType<ViewProps> {
    return STUDIO_VIEWS[tab as StudioTab] ?? STUDIO_VIEWS[DEFAULT_TAB];
}
