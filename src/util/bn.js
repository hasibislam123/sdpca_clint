const banglaDigits = '০১২৩৪৫৬৭৮৯'

export function toBanglaDigits(value) {
  return String(value).replace(/[0-9]/g, (digit) => banglaDigits[Number(digit)])
}
