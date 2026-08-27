import React, { useCallback, useEffect, useState } from "react";
import {
  Flame,
  History,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Schema, Type } from "@google/genai";
import { callGeminiStructured, callGeminiText } from "@/lib/ai";
import { supabase } from "@/lib/supabase";
import { AnalysisResult } from "@/types";

interface SavedStrategy {
  id: string;
  title: string;
  brief: string | null;
  result: AnalysisResult | null;
  created_at: string;
}

interface TrendItem {
  tag: string;
  volume: string;
}

export const ViewStrategy: React.FC<{
  addNotification: (t: "success" | "error", m: string) => void;
}> = ({ addNotification }) => {
  const [inputText, setInputText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<SavedStrategy[]>([]);
  const [trending, setTrending] = useState<TrendItem[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(false);

  const loadTrending = useCallback(async () => {
    setTrendingLoading(true);
    setTrendingError(false);

    const schema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tag: { type: Type.STRING },
          volume: { type: Type.STRING },
        },
        required: ["tag", "volume"],
      },
    };

    const prompt =
      "Sebutkan 4 hashtag yang masuk akal sedang tren di media sosial Indonesia saat ini untuk konten UMKM/bisnis kecil (F&B, fashion, lifestyle, kebanggaan lokal). Untuk setiap hashtag berikan estimasi volume post yang realistis (format singkat seperti '1.2M' atau '850K'). Balas sebagai array JSON of {tag, volume}, tag harus diawali '#'.";
    const data = await callGeminiStructured<TrendItem[]>(prompt, schema);

    if (data && Array.isArray(data) && data.length > 0) {
      setTrending(data);
    } else {
      setTrendingError(true);
    }

    setTrendingLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTrending();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadTrending]);

  const loadSaved = useCallback(async () => {
    if (!supabase) return;

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;

    const { data } = await supabase
      .from("strategies")
      .select("id, title, brief, result, created_at")
      .order("created_at", { ascending: false })
      .limit(8);

    if (data) setSaved(data as SavedStrategy[]);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadSaved();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadSaved]);

  const deleteStrategy = async (id: string) => {
    if (!supabase) return;
    await supabase.from("strategies").delete().eq("id", id);
    setSaved((items) => items.filter((item) => item.id !== id));
  };

  const handlePredict = async () => {
    if (!inputText) return;
    setLoading(true);

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER },
        hook: { type: Type.STRING },
        fit: { type: Type.STRING },
        format: { type: Type.STRING },
        improvements: { type: Type.STRING },
      },
      required: ["score", "hook", "fit", "format", "improvements"],
    };

    const prompt = `Analyze this social media caption: "${inputText}". Rate it 0-100 on viral potential. Identify the hook strength, audience fit, best format (Reels/Post/Story), and provide 1 specific improvement tip.`;
    const data = await callGeminiStructured<AnalysisResult>(prompt, schema);

    if (data) {
      setAnalysis(data);

      if (supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: inserted } = await supabase
            .from("strategies")
            .insert([
              {
                user_id: session.user.id,
                title: inputText.slice(0, 80),
                brief: inputText,
                result: data,
              },
            ])
            .select("id, title, brief, result, created_at")
            .single();

          if (inserted) {
            setSaved((items) =>
              [inserted as SavedStrategy, ...items].slice(0, 8),
            );
          }
        }
      }
    } else {
      addNotification("error", "Analisis gagal. Coba lagi.");
    }

    setLoading(false);
  };

  const handleRewrite = async () => {
    if (!inputText) return;
    setLoading(true);

    const prompt = `Rewrite this caption to be more viral, engaging, and relatable for Gen Z in Bahasa Indonesia slang but polite: "${inputText}"`;
    const result = await callGeminiText(prompt);

    if (result) {
      setInputText(result);
      addNotification("success", "Caption berhasil di-upgrade!");
    }

    setLoading(false);
  };

  return (
    <div className="animate-in space-y-6 fade-in duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 shadow-lg">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all group-hover:bg-primary/20" />
          <Target size={32} className="mb-2 text-primary" />
          <h3 className="text-5xl font-black tracking-tight text-foreground">
            {analysis?.score || "--"}
            <span className="ml-1 text-lg font-normal text-muted">/100</span>
          </h3>
          <p className="mt-2 text-sm font-medium text-primary">
            Viral Probability
          </p>
          {analysis && (
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${analysis.score}%` }}
              />
            </div>
          )}
        </div>

        <div className="col-span-2 rounded-2xl border border-border bg-card-bg p-6 shadow-lg transition-colors">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-bold text-foreground">
              <Flame size={18} className="fill-orange-500 text-orange-500" />{" "}
              Trending Now (Indonesia)
            </h4>
            <button
              onClick={loadTrending}
              disabled={trendingLoading}
              title="Refresh tren"
              className="text-muted transition-colors hover:text-orange-500 disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={trendingLoading ? "animate-spin" : ""}
              />
            </button>
          </div>

          {trendingLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[0, 1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-11 animate-pulse rounded-lg border border-border bg-surface"
                />
              ))}
            </div>
          ) : trendingError ? (
            <p className="py-6 text-center text-xs text-muted">
              Gagal memuat tren.{" "}
              <button
                onClick={loadTrending}
                className="font-bold text-primary hover:underline"
              >
                Coba lagi
              </button>
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {trending.map((item, index) => (
                <button
                  key={index}
                  onClick={() =>
                    setInputText((current) =>
                      current ? current : `${item.tag} `,
                    )
                  }
                  className="group flex cursor-pointer items-center justify-between rounded-lg border border-border bg-surface p-3 text-left transition-colors hover:border-orange-500/30"
                >
                  <span className="font-medium text-foreground-secondary transition-colors group-hover:text-orange-500">
                    {item.tag}
                  </span>
                  <span className="rounded bg-green-100 px-2 py-1 text-xs font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                    {item.volume}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-lg transition-colors lg:col-span-2">
          <h3 className="mb-4 flex gap-2 font-bold text-foreground">
            <Zap size={18} className="text-yellow-500" /> Content Optimizer
          </h3>
          <div className="relative rounded-xl border border-border bg-surface p-1 transition-colors focus-within:border-primary/50">
            <textarea
              id="strat-input"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder="Tulis ide caption kasar Anda di sini..."
              className="h-32 w-full resize-none bg-transparent p-4 text-sm text-foreground focus:outline-none"
            />
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-slate-900/80">
                <Loader2 className="animate-spin text-primary" />
              </div>
            )}
            <div className="flex items-center justify-between rounded-b-lg border-t border-border bg-surface-hover px-4 py-2">
              <button
                onClick={handleRewrite}
                disabled={loading || !inputText}
                className="flex items-center gap-1 text-xs font-bold text-primary transition-colors hover:text-primary-dark disabled:opacity-50"
              >
                <RefreshCw size={12} /> Magic Rewrite
              </button>
              <button
                id="strat-btn"
                onClick={handlePredict}
                disabled={loading || !inputText}
                className="rounded-lg bg-foreground px-5 py-2 text-xs font-bold text-background transition-colors hover:bg-muted-light disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Check Score"}
              </button>
            </div>
          </div>

          {analysis && (
            <div className="mt-6 grid animate-in grid-cols-3 gap-4 slide-in-from-top-4">
              {[
                [
                  "Hook",
                  analysis.hook,
                  "text-sky-600 dark:text-sky-300",
                  "bg-sky-100 dark:bg-sky-500/10",
                ],
                [
                  "Fit",
                  analysis.fit,
                  "text-green-600 dark:text-green-400",
                  "bg-green-100 dark:bg-green-500/10",
                ],
                ["Format", analysis.format, "text-primary", "bg-primary/10"],
              ].map(([label, value, textColor, background], index) => (
                <div
                  key={index}
                  className={`${background} rounded-xl border border-white/5 p-3 text-center`}
                >
                  <p
                    className={`mb-1 text-[10px] font-bold uppercase opacity-70 ${textColor}`}
                  >
                    {label as string}
                  </p>
                  <p className="font-bold text-foreground">{value as string}</p>
                </div>
              ))}
              <div className="col-span-3 flex items-start gap-4 rounded-xl border border-border bg-surface-hover p-4 shadow-sm">
                <div className="shrink-0 rounded-full bg-yellow-500/20 p-2">
                  <Sparkles
                    size={16}
                    className="text-yellow-600 dark:text-yellow-400"
                  />
                </div>
                <div>
                  <p className="mb-1 text-xs font-bold text-foreground">
                    AI Recommendation
                  </p>
                  <p className="text-xs leading-relaxed text-muted">
                    {analysis.improvements}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card-bg p-6 text-center shadow-lg transition-colors">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
            <Users size={32} className="text-red-500 dark:text-red-400" />
          </div>
          <h4 className="mb-1 font-bold text-foreground">Competitor Watch</h4>
          <p className="mb-6 px-4 text-xs text-muted">
            Pemantauan kompetitor real-time belum terhubung.
          </p>
          <div className="w-full rounded-xl border border-dashed border-border bg-surface p-4 text-xs leading-relaxed text-muted">
            Hubungkan akun media sosial kompetitor untuk memantau aktivitas
            mereka di sini. Fitur ini memerlukan integrasi pemantauan yang belum
            diaktifkan.
          </div>
        </div>
      </div>

      {saved.length > 0 && (
        <div className="rounded-2xl border border-border bg-card-bg p-6 shadow-lg transition-colors">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-foreground">
            <History size={18} className="text-primary" /> Riwayat Analisis /
            tersimpan
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {saved.map((item) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => {
                    setInputText(item.brief || item.title);
                    if (item.result) setAnalysis(item.result);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 pr-8 text-left transition-all hover:-translate-y-0.5 hover:border-primary"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-black text-primary">
                    {item.result?.score ?? "--"}
                  </div>
                  <p className="line-clamp-2 flex-1 text-xs text-foreground">
                    {item.title}
                  </p>
                </button>
                <button
                  onClick={() => deleteStrategy(item.id)}
                  title="Hapus"
                  className="absolute right-2 top-2 rounded-full p-1 text-muted opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
