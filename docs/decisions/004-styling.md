# ADR 004: Styling — CSS tokens + modules

**Status:** accepted

V1 uses native CSS — no Tailwind, no UI kit (shadcn, MUI, Chakra), no CSS-in-JS. Design tokens live as CSS custom properties in `src/app/globals.css` (colors, spacing, radii, shadows, typography scale). Components consume tokens via co-located CSS Modules (`ProductCard.module.css`, etc.) — no magic numbers in JSX.

Typography loads through `next/font/google`: one distinctive display face for titles/prices, one readable sans for body copy. Spanish UI copy uses generous line-height and comfortable tap targets. Visual direction is warm and personal (cream/off-white surfaces, soft borders) — imagery-first grid, minimal chrome. WhatsApp green appears only on the CTA, not site-wide. Status badges are distinct but muted (`available`, `reserved`, `sold`). Motion is CSS `transition` on hover/focus only — no animation libraries.

Rationale: the surface area is small (~10–15 components), so a utility framework adds deps without much speed gain. Intentional tokens avoid the generic Tailwind-demo look the build spec rejects. Zero CSS framework deps aligns with the cost/minimalism story. For a portfolio piece, this demonstrates CSS architecture and design taste, not just framework fluency.

**Out of scope for V1:** dark mode toggle, Framer Motion, hero gradients, component libraries.
