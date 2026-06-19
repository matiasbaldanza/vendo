# Roadmap

## V1 — current (see `docs/prompts/build-v1.md`)

Next.js + TypeScript catalog, CLI authoring, WhatsApp contact, minimal analytics, Vercel deploy.

## V1.1 — local image prep

Optional CLI step to resize/compress images **before commit** (not at runtime). Keeps Vercel costs at zero while improving page weight.

## V2 — dev-only admin UI

Local UI that reads/writes the same markdown files. No production auth.

## V3 — richer analytics (only if traffic justifies)

Geo-IP, funnel views, export — only if the sale or portfolio demo needs it.

## Parked / not planned

- Multi-seller marketplace
- Payments and checkout
- Automatic MercadoLibre/Facebook API sync
- Buyer accounts and reservation locking
- Plausible/GA integration (first-party analytics is intentional for portfolio story)
- Session replay, heatmaps, A/B tests
