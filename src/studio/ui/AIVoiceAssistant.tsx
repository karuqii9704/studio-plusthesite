import React, { useState, useEffect, useRef, useCallback } from "react";
import { X, Volume2, Mic, Sparkles, MicOff } from "lucide-react";
import { callGeminiStructured } from "@/lib/ai";
import { Schema, Type } from "@google/genai";
import type { VoiceFormFields } from "@/types";

// Minimal shape of the non-standard Web Speech API (no official TS lib types).
interface VoiceRecognitionResult { transcript: string }
interface VoiceRecognitionEvent { results: { length: number;[index: number]: { [index: number]: VoiceRecognitionResult } } }
interface VoiceRecognition {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    start: () => void;
    stop: () => void;
    onresult: ((event: VoiceRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
}
type VoiceRecognitionCtor = new () => VoiceRecognition;

function getRecognitionCtor(): VoiceRecognitionCtor | null {
    if (typeof window === "undefined") return null;
    const w = window as unknown as { SpeechRecognition?: VoiceRecognitionCtor; webkitSpeechRecognition?: VoiceRecognitionCtor };
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export const AIVoiceAssistant: React.FC<{ onAutoFill?: (fields: VoiceFormFields) => void, addNotification?: (type: 'success' | 'error', msg: string) => void }> = ({ onAutoFill, addNotification }) => {
    const [isListening, setIsListening] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [supported] = useState(() => !!getRecognitionCtor());
    const [minimized, setMinimized] = useState(true);
    const recognitionRef = useRef<VoiceRecognition | null>(null);

    useEffect(() => {
        const t = setTimeout(() => { if (window.innerWidth > 768) setMinimized(false); }, 2000);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => () => { recognitionRef.current?.stop(); }, []);

    const extractFields = useCallback(async (transcript: string) => {
        const schema: Schema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                industry: { type: Type.STRING },
                market: { type: Type.STRING },
                idea: { type: Type.STRING },
            },
            required: ["name", "industry", "market", "idea"],
        };
        const prompt = `Dari ucapan pengguna berikut, ekstrak detail bisnis untuk mengisi form kampanye marketing. Ucapan: "${transcript}". name = nama bisnis, industry = jenis industri, market = target pasar/audiens, idea = ide atau fokus kampanye. Jika sebuah detail tidak disebutkan secara eksplisit, kembalikan string kosong "" untuk field tersebut, jangan mengarang.`;
        return callGeminiStructured<VoiceFormFields>(prompt, schema);
    }, []);

    const handleMicClick = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const Ctor = getRecognitionCtor();
        if (!Ctor) {
            addNotification?.('error', 'Browser ini tidak mendukung input suara.');
            return;
        }

        const recognition = new Ctor();
        recognition.lang = 'id-ID';
        recognition.interimResults = false;
        recognition.continuous = false;

        recognition.onresult = async (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            setIsListening(false);
            setProcessing(true);
            const fields = await extractFields(transcript);
            setProcessing(false);
            if (fields) {
                onAutoFill?.(fields);
                addNotification?.('success', 'Data diisi otomatis dari suara!');
            } else {
                addNotification?.('error', 'Gagal memahami ucapan, coba lagi.');
            }
        };
        recognition.onerror = () => {
            setIsListening(false);
            setProcessing(false);
            addNotification?.('error', 'Gagal mengakses mikrofon. Periksa izin browser.');
        };
        recognition.onend = () => setIsListening(false);

        recognitionRef.current = recognition;
        setIsListening(true);
        recognition.start();
    };

    if (minimized) return (<button onClick={() => setMinimized(false)} className="fixed bottom-24 right-4 md:right-8 w-14 h-14 bg-gradient-to-r from-brand to-blue-600 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] flex items-center justify-center animate-bounce hover:scale-110 transition-transform z-40"><Sparkles className="text-white" size={24} /></button>);

    const statusText = isListening ? "Mendengarkan..." : processing ? "Memproses ucapan..." : !supported ? "Browser ini tidak mendukung input suara." : "Butuh bantuan mengisi form? Klik mic di bawah.";

    return (
        <div className="fixed bottom-24 right-4 md:right-8 z-40 w-[calc(100%-2rem)] md:w-80 max-w-sm animate-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white/90 dark:bg-surface/90 backdrop-blur-xl border border-slate-200 dark:border-brand/30 rounded-2xl shadow-2xl dark:shadow-brand/50 overflow-hidden">
                <div className="h-14 bg-gradient-to-r from-blue-100 to-sky-100 dark:from-brand/50 dark:to-blue-900/50 relative flex items-center justify-between px-4"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-gradient-to-tr from-brand to-blue-400 rounded-full flex items-center justify-center shadow-inner"><Volume2 size={14} className="text-white" /></div><span className="text-slate-800 dark:text-white font-bold text-sm">Ava Assistant</span></div><button onClick={() => setMinimized(true)} className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"><X size={16} /></button></div>
                <div className="p-4">
                    <p className="text-slate-600 dark:text-slate-300 text-xs mb-4 bg-slate-50 dark:bg-white/5 p-3 rounded-lg leading-relaxed border border-slate-200 dark:border-white/5">{statusText}</p>
                    <button onClick={handleMicClick} disabled={processing || !supported} className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-red-500/20 text-red-500 dark:text-red-400 border border-red-500/50 animate-pulse' : 'bg-gradient-to-r from-brand to-blue-600 hover:brightness-110 text-white'}`}>
                        {!supported ? <MicOff size={14} /> : <Mic size={14} />} {isListening ? "Mendengarkan..." : processing ? "Memproses..." : "Bicara Sekarang"}
                    </button>
                </div>
            </div>
        </div>
    );
};
