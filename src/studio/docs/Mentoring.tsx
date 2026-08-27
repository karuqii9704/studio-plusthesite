import { Clock, Star, Users } from "lucide-react";
import { ACADEMY_CLASSES } from "@/lib/studioData";
import { PlusWord } from "@/components/PlusLogo";

export const Mentoring = () => {
    return (
        <div className="mx-auto max-w-5xl animate-in fade-in space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h3 className="mb-2 text-3xl font-bold text-slate-800 dark:text-white">
                        <PlusWord /> Pro Academy
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Upgrade skill bisnis Anda dengan mentor kelas dunia.
                    </p>
                </div>

                <div className="flex gap-2">
                    <span className="rounded-full border border-amber-200 bg-amber-100 px-3 py-1 text-xs font-bold text-brand dark:border-brand/20 dark:bg-brand/10 dark:text-brand">
                        All Courses
                    </span>
                    <span className="cursor-pointer rounded-full px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">
                        My Learning
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                {ACADEMY_CLASSES.map((course) => (
                    <div
                        key={course.id}
                        className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand hover:shadow-lg dark:border-white/5 dark:bg-slate-800/30 dark:hover:border-brand/40 dark:hover:bg-slate-800/50"
                    >
                        <div className="absolute right-0 top-0 p-3">
                            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                {course.rating}
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div
                                className={`flex h-24 w-24 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-lg ${course.image}`}
                            >
                                {course.mentor.charAt(0)}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="mb-1 flex gap-2">
                                    <span className="rounded bg-sky-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                                        Webinar
                                    </span>
                                    <span className="rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
                                        {course.price}
                                    </span>
                                </div>

                                <h4 className="mb-1 text-lg font-bold leading-tight text-slate-800 transition-colors group-hover:text-brand dark:text-white dark:group-hover:text-brand">
                                    {course.title}
                                </h4>
                                <p className="mb-4 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">
                                    {course.mentor} · {course.role}
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-white/5">
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Users size={12} /> {course.students}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {course.time}
                                        </span>
                                    </div>

                                    <a
                                        href="mailto:plusthesite@gmail.com"
                                        className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand hover:text-white dark:bg-white dark:text-black"
                                    >
                                        Daftar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
