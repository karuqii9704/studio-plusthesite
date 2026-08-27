import React, { useState, useEffect, useCallback } from "react";
import { Zap, Loader2, Sparkles, Calendar, List, Grid, X } from "lucide-react";
import { AIVoiceAssistant } from "@/studio/ui/AIVoiceAssistant";
import { callGeminiStructured } from "@/lib/ai";
import { CalendarItem, VoiceFormFields } from "@/types";
import { Schema, Type } from "@google/genai";
import { supabase } from "@/lib/supabase";

interface SavedCampaign {
  id: string;
  name: string;
  industry: string | null;
  calendar_data: CalendarItem[] | null;
  created_at: string;
}

const plannerFields = [
  {
    key: "name" as const,
    label: "Nama Bisnis",
    placeholder: "Contoh: Kopi Tumbuh",
    inputId: "inp-business-name",
  },
  {
    key: "industry" as const,
    label: "Industri",
    placeholder: "Contoh: F&B, fashion, SaaS",
  },
  {
    key: "market" as const,
    label: "Target Market",
    placeholder: "Contoh: Gen Z urban, owner UMKM, ibu muda",
  },
];

export const ViewPlanner: React.FC<{
  addNotification: (t: "success" | "error", m: string) => void;
}> = ({ addNotification }) => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [form, setForm] = useState({
    name: "",
    industry: "",
    market: "",
    idea: "",
  });
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [saved, setSaved] = useState<SavedCampaign[]>([]);

  const loadSaved = useCallback(async () => {
    if (!supabase) return;
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return;
    const { data } = await supabase
      .from("campaigns")
      .select("id, name, industry, calendar_data, created_at")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setSaved(data as SavedCampaign[]);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void loadSaved();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadSaved]);

  const deleteCampaign = async (id: string) => {
    if (!supabase) return;
    await supabase.from("campaigns").delete().eq("id", id);
    setSaved((items) => items.filter((item) => item.id !== id));
  };

  const handleVoiceFill = (fields: VoiceFormFields) => {
    setForm((current) => ({
      name: fields.name || current.name,
      industry: fields.industry || current.industry,
      market: fields.market || current.market,
      idea: fields.idea || current.idea,
    }));
  };

  const handleGen = async () => {
    if (!form.name) {
      addNotification("error", "Mohon isi nama bisnis.");
      return;
    }
    setLoading(true);

    const calendarSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER },
          title: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: ["Awareness", "Sales", "Engagement", "Education", "Other"],
          },
          desc: { type: Type.STRING },
        },
        required: ["day", "title", "category", "desc"],
      },
    };

    const prompt = `Create a 6-day social media content calendar for '${form.name}' (${form.industry}, target: ${form.market}). Focus: '${form.idea}'. Use creative and engaging Indonesian language.`;
    const result = await callGeminiStructured<CalendarItem[]>(
      prompt,
      calendarSchema,
    );

    if (result) {
      setCalendarData(result);
      addNotification("success", "Jadwal berhasil dibuat!");

      if (supabase) {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const { data: inserted, error } = await supabase
            .from("campaigns")
            .insert([
              {
                user_id: sessionData.session.user.id,
                name: form.name,
                industry: form.industry,
                market: form.market,
                idea: form.idea,
                calendar_data: result,
              },
            ])
            .select("id, name, industry, calendar_data, created_at")
            .single();
          if (error) {
            console.error("Error saving to Supabase:", error);
          } else if (inserted) {
            setSaved((items) =>
              [inserted as SavedCampaign, ...items].slice(0, 10),
            );
          }
        }
      }
    } else {
      addNotification("error", "Gagal membuat jadwal, coba lagi.");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <div className="rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            Planner Surface
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Bentuk roadmap campaign dari input bisnis yang lebih terarah.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
            Surface ini membantu tim bergerak dari konteks bisnis, target market,
            dan fokus campaign menuju draft kalender konten yang siap direview
            atau diteruskan ke eksekusi.
          </p>
        </div>

        <div className="rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
            Cara pakai
          </p>
          <div className="mt-4 grid gap-3">
            {[
              "Isi konteks bisnis dan target market dengan jelas.",
              "Jelaskan fokus campaign bulan ini sependek mungkin tapi tetap spesifik.",
              "Generate dulu, lalu pilih ide yang paling layak diteruskan ke tim konten.",
            ].map((item, index) => (
              <div
                key={item}
                className="rounded-2xl border border-border bg-surface px-4 py-3"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Langkah 0{index + 1}
                </p>
                <p className="mt-1 text-xs leading-6 text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AIVoiceAssistant
        onAutoFill={handleVoiceFill}
        addNotification={addNotification}
      />

      <div className="bg-card-bg backdrop-blur-sm border border-border p-6 rounded-2xl relative overflow-hidden group shadow-sm transition-colors">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 mb-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div>
            <h3 className="flex gap-2 font-bold text-foreground">
              <Zap size={20} className="fill-yellow-500 text-yellow-500" />
              AI Campaign Architect
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Masukkan konteks inti bisnis dulu, lalu biarkan planner menyusun
              draft roadmap konten yang lebih rapi dan lebih cepat untuk direview.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-border bg-surface/90 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              Planner note
            </p>
            <p className="mt-2 text-xs leading-6 text-foreground">
              Input yang lebih spesifik biasanya menghasilkan kalender yang lebih
              usable daripada brief yang terlalu umum.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 relative z-10">
          {plannerFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider">
                {field.label}
              </label>
              <input
                id={field.inputId}
                value={form[field.key]}
                onChange={(event) =>
                  setForm({ ...form, [field.key]: event.target.value })
                }
                placeholder={field.placeholder}
                className="w-full bg-surface border border-border text-foreground px-4 py-3 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none hover:bg-surface-hover"
              />
            </div>
          ))}
        </div>
        <div className="space-y-2 mb-6 relative z-10">
          <label className="text-[10px] font-bold text-muted uppercase tracking-wider">
            Fokus Campaign
          </label>
          <textarea
            value={form.idea}
            onChange={(event) => setForm({ ...form, idea: event.target.value })}
            placeholder="Apa target campaign bulan ini? Misal: naikkan penjualan bundling akhir pekan."
            className="w-full bg-surface border border-border text-foreground px-4 py-3 rounded-lg text-sm h-20 resize-none focus:border-primary outline-none hover:bg-surface-hover"
          />
        </div>
        <button
          id="btn-generate-plan"
          onClick={handleGen}
          disabled={loading}
          className="relative z-10 bg-gradient-to-r from-primary to-primary-light hover:brightness-110 text-white px-8 py-3 rounded-lg font-bold w-full md:w-auto transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Meracik Strategi...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Buat Calendar
            </>
          )}
        </button>
      </div>

      {saved.length > 0 && (
        <div className="rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                Riwayat Campaign
              </p>
              <p className="mt-1 text-sm text-foreground">
                Campaign yang tersimpan otomatis bisa dipanggil lagi sebagai titik mulai.
              </p>
            </div>
            <div className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
              {saved.length} tersimpan
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {saved.map((campaign) => (
              <div key={campaign.id} className="group relative shrink-0">
                <button
                  onClick={() => {
                    if (campaign.calendar_data) {
                      setCalendarData(campaign.calendar_data);
                    }
                    setForm((current) => ({
                      ...current,
                      name: campaign.name,
                    }));
                  }}
                  className="rounded-xl border border-border bg-card-bg px-4 py-2.5 pr-7 text-left transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-sm"
                >
                  <p className="text-sm font-bold text-foreground">
                    {campaign.name}
                  </p>
                  <p className="text-[10px] text-muted">
                    {campaign.industry || "Belum diisi"} -{" "}
                    {campaign.calendar_data?.length ?? 0} hari
                  </p>
                </button>
                <button
                  onClick={() => deleteCampaign(campaign.id)}
                  title="Hapus"
                  className="absolute top-1.5 right-1.5 rounded-full p-0.5 text-muted opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Content Roadmap
            </h3>
            <p className="mt-2 text-sm text-muted">
              Review output campaign dalam mode list atau grid, lalu bawa ide yang paling kuat ke eksekusi.
            </p>
          </div>
          <div className="flex gap-2 bg-surface p-1 rounded-lg border border-border self-end shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "list"
                  ? "bg-surface-hover text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-surface-hover text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-32 bg-surface animate-pulse rounded-xl border border-border"
              />
            ))}
          </div>
        ) : calendarData.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 bg-card-bg border border-dashed border-border rounded-2xl text-center">
            <Calendar size={32} className="text-muted-light" />
            <p className="text-sm text-muted max-w-xs">
              Belum ada jadwal konten. Isi form di atas lalu klik{" "}
              <span className="font-bold">Buat Calendar</span> untuk membuatnya.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card-bg px-4 py-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Hari aktif
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {calendarData.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card-bg px-4 py-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Fokus utama
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {form.idea || "Belum diisi"}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card-bg px-4 py-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                  Bisnis
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {form.name || "Belum diisi"}
                </p>
              </div>
            </div>

            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {calendarData.map((item, index) => (
                <div
                  key={index}
                  className={`bg-card-bg border border-border rounded-xl hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-lg hover:bg-surface-hover group relative overflow-hidden ${
                    viewMode === "list"
                      ? "flex flex-col md:flex-row gap-4 p-4 items-start md:items-center"
                      : "p-5 flex flex-col h-full"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center bg-surface rounded-lg shrink-0 border border-border text-primary ${
                      viewMode === "list" ? "w-12 h-12" : "w-full h-10 mb-3"
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">
                      Day {item.day}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-foreground truncate pr-2 text-base">
                        {item.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded border font-medium ${
                          item.category === "Sales"
                            ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20"
                            : item.category === "Awareness"
                              ? "bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/20"
                              : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm text-muted line-clamp-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
