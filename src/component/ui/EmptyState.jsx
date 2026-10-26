import { Icon } from './Icon'

export default function EmptyState({ icon = 'inbox', title, description, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-box border border-dashed border-base-300 bg-base-100 px-6 py-12 text-center ${className}`}
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-base-200 text-base-content/45">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold text-base-content">{title}</h3>
      {description && <p className="max-w-sm text-sm leading-relaxed text-base-content/60">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
