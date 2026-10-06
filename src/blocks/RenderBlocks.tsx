import React, { Fragment } from 'react'

import type { Locale } from '@/i18n/config'
import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CarouselBlock } from '@/blocks/Carousel/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContactBlock } from '@/blocks/Contact/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FeatureBlock } from '@/blocks/FeatureBlock/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { HomePartnersBlock } from '@/blocks/HomePartners/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PostsListBlock } from '@/blocks/PostsList/Component'
import { ProjectPhasesBlock } from '@/blocks/ProjectPhases/Component'
import { PublicationsBlock } from '@/blocks/Publications/Component'
import { TeamBlock } from '@/blocks/Team/Component'

const blockComponents = {
  archive: ArchiveBlock,
  carousel: CarouselBlock,
  contactBlock: ContactBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  featureBlock: FeatureBlock,
  formBlock: FormBlock,
  homePartners: HomePartnersBlock,
  mediaBlock: MediaBlock,
  postsList: PostsListBlock,
  projectPhases: ProjectPhasesBlock,
  publications: PublicationsBlock,
  team: TeamBlock,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
  locale: Locale
}> = (props) => {
  const { blocks, locale } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
              return (
                <div key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer locale={locale} />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
