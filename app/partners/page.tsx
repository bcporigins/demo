import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpPartnersPage } from '@/components/bcp/partners-page'

// Partner logos, partnership tiers, and impact stories come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Partner with Us',
  description:
    'Gain access to a dynamic, high-growth demographic of young Africans actively building careers and companies.',
  path: '/partners',
})

export default function Page() {
  return <BcpPartnersPage />
}
