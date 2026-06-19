export type ProductStatus = 'available' | 'reserved' | 'sold'

export type ExternalPlatform = 'mercadolibre' | 'facebook' | 'other'

export type ProductImage = {
  path: string
  alt: string
  order: number
}

export type ExternalListing = {
  platform: ExternalPlatform
  url: string
}

export type Product = {
  slug: string
  title: string
  description: string
  price: number
  currency: string
  status: ProductStatus
  tags: string[]
  images: ProductImage[]
  primaryImage: string
  specs: Record<string, string>
  externalLinks: ExternalListing[]
  hidden: boolean
  sortOrder: number | null
  createdAt: string
  body: string
}

export type AnalyticsEventType = 'pageview' | 'whatsapp_click' | 'copy_crosspost'

export type DeviceType = 'mobile' | 'desktop' | 'tablet'

export type AnalyticsEvent = {
  ts: string
  type: AnalyticsEventType
  path: string
  slug?: string
  device: DeviceType
  referrer?: string
  platform?: string
}

export type TrackPayload = {
  type: AnalyticsEventType
  path: string
  slug?: string
  platform?: string
}
