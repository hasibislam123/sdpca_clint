import ContentImage from './ContentImage'
import InfoCard from '../ui/InfoCard'
import SectionHeading from '../ui/SectionHeading'
import SectionPlaceholder from '../ui/SectionPlaceholder'
import useContent from '../../hook/useContent'
import useLanguage from '../../hook/useLanguage'
import { mediaUrl } from '../../config/api'
import { pickLanguageText } from '../../util/localised'

const GRID = {
  1: 'grid gap-4',
  2: 'grid gap-4 sm:grid-cols-2',
  3: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4',
}

// One section, two states: what an admin has saved, or exactly the wireframe the site shows today.
export default function ContentSection({
  page,
  slot,
  eyebrow,
  title,
  description,
  label,
  columns = 3,
  align = 'left',
  limit = 0,
  imageRatio = 'aspect-[16/10]',
}) {
  const { lang } = useLanguage()
  const { cardsFor } = useContent()

  const all = cardsFor(page, slot)
  const cards = limit > 0 ? all.slice(0, limit) : all

  if (cards.length === 0) {
    return <SectionPlaceholder eyebrow={eyebrow} title={title} label={label} columns={columns} />
  }

  return (
    <section className="border-t border-base-300 bg-base-100 py-14 sm:py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} align={align} />

        <div className={GRID[columns] ?? GRID[3]}>
          {cards.map((card) => {
            const internal = card.link.startsWith('/')

            return (
              <InfoCard
                key={card.id}
                icon={card.icon}
                title={pickLanguageText(card.title, lang)}
                meta={pickLanguageText(card.meta, lang)}
                description={pickLanguageText(card.description, lang)}
                to={internal ? card.link : undefined}
                href={!internal && card.link ? card.link : undefined}
                image={
                  card.mediaId ? (
                    <ContentImage
                      src={mediaUrl(card.mediaId)}
                      alt={pickLanguageText(card.title, lang)}
                      ratio={imageRatio}
                      className="rounded-none border-0"
                    />
                  ) : undefined
                }
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
