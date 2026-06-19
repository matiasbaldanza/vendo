'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/lib/types'
import type { SlugStats } from '@/lib/analytics'
import { useSellerMode } from '@/lib/seller-mode'
import CopyCrosspostButtons from '@/components/CopyCrosspostButtons'
import panelStyles from './ProductSellerPanel.module.css'

type Props = {
  product: Product
  slug: string
  canonicalUrl: string
}

export default function SellerProductTools({ product, slug, canonicalUrl }: Props) {
  const { isSellerAuthenticated, viewMode } = useSellerMode()
  const [stats, setStats] = useState<SlugStats | null>(null)

  useEffect(() => {
    if (!isSellerAuthenticated || viewMode !== 'seller') {
      setStats(null)
      return
    }

    let cancelled = false

    fetch(`/api/seller/product-tools?slug=${encodeURIComponent(slug)}`)
      .then(response => {
        if (!response.ok) return null
        return response.json()
      })
      .then(data => {
        if (!cancelled && data?.ok) setStats(data.stats)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [slug, isSellerAuthenticated, viewMode])

  if (!stats) return null

  return (
    <section className={panelStyles.panel}>
      <h2 className={panelStyles.title}>Panel vendedor</h2>
      <ul className={panelStyles.stats}>
        <li><strong>Vistas:</strong> {stats.pageviews}</li>
        <li><strong>WhatsApp:</strong> {stats.whatsappClicks}</li>
        <li><strong>Copias:</strong> {stats.copyCrosspost}</li>
      </ul>
      <CopyCrosspostButtons product={product} canonicalUrl={canonicalUrl} />
    </section>
  )
}
