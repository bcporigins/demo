import type { Metadata } from 'next'
import { BcpRegionalHostPage } from '@/components/bcp/regional-host-page'

export const metadata: Metadata = {
  title: 'Become a Regional Host | BCP',
  description:
    'Empower young leaders and host impactful events in your city with the full support of BCP.',
}

export default function Page() {
  return <BcpRegionalHostPage />
}
