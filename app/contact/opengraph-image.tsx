import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Talk to BCP Origins — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Contact",
    title: "Talk to BCP Origins",
    subtitle: "Questions, partnerships, speaking, or press — we are always happy to hear from you.",
  })
}
