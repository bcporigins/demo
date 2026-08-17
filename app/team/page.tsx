import type { Metadata } from 'next'
import { BcpTeamPage } from '@/components/bcp/team-page'

// The people roster and partner logos come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Meet the Team | BCP',
  description:
    'Dedicated individuals working to empower the next generation of African Leaders.',
}

export default function Page() {
  return <BcpTeamPage />
}
