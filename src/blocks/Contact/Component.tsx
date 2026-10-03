import type { ContactBlock as ContactBlockProps } from '@/payload-types'

import React from 'react'

import { DynamicIcon } from '@/components/DynamicIcon'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

import { getMapEmbedUrl } from './map'

type CardProps = {
  children?: React.ReactNode
  icon?: string | null
  title?: string | null
}

const lgColumns: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

const toLines = (value?: string | null) =>
  value
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean) ?? []

const ContactCard: React.FC<CardProps> = ({ children, icon, title }) => (
  <article className="flex h-full flex-col items-center rounded-2xl bg-white p-6 text-center shadow-[0_10px_32px_-10px_rgb(0_0_0/0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-14px_rgb(0_0_0/0.4)] dark:bg-card">
    {icon && (
      <span className="mb-5 flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <DynamicIcon aria-hidden="true" size={26} value={icon} />
      </span>
    )}
    {title && <h3 className="text-lg font-bold leading-snug">{title}</h3>}
    <div className="mt-2 w-full text-base leading-relaxed text-muted-foreground">{children}</div>
  </article>
)

export const ContactBlock: React.FC<ContactBlockProps> = ({
  address,
  content,
  email,
  map,
  mapHeight,
  maxWidth,
  phone,
  social,
}) => {
  const addressLines = toLines(address?.content)
  const phoneLines = toLines(phone?.content)
  const socialLinks = social?.links ?? []
  const mapUrl = getMapEmbedUrl(map)

  const cards: (CardProps & { key: string })[] = []

  if (addressLines.length) {
    cards.push({
      ...address,
      children: addressLines.map((line) => <p key={line}>{line}</p>),
      key: 'address',
    })
  }

  if (phoneLines.length) {
    cards.push({
      ...phone,
      children: phoneLines.map((line) => (
        <a
          className="block transition-colors hover:text-primary"
          href={`tel:${line.replace(/[^\d+]/g, '')}`}
          key={line}
        >
          {line}
        </a>
      )),
      key: 'phone',
    })
  }

  if (email?.email) {
    cards.push({
      ...email,
      children: (
        <a
          className="break-all transition-colors hover:text-primary"
          href={`mailto:${email.email}`}
        >
          {email.email}
        </a>
      ),
      key: 'email',
    })
  }

  if (social?.content || socialLinks.length) {
    cards.push({
      ...social,
      children: (
        <>
          {toLines(social?.content).map((line) => (
            <p key={line}>{line}</p>
          ))}
          {socialLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {socialLinks.map((link, index) => (
                <a
                  aria-label={link.label}
                  className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                  href={link.url}
                  key={link.id ?? index}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={link.label}
                >
                  <DynamicIcon aria-hidden="true" size={18} value={link.icon} />
                </a>
              ))}
            </div>
          )}
        </>
      ),
      key: 'social',
    })
  }

  if (!cards.length && !content && !mapUrl) return null

  return (
    <section className="container my-16 lg:my-24">
      <div className="mx-auto" style={maxWidth ? { maxWidth } : undefined}>
        {cards.length > 0 && (
          <div
            className={cn(
              'grid grid-cols-1 gap-6 sm:grid-cols-2',
              cards.length === 1 && 'sm:grid-cols-1',
              lgColumns[cards.length],
            )}
          >
            {cards.map(({ key, ...card }) => (
              <ContactCard key={key} {...card} />
            ))}
          </div>
        )}

        {content && (
          <RichText
            className={cn(cards.length > 0 && 'mt-12')}
            data={content}
            enableGutter={false}
          />
        )}

        {mapUrl && (
          <div
            className={cn(
              'overflow-hidden rounded-2xl bg-muted shadow-[0_10px_32px_-10px_rgb(0_0_0/0.3)]',
              (cards.length > 0 || content) && 'mt-12',
            )}
          >
            <iframe
              allowFullScreen
              className="block w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapUrl}
              style={{ height: mapHeight ?? 450 }}
              title={address?.title || 'Google Map'}
            />
          </div>
        )}
      </div>
    </section>
  )
}
