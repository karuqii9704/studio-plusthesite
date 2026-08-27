import React, { useState } from "react";
import { Check, Calculator, ShoppingCart } from "lucide-react";
import { PLANS, ALACARTE_FEATURES } from "@/lib/studioData";
import { MAIN_SITE_URL } from "@/lib/site";
import { useLocale } from "@/i18n/I18nProvider";

export const ViewSubscription: React.FC<{
    addNotification: (type: "success" | "error", message: string) => void;
}> = ({ addNotification }) => {
    const locale = useLocale();
    const [customFeatures, setCustomFeatures] = useState<Record<string, boolean>>({});

    const goToPayment = (name: string, price: string) => {
        // Checkout still lives on the marketing site; the studio subdomain hands off.
        window.location.href = `${MAIN_SITE_URL}/${locale}/payment?name=${encodeURIComponent(name)}&price=${encodeURIComponent(price)}`;
    };

    const toggleFeature = (id: string) => {
        setCustomFeatures((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const calculateTotal = () =>
        ALACARTE_FEATURES.reduce(
            (acc, feature) => (customFeatures[feature.id] ? acc + feature.price : acc),
            0
        );

    const formatPrice = (price: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price);

    return (
        <div className="animate-in fade-in space-y-12 pb-24 duration-500">
            <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
                    Pilih Paket Berlangganan
                </h2>
                <p className="text-sm text-muted">
                    Mulai gratis atau buat paket custom sesuai kebutuhan bisnis Anda.
                </p>
            </div>

            <div id="sub-plans" className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {PLANS.map((plan, idx) => (
                    <div
                        key={idx}
                        className={`group relative flex flex-col rounded-2xl border bg-card-bg p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 ${plan.color}`}
                    >
                        {plan.tag ? (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold text-white shadow-lg">
                                {plan.tag}
                            </div>
                        ) : null}

                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                                {plan.name}
                            </h3>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                                <span className="mb-1 text-xs text-muted">{plan.period}</span>
                            </div>
                        </div>

                        <div className="mb-8 flex-1 space-y-3">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex gap-2 text-xs text-muted-light">
                                    <Check size={14} className="shrink-0 text-tertiary" />
                                    {feature}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => {
                                addNotification("success", `Paket ${plan.name} dipilih`);
                                goToPayment(plan.name, `${plan.price}${plan.period || ""}`);
                            }}
                            className={`w-full rounded-lg py-2.5 text-sm font-bold shadow-lg transition-all ${
                                plan.highlight
                                    ? "bg-primary text-white hover:bg-primary-dark"
                                    : "border border-border bg-surface text-foreground hover:bg-surface-hover"
                            }`}
                        >
                            Pilih
                        </button>
                    </div>
                ))}
            </div>

            <div
                id="sub-calculator"
                className="grid grid-cols-1 overflow-hidden rounded-3xl border border-border bg-card-bg shadow-2xl transition-colors lg:grid-cols-3"
            >
                <div className="border-b border-border p-6 md:p-8 lg:col-span-2 lg:border-b-0 lg:border-r">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-amber-100 p-3 text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
                            <Calculator size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-foreground">Metode A La Carte</h3>
                            <p className="text-xs text-muted">Bayar fitur yang Anda butuhkan saja.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {ALACARTE_FEATURES.map((feature) => (
                            <div
                                key={feature.id}
                                onClick={() => toggleFeature(feature.id)}
                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all ${
                                    customFeatures[feature.id]
                                        ? "border-primary bg-primary/5 shadow-lg"
                                        : "border-border bg-surface hover:bg-surface-hover"
                                }`}
                            >
                                <div
                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                        customFeatures[feature.id]
                                            ? "border-primary bg-primary"
                                            : "border-muted-light"
                                    }`}
                                >
                                    {customFeatures[feature.id] ? (
                                        <Check size={12} className="text-white" />
                                    ) : null}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground">{feature.name}</h4>
                                    <span className="text-xs text-primary">
                                        {formatPrice(feature.price)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex h-full flex-col justify-between bg-surface-hover p-6 md:p-8">
                    <div>
                        <h4 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                            <ShoppingCart size={18} /> Ringkasan
                        </h4>

                        <div className="mb-4 space-y-2">
                            {Object.keys(customFeatures).length === 0 ? (
                                <p className="py-4 text-center text-xs italic text-muted">
                                    Belum ada fitur dipilih.
                                </p>
                            ) : (
                                ALACARTE_FEATURES.filter((feature) => customFeatures[feature.id]).map(
                                    (feature) => (
                                        <div
                                            key={feature.id}
                                            className="animate-in slide-in-from-right flex justify-between text-xs text-muted-light"
                                        >
                                            <span>{feature.name}</span>
                                            <span>{formatPrice(feature.price)}</span>
                                        </div>
                                    )
                                )
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4 flex items-end justify-between">
                            <span className="text-sm text-muted">Total Bulanan</span>
                            <span className="text-2xl font-bold text-foreground">
                                {formatPrice(calculateTotal())}
                            </span>
                        </div>

                        <button
                            disabled={calculateTotal() === 0}
                            onClick={() => {
                                addNotification("success", "Paket Custom aktif!");
                                goToPayment("Paket Custom", `${formatPrice(calculateTotal())}/bln`);
                            }}
                            className="w-full rounded-xl bg-primary py-3 font-bold text-white shadow-lg transition-colors hover:bg-primary-dark disabled:opacity-50"
                        >
                            Langganan Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
