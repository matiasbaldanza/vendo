'use client'

import { useState } from 'react'
import { formatPrice } from '../../site.config'
import type { Product } from '@/lib/types'
import { track } from '@/lib/track'
import styles from './CopyCrosspostButton.module.css'

function buildCrosspostText(
  product: Product,
  canonicalUrl: string,
  platform: 'mercadolibre' | 'facebook',
) {
  const url = canonicalUrl
  const price = formatPrice(product.price, product.currency)
  const bullets = Object.entries(product.specs).map(([k, v]) => `• ${k}: ${v}`)
  const excerpt = product.description || product.body.split('\n')[0] || ''

  const lines = [
    product.title,
    price,
    '',
    excerpt,
    ...(bullets.length > 0 ? ['', ...bullets] : []),
    '',
    `Más info y fotos: ${url}`,
  ]

  if (platform === 'facebook') {
    lines.push('', '#venta #garage')
  }

  return lines.join('\n')
}

type Props = {
  product: Product
  canonicalUrl: string
}

export default function CopyCrosspostButtons({ product, canonicalUrl }: Props) {
  const [copied, setCopied] = useState<string | null>(null)

  async function copy(platform: 'mercadolibre' | 'facebook') {
    const text = buildCrosspostText(product, canonicalUrl, platform)
    await navigator.clipboard.writeText(text)
    track({
      type: 'copy_crosspost',
      path: `/${product.slug}`,
      slug: product.slug,
      platform,
    })
    setCopied(platform)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>Copiar para publicar en:</p>
      <div className={styles.buttons}>
        <button
          type="button"
          className={styles.button}
          onClick={() => copy('mercadolibre')}
        >
          {copied === 'mercadolibre' ? '¡Copiado!' : 'Copiar para MercadoLibre'}
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={() => copy('facebook')}
        >
          {copied === 'facebook' ? '¡Copiado!' : 'Copiar para Facebook'}
        </button>
      </div>
    </div>
  )
}
