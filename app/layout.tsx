import type { Metadata } from 'next'
import { Hepta_Slab, Raleway, Inter } from 'next/font/google'
import { BcpNav } from '@/components/bcp/nav'
import { SITE_URL } from '@/lib/site'
import './globals.css'

const heptaSlab = Hepta_Slab({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-hepta-slab',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-inter',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-raleway',
})

const DESCRIPTION =
  'A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'BCP Origins — Building the Next Generation of African Talents',
    // Pages set just their own name; the suffix is added here so it only ever
    // has to change in one place.
    template: '%s | BCP Origins',
  },
  description: DESCRIPTION,
  applicationName: 'BCP Origins',
  keywords: [
    'BCP Origins',
    'African talent',
    'career development',
    'tech community Africa',
    'mentorship',
    'student community',
  ],
  openGraph: {
    type: 'website',
    siteName: 'BCP Origins',
    locale: 'en_US',
    url: SITE_URL,
    title: 'BCP Origins — Building the Next Generation of African Talents',
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BCP Origins — Building the Next Generation of African Talents',
    description: DESCRIPTION,
  },
  alternates: { canonical: '/' },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${heptaSlab.variable} ${raleway.variable} ${inter.variable} antialiased`}>
        <BcpNav />
        {children}
      </body>
    </html>
  )
}
