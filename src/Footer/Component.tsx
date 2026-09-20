import { getCachedGlobal } from '@/utilities/getGlobals'
import { getLocale } from '@/utilities/getLocale'
import Link from 'next/link'
import React, { Suspense } from 'react'

import { CMSLink } from '@/components/Link'
import { LocaleSwitcher } from '@/components/LocaleSwitcher'
import { Logo } from '@/components/Logo/Logo'
import { getMessages } from '@/i18n/messages'
import { normalizeHexColor } from '@/utilities/themeColor'

const DEFAULT_FOOTER_BACKGROUND = '#ffefec'

export async function Footer() {
  const locale = await getLocale()
  const [footerData, settings] = await Promise.all([
    getCachedGlobal('footer', 1, locale)(),
    getCachedGlobal('settings', 0)(),
  ])

  const t = getMessages(locale)
  const siteTitle = settings?.siteTitle?.trim() || 'Cancer Wellness Program'
  const footerBackground = normalizeHexColor(
    settings?.footerBackgroundColor,
    DEFAULT_FOOTER_BACKGROUND,
  )

  const navItems = footerData?.navItems || []
  const socialLinks = footerData?.socialLinks || []
  const contact = footerData?.contact

  return (
    <footer
      className="mt-auto border-t border-black/5 text-foreground"
      style={{ backgroundColor: footerBackground }}
    >
      <div className="container py-12 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-8">
          <div className="max-w-md space-y-4">
            <Link className="inline-flex flex-col gap-3" href="/">
              <Logo alt={siteTitle} loading="lazy" />
              <span className="text-lg font-semibold tracking-tight text-primary">{siteTitle}</span>
            </Link>
            {footerData?.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">{footerData.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">
              {t.contactInformation}
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {contact?.address && <li className="whitespace-pre-line">{contact.address}</li>}
              {contact?.phone && (
                <li>
                  <a className="hover:text-primary transition-colors" href={`tel:${contact.phone.replace(/\s/g, '')}`}>
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact?.email && (
                <li>
                  <a className="hover:text-primary transition-colors" href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">{t.basicSites}</h2>
            <nav className="flex flex-col gap-2">
              {navItems.map(({ link }, i) => (
                <CMSLink
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  key={i}
                  {...link}
                />
              ))}
            </nav>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">{t.getConnected}</h2>
            <nav className="flex flex-col gap-2">
              {socialLinks.map(({ link }, i) => (
                <CMSLink
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  key={i}
                  {...link}
                />
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-black/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteTitle}
          </p>
          <Suspense>
            <LocaleSwitcher
              className="border-primary/20 text-foreground [&_svg:not([class*=text-])]:text-foreground"
              locale={locale}
            />
          </Suspense>
        </div>
      </div>
    </footer>
  )
}
