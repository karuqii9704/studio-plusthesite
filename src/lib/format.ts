import { DEFAULT_LOCALE, type Locale } from "@/i18n/I18nProvider";

/**
 * Numbers and rupiah amounts, written the way each locale writes them.
 *
 * The studio quotes everything in IDR on both locales - there is no currency
 * conversion here, and no exchange rate is invented. Only the notation moves:
 * `Rp 50.000` for `id`, `IDR 50,000` for `en`.
 */
const LOCALE_TAG: Record<Locale, string> = {
    id: "id-ID",
    en: "en-US",
};

/** One formatter per locale: constructing them is not free, and there are two. */
const CURRENCY_FORMATTERS: Record<Locale, Intl.NumberFormat> = {
    id: new Intl.NumberFormat(LOCALE_TAG.id, {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }),
    en: new Intl.NumberFormat(LOCALE_TAG.en, {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }),
};

const NUMBER_FORMATTERS: Record<Locale, Intl.NumberFormat> = {
    id: new Intl.NumberFormat(LOCALE_TAG.id),
    en: new Intl.NumberFormat(LOCALE_TAG.en),
};

export function formatCurrency(
    amount: number,
    locale: Locale = DEFAULT_LOCALE,
): string {
    return CURRENCY_FORMATTERS[locale].format(amount);
}

export function formatNumber(
    value: number,
    locale: Locale = DEFAULT_LOCALE,
): string {
    return NUMBER_FORMATTERS[locale].format(value);
}
