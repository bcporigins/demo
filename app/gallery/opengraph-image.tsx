import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Our journey in pixels — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Gallery",
    title: "Our journey in pixels",
    subtitle: "Photos, highlights, and recaps from BCP Origins events across Nigeria and the UK.",
  })
}
