import type { Metadata } from 'next'
import { BcpPartnersPage } from '@/components/bcp/partners-page'

export const metadata: Metadata = {
  title: 'Partner with Us | BCP',
  description:
    'Gain access to a dynamic, high-growth demographic of young Africans actively building careers and companies.',
}

export default function Page() {
  return <BcpPartnersPage />
}
