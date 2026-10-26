import { Icon } from './Icon'

const alertStyle = {
  success: { classes: 'alert-success', icon: 'checkCircle' },
  error: { classes: 'alert-error', icon: 'alert' },
  warning: { classes: 'alert-warning', icon: 'alert' },
  info: { classes: 'alert-info', icon: 'info' },
}

export default function Alert({ variant = 'info', title, children, className = '' }) {
  const style = alertStyle[variant] ?? alertStyle.info

  return (
    <div role={variant === 'error' ? 'alert' : 'status'} className={`alert ${style.classes} items-start ${className}`}>
      <Icon name={style.icon} className="mt-0.5 h-5 w-5 shrink-0" />
      <div className="flex flex-col gap-0.5">
        {title && <span className="font-semibold">{title}</span>}
        {children && <span className="text-sm font-normal leading-relaxed">{children}</span>}
      </div>
    </div>
  )
}
