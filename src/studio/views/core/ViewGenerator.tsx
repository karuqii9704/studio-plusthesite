import React, { useState, useEffect, useCallback } from "react";
import {
    Wand2,
    Loader2,
    Sparkles,
    Download,
    Maximize2,
    Image as ImageIcon,
    X,
    Trash2,
} from "lucide-react";
import { callGeminiImage, downloadImage } from "@/lib/ai";
import { supabase } from "@/lib/supabase";

interface Asset {
    id: string;
    image_url: string;
    prompt: string;
    displayUrl: string;
}

const BUCKET = "studio-assets";

const dataUrlToBlob = (dataUrl: string): Blob => {
    const [head, body] = dataUrl.split(",");
    const mime = head.match(/:(.*?);/)?.[1] || "image/png";
    const bin = atob(body);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
};

const resolveDisplayUrl = async (imageUrl: string): Promise<string> => {
    if (!imageUrl) return "";
    if (imageUrl.startsWith("data:")) return imageUrl;
    if (!supabase) return "";
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(imageUrl, 3600);
    return data?.signedUrl ?? "";
};

export const ViewGenerator: React.FC<{
    addNotification: (t: "success" | "error", m: string) => void;
}> = ({ addNotification }) => {
    const [prompt, setPrompt] = useState("");
    const [style, setStyle] = useState("Photorealistic");
    const [ratio, setRatio] = useState("1:1");
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<Asset[]>([]);
    const [fullscreen, setFullscreen] = useState(false);

    const loadHistory = useCallback(async () => {
        if (!supabase) return;
        const {
            data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) return;
        const { data } = await supabase
            .from("generated_assets")
            .select("id, image_url, prompt")
            .order("created_at", { ascending: false })
            .limit(12);
        if (data) {
            const resolved = await Promise.all(
                (data as Omit<Asset, "displayUrl">[]).map(async (asset) => ({
                    ...asset,
                    displayUrl: await resolveDisplayUrl(asset.image_url),
                }))
            );
            setHistory(resolved);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            void loadHistory();
        }, 0);
        return () => clearTimeout(timer);
    }, [loadHistory]);

    useEffect(() => {
        if (!fullscreen) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setFullscreen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [fullscreen]);

    const deleteAsset = async (id: string) => {
        if (!supabase) return;
        const asset = history.find((item) => item.id === id);
        await supabase.from("generated_assets").delete().eq("id", id);
        if (asset && asset.image_url && !asset.image_url.startsWith("data:")) {
            await supabase.storage.from(BUCKET).remove([asset.image_url]);
        }
        setHistory((items) => items.filter((item) => item.id !== id));
    };

    const handleGenerate = async () => {
        if (!prompt) {
            addNotification("error", "Masukkan prompt!");
            return;
        }
        setLoading(true);
        const enhancedPrompt = `Create a ${ratio} image. Style: ${style}. Subject: ${prompt}. High quality, detailed, professional lighting.`;
        const imgData = await callGeminiImage(enhancedPrompt);

        if (imgData) {
            setGeneratedImage(imgData);
            addNotification("success", "Gambar berhasil dibuat!");

            if (supabase) {
                const { data: sessionData } = await supabase.auth.getSession();
                const userId = sessionData?.session?.user?.id;
                if (userId) {
                    let stored = imgData;
                    try {
                        const path = `${userId}/${crypto.randomUUID()}.png`;
                        const { error: uploadError } = await supabase.storage
                            .from(BUCKET)
                            .upload(path, dataUrlToBlob(imgData), {
                                contentType: "image/png",
                                upsert: false,
                            });
                        if (!uploadError) stored = path;
                    } catch {
                        // Keep base64 fallback.
                    }
                    const { data: inserted, error } = await supabase
                        .from("generated_assets")
                        .insert([
                            {
                                user_id: userId,
                                prompt,
                                style,
                                ratio,
                                image_url: stored,
                            },
                        ])
                        .select("id, image_url, prompt")
                        .single();
                    if (error) {
                        console.error("Error saving to Supabase:", error);
                    } else if (inserted) {
                        setHistory((items) =>
                            [
                                {
                                    ...(inserted as Omit<Asset, "displayUrl">),
                                    displayUrl: imgData,
                                },
                                ...items,
                            ].slice(0, 12)
                        );
                    }
                }
            }
        } else {
            addNotification("error", "Gagal membuat gambar. Coba prompt lain.");
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-24 animate-in fade-in duration-500 h-full lg:h-[calc(100vh-140px)]">
            <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                <div className="rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                        Generator Surface
                    </p>
                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
                        Bangun visual draft lebih cepat dari prompt yang lebih terarah.
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-muted">
                        Surface ini cocok untuk eksplorasi visual cepat, draft
                        campaign, dan produksi ide awal sebelum tim masuk ke tahap
                        seleksi atau polish final.
                    </p>
                </div>

                <div className="bg-card-bg backdrop-blur-sm border border-border p-6 rounded-2xl flex-1 flex flex-col shadow-lg transition-colors">
                    <div className="mb-6 grid gap-4 lg:grid-cols-1">
                        <div>
                            <h3 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                                <Wand2 size={18} className="text-primary" /> AI Studio
                            </h3>
                            <p className="text-muted text-xs">
                                Powered by Gemini 2.0 Flash Image.
                            </p>
                        </div>

                        <div className="rounded-[1.5rem] border border-border bg-surface/90 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                                Prompt note
                            </p>
                            <p className="mt-2 text-xs leading-6 text-foreground">
                                Prompt yang lebih spesifik biasanya memberi hasil
                                yang lebih usable daripada deskripsi visual yang terlalu umum.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
                        <div id="gen-prompt-area" className="space-y-2">
                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                Prompt Visual
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(event) => setPrompt(event.target.value)}
                                placeholder="Misal: Coffee shop futuristik dengan lampu neon di Jakarta Selatan, cinematic shot..."
                                className="w-full bg-surface border border-border text-foreground p-3 rounded-lg h-32 text-sm resize-none focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all hover:bg-surface-hover"
                            />
                        </div>

                        <div id="gen-style-select" className="space-y-2">
                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                Visual Style
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    "Photorealistic",
                                    "3D Render",
                                    "Anime",
                                    "Oil Painting",
                                    "Cyberpunk",
                                    "Minimalist",
                                    "Vintage",
                                    "Pop Art",
                                ].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setStyle(item)}
                                        className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all text-left ${
                                            style === item
                                                ? "bg-primary/10 border-primary text-primary shadow-sm"
                                                : "bg-surface border-border text-muted hover:border-muted-light hover:text-foreground"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted uppercase tracking-wider">
                                Aspect Ratio
                            </label>
                            <div className="flex bg-surface-hover p-1 rounded-lg border border-border">
                                {["1:1", "16:9", "9:16", "4:3"].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setRatio(item)}
                                        className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                                            ratio === item
                                                ? "bg-background text-foreground shadow-sm"
                                                : "text-muted hover:text-foreground"
                                        }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.5rem] border border-border bg-surface/80 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                                Cara pakai
                            </p>
                            <div className="mt-3 grid gap-3">
                                {[
                                    "Mulai dari subjek, suasana, dan konteks visual yang paling penting.",
                                    "Pilih style lebih dulu jika tim sudah punya arah art yang jelas.",
                                    "Gunakan ratio sesuai placement akhir: feed, story, atau presentasi.",
                                ].map((item, index) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl border border-border bg-card-bg px-4 py-3"
                                    >
                                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                                            Langkah 0{index + 1}
                                        </p>
                                        <p className="mt-1 text-xs leading-6 text-foreground">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        id="gen-btn-action"
                        className="mt-6 w-full bg-gradient-to-r from-primary to-primary-light text-white py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Sparkles size={18} />
                        )}{" "}
                        Generate Visual
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8 flex h-full flex-col gap-4">
                <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                            Output Canvas
                        </p>
                        <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground">
                            Review hasil visual sebelum disimpan, diperbesar, atau dipakai ulang.
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-muted">
                            Setelah visual muncul, tim bisa menilai apakah arah art,
                            ratio, dan detailnya sudah cukup kuat untuk dilanjutkan
                            ke campaign, mockup, atau bahan eksplorasi berikutnya.
                        </p>
                    </div>

                    <div className="rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
                            Current Setup
                        </p>
                        <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                                    Style
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {style}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                                    Ratio
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {ratio}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-border bg-surface px-4 py-4">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
                                    Gallery
                                </p>
                                <p className="mt-2 text-sm font-semibold text-foreground">
                                    {history.length} tersimpan
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    id="gen-result-area"
                    className="flex-1 bg-surface border border-border rounded-2xl flex items-center justify-center relative overflow-hidden group min-h-[400px] shadow-inner transition-colors"
                >
                    <div className="absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 pointer-events-none" />

                    {!generatedImage && !loading && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 pointer-events-none" />
                    )}

                    {loading ? (
                        <div className="text-center relative z-10">
                            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-muted animate-pulse font-medium">
                                Meracik piksel...
                            </p>
                            <p className="text-xs text-muted-light mt-2">
                                Estimasi: 5-10 detik
                            </p>
                        </div>
                    ) : generatedImage ? (
                        <div className="relative flex h-full w-full items-center justify-center p-4">
                            <div className="relative h-full w-full">
                                <img
                                    src={generatedImage}
                                    alt="Result"
                                    className="absolute inset-0 h-full w-full rounded-lg object-contain shadow-2xl animate-in zoom-in-95 duration-500"
                                />
                            </div>
                            <div className="absolute bottom-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur rounded-full px-4 py-2 border border-white/10 translate-y-2 group-hover:translate-y-0 duration-300">
                                <button
                                    onClick={() =>
                                        downloadImage(
                                            generatedImage,
                                            `plus-gen-${Date.now()}.png`
                                        )
                                    }
                                    className="text-white hover:text-primary transition-colors flex items-center gap-2 text-xs font-bold pr-3 border-r border-white/20"
                                >
                                    <Download size={16} /> Save
                                </button>
                                <button
                                    onClick={() => setFullscreen(true)}
                                    title="Lihat penuh"
                                    className="text-white hover:text-primary transition-colors"
                                >
                                    <Maximize2 size={16} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center relative z-10 opacity-60 dark:opacity-50 max-w-sm px-6">
                            <div className="bg-surface p-6 rounded-full inline-block mb-4 border border-border shadow-sm">
                                <ImageIcon className="text-muted" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-muted mb-2">
                                Canvas Kosong
                            </h3>
                            <p className="text-muted-light text-sm">
                                Tulis prompt di panel kiri untuk mulai membuat
                                visual menakjubkan.
                            </p>
                        </div>
                    )}
                </div>

                {history.length > 0 && (
                    <div className="shrink-0 rounded-[1.75rem] border border-border bg-card-bg p-5 shadow-sm">
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
                                    Galeri Anda
                                </p>
                                <p className="mt-1 text-sm text-foreground">
                                    Hasil generate tersimpan otomatis dan bisa dipanggil lagi untuk review cepat.
                                </p>
                            </div>
                            <div className="rounded-full border border-border bg-surface px-3 py-1.5 text-[11px] font-medium text-muted">
                                {history.length} item
                            </div>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative h-16 w-16 shrink-0"
                                >
                                    <button
                                        onClick={() => setGeneratedImage(item.displayUrl)}
                                        title={item.prompt}
                                        className="h-full w-full overflow-hidden rounded-lg border border-border transition-all hover:border-primary hover:ring-1 hover:ring-primary"
                                    >
                                        <span className="relative block h-full w-full">
                                            <img
                                                src={item.displayUrl}
                                                alt={item.prompt}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => deleteAsset(item.id)}
                                        title="Hapus"
                                        className="absolute -top-1.5 -right-1.5 rounded-full bg-red-500 p-1 text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                    >
                                        <Trash2 size={11} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {fullscreen && generatedImage && (
                <div
                    onClick={() => setFullscreen(false)}
                    className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-200"
                >
                    <button
                        onClick={() => setFullscreen(false)}
                        className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <X size={22} />
                    </button>
                    <img
                        src={generatedImage}
                        alt="Result fullscreen"
                        width={1600}
                        height={1600}
                        onClick={(event) => event.stopPropagation()}
                        className="h-auto max-h-full w-auto max-w-full rounded-lg object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                    />
                    <button
                        onClick={(event) => {
                            event.stopPropagation();
                            downloadImage(generatedImage, `plus-gen-${Date.now()}.png`);
                        }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 backdrop-blur text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2 border border-white/20 transition-colors"
                    >
                        <Download size={16} /> Save
                    </button>
                </div>
            )}
        </div>
    );
};
