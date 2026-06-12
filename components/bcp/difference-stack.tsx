'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Mic, Wrench, Signpost, BadgeCheck, type LucideIcon } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* "What Makes BCP Different" — the tilted bars drop one after another */
/* and settle into their stacked positions when scrolled into view.    */
/* ------------------------------------------------------------------ */

const DIFFERENTIATORS: { icon: LucideIcon; text: string; tilt: number }[] = [
  { icon: MapPin, text: 'Multi-location, community-led model', tilt: 3.29 },
  { icon: Mic, text: 'High-signal speakers and mentors', tilt: 0 },
  { icon: Wrench, text: 'Practical knowledge, not theory', tilt: -6.1 },
  { icon: Signpost, text: 'Pathways into real opportunities', tilt: 3.74 },
  { icon: BadgeCheck, text: 'Alumni community with proven results', tilt: 0 },
]

export function DifferenceStack() {
  const ref = useRef<HTMLDivElement>(null)
  const [dropped, setDropped] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDropped(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-1 flex-col gap-5">
      {DIFFERENTIATORS.map(({ icon: Icon, text, tilt }, i) => (
        <div
          key={text}
          className={`flex items-center gap-2 border-[6px] border-[#2b3034] bg-[#f3f2f8] p-3 ${
            dropped ? 'bcp-stack-drop' : 'opacity-0'
          }`}
          style={
            {
              '--tilt': `${tilt}deg`,
              transform: `rotate(${tilt}deg)`,
              animationDelay: `${i * 0.18}s`,
            } as React.CSSProperties
          }
        >
          <span className="flex size-[35px] shrink-0 items-center justify-center rounded-xl">
            <Icon className="size-[22px] text-[#6361d9]" strokeWidth={2} />
          </span>
          <p className="text-[20px] font-medium text-[#414141] [font-family:var(--font-raleway)] md:text-[28px]">
            {text}
          </p>
        </div>
      ))}
    </div>
  )
}
