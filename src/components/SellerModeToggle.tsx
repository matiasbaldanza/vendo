'use client'

import { useSellerMode } from '@/lib/seller-mode'
import styles from './SellerModeToggle.module.css'

export default function SellerModeToggle() {
  const { isSellerAuthenticated, viewMode, toggleViewMode } = useSellerMode()

  if (!isSellerAuthenticated) return null

  const label = viewMode === 'seller' ? 'Ver como comprador' : 'Modo vendedor'

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleViewMode}
    >
      {label}
    </button>
  )
}
