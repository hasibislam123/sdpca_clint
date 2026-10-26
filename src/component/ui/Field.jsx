import useLanguage from '../../hook/useLanguage'

export default function Field({ label, id, error, hint, required, className = '', children }) {
  const { t } = useLanguage()

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-base-content">
          {label}
          {required ? (
            <span className="ms-1 text-error" aria-hidden="true">
              *
            </span>
          ) : (
            <span className="ms-1 text-xs font-normal text-base-content/45">{t('common.optional')}</span>
          )}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-base-content/50">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-error">
          {error}
        </p>
      )}
    </div>
  )
}
