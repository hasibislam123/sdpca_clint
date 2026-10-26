const fallback = '/'

// Only same-origin app paths are accepted as post-login destinations.
// '//evil.com' and '/\\evil.com' are browser-resolved protocol-relative URLs and must be rejected.
export function safeRedirectPath(target, to = fallback) {
  if (typeof target !== 'string') return to
  if (!target.startsWith('/')) return to
  if (target.startsWith('//') || target.includes('\\')) return to
  return target
}
