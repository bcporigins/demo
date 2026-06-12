'use server'

import { submitApplication } from '@/lib/notion'

export type ApplyState = { status: 'idle' | 'success' | 'error'; message?: string }

const MAX_RESUME_BYTES = 10 * 1024 * 1024 // 10MB
const ALLOWED_RESUME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

export async function applyAction(_prev: ApplyState, formData: FormData): Promise<ApplyState> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const link = String(formData.get('link') ?? '').trim()
  const motivation = String(formData.get('motivation') ?? '').trim()
  const roleTitle = String(formData.get('roleTitle') ?? '').trim()
  const roleSlug = String(formData.get('roleSlug') ?? '').trim()

  if (!name || !email || !roleTitle) {
    return { status: 'error', message: 'Please fill in your name and email.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }
  if (link && !/^https?:\/\//i.test(link)) {
    return { status: 'error', message: 'Links should start with http:// or https://.' }
  }

  let resume: { filename: string; contentType: string; data: Buffer } | null = null
  const file = formData.get('resume')
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_RESUME_BYTES) {
      return { status: 'error', message: 'Resume is too large — 10MB max.' }
    }
    if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
      return { status: 'error', message: 'Resume must be a PDF or Word document.' }
    }
    resume = {
      filename: file.name,
      contentType: file.type,
      data: Buffer.from(await file.arrayBuffer()),
    }
  }

  const result = await submitApplication({
    name,
    email,
    phone: phone || undefined,
    link: link || undefined,
    motivation: motivation || undefined,
    roleTitle,
    roleSlug,
    resume,
  })

  if (!result.ok) return { status: 'error', message: result.error }
  return {
    status: 'success',
    message: `Thanks, ${name.split(' ')[0]}! Your application for ${roleTitle} is in — we'll be in touch soon.`,
  }
}
