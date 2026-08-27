import React, { useMemo, useState } from "react";
import {
    BookOpen,
    ChevronRight,
    Code,
    Info,
    Layout,
    Network,
    Users,
    X,
} from "lucide-react";
import { UserGuide } from "./UserGuide";
import { Mentoring } from "./Mentoring";
import { SystemArchitecture } from "./SystemArchitecture";
import { NetworkTopology } from "./NetworkTopology";
import { UIMockups } from "./UIMockups";

interface DocModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialTab?: string;
    onStartTour: (tab: string) => void;
}

const DOC_TABS = [
    { id: "guide", label: "Studio Guide", icon: BookOpen },
    { id: "mentoring", label: "Academy", icon: Users },
    { id: "uml", label: "System Map", icon: Code },
    { id: "network", label: "Network", icon: Network },
    { id: "mockup", label: "UI Library", icon: Layout },
] as const;

export const DocumentationModal: React.FC<DocModalProps> = ({
    isOpen,
    onClose,
    initialTab = "guide",
    onStartTour,
}) => {
    const [selectedTab, setSelectedTab] = useState<string | null>(null);
    const activeTab = selectedTab ?? initialTab;

    const activeDoc = useMemo(
        () => DOC_TABS.find((tab) => tab.id === activeTab) ?? DOC_TABS[0],
        [activeTab]
    );

    const handleClose = () => {
        setSelectedTab(null);
        onClose();
    };

    if (!isOpen) return null;

    const renderContent = () => {
        switch (activeTab) {
            case "guide":
                return (
                    <UserGuide
                        onStartTour={(tour) => {
                            handleClose();
                            onStartTour(tour);
                        }}
                    />
                );
            case "mentoring":
                return <Mentoring />;
            case "uml":
                return <SystemArchitecture />;
            case "network":
                return <NetworkTopology />;
            case "mockup":
                return <UIMockups />;
            default:
                return (
                    <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-10 text-center dark:border-white/10 dark:bg-white/5">
                        <Info className="mx-auto mb-4 text-slate-300 dark:text-slate-500" size={48} />
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                            Ruang dokumentasi aktif
                        </h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                            Pilih tab di samping untuk membuka playbook kerja, arsitektur sistem,
                            atau referensi visual Studio.
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in p-4 duration-200 sm:p-6">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleClose} />

            <div className="relative flex h-[85vh] w-full max-w-6xl animate-in zoom-in-95 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-2xl duration-300 dark:bg-slate-900 md:flex-row">
                <div className="flex w-full flex-col border-b border-slate-200 bg-slate-50 md:w-72 md:border-b-0 md:border-r dark:border-white/5 dark:bg-slate-950/60">
                    <div className="border-b border-slate-200 px-6 py-6 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900">
                                <BookOpen size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    plus docs
                                </div>
                                <div className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Studio command center
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-xs leading-6 text-slate-500 dark:text-slate-400">
                            Playbook, struktur sistem, dan referensi visual untuk menjaga ritme kerja
                            Studio tetap rapi.
                        </p>
                    </div>

                    <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                        {DOC_TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all ${
                                        isActive
                                            ? "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-white dark:ring-white/5"
                                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} />
                                        <span>{tab.label}</span>
                                    </div>
                                    {isActive ? (
                                        <ChevronRight
                                            size={14}
                                            className="animate-in slide-in-from-left-2 text-rose-500"
                                        />
                                    ) : null}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex min-w-0 flex-1 flex-col bg-white dark:bg-slate-900">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-6 dark:border-white/5">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Active surface
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                                {activeDoc.label}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                Dokumentasi yang relevan untuk workflow Studio saat ini.
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-rose-500 dark:hover:bg-white/10"
                        >
                            <X size={22} />
                        </button>
                    </div>

                    <div className="custom-scrollbar flex-1 overflow-y-auto p-6 md:p-8">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};
