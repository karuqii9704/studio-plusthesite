import { describe, expect, it } from "vitest";
import { formatCurrency, formatNumber } from "./format";

describe("formatCurrency", () => {
    it("writes rupiah the Indonesian way for id", () => {
        expect(formatCurrency(50000, "id")).toMatch(/^Rp\s?50\.000$/);
        expect(formatCurrency(1500000, "id")).toMatch(/^Rp\s?1\.500\.000$/);
    });

    it("keeps the currency but switches notation for en", () => {
        expect(formatCurrency(50000, "en")).toMatch(/^IDR\s?50,000$/);
        expect(formatCurrency(1500000, "en")).toMatch(/^IDR\s?1,500,000$/);
    });

    it("drops the decimals rupiah never shows", () => {
        expect(formatCurrency(75000.4, "id")).not.toMatch(/[,.]\d{2}\b/);
    });

    it("defaults to the studio's default locale", () => {
        expect(formatCurrency(1000)).toBe(formatCurrency(1000, "id"));
    });
});

describe("formatNumber", () => {
    it("follows the locale's separators", () => {
        expect(formatNumber(1500000, "id")).toBe("1.500.000");
        expect(formatNumber(1500000, "en")).toBe("1,500,000");
    });
});
