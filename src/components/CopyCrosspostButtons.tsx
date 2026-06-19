'use client'

import { useState } from 'react'
import { formatPrice } from '../../site.config'
import type { Product } from '@/lib/types'
import styles from './CopyCrosspostButton.module.css'

function buildListingText(product: Product, canonicalUrl: string) {
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
    `Más info y fotos: ${canonicalUrl}`,
  ]

  return lines.join('\n')
}

type Props = {
  product: Product
  canonicalUrl: string
}

export default function CopyCrosspostButtons({ product, canonicalUrl }: Props) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = buildListingText(product, canonicalUrl)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.button}
        onClick={copy}
      >
        {copied ? '¡Copiado!' : 'Copiar publicación'}
      </button>
    </div>
  )
}
