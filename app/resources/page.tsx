import type { Metadata } from 'next'
import { BcpResourcesPage } from '@/components/bcp/resources-page'

// Blog cards come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Resources | BCP',
  description:
    'Blog posts, research, downloads, and media resources from BCP Origins — closing the African talent gap.',
}

export default function Page() {
  return <BcpResourcesPage />
}
