import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Panel from '../component/Admin/Panel'
import Button from '../component/ui/Button'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { apiAdminApplications } from '../api/admission'

const tiles = [
  { to: '/admin/pages', key: 'admin.navPages', icon: 'book', count: (state) => Object.keys(state.schema.pages).length },
  { to: '/admin/cards', key: 'admin.navCards', icon: 'grid', count: (state) => state.cards.length },
  { to: '/admin/teachers', key: 'admin.navTeachers', icon: 'users', count: (state) => state.teachers.length },
  { to: '/admin/notices', key: 'admin.navNotices', icon: 'megaphone', count: (state) => state.notices.length },
  { to: '/admin/media', key: 'admin.navMedia', icon: 'image', count: (state) => state.media.length },
  // Applications are not part of the content payload — they are people's private records, so they are
  // read on the screen that shows them. Until that read comes back the tile says nothing rather than 0.
  { to: '/admin/applications', key: 'admin.navApplications', icon: 'inbox', count: (state) => state.pending },
]

export default function AdminHome() {
  const { t, tNumber } = useLanguage()
  const state = useAdminContent()
  const [pending, setPending] = useState(null)

  useEffect(() => {
    let active = true

    apiAdminApplications({ status: 'submitted' }).then(
      (data) => {
        if (active) setPending(data?.applications?.length ?? 0)
      },
      () => {
        // Leaving the tile blank is the honest answer here; the applications screen reports the
        // failure properly when an administrator opens it.
      },
    )

    return () => {
      active = false
    }
  }, [])

  const overview = { ...state, pending }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => {
          const value = tile.count(overview)

          return (
            <Link
              key={tile.to}
              to={tile.to}
              className="flex flex-col gap-2 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <Icon name={tile.icon} className="h-5 w-5" />
              </span>
              <span className="text-2xl leading-none font-semibold text-base-content">
                {value === null ? '—' : tNumber(String(value))}
              </span>
              <span className="text-sm font-medium text-base-content/70">{t(tile.key)}</span>
            </Link>
          )
        })}
      </div>

      <Panel title={t('admin.howTitle')} description={t('admin.howBody')}>
        <ul className="flex flex-col gap-2 text-sm leading-relaxed text-base-content/70">
          {[t('admin.howItem1'), t('admin.howItem2'), t('admin.howItem3')].map((item) => (
            <li key={item} className="flex gap-2">
              <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-3">
          <Button to="/" variant="light" size="sm">
            {t('admin.viewSite')}
          </Button>
          <Button to="/admin/pages" variant="primary" size="sm">
            {t('admin.startEditing')}
          </Button>
        </div>
      </Panel>
    </div>
  )
}
