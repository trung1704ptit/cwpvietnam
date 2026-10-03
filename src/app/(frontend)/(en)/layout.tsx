import React from 'react'

import { generateSiteMetadata, SiteLayout } from '@/app/(frontend)/_views/SiteLayout'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SiteLayout locale="en">{children}</SiteLayout>
}

export const generateMetadata = generateSiteMetadata
