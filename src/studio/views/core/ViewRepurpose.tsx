import React, { useState, useEffect, useCallback } from "react";
import { Recycle, Loader2, Sparkles, Copy, Check, Download, Camera, Music2, Hash, MessageCircle, History, Trash2 } from "lucide-react";
import { callGeminiStructured } from "@/lib/ai";
import { Schema, Type } from "@google/genai";
import { supabase } from "@/lib/supabase";

interface RepurposeResult {
    instagram: { caption: string; hashtags: string[] };
    tiktok: { hook: string; script: string };
    twitter: { thread: string[] };
    whatsapp: { message: string };
}

interface SavedPack { id: string; idea: string; tone: string; result: RepurposeResult; created_at: string }

const TONES = ["Santai", "Profesional", "Lucu", "Hard-selling", "Storytelling"] as const;
type Tone = typeof TONES[number];

// Flatten one platform's content into plain copyable text.
const asText = (r: RepurposeResult) => ({
    instagram: `${r.instagram.caption}\n\n${r.instagram.hashtags.join(" ")}`,
    tiktok: `Hook: ${r.tiktok.hook}\n\nScript:\n${r.tiktok.script}`,
    twitter: r.twitter.thread.map((t, i) => `${i + 1}/${r.twitter.thread.length} ${t}`).join("\n\n"),
    whatsapp: r.whatsapp.message,
});

const downloadText = (filename: string, text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
};

const CopyButton: React.FC<{ active: boolean; onClick: () => void }> = ({ active, onClick }) => (
    <button onClick={onClick} title="Salin" className="flex items-center gap-1 text-[11px] font-bold text-muted hover:text-primary transition-colors">
        {active ? <><Check size={13} className="text-tertiary" /> Tersalin</> : <><Copy size={13} /> Salin</>}
    </button>
);

