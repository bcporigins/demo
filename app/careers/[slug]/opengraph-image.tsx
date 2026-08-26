import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { getRoleBySlug } from '@/lib/notion'

export const alt = 'Open role at BCP Origins'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export const revalidate = 60

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getRoleBySlug(slug)
  const role = result?.role
  return bcpOgImage({
    eyebrow: role?.department ? `Careers · ${role.department}` : 'Careers',
    title: role?.title ?? 'Join the BCP team',
    subtitle: role
      ? [role.location, role.commitment].filter(Boolean).join(' · ') || role.summary
      : undefined,
  })
}
