import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpProgramsPage } from '@/components/bcp/programs-page'

export const metadata: Metadata = pageMetadata({
  title: 'Our Programs',
  description:
    'A global community empowering young Africans with the knowledge, network, and opportunities to build exceptional careers.',
  path: '/programs',
})

export default function Page() {
  return <BcpProgramsPage />
}
