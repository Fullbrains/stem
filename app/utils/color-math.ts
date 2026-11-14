/** Qualunque colore CSS (anche oklch o var risolta) → [r, g, b] in 0–255, via canvas. */
export function toRgb(css: string): [number, number, number] | null {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas')
  c.width = c.height = 1
  const ctx = c.getContext('2d', {willReadFrequently: true})
  if (!ctx) return null
  ctx.fillStyle = '#000'
  ctx.fillStyle = css
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return [r!, g!, b!]
}

export function toHex([r, g, b]: [number, number, number]) {
  return `#${[r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')}`
}

function luminance([r, g, b]: [number, number, number]) {
  const f = (v: number) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

/** Rapporto di contrasto WCAG fra due colori. */
export function contrast(a: [number, number, number], b: [number, number, number]) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number]
  return (l1 + 0.05) / (l2 + 0.05)
}

/** Il primo sfondo non trasparente risalendo dall'elemento. */
export function backgroundOf(el: Element | null): string {
  while (el) {
    const bg = getComputedStyle(el).backgroundColor
    if (bg && bg !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(bg)) return bg
    el = el.parentElement
  }
  return '#fff'
}
