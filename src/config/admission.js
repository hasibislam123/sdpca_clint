// Admission route and dropdown value sets. Labels live in src/i18n/translations.js under `options`.

export const applyPath = '/admission/apply'

// Kept identical to CLASS_LEVELS in the server's src/config/admission.js: this list only decides what
// the dropdown offers, and the API refuses any value that is not on its own copy.
export const classLevels = ['play', 'nursery', 'kg', '1', '2', '3', '4', '5', '6', '7', '8', '9']

export const genders = ['male', 'female', 'other']

export const guardianRelations = ['father', 'mother', 'guardian']
