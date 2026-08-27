import React, { useState } from "react";
import {
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Eye,
    HelpCircle,
    Pause,
    Play,
    PlayCircle,
    Sparkles,
    Wand2,
} from "lucide-react";
import { STUDIO_FAQ, STUDIO_TUTORIALS } from "@/lib/studioData";

export const UserGuide: React.FC<{ onStartTour: (tab: string) => void }> = ({
    onStartTour,
}) => {
    const [activeVideo, setActiveVideo] = useState<string | null>(STUDIO_TUTORIALS[0]?.id ?? null);
    const [openFAQ, setOpenFAQ] = useState<number | null>(0);

    const currentVideo = STUDIO_TUTORIALS.find((video) => video.id === activeVideo) ?? null;

    return (
        <div className="animate-in fade-in space-y-8 duration-500">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-slate-200 bg-gradient-to-r from-[#f7efe2] via-white to-[#e8f4ff] p-8 dark:border-white/10 dark:from-[#3b2e1d]/50 dark:via-slate-950 dark:to-sky-950/50">
                <div className="pointer-events-none absolute -right-12 top-0 h-56 w-56 rounded-full bg-amber-300/15 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 left-10 h-40 w-40 rounded-full bg-sky-400/15 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Studio onboarding
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
                            Jalur cepat untuk menguasai workspace PLUS
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Mulai dari tur interaktif, lanjut ke video singkat, lalu pakai FAQ ini
                            sebagai pegangan harian saat tim sedang bergerak cepat.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            onClick={() => onStartTour("planner")}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
                        >
                            <Sparkles size={16} className="text-amber-600" />
                            Mulai tur planner
                        </button>
                        <button
                            onClick={() => onStartTour("generator")}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                        >
                            <Wand2 size={16} />
                            Tur generator
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="space-y-5">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        <PlayCircle size={20} className="text-sky-600 dark:text-sky-300" />
                        Video walkthrough
                    </h3>

                    <div className="group relative aspect-video overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(10,10,10,0.14)] dark:border-white/10">
                        {currentVideo ? (
                            <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_28%),linear-gradient(180deg,_rgba(10,10,10,0.95)_0%,_rgba(10,10,10,1)_100%)] p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                                            Sekarang diputar
                                        </p>
                                        <h4 className="mt-3 max-w-lg text-2xl font-semibold text-white">
                                            {currentVideo.title}
                                        </h4>
                                    </div>
                                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white">
                                        {currentVideo.duration}
                                    </span>
                                </div>

                                <div className="flex items-center justify-center gap-4">
                                    <button className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
                                        <ArrowRight size={20} className="rotate-180" />
                                    </button>
                                    <button
                                        onClick={() => setActiveVideo(null)}
                                        className="rounded-full bg-white p-4 text-slate-950 transition-transform hover:scale-105"
                                    >
                                        <Pause size={24} fill="currentColor" />
                                    </button>
                                    <button className="rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>

                                <div>
                                    <div className="h-1 overflow-hidden rounded-full bg-white/10">
                                        <div className="h-full w-1/3 rounded-full bg-rose-400" />
                                    </div>
                                    <p className="mt-3 text-xs text-slate-300">
                                        Rehearsal player untuk preview alur belajar tim.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                                <p className="text-sm text-slate-400">
                                    Pilih video di bawah untuk membuka walkthrough.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {STUDIO_TUTORIALS.map((video) => (
                            <button
                                key={video.id}
                                onClick={() => setActiveVideo(video.id)}
                                className={`group overflow-hidden rounded-[1.25rem] border text-left transition-all ${
                                    activeVideo === video.id
                                        ? "border-sky-500 ring-1 ring-sky-500"
                                        : "border-slate-200 hover:border-sky-400/60 dark:border-white/10 dark:hover:border-white/30"
                                }`}
                            >
                                <div
                                    className={`relative flex aspect-video flex-col justify-end bg-gradient-to-br ${video.thumbnail} p-3`}
                                >
                                    <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/0" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                        <div className="rounded-full bg-black/50 p-2 backdrop-blur">
                                            <Play size={16} className="text-white" fill="white" />
                                        </div>
                                    </div>
                                    <span className="relative z-10 ml-auto rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                                        {video.duration}
                                    </span>
                                </div>
                                <div className="bg-white p-3 dark:bg-slate-900/50">
                                    <h5 className="line-clamp-2 text-xs font-bold leading-snug text-slate-800 transition-colors group-hover:text-sky-600 dark:text-white dark:group-hover:text-sky-300">
                                        {video.title}
                                    </h5>
                                    <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-500">
                                        <Eye size={10} /> {video.views} views
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                        <HelpCircle size={20} className="text-emerald-500 dark:text-emerald-400" />
                        FAQ
                    </h3>

                    <div className="space-y-3">
                        {STUDIO_FAQ.map((item, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-[1.2rem] border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-800/30"
                            >
                                <button
                                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                                    className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
                                >
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        {item.q}
                                    </span>
                                    {openFAQ === index ? (
                                        <ChevronUp size={16} className="text-slate-400" />
                                    ) : (
                                        <ChevronDown size={16} className="text-slate-400" />
                                    )}
                                </button>
                                {openFAQ === index ? (
                                    <div className="border-t border-slate-100 bg-slate-50 px-4 pb-4 pt-3 text-xs leading-7 text-slate-500 dark:border-white/5 dark:bg-black/20 dark:text-slate-400">
                                        {item.a}
                                    </div>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[1.4rem] border border-sky-200 bg-sky-50 p-5 dark:border-sky-500/30 dark:bg-sky-900/20">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-600 dark:text-sky-300">
                            Need backup?
                        </p>
                        <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
                            Kalau tim butuh walkthrough tambahan atau handoff khusus, kirim konteks
                            workflow dan kami bantu arahkan langkah berikutnya.
                        </p>
                        <a
                            href="mailto:plusthesite@gmail.com"
                            className="mt-4 block rounded-xl bg-slate-950 py-3 text-center text-xs font-semibold text-white transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
                        >
                            Hubungi support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};
