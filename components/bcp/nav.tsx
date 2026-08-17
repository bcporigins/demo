'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/components/bcp/ui'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href.startsWith('/#')) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function BcpNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="relative z-50 bg-[#fbfbfb] shadow-[0px_0px_20px_2px_rgba(86,86,86,0.1)]">
      <div className="flex h-[88px] items-center justify-between gap-4 px-6 lg:px-8 2xl:px-16">
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
          <Image src="/bcp/logo.png" alt="BCP" width={108} height={31} className="h-[31px] w-auto" />
        </Link>
        {/* Desktop links. Sized so all twelve fit one line without wrapping —
            below 1024px the hamburger takes over instead. */}
        <nav className="hidden items-center gap-x-0.5 lg:flex xl:gap-x-1.5 2xl:gap-x-3">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`whitespace-nowrap px-1.5 py-2.5 text-[13px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)] hover:font-bold xl:px-2 xl:text-[15px] 2xl:text-[16px] ${
                isActive(pathname, href) ? 'font-bold' : 'font-medium'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        {/* Hamburger */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex size-11 shrink-0 items-center justify-center rounded-[3px] border-2 border-[#2b3034] text-[#2b3034] lg:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <nav className="absolute inset-x-0 top-full flex max-h-[calc(100vh-88px)] flex-col overflow-y-auto border-t-2 border-[#2b3034] bg-[#fbfbfb] px-6 py-4 shadow-[0px_20px_20px_rgba(86,86,86,0.15)] lg:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className={`border-b border-[#ebe8e3] p-3.5 text-[18px] leading-7 text-[#2b3034] last:border-b-0 [font-family:var(--font-raleway)] ${
                isActive(pathname, href) ? 'font-bold' : 'font-medium'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
