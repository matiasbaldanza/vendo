'use client'

import { track } from '@/lib/track'
import styles from './WhatsAppButton.module.css'

type Props = {
  href: string
  slug: string
  label?: string
}

export default function WhatsAppButton({ href, slug, label = 'Consultar por WhatsApp' }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.button}
      onClick={() => track({ type: 'whatsapp_click', path: `/${slug}`, slug })}
    >
      {label}
    </a>
  )
}
