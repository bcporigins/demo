'use client'

import { useActionState } from 'react'
import { CheckCircle2, LoaderCircle } from 'lucide-react'
import { applyAction, type ApplyState } from '@/app/careers/actions'

const FIELD_CLASSES =
  'w-full rounded-[3px] border-2 border-[#1f1f1f] bg-[#fefefe] px-6 text-[15px] leading-5 text-[#2f363d] shadow-[4px_4px_0px_0px_#1f1f1f] [font-family:var(--font-raleway)] placeholder:text-[#9aa1a7] focus:outline-none focus:ring-2 focus:ring-[#fed07b]'

function FieldLabel({ children, optional = false }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="text-[20px] font-semibold leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
      {children}
      {optional && <span className="ml-2 text-[15px] font-normal text-[#414141]">(optional)</span>}
    </span>
  )
}

export function ApplyForm({ roleTitle, roleSlug }: { roleTitle: string; roleSlug: string }) {
  const [state, formAction, pending] = useActionState<ApplyState, FormData>(applyAction, {
    status: 'idle',
  })

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center gap-4 border-[6px] border-[#2b3034] bg-[#91bd86] p-10 text-center">
        <CheckCircle2 className="size-12 text-[#2b3034]" strokeWidth={1.75} />
        <h3 className="text-[28px] font-semibold leading-9 text-[#121212] [font-family:var(--font-hepta-slab)]">
          Application received
        </h3>
        <p className="max-w-[520px] text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-10 border-[6px] border-[#2b3034] bg-[#91bd86] p-6 md:p-10">
      <div className="flex flex-col text-center">
        <h3 className="text-[32px] font-semibold leading-[48px] text-[#121212] [font-family:var(--font-hepta-slab)] md:text-[36px]">
          Apply for this role
        </h3>
        <p className="text-[18px] leading-[27px] text-[#2b3034] [font-family:var(--font-raleway)]">
          Fill out the form below — we&rsquo;re excited to learn more about you.
        </p>
      </div>
      <form action={formAction} className="flex w-full flex-col gap-8 px-0 md:px-2.5">
        <input type="hidden" name="roleTitle" value={roleTitle} />
        <input type="hidden" name="roleSlug" value={roleSlug} />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1">
              <FieldLabel>Full Name</FieldLabel>
              <input name="name" type="text" required placeholder="eg. Your Name" className={`h-[50px] ${FIELD_CLASSES}`} />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <FieldLabel>Email Address</FieldLabel>
              <input name="email" type="email" required placeholder="e.g yourname@gmail.com" className={`h-[50px] ${FIELD_CLASSES}`} />
            </label>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <label className="flex flex-1 flex-col gap-1">
              <FieldLabel optional>Phone</FieldLabel>
              <input name="phone" type="tel" placeholder="+234 ..." className={`h-[50px] ${FIELD_CLASSES}`} />
            </label>
            <label className="flex flex-1 flex-col gap-1">
              <FieldLabel optional>LinkedIn / Portfolio</FieldLabel>
              <input name="link" type="url" placeholder="https://" className={`h-[50px] ${FIELD_CLASSES}`} />
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <FieldLabel optional>Resume / CV</FieldLabel>
            <input
              name="resume"
              type="file"
              accept=".pdf,.doc,.docx"
              className={`h-[50px] py-2.5 file:mr-4 file:h-full file:cursor-pointer file:rounded-[3px] file:border-2 file:border-solid file:border-[#1f1f1f] file:bg-[#ebe8e3] file:px-4 file:text-[14px] file:font-bold file:text-[#2b3034] file:[font-family:var(--font-raleway)] ${FIELD_CLASSES}`}
            />
            <span className="text-[14px] text-[#414141] [font-family:var(--font-raleway)]">
              PDF or Word, 10MB max
            </span>
          </label>
          <label className="flex flex-col gap-1">
            <FieldLabel>Why do you want this role?</FieldLabel>
            <textarea
              name="motivation"
              required
              placeholder="Type your message"
              className={`h-[120px] resize-none py-2.5 text-[18px] leading-[27px] ${FIELD_CLASSES}`}
            />
          </label>
        </div>
        {state.status === 'error' && (
          <p className="border-2 border-[#1f1f1f] bg-[#fbfbfb] p-4 text-[16px] font-semibold text-[#b3261e] [font-family:var(--font-raleway)]">
            {state.message}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="flex h-[60px] w-full items-center justify-center gap-2 rounded-[3px] border-2 border-[#1f1f1f] bg-[#fed07b] px-5 text-[18px] font-bold leading-7 text-[#2b3034] shadow-[4px_4px_0px_#1f1f1f] transition-transform [font-family:var(--font-raleway)] hover:-translate-y-0.5 active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#1f1f1f] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {pending && <LoaderCircle className="size-5 animate-spin" />}
          {pending ? 'Submitting…' : 'Submit Application'}
        </button>
      </form>
    </div>
  )
}
