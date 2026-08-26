import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Build BCP with us — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Careers",
    title: "Build BCP with us",
    subtitle: "Open roles and volunteer positions for people who want to shape the next generation.",
  })
}
