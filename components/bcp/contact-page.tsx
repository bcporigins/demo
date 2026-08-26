import { BcpHero, BrutalButton, JoinCommunity, BcpFooter, SocialIcons } from '@/components/bcp/ui'
import { ContactForm } from '@/components/bcp/contact-form'
import { EMAILS, PHONE, WHATSAPP_COMMUNITY } from '@/lib/site'

/* ------------------------------------------------------------------ */
/* Contact Us — form with social icons                                 */
/* ------------------------------------------------------------------ */

function ContactSection() {
  return (
    <section className="relative overflow-hidden bg-[#fbfbfb] py-[72px]">
      <img
        src="/bcp/wave-2.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-60"
      />
      <div className="relative mx-auto flex max-w-[1202px] flex-col gap-10 p-6 md:p-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <h2 className="text-[36px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)]">
            Contact Us
          </h2>
          <SocialIcons
            className="gap-6"
            iconClassName="bg-[#2b3034] text-[#fbfbfb] hover:bg-[#fed07b] hover:text-[#2b3034]"
          />
        </div>
        <ContactForm />
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Contact Info band                                                   */
/* ------------------------------------------------------------------ */

function InfoColumn({ heading, value, href }: { heading: string; value: string; href: string }) {
  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-col gap-[19px]">
        <p className="text-[16.5px] font-semibold text-black [font-family:var(--font-inter)]">
          {heading}
        </p>
        <span className="h-[2.25px] w-[20.25px] bg-black" />
      </div>
      <div className="flex flex-col gap-[19px]">
        <a
          href={href}
          className="text-[16.5px] font-semibold text-black underline-offset-4 hover:underline [font-family:var(--font-inter)]"
        >
          {value}
        </a>
        <p className="max-w-[185px] text-[15px] leading-6 text-black [font-family:var(--font-inter)]">
          Assistance hours:
          <br />
          Monday - Friday 6 am to 8 pm WAT
        </p>
      </div>
    </div>
  )
}

function ContactInfo() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="/bcp/contact-pattern.png"
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full object-cover opacity-10"
      />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 px-6 py-[60px] lg:flex-row lg:gap-[52px] lg:px-[180px]">
        <div className="flex flex-col gap-[18px]">
          <p className="text-[18px] leading-[27px] text-black [font-family:var(--font-raleway)]">
            Contact Info
          </p>
          <h2 className="max-w-[380px] text-[36px] font-bold leading-[1.3] text-black [font-family:var(--font-hepta-slab)]">
            We are always happy to assist you
          </h2>
        </div>
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-[76px]">
          <InfoColumn
            heading="Email Address"
            value={EMAILS.general}
            href={`mailto:${EMAILS.general}`}
          />
          <InfoColumn
            heading="Partnerships"
            value={EMAILS.brand}
            href={`mailto:${EMAILS.brand}`}
          />
          <InfoColumn heading="Number" value={PHONE.display} href={`tel:${PHONE.tel}`} />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Join Our Community card                                             */
/* ------------------------------------------------------------------ */

function JoinOurCommunity() {
  return (
    // Gutter on the section, or the bordered box below fills the width and
    // its border sits flush to both screen edges under 1280px — the same
    // full-bleed rule that showed up on /community.
    <section className="bg-[#fbfbfb] px-6 py-[55px] lg:px-20">
      <div className="mx-auto flex min-h-[295px] max-w-[1280px] flex-col items-center justify-center gap-[52px] border-[6px] border-[#2b3034] bg-[#fbfbfb] px-6 shadow-[0px_0px_4px_rgba(176,200,169,0.2)]">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <h2 className="text-[28px] font-semibold leading-tight text-[#2b3034] [font-family:var(--font-hepta-slab)] md:text-[36px]">
            Join Our Community
          </h2>
          <p className="text-[20px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)]">
            Ready to connect with ambitious young Africans and unlock opportunities?
          </p>
        </div>
        <BrutalButton href={WHATSAPP_COMMUNITY} className="h-[64px] w-[296px]">
          Join the BCP Community
        </BrutalButton>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export function BcpContactPage() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      {/* The design's hero reuses the "Join The BCP Team" copy verbatim */}
      <BcpHero
        title="Join The BCP Team"
        subtitle="Be part of something meaningful. We're looking for passionate individuals to join our team and make a difference in the community."
        subtitleSize="sm"
      />
      <ContactSection />
      <ContactInfo />
      <JoinOurCommunity />
      <JoinCommunity />
      <BcpFooter />
    </main>
  )
}
