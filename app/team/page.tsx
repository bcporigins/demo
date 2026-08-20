import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpTeamPage } from '@/components/bcp/team-page'

// The people roster and partner logos come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Meet the Team',
  description:
    'Dedicated individuals working to empower the next generation of African Leaders.',
  path: '/team',
})

export default function Page() {
  return <BcpTeamPage />
}
