export const siteConfig = {
  sellerName: 'Matias',
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? '5491112345678',
  baseUrl: process.env.SITE_URL ?? 'http://localhost:3000',
  locale: 'es',
  statsSecret: process.env.STATS_SECRET ?? '',
  sellerSecret: process.env.SELLER_SECRET ?? '',
}

export function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export function productUrl(slug: string) {
  return `${siteConfig.baseUrl}/${slug}`
}

export function whatsappLink(title: string, slug: string) {
  const text = `Hola! Me interesa ${title} (${productUrl(slug)}). ¿Sigue disponible?`
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(text)}`
}
