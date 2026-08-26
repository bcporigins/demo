import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react'
import { SubscribeForm } from '@/components/bcp/subscribe-form'
import {
  SOCIALS as SOCIAL_URLS,
  EMAILS,
  PHONE,
  WHATSAPP_COMMUNITY,
} from '@/lib/site'

// Labels are kept short so all twelve links sit on one unwrapped row from
// 1024px up; the hamburger menu takes over below that.
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/team', label: 'Team' },
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
  { href: '/careers', label: 'Careers' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/partners', label: 'Partners' },
  { href: '/programs', label: 'Programs' },
  { href: '/regional-host', label: 'Regional Host' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
]

// Accounts with a blank URL in lib/site.ts are dropped rather than linked to
// a dead "#", so the footer only ever shows channels BCP actually runs.
export const SOCIALS = (
  [
    { icon: Facebook, label: 'Facebook', href: SOCIAL_URLS.facebook },
    { icon: Twitter, label: 'X (Twitter)', href: SOCIAL_URLS.twitter },
    { icon: Instagram, label: 'Instagram', href: SOCIAL_URLS.instagram },
    { icon: Youtube, label: 'YouTube', href: SOCIAL_URLS.youtube },
    { icon: Linkedin, label: 'LinkedIn', href: SOCIAL_URLS.linkedin },
  ] as const
).filter((social) => social.href.length > 0)

// Isometric cube grid approximating the Figma hero pattern overlay
const HERO_PATTERN = {
  backgroundImage: [
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 60px)',
    'repeating-linear-gradient(30deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 52px)',
    'repeating-linear-gradient(150deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 52px)',
  ].join(', '),
}

/** True for links that leave the site and should open in a new tab. */
export function isExternal(href: string) {
  return /^(https?:|mailto:|tel:)/.test(href)
}

/**
 * The site's signature offset-shadow button. Pass `href` to render it as a
 * link (internal hrefs go through next/link, external ones open in a new
 * tab); omit it for a plain button, e.g. a form submit.
 */
export function BrutalButton({
  children,
  className = '',
  variant = 'yellow',
  href,
  type,
  disabled,
  ...rest
}: {
  children: React.ReactNode
  className?: string
  variant?: 'yellow' | 'beige' | 'white'
  href?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  'aria-label'?: string
}) {
  const background =
    variant === 'yellow' ? 'bg-[#fed07b]' : variant === 'white' ? 'bg-[#fbfbfb]' : 'bg-[#ebe8e3]'
  const classes = `flex h-[50px] items-center justify-center rounded-[3px] border-2 border-[#1f1f1f] px-5 text-center text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1f1f1f] ${background} ${className}`

  if (href) {
    return isExternal(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type ?? 'button'} disabled={disabled} className={classes} {...rest}>
      {children}
    </button>
  )
}

