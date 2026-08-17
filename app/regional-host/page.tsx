import type { Metadata } from 'next'
import { BcpRegionalHostPage } from '@/components/bcp/regional-host-page'

// Resource library links come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Become a Regional Host | BCP',
  description:
    'Empower young leaders and host impactful events in your city with the full support of BCP.',
}

export default function Page() {
  return <BcpRegionalHostPage />
}
