# Studio — Vite SPA + Express API in one image.
#
# The repo (karuqii9704/studio-plusthesite) ships without a Dockerfile: it was
# a Vercel deploy (vercel.json + /api serverless handlers). server/index.js is
# the VPS entry point: it serves the built SPA from dist/ and proxies /api/ai.
#
# VITE_* vars are build-time (inlined into the browser bundle) so they arrive
# as build args; the Gemini key is runtime-only and comes from studio.env.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_MAIN_SITE_URL
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY \
    VITE_MAIN_SITE_URL=$VITE_MAIN_SITE_URL
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PORT=8787
# Runtime deps only: the server needs express/compression/@google/genai and
# friends. devDependencies (vite, tsc, tailwind) never make it past the build.
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server ./server
COPY --from=builder /app/dist ./dist
EXPOSE 8787
# /api/health reports {ok:true, ai:<bool>} — the same probe compose uses.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
    CMD wget -qO- http://127.0.0.1:8787/api/health || exit 1
USER node
CMD ["node", "server/index.js"]
