import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "Building the Next Generation of African Talents — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "BCP Origins",
    title: "Building the Next Generation of African Talents",
    subtitle: "A global community equipping young Africans with the skills, network, and opportunities to thrive.",
  })
}
