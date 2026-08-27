import type { Locale } from "@/i18n/I18nProvider";

/**
 * Landing copy. Serif-italic accents are marked with `accent` so the heading
 * component can set that one word in Instrument Serif without parsing markup.
 */
export interface LandingCopy {
    nav: { links: { label: string; href: string }[]; open: string; signIn: string };
    hero: {
        social: string;
        headingBefore: string;
        headingAccent: string;
        headingAfter: string;
        subtitle: string;
        emailPlaceholder: string;
        cta: string;
        note: string;
    };
    shift: {
        headingBefore: string;
        headingAccent: string;
        subtitle: string;
        platforms: { name: string; body: string }[];
        tagline: string;
    };
    mission: {
        paragraphOne: string;
        /** Words in paragraph one that stay at full opacity once revealed. */
        highlight: string[];
        paragraphTwo: string;
    };
    solution: {
        label: string;
        headingBefore: string;
        headingAccent: string;
        headingAfter: string;
        features: { title: string; body: string }[];
    };
    cta: {
        headingBefore: string;
        headingAccent: string;
        subtitle: string;
        primary: string;
        secondary: string;
    };
    footer: { rights: string; links: { label: string; href: string }[] };
}

const id: LandingCopy = {
    nav: {
        links: [
            { label: "Beranda", href: "#hero" },
            { label: "Cara Kerja", href: "#shift" },
            { label: "Prinsip", href: "#mission" },
            { label: "Workspace", href: "#solution" },
        ],
        open: "Buka Studio",
        signIn: "Masuk",
    },
    hero: {
        social: "Dipakai tim kecil yang mengurus konten sendirian",
        headingBefore: "Meja Kerja ",
        headingAccent: "AI",
        headingAfter: " untuk Growth",
        subtitle:
            "Susun campaign, buat visual, olah ulang aset, dan siapkan peluncuran dalam satu alur kerja yang sama.",
        emailPlaceholder: "Email kerja kamu",
        cta: "MULAI",
        note: "Gratis untuk dicoba. Tanpa kartu kredit.",
    },
    shift: {
        headingBefore: "Cara orang mencari sudah ",
        headingAccent: "berubah.",
        subtitle:
            "Audiens kamu bertanya ke mesin jawaban, bukan ke halaman hasil pencarian. Konten yang tidak terstruktur tidak akan dikutip.",
        platforms: [
            {
                name: "ChatGPT",
                body: "Menjawab langsung dari sumber yang paling jelas struktur dan konteksnya.",
            },
            {
                name: "Perplexity",
                body: "Mengutip halaman yang punya klaim spesifik dan bisa diverifikasi.",
            },
            {
                name: "Google AI",
                body: "Merangkum di atas hasil pencarian, sebelum satu link pun diklik.",
            },
        ],
        tagline: "Kalau kamu tidak menjawab pertanyaannya, orang lain yang menjawab.",
    },
    mission: {
        paragraphOne:
            "Kami membangun ruang kerja tempat strategi bertemu eksekusi, tempat tim kecil punya arah yang jelas, produksi yang rapi, dan setiap campaign punya jejak keputusan yang bisa dibaca ulang.",
        highlight: ["strategi", "bertemu", "eksekusi"],
        paragraphTwo:
            "Satu tempat untuk perencanaan, produksi, dan distribusi, dengan lebih sedikit gesekan dan lebih banyak konteks bagi semua yang terlibat.",
    },
    solution: {
        label: "WORKSPACE",
        headingBefore: "Satu workspace untuk kerja konten yang ",
        headingAccent: "serius",
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
    cta: {
        headingBefore: "Mulai ",
        headingAccent: "Sekarang",
        subtitle:
            "Buka workspace, isi profil bisnis, dan dapatkan rencana campaign pertama dalam hitungan menit.",
        primary: "Buka Studio",
        secondary: "Sudah punya akun",
    },
    footer: {
        rights: "PLUS Studio. Seluruh hak cipta dilindungi.",
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
            { label: "Home", href: "#hero" },
            { label: "How It Works", href: "#shift" },
            { label: "Philosophy", href: "#mission" },
            { label: "Workspace", href: "#solution" },
        ],
        open: "Open Studio",
        signIn: "Sign In",
    },
    hero: {
        social: "Built for small teams running content on their own",
        headingBefore: "Your ",
        headingAccent: "AI",
        headingAfter: " Growth Desk",
        subtitle:
            "Plan campaigns, generate visuals, repurpose assets, and prepare launches inside a single working rhythm.",
        emailPlaceholder: "Your work email",
        cta: "START",
        note: "Free to try. No card required.",
    },
    shift: {
        headingBefore: "Search has ",
        headingAccent: "changed.",
        subtitle:
            "Your audience asks answer engines now, not a page of blue links. Content without structure never gets cited.",
        platforms: [
            {
                name: "ChatGPT",
                body: "Answers straight from whichever source reads clearest in context.",
            },
            {
                name: "Perplexity",
                body: "Cites pages that make specific claims it can verify.",
            },
            {
                name: "Google AI",
                body: "Summarises above the results, before a single link is clicked.",
            },
        ],
        tagline: "If you do not answer the question, someone else will.",
    },
    mission: {
        paragraphOne:
            "We are building a workspace where strategy meets execution, where small teams keep a clear direction, a clean production line, and a decision trail worth reading back.",
        highlight: ["strategy", "meets", "execution"],
        paragraphTwo:
            "One place for planning, production, and distribution, with less friction and more context for everyone involved.",
    },
    solution: {
        label: "WORKSPACE",
        headingBefore: "One workspace for content work that stays ",
        headingAccent: "disciplined",
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
    cta: {
        headingBefore: "Start ",
        headingAccent: "Now",
        subtitle:
            "Open the workspace, fill in your business profile, and get a first campaign plan in minutes.",
        primary: "Open Studio",
        secondary: "I have an account",
    },
    footer: {
        rights: "PLUS Studio. All rights reserved.",
        links: [
            { label: "Privacy", href: "/privacy" },
            { label: "Terms", href: "/terms" },
            { label: "Contact", href: "/contact-us" },
        ],
    },
};

export const LANDING_COPY: Record<Locale, LandingCopy> = { id, en };
