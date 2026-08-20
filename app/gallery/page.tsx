import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpGalleryPage } from '@/components/bcp/gallery-page'

// Gallery editions come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = pageMetadata({
  title: 'Gallery',
  description:
    'Our journey in pixels — photos, video highlights, and recaps from BCP Origins events across Nigeria and the UK.',
  path: '/gallery',
})

export default function Page() {
  return <BcpGalleryPage />
}
