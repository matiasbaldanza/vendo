# Build Vendo V1

Use this prompt to implement the app from scratch. Read the docs first.

## Read first

1. [AGENTS.md](../../AGENTS.md)
2. [docs/project-brief.md](../project-brief.md)
3. [docs/context-model.md](../context-model.md)
4. [docs/decisions/](../decisions/) — ADRs 001–003

Raw requirements (Spanish brain dump): [initial-pre-prompt.md](./initial-pre-prompt.md)

## Goal

Build a TypeScript + Next.js garage-sale catalog for a moving sale. Single seller. Git-backed products, local CLI for authoring, Vercel deploy, WhatsApp contact, minimal first-party analytics. Portfolio-quality UI and README.

## Hard constraints

- **Next.js 15 App Router + TypeScript**
- **No image optimization** — native `<img>`, images in `public/products/{slug}/`, never enable Vercel Image Optimization
- **Minimize Vercel cost** — SSG product pages, one API route (`/api/track`), KV for analytics only
- **Not** `output: 'export'` — API routes are required
- **Spanish UI**, functional React, **no semicolons**
- **Short URLs:** `/{slug}` (no `/products/` prefix)
- **Reject bots and LLM crawlers** in analytics (server-side, before KV write)
- **WhatsApp** contact via deep link; number from site config

## Deliverables

1. Next.js app — buyer flows, product pages, home with filter/sort
2. `POST /api/track` + Vercel KV storage
3. `/stats?token=…` — aggregates (views by day, clicks, device breakdown)
4. CLI at `scripts/vendo.ts` (invoked as `npm run vendo -- <command>`)
5. Content schema per ADR 002 + one example product with placeholder images
6. `site.config.ts` with seller settings
7. README — problem, architecture, local dev, CLI usage, deploy, env vars, cost notes
8. ADRs already in `docs/decisions/` — implement as specified; add ADR 004 only if you deviate

## Environment variables

| Variable | Purpose |
|----------|---------|
| `SITE_URL` | Canonical base URL (OG tags, WhatsApp pre-fill, cross-post copy) |
| `WHATSAPP_NUMBER` | E.164 without `+` |
| `STATS_SECRET` | Token for `/stats?token=…` |
| `KV_*` | Vercel KV connection (from Vercel dashboard) |

## Suggested file layout

```
content/products/{slug}.md
public/products/{slug}/*
site.config.ts
scripts/vendo.ts
src/app/page.tsx
src/app/[slug]/page.tsx
src/app/stats/page.tsx
src/app/api/track/route.ts
src/lib/products.ts
src/lib/analytics.ts
src/lib/track.ts          # client helper
src/components/...
```

Adjust structure as needed; keep it simple.

## Acceptance criteria

### Buyer-facing site

- [ ] Home: grid of products with primary image, title, price, status badge
- [ ] Default sort: `available` → `reserved` → `sold`; then `sortOrder` or `createdAt`
- [ ] Filter by tag and by status
- [ ] Product page `/{slug}`: image gallery (primary first), description, specs, price, external marketplace links
- [ ] WhatsApp CTA on `available` and `reserved` items
- [ ] `sold` items: visible, no WhatsApp CTA, clear "Vendido" badge
- [ ] Cross-post copy buttons ("Copiar para MercadoLibre", "Copiar para Facebook") — one-click clipboard with title, price, excerpt, bullets, link to canonical URL
- [ ] Mobile-first, portfolio-polished UI (intentional typography and spacing — not generic)
- [ ] OG/meta tags for social sharing (absolute image URLs from `public/`)

### Seller CLI

- [ ] `add` — title, price, slug (auto-suggest from title), tags, copy images into `public/products/{slug}/`
- [ ] `edit` — patch existing product
- [ ] `status <slug> <available|reserved|sold>` — update status
- [ ] `hide <slug>` / `delete <slug>` — soft hide or remove product file + images
- [ ] `list` — all products with status
- [ ] Validate slug uniqueness and required fields

### Analytics

- [ ] `POST /api/track` — bot/LLM filter per ADR 003
- [ ] Client tracks: `pageview`, `whatsapp_click`, `copy_crosspost` (with `platform`)
- [ ] `/stats?token=…` — aggregates by day, event type, device; recent events list
- [ ] README section: how analytics works, bot filter list, cost notes

### Portfolio deliverables

- [ ] README a recruiter can skim in ~10 minutes
- [ ] Architecture overview (can reference mermaid from docs)
- [ ] Live demo URL placeholder in README
- [ ] Clean, focused codebase

## WhatsApp link format

```
https://wa.me/{whatsappNumber}?text={encodeURIComponent(
  `Hola! Me interesa ${title} (${siteUrl}/${slug}). ¿Sigue disponible?`
)}
```

Disable or hide when `status === 'sold'`.

## Do not build

- Product database, user accounts, buyer login, admin panel in production
- Online payments or checkout
- Automatic MercadoLibre/Facebook API sync
- Real-time reservation locking
- Multi-seller features
- Image optimization or Vercel Image transforms
- Video hosting (link out only if trivial)
- Plausible, GA, or third-party analytics
- Geo-IP, session replay, heatmaps, A/B tests

## When unsure

Add a short ADR in `docs/decisions/` rather than expanding scope silently.

## Kickoff command (for agent on another machine)

```
Read AGENTS.md and docs/prompts/build-v1.md, then implement V1.
```
