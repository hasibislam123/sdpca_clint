import { NavLink } from 'react-router-dom'
import { Icon } from '../ui/Icon'
import useLanguage from '../../hook/useLanguage'

const tabs = [
  { to: '/admin', end: true, key: 'admin.navOverview', icon: 'shield' },
  { to: '/admin/pages', key: 'admin.navPages', icon: 'book' },
  { to: '/admin/cards', key: 'admin.navCards', icon: 'grid' },
  { to: '/admin/teachers', key: 'admin.navTeachers', icon: 'users' },
  { to: '/admin/notices', key: 'admin.navNotices', icon: 'megaphone' },
  { to: '/admin/media', key: 'admin.navMedia', icon: 'image' },
  { to: '/admin/applications', key: 'admin.navApplications', icon: 'inbox' },
]

const base = 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition duration-200'
const idle = 'text-base-content/70 hover:bg-base-200 hover:text-primary'
const isActive = 'bg-primary/10 text-primary'

export default function AdminNav() {
  const { t } = useLanguage()

  return (
    <nav aria-label={t('admin.title')} className="flex flex-wrap gap-1 rounded-box border border-base-300 bg-base-100 p-2">
      {tabs.map((tab) => (
        <NavLink key={tab.to} to={tab.to} end={tab.end} className={({ active }) => `${base} ${active ? isActive : idle}`}>
          <Icon name={tab.icon} className="h-4 w-4" />
          {t(tab.key)}
        </NavLink>
      ))}
    </nav>
  )
}
