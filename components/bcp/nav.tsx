'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { NAV_GROUPS, NAV_DIRECT, BrutalButton, type NavItem } from '@/components/bcp/ui'
import { WHATSAPP_COMMUNITY } from '@/lib/site'

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  if (href.startsWith('/#')) return false
  return pathname === href || pathname.startsWith(`${href}/`)
}

/* ------------------------------------------------------------------ */
/* One row inside a dropdown: icon tile, label, one-line description   */
/* ------------------------------------------------------------------ */

function MenuItem({
  item,
  active,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  onNavigate: () => void
}) {
  const { href, label, description, icon: Icon } = item
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`group/item flex items-start gap-3 rounded-[3px] p-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b] ${
        active ? 'bg-[#f2efe9]' : 'hover:bg-[#f2efe9]'
      }`}
    >
      <span
        className={`mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-[3px] border-2 border-[#2b3034] transition-colors ${
          active ? 'bg-[#fed07b]' : 'bg-[#ebe8e3] group-hover/item:bg-[#fed07b]'
        }`}
      >
        <Icon className="size-[18px] text-[#2b3034]" strokeWidth={1.9} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-[15px] font-bold leading-5 text-[#2b3034] [font-family:var(--font-raleway)]">
          {label}
        </span>
        <span className="text-[13px] leading-[18px] text-[#6b7278] [font-family:var(--font-raleway)]">
          {description}
        </span>
      </span>
    </Link>
  )
}

/* ------------------------------------------------------------------ */
/* Desktop dropdown                                                    */
/* ------------------------------------------------------------------ */

