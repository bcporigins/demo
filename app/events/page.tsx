import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpEventsPage } from '@/components/bcp/events-page'

// Events and the live calendar come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Events',
  description:
    'BCP Origins 2026 — Lagos Edition. Stakeholders Meeting, The Beginning of Tomorrow. Join us in Lagos in October 2026.',
  path: '/events',
})

export default function Page() {
  return <BcpEventsPage />
}
