import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Bring BCP to your city — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Regional Host",
    title: "Bring BCP to your city",
    subtitle: "Host an edition with our full support — playbooks, speakers, brand, and community.",
  })
}
