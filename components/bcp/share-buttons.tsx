'use client'

import { useEffect, useState } from 'react'
import { Link2, Check, Twitter, Linkedin, Facebook, Mail, Share2 } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Share flow: copy link, social targets, and the native share sheet   */
/* where the browser supports it. Brutal-styled square buttons.        */
/* ------------------------------------------------------------------ */

const BTN =
  'flex size-11 items-center justify-center rounded-[3px] border-2 border-[#2b3034] bg-[#fbfbfb] text-[#2b3034] transition-all hover:-translate-y-0.5 hover:bg-[#fed07b] hover:shadow-[3px_3px_0px_#1f1f1f]'

export function ShareButtons({ title, label = 'Share' }: { title: string; label?: string }) {
  const [url, setUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setUrl(window.location.href)
    setCanNativeShare(typeof navigator.share === 'function')
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url })
    } catch {
      /* user dismissed the sheet — ignore */
    }
  }

  const targets = [
    {
      label: 'Share on X',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      label: 'Share on LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'Share on Facebook',
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      label: 'Share on WhatsApp',
      icon: null, // brand glyph below
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: 'Share by email',
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[16px] font-semibold uppercase tracking-[0.08em] text-[#5f5f64] [font-family:var(--font-raleway)]">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={copy} aria-label="Copy link" title="Copy link" className={BTN}>
          {copied ? <Check className="size-5 text-[#34c759]" /> : <Link2 className="size-5" />}
        </button>
        {targets.map(({ label: t, icon: Icon, href }) => (
          <a key={t} href={href} target="_blank" rel="noopener noreferrer" aria-label={t} title={t} className={BTN}>
            {Icon ? (
              <Icon className="size-5" />
            ) : (
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden>
                <path d="M12.04 2a9.94 9.94 0 0 0-8.5 15.14L2 22l4.99-1.51A9.94 9.94 0 1 0 12.04 2Zm0 18.06a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.06.93.94-2.98-.2-.31a8.12 8.12 0 1 1 6.75 3.67Zm4.45-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.43-1.35-1.67-.14-.24-.02-.37.1-.5.11-.11.25-.28.37-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02s.87 2.35 1 2.51c.12.16 1.7 2.6 4.13 3.65.58.25 1.03.4 1.38.51.58.18 1.1.16 1.52.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28Z" />
              </svg>
            )}
          </a>
        ))}
        {canNativeShare && (
          <button type="button" onClick={nativeShare} aria-label="More share options" title="More options" className={BTN}>
            <Share2 className="size-5" />
          </button>
        )}
      </div>
    </div>
  )
}
