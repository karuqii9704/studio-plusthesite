import type { Locale } from "@/i18n/I18nProvider";
import type { ToolMarkName } from "./visuals";

/**
 * Landing copy.
 *
 * Two conventions the renderers rely on:
 *   `{plus}`  is replaced with the animated plus. mark, so the brand name is
 *             always the logo and never the four letters.
 *   `accent`  is the one word per heading set in Instrument Serif italic.
 */

export interface Advantage {
    mark: ToolMarkName;
    title: string;
    body: string;
}

export interface LandingCopy {
    nav: { links: { label: string; href: string }[]; open: string; signIn: string };
    hero: {
        eyebrow: string;
        headingBefore: string;
        headingAccent: string;
        headingAfter: string;
        subtitle: string;
        primary: string;
        secondary: string;
        stats: { value: string; label: string }[];
    };
    edge: {
        eyebrow: string;
        headingBefore: string;
        headingAccent: string;
        headingAfter: string;
        subtitle: string;
        advantages: Advantage[];
        ctaTitle: string;
        ctaBody: string;
        ctaPrimary: string;
        ctaSecondary: string;
    };
    craft: {
        paragraphOne: string;
        /** Words in paragraph one that land at full contrast. */
        highlight: string[];
        paragraphTwo: string;
    };
    workspace: {
        eyebrow: string;
        headingBefore: string;
        headingAccent: string;
        headingAfter: string;
        features: { title: string; body: string }[];
    };
    start: {
        headingBefore: string;
        headingAccent: string;
        subtitle: string;
        primary: string;
        secondary: string;
    };
    footer: { rights: string; links: { label: string; href: string }[] };
}

const NAV_HREFS = ["#hero", "#edge", "#craft", "#workspace"];

const id: LandingCopy = {
    nav: {
        links: [
            { label: "Beranda", href: NAV_HREFS[0] },
            { label: "Keunggulan", href: NAV_HREFS[1] },
            { label: "Prinsip", href: NAV_HREFS[2] },
            { label: "Workspace", href: NAV_HREFS[3] },
        ],
        open: "Buka Studio",
        signIn: "Masuk",
    },
    hero: {
        eyebrow: "Ruang kerja kreator",
        headingBefore: "Satu studio. Dari ",
        headingAccent: "ide",
        headingAfter: " sampai tayang.",
        subtitle:
            "{plus} Studio menyatukan riset, perencanaan, produksi visual, dan distribusi di satu meja kerja. Dibuat untuk kreator dan tim kecil yang menggarap konten tiap hari.",
        primary: "Buka Studio",
        secondary: "Lihat cara kerjanya",
        stats: [
            { value: "8", label: "tool dalam satu alur" },
            { value: "< 10 mnt", label: "brief jadi draft" },
            { value: "1 konteks", label: "riset sampai posting" },
        ],
    },
    edge: {
        eyebrow: "Keunggulan",
        headingBefore: "Kenapa kreator pindah ke ",
        headingAccent: "{plus}",
        headingAfter: " Studio",
        subtitle:
            "Tool AI terpisah bikin kamu kerja dua kali: pindah tab, ulang konteks, tempel manual. Studio ini menyimpan semuanya di satu tempat, jadi arah kreatifmu tidak hilang di tengah jalan.",
        advantages: [
            {
                mark: "palette",
                title: "Arah kreatif yang tidak melenceng",
                body: "Brief, tone, dan preferensi visual tersimpan di workspace. Setiap output berangkat dari konteks yang sama, bukan dari prompt kosong.",
            },
            {
                mark: "lens",
                title: "Produksi visual tanpa antre",
                body: "Draft visual on-brand dengan kontrol gaya, rasio, dan riwayat generasi. Tidak perlu sewa studio untuk mulai mengeksekusi ide.",
            },
            {
                mark: "film",
                title: "Satu ide, semua format",
                body: "Repurpose Engine memecah satu bahan inti jadi paket siap posting untuk tiap channel aktif, lengkap dengan angle-nya.",
            },
            {
                mark: "light",
                title: "Keputusan yang terang",
                body: "Analytics, marketplace KOL, dan live studio duduk di konteks kerja yang sama, jadi langkah berikutnya kelihatan tanpa ekspor ke mana-mana.",
            },
        ],
        ctaTitle: "Mulai dari bottleneck yang paling mengganggu",
        ctaBody:
            "Tidak perlu memindahkan seluruh workflow di hari pertama. Buka satu surface, selesaikan satu masalah, lalu lanjutkan.",
        ctaPrimary: "Buka Studio sekarang",
        ctaSecondary: "Ngobrol dengan tim",
    },
    craft: {
        paragraphOne:
            "Kami membangun ruang kerja tempat rasa bertemu sistem, tempat kreator punya arah yang jelas, produksi yang rapi, dan jejak keputusan yang masih masuk akal saat dibaca ulang sebulan kemudian.",
        highlight: ["rasa", "bertemu", "sistem"],
        paragraphTwo:
            "Satu tempat untuk perencanaan, produksi, dan distribusi, dengan lebih sedikit gesekan dan lebih banyak konteks bagi semua yang terlibat.",
    },
    workspace: {
        eyebrow: "Workspace",
        headingBefore: "Delapan tool, satu ",
        headingAccent: "meja kerja",
        headingAfter: "",
        features: [
            {
                title: "AI Planner",
                body: "Kalender campaign sebulan penuh, lengkap dengan angle dan kategori kontennya.",
            },
            {
                title: "Visual Generator",
                body: "Draft visual on-brand dengan kontrol gaya, rasio, dan riwayat generasi.",
            },
            {
                title: "Repurpose Engine",
                body: "Satu ide inti dipecah jadi paket siap posting untuk tiap channel aktif.",
            },
            {
                title: "Growth Toolkit",
                body: "Live studio, analytics, dan marketplace KOL dalam konteks kerja yang sama.",
            },
        ],
    },
    start: {
        headingBefore: "Nyalakan ",
        headingAccent: "lampunya",
        subtitle:
            "Buka workspace, isi profil bisnis, dan dapatkan rencana campaign pertama dalam hitungan menit.",
        primary: "Buka Studio",
        secondary: "Sudah punya akun",
    },
    footer: {
        rights: "{plus} Studio. Seluruh hak cipta dilindungi.",
        links: [
            { label: "Privasi", href: "/privacy" },
            { label: "Ketentuan", href: "/terms" },
            { label: "Kontak", href: "/contact-us" },
        ],
    },
};

