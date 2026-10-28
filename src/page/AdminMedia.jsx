import { useRef, useState } from 'react'
import Panel from '../component/Admin/Panel'
import ConfirmDelete from '../component/Admin/ConfirmDelete'
import ContentImage from '../component/Content/ContentImage'
import Input from '../component/ui/Input'
import Button from '../component/ui/Button'
import EmptyState from '../component/ui/EmptyState'
import { Icon } from '../component/ui/Icon'
import useAdminContent from '../hook/useAdminContent'
import useLanguage from '../hook/useLanguage'
import { mediaUrl } from '../config/api'

// A file that a card, notice, teacher or page still points at cannot be deleted: the API answers 409 and
// the banner names the field, so an upload can never silently blank a public page.
export default function AdminMedia() {
  const { t, tNumber } = useLanguage()
  const { schema, media, cards, notices, teachers, pages, uploadImage, deleteImage, busy } = useAdminContent()
  const [file, setFile] = useState(null)
  const [alt, setAlt] = useState('')
  const inputRef = useRef(null)

  const maxKb = Math.round((schema?.mediaMaxBytes ?? 0) / 1024)

  const usageOf = (id) => {
    const inCards = cards.filter((card) => card.mediaId === id).length
    const inNotices = notices.filter((notice) => notice.mediaId === id).length
    const inTeachers = teachers.filter((teacher) => teacher.mediaId === id).length
    const inPages = Object.values(pages).reduce(
      (total, document) => total + Object.values(document?.images ?? {}).filter((value) => value === id).length,
      0,
    )
    return inCards + inNotices + inTeachers + inPages
  }

  const handleUpload = async () => {
    if (!file) return
    const created = await uploadImage(file, alt)
    if (!created?.media) return
    setFile(null)
    setAlt('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-5">
      <Panel title={t('admin.uploadImage')} description={maxKb > 0 ? t('admin.uploadHint', { n: tNumber(String(maxKb)) }) : undefined}>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
          <Input
            id="media-file"
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            label={t('admin.chooseFile')}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Input
            id="media-alt"
            label={t('admin.alt')}
            value={alt}
            maxLength={240}
            placeholder={file?.name ?? ''}
            onChange={(event) => setAlt(event.target.value)}
          />
          <Button type="button" onClick={handleUpload} disabled={busy || !file} className="gap-2">
            <Icon name="upload" className="h-4 w-4" />
            {busy ? t('admin.saving') : t('admin.upload')}
          </Button>
        </div>
      </Panel>

      <Panel title={t('admin.library')} description={t('admin.libraryDescription')}>
        {media.length === 0 ? (
          <EmptyState icon="image" title={t('admin.libraryEmpty')} description={t('admin.libraryEmptyBody')} />
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((item) => {
              const usage = usageOf(item.id)

              return (
                <li key={item.id} className="flex items-start gap-3 rounded-box border border-base-300 bg-base-200/50 p-3">
                  <div className="w-24 shrink-0 sm:w-28">
                    <ContentImage src={mediaUrl(item.id)} alt={item.alt} ratio="aspect-[4/3]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <span className="truncate text-sm font-medium text-base-content">{item.alt || t('admin.noAlt')}</span>
                      <span className="text-xs text-base-content/55">
                        {tNumber(String(Math.round(item.bytes / 1024)))} KB · {item.mime.replace(/^image\//, '')}
                      </span>
                      <span className="text-xs text-base-content/45">
                        {usage > 0 ? t('admin.usedBy', { n: tNumber(String(usage)) }) : t('admin.unused')}
                      </span>
                    </div>
                    <ConfirmDelete
                      label={item.alt || item.id}
                      busy={busy}
                      disabled={usage > 0}
                      onConfirm={() => deleteImage(item.id)}
                    />
                    {usage > 0 && <p className="text-xs text-base-content/45">{t('errors.imageInUse')}</p>}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Panel>
    </div>
  )
}
