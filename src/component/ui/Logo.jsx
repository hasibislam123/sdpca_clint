import useLanguage from '../../hook/useLanguage'

export default function Logo({ size = 'md', withName = true, nameClassName = '' }) {
  const { t } = useLanguage()
  const box = { sm: 'h-9 w-9 text-sm', md: 'h-11 w-11 text-base', lg: 'h-16 w-16 text-xl' }[size]
  const title = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }[size]

  return (
    <span className="flex items-center gap-3">
      {/* Initials block stands in for the school logo asset until one is supplied. */}
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-xl bg-primary font-semibold text-primary-content ${box}`}
      >
        {t('brand.initials')}
      </span>
      {withName && (
        <span className={`flex flex-col leading-tight ${title} ${nameClassName}`}>
          <span className="font-semibold">{t('brand.name')}</span>
          <span className="text-[0.65em] font-normal opacity-70">{t('brand.tagline')}</span>
        </span>
      )}
    </span>
  )
}
