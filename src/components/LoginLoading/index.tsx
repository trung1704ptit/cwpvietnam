'use client'

import { useAuth } from '@payloadcms/ui'
import { useEffect, useLayoutEffect, useRef } from 'react'

/**
 * Shows a spinner on Payload's login button from submit until the dashboard has loaded.
 * Payload re-enables the button before it navigates away, so a successful login (user set)
 * keeps the spinner, while a failed one (re-enabled without a user) clears it.
 */
export function LoginLoading() {
  const { user } = useAuth()
  const userRef = useRef(user)

  // Layout effect: the user and the re-enabled button land in the same commit, and the
  // MutationObserver below must already see the user when it reacts to that commit.
  useLayoutEffect(() => {
    userRef.current = user
  }, [user])

  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>('form.login__form')
    const button = form?.querySelector<HTMLButtonElement>('button[type="submit"]')
    if (!form || !button) return

    const onSubmit = () => {
      if (!button.disabled) button.setAttribute('aria-busy', 'true')
    }

    let frame = 0
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (!button.disabled && !userRef.current) button.removeAttribute('aria-busy')
      })
    })

    form.addEventListener('submit', onSubmit, true)
    observer.observe(button, { attributeFilter: ['disabled'] })

    return () => {
      cancelAnimationFrame(frame)
      form.removeEventListener('submit', onSubmit, true)
      observer.disconnect()
    }
  }, [])

  return null
}
