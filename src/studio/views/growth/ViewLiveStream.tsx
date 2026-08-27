import React, { useCallback, useEffect, useRef, useState } from "react";
import {
    Cast,
    Eye,
    Loader2,
    Mic,
    MicOff,
    MonitorPlay,
    Plus,
    Send,
    Settings,
    ShoppingBag,
    Trash2,
    Video,
    VideoOff,
    X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LiveProduct {
    id: string;
    name: string;
    price: number;
    old_price?: number | null;
}

interface ChatMessage {
    user: string;
    msg: string;
    color: string;
}

const formatRupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

export const ViewLiveStream: React.FC<{
    addNotification: (type: "success" | "error", message: string) => void;
}> = ({ addNotification }) => {
    const [isLive, setIsLive] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [camOn, setCamOn] = useState(true);
    const [camError, setCamError] = useState<string | null>(null);
    const [products, setProducts] = useState<LiveProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [featuredId, setFeaturedId] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [hostMsg, setHostMsg] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ name: "", price: "", oldPrice: "" });
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const loadProducts = useCallback(async () => {
        if (!supabase) {
            setLoadingProducts(false);
            return;
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
            setLoadingProducts(false);
            return;
        }

        const { data } = await supabase
            .from("live_products")
            .select("id, name, price, old_price, created_at")
            .order("created_at", { ascending: false });

        if (data) {
            setProducts(data as LiveProduct[]);
            setFeaturedId((prev) => prev ?? (data[0]?.id ?? null));
        }

        setLoadingProducts(false);
    }, []);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    const sendHostMessage = () => {
        const text = hostMsg.trim();
        if (!text) return;

        setChatMessages((prev) => [
            ...prev.slice(-9),
            { user: "Host", msg: text, color: "bg-slate-950 dark:bg-white dark:text-slate-950" },
        ]);
        setHostMsg("");
    };

    const addProduct = async () => {
        const name = form.name.trim();
        const price = parseInt(form.price.replace(/\D/g, ""), 10);
        const oldPrice = form.oldPrice.trim()
            ? parseInt(form.oldPrice.replace(/\D/g, ""), 10)
            : null;

        if (!name) {
            addNotification("error", "Nama produk wajib diisi.");
            return;
        }
        if (!Number.isFinite(price) || price <= 0) {
            addNotification("error", "Harga harus angka lebih dari 0.");
            return;
        }
        if (oldPrice !== null && (!Number.isFinite(oldPrice) || oldPrice <= price)) {
            addNotification("error", "Harga coret harus lebih besar dari harga jual.");
            return;
        }
        if (!supabase) {
            addNotification("error", "Database tidak tersedia.");
            return;
        }

        setSaving(true);

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
            addNotification("error", "Sesi habis. Login ulang.");
            setSaving(false);
            return;
        }

        const { data, error } = await supabase
            .from("live_products")
            .insert([{ user_id: session.user.id, name, price, old_price: oldPrice }])
            .select("id, name, price, old_price, created_at")
            .single();

        setSaving(false);

        if (error || !data) {
            addNotification("error", "Gagal menyimpan produk.");
            return;
        }

        const created = data as LiveProduct;
        setProducts((prev) => [created, ...prev]);
        setFeaturedId((prev) => prev ?? created.id);
        setForm({ name: "", price: "", oldPrice: "" });
        setShowForm(false);
        addNotification("success", `"${created.name}" ditambahkan ke katalog.`);
    };

    const removeProduct = async (id: string) => {
        if (!supabase) return;

        const previousProducts = products;
        setProducts((prev) => prev.filter((product) => product.id !== id));

        if (featuredId === id) {
            setFeaturedId(previousProducts.find((product) => product.id !== id)?.id ?? null);
        }

        const { error } = await supabase.from("live_products").delete().eq("id", id);

        if (error) {
            setProducts(previousProducts);
            addNotification("error", "Gagal menghapus produk.");
        }
    };

    const featured = products.find((product) => product.id === featuredId) ?? null;

    useEffect(() => {
        if (!isLive) {
            streamRef.current?.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setCamError(null);
            return;
        }

        let cancelled = false;

        void (async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (cancelled) {
                    stream.getTracks().forEach((track) => track.stop());
                    return;
                }

                streamRef.current = stream;
                stream.getVideoTracks().forEach((track) => {
                    track.enabled = camOn;
                });
                stream.getAudioTracks().forEach((track) => {
                    track.enabled = micOn;
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                setCamError(null);
            } catch {
                if (!cancelled) {
                    setCamError("Gagal mengakses kamera atau mikrofon. Periksa izin browser.");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLive]);

    useEffect(() => {
        streamRef.current?.getVideoTracks().forEach((track) => {
            track.enabled = camOn;
        });
    }, [camOn]);

    useEffect(() => {
        streamRef.current?.getAudioTracks().forEach((track) => {
            track.enabled = micOn;
        });
    }, [micOn]);

    useEffect(
        () => () => {
            streamRef.current?.getTracks().forEach((track) => track.stop());
        },
        []
    );

    return (
        <div className="grid h-full grid-cols-1 gap-6 animate-in fade-in pb-24 duration-500 lg:h-[calc(100vh-140px)] lg:grid-cols-3">
            <div className="flex h-full flex-col gap-4 lg:col-span-2">
                <div
                    id="live-preview"
                    className="group relative min-h-[400px] flex-1 overflow-hidden rounded-[1.8rem] border border-white/10 bg-black shadow-2xl"
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
                        {isLive && camOn && !camError ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="absolute inset-0 h-full w-full object-cover [transform:scaleX(-1)]"
                            />
                        ) : null}

                        {isLive ? (
                            camError ? (
                                <div className="px-6 text-center opacity-80">
                                    <VideoOff size={48} className="mx-auto mb-2 text-red-400" />
                                    <p className="text-sm font-semibold text-red-300">{camError}</p>
                                </div>
                            ) : !camOn ? (
                                <div className="text-center opacity-70">
                                    <VideoOff size={48} className="mx-auto mb-2 text-slate-400" />
                                    <p className="font-semibold text-slate-300">Kamera dimatikan</p>
                                </div>
                            ) : null
                        ) : (
                            <div className="text-center opacity-50">
                                <MonitorPlay size={48} className="mx-auto mb-2 text-slate-500" />
                                <p className="text-slate-400">Studio rehearsal offline</p>
                            </div>
                        )}
                    </div>

                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 backdrop-blur">
                        <div
                            className={`h-2 w-2 rounded-full ${
                                isLive ? "animate-pulse bg-rose-500" : "bg-slate-500"
                            }`}
                        />
                        <span className="text-xs font-bold text-white">
                            {isLive ? "LIVE" : "STANDBY"}
                        </span>
                    </div>

                    {isLive ? (
                        <div className="absolute right-4 top-4 flex gap-2 animate-in fade-in">
                            {!micOn ? (
                                <div className="rounded-full border border-white/10 bg-black/50 p-1.5 backdrop-blur">
                                    <MicOff size={14} className="text-red-400" />
                                </div>
                            ) : null}
                            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 backdrop-blur">
                                <Eye size={14} className="text-white" />
                                <span className="text-xs font-bold text-white">Pratinjau lokal</span>
                            </div>
                        </div>
                    ) : null}

                    {isLive && featured ? (
                        <div className="absolute bottom-6 left-6 flex max-w-xs items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 shadow-xl backdrop-blur-xl animate-in slide-in-from-left">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black">
                                <ShoppingBag size={20} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">{featured.name}</p>
                                <p className="text-xs font-bold text-amber-300">
                                    {formatRupiah(featured.price)}
                                    {featured.old_price ? (
                                        <span className="ml-1 font-normal text-slate-400 line-through">
                                            {formatRupiah(featured.old_price)}
                                        </span>
                                    ) : null}
                                </p>
                            </div>
                            <span className="ml-auto rounded-lg bg-brand/20 px-3 py-1.5 text-[10px] font-bold text-brand">
                                Featured
                            </span>
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-border bg-card-bg p-4 shadow-lg transition-colors">
                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setMicOn((value) => !value);
                                addNotification(
                                    "success",
                                    micOn ? "Mikrofon dimatikan." : "Mikrofon aktif."
                                );
                            }}
                            title={micOn ? "Matikan mikrofon" : "Aktifkan mikrofon"}
                            className={`relative rounded-xl p-3 shadow-sm transition-colors ${
                                micOn
                                    ? "bg-surface-hover text-foreground hover:bg-surface"
                                    : "bg-red-500/15 text-red-500 hover:bg-red-500/25"
                            }`}
                        >
                            {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                            {micOn ? (
                                <span className="absolute right-1 top-1 h-2 w-2 rounded-full border border-surface bg-tertiary" />
                            ) : null}
                        </button>

                        <button
                            onClick={() => {
                                setCamOn((value) => !value);
                                addNotification(
                                    "success",
                                    camOn ? "Kamera dimatikan." : "Kamera aktif."
                                );
                            }}
                            title={camOn ? "Matikan kamera" : "Aktifkan kamera"}
                            className={`rounded-xl p-3 shadow-sm transition-colors ${
                                camOn
                                    ? "bg-surface-hover text-foreground hover:bg-surface"
                                    : "bg-red-500/15 text-red-500 hover:bg-red-500/25"
                            }`}
                        >
                            {camOn ? <Video size={20} /> : <VideoOff size={20} />}
                        </button>

                        <button
                            onClick={() =>
                                addNotification("success", "Pengaturan rehearsal stream disimpan.")
                            }
                            title="Pengaturan"
                            className="rounded-xl bg-surface-hover p-3 text-foreground shadow-sm transition-colors hover:bg-surface"
                        >
                            <Settings size={20} />
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setIsLive((value) => !value);
                            addNotification(
                                "success",
                                isLive
                                    ? "Rehearsal dihentikan."
                                    : "Mode rehearsal live sudah aktif."
                            );
                        }}
                        className={`rounded-xl px-8 py-3 font-bold text-white shadow-lg transition-all ${
                            isLive
                                ? "bg-red-600 hover:bg-red-500 shadow-red-900/20"
                                : "bg-tertiary hover:bg-tertiary-light shadow-green-900/20"
                        }`}
                    >
                        {isLive ? "Akhiri rehearsal" : "Mulai rehearsal"}
                    </button>
                </div>
            </div>

            <div className="flex h-full flex-col gap-4">
                <div className="flex min-h-[300px] flex-1 flex-col overflow-hidden rounded-[1.6rem] border border-border bg-card-bg shadow-lg transition-colors">
                    <div className="border-b border-border bg-surface p-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Live chat
                        </h4>
                        <p className="mt-0.5 text-[10px] text-muted">
                            Mode rehearsal untuk host: cek alur kamera, chat, dan pin produk
                            sebelum siaran publik.
                        </p>
                    </div>

                    <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto p-3">
                        {chatMessages.length === 0 ? (
                            <p className="py-6 text-center text-[11px] text-muted">
                                Belum ada percakapan rehearsal. Kirim pesan sebagai host untuk
                                menguji ritme siaran.
                            </p>
                        ) : null}

                        {chatMessages.map((message, index) => (
                            <div key={index} className="flex items-start gap-2 animate-in slide-in-from-bottom-2">
                                <div
                                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${message.color}`}
                                >
                                    {message.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-light">
                                        {message.user}
                                    </p>
                                    <p className="text-xs text-foreground">{message.msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 border-t border-border bg-surface p-3">
                        <input
                            value={hostMsg}
                            onChange={(event) => setHostMsg(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    sendHostMessage();
                                }
                            }}
                            placeholder="Tulis simulasi pesan host..."
                            className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none transition-all focus:ring-1 focus:ring-primary"
                        />
                        <button
                            onClick={sendHostMessage}
                            disabled={!hostMsg.trim()}
                            className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                        >
                            <Send size={14} />
                        </button>
                    </div>
                </div>

                <div
                    id="live-products"
                    className="flex min-h-[150px] h-1/3 flex-col overflow-hidden rounded-[1.6rem] border border-border bg-card-bg shadow-lg transition-colors"
                >
                    <div className="flex items-center justify-between border-b border-border bg-surface p-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Katalog produk <span className="font-normal text-muted">({products.length})</span>
                        </h4>
                        <button
                            onClick={() => setShowForm((value) => !value)}
                            className="flex items-center gap-1 text-[10px] text-primary transition-colors hover:text-primary-light"
                        >
                            {showForm ? (
                                <>
                                    <X size={12} /> Tutup
                                </>
                            ) : (
                                <>
                                    <Plus size={12} /> Tambah
                                </>
                            )}
                        </button>
                    </div>

                    {showForm ? (
                        <div className="space-y-2 border-b border-border bg-background/50 p-3 animate-in slide-in-from-top-2">
                            <input
                                value={form.name}
                                onChange={(event) =>
                                    setForm((current) => ({ ...current, name: event.target.value }))
                                }
                                placeholder="Nama produk"
                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex gap-2">
                                <input
                                    value={form.price}
                                    onChange={(event) =>
                                        setForm((current) => ({ ...current, price: event.target.value }))
                                    }
                                    inputMode="numeric"
                                    placeholder="Harga jual"
                                    className="w-1/2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                                />
                                <input
                                    value={form.oldPrice}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            oldPrice: event.target.value,
                                        }))
                                    }
                                    inputMode="numeric"
                                    placeholder="Harga coret (opsional)"
                                    className="w-1/2 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <button
                                onClick={addProduct}
                                disabled={saving}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 size={13} className="animate-spin" /> Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={13} /> Simpan produk
                                    </>
                                )}
                            </button>
                        </div>
                    ) : null}

                    <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto p-3">
                        {loadingProducts ? (
                            <p className="flex items-center justify-center gap-1.5 py-4 text-[11px] text-muted">
                                <Loader2 size={13} className="animate-spin" /> Memuat katalog...
                            </p>
                        ) : products.length === 0 ? (
                            <p className="py-4 text-center text-[11px] text-muted">
                                Katalog masih kosong. Tambahkan produk pertama agar showcase siap
                                saat rehearsal dimulai.
                            </p>
                        ) : (
                            products.map((product) => {
                                const isFeatured = product.id === featuredId;

                                return (
                                    <div
                                        key={product.id}
                                        className={`group flex gap-3 rounded-xl border p-2 shadow-sm transition-colors ${
                                            isFeatured
                                                ? "border-primary bg-primary/5"
                                                : "border-border bg-surface-hover"
                                        }`}
                                    >
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-background">
                                            <ShoppingBag size={16} className="text-foreground" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-bold text-foreground">
                                                {product.name}
                                            </p>
                                            <p className="text-[10px] text-muted">
                                                {formatRupiah(product.price)}
                                                {product.old_price ? (
                                                    <span className="ml-1 line-through">
                                                        {formatRupiah(product.old_price)}
                                                    </span>
                                                ) : null}
                                                {isFeatured ? (
                                                    <span className="ml-1 font-bold text-primary">
                                                        · tampil
                                                    </span>
                                                ) : null}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setFeaturedId(product.id)}
                                            title="Tampilkan di layar"
                                            className={`transition-colors ${
                                                isFeatured
                                                    ? "text-primary"
                                                    : "text-muted hover:text-primary"
                                            }`}
                                        >
                                            <Cast size={16} />
                                        </button>
                                        <button
                                            onClick={() => removeProduct(product.id)}
                                            title="Hapus"
                                            className="text-muted opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
