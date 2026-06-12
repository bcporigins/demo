import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Youtube, Linkedin } from 'lucide-react'
import { SubscribeForm } from '@/components/bcp/subscribe-form'

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/community', label: 'Community' },
  { href: '/#faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact Us' },
]

const SOCIALS = [
  { icon: Facebook, label: 'Facebook', href: '#' },
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
]

// Isometric cube grid approximating the Figma hero pattern overlay
const HERO_PATTERN = {
  backgroundImage: [
    'repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 60px)',
    'repeating-linear-gradient(30deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 52px)',
    'repeating-linear-gradient(150deg, rgba(255,255,255,0.045) 0 1px, transparent 1px 52px)',
  ].join(', '),
}

export function BrutalButton({
  children,
  className = '',
  variant = 'yellow',
}: {
  children: React.ReactNode
  className?: string
  variant?: 'yellow' | 'beige'
}) {
  return (
    <button
      className={`flex h-[50px] items-center justify-center rounded-[3px] border-2 border-[#1f1f1f] px-5 text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1f1f1f] ${
        variant === 'yellow' ? 'bg-[#fed07b]' : 'bg-[#ebe8e3]'
      } ${className}`}
    >
      {children}
    </button>
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
    <section className="relative overflow-hidden bg-[#f2f2f2] py-[68px]">
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

export function BcpFooter() {
  return (
    <footer className="bg-[#2b3034]">
      <div className="mx-auto flex max-w-[1376px] flex-col gap-10 px-6 py-[84px] lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <Image
            src="/bcp/logo.png"
            alt="BCP"
            width={108}
            height={31}
            className="h-[31px] w-auto self-start brightness-0 invert"
          />
          <nav className="flex flex-wrap items-center gap-2 lg:gap-8">
            {NAV_LINKS.map(({ href, label }, i) => (
              <Link
                key={label}
                href={href}
                className={`p-2.5 text-[18px] leading-7 text-[#fbfbfb] [font-family:var(--font-raleway)] hover:font-bold ${i === 0 ? 'font-bold' : 'font-medium'}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {SOCIALS.map(({ icon: Icon, label, href }) => (
            <Link
              key={label}
              href={href}
              aria-label={label}
              className="flex size-[50px] items-center justify-center rounded-full bg-[#fbfbfb] text-[#2b3034] transition-colors hover:bg-[#fed07b]"
            >
              <Icon className="size-5" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
