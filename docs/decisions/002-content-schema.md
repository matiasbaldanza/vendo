# ADR 002: Content schema — markdown per product

**Status:** accepted

Each product is one markdown file at `content/products/{slug}.md` with YAML frontmatter for structured fields (`title`, `price`, `currency`, `status`, `tags`, `images`, `primaryImage`, `specs`, `externalLinks`, `hidden`, `sortOrder`, `createdAt`) and a markdown body for the long description.

Images are copied by the CLI into `public/products/{slug}/` and referenced by filename in frontmatter. The build step reads all product files at compile time — no runtime file reads in production.

Slug rules: lowercase, hyphenated, ASCII only (no accents). Slugs must be unique. The CLI validates on `add` and rejects collisions.

`site.config.ts` (or `.yaml`) holds seller-wide settings: `sellerName`, `whatsappNumber`, `baseUrl`, `locale`.
