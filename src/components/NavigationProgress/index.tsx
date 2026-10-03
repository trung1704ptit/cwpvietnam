'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useRef, useState } from 'react'

const isModifiedClick = (event: MouseEvent) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0

const isInternalNavigation = (anchor: HTMLAnchorElement) => {
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false

  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false
  }

  let url: URL
  try {
    url = new URL(anchor.href, window.location.href)
  } catch {
    return false
  }

  if (url.origin !== window.location.origin) return false

  return url.pathname !== window.location.pathname || url.search !== window.location.search
}

const NavigationProgressBar: React.FC = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const routeKey = `${pathname}?${searchParams.toString()}`
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'loading' | 'done'>('idle')
  const phaseRef = useRef(phase)
  const routeKeyRef = useRef(routeKey)
  const skipComplete = useRef(true)
  const hideTimer = useRef<number | null>(null)
  const failTimer = useRef<number | null>(null)

  phaseRef.current = phase

  const clearTimers = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current)
    if (failTimer.current) window.clearTimeout(failTimer.current)
  }

  const finish = () => {
    if (phaseRef.current !== 'loading') return
    clearTimers()
    setPhase('done')
    setProgress(100)
    hideTimer.current = window.setTimeout(() => {
      setPhase('idle')
      setProgress(0)
    }, 280)
  }

  useEffect(() => {
    if (skipComplete.current) {
      skipComplete.current = false
      routeKeyRef.current = routeKey
      return
    }

    if (routeKeyRef.current === routeKey) return
    routeKeyRef.current = routeKey
    finish()
    // finish closes over the latest refs; route changes are the trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey])

  useEffect(() => {
    if (phase !== 'loading') return

    const timer = window.setTimeout(() => {
      setProgress((current) => {
        if (current >= 90) return current
        const step = current < 40 ? 10 : current < 70 ? 4 : 1
        return Math.min(90, current + step)
      })
    }, 220)

    return () => window.clearTimeout(timer)
  }, [phase, progress])

  useEffect(() => {
    const start = () => {
      clearTimers()
      setPhase('loading')
      setProgress((current) => (current > 0 && current < 90 ? current : 12))
      failTimer.current = window.setTimeout(() => {
        setPhase('idle')
        setProgress(0)
      }, 12000)
    }

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || isModifiedClick(event)) return
      const anchor = (event.target as Element | null)?.closest?.('a')
      if (!(anchor instanceof HTMLAnchorElement) || !isInternalNavigation(anchor)) return
      start()
    }

    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', start)

    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', start)
      clearTimers()
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[3px]">
      <div
        className="h-full origin-left bg-primary shadow-[0_0_12px_var(--primary)] ease-out"
        style={{
          opacity: phase === 'idle' ? 0 : 1,
          transition:
            phase === 'idle' ? 'opacity 150ms ease' : 'width 280ms ease, opacity 150ms ease',
          width: `${progress}%`,
        }}
      />
    </div>
  )
}

export const NavigationProgress: React.FC = () => (
  <Suspense fallback={null}>
    <NavigationProgressBar />
  </Suspense>
)
