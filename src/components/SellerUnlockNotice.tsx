'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from './SellerUnlockNotice.module.css'

export default function SellerUnlockNotice() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('seller_unlock') !== 'invalid') return

    setMessage('Token de vendedor inválido. Revisá SELLER_SECRET en tu entorno.')

    const url = new URL(window.location.href)
    url.searchParams.delete('seller_unlock')
    router.replace(url.pathname + url.search, { scroll: false })
  }, [searchParams, router])

  if (!message) return null

  return (
    <p className={styles.notice} role="status">
      {message}
    </p>
  )
}
