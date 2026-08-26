import { Linkedin } from 'lucide-react'
import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { PartnerGrid } from '@/components/bcp/partner-marquee'
import { getPeople, getPartners, type Person } from '@/lib/notion'

/* ------------------------------------------------------------------ */
/* Flip card — photo front, dark bio back, spins on hover              */
/*                                                                     */
/* Name, role, bio, portrait, and LinkedIn all come from the Notion    */
/* People table so the roster can be edited without a deploy.          */
/* ------------------------------------------------------------------ */

function TeamFlipCard({ member }: { member: Person }) {
  // Portraits uploaded to Notion are served from short-lived signed URLs,
  // so they use a plain img rather than next/image
  const linkedInIcon = member.linkedin ? (
    <a
      href={member.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${member.name} on LinkedIn`}
      className="shrink-0 transition-opacity hover:opacity-70"
    >
      <Linkedin className="size-5 text-white" />
    </a>
  ) : null

  return (
    <div className="group aspect-square w-full [perspective:1000px]">
      <div className="relative size-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front: photo */}
        <div className="absolute inset-0 overflow-hidden border-[6px] border-[#2b3034] [backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={member.photo} alt={member.name} className="size-full object-cover" />
          {/* Hide 
          {linkedInIcon && <span className="absolute right-[13px] top-[13px]">{linkedInIcon}</span>}
          <span className="absolute bottom-[9px] left-[10px] p-2.5 text-[20px] font-medium text-white backdrop-blur-[2px] [font-family:var(--font-raleway)]">
            {member.name}
          </span>
          */}
        </div>
        {/* Back: dark bio card */}
        <div className="absolute inset-0 flex flex-col justify-between gap-2 border-[6px] border-[#2b3034] bg-[#2b3034] p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="flex items-start justify-between gap-2">
            <span className="flex flex-col">
              <span className="text-[19px] font-medium leading-tight text-white [font-family:var(--font-raleway)]">
                {member.name}
              </span>
              {member.role && (
                <span className="mt-1 text-[13px] leading-tight text-[#fed07b] [font-family:var(--font-raleway)]">
                  {member.role}
                </span>
              )}
            </span>
            {linkedInIcon}
          </div>
          <p className="line-clamp-[9] text-[13px] leading-[1.45] text-[#d6d6d6] [font-family:var(--font-raleway)]">
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

async function CoreTeam() {
  const members = await getPeople('Core Team')
  if (members.length === 0) return null
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[62px]">
      <img
        src="/bcp/wave-1.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="relative mx-auto flex max-w-[1078px] flex-col gap-[60px] px-6 lg:px-0">
        <SectionHeader
          title="Core Team"
          subtitle="Our leadership team brings together expertise in youth development, program management, and community building."
        />
        <div className="grid grid-cols-2 gap-[26px] sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <TeamFlipCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

async function RegionalHosts() {
  const members = await getPeople('Regional Host')
  if (members.length === 0) return null
  return (
    <section className="bg-[#fbfbfb] py-[62px]">
      <div className="mx-auto flex max-w-[802px] flex-col gap-[80px] px-6 lg:px-0">
        <SectionHeader
          title="Meet Our Regional Hosts"
          subtitle="The community leaders who bring the BCP Origins experience to their own cities."
        />
        <div className="grid grid-cols-2 gap-[26px] sm:grid-cols-3">
          {members.map((member) => (
            <TeamFlipCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** Community ambassadors (COAs). Hidden until the Notion table has rows,
 *  so an empty roster never leaves a headed but blank section on the page. */
async function CommunityAmbassadors() {
  const members = await getPeople('Community Ambassador')
  if (members.length === 0) return null
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[62px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-40"
      />
      <div className="relative mx-auto flex max-w-[1078px] flex-col gap-[60px] px-6 lg:px-0">
        <SectionHeader
          title="Community Ambassadors"
          subtitle="Our COAs represent BCP on their campuses and in their cities, opening doors for the people around them."
        />
        <div className="grid grid-cols-2 gap-[26px] sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <TeamFlipCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  )
}

async function AdvisorsPartners() {
  const [advisors, partners] = await Promise.all([getPeople('Advisor'), getPartners()])
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[62px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-50"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center gap-[60px] px-6">
        <SectionHeader
          title="Advisors & Partners"
          subtitle="The advisors and organisations backing the work, from programme design to venues, funding, and reach."
        />
        {advisors.length > 0 && (
          <div className="grid w-full max-w-[1078px] grid-cols-2 gap-[26px] sm:grid-cols-3 lg:grid-cols-4">
            {advisors.map((advisor) => (
              <TeamFlipCard key={advisor.id} member={advisor} />
            ))}
          </div>
        )}
        <PartnerGrid partners={partners} />
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
      <CommunityAmbassadors />
      <AdvisorsPartners />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
