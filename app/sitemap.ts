import type { MetadataRoute } from 'next'
import { getPosts, getRoles } from '@/lib/notion'
import { SITE_URL } from '@/lib/site'

// Regenerated on the same cadence as the pages themselves, so a post published
// in Notion shows up in the sitemap within a minute.
export const revalidate = 60

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/about', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/programs', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/events', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/community', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/team', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/partners', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/regional-host', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/gallery', priority: 0.6, changeFrequency: 'weekly' },
  { path: '/resources', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/careers', priority: 0.7, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.6, changeFrequency: 'monthly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    })
  )

  // Notion is optional: an unconfigured or unreachable workspace must not take
  // the sitemap down with it, so the dynamic half is best-effort.
  try {
    const posts = await getPosts()
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  } catch {
    // leave the blog out of this build's sitemap
  }

  try {
    const roles = await getRoles()
    for (const role of roles) {
      entries.push({
        url: `${SITE_URL}/careers/${role.slug}`,
        lastModified: role.date ? new Date(role.date) : now,
        changeFrequency: 'weekly',
        priority: 0.5,
      })
    }
  } catch {
    // leave open roles out of this build's sitemap
  }

  return entries
}
