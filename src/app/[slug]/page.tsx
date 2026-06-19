import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllSlugs, getProductBySlug } from '@/lib/products'
import { formatPrice, productUrl, siteConfig, whatsappLink } from '../../../site.config'
import ImageGallery from '@/components/ImageGallery'
import StatusBadge from '@/components/StatusBadge'
import WhatsAppButton from '@/components/WhatsAppButton'
import SellerProductTools from '@/components/SellerProductTools'
import MarkdownBody from '@/components/MarkdownBody'
import PageViewTracker from '@/components/PageViewTracker'
import styles from './page.module.css'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) return {}

  const imageUrl = product.primaryImage
    ? new URL(product.primaryImage, siteConfig.baseUrl).toString()
    : undefined

  return {
    title: product.title,
    description: product.description || product.body.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description,
      url: productUrl(slug),
      images: imageUrl ? [{ url: imageUrl }] : [],
      locale: siteConfig.locale,
      type: 'website',
    },
  }
}

const platformLabels = {
  mercadolibre: 'MercadoLibre',
  facebook: 'Facebook',
  other: 'Otro',
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = getProductBySlug(slug)
  if (!product) notFound()

  const showWhatsApp = product.status !== 'sold'
  const specEntries = Object.entries(product.specs)

  return (
    <>
      <PageViewTracker path={`/${slug}`} slug={slug} />
      <article className={styles.page}>
        <div className={styles.galleryCol}>
          <ImageGallery images={product.images} title={product.title} />
        </div>
        <div className={styles.infoCol}>
          <div className={styles.header}>
            <StatusBadge status={product.status} />
            <h1 className={styles.title}>{product.title}</h1>
            <p className={`${styles.price} ${product.status === 'sold' ? styles.priceSold : ''}`}>
              {formatPrice(product.price, product.currency)}
            </p>
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}
          </div>

          {showWhatsApp && (
            <WhatsAppButton
              href={whatsappLink(product.title, product.slug)}
              slug={product.slug}
            />
          )}

          {specEntries.length > 0 && (
            <section className={styles.specs}>
              <h2 className={styles.sectionTitle}>Detalles</h2>
              <dl className={styles.specList}>
                {specEntries.map(([key, value]) => (
                  <div key={key} className={styles.specRow}>
                    <dt>{key}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {product.body && (
            <section className={styles.descriptionSection}>
              <h2 className={styles.sectionTitle}>Descripción</h2>
              <MarkdownBody content={product.body} />
            </section>
          )}

          {product.externalLinks.length > 0 && (
            <section className={styles.links}>
              <h2 className={styles.sectionTitle}>También publicado en</h2>
              <ul className={styles.linkList}>
                {product.externalLinks.map(link => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {platformLabels[link.platform] ?? link.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <SellerProductTools
            product={product}
            slug={slug}
            canonicalUrl={productUrl(product.slug)}
          />
        </div>
      </article>
    </>
  )
}
