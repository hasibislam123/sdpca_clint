import { useRef, useState } from 'react'
import ContentImage from '../Content/ContentImage'
import Button from '../ui/Button'
import Select from '../ui/Select'
import Input from '../ui/Input'
import { Icon } from '../ui/Icon'
import useAdminContent from '../../hook/useAdminContent'
import useLanguage from '../../hook/useLanguage'
import { mediaUrl } from '../../config/api'

// Images are uploaded once and then referenced by id, so the same file can serve several cards and a
// delete is refused while anything still points at it.
export default function ImagePicker({ id, value, onChange, label, fit = 'cover' }) {
  const { t, tNumber } = useLanguage()
  const { media, schema, uploadImage, busy } = useAdminContent()
  const [file, setFile] = useState(null)
  const [alt, setAlt] = useState('')
  const inputRef = useRef(null)

  const maxKb = Math.round((schema?.mediaMaxBytes ?? 0) / 1024)

  const options = media.map((item) => ({
    value: item.id,
    label: `${item.alt || item.id.slice(0, 8)} · ${tNumber(String(Math.round(item.bytes / 1024)))} KB`,
  }))

  const handleUpload = async () => {
    if (!file) return
    const created = await uploadImage(file, alt)
    if (!created?.media) return
    onChange(created.media.id)
    setFile(null)
    setAlt('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="flex flex-col gap-3">
        <Select
          id={`${id}-library`}
          label={label ?? t('admin.library')}
          value={value ?? ''}
          options={options}
          placeholder={t('admin.noImage')}
          onChange={(event) => onChange(event.target.value)}
        />

        <div className="flex flex-col gap-3 rounded-box border border-dashed border-base-300 bg-base-200/60 p-3">
          <Input
            id={`${id}-file`}
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            label={t('admin.uploadImage')}
            hint={maxKb > 0 ? t('admin.uploadHint', { n: tNumber(String(maxKb)) }) : undefined}
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
          <Input
            id={`${id}-alt`}
            label={t('admin.alt')}
            value={alt}
            maxLength={240}
            placeholder={file?.name ?? ''}
            onChange={(event) => setAlt(event.target.value)}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="self-start gap-2"
            disabled={busy || !file}
            onClick={handleUpload}
          >
            <Icon name="upload" className="h-4 w-4" />
            {busy ? t('admin.saving') : t('admin.upload')}
          </Button>
        </div>
      </div>

      <div className="self-start">
        <ContentImage
          src={value ? mediaUrl(value) : ''}
          alt={alt}
          label={t('common.imageSoon')}
          ratio="aspect-[4/3]"
          fit={fit}
        />
      </div>
    </div>
  )
}
