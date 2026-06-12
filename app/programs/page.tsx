import type { Metadata } from 'next'
import { BcpProgramsPage } from '@/components/bcp/programs-page'

export const metadata: Metadata = {
  title: 'Our Programs | BCP',
  description:
    'A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers.',
}

export default function Page() {
  return <BcpProgramsPage />
}
