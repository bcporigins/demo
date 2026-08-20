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

/** Same, for a Notion-backed article or job listing. */
export function articleMetadata({
  title,
  description,
  path,
  image,
  publishedTime,
}: {
  title: string
  description?: string
  path: string
  image?: string | null
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
      // Notion's own file URLs expire after an hour, so only a stable cover
      // survives here; otherwise the site-wide card is used.
      images: image && !image.includes('amazonaws.com') ? [image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: description || undefined,
    },
  }
}
