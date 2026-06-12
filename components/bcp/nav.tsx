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
      <div className="flex h-[88px] items-center justify-between px-6 lg:px-20">
        <Link href="/" onClick={() => setOpen(false)}>
          <Image src="/bcp/logo.png" alt="BCP" width={108} height={31} className="h-[31px] w-auto" />
        </Link>
        {/* Desktop links */}
        <nav className="hidden items-center gap-2 md:flex lg:gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className={`p-2.5 text-[18px] leading-7 text-[#2b3034] [font-family:var(--font-raleway)] hover:font-bold ${
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
          className="flex size-11 items-center justify-center rounded-[3px] border-2 border-[#2b3034] text-[#2b3034] md:hidden"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <nav className="absolute inset-x-0 top-full flex flex-col border-t-2 border-[#2b3034] bg-[#fbfbfb] px-6 py-4 shadow-[0px_20px_20px_rgba(86,86,86,0.15)] md:hidden">
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
