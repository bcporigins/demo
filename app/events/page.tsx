import type { Metadata } from 'next'
import { BcpEventsPage } from '@/components/bcp/events-page'

// Events and the live calendar come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Events | BCP',
  description:
    'BCP Origins 2026 — Lagos Edition. Stakeholders Meeting, The Beginning of Tomorrow. Join us in Lagos in October 2026.',
}

export default function Page() {
  return <BcpEventsPage />
}
