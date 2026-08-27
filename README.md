# PLUS Studio

The AI growth workspace for creators, split out of the marketing site so it can
run on its own subdomain (`studio.plusthe.site`) and its own VPS.

Vite + React 19 + TypeScript + Tailwind v4 + Framer Motion, with a small Express
process in front for the Gemini proxy and static hosting.

## Layout

```
server/index.js             Express: /api/ai proxy + static host for dist/
src/index.css               The whole design system - tokens, palette, surfaces
src/components/PlusLogo.tsx The animated mark, wordmark, and inline word
src/components/StudioWord.tsx The word "Studio" as a drawn lockup
src/components/brandText.tsx {plus} / {studio} / *accent* token rendering
src/studio/landing/         Public landing page
  copy.ts                   All strings, both locales, with {plus} tokens
  visuals.tsx               Every image on the page, drawn in code
  sections/                 One file per band of the page
src/studio/                 Dashboard, login, views, docs, tour
src/lib/                    Supabase client, AI client, static studio data
```

## Design system

Built from a lighting setup rather than a colour wheel: a warm key light, a cool
fill, and the plus. brand blue holding them together. Everything else is a warm
neutral - closer to paper and to a blacked-out studio than to the blue-grey
slate of the marketing site. That warmth is most of what reads as premium.

Light and dark are both first-class. The palette is designed to invert, so light
mode reads as a bright studio rather than a washed-out dark one.

Every colour is a CSS variable in `src/index.css`; nothing is hardcoded in a
component. Tailwind's stock `blue` / `sky` / `cyan` / `slate` ramps are also
redefined there, which is what themes the ported dashboard without touching
thousands of classNames. **To change the palette, edit that file and nothing
else.**

### Type

Three faces, one job each - chosen against the Inter-plus-Instrument-Serif
default that every AI-assisted site now shares:

| Role | Face | Why |
| --- | --- | --- |
| Headings | Bricolage Grotesque (variable) | A contemporary grotesque with deliberate irregularities. It is the part that stops the page reading as a template. |
| UI and body | Geist Sans | Engineered and quiet; it does not argue with the display face. |
| Accents | Fraunces italic, WONK axis on | Terminals splay, so it sits beside a drawn logo without looking typed. Used only on accent words and the word Studio. |

Copy marks accents with `*asterisks*`; `withPlus()` turns them into Fraunces.

### Motion

Entrance choreography is CSS, not JavaScript: elements carry `.appear`, a
modifier for the keyframe, and their own `--d` delay, so the timeline is legible
in the markup. `useAppear()` marks each element `.is-in` when it lands, and
settles everything on a 4s timer if the animation never advances - a
backgrounded tab or a stalled compositor must not leave the copy invisible.
Elements rest at opacity 1, so a page whose animations never run is still a
finished page.

Controls share one material: lit metal with a specular pass that crosses on
hover (`.btn`, `.pill`). The tokens flip per theme, so the same class is brushed
steel in the dark and polished paper in the light.

### The plus. mark

The brand name is a logo, never four typeset letters. Copy strings carry
`{plus}` and `{studio}` tokens, and `withPlus()` in
`src/components/brandText.tsx` swaps them for `<PlusWord />` and
`<StudioWord />`. The mark sits on the text baseline and scales with its
sentence; its viewBox is measured from the outlines rather than guessed, because
a box a few units narrow shaves the terminal off the `s`.

All three surfaces animate. The mark is a plus sign, so a quarter turn lands it
back on itself - every idle and hover state is built on 90-degree rotation, and
nothing ever settles where the mark cannot legitimately sit.

### Imagery

There are no image or video files. The stage lighting, the camera iris, the film
contact sheet, and the four tool marks are all drawn in `visuals.tsx`: they theme
with light and dark for free, weigh a few kilobytes, and there is no third-party
host to go dark on launch day.

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

- Supabase Site URL still needs to point at `studio.plusthe.site` so Google OAuth
  lands here. Until it does, the marketing site forwards dangling auth fragments
  across.
- The dashboard inherits the new palette through the ramp remap, but its layout
  is still the one it had inside the Next.js app. It has not had the same design
  pass as the landing page.
