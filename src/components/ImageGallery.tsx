'use client'

import { useState } from 'react'
import type { ProductImage } from '@/lib/types'
import styles from './ImageGallery.module.css'

export default function ImageGallery({ images, title }: { images: ProductImage[], title: string }) {
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return <div className={styles.placeholder}>Sin fotos</div>
  }

  const current = images[active] ?? images[0]

  return (
    <div className={styles.gallery}>
      <figure className={styles.main}>
        <img
          src={current.path}
          alt={current.alt || title}
          className={styles.mainImage}
        />
      </figure>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((img, index) => (
            <button
              key={img.path}
              type="button"
              className={`${styles.thumb} ${index === active ? styles.thumbActive : ''}`}
              onClick={() => setActive(index)}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <img src={img.path} alt="" className={styles.thumbImage} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
