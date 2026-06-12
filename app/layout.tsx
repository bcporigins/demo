import type { Metadata } from 'next'
import { Hepta_Slab, Raleway, Inter } from 'next/font/google'
import { BcpNav } from '@/components/bcp/nav'
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

export const metadata: Metadata = {
  title: 'BCP',
  description:
    'A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers.',
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
