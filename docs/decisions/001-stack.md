# ADR 001: Stack — Next.js + TypeScript on Vercel

**Status:** accepted

We use Next.js 15 (App Router) with TypeScript, deployed on Vercel Hobby. **pnpm** is the package manager (`packageManager` in `package.json`; lockfile is `pnpm-lock.yaml`). Product pages are statically generated at build time via `generateStaticParams`. We do **not** use `output: 'export'` because V1 needs API routes for analytics (`/api/track`) and a dynamic stats page (`/stats`).

Images are served from `public/` with native `<img>` tags — no Next.js Image Optimization and no Vercel image transforms, to avoid billable image processing. Content is markdown with YAML frontmatter in the repo; a local CLI manages products. Analytics events go to Vercel KV (free tier on Hobby). This stack balances simplicity, portfolio credibility, and near-zero marginal hosting cost.
