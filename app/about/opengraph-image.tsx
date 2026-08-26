import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Where BCP Origins started — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "About",
    title: "Where BCP Origins started",
    subtitle: "From 120 attendees in Akure in 2022 to a community spanning Nigeria, the UK, Canada, and Cyprus.",
  })
}
