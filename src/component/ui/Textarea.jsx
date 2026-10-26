import Field from './Field'
import useFieldId from '../../hook/useFieldId'

export default function Textarea({ label, id, error, hint, required, rows = 4, className = '', ...rest }) {
  const fieldId = useFieldId(id)

  return (
    <Field label={label} id={fieldId} error={error} hint={hint} required={required}>
      <textarea
        id={fieldId}
        required={required}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`textarea textarea-bordered w-full resize-y bg-base-100 ${error ? 'textarea-error' : ''} ${className}`}
        {...rest}
      />
    </Field>
  )
}
