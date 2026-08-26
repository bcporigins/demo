import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Reach Africa’s emerging talent — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Partnerships",
    title: "Reach Africa’s emerging talent",
    subtitle: "Get in front of a high-growth demographic actively building careers and companies.",
  })
}
