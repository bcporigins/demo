import type { Metadata } from 'next'
import { BcpCareersPage } from '@/components/bcp/careers-page'

// Open roles come from Notion — refresh at most every 60s
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Careers | BCP',
  description:
    "Be part of something meaningful. We're looking for passionate individuals to join our team and make a difference in the community.",
}

export default function Page() {
  return <BcpCareersPage />
}
