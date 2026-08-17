import type { Metadata } from 'next'
import { BcpPartnersPage } from '@/components/bcp/partners-page'

// Partner logos, partnership tiers, and impact stories come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Partner with Us | BCP',
  description:
    'Gain access to a dynamic, high-growth demographic of young Africans actively building careers and companies.',
}

export default function Page() {
  return <BcpPartnersPage />
}
