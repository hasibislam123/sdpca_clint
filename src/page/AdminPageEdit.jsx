import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Panel from '../component/Admin/Panel'
import LocalisedField from '../component/Admin/LocalisedField'
import ImagePicker from '../component/Admin/ImagePicker'
import Button from '../component/ui/Button'
import EmptyState from '../component/ui/EmptyState'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { formatNoticeDate } from '../util/localised'
import { isDirty, pageDraft } from '../admin/drafts'

// Long fields such as the call-to-action paragraph deserve a box that shows several lines; the short
// headings and badges stay single-line.
const isParagraph = (key) => /(?:text|description|blurb|body)/i.test(key)

export default function AdminPageEdit() {
  const { t, lang, tNumber } = useLanguage()
  const { page = '' } = useParams()
  const { schema, pages, savePage, busy } = useAdminContent()

  const definition = schema.pages[page]
  const saved = pages[page]
  const languages = useMemo(() => schema.languages ?? ['en', 'bn'], [schema.languages])

  const base = useMemo(
    () => (definition && saved ? pageDraft(definition, saved, languages) : null),
    [definition, saved, languages],
  )

  // The draft is keyed by page and stored version, so a save (which bumps the version) drops the
  // local copy without an effect that could race with what the server just sent back.
  const draftKey = `${page}:${saved?.version ?? ''}`
  const [edited, setEdited] = useState(null)
  const [editedKey, setEditedKey] = useState('')
  const draft = editedKey === draftKey && edited ? edited : base

  if (!definition || !saved || !draft) {
    return (
      <EmptyState
        icon="alert"
        title={t('admin.unknownPage')}
        description={t('admin.unknownPageBody')}
        action={
          <Button to="/admin/pages" variant="light">
            {t('admin.pagesTitle')}
          </Button>
        }
      />
    )
  }

  const patch = (next) => {
    setEditedKey(draftKey)
    setEdited(next)
  }

  const setText = (key, value) =>
    patch({
      ...draft,
      texts: Object.fromEntries(languages.map((code) => [code, { ...draft.texts[code], [key]: value[code] ?? '' }])),
    })

  const setImage = (slot, mediaId) => patch({ ...draft, images: { ...draft.images, [slot]: mediaId } })

  const dirty = isDirty(draft, base)

  const handleSave = async () => {
    const result = await savePage(page, { texts: draft.texts, images: draft.images, version: saved.version })
    if (result) {
      setEdited(null)
      setEditedKey('')
    }
  }

  const navKey = `nav.${page}`
  const label = t(navKey) === navKey ? definition.label : t(navKey)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl leading-snug font-semibold text-base-content">{label}</h2>
        <Link to="/admin/pages" className="text-sm font-medium text-primary hover:underline">
          {t('admin.allPages')}
        </Link>
      </div>

      <Panel title={t('admin.texts')} description={t('admin.textsHint')}>
        <div className="flex flex-col gap-4">
          {(definition.texts ?? []).map((key) => (
            <LocalisedField
              key={key}
              name={`${page}-${key}`}
              label={key}
              value={{ en: draft.texts.en?.[key] ?? '', bn: draft.texts.bn?.[key] ?? '' }}
              languages={languages}
              multiline={isParagraph(key)}
              rows={4}
              maxLength={schema.limits?.textValue}
              onChange={(value) => setText(key, value)}
            />
          ))}
        </div>
      </Panel>

      {(definition.images ?? []).length > 0 && (
        <Panel title={t('admin.images')} description={t('admin.imagesHint')}>
          <div className="flex flex-col gap-6">
            {definition.images.map((slot) => (
              <div key={slot} className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-base-content">{slot}</p>
                <ImagePicker id={`${page}-${slot}`} value={draft.images[slot]} onChange={(id) => setImage(slot, id)} />
              </div>
            ))}
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap items-center gap-3 rounded-box border border-base-300 bg-base-100 px-4 py-3 shadow-sm">
        <Button type="button" onClick={handleSave} disabled={busy || !dirty}>
          {busy ? t('admin.saving') : t('admin.save')}
        </Button>
        <Button
          type="button"
          variant="light"
          disabled={busy || !dirty}
          onClick={() => {
            setEdited(null)
            setEditedKey('')
          }}
        >
          {t('admin.reset')}
        </Button>
        <span className="flex items-center gap-2 text-xs text-base-content/60">
          <Icon name={dirty ? 'info' : 'checkCircle'} className={`h-4 w-4 ${dirty ? 'text-warning' : 'text-success'}`} />
          {dirty ? t('admin.unsaved') : t('admin.allSaved', { version: tNumber(String(saved.version)) })}
        </span>
        {saved.updatedAt && (
          <span className="ms-auto text-xs text-base-content/50">
            {t('admin.lastUpdated')}: {tNumber(formatNoticeDate(saved.updatedAt, lang))}
          </span>
        )}
      </div>
    </div>
  )
}
