import type { ProjectPhasesBlock as ProjectPhasesBlockProps } from '@/payload-types'

import { ChevronDown, ChevronRight } from 'lucide-react'
import React from 'react'

import { DynamicIcon } from '@/components/DynamicIcon'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { normalizeHexColor } from '@/utilities/themeColor'

import { DEFAULT_PHASES_BACKGROUND } from './constants'

const dashes = (direction: 'right' | 'bottom') =>
  `repeating-linear-gradient(to ${direction}, var(--color-primary) 0 8px, transparent 8px 16px)`

const ConnectorBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="absolute left-1/2 top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-primary bg-white text-primary shadow-sm">
    {children}
  </span>
)

/** Joins a phase to the next one: below it on small screens, beside it from `lg`. */
const PhaseConnector: React.FC = () => (
  <>
    <span
      aria-hidden="true"
      className="absolute bottom-6 left-1/2 h-12 w-0.5 -translate-x-1/2 animate-phase-flow-y motion-reduce:animate-none lg:hidden"
      style={{ backgroundImage: dashes('bottom'), backgroundSize: '2px 16px' }}
    >
      <ConnectorBadge>
        <ChevronDown className="size-4" strokeWidth={2.5} />
      </ConnectorBadge>
    </span>
    {/* Grid columns have no gap, so the next circle's center sits one column width away. */}
    <span
      aria-hidden="true"
      className="absolute left-[calc(50%+64px)] top-12 hidden h-0.5 w-[calc(100%-128px)] -translate-y-1/2 animate-phase-flow-x motion-reduce:animate-none lg:block"
      style={{ backgroundImage: dashes('right'), backgroundSize: '16px 2px' }}
    >
      <ConnectorBadge>
        <ChevronRight className="size-4" strokeWidth={2.5} />
      </ConnectorBadge>
    </span>
  </>
)

export const ProjectPhasesBlock: React.FC<ProjectPhasesBlockProps> = ({
  backgroundColor,
  backgroundImage,
  phases,
  title,
}) => {
  if (!phases?.length && !title) return null

  const image = backgroundImage && typeof backgroundImage === 'object' ? backgroundImage : null
  const count = phases?.length ?? 0

  return (
    <section
      className="relative isolate overflow-hidden py-16 text-neutral-900 lg:py-24"
      style={{ backgroundColor: normalizeHexColor(backgroundColor, DEFAULT_PHASES_BACKGROUND) }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 select-none">
        {image ? (
          <Media
            fill
            className="absolute inset-0 size-full"
            imgClassName="object-cover"
            resource={image}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="absolute left-1/2 top-1/2 w-[220%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.14] sm:w-[160%] lg:w-[min(1400px,115%)]"
            src="/images/world-map.svg"
          />
        )}
      </div>

      <div className="container">
        {title && (
          <div className="mx-auto mb-14 flex max-w-3xl flex-col items-center text-center lg:mb-16">
            <RichText
              className="text-3xl uppercase text-primary font-bold leading-tight tracking-tight md:text-4xl [&_p+p]:mt-2"
              data={title}
              enableGutter={false}
              enableProse={false}
            />
          </div>
        )}

        {count > 0 && (
          <ol
            className="mx-auto grid max-w-md lg:max-w-none lg:grid-cols-[repeat(var(--phase-count),minmax(0,1fr))]"
            style={{ '--phase-count': count } as React.CSSProperties}
          >
            {phases?.map((phase, index) => {
              const isLast = index === count - 1

              return (
                <li
                  className="group relative flex flex-col items-center pb-28 text-center last:pb-0 lg:px-4 lg:pb-0 xl:px-6"
                  key={phase.id ?? index}
                >
                  {!isLast && <PhaseConnector />}

                  <span className="relative flex size-24 shrink-0 items-center justify-center rounded-full border-[3px] border-primary bg-white text-primary ring-8 ring-primary/10 transition duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-white">
                    {phase.icon ? (
                      <DynamicIcon aria-hidden="true" size={40} value={phase.icon} />
                    ) : (
                      <span className="text-2xl font-bold">{index + 1}</span>
                    )}
                  </span>

                  <div className="relative mt-9 flex w-full flex-1 flex-col items-center rounded-2xl border border-primary/15 bg-white/90 px-5 pb-6 pt-8 shadow-[0_14px_36px_-18px_rgb(0_0_0/0.25)] backdrop-blur-sm transition duration-300 group-hover:border-primary/30 group-hover:shadow-[0_22px_44px_-18px_rgb(0_0_0/0.3)]">
                    <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold tracking-wider text-white ring-4 ring-white">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3 className="text-lg font-bold leading-snug text-neutral-900 lg:text-xl">
                      {phase.title}
                    </h3>

                    {phase.description && (
                      <RichText
                        className="mt-3 w-full leading-relaxed text-neutral-700 [&_a]:text-primary [&_a]:underline [&_ol]:list-inside [&_ol]:list-decimal [&_p+p]:mt-2 [&_strong]:text-neutral-900 [&_ul]:list-inside [&_ul]:list-disc"
                        data={phase.description}
                        enableGutter={false}
                        enableProse={false}
                      />
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}
