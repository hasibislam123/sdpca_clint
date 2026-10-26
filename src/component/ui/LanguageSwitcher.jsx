import useLanguage from '../../hook/useLanguage'
import { supportedLanguages } from '../../i18n/translations'

export default function LanguageSwitcher({ className = '' }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div role="group" aria-label={t('lang.label')} className={`join ${className}`}>
      {supportedLanguages.map((language) => {
        const active = language.code === lang
        return (
          <button
            key={language.code}
            type="button"
            onClick={() => setLang(language.code)}
            aria-pressed={active}
            className={`btn btn-sm join-item ${active ? 'btn-primary' : 'btn-ghost text-base-content/70 hover:bg-base-200'}`}
          >
            {language.label}
          </button>
        )
      })}
    </div>
  )
}