function NavDropdown({
  heading,
  items,
  pathname,
  isOpen,
  openedByHover,
  onOpen,
  onClose,
}: {
  heading: string
  items: NavItem[]
  pathname: string
  isOpen: boolean
  /** True while the panel is open only because the pointer is over it. */
  openedByHover: boolean
  onOpen: (viaHover: boolean) => void
  onClose: () => void
}) {
  const panelId = useId()
  const wrapper = useRef<HTMLDivElement>(null)
  const groupActive = items.some(({ href }) => isActive(pathname, href))

  // Pointer leaves are forgiving: a short grace period means clipping the
  // corner of the panel on the way down does not snap it shut.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(onClose, 120)
  }
  useEffect(() => cancelClose, [])

  return (
    <div
      ref={wrapper}
      className="relative"
      onPointerEnter={() => {
        cancelClose()
        onOpen(true)
      }}
      onPointerLeave={scheduleClose}
      onFocus={() => onOpen(false)}
      onBlur={(event) => {
        // Tabbing past the last item in the panel closes it.
        if (!wrapper.current?.contains(event.relatedTarget as Node)) onClose()
      }}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => {
          // Hovering already opened it, so a click means "keep this open" and
          // pins it rather than dismissing the panel under the cursor. Only a
          // click on an already-pinned panel closes it.
          if (isOpen && !openedByHover) onClose()
          else onOpen(false)
        }}
        className={`flex items-center gap-1 whitespace-nowrap rounded-[3px] px-2.5 py-2 text-[15px] leading-6 text-[#2b3034] transition-colors [font-family:var(--font-raleway)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b] xl:px-3 xl:text-[16px] ${
          isOpen || groupActive ? 'font-bold' : 'font-medium hover:font-bold'
        }`}
      >
        {heading}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${isOpen ? '-rotate-180' : ''}`}
          strokeWidth={2.25}
        />
      </button>
      {/* Underline marks the section you are currently inside. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-2.5 -bottom-0.5 h-[3px] bg-[#fed07b] transition-opacity xl:inset-x-3 ${
          groupActive ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {isOpen && (
        <div
          id={panelId}
          // The `before` strip covers the gap between trigger and panel so the
          // pointer never crosses dead space on its way down.
          className="bcp-menu absolute left-0 top-[calc(100%+14px)] z-50 w-[356px] rounded-[3px] border-2 border-[#1f1f1f] bg-[#fbfbfb] p-2 shadow-[6px_6px_0px_#1f1f1f] before:absolute before:inset-x-0 before:-top-4 before:h-4 before:content-['']"
        >
          {items.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              onNavigate={onClose}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mobile: the same groups as collapsible sections                     */
/* ------------------------------------------------------------------ */

function MobileGroup({
  heading,
  items,
  pathname,
  onNavigate,
}: {
  heading: string
  items: NavItem[]
  pathname: string
  onNavigate: () => void
}) {
  const groupActive = items.some(({ href }) => isActive(pathname, href))
  // Opens on the section you are already in, so the current page is visible
  // without a tap.
  const [open, setOpen] = useState(groupActive)
  const panelId = useId()

  return (
    <div className="border-b border-[#ebe8e3]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-3.5 text-left text-[18px] font-bold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]"
      >
        {heading}
        <ChevronDown
          className={`size-5 transition-transform duration-200 ${open ? '-rotate-180' : ''}`}
          strokeWidth={2.25}
        />
      </button>
      {open && (
        <div className="flex flex-col pb-2">
          {items.map((item) => (
            <MenuItem
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

export function BcpNav() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<{ heading: string; viaHover: boolean } | null>(null)
  const desktopNav = useRef<HTMLElement>(null)

  // Route changes close everything — without this the panel would survive the
  // navigation it just triggered.
  useEffect(() => {
    setOpenGroup(null)
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!openGroup && !mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenGroup(null)
        setMobileOpen(false)
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!desktopNav.current?.contains(event.target as Node)) setOpenGroup(null)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [openGroup, mobileOpen])

  return (
    <header className="relative z-50 bg-[#fbfbfb] shadow-[0px_0px_20px_2px_rgba(86,86,86,0.1)]">
      <div className="flex h-[88px] items-center justify-between gap-4 px-6 lg:px-8 2xl:px-16">
        <Link href="/" onClick={() => setMobileOpen(false)} className="shrink-0">
          <Image src="/bcp/logo.png" alt="BCP" width={108} height={31} className="h-[31px] w-auto" />
        </Link>

        {/* Three dropdowns and a direct link replace the twelve flat links
            that used to need every pixel of the row to fit. */}
        <nav ref={desktopNav} className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV_GROUPS.map(({ heading, items }) => (
            <NavDropdown
              key={heading}
              heading={heading}
              items={items}
              pathname={pathname}
              isOpen={openGroup?.heading === heading}
              openedByHover={openGroup?.heading === heading && openGroup.viaHover}
              onOpen={(viaHover) => setOpenGroup({ heading, viaHover })}
              onClose={() =>
                setOpenGroup((current) => (current?.heading === heading ? null : current))
              }
            />
          ))}
          {NAV_DIRECT.map(({ href, label }) => (
            <div key={href} className="relative">
              <Link
                href={href}
                onPointerEnter={() => setOpenGroup(null)}
                className={`flex items-center whitespace-nowrap rounded-[3px] px-2.5 py-2 text-[15px] leading-6 text-[#2b3034] [font-family:var(--font-raleway)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fed07b] xl:px-3 xl:text-[16px] ${
                  isActive(pathname, href) ? 'font-bold' : 'font-medium hover:font-bold'
                }`}
              >
                {label}
              </Link>
              <span
                aria-hidden
                className={`pointer-events-none absolute inset-x-2.5 -bottom-0.5 h-[3px] bg-[#fed07b] transition-opacity xl:inset-x-3 ${
                  isActive(pathname, href) ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <BrutalButton
            href={WHATSAPP_COMMUNITY}
            className="hidden h-11 px-4 text-[15px] lg:flex xl:px-5 xl:text-[16px]"
          >
            Join the Community
          </BrutalButton>
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-11 items-center justify-center rounded-[3px] border-2 border-[#2b3034] text-[#2b3034] lg:hidden"
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          aria-label="Main"
          className="absolute inset-x-0 top-full flex max-h-[calc(100vh-88px)] flex-col overflow-y-auto border-t-2 border-[#2b3034] bg-[#fbfbfb] px-4 py-2 shadow-[0px_20px_20px_rgba(86,86,86,0.15)] lg:hidden"
        >
          {NAV_GROUPS.map(({ heading, items }) => (
            <MobileGroup
              key={heading}
              heading={heading}
              items={items}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          ))}
          {NAV_DIRECT.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              // Bold to sit level with the group headings above it.
              className="border-b border-[#ebe8e3] p-3.5 text-[18px] font-bold leading-7 text-[#2b3034] [font-family:var(--font-raleway)]"
              aria-current={isActive(pathname, href) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          <BrutalButton href={WHATSAPP_COMMUNITY} className="my-4 h-[52px]">
            Join the Community
          </BrutalButton>
        </nav>
      )}
    </header>
  )
}
