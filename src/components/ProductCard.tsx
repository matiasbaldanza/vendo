import Link from 'next/link'
import { formatPrice } from '../../site.config'
import type { Product } from '@/lib/types'
import StatusBadge from './StatusBadge'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }: { product: Product }) {
  const imageSrc = product.primaryImage || product.images[0]?.path
  const isSold = product.status === 'sold'

  return (
    <article className={`${styles.card} ${isSold ? styles.sold : ''}`}>
      <Link href={`/${product.slug}`} className={styles.link}>
        <figure className={styles.imageWrap}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.title}
              className={styles.image}
              loading="lazy"
            />
          ) : (
            <div className={styles.placeholder}>Sin foto</div>
          )}
          {product.status !== 'available' && (
            <div className={styles.badgeWrap}>
              <StatusBadge status={product.status} />
            </div>
          )}
        </figure>
        <div className={styles.content}>
          <h2 className={styles.title}>{product.title}</h2>
          <p className={`${styles.price} ${isSold ? styles.priceSold : ''}`}>
            {formatPrice(product.price, product.currency)}
          </p>
          {product.tags.length > 0 && (
            <ul className={styles.tags}>
              {product.tags.map(tag => (
                <li key={tag} className={styles.tag}>{tag}</li>
              ))}
            </ul>
          )}
        </div>
      </Link>
    </article>
  )
}
