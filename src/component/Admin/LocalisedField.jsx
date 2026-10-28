import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import useLanguage from '../../hook/useLanguage'

// Every editable string is stored as { en, bn }, so the editor always shows the two languages side by
// side. Leaving one blank is allowed: the page falls back to the wording shipped with the site.
export default function LocalisedField({
  name,
  label,
  value,
  onChange,
  languages = ['en', 'bn'],
  multiline = false,
  rows = 3,
  maxLength,
  hint,
  error,
}) {
  const { t } = useLanguage()
  const Field = multiline ? Textarea : Input

  const names = { en: t('admin.english'), bn: t('admin.bangla') }

  return (
    <div className={`grid gap-3 ${languages.length > 1 ? 'sm:grid-cols-2' : ''}`}>
      {languages.map((code) => (
        <Field
          key={`${name}-${code}`}
          id={`${name}-${code}`}
          label={`${label} · ${names[code] ?? code}`}
          value={value?.[code] ?? ''}
          rows={rows}
          maxLength={maxLength}
          hint={code === languages[0] ? hint : undefined}
          error={error}
          onChange={(event) => onChange({ en: '', bn: '', ...value, [code]: event.target.value })}
        />
      ))}
    </div>
  )
}
