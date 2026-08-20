/* ------------------------------------------------------------------ */
/* Every outbound link, email, and phone number the site uses lives    */
/* here. Each one can be overridden with a NEXT_PUBLIC_ environment    */
/* variable, so links can be changed from the Vercel dashboard without */
/* touching code. Set a social URL to an empty string to hide its      */
/* icon everywhere instead of linking somewhere broken.                */
/* ------------------------------------------------------------------ */

/** Absolute origin of the deployed site, used for canonical URLs, the sitemap,
 *  and social share cards. Vercel sets VERCEL_PROJECT_PRODUCTION_URL on every
 *  build, so the only reason to set NEXT_PUBLIC_SITE_URL is a custom domain
 *  that should win over the .vercel.app one. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '')

export const WHATSAPP_COMMUNITY =
  process.env.NEXT_PUBLIC_BCP_WHATSAPP_URL ||
  'https://chat.whatsapp.com/HA9FWxgWWQA1vgMnDUAR1U'

export const YOUTUBE_CHANNEL =
  process.env.NEXT_PUBLIC_BCP_YOUTUBE_URL || 'https://www.youtube.com/@BCPOrigins'

/** Tally (or any) questionnaire for the Regional Host programme. Embedded
 *  inline on /events and /regional-host. Empty falls back to the built-in
 *  Notion-backed form so the page never renders a dead section. */
export const HOST_APPLICATION_FORM_URL =
  process.env.NEXT_PUBLIC_BCP_HOST_FORM_URL || ''

export const EMAILS = {
  general: 'help@bcporigins.com',
  brand: 'brand@bcporigins.com',
} as const

export const PHONE = {
  /** Shown on the contact page. */
  display: process.env.NEXT_PUBLIC_BCP_PHONE_DISPLAY || '+234 808 998 3425',
  /** Used for the tel: link — digits and a leading + only. */
  tel: process.env.NEXT_PUBLIC_BCP_PHONE_TEL || '+2348089983425',
} as const

/** Blank out any account BCP does not run and its icon disappears sitewide.
 *  Facebook is intentionally empty — BCP has no Facebook page. */
export const SOCIALS = {
  facebook: process.env.NEXT_PUBLIC_BCP_FACEBOOK_URL ?? '',
  twitter: process.env.NEXT_PUBLIC_BCP_TWITTER_URL ?? 'https://x.com/bcp_origins',
  instagram: process.env.NEXT_PUBLIC_BCP_INSTAGRAM_URL ?? 'https://www.instagram.com/bcp_global/',
  linkedin:
    process.env.NEXT_PUBLIC_BCP_LINKEDIN_URL ??
    'https://www.linkedin.com/company/bcp-origins/',
  youtube: process.env.NEXT_PUBLIC_BCP_YOUTUBE_URL ?? 'https://www.youtube.com/@BCPOrigins',
} as const

/** Pre-addressed mailto for partnership enquiries. */
export const PARTNERSHIP_MAILTO = `mailto:${EMAILS.brand}?subject=${encodeURIComponent(
  'Partnership enquiry — BCP Origins'
)}`

/** Fallback for a Register button when the event has no ticket link set yet. */
export const REGISTER_MAILTO = `mailto:${EMAILS.general}?subject=${encodeURIComponent(
  'Registering for the next BCP Origins event'
)}`

/** Pre-addressed mailto for speaker applications. */
export const SPEAKER_MAILTO = `mailto:${EMAILS.brand}?subject=${encodeURIComponent(
  'Speaker application — BCP Origins'
)}&body=${encodeURIComponent(
  [
    'Name:',
    'Role & organisation:',
    'Topic you would like to speak on:',
    'LinkedIn / portfolio:',
    '',
    'A little about you:',
  ].join('\n')
)}`

/* ------------------------------------------------------------------ */
/* YouTube helpers                                                     */
/* ------------------------------------------------------------------ */

/** Pulls the 11-character video id out of any common YouTube URL shape
 *  (watch?v=, youtu.be/, /embed/, /shorts/, /live/). Returns null for a
 *  channel or playlist URL, which has no single video to embed. */
export function youTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  )
  return match?.[1] ?? null
}

/** Privacy-friendly embed URL for a video id. */
export function youTubeEmbedUrl(id: string) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0`
}

/** Auto-generated thumbnail for a video id, used when no custom cover is set. */
export function youTubeThumbnail(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}
