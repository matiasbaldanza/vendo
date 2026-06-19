# Context model

## Entities

### Product

Source of truth: one markdown file per product (YAML frontmatter + markdown body).

| Field | Type | Notes |
|-------|------|-------|
| `slug` | string | URL path: `/{slug}`. Lowercase, hyphenated, no accents |
| `title` | string | Display name |
| `description` | string | Short summary; also in markdown body for long form |
| `price` | number | |
| `currency` | string | e.g. `ARS`, `USD` |
| `status` | enum | `available` \| `reserved` \| `sold` |
| `tags` | string[] | For filtering |
| `images` | Image[] | Paths under `public/products/{slug}/` |
| `primaryImage` | string | Filename or path of cover image |
| `specs` | object or markdown | Tables, bullet points, structured attributes |
| `externalLinks` | ExternalListing[] | Cross-links to MercadoLibre, Facebook, etc. |
| `hidden` | boolean | Excluded from public index (soft delete) |
| `sortOrder` | number | Optional manual ordering within status group |
| `createdAt` | ISO date | Set by CLI on `add` |

### Image

Stored as-is under `public/products/{slug}/`. No runtime transforms.

| Field | Type | Notes |
|-------|------|-------|
| `path` | string | Relative to `public/` |
| `alt` | string | Accessibility |
| `order` | number | Gallery order; primary image first |

### ExternalListing

| Field | Type | Notes |
|-------|------|-------|
| `platform` | enum | `mercadolibre` \| `facebook` \| `other` |
| `url` | string | Link to listing on external marketplace |

### SiteConfig

Single config file (`site.config.ts` or `site.config.yaml`).

| Field | Type | Notes |
|-------|------|-------|
| `sellerName` | string | |
| `whatsappNumber` | string | E.164 without `+`, for `wa.me` links |
| `baseUrl` | string | Canonical site URL for OG tags and cross-post copy |
| `locale` | string | `es` for V1 |

### AnalyticsEvent

Written by `POST /api/track`. Stored in Vercel KV — never in git.

| Field | Type | Notes |
|-------|------|-------|
| `ts` | ISO string | Event timestamp |
| `type` | enum | `pageview` \| `whatsapp_click` \| `copy_crosspost` |
| `path` | string | Request path |
| `slug` | string? | Product slug when applicable |
| `device` | enum | `mobile` \| `desktop` \| `tablet` |
| `referrer` | string? | Truncated |
| `platform` | string? | For `copy_crosspost`: `mercadolibre` \| `facebook` |

## Status rules

| Status | Visible in index | WhatsApp CTA | Badge |
|--------|-------------------|--------------|-------|
| `available` | yes | yes | — |
| `reserved` | yes | yes (softer copy ok) | Reservado |
| `sold` | yes | no | Vendido |
| `hidden` | no | — | — |

## Task lifecycle

```
draft → published → reserved → sold
                  ↘ hidden (soft delete at any point)
```

V1 transitions via CLI: `pnpm vendo status silla-ikea sold`

## Triage rules (for agents asked to reorder/decompose)

1. Content in git; analytics in KV only — never mix the two
2. If it needs image processing at runtime, reject or park in roadmap
3. If it needs a full database, reject — one KV store is enough for V1 stats
4. Short slugs are a first-class requirement, not an afterthought
5. Portfolio quality applies to UI and README, not feature bloat
6. Minimize Vercel billable usage: no Image Optimization, prefer SSG, one API route
