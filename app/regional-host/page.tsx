import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpRegionalHostPage } from '@/components/bcp/regional-host-page'

// Resource library links come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Become a Regional Host',
  description:
    'Empower young leaders and host impactful events in your city with the full support of BCP.',
  path: '/regional-host',
})

export default function Page() {
  return <BcpRegionalHostPage />
}
