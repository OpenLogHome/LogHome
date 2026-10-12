// Same cumulative/delta overlap rules used by the mobile writing assistant.
export function mergeWriterStreamText(previousText, nextText) {
  const previous = String(previousText || ""),
    next = String(nextText || "");
  if (!next || previous.endsWith(next)) return previous;
  if (next.startsWith(previous)) return next;
  for (let n = Math.min(previous.length, next.length); n > 0; n--) {
    if (previous.slice(-n) === next.slice(0, n))
      return previous + next.slice(n);
  }
  return previous + next;
}
