# AGENTS.md

Instructions for AI agents working on this repo. Read this first; details live in `/docs`.

## What this is

**Vendo** — a TypeScript + Next.js garage-sale catalog for a single seller. Products are markdown files in git; a local CLI scaffolds listings and copies images. The site deploys to Vercel. Buyers browse and contact via WhatsApp. Minimal first-party analytics (device, time, clicks) with bot/LLM filtering. Built to be a portfolio piece.

## Prime directives

1. **Git is the product database** — no product DB at runtime
2. **Minimize Vercel cost** — no Image Optimization, SSG product pages, one small API route for analytics
3. **Mobile-first buyer UX** — most traffic comes from WhatsApp and social shares
4. **Short slugs** — every listing at `/{slug}`
5. **Functional React, no semicolons**
6. **Spanish UI copy**
7. **Bot/LLM traffic must not pollute analytics**

## Working conventions

- Use native `<img>` tags (or `next/image` with `unoptimized`) — never enable Vercel image transforms
- Product slugs: lowercase, hyphenated, no accents (e.g. `mesa-comedor`)
- Prefer `generateStaticParams` for product pages
- Analytics: fire-and-forget `fetch('/api/track')` — never block UI
- Images live in `public/products/{slug}/` as uploaded — no runtime manipulation
- When unsure about scope, add a short ADR in `docs/decisions/` rather than expanding V1

## Task format (canonical)

1. Read `docs/project-brief.md` and `docs/context-model.md`
2. Check relevant ADRs in `docs/decisions/`
3. For greenfield build, follow `docs/prompts/build-v1.md`
4. Keep changes minimal and focused on the task

## Map

- `/docs/project-brief.md` — why this exists, who it's for
- `/docs/context-model.md` — domain model: entities, status rules, triage rules
- `/docs/roadmap.md` — parked ideas and rough sequencing
- `/docs/decisions/` — numbered ADRs, one paragraph each
- `/docs/prompts/` — reusable prompts (brain dump, build V1)
