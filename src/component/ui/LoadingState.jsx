import useLanguage from '../../hook/useLanguage'

export default function LoadingState({ label, rows = 3, className = '' }) {
  const { t } = useLanguage()

  return (
    <div className={`flex flex-col items-center justify-center gap-4 py-10 ${className}`}>
      <span aria-hidden="true" className="loading loading-ring loading-lg text-primary" />
      <p role="status" className="text-sm text-base-content/60">
        {label ?? t('common.loading')}
      </p>
      {rows > 0 && (
        <div className="flex w-full max-w-md flex-col gap-2" aria-hidden="true">
          {Array.from({ length: rows }).map((_, index) => (
            <span key={index} className="skeleton block h-3 rounded-full bg-base-300" style={{ width: `${100 - index * 12}%` }} />
          ))}
        </div>
      )}
    </div>
  )
}
