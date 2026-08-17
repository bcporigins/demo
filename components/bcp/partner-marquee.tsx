import type { PartnerLogo } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Looping logo rows, shared by the home page and the partners page.   */
/* Logos come from the Notion Partners table, so adding one is a new   */
/* row there rather than a code change. A logo with a Website set is   */
/* clickable; the rest render as plain tiles.                          */
/* ------------------------------------------------------------------ */

function LogoTile({ partner }: { partner: PartnerLogo }) {
  // Notion file URLs are short-lived signed links, so these bypass next/image
  const tile = (
    <div className="flex h-[129px] w-[180px] items-center justify-center bg-[#ebe8e3] p-4">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={partner.logo}
        alt={partner.name}
        className="max-h-[86px] max-w-[120px] object-contain"
      />
    </div>
  )
  if (!partner.url) return tile
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={partner.name}
      className="transition-transform hover:-translate-y-0.5"
    >
      {tile}
    </a>
  )
}

export function MarqueeRow({
  partners,
  reverse = false,
}: {
  partners: PartnerLogo[]
  reverse?: boolean
}) {
  // Content duplicated so the -50% translate loops seamlessly
  const logos = [...partners, ...partners]
  return (
    <div className="bcp-marquee-row overflow-hidden">
      <div className={`bcp-marquee flex w-max gap-[27px] ${reverse ? 'bcp-marquee-reverse' : ''}`}>
        {logos.map((partner, i) => (
          <LogoTile key={`${partner.id}-${i}`} partner={partner} />
        ))}
      </div>
    </div>
  )
}

/** Three rows, the middle one travelling the other way. */
export function PartnerMarquee({
  partners,
  className = '',
}: {
  partners: PartnerLogo[]
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-[25px] ${className}`}>
      <MarqueeRow partners={partners} />
      <MarqueeRow partners={partners} reverse />
      <MarqueeRow partners={partners} />
    </div>
  )
}

/** Static wrapped grid of logos — used by the Advisors & Partners section. */
export function PartnerGrid({ partners }: { partners: PartnerLogo[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-[27px]">
      {partners.map((partner) => (
        <LogoTile key={partner.id} partner={partner} />
      ))}
    </div>
  )
}
