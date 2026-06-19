import type { Metadata } from 'next'
import { Fraunces, Source_Sans_3 } from 'next/font/google'
import { siteConfig } from '../../site.config'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Vendo — Venta de garage',
    template: '%s | Vendo',
  },
  description: 'Catálogo de venta de garage. Contactá por WhatsApp.',
  metadataBase: new URL(siteConfig.baseUrl),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${fraunces.variable} ${sourceSans.variable}`}>
      <body>
        <div className="site">
          <header className="siteHeader">
            <div className="siteHeaderInner">
              <a href="/" className="siteLogo">Vendo</a>
              <p className="siteTagline">Venta de garage · {siteConfig.sellerName}</p>
            </div>
          </header>
          <main className="siteMain">{children}</main>
          <footer className="siteFooter">
            <p>Contacto por WhatsApp · {siteConfig.sellerName}</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
