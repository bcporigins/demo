'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
import type { BcpEvent } from '@/lib/notion'

// Day-name spellings as in the Figma design (including "Thur")
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type Cell = { day: number; inMonth: boolean; key: string }

/** yyyy-mm-dd for a calendar position, used as both React key and event key. */
function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function monthGrid(year: number, month: number): Cell[][] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: Cell[] = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, inMonth: false, key: `p${daysInPrev - i}` })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, key: dateKey(year, month, d) })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next, inMonth: false, key: `n${next++}` })
  }

  const weeks: Cell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function formatLongDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Live calendar of mini experiences. `today`, `events`, and the starting
 * month are all resolved on the server and passed in, which keeps the first
 * client render identical to the server's and avoids a hydration mismatch
 * from calling `new Date()` in the browser.
 */
export function EventsCalendar({
  events,
  today,
  initialYear,
  initialMonth,
}: {
  events: BcpEvent[]
  /** yyyy-mm-dd of the current day, from the server. */
  today: string
  initialYear: number
  initialMonth: number
}) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selected, setSelected] = useState<string | null>(null)

  // Several events can share a date, so each day maps to a list
  const byDate = new Map<string, BcpEvent[]>()
  for (const event of events) {
    if (!event.date) continue
    byDate.set(event.date, [...(byDate.get(event.date) ?? []), event])
  }

  const prev = () => {
    setSelected(null)
    if (month === 0) (setMonth(11), setYear(year - 1))
    else setMonth(month - 1)
  }
  const next = () => {
    setSelected(null)
    if (month === 11) (setMonth(0), setYear(year + 1))
    else setMonth(month + 1)
  }

  const weeks = monthGrid(year, month)

  // Show the clicked day, else the first event still to come this month,
  // else the month's first event — so the panel is rarely empty
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const inMonth = [...byDate.keys()].filter((key) => key.startsWith(monthPrefix)).sort()
  const activeDate = selected ?? inMonth.find((key) => key >= today) ?? inMonth[0] ?? null
  const activeEvents = activeDate ? (byDate.get(activeDate) ?? []) : []

  return (
    <div className="flex w-full flex-col items-center gap-6 border-[6px] border-[#2b3034] bg-[rgba(145,189,134,0.2)] p-5">
      <div className="flex w-full items-center justify-between px-2.5 py-5">
        <button type="button" aria-label="Previous month" onClick={prev} className="transition-transform hover:-translate-x-0.5">
          <ChevronLeft className="size-6 text-[#231f20]" />
        </button>
        <p className="text-[20px] font-semibold leading-[27px] text-[#231f20] [font-family:var(--font-hepta-slab)]">
          {MONTH_NAMES[month]} {year}
        </p>
        <button type="button" aria-label="Next month" onClick={next} className="transition-transform hover:translate-x-0.5">
          <ChevronRight className="size-6 text-[#231f20]" />
        </button>
      </div>
      <div className="w-full border-t border-[#91bd86] px-2 py-10 md:px-20">
        <table className="w-full table-fixed border-separate [border-spacing:0_24px] text-center">
          <thead>
            <tr>
              {DAY_NAMES.map((d) => (
                <th key={d} className="text-[18px] font-semibold leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((cell) => {
                  const dayEvents = cell.inMonth ? byDate.get(cell.key) : undefined
                  const isToday = cell.inMonth && cell.key === today
                  const isActive = cell.key === activeDate
                  return (
                    <td key={cell.key} className="h-[53px]">
                      {dayEvents ? (
                        <button
                          type="button"
                          onClick={() => setSelected(cell.key)}
                          aria-label={`${dayEvents.length} event${
                            dayEvents.length > 1 ? 's' : ''
                          } on ${formatLongDate(cell.key)}`}
                          aria-pressed={isActive}
                          className={`mx-auto flex h-[53px] w-[58px] items-center justify-center rounded-full text-[28px] font-bold leading-[27px] text-[#231f20] transition-colors [font-family:var(--font-raleway)] md:text-[32px] ${
                            isActive
                              ? 'bg-[rgba(58,246,11,0.45)] ring-2 ring-[#2b3034]'
                              : 'bg-[rgba(58,246,11,0.2)] hover:bg-[rgba(58,246,11,0.35)]'
                          }`}
                        >
                          {cell.day}
                        </button>
                      ) : (
                        <span
                          className={`text-[18px] leading-[27px] [font-family:var(--font-raleway)] ${
                            isToday
                              ? 'font-bold text-[#231f20] underline underline-offset-4'
                              : cell.inMonth
                                ? 'font-medium text-[#231f20]'
                                : 'font-medium text-[#828282]'
                          }`}
                        >
                          {cell.day}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel for the highlighted day */}
      <div className="w-full border-t border-[#91bd86] px-2 pt-6">
        {activeEvents.length > 0 ? (
          <ul className="flex flex-col gap-4">
            {activeEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-2 border-4 border-[#2b3034] bg-[#fbfbfb] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <p className="text-[15px] font-semibold uppercase tracking-wide text-[#5f6b5a] [font-family:var(--font-raleway)]">
                    {formatLongDate(event.date!)}
                  </p>
                  <p className="text-[20px] font-semibold leading-7 text-[#2b3034] [font-family:var(--font-hepta-slab)]">
                    {event.title}
                  </p>
                  {event.city && (
                    <p className="flex items-center gap-1.5 text-[16px] text-[#2b3034] [font-family:var(--font-raleway)]">
                      <MapPin className="size-4" strokeWidth={1.75} /> {event.city}
                    </p>
                  )}
                  {event.summary && (
                    <p className="max-w-[560px] text-[16px] leading-6 text-[#414141] [font-family:var(--font-raleway)]">
                      {event.summary}
                    </p>
                  )}
                </div>
                {event.url && (
                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[48px] shrink-0 items-center justify-center rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[16px] font-bold text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5"
                  >
                    Register
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-center text-[18px] leading-7 text-[#414141] [font-family:var(--font-raleway)]">
            No mini experiences scheduled for {MONTH_NAMES[month]} {year} yet — check back soon, or
            browse the months either side.
          </p>
        )}
      </div>
    </div>
  )
}
