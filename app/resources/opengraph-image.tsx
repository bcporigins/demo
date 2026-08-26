import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Tools, research, and stories — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Resources",
    title: "Tools, research, and stories",
    subtitle: "Blog posts, downloads, event toolkits, and the BCP media kit in one place.",
  })
}
