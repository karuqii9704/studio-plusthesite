/**
 * Landing page media.
 *
 * These default to the reference clips. They are third-party URLs, so every one
 * is overridable from the environment - swap them for assets served off the
 * studio VPS before launch rather than hotlinking someone else CDN forever.
 * Each surface degrades to flat black if the source fails, so a dead URL costs
 * atmosphere, never layout.
 */
const env = import.meta.env;

export const HERO_VIDEO =
    env.VITE_HERO_VIDEO ??
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_120549_0cd82c36-56b3-4dd9-b190-069cfc3a623f.mp4";

export const MISSION_VIDEO =
    env.VITE_MISSION_VIDEO ??
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_132944_a0d124bb-eaa1-4082-aa30-2310efb42b4b.mp4";

export const SOLUTION_VIDEO =
    env.VITE_SOLUTION_VIDEO ??
    "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260325_125119_8e5ae31c-0021-4396-bc08-f7aebeb877a2.mp4";

/** HLS stream behind the closing call to action. */
export const CTA_STREAM =
    env.VITE_CTA_STREAM ??
    "https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8";
