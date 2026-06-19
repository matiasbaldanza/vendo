import { getAllProducts, getAllTags } from '@/lib/products'
import ProductCatalog from '@/components/ProductCatalog'
import PageViewTracker from '@/components/PageViewTracker'
import styles from './page.module.css'

export default function HomePage() {
  const products = getAllProducts()
  const tags = getAllTags()

  return (
    <>
      <PageViewTracker path="/" />
      <div className={styles.hero}>
        <h1 className={styles.title}>Cosas en venta</h1>
        <p className={styles.subtitle}>
          Venta de garage por mudanza. Elegí un producto y contactame por WhatsApp.
        </p>
      </div>
      <ProductCatalog products={products} tags={tags} />
    </>
  )
}
