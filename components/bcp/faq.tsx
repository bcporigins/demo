'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { faqVoteAction } from '@/app/actions'

export type FaqItem = {
  id?: string
  question: string
  answer: string
}

function FaqCard({
  item,
  open,
  onToggle,
}: {
  item: FaqItem
  open: boolean
  onToggle: () => void
}) {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null)

  // Record the vote in the Notion FAQs database (fire-and-forget; the UI
  // feedback doesn't wait on the network)
  const vote = (kind: 'up' | 'down') => {
    if (feedback) return // one vote per visitor per page load
    setFeedback(kind)
    if (item.id) void faqVoteAction(item.id, kind === 'up')
  }

  return (
    <div
      className={`overflow-hidden transition-colors duration-300 ${
        open ? 'bg-[#2b3034]' : 'border-[0.625px] border-black bg-white'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-[25px] py-[30px] text-left"
      >
        <span
          className={`text-[20px] font-medium capitalize leading-[35px] [font-family:var(--font-raleway)] md:text-[22.5px] ${
            open ? 'text-white' : 'text-[#666]'
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex size-[40px] shrink-0 items-center justify-center rounded-[20px] text-[21px] transition-transform duration-300 ${
            open ? 'rotate-180 bg-white text-black' : 'bg-[#2b3034] text-[#f7f7f7]'
          }`}
        >
          {open ? '−' : '+'}
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-[30px] px-[25px] pb-[30px]">
            <p className="text-[18px] capitalize leading-[42.5px] text-white [font-family:var(--font-raleway)] md:text-[20px]">
              {item.answer}
            </p>
            <div className="flex h-[72.5px] items-center justify-between rounded-[15px] border-[0.5px] border-white bg-[rgba(255,255,255,0.04)] px-[37.5px] backdrop-blur-[8.75px]">
              <p className="text-[15px] font-semibold capitalize text-white [font-family:var(--font-raleway)] md:text-[17.5px]">
                {feedback ? 'Thanks For Your Feedback!' : 'Was This Content Helpful ?'}
              </p>
              <div className="flex items-center gap-[37px]">
                <button
                  type="button"
                  aria-label="Yes, this was helpful"
                  disabled={feedback !== null}
                  onClick={() => vote('up')}
                  className="transition-transform hover:scale-110 disabled:hover:scale-100"
                >
                  <ThumbsUp
                    className={`size-[30px] ${feedback === 'up' ? 'fill-[#fed07b] text-[#fed07b]' : 'fill-white text-white'} ${feedback === 'down' ? 'opacity-40' : ''}`}
                  />
                </button>
                <button
                  type="button"
                  aria-label="No, this was not helpful"
                  disabled={feedback !== null}
                  onClick={() => vote('down')}
                  className="transition-transform hover:scale-110 disabled:hover:scale-100"
                >
                  <ThumbsDown
                    className={`size-[30px] ${feedback === 'down' ? 'text-[#fed07b]' : 'text-white'} ${feedback === 'up' ? 'opacity-40' : ''}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaqAccordion({ items, defaultOpen = 1 }: { items: FaqItem[]; defaultOpen?: number }) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen)

  return (
    <div className="flex w-full flex-col gap-[25px]">
      {items.map((item, i) => (
        <FaqCard
          key={item.question}
          item={item}
          open={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  )
}
