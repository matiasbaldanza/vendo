# ADR 003: Analytics — Vercel KV, bot filter, secret-gated stats

**Status:** accepted

V1 tracks three event types: `pageview`, `whatsapp_click`, and `copy_crosspost`. Each event is a compact JSON object (`ts`, `type`, `path`, `slug?`, `device`, `referrer?`, `platform?`) appended to a Vercel KV list. Cap retention at ~5k events or 30 days (whichever is simpler to implement).

`POST /api/track` rejects requests before writing if: User-Agent matches known bots (`isbot`), matches LLM crawlers (GPTBot, ClaudeBot, anthropic-ai, Google-Extended, CCBot, Bytespider, etc.), is missing or too short, or is a prefetch (`Sec-Purpose: prefetch`).

Device type is derived from a lightweight UA parse on the server (mobile / desktop / tablet). The client calls `track()` fire-and-forget; optional session debounce for duplicate pageviews.

Set `NEXT_PUBLIC_TRACKING_DISABLED=true` (e.g. in `.env.local`) to disable tracking during local or preview testing — the client skips `fetch`, and `POST /api/track` returns without writing to KV.

The seller views aggregates at `/stats?token={STATS_SECRET}` — wrong or missing token returns 404. No auth system in V1. Document this tradeoff in the README: good enough for a personal sale and portfolio demo, not for high-security analytics.

Storage: **Vercel KV** (default on Vercel deploy). Upstash is an acceptable alternative if portability matters.
