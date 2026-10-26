import { useId } from 'react'

export default function useFieldId(id) {
  const generated = useId()
  return id ?? generated
}
