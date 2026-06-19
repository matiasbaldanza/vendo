# Project brief

**Owner:** Matias (solo seller for V1)

**Problem:** Publishing a moving/garage sale across multiple channels (own site, MercadoLibre, Facebook Marketplace) is repetitive. Each platform wants title, price, photos, and description retyped. Tracking what is available vs reserved vs sold is manual and error-prone. You also want to know if anyone is actually looking — without paying for heavy analytics infra.

**Solution:** A Next.js product catalog where content lives in the repo (git is the CMS). A CLI creates and edits listings; Vercel deploys the site. Each item gets a short memorable URL (`/{slug}`). Buyers browse, filter, and tap WhatsApp to ask or reserve. Sold items stay visible for social proof but cannot be reserved. A tiny first-party analytics layer records real human visits and key clicks.

**Non-goals (V1):**

- Product database, user accounts, buyer login
- Admin panel in production
- Online payments or checkout
- Automatic sync to MercadoLibre/Facebook (copy-paste helpers only)
- Real-time reservation locking (status is manual via CLI)
- Multi-seller / marketplace features
- Image optimization, resizing, or CDN transformation (Vercel Image Optimization is off-limits — costs money)
- Full analytics suite (funnels, heatmaps, session replay, geo-IP precision)
- Video hosting in V1 (link out if needed)

**Success looks like:**

- Add a product with photos in under 2 minutes via CLI
- Deploy stays on Vercel Hobby with near-zero marginal cost
- Sharing `vendo.tudominio.com/silla-ikea` is easy to say aloud
- Mobile-first, portfolio-worthy design and README
- Filtering shows available items first; sold items are clearly marked
- One click copies cross-post text for MercadoLibre/Facebook including link back to the listing
- WhatsApp opens with a sensible pre-filled message
- `/stats?token=…` shows pageviews and WhatsApp clicks by device, filtered to humans only

**Portfolio angle:** This is a real tool for a real sale, but also a showcase project — clean architecture, intentional UI, documented tradeoffs (cost, no image transforms, minimal analytics).
