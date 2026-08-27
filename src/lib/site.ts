/**
 * The studio runs on its own subdomain, so anything still owned by the
 * marketing site (checkout, legal pages, contact) is reached by absolute URL.
 */
export const MAIN_SITE_URL =
    import.meta.env.VITE_MAIN_SITE_URL?.replace(/\/$/, "") ??
    "https://www.plusthe.site";

export const CONTACT_EMAIL = "plusthesite@gmail.com";
