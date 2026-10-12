// Login callers may supply a local return route, never an external destination.
export function loginReturnPath(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\u0000-\u001f]/.test(value)) return '/'
  try {
    const url = new URL(value, 'https://loghome.ink')
    if (url.origin !== 'https://loghome.ink' || url.pathname === '/login') return '/'
    return url.pathname + url.search + url.hash
  } catch (_) { return '/' }
}
