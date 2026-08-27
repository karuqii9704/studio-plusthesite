import { PlusWordmark } from "@/components/PlusLogo";

const SIZES = {
    small: "w-16",
    default: "w-24",
    large: "w-32",
} as const;

const VARIANTS = {
    dark: "text-[#0b0b0d]",
    light: "text-white",
    auto: "text-foreground",
} as const;

export type LogoProps = {
    /** Kept from the original API: `dark` on light grounds, `light` on dark ones. */
    variant?: keyof typeof VARIANTS;
    size?: keyof typeof SIZES;
    href?: string;
    className?: string;
};

/**
 * plus. brand logo.
 *
 * A thin wrapper that keeps the prop shape the ported dashboard and login
 * already use, while the motion lives in PlusWordmark.
 */
export default function Logo({
    variant = "auto",
    size = "default",
    href,
    className = "",
}: LogoProps) {
    return (
        <PlusWordmark
            href={href}
            className={`h-auto ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
        />
    );
}
