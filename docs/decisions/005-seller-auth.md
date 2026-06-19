# ADR 005: Seller auth — shared secret + httpOnly cookie

**Status:** accepted

Seller-only features (copy-crosspost UI, per-product stats on listing pages, `copy_crosspost` analytics events) are gated by `SELLER_SECRET`, separate from `STATS_SECRET` (global `/stats` dashboard) and from `KV_*` (server infrastructure credentials).

Unlock: visit `/seller/unlock?token={SELLER_SECRET}` or any page with `?seller={SELLER_SECRET}`. Middleware validates the token, sets an httpOnly HMAC-signed cookie (`vendo_seller`), and redirects without the token in the URL.

No user accounts or production admin panel. Good enough for a solo seller and portfolio demo; not high-security auth. Product content remains public for buyers.
