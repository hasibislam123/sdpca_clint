import Field from './Field'
import useFieldId from '../../hook/useFieldId'

export default function Input({ label, id, error, hint, required, className = '', ...rest }) {
  const fieldId = useFieldId(id)

  return (
    <Field label={label} id={fieldId} error={error} hint={hint} required={required}>
      <input
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`input input-bordered w-full bg-base-100 ${error ? 'input-error' : ''} ${className}`}
        {...rest}
      />
    </Field>
  )
}
