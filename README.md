# Vendo

Garage-sale catalog for a moving sale — git-backed products, WhatsApp contact, minimal analytics. Portfolio project.

**Status:** planning complete, app not yet built.

## Quick start (after V1 is implemented)

```bash
npm install
npm run dev
```

See [docs/prompts/build-v1.md](docs/prompts/build-v1.md) for the full build spec.

## Docs

| Doc | Purpose |
|-----|---------|
| [AGENTS.md](AGENTS.md) | Instructions for AI agents |
| [docs/project-brief.md](docs/project-brief.md) | Problem, solution, success criteria |
| [docs/context-model.md](docs/context-model.md) | Entities, status rules, triage |
| [docs/roadmap.md](docs/roadmap.md) | V1+ sequencing |
| [docs/decisions/](docs/decisions/) | Architecture decision records |
| [docs/prompts/build-v1.md](docs/prompts/build-v1.md) | **Agent prompt to implement V1** |
| [docs/prompts/initial-pre-prompt.md](docs/prompts/initial-pre-prompt.md) | Raw Spanish brain dump |

## Stack (locked)

- TypeScript + Next.js 15 (App Router)
- Markdown products in `content/`
- Images in `public/` (no transforms)
- Vercel deploy, Vercel KV for analytics
- Local CLI for product management
- CSS custom properties + CSS Modules (see [ADR 004](docs/decisions/004-styling.md))

## Continue on another machine

1. Clone the repo
2. Open in Cursor (or your editor)
3. Run the agent with:

   > Read AGENTS.md and docs/prompts/build-v1.md, then implement V1.
