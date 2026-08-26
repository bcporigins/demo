import { bcpOgImage, OG_SIZE, OG_CONTENT_TYPE } from '@/lib/og'

export const alt = "The people behind BCP — BCP Origins"
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function Image() {
  return bcpOgImage({
    eyebrow: "Team",
    title: "The people behind BCP",
    subtitle: "Core team, regional hosts, advisors, and community ambassadors across four countries.",
  })
}
