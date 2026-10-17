import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Cancer Wellness Program supports people living with and beyond cancer.',
  images: [
    {
      url: `${getServerSideURL()}/website-template-OG.webp`,
    },
  ],
  siteName: 'Cancer Wellness Program',
  title: 'Cancer Wellness Program',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
