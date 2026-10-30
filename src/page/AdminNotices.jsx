import { useState } from 'react'
import Panel from '../component/Admin/Panel'
import LocalisedField from '../component/Admin/LocalisedField'
import ImagePicker from '../component/Admin/ImagePicker'
import ConfirmDelete from '../component/Admin/ConfirmDelete'
import Input from '../component/ui/Input'
import Button from '../component/ui/Button'
import EmptyState from '../component/ui/EmptyState'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { formatNoticeDate, pickLanguageText } from '../util/localised'
import { emptyNotice, noticeDraft, today } from '../admin/drafts'

export default function AdminNotices() {
  const { t, lang, tNumber } = useLanguage()
  const { schema, notices, saveNotice, deleteNotice, busy } = useAdminContent()
  const [form, setForm] = useState(null)

  const languages = schema.languages ?? ['en', 'bn']
  const list = [...notices].sort((a, b) => new Date(b.noticeDate) - new Date(a.noticeDate))

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const handleSave = async () => {
    const saved = await saveNotice(form)
    if (saved) setForm(null)
  }

  return (
    <div className="flex flex-col gap-5">
      <Panel
        title={t('admin.noticesTitle')}
        description={t('admin.noticesDescription')}
        action={
          <Button
            type="button"
            size="sm"
            className="gap-2"
            disabled={Boolean(form)}
            onClick={() => setForm(emptyNotice(languages, today()))}
          >
            <Icon name="plus" className="h-4 w-4" />
            {t('admin.newNotice')}
          </Button>
        }
      >
        {list.length === 0 ? (
          <EmptyState icon="megaphone" title={t('admin.emptyNotices')} description={t('admin.emptyNoticesBody')} />
        ) : (
          <ul className="flex flex-col gap-3">
            {list.map((notice) => (
              <li key={notice.id} className="flex flex-wrap items-center gap-4 rounded-box border border-base-300 bg-base-200/50 p-3">
                <div className="flex min-w-40 flex-1 flex-col gap-1">
                  <span className="text-sm font-semibold text-base-content">
                    {pickLanguageText(notice.title, lang) || t('admin.untitled')}
                  </span>
                  <span className="text-xs text-base-content/60">{tNumber(formatNoticeDate(notice.noticeDate, lang))}</span>
                  <span className="flex flex-wrap gap-2">
                    {notice.pinned && <span className="badge badge-accent badge-sm">{t('notices.pinned')}</span>}
                    {!notice.publish && <span className="badge badge-ghost badge-sm">{t('admin.draft')}</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    disabled={busy || Boolean(form)}
                    onClick={() => setForm(noticeDraft(notice, languages))}
                  >
                    <Icon name="edit" className="h-4 w-4" />
                    {t('admin.edit')}
                  </Button>
                  <ConfirmDelete
                    label={pickLanguageText(notice.title, lang) || notice.id}
                    busy={busy}
                    onConfirm={() => deleteNotice(notice.id)}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {form && (
        <Panel
          title={form.id ? t('admin.editNotice') : t('admin.newNotice')}
          action={
            <Button type="button" size="sm" variant="ghost" onClick={() => setForm(null)}>
              {t('admin.close')}
            </Button>
          }
        >
          <LocalisedField
            name="notice-title"
            label={t('admin.noticeTitleLabel')}
            value={form.title}
            languages={languages}
            maxLength={schema.limits?.title}
            onChange={(value) => setField('title', value)}
          />
          <LocalisedField
            name="notice-description"
            label={t('admin.noticeBodyLabel')}
            value={form.description}
            languages={languages}
            multiline
            rows={6}
            maxLength={schema.limits?.noticeBody}
            onChange={(value) => setField('description', value)}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id="notice-date"
              type="date"
              label={t('admin.noticeDate')}
              value={form.noticeDate}
              required
              onChange={(event) => setField('noticeDate', event.target.value)}
            />
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-3 text-sm font-medium text-base-content">
                <input
                  type="checkbox"
                  className="checkbox border-base-300 bg-base-100"
                  checked={form.pinned}
                  onChange={(event) => setField('pinned', event.target.checked)}
                />
                {t('admin.pinNotice')}
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-base-content">
                <input
                  type="checkbox"
                  className="checkbox border-base-300 bg-base-100"
                  checked={form.publish}
                  onChange={(event) => setField('publish', event.target.checked)}
                />
                {t('admin.publishNotice')}
              </label>
            </div>
          </div>

          <ImagePicker id="notice-image" value={form.mediaId} onChange={(id) => setField('mediaId', id)} />

          <div className="flex flex-wrap gap-3">
            <Button type="button" onClick={handleSave} disabled={busy}>
              {busy ? t('admin.saving') : t('admin.save')}
            </Button>
            <Button type="button" variant="light" onClick={() => setForm(null)} disabled={busy}>
              {t('admin.cancel')}
            </Button>
          </div>
        </Panel>
      )}
    </div>
  )
}
