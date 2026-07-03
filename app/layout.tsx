import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Cinzel, Montserrat } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '500', '600', '700', '800'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600'],
})

export const metadata: Metadata = {
  title: {
    default: 'Ashborn Aries Label — From Fire and Pain',
    template: '%s — Ashborn Aries Label',
  },
  description:
    'Official home of Ashborn Aries Label. Dark country, Southern gothic, cinematic western, sax lounge, and emotional music forged from fire, ash, pain, discipline, and rebirth.',
  metadataBase: new URL('https://ashbornaries.music'),
  openGraph: {
    title: 'Ashborn Aries Label — From Fire and Pain',
    description:
      'Dark country, Southern gothic, cinematic western, sax lounge, and emotional music forged from fire, ash, pain, discipline, and rebirth.',
    url: 'https://ashbornaries.music',
    siteName: 'Ashborn Aries Label',
    images: [{ url: '/images/brand/hero-square.webp', width: 1200, height: 1200 }],
    type: 'website',
  },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0B0B0B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`bg-background ${cinzel.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
