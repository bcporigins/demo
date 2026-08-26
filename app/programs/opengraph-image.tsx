import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "The tracks we run — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Programs",
    title: "The tracks we run",
    subtitle: "Flagship gatherings, regional events, and mini experiences built around real career outcomes.",
  })
}
