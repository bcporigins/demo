import type { Metadata } from 'next'

/**
 * Per-page metadata. Next inherits `openGraph` and `alternates` wholesale from
 * the root layout when a page leaves them out, which would give every page the
 * home page's canonical URL and share card — so every page builds its own here
 * rather than repeating the same four blocks fourteen times.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  /** Route the page lives at, leading slash included. */
  path: string
}): Metadata {
  const shareTitle = `${title} | BCP Origins`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: 'BCP Origins',
      locale: 'en_US',
      url: path,
      title: shareTitle,
      description,
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description },
  }
}

/**
 * Same, for a Notion-backed article or job listing.
 *
 * Deliberately sets no `openGraph.images`. Two reasons: an explicit value
 * overrides the route's own `opengraph-image.tsx`, and Notion's cover URLs are
 * signed links that expire within the hour — a crawler fetching the page a day
 * later would find a dead image, which is worse than no image at all. The
 * generated card carries the post's title and excerpt instead.
 */
export function articleMetadata({
  title,
  description,
  path,
  publishedTime,
}: {
  title: string
  description?: string
  path: string
  publishedTime?: string | null
}): Metadata {
  const shareTitle = `${title} | BCP Origins`
  return {
    title,
    description: description || undefined,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      siteName: 'BCP Origins',
      locale: 'en_US',
      url: path,
      title: shareTitle,
      description: description || undefined,
      publishedTime: publishedTime || undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: description || undefined,
    },
  }
}