export const ViewRepurpose: React.FC<{ addNotification: (t: 'success' | 'error', m: string) => void }> = ({ addNotification }) => {
    const [input, setInput] = useState("");
    const [tone, setTone] = useState<Tone>("Santai");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<RepurposeResult | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [saved, setSaved] = useState<SavedPack[]>([]);

    // Load the signed-in user's saved packs (newest first, owner-scoped via RLS).
    const loadSaved = useCallback(async () => {
        if (!supabase) return;
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data } = await supabase.from('content_packs').select('id, idea, tone, result, created_at').order('created_at', { ascending: false }).limit(8);
        if (data) setSaved(data as SavedPack[]);
    }, []);
    useEffect(() => {
        const timer = setTimeout(() => {
            void loadSaved();
        }, 0);
        return () => clearTimeout(timer);
    }, [loadSaved]);

    const deletePack = async (id: string) => {
        if (!supabase) return;
        await supabase.from('content_packs').delete().eq('id', id);
        setSaved((s) => s.filter((x) => x.id !== id));
    };

    const restorePack = (p: SavedPack) => {
        setInput(p.idea);
        if ((TONES as readonly string[]).includes(p.tone)) setTone(p.tone as Tone);
        setResult(p.result);
        setCopiedKey(null);
    };

    const copy = async (key: string, text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedKey(key);
            setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
        } catch {
            addNotification('error', 'Gagal menyalin. Salin manual ya.');
        }
    };

    const handleRepurpose = async () => {
        const idea = input.trim();
        if (!idea) { addNotification('error', 'Tulis ide kontennya dulu.'); return; }
        setLoading(true);
        setResult(null);

        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                instagram: {
                    type: Type.OBJECT,
                    properties: {
                        caption: { type: Type.STRING },
                        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["caption", "hashtags"],
                },
                tiktok: {
                    type: Type.OBJECT,
                    properties: {
                        hook: { type: Type.STRING },
                        script: { type: Type.STRING },
                    },
                    required: ["hook", "script"],
                },
                twitter: {
                    type: Type.OBJECT,
                    properties: {
                        thread: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["thread"],
                },
                whatsapp: {
                    type: Type.OBJECT,
                    properties: {
                        message: { type: Type.STRING },
                    },
                    required: ["message"],
                },
            },
            required: ["instagram", "tiktok", "twitter", "whatsapp"],
        };

        const prompt = `Kamu social media strategist untuk UMKM Indonesia. Ambil ide konten ini dan repurpose jadi konten siap-posting untuk 4 platform. SEMUA dalam Bahasa Indonesia, tone: ${tone}. Ide: "${idea}".
Aturan:
- instagram.caption: caption menarik 2-4 kalimat, emoji secukupnya, ada CTA. instagram.hashtags: 5-8 hashtag relevan, masing-masing diawali '#'.
- tiktok.hook: 1 kalimat hook untuk 3 detik pertama biar berhenti scroll. tiktok.script: outline script singkat 3-5 beat (pisahkan tiap beat dengan baris baru).
- twitter.thread: array 3-5 tweet, tiap tweet di bawah 280 karakter.
- whatsapp.message: pesan broadcast/status WA yang singkat, ramah, pakai emoji, dan ada CTA.`;

        const data = await callGeminiStructured<RepurposeResult>(prompt, schema);
        if (data && data.instagram && data.tiktok && data.twitter && data.whatsapp) {
            setResult(data);
            addNotification('success', 'Konten siap! 4 platform di-generate.');
            // Persist (owner-scoped via RLS).
            if (supabase) {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    const { data: ins } = await supabase.from('content_packs').insert([{
                        user_id: session.user.id,
                        idea,
                        tone,
                        result: data,
                    }]).select('id, idea, tone, result, created_at').single();
                    if (ins) setSaved((s) => [ins as SavedPack, ...s].slice(0, 8));
                }
            }
        } else {
            addNotification('error', 'Gagal repurpose. Coba lagi atau ubah idenya.');
        }
        setLoading(false);
    };

    const downloadAll = () => {
        if (!result) return;
        const t = asText(result);
        const body = [
            "=== INSTAGRAM ===", t.instagram, "",
            "=== TIKTOK ===", t.tiktok, "",
            "=== X / TWITTER ===", t.twitter, "",
            "=== WHATSAPP ===", t.whatsapp, "",
        ].join("\n");
        downloadText(`repurpose-${Date.now()}.txt`, body);
        addNotification('success', 'Pack diunduh (.txt).');
    };

    const text = result ? asText(result) : null;

    return (
        <div className="space-y-6 pb-24 animate-in fade-in duration-500">
            {/* Composer */}
            <div className="bg-card-bg border border-border p-6 rounded-2xl shadow-lg transition-colors">
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2"><Recycle size={18} className="text-primary" /> Repurpose Konten</h3>
                    <p className="text-muted text-xs mt-0.5">Satu ide → caption siap-posting untuk Instagram, TikTok, X, & WhatsApp.</p>
                </div>

                <div className="bg-surface p-1 rounded-xl border border-border focus-within:border-primary/50 transition-colors relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Misal: Promo kopi susu gula aren beli 2 gratis 1, berlaku akhir pekan ini di kedai kami…"
                        className="w-full bg-transparent text-foreground text-sm p-4 focus:outline-none resize-none h-28"
                    />
                    {loading && <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl"><Loader2 className="animate-spin text-primary" /></div>}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider mr-1">Tone</span>
                        {TONES.map((tn) => (
                            <button key={tn} onClick={() => setTone(tn)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${tone === tn ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-surface border-border text-muted hover:text-foreground hover:border-muted-light'}`}>{tn}</button>
                        ))}
                    </div>
                    <button onClick={handleRepurpose} disabled={loading || !input.trim()} className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0">
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />} Repurpose
                    </button>
                </div>
            </div>

            {/* Results */}
            {loading && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {[0, 1, 2, 3].map((i) => <div key={i} className="h-48 bg-surface border border-border rounded-2xl animate-pulse" />)}
                </div>
            )}

            {!loading && !result && (
                <div className="bg-card-bg border border-dashed border-border rounded-2xl p-12 text-center shadow-sm">
                    <div className="bg-surface w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-border"><Recycle className="text-muted" size={28} /></div>
                    <h4 className="text-foreground font-bold mb-1">Belum ada hasil</h4>
                    <p className="text-muted text-sm max-w-sm mx-auto">Tulis satu ide di atas, pilih tone, lalu klik <span className="font-bold text-primary">Repurpose</span> untuk dapat paket konten 4 platform.</p>
                </div>
            )}

            {!loading && result && text && (
                <>
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-foreground flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Paket Konten</h3>
                        <button onClick={downloadAll} className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"><Download size={14} /> Download semua (.txt)</button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Instagram */}
                        <div className="bg-card-bg border border-border rounded-2xl shadow-lg transition-colors flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
                                <div className="flex items-center gap-2"><Camera size={16} className="text-pink-500" /><h4 className="text-sm font-bold text-foreground">Instagram</h4></div>
                                <CopyButton active={copiedKey === 'instagram'} onClick={() => copy('instagram', text.instagram)} />
                            </div>
                            <div className="p-4 space-y-3">
                                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{result.instagram.caption}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {result.instagram.hashtags.map((h, i) => (
                                        <span key={i} className="text-[11px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">{h.startsWith('#') ? h : `#${h}`}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TikTok */}
                        <div className="bg-card-bg border border-border rounded-2xl shadow-lg transition-colors flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
                                <div className="flex items-center gap-2"><Music2 size={16} className="text-foreground" /><h4 className="text-sm font-bold text-foreground">TikTok</h4></div>
                                <CopyButton active={copiedKey === 'tiktok'} onClick={() => copy('tiktok', text.tiktok)} />
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="bg-surface border border-border rounded-lg p-3">
                                    <p className="text-[10px] uppercase font-bold text-muted mb-1">Hook</p>
                                    <p className="text-sm text-foreground font-medium leading-snug">{result.tiktok.hook}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-muted mb-1">Script</p>
                                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{result.tiktok.script}</p>
                                </div>
                            </div>
                        </div>

                        {/* X / Twitter */}
                        <div className="bg-card-bg border border-border rounded-2xl shadow-lg transition-colors flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
                                <div className="flex items-center gap-2"><Hash size={16} className="text-sky-500" /><h4 className="text-sm font-bold text-foreground">X / Twitter Thread</h4></div>
                                <CopyButton active={copiedKey === 'twitter'} onClick={() => copy('twitter', text.twitter)} />
                            </div>
                            <div className="p-4 space-y-2">
                                {result.twitter.thread.map((t, i) => (
                                    <div key={i} className="flex gap-2.5 text-sm">
                                        <span className="text-[10px] font-bold text-muted shrink-0 mt-0.5">{i + 1}/{result.twitter.thread.length}</span>
                                        <p className="text-foreground leading-relaxed">{t}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-card-bg border border-border rounded-2xl shadow-lg transition-colors flex flex-col overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
                                <div className="flex items-center gap-2"><MessageCircle size={16} className="text-green-500" /><h4 className="text-sm font-bold text-foreground">WhatsApp</h4></div>
                                <CopyButton active={copiedKey === 'whatsapp'} onClick={() => copy('whatsapp', text.whatsapp)} />
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{result.whatsapp.message}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {saved.length > 0 && (
                <div className="bg-card-bg border border-border p-6 rounded-2xl shadow-lg transition-colors">
                    <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><History size={18} className="text-primary" /> Riwayat · tersimpan</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {saved.map((p) => (
                            <div key={p.id} className="group relative">
                                <button onClick={() => restorePack(p)} className="flex w-full items-center gap-3 bg-surface border border-border rounded-xl p-3 pr-8 text-left transition-all hover:-translate-y-0.5 hover:border-primary">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Recycle size={16} /></div>
                                    <div className="min-w-0 flex-1">
                                        <p className="line-clamp-1 text-xs font-bold text-foreground">{p.idea}</p>
                                        <p className="text-[10px] text-muted mt-0.5">{p.tone}</p>
                                    </div>
                                </button>
                                <button onClick={() => deletePack(p.id)} title="Hapus" className="absolute top-2 right-2 rounded-full p-1 text-muted opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"><Trash2 size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
