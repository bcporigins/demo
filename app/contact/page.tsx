import type { Metadata } from 'next'
import { BcpContactPage } from '@/components/bcp/contact-page'

export const metadata: Metadata = {
  title: 'Contact Us | BCP',
  description:
    'Get in touch with BCP — we are always happy to assist you. Reach us at help@bcporigins.com.',
}

export default function Page() {
  return <BcpContactPage />
}
