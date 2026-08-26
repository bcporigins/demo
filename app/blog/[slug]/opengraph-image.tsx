import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'
import { getPostBySlug } from '@/lib/notion'

export const alt = 'BCP Origins article'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

// Matches the page's own revalidate so a retitled post gets a fresh card.
export const revalidate = 60

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getPostBySlug(slug)
  return bcpOgImage({
    eyebrow: result?.post.type || 'Blog',
    title: result?.post.title ?? 'BCP Origins',
    subtitle: result?.post.excerpt || undefined,
  })
}
