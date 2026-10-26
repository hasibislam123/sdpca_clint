const banglaDigits = '০১২৩৪৫৬৭৮৯'

export function toBanglaDigits(value) {
  return String(value).replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)])
}

// Numeric interpolation values are display counts, so they follow the same numeral rule as tNumber.
export function localizeNumbers(toDigits, vars) {
  if (!vars) return vars
  return Object.fromEntries(Object.entries(vars).map(([key, value]) => [key, typeof value === 'number' ? toDigits(value) : value]))
}
