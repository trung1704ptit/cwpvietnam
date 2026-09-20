'use client'

import React, { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { getCMSLinkHref } from '@/utilities/getCMSLinkHref'
import { cn } from '@/utilities/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, Menu, SearchIcon, X } from 'lucide-react'

type NavItem = NonNullable<HeaderType['navItems']>[number]
type NavLink = NavItem['link']

const NavItemLink: React.FC<{
  className?: string
  link: NavLink
  onClick?: () => void
}> = ({ className, link, onClick }) => {
  const href = getCMSLinkHref(link)

  if (!href) {
    return <span className={className}>{link.label}</span>
  }

  return <CMSLink {...link} appearance="inline" className={cn('text-white hover:text-white/80', className)} onClick={onClick} />
}

const DesktopNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [open, setOpen] = useState(false)
  const children = item.children?.filter((child) => child?.link?.label) || []
  const hasChildren = children.length > 0
  const submenuId = useId()

  if (!hasChildren) {
    return <NavItemLink link={item.link} />
  }

  return (
    <div
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-1">
        <NavItemLink link={item.link} />
        <button
          aria-controls={submenuId}
          aria-expanded={open}
          aria-label={`${item.link.label} submenu`}
          className="inline-flex size-6 items-center justify-center rounded-sm text-white"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      <div
        className={cn(
          'absolute top-full left-0 z-50 min-w-48 pt-2',
          open ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0',
        )}
        id={submenuId}
      >
        <div className="rounded-md border border-border bg-background py-2 text-foreground shadow-md">
          {children.map((child, i) => (
            <NavItemLink
              className="flex w-full justify-start px-4 py-2 text-left text-primary hover:bg-primary/10 hover:text-primary"
              key={child.id || i}
              link={child.link}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const MobileNavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const [open, setOpen] = useState(false)
  const children = item.children?.filter((child) => child?.link?.label) || []
  const hasChildren = children.length > 0
  const submenuId = useId()
  const href = getCMSLinkHref(item.link)

  if (!hasChildren) {
    return (
      <NavItemLink className="flex w-full justify-start py-3 text-base" link={item.link} />
    )
  }

  return (
    <div className="border-b border-white/20 py-1">
      <div className="flex items-center justify-between gap-2">
        {href ? (
          <NavItemLink className="flex flex-1 justify-start py-3 text-base" link={item.link} />
        ) : (
          <button
            aria-controls={submenuId}
            aria-expanded={open}
            className="flex flex-1 justify-start py-3 text-left text-base text-white"
            onClick={() => setOpen((current) => !current)}
            type="button"
          >
            {item.link.label}
          </button>
        )}
        <button
          aria-controls={submenuId}
          aria-expanded={open}
          aria-label={`${item.link.label} submenu`}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-md text-white"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <ChevronDown className={cn('size-5 transition-transform', open && 'rotate-180')} />
        </button>
      </div>
      {open && (
        <div className="flex flex-col pb-2 pl-4" id={submenuId}>
          {children.map((child, i) => (
            <NavItemLink
              className="flex w-full justify-start py-2 text-base"
              key={child.id || i}
              link={child.link}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const MobileDrawer: React.FC<{
  menuOpen: boolean
  navItems: NavItem[]
  onClose: () => void
}> = ({ menuOpen, navItems, onClose }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div
      className={cn('fixed inset-0 z-50 lg:hidden', !menuOpen && 'pointer-events-none')}
      id="mobile-navigation"
    >
      <div
        aria-hidden="true"
        className={cn(
          'absolute inset-0 bg-black/50 transition-opacity duration-300',
          menuOpen ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />
      <aside
        aria-hidden={!menuOpen}
        aria-label="Site menu"
        aria-modal={menuOpen}
        className={cn(
          'absolute inset-y-0 right-0 flex w-80 max-w-[85vw] flex-col bg-primary text-white shadow-xl transition-transform duration-300 ease-out',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        )}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-white/20 px-4 py-4">
          <p className="text-sm font-medium">Menu</p>
          <button
            aria-label="Close menu"
            className="inline-flex size-10 items-center justify-center rounded-md text-white"
            onClick={onClose}
            type="button"
          >
            <X className="size-6" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-2">
          {navItems.map((item, i) => (
            <MobileNavItem item={item} key={item.id || i} />
          ))}
          <Link className="mt-4 flex items-center gap-2 py-3 text-base text-white" href="/search">
            <SearchIcon className="size-5" />
            Search
          </Link>
        </nav>
      </aside>
    </div>,
    document.body,
  )
}

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const navItems = data?.navItems || []

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  return (
    <div className="flex items-center gap-3">
      <nav className="hidden items-center gap-3 lg:flex">
        {navItems.map((item, i) => (
          <DesktopNavItem item={item} key={item.id || i} />
        ))}
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-white" />
        </Link>
      </nav>

      <button
        aria-controls="mobile-navigation"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        className="inline-flex size-10 items-center justify-center rounded-md text-white lg:hidden"
        onClick={() => setMenuOpen((current) => !current)}
        type="button"
      >
        {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <MobileDrawer menuOpen={menuOpen} navItems={navItems} onClose={() => setMenuOpen(false)} />
    </div>
  )
}
