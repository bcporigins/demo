'use client'

import { useActionState } from 'react'
import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { contactAction, type FormState } from '@/app/actions'

const FIELD_CLASSES =
  'w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] px-6 text-[15px] leading-5 text-[#2f363d] shadow-[4px_4px_0px_0px_#1f1f1f] [font-family:var(--font-raleway)] placeholder:text-[#9aa1a7] focus:outline-none focus:ring-2 focus:ring-[#fed07b]'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[20px] font-semibold leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
      {children}
    </span>
  )
}

// Contact form — submissions land in the Notion "Contact Messages" database.
export function ContactForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(contactAction, {
    status: 'idle',
  })

  if (state.status === 'success') {
    return (
      <div className="flex w-full flex-col items-center gap-4 border-[6px] border-[#2b3034] bg-[#91bd86] p-10 text-center">
        <CheckCircle2 className="size-12 text-[#2b3034]" strokeWidth={1.75} />
        <h3 className="text-[26px] font-semibold leading-9 text-[#121212] [font-family:var(--font-hepta-slab)]">
          Message sent
        </h3>
        <p className="max-w-[480px] text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-[50px] px-2.5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1">
            <FieldLabel>Name</FieldLabel>
            <input name="name" type="text" required placeholder="Your name" className={`h-[50px] ${FIELD_CLASSES}`} />
          </label>
          <label className="flex flex-1 flex-col gap-1">
            <FieldLabel>Email</FieldLabel>
            <input name="email" type="email" required placeholder="Your email address" className={`h-[50px] ${FIELD_CLASSES}`} />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <FieldLabel>Message</FieldLabel>
          <textarea
            name="message"
            required
            placeholder="Type your message"
            className={`h-[120px] resize-none py-2.5 text-[18px] leading-[27px] ${FIELD_CLASSES}`}
          />
        </label>
      </div>
      {state.status === 'error' && (
        <p className="-mt-8 text-[16px] font-semibold text-[#b3261e] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 disabled:opacity-70"
      >
        {pending && <LoaderCircle className="size-5 animate-spin" />}
        {pending ? 'Sending…' : 'Submit'}
      </button>
    </form>
  )
}
