'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Day-name spellings as in the Figma design (including "Thur")
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']

const EVENT_DATES = ['2026-10-08']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

type Cell = { day: number; inMonth: boolean; key: string }

function monthGrid(year: number, month: number): Cell[][] {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev = new Date(year, month, 0).getDate()

  const cells: Cell[] = []
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, inMonth: false, key: `p${daysInPrev - i}` })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, inMonth: true, key })
  }
  let next = 1
  while (cells.length % 7 !== 0) {
    cells.push({ day: next++, inMonth: false, key: `n${next}` })
  }

  const weeks: Cell[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

export function EventsCalendar() {
  // The design shows October 2026 with the 8th highlighted
  const [year, setYear] = useState(2026)
  const [month, setMonth] = useState(9)

  const prev = () => {
    if (month === 0) (setMonth(11), setYear(year - 1))
    else setMonth(month - 1)
  }
  const next = () => {
    if (month === 11) (setMonth(0), setYear(year + 1))
    else setMonth(month + 1)
  }

  const weeks = monthGrid(year, month)

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
                  const isEvent = cell.inMonth && EVENT_DATES.includes(cell.key)
                  return (
                    <td key={cell.key} className="h-[53px]">
                      {isEvent ? (
                        <span className="mx-auto flex h-[53px] w-[58px] items-center justify-center rounded-full bg-[rgba(58,246,11,0.2)] text-[36px] font-bold leading-[27px] text-[#231f20] [font-family:var(--font-raleway)]">
                          {cell.day}
                        </span>
                      ) : (
                        <span
                          className={`text-[18px] font-medium leading-[27px] [font-family:var(--font-raleway)] ${
                            cell.inMonth ? 'text-[#231f20]' : 'text-[#828282]'
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
    </div>
  )
}
