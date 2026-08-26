import { BcpHero, JoinCommunity, BcpFooter } from '@/components/bcp/ui'
import { PartnerGrid } from '@/components/bcp/partner-marquee'
import { TeamFlipCard } from '@/components/bcp/team-flip-card'
import { getPeople, getPartners } from '@/lib/notion'

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
