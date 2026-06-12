import type { Metadata } from 'next'
import { BcpHomePage } from '@/components/bcp/home-page'

export const metadata: Metadata = {
  title: 'BCP | Building the Next Generation of African Talent',
  description:
    'A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers.',
}

export default function Page() {
  return <BcpHomePage />
}
