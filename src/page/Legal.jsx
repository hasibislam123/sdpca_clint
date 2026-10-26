import PageHeader from '../component/ui/PageHeader'
import Alert from '../component/ui/Alert'
import useLanguage from '../hook/useLanguage'

const legalPages = {
  privacy: {
    titleKey: 'legal.privacyTitle',
    introKey: 'legal.privacyIntro',
    sections: [
      ['legal.privacyH1', 'legal.privacyB1'],
      ['legal.privacyH2', 'legal.privacyB2'],
      ['legal.privacyH3', 'legal.privacyB3'],
    ],
  },
  terms: {
    titleKey: 'legal.termsTitle',
    introKey: 'legal.termsIntro',
    sections: [
      ['legal.termsH1', 'legal.termsB1'],
      ['legal.termsH2', 'legal.termsB2'],
      ['legal.termsH3', 'legal.termsB3'],
    ],
  },
}

export default function Legal({ page = 'privacy' }) {
  const { t } = useLanguage()
  const content = legalPages[page] ?? legalPages.privacy
  const title = t(content.titleKey)

  return (
    <>
      <PageHeader title={title} description={t(content.introKey)} breadcrumb={[{ label: title }]} />
      <section className="bg-base-100">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-14 sm:px-6">
          <Alert variant="info" title={t('legal.sampleTitle')}>
            {t('legal.sampleBody', { school: t('brand.name') })}
          </Alert>
          {content.sections.map(([headingKey, bodyKey]) => (
            <article key={headingKey} className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-base-content">{t(headingKey)}</h2>
              <p className="text-sm leading-relaxed text-base-content/70">{t(bodyKey)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
