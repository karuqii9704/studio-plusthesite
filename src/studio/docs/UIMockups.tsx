import { Layout, Monitor, Smartphone } from "lucide-react";

const desktopCards = [
    "Traffic overview",
    "Revenue mix",
    "Ops workload",
];

const mobileCards = [
    "Campaign pulse",
    "Sales snapshot",
    "Inbox rhythm",
];

export const UIMockups = () => (
    <div className="flex h-full flex-col space-y-8">
        <div className="rounded-[1.8rem] border border-slate-200 bg-[linear-gradient(135deg,_#fff_0%,_#f8fafc_50%,_#eef6ff_100%)] p-8 dark:border-white/10 dark:bg-[linear-gradient(135deg,_rgba(10,10,10,0.95)_0%,_rgba(10,10,10,0.88)_50%,_rgba(12,12,12,0.82)_100%)]">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                        UI library
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
                        Visual direction untuk workspace PLUS
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                        Bukan sekadar placeholder frame. Library ini menunjukkan ritme layout,
                        density, dan layering yang dipakai untuk surface admin, mobile, dan
                        growth flows.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-950 p-5 text-white dark:bg-white/10">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300">
                            Layout stance
                        </p>
                        <p className="mt-4 text-lg font-semibold">
                            Dense but readable
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-white/5 dark:ring-white/10">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                            Motion mood
                        </p>
                        <p className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                            Calm, directional, and fast
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-400/10 dark:text-sky-300">
                    <Monitor size={20} />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                        Desktop operations board
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Surface untuk command center, performance summary, dan workflow sequencing.
                    </p>
                </div>
            </div>

            <div className="group relative aspect-[16/10] overflow-hidden rounded-[1.8rem] border border-slate-200 bg-slate-950 shadow-[0_22px_70px_rgba(10,10,10,0.18)] dark:border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_30%),linear-gradient(180deg,_rgba(10,10,10,0.98)_0%,_rgba(10,10,10,1)_100%)]" />
                <div className="absolute inset-0 p-5">
                    <div className="flex h-full rounded-[1.4rem] border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="flex w-[92px] flex-col items-center gap-4 border-r border-white/10 bg-black/15 px-4 py-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-400 text-white">
                                <Layout size={18} />
                            </div>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    key={item}
                                    className="h-10 w-10 rounded-2xl bg-white/10"
                                />
                            ))}
                        </div>

                        <div className="flex-1 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="h-4 w-28 rounded-full bg-white/15" />
                                    <div className="mt-3 h-9 w-64 rounded-2xl bg-white/10" />
                                </div>
                                <div className="h-10 w-36 rounded-full bg-sky-400/20" />
                            </div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                                {desktopCards.map((card) => (
                                    <div
                                        key={card}
                                        className="rounded-[1.3rem] border border-white/10 bg-white/10 p-4"
                                    >
                                        <div className="h-3 w-24 rounded-full bg-white/20" />
                                        <div className="mt-5 h-16 rounded-2xl bg-white/10" />
                                        <div className="mt-4 h-3 w-16 rounded-full bg-sky-300/40" />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                                <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-5">
                                    <div className="h-4 w-32 rounded-full bg-white/20" />
                                    <div className="mt-5 grid gap-3">
                                        {[1, 2, 3, 4].map((row) => (
                                            <div
                                                key={row}
                                                className="flex items-center justify-between rounded-2xl bg-black/15 px-4 py-3"
                                            >
                                                <div className="h-3 w-24 rounded-full bg-white/20" />
                                                <div className="h-3 w-16 rounded-full bg-emerald-300/40" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-[1.4rem] border border-white/10 bg-white/10 p-5">
                                    <div className="h-4 w-28 rounded-full bg-white/20" />
                                    <div className="mt-5 h-[190px] rounded-[1.25rem] bg-[linear-gradient(180deg,_rgba(255,255,255,0.28)_0%,_rgba(255,255,255,0.08)_100%)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
                        High-fidelity desktop canvas
                    </div>
                </div>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300">
                    <Smartphone size={20} />
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                        Mobile action stack
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Preview untuk quick actions, performance pulses, dan feed cards yang lebih padat.
                    </p>
                </div>
            </div>

            <div className="rounded-[1.8rem] border border-slate-200 bg-slate-50 p-8 dark:border-white/10 dark:bg-white/5">
                <div className="grid gap-6 md:grid-cols-3">
                    {mobileCards.map((card, index) => (
                        <div
                            key={card}
                            className="mx-auto w-[200px] overflow-hidden rounded-[2.2rem] border-4 border-slate-900 bg-white shadow-[0_22px_55px_rgba(10,10,10,0.15)] dark:bg-slate-950"
                        >
                            <div className="mx-auto h-5 w-28 rounded-b-2xl bg-slate-900" />
                            <div className="space-y-3 p-4 pt-5">
                                <div className="flex items-center justify-between">
                                    <div className="h-3 w-16 rounded-full bg-slate-200 dark:bg-slate-800" />
                                    <div className="h-6 w-6 rounded-full bg-sky-100 dark:bg-sky-400/10" />
                                </div>
                                <div className="rounded-[1.2rem] bg-[linear-gradient(135deg,_rgba(161,149,114,0.18)_0%,_rgba(255,255,255,0.16)_100%)] p-4">
                                    <div className="h-3 w-20 rounded-full bg-slate-300/70 dark:bg-white/20" />
                                    <div className="mt-4 h-24 rounded-[1rem] bg-white/70 dark:bg-slate-900/50" />
                                </div>
                                <div className="space-y-2">
                                    {[1, 2, 3].map((row) => (
                                        <div
                                            key={row}
                                            className="rounded-xl bg-slate-100 px-3 py-3 dark:bg-slate-900/80"
                                        >
                                            <div className="h-2 w-16 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <div className="mt-2 h-2 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                                        </div>
                                    ))}
                                </div>
                                <div className="rounded-full bg-slate-950 px-4 py-3 text-center text-[11px] font-semibold text-white dark:bg-white dark:text-slate-950">
                                    {index === 0
                                        ? "Campaign focus"
                                        : index === 1
                                          ? "Sales snapshot"
                                          : "Inbox sync"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
