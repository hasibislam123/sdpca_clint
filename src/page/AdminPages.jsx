import Panel from '../component/Admin/Panel'
import Button from '../component/ui/Button'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'

const editedCount = (document) =>
  Object.values(document?.texts ?? {}).reduce(
    (total, bucket) => total + Object.values(bucket ?? {}).filter((value) => String(value ?? '') !== '').length,
    0,
  )

export default function AdminPages() {
  const { t, tNumber } = useLanguage()
  const { schema, pages, cards } = useAdminContent()

  return (
    <Panel title={t('admin.pagesTitle')} description={t('admin.pagesDescription')}>
      <ul className="flex flex-col gap-3">
        {Object.entries(schema.pages).map(([name, definition]) => {
          const document = pages[name]
          const navKey = `nav.${name}`
          const label = t(navKey) === navKey ? definition.label : t(navKey)
          const cardTotal = cards.filter((card) => card.page === name).length

          return (
            <li
              key={name}
              className="flex flex-wrap items-center justify-between gap-3 rounded-box border border-base-300 bg-base-200/50 px-4 py-3"
            >
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-base-content">{label}</span>
                <span className="text-xs text-base-content/60">
                  {t('admin.pageSummary', {
                    fields: tNumber(String((definition.texts?.length ?? 0) * (schema.languages?.length ?? 2))),
                    saved: tNumber(String(editedCount(document))),
                    cards: tNumber(String(cardTotal)),
                    slots: tNumber(String(definition.slots?.length ?? 0)),
                    images: tNumber(String(definition.images?.length ?? 0)),
                  })}
                </span>
              </div>
              <Button to={`/admin/pages/${name}`} size="sm" variant="outline" className="gap-2">
                <Icon name="edit" className="h-4 w-4" />
                {t('admin.open')}
              </Button>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
