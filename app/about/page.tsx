import type { Metadata } from 'next'
import { BcpAboutPage } from '@/components/bcp/about-page'

export const metadata: Metadata = {
  title: 'About Us | BCP',
  description:
    'BCP Origins began in 2022 in Akure, Nigeria, with a mission to empower young Africans through knowledge and community.',
}

export default function Page() {
  return <BcpAboutPage />
}
