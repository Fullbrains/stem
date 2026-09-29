import DOMPurify from 'dompurify'

const ESCAPES: Record<string, string> = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}

/**
 * Caller text as HTML — formatting is welcome — but sanitized (DOMPurify):
 * callers build it from data they do not control (a chat's title in a
 * delete confirm), and markup that runs code must not survive. Without a
 * DOM (server rendering) DOMPurify cannot parse, so there it is escaped to
 * plain text instead.
 */
export function safeHtml(html: string | undefined): string {
  if (!html) return ''

  return typeof window === 'undefined'
      ? html.replace(/[&<>"']/g, c => ESCAPES[c]!)
      : DOMPurify.sanitize(html)
}
