import Link from 'next/link'
import { BcpFooter, BrutalButton, NAV_LINKS } from '@/components/bcp/ui'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#fbfbfb]">
      <section className="relative flex min-h-[520px] items-center overflow-hidden bg-[#2b3034]">
        <img
          src="/bcp/wave-2.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-20"
        />
        <div className="relative mx-auto flex w-full max-w-[1253px] flex-col gap-6 px-6 py-20 lg:px-0">
          <p className="text-[20px] font-semibold uppercase tracking-[0.12em] text-[#fed07b] [font-family:var(--font-raleway)]">
            Error 404
          </p>
          <h1 className="max-w-[900px] text-[44px] font-bold leading-[1.2] tracking-[0.01em] text-[#ebe8e3] [font-family:var(--font-hepta-slab)] md:text-[62px]">
            This page isn&rsquo;t here
          </h1>
          <p className="max-w-[640px] text-[20px] leading-8 text-[#ebe8e3] [font-family:var(--font-raleway)]">
            The link may be out of date, or the page may have moved. Everything else is
            one click away below.
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            <BrutalButton href="/" className="w-full max-w-[220px]">
              Back to home
            </BrutalButton>
            <BrutalButton href="/contact" variant="beige" className="w-full max-w-[220px]">
              Contact us
            </BrutalButton>
          </div>
        </div>
      </section>

      <section className="bg-[#fbfbfb] py-[80px]">
        <div className="mx-auto flex max-w-[1253px] flex-col gap-8 px-6 lg:px-0">
          <h2 className="text-[28px] font-bold tracking-[0.01em] text-[#2b3034] [font-family:var(--font-hepta-slab)]">
            Or head somewhere else
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="border-[6px] border-[#2b3034] bg-[#fbfbfb] px-6 py-5 text-[20px] font-semibold text-[#2b3034] transition-transform [font-family:var(--font-hepta-slab)] hover:-translate-y-1 hover:bg-[#fed07b]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>
      <BcpFooter />
    </main>
  )
}