const en: LandingCopy = {
    nav: {
        links: [
            { label: "Home", href: NAV_HREFS[0] },
            { label: "Why", href: NAV_HREFS[1] },
            { label: "Principles", href: NAV_HREFS[2] },
            { label: "Workspace", href: NAV_HREFS[3] },
        ],
        open: "Open Studio",
        signIn: "Sign in",
    },
    hero: {
        eyebrow: "A workspace for creators",
        headingBefore: "One studio. From ",
        headingAccent: "idea",
        headingAfter: " to airtime.",
        subtitle:
            "{plus} Studio puts research, planning, visual production, and distribution on one desk. Built for creators and small teams shipping content every day.",
        primary: "Open Studio",
        secondary: "See how it works",
        stats: [
            { value: "8", label: "tools in one flow" },
            { value: "< 10 min", label: "brief to draft" },
            { value: "1 context", label: "research to posting" },
        ],
    },
    edge: {
        eyebrow: "Why it wins",
        headingBefore: "Why creators move to ",
        headingAccent: "{plus}",
        headingAfter: " Studio",
        subtitle:
            "Scattered AI tools make you do the work twice: new tab, new context, manual paste. This studio keeps all of it in one place, so your creative direction survives the trip.",
        advantages: [
            {
                mark: "palette",
                title: "Direction that holds",
                body: "Brief, tone, and visual preferences live in the workspace. Every output starts from the same context instead of an empty prompt.",
            },
            {
                mark: "lens",
                title: "Production without the queue",
                body: "On-brand visual drafts with control over style, ratio, and generation history. No studio booking needed to start executing.",
            },
            {
                mark: "film",
                title: "One idea, every format",
                body: "The Repurpose Engine splits a single core asset into ready-to-post packs for each active channel, angles included.",
            },
            {
                mark: "light",
                title: "Decisions you can see",
                body: "Analytics, the KOL marketplace, and live studio sit in the same working context, so the next move is visible without exporting anything.",
            },
        ],
        ctaTitle: "Start with whichever bottleneck hurts most",
        ctaBody:
            "You do not have to move the whole workflow on day one. Open one surface, clear one problem, then keep going.",
        ctaPrimary: "Open Studio now",
        ctaSecondary: "Talk to the team",
    },
    craft: {
        paragraphOne:
            "We are building a workspace where taste meets system, where creators keep a clear direction, a clean production line, and a decision trail that still makes sense a month later.",
        highlight: ["taste", "meets", "system"],
        paragraphTwo:
            "One place for planning, production, and distribution, with less friction and more context for everyone involved.",
    },
    workspace: {
        eyebrow: "Workspace",
        headingBefore: "Eight tools, one ",
        headingAccent: "desk",
        headingAfter: "",
        features: [
            {
                title: "AI Planner",
                body: "A full month of campaign structure, with angles and categories attached.",
            },
            {
                title: "Visual Generator",
                body: "On-brand visual drafts with style, ratio, and generation history in reach.",
            },
            {
                title: "Repurpose Engine",
                body: "One core idea split into ready-to-post packs for every active channel.",
            },
            {
                title: "Growth Toolkit",
                body: "Live studio, analytics, and the KOL marketplace in the same context.",
            },
        ],
    },
    start: {
        headingBefore: "Bring up the ",
        headingAccent: "lights",
        subtitle:
            "Open the workspace, fill in your business profile, and get a first campaign plan in minutes.",
        primary: "Open Studio",
        secondary: "I have an account",
    },
    footer: {
        rights: "{plus} Studio. All rights reserved.",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Contact", href: "/contact-us" },
        ],
    },
};

export const LANDING_COPY: Record<Locale, LandingCopy> = { id, en };
