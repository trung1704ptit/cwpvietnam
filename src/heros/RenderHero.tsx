import React from 'react'

import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'

type RenderHeroProps = Page['hero'] & {
  title?: string | null
}

export const RenderHero: React.FC<RenderHeroProps> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  if (type === 'highImpact') return <HighImpactHero {...props} />
  if (type === 'mediumImpact') return <MediumImpactHero {...props} />
  if (type === 'lowImpact') return <LowImpactHero {...props} />

  return null
}
