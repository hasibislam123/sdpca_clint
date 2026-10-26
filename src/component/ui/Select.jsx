import Field from './Field'
import useFieldId from '../../hook/useFieldId'

export default function Select({ label, id, error, hint, required, options = [], placeholder, className = '', ...rest }) {
  const fieldId = useFieldId(id)

  return (
    <Field label={label} id={fieldId} error={error} hint={hint} required={required}>
      <select
        id={fieldId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={`select select-bordered w-full bg-base-100 ${error ? 'select-error' : ''} ${className}`}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => {
          const value = typeof option === 'string' ? option : option.value
          const text = typeof option === 'string' ? option : option.label
          return (
            <option key={value} value={value}>
              {text}
            </option>
          )
        })}
      </select>
    </Field>
  )
}
