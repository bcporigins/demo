import type { Metadata } from 'next'
import { BcpCommunityPage } from '@/components/bcp/community-page'

export const metadata: Metadata = {
  title: 'Community | BCP',
  description:
    'A network of ambitious young Africans across Nigeria, UK, and beyond, united by a desire to grow, build, and lead.',
}

export default function Page() {
  return <BcpCommunityPage />
}
