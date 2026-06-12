import type { Metadata } from 'next'
import { BcpTeamPage } from '@/components/bcp/team-page'

export const metadata: Metadata = {
  title: 'Meet the Team | BCP',
  description:
    'Dedicated individuals working to empower the next generation of African Leaders.',
}

export default function Page() {
  return <BcpTeamPage />
}
