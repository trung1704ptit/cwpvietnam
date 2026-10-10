'use client'

import { useAuth } from '@payloadcms/ui'
import { type ReactNode, useEffect, useRef } from 'react'

/** At most one token refresh per this interval, however busy the editor is. */
const REFRESH_INTERVAL_MS = 15 * 60 * 1000

const ACTIVITY_EVENTS = ['input', 'keydown', 'pointerdown'] as const

/**
 * Sliding admin session: while the editor keeps working, the login is renewed for another full
 * token lifetime. Payload alone only renews in the last couple of minutes before expiry, so a
 * break shortly before that would still log the editor out.
 */
export function SessionKeepAlive({ children }: { children: ReactNode }) {
  const { refreshCookie, user } = useAuth()
  const lastRefreshRef = useRef(0)

  useEffect(() => {
    if (!user) return
    lastRefreshRef.current = Date.now()

    const onActivity = () => {
      if (Date.now() - lastRefreshRef.current < REFRESH_INTERVAL_MS) return
      lastRefreshRef.current = Date.now()
      refreshCookie(true)
    }

    for (const event of ACTIVITY_EVENTS) {
      window.addEventListener(event, onActivity, { capture: true, passive: true })
    }

    return () => {
      for (const event of ACTIVITY_EVENTS) {
        window.removeEventListener(event, onActivity, { capture: true })
      }
    }
  }, [refreshCookie, user])

  return children
}
