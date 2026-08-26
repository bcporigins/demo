import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Find your people — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Community",
    title: "Find your people",
    subtitle: "Students, graduates, job seekers, and founders growing together across Africa and beyond.",
  })
}
