import Image from 'next/image'
import { Linkedin } from 'lucide-react'
import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'

/* ------------------------------------------------------------------ */
/* Flip card — photo front, dark bio back, spins on hover              */
/* ------------------------------------------------------------------ */

type Member = { name: string; bio: string; photo: string }

const DEFAULT_BIO =
  'Dedicated individuals working to empower the next generation of African Leaders.'

function TeamFlipCard({ member }: { member: Member }) {
  return (
    <div className="group aspect-square w-full [perspective:1000px]">
      <div className="relative size-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front: photo */}
        <div className="absolute inset-0 overflow-hidden border-[6px] border-[#2b3034] [backface-visibility:hidden]">
          <Image
            src={member.photo}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 250px, 50vw"
            className="object-cover"
          />
          <Linkedin className="absolute right-[13px] top-[13px] size-5 text-white" />
          <span className="absolute bottom-[9px] left-[10px] p-2.5 text-[20px] font-medium text-white backdrop-blur-[2px] [font-family:var(--font-raleway)]">
            {member.name}
          </span>
        </div>
        {/* Back: dark bio card */}
        <div className="absolute inset-0 flex flex-col justify-between border-[6px] border-[#2b3034] bg-[#2b3034] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-start justify-between gap-2">
            <p className="max-w-[170px] text-[20px] font-medium leading-tight text-white [font-family:var(--font-raleway)]">
              {member.name}
            </p>
            <Linkedin className="size-5 shrink-0 text-white" />
          </div>
          <p className="max-w-[181px] text-[13px] leading-4 text-[#d6d6d6] [font-family:var(--font-raleway)]">
            {member.bio}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

const CORE_TEAM: Member[] = Array.from({ length: 15 }).map(() => ({
  name: 'Toluwase Olugbemiro',
  bio: DEFAULT_BIO,
  photo: '/bcp/core-values-photo.png',
}))

const REGIONAL_HOSTS: Member[] = Array.from({ length: 6 }).map(() => ({
  name: 'Toluwase Olugbemiro',
  bio: DEFAULT_BIO,
  photo: '/bcp/core-values-photo.png',
}))

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center gap-[24px] text-center">
      <h2 className="text-[36px] font-bold leading-[48px] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
        {title}
      </h2>
      <p className="max-w-[914px] text-[18px] leading-7 text-[#414141] [font-family:var(--font-raleway)]">
        {subtitle}
      </p>
    </div>
  )
}

const TEAM_SUBTITLE =
  'Our leadership team brings together expertise in youth development, program management, and community building.'

function CoreTeam() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[62px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="relative mx-auto flex max-w-[1078px] flex-col gap-[60px] px-6 lg:px-0">
        <SectionHeader title="Core Team" subtitle={TEAM_SUBTITLE} />
        <div className="grid grid-cols-2 gap-[26px] sm:grid-cols-3 lg:grid-cols-4">
          {CORE_TEAM.map((member, i) => (
            <TeamFlipCard key={i} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

function RegionalHosts() {
  return (
    <section className="bg-[#fbfbfb] py-[62px]">
      <div className="mx-auto flex max-w-[802px] flex-col gap-[80px] px-6 lg:px-0">
        <SectionHeader title="Meet Our Regional Hosts" subtitle={TEAM_SUBTITLE} />
        <div className="grid grid-cols-2 gap-[26px] sm:grid-cols-3">
          {REGIONAL_HOSTS.map((member, i) => (
            <TeamFlipCard key={i} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Advisors & Partners                                                 */
/* ------------------------------------------------------------------ */

const PARTNER_ROW_1 = ['/bcp/partner-1.png', '/bcp/partner-2.png', '/bcp/partner-3.png', '/bcp/partner-4.png']
const PARTNER_ROW_2 = ['/bcp/partner-5.png', '/bcp/partner-6.png', '/bcp/partner-3.png']

function LogoTile({ src }: { src: string }) {
  return (
    <div className="flex h-[129px] w-[180px] items-center justify-center bg-[#ebe8e3]">
      <Image src={src} alt="Partner logo" width={120} height={86} className="object-contain" />
    </div>
  )
}

function AdvisorsPartners() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[62px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-[60px] px-6">
        <SectionHeader title="Advisors & Partners" subtitle={TEAM_SUBTITLE} />
        <div className="flex flex-col items-center gap-[25px]">
          <div className="flex flex-wrap justify-center gap-[27px]">
            {PARTNER_ROW_1.map((src, i) => (
              <LogoTile key={i} src={src} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-[27px]">
            {PARTNER_ROW_2.map((src, i) => (
              <LogoTile key={i} src={src} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpTeamPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <BcpHero
        title="Meet the Team"
        subtitle="Dedicated individuals working to empower the next generation of African Leaders."
        subtitleSize="sm"
      />
      <CoreTeam />
      <RegionalHosts />
      <AdvisorsPartners />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
