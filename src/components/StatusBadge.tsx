import styles from './StatusBadge.module.css'
import type { ProductStatus } from '@/lib/types'

const labels: Record<ProductStatus, string> = {
  available: 'Disponible',
  reserved: 'Reservado',
  sold: 'Vendido',
}

export default function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === 'available') return null

  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