/** Renders a row of social icons; nothing at all when none are configured. */
export function SocialIcons({
  className = '',
  iconClassName = 'bg-[#fbfbfb] text-[#2b3034] hover:bg-[#fed07b]',
  size = 'size-[50px]',
  glyphSize = 'size-5',
}: {
  className?: string
  iconClassName?: string
  /** Diameter of the circle. Kept separate from `iconClassName` so a caller
   *  can restyle the colours without also having to restate the size. */
  size?: string
  glyphSize?: string
}) {
  if (SOCIALS.length === 0) return null
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {SOCIALS.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex ${size} items-center justify-center rounded-full transition-colors ${iconClassName}`}
        >
          <Icon className={glyphSize} />
        </a>
      ))}
    </div>
  )
}

export function BcpHero({
  title,
  subtitle,
  subtitleSize = 'lg',
}: {
  title: string
  subtitle?: string
  subtitleSize?: 'lg' | 'sm'
}) {
  return (
    <section className="relative flex min-h-[468px] items-center bg-[#2b3034]">
      <div aria-hidden className="absolute inset-0" style={HERO_PATTERN} />
      <div className="relative mx-auto w-full max-w-[1253px] px-6 py-20 lg:px-0">
        <div className="flex max-w-[1033px] flex-col gap-2.5">
          <h1 className="text-[44px] font-bold tracking-[0.01em] text-[#ebe8e3] [font-family:var(--font-hepta-slab)] md:text-[68px]">
            {title}
          </h1>
          {subtitle && (
            <p
              className={`leading-7 text-[#ebe8e3] [font-family:var(--font-raleway)] ${
                subtitleSize === 'lg'
                  ? 'max-w-[820px] text-[20px] font-medium md:text-[24px]'
                  : 'max-w-[1033px] text-[18px] font-normal text-[#fbfbfb]'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export function JoinCommunity() {
  return (
    <section
      id="join-the-community"
      className="relative overflow-hidden bg-[#f2f2f2] py-[68px] scroll-mt-24"
    >
      {/* Decorative envelope clusters, positioned per the Figma Section-8 */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <img src="/bcp/envelope-4.svg" alt="" className="absolute left-[9.7%] top-[36%] w-[60px] md:w-[91px]" />
        <img src="/bcp/envelope-5.svg" alt="" className="absolute left-[18.8%] top-[33%] w-[30px] md:w-[46px]" />
        <img src="/bcp/envelope-6.svg" alt="" className="absolute left-[18.3%] top-[55%] w-[20px] md:w-[31px]" />
        <img src="/bcp/envelope-2.svg" alt="" className="absolute left-[76.9%] top-[32%] w-[35px] md:w-[53px]" />
        <img src="/bcp/envelope-3.svg" alt="" className="absolute left-[87.6%] top-[27%] w-[20px] md:w-[31px]" />
        <img src="/bcp/envelope-1.svg" alt="" className="absolute left-[81.8%] top-[39%] w-[72px] md:w-[110px]" />
      </div>
      <div className="relative mx-auto flex max-w-[716px] flex-col items-center gap-3 px-6 text-center">
        <h2 className="text-[36px] font-bold capitalize text-black [font-family:var(--font-hepta-slab)]">
          Join the Community
        </h2>
        <p className="text-[23px] leading-9 text-[#414141] [font-family:var(--font-raleway)]">
          Be a part of a movement shaping the future workforce.
        </p>
        <SubscribeForm />
      </div>
    </section>
  )
}

/* Twelve links in one flat row wrapped into an orphaned second line and read as
 * an undifferentiated list. Grouping them by intent — what BCP is, how to take
 * part, how to reach us — lets someone scan to the right column first. */
const FOOTER_COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { href: '/about', label: 'About' },
      { href: '/programs', label: 'Programs' },
      { href: '/team', label: 'Team' },
      { href: '/resources', label: 'Resources' },
    ],
  },
  {
    heading: 'Experiences',
    links: [
      { href: '/events', label: 'Events' },
      { href: '/gallery', label: 'Gallery' },
      { href: '/community', label: 'Community' },
    ],
  },
  {
    // Short noun labels rather than "Become a Regional Host" — the column
    // heading already carries the verb, and they stay on one line at every
    // width instead of wrapping in the 1024-1280px band.
    heading: 'Get involved',
    links: [
      { href: '/regional-host', label: 'Regional Host' },
      { href: '/partners', label: 'Partners' },
      { href: '/careers', label: 'Careers' },
    ],
  },
]

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const classes =
    'text-[16px] leading-8 text-[#c9ced3] transition-colors [font-family:var(--font-raleway)] hover:text-[#fed07b]'
  return isExternal(href) ? (
    <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

export function BcpFooter() {
  return (
    <footer className="relative overflow-hidden border-t-[6px] border-[#fed07b] bg-[#2b3034]">
      <div aria-hidden className="absolute inset-0 opacity-60" style={HERO_PATTERN} />
      <div className="relative mx-auto max-w-[1376px] px-6 pb-10 pt-16 lg:px-8 lg:pt-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1.15fr] lg:gap-10">
          {/* Brand */}
          <div className="flex flex-col items-start gap-5">
            <Link href="/" aria-label="BCP Origins — home">
              <Image
                src="/bcp/logo.png"
                alt="BCP"
                width={124}
                height={36}
                className="h-9 w-auto brightness-0 invert"
              />
            </Link>
            <p className="max-w-[300px] text-[15px] leading-7 text-[#a9afb6] [font-family:var(--font-raleway)]">
              A global community empowering young Africans with the knowledge, network,
              and opportunities to build exceptional careers.
            </p>
            <SocialIcons
              className="mt-1 gap-2.5"
              size="size-10"
              glyphSize="size-[18px]"
              iconClassName="border border-white/20 bg-transparent text-[#fbfbfb] hover:border-[#fed07b] hover:bg-[#fed07b] hover:text-[#2b3034]"
            />
          </div>

          {FOOTER_COLUMNS.map(({ heading, links }) => (
            <nav key={heading} className="flex flex-col gap-3" aria-label={heading}>
              <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#fed07b] [font-family:var(--font-raleway)]">
                {heading}
              </h2>
              <div className="flex flex-col items-start">
                {links.map(({ href, label }) => (
                  <FooterLink key={label} href={href}>
                    {label}
                  </FooterLink>
                ))}
              </div>
            </nav>
          ))}

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.14em] text-[#fed07b] [font-family:var(--font-raleway)]">
              Get in touch
            </h2>
            <div className="flex flex-col items-start">
              <FooterLink href={`mailto:${EMAILS.general}`}>{EMAILS.general}</FooterLink>
              <FooterLink href={`mailto:${EMAILS.brand}`}>{EMAILS.brand}</FooterLink>
              <FooterLink href={`tel:${PHONE.tel}`}>{PHONE.display}</FooterLink>
              <FooterLink href={WHATSAPP_COMMUNITY}>WhatsApp community</FooterLink>
              <FooterLink href="/contact">Contact us</FooterLink>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] text-[#8d949b] [font-family:var(--font-raleway)]">
            &copy; {new Date().getFullYear()} BCP Origins. All rights reserved.
          </p>
          <p className="text-[14px] text-[#8d949b] [font-family:var(--font-raleway)]">
            Building the next generation of African talents.
          </p>
        </div>
      </div>
    </footer>
  )
}
