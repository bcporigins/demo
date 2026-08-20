import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpCommunityPage } from '@/components/bcp/community-page'

// Origin stories come from the Notion blog — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Community',
  description:
    'A network of ambitious young Africans across Nigeria, UK, and beyond, united by a desire to grow, build, and lead.',
  path: '/community',
})

export default function Page() {
  return <BcpCommunityPage />
}
