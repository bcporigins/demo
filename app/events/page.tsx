import type { Metadata } from 'next'
import { BcpEventsPage } from '@/components/bcp/events-page'

export const metadata: Metadata = {
  title: 'Events | BCP',
  description:
    'BCP Origins 2026 — Lagos Edition. Stakeholders Meeting, The Beginning of Tomorrow. Join us in Lagos in October 2026.',
}

export default function Page() {
  return <BcpEventsPage />
}
