import useLanguage from '../../hook/useLanguage'
import useTheme from '../../hook/useTheme'
import { Icon } from './Icon'

export default function ThemeSwitcher({ size = 'sm', className = '' }) {
  const { t } = useLanguage()
  const { mode, toggle } = useTheme()
  const isDark = mode === 'dark'
  const label = isDark ? t('theme.switchToLight') : t('theme.switchToDark')

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={label}
      title={label}
      className={`btn btn-ghost btn-circle btn-${size} ${className}`}
    >
      <Icon name={isDark ? 'sun' : 'moon'} className="h-5 w-5" />
    </button>
  )
}
