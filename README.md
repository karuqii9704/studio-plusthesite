# PLUS Studio

The AI growth workspace, split out of the marketing site so it can run on its
own subdomain (`studio.plusthe.site`) and its own VPS.

Vite + React 19 + TypeScript + Tailwind v4 + Framer Motion, with a small Express
process in front for the Gemini proxy and static hosting.

## Layout

```
server/index.js         Express: /api/ai proxy + static host for dist/
src/index.css           The whole design system - tokens, palette, liquid glass
src/studio/landing/     Public landing page (dark monochrome, video-led)
src/studio/             Dashboard, login, views, docs, tour
src/lib/                Supabase client, AI client, static studio data
```

## Design system

Pure monochrome. Every colour is an HSL token in `src/index.css`; nothing is
hardcoded in a component. Light mode is the exact inverse of dark mode rather
than a second palette, so the theme toggle in the dashboard stays honest.

Tailwind's stock `blue` / `sky` / `cyan` / `slate` ramps are redefined as
neutrals in the same file. That is what keeps the ported dashboard monochrome
without rewriting thousands of classNames - existing contrast relationships
(`sky-600` dark, `sky-200` light) survive the move. Status hues (`red`, `green`,
`amber`) keep a trace of chroma so success and failure remain distinguishable.

Fonts: Inter for everything, Instrument Serif italic for accent words only.

## Running it

```bash
npm install
cp .env.example .env
npm run dev       # SPA on :5173
npm run dev:api   # Gemini proxy on :8787 (vite proxies /api to it)
```

The SPA renders without any env vars - Supabase-backed features degrade instead
of crashing, and AI calls return `null` with a logged error.

In development only, `?view=app` or `?view=login` opens the dashboard or the
auth panel without a session.

## Environment

Client (bundled, public):

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_MAIN_SITE_URL` | Marketing site, for checkout and legal hand-off |
| `VITE_HERO_VIDEO` etc. | Landing media overrides, see `src/studio/landing/media.ts` |

Server only (never bundled):

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Required for `/api/ai` to do anything |
| `PORT` | Defaults to 8787 |
| `ALLOWED_ORIGINS` | Only needed for split deploys; same-origin needs no CORS |

## Deploying to the VPS

```bash
npm ci
npm run build
GEMINI_API_KEY=... PORT=8787 node server/index.js
```

One process serves both the built SPA and `/api/ai`, with a history fallback for
deep links. Put nginx in front for TLS and point `studio.plusthe.site` at it.

The rate limiter in `server/index.js` is in-memory and per-process. Move it to
Redis the day this runs on more than one node.

## Known follow-ups

- Landing media defaults to third-party CloudFront and Mux URLs. Move those
  assets onto the studio's own storage before launch; every one is already
  overridable from the environment.
- `main` bundle is ~570 kB (Supabase + Framer Motion). The dashboard, login, and
  hls.js are already split out; Supabase stays eager so a signed-in visitor does
  not flash the landing page first.
