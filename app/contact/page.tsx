import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'
import { BcpContactPage } from '@/components/bcp/contact-page'

export const metadata: Metadata = pageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with BCP — we are always happy to assist you. Reach us at help@bcporigins.com.',
  path: '/contact',
})

export default function Page() {
  return <BcpContactPage />
}
