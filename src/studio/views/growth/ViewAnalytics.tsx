
import React, { useEffect, useState } from "react";
import {
    BarChart3,
    Megaphone,
    Image as ImageIcon,
    TrendingUp,
    Loader2,
    Lock,
    Users2,
    Activity,
    Wand2,
    Target,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Stats {
    campaigns: number;
    assets: number;
    strategies: number;
    kols: number;
    avgScore: number;
    scores: { label: string; score: number }[];
}

interface ActivityItem {
    kind: "campaign" | "asset" | "strategy" | "kol";
    label: string;
    at: string;
}

const RELATIVE = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "baru saja";
    if (m < 60) return `${m} mnt lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    const d = Math.floor(h / 24);
    return `${d} hr lalu`;
};

const KIND_META: Record<
    ActivityItem["kind"],
    { icon: React.ReactNode; tag: string; cls: string }
> = {
    campaign: {
        icon: <Megaphone size={14} />,
        tag: "Campaign",
        cls: "text-primary bg-primary/10",
    },
    asset: {
        icon: <Wand2 size={14} />,
        tag: "Aset AI",
        cls: "text-secondary bg-secondary/10",
    },
    strategy: {
        icon: <Target size={14} />,
        tag: "Strategi",
        cls: "text-tertiary bg-tertiary/10",
    },
    kol: {
        icon: <Users2 size={14} />,
        tag: "KOL",
        cls: "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10",
    },
};

export const ViewAnalytics = () => {
    const [stats, setStats] = useState<Stats>({
        campaigns: 0,
        assets: 0,
        strategies: 0,
        kols: 0,
        avgScore: 0,
        scores: [],
    });
    const [feed, setFeed] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(true);

    useEffect(() => {
        (async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session?.user) {
                setAuthed(false);
                setLoading(false);
                return;
            }

            const [campaignsRes, assetsRes, strategiesRes, kolsRes] = await Promise.all([
                supabase
                    .from("campaigns")
                    .select("name, created_at", { count: "exact" })
                    .order("created_at", { ascending: false })
                    .limit(8),
                supabase
                    .from("generated_assets")
                    .select("prompt, created_at", { count: "exact" })
                    .order("created_at", { ascending: false })
                    .limit(8),
                supabase
                    .from("strategies")
                    .select("title, result, created_at", { count: "exact" })
                    .order("created_at", { ascending: false })
                    .limit(12),
                supabase
                    .from("studio_kol_shortlist")
                    .select("kol_name, created_at", { count: "exact" })
                    .order("created_at", { ascending: false })
                    .limit(8),
            ]);

            const strategies = (strategiesRes.data ?? []) as {
                title: string | null;
                result: { score?: number } | null;
                created_at: string;
            }[];
            const scoreVals = strategies
                .map((item) => item.result?.score ?? 0)
                .filter((n) => n > 0);
            const avg = scoreVals.length
                ? Math.round(scoreVals.reduce((sum, n) => sum + n, 0) / scoreVals.length)
                : 0;

            setStats({
                campaigns: campaignsRes.count ?? 0,
                assets: assetsRes.count ?? 0,
                strategies: strategiesRes.count ?? 0,
                kols: kolsRes.count ?? 0,
                avgScore: avg,
                scores: strategies.slice(0, 12).reverse().map((item, index) => ({
                    label: item.title?.slice(0, 14) || `#${index + 1}`,
                    score: item.result?.score ?? 0,
                })),
            });

            const merged: ActivityItem[] = [
                ...(campaignsRes.data ?? []).map(
                    (item: { name: string | null; created_at: string }) => ({
                        kind: "campaign" as const,
                        label: item.name || "Campaign baru",
                        at: item.created_at,
                    })
                ),
                ...(assetsRes.data ?? []).map(
                    (item: { prompt: string | null; created_at: string }) => ({
                        kind: "asset" as const,
                        label: item.prompt?.slice(0, 48) || "Aset baru",
                        at: item.created_at,
                    })
                ),
                ...strategies.map((item) => ({
                    kind: "strategy" as const,
                    label: item.title || "Analisis",
                    at: item.created_at,
                })),
                ...(kolsRes.data ?? []).map(
                    (item: { kol_name: string | null; created_at: string }) => ({
                        kind: "kol" as const,
                        label: item.kol_name || "KOL",
                        at: item.created_at,
                    })
                ),
            ]
                .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
                .slice(0, 10);
            setFeed(merged);
            setLoading(false);
        })();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-muted">
                <Loader2 className="animate-spin" size={28} />
            </div>
        );
    }

    if (!authed) {
        return (
            <div className="flex h-64 flex-col items-center justify-center gap-3 text-center text-muted">
                <Lock size={32} />
                <p className="text-sm">Masuk untuk melihat analitik aktivitas Anda.</p>
            </div>
        );
    }

    const cards = [
        {
            l: "Campaign",
            v: stats.campaigns,
            icon: <Megaphone size={18} className="text-primary" />,
            c: "text-primary",
        },
        {
            l: "Aset AI",
            v: stats.assets,
            icon: <ImageIcon size={18} className="text-secondary" />,
            c: "text-secondary",
        },
        {
            l: "Rata-rata Skor Viral",
            v: stats.avgScore ? `${stats.avgScore}/100` : "-",
            icon: <TrendingUp size={18} className="text-tertiary" />,
            c: "text-tertiary",
        },
        {
            l: "Shortlist KOL",
            v: stats.kols,
            icon: <Users2 size={18} className="text-yellow-500" />,
            c: "text-yellow-600 dark:text-yellow-400",
        },
    ];

    const maxScore = Math.max(100, ...stats.scores.map((item) => item.score));
    const empty =
        stats.campaigns === 0 &&
        stats.assets === 0 &&
        stats.strategies === 0 &&
        stats.kols === 0;

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-card-bg border border-border p-5 rounded-2xl backdrop-blur-sm hover:bg-surface-hover transition-colors shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted uppercase font-bold">
                                {card.l}
                            </p>
                            {card.icon}
                        </div>
                        <h3 className={`mt-2 text-3xl font-black ${card.c}`}>
                            {card.v}
                        </h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-card-bg border border-border p-6 rounded-2xl shadow-xl transition-colors">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <BarChart3 size={18} className="text-primary" />
                        Skor Viral - Analisis Terakhir
                    </h3>
                    {stats.scores.length === 0 ? (
                        <p className="mt-6 py-8 text-center text-sm text-muted">
                            Belum ada analisis. Coba{" "}
                            <span className="font-semibold text-foreground">
                                Strategi - Cek Skor
                            </span>{" "}
                            untuk mulai mengisi grafik ini.
                        </p>
                    ) : (
                        <div className="mt-6 flex h-56 items-end gap-2">
                            {stats.scores.map((item, index) => (
                                <div
                                    key={index}
                                    className="group flex flex-1 flex-col items-center justify-end gap-2"
                                    title={`${item.label}: ${item.score}`}
                                >
                                    <span className="text-[10px] font-bold text-muted opacity-0 group-hover:opacity-100">
                                        {item.score}
                                    </span>
                                    <div
                                        className="w-full rounded-t-sm bg-gradient-to-t from-primary/50 to-primary-light transition-all group-hover:from-primary group-hover:to-primary-light"
                                        style={{
                                            height: `${Math.max(
                                                4,
                                                (item.score / maxScore) * 100
                                            )}%`,
                                        }}
                                    />
                                    <span className="w-full truncate text-center text-[9px] text-muted">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2 bg-card-bg border border-border p-6 rounded-2xl shadow-xl transition-colors">
                    <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Activity size={18} className="text-primary" />
                        Aktivitas Terbaru
                    </h3>
                    {feed.length === 0 ? (
                        <p className="mt-6 py-8 text-center text-sm text-muted">
                            Belum ada aktivitas.
                        </p>
                    ) : (
                        <div className="mt-5 space-y-3">
                            {feed.map((item, index) => {
                                const meta = KIND_META[item.kind];
                                return (
                                    <div key={index} className="flex items-center gap-3">
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.cls}`}
                                        >
                                            {meta.icon}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm text-foreground">
                                                {item.label}
                                            </p>
                                            <p className="text-[10px] text-muted">
                                                {meta.tag} - {RELATIVE(item.at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {empty && (
                <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center text-sm text-muted">
                    Mulai dengan membuat{" "}
                    <span className="font-semibold text-foreground">Campaign</span>,
                    membuat{" "}
                    <span className="font-semibold text-foreground">Aset AI</span>,
                    cek skor di{" "}
                    <span className="font-semibold text-foreground">Strategi</span>,
                    atau simpan{" "}
                    <span className="font-semibold text-foreground">KOL</span> -
                    data Anda akan muncul di sini secara real-time.
                </div>
            )}
        </div>
    );
};
