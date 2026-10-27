import useLanguage from '../../hook/useLanguage'

export default function Logo({ size = 'md', withName = true, nameClassName = '' }) {
  const { t } = useLanguage()
  const box = { sm: 'h-10', md: 'h-14', lg: 'h-20' }[size]
  const title = { sm: 'text-base', md: 'text-lg', lg: 'text-2xl' }[size]

  return (
    <span className="flex items-center gap-3">
      <img
        src="/logo.png"
        alt={withName ? '' : t('brand.name')}
        className={`${box} w-auto shrink-0 object-contain`}
      />
      {withName && (
        <span className={`flex flex-col leading-tight ${title} ${nameClassName}`}>
          <span className="font-semibold">{t('brand.name')}</span>
          <span className="text-[0.65em] font-normal opacity-70">{t('brand.tagline')}</span>
        </span>
      )}
    </span>
  )
}
