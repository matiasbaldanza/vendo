import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Product, ProductStatus } from './types'

const CONTENT_DIR = path.join(process.cwd(), 'content/products')
const PUBLIC_DIR = path.join(process.cwd(), 'public')

const STATUS_ORDER: Record<ProductStatus, number> = {
  available: 0,
  reserved: 1,
  sold: 2,
}

function parseSpecs(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object') return {}
  const specs: Record<string, string> = {}
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    specs[key] = String(value)
  }
  return specs
}

function parseProductFile(filePath: string): Product | null {
  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const slug = path.basename(filePath, '.md')

  if (!data.title || data.price == null) return null

  const imagesDir = path.join(PUBLIC_DIR, 'products', slug)
  let images = Array.isArray(data.images) ? data.images : []

  if (images.length === 0 && fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'))
    images = files.map((filename, index) => ({
      path: `/products/${slug}/${filename}`,
      alt: data.title as string,
      order: index,
    }))
  }

  const normalizedImages = images.map((img: { path?: string, alt?: string, order?: number }, index: number) => ({
    path: img.path?.startsWith('/') ? img.path : `/products/${slug}/${img.path ?? img}`,
    alt: img.alt ?? (data.title as string),
    order: img.order ?? index,
  }))

  const primaryImage = (data.primaryImage as string)
    ? (data.primaryImage as string).startsWith('/')
      ? data.primaryImage
      : `/products/${slug}/${data.primaryImage}`
    : normalizedImages[0]?.path ?? ''

  const sortedImages = [...normalizedImages].sort((a, b) => {
    if (a.path === primaryImage) return -1
    if (b.path === primaryImage) return 1
    return a.order - b.order
  })

  return {
    slug,
    title: data.title as string,
    description: (data.description as string) ?? '',
    price: Number(data.price),
    currency: (data.currency as string) ?? 'ARS',
    status: (data.status as ProductStatus) ?? 'available',
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    images: sortedImages,
    primaryImage,
    specs: parseSpecs(data.specs),
    externalLinks: Array.isArray(data.externalLinks) ? data.externalLinks : [],
    hidden: Boolean(data.hidden),
    sortOrder: data.sortOrder != null ? Number(data.sortOrder) : null,
    createdAt: (data.createdAt as string) ?? new Date().toISOString(),
    body: content.trim(),
  }
}

export function getAllProducts(includeHidden = false): Product[] {
  if (!fs.existsSync(CONTENT_DIR)) return []

  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'))
  const products = files
    .map(f => parseProductFile(path.join(CONTENT_DIR, f)))
    .filter((p): p is Product => p !== null)
    .filter(p => includeHidden || !p.hidden)

  return sortProducts(products)
}

export function getProductBySlug(slug: string): Product | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const product = parseProductFile(filePath)
  if (!product || product.hidden) return null
  return product
}

export function getAllSlugs(): string[] {
  return getAllProducts().map(p => p.slug)
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  for (const product of getAllProducts()) {
    for (const tag of product.tags) tags.add(tag)
  }
  return [...tags].sort()
}

export function sortProducts(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (statusDiff !== 0) return statusDiff

    const orderA = a.sortOrder ?? Infinity
    const orderB = b.sortOrder ?? Infinity
    if (orderA !== orderB) return orderA - orderB

    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
}

export function filterProducts(
  products: Product[],
  options: { status?: ProductStatus | 'all', tag?: string | 'all' }
): Product[] {
  return products.filter(p => {
    if (options.status && options.status !== 'all' && p.status !== options.status) return false
    if (options.tag && options.tag !== 'all' && !p.tags.includes(options.tag)) return false
    return true
  })
}
