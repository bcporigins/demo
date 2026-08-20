import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpAboutPage } from '@/components/bcp/about-page'

export const metadata: Metadata = pageMetadata({
  title: 'About Us',
  description:
    'BCP Origins began in 2022 in Akure, Nigeria, with a mission to empower young Africans through knowledge and community.',
  path: '/about',
})

export default function Page() {
  return <BcpAboutPage />
}
