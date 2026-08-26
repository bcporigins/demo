import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "BCP Origins 2026 — Lagos Edition — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Events",
    title: "BCP Origins 2026 — Lagos Edition",
    subtitle: "The Beginning of Tomorrow. Join us in Lagos this October for a gathering of minds.",
  })
}
