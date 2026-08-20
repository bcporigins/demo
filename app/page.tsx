import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpHomePage } from '@/components/bcp/home-page'

// Stats, testimonials, partners, and the upcoming event come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Building the Next Generation of African Talents',
  description:
    'A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers.',
  path: '/',
})

export default function Page() {
  return <BcpHomePage />
}
