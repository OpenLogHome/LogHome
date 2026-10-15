// Interpolate named values as plain text. Vue remains responsible for escaping.
export function formatCopy(template, values = {}) {
  return template.replace(/\{(\w+)\}/g, (token, key) =>
    Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : token)
}
