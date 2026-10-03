import type { PublicationsBlock as PublicationsBlockProps } from '@/payload-types'

import { ArrowUpRight } from 'lucide-react'
import React from 'react'

import RichText from '@/components/RichText'
import type { Locale } from '@/i18n/config'
import { getMessages, type Messages } from '@/i18n/messages'
import { cn } from '@/utilities/ui'

type Publication = NonNullable<PublicationsBlockProps['publications']>[number]

const PublicationCard: React.FC<{ publication: Publication; t: Messages }> = ({
  publication,
  t,
}) => {
  const { authors, description, title, url } = publication
  const linkProps = { href: url, rel: 'noopener noreferrer', target: '_blank' }

  return (
    <article className="group rounded-xl border border-border bg-white p-5 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:p-6 dark:bg-card">
      <h3 className="text-lg font-bold leading-snug text-foreground sm:text-xl">
        <a
          className="hover:text-primary"
          {...linkProps}
        >
          {title}
        </a>
      </h3>

      {description && (
        <RichText
          className="mt-3 text-base leading-relaxed text-foreground/80 [&_a]:text-primary [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-2 [&_strong]:text-foreground [&_ul]:list-inside [&_ul]:list-disc"
          data={description}
          enableGutter={false}
          enableProse={false}
        />
      )}

      {authors && (
        <RichText
          className="mt-3 text-sm italic leading-relaxed text-muted-foreground sm:text-base [&_p+p]:mt-1 [&_strong]:font-semibold [&_strong]:text-foreground"
          data={authors}
          enableGutter={false}
          enableProse={false}
        />
      )}

      <a
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
        {...linkProps}
      >
        {t.viewPublication}
        <ArrowUpRight
          aria-hidden="true"
          className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </a>
    </article>
  )
}

export const PublicationsBlock: React.FC<
  PublicationsBlockProps & { id?: string; locale: Locale }
> = ({ id, introContent, locale, publications }) => {
  const t = getMessages(locale)
  const items = publications?.filter((publication) => publication.title && publication.url) ?? []

  if (!items.length && !introContent) return null

  return (
    <section className="container my-16" id={`block-${id}`}>
      {introContent && (
        <RichText className="mx-auto max-w-5xl" data={introContent} enableGutter={false} />
      )}
      {items.length > 0 && (
        <ul className={cn('mx-auto max-w-5xl space-y-4 sm:space-y-5', introContent && 'mt-8')}>
          {items.map((publication, index) => (
            <li key={publication.id ?? index}>
              <PublicationCard publication={publication} t={t} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
