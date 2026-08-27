import {
  ArrowDown,
  Database,
  Globe,
  Server,
  Smartphone,
  Zap,
} from "lucide-react";

export const NetworkTopology = () => (
  <div className="flex h-full flex-col">
    <div className="mb-6 text-center">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
        Network Topology
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Infrastruktur server dan alur data.
      </p>
    </div>
    <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-8 dark:border-white/10 dark:bg-slate-900/50">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #334155 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-12">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 rounded-full bg-slate-800 px-6 py-2 text-sm font-bold text-white shadow-[0_0_15px_rgba(0,0,0,0.2)] dark:bg-white dark:text-black dark:shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            <Smartphone size={16} /> Client (Browser/Mobile)
          </div>
          <ArrowDown className="my-2 text-slate-500" size={24} />
        </div>

        <div className="relative w-full border-t border-dashed border-slate-400 dark:border-slate-600">
          <span className="absolute left-1/2 -top-3 -translate-x-1/2 bg-white px-2 text-[10px] uppercase tracking-widest text-slate-500 dark:bg-slate-900">
            Edge Layer
          </span>
        </div>

        <div className="flex justify-center gap-12">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-lg border border-orange-500 bg-orange-100 text-orange-500 dark:bg-orange-500/20">
              <Globe size={32} />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              CDN / WAF
            </p>
          </div>
        </div>

        <ArrowDown className="text-slate-500" size={24} />

        <div className="relative flex gap-4 rounded-2xl border border-sky-500/30 bg-sky-50 p-4 backdrop-blur-sm dark:bg-sky-900/10">
          <span className="absolute -top-3 left-4 rounded bg-sky-600 px-2 text-[10px] font-bold text-white">
            Kubernetes Cluster
          </span>
          <div className="flex flex-col items-center rounded border border-slate-200 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-slate-800">
            <Server size={24} className="mb-1 text-sky-500 dark:text-sky-400" />
            <span className="text-[10px] text-slate-600 dark:text-slate-300">
              App Pod 1
            </span>
          </div>
          <div className="flex flex-col items-center rounded border border-slate-200 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-slate-800">
            <Server size={24} className="mb-1 text-sky-500 dark:text-sky-400" />
            <span className="text-[10px] text-slate-600 dark:text-slate-300">
              App Pod 2
            </span>
          </div>
          <div className="flex flex-col items-center rounded border border-slate-200 bg-white p-3 shadow-sm dark:border-white/5 dark:bg-slate-800">
            <Server size={24} className="mb-1 text-sky-500 dark:text-sky-400" />
            <span className="text-[10px] text-slate-600 dark:text-slate-300">
              Worker
            </span>
          </div>
        </div>

        <div className="relative flex w-full justify-between px-20">
          <div className="absolute left-1/2 top-0 h-8 w-px -translate-x-1/2 bg-slate-400 dark:bg-slate-600" />
          <div className="absolute left-[25%] right-[25%] top-8 h-px bg-slate-400 dark:bg-slate-600" />
          <div className="absolute left-[25%] top-8 h-8 w-px bg-slate-400 dark:bg-slate-600" />
          <div className="absolute right-[25%] top-8 h-8 w-px bg-slate-400 dark:bg-slate-600" />
        </div>

        <div className="mt-4 flex w-full max-w-lg justify-between">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-green-500 bg-green-100 text-green-500 dark:bg-green-500/20">
              <Database size={24} />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              PostgreSQL
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-sky-500 bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-300">
              <Zap size={24} />
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Gemini API
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
