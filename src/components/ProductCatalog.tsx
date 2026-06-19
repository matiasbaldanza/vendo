'use client'

import { useState } from 'react'
import type { Product, ProductStatus } from '@/lib/types'
import ProductCard from './ProductCard'
import styles from './ProductCatalog.module.css'

type Props = {
  products: Product[]
  tags: string[]
}

export default function ProductCatalog({ products, tags }: Props) {
  const [status, setStatus] = useState<ProductStatus | 'all'>('all')
  const [tag, setTag] = useState<string | 'all'>('all')

  const filtered = products.filter(p => {
    if (status !== 'all' && p.status !== status) return false
    if (tag !== 'all' && !p.tags.includes(tag)) return false
    return true
  })

  return (
    <div>
      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>Estado</span>
          <select
            value={status}
            onChange={e => setStatus(e.target.value as ProductStatus | 'all')}
            className={styles.select}
          >
            <option value="all">Todos</option>
            <option value="available">Disponible</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
          </select>
        </label>
        {tags.length > 0 && (
          <label className={styles.field}>
            <span className={styles.label}>Etiqueta</span>
            <select
              value={tag}
              onChange={e => setTag(e.target.value)}
              className={styles.select}
            >
              <option value="all">Todas</option>
              {tags.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No hay productos con esos filtros.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map(product => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
