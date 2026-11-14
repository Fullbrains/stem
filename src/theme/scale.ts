/**
 * The Stem scale: one table for every control with a `size`.
 *
 * At a given size every control — button, badge, input, select… — has the
 * same text, icon, padding, gap and radius, so they line up
 * wherever they sit side by side. The line height equals the icon size: text
 * and icon share one row, and a control is exactly `icon + 2 × padding-y`
 * tall (sm: 16 + 2 × 8 = 32px). Padding and gap are half the icon; the space scale
 * has one more step below xs, 2xs (4px), for tighter controls. Borders and focus rings are drawn inside.
 *
 * The values live as CSS classes in src/css/scale.css (`s-size-*`,
 * `s-space-*`, `s-text-*`, `s-icon-*`, `s-roundness-*`, `s-pill`): keep the
 * two in step.
 */
export const stemScale = {
  xs: {text: 12, icon: 12, space: 6, radius: 4},
  sm: {text: 14, icon: 16, space: 8, radius: 6},
  md: {text: 16, icon: 20, space: 10, radius: 8},
  lg: {text: 18, icon: 24, space: 12, radius: 10},
  xl: {text: 20, icon: 28, space: 14, radius: 12},
} as const

export type StemSize = keyof typeof stemScale

export const stemSizes = Object.keys(stemScale) as StemSize[]

/** The space scale: the sizes, plus 2xs (4px) and 0 (none) below xs. */
export type StemSpace = 0 | '0' | '2xs' | StemSize

const spaceSteps: StemSpace[] = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl']

/** The space `by` steps from a size, clamped to the scale (sm, +1 → md). */
export function stemSpaceStep(from: StemSize, by: number): StemSpace {
  const i = spaceSteps.indexOf(from)
  return spaceSteps[Math.min(spaceSteps.length - 1, Math.max(0, i + by))]!
}

/**
 * The props every sized Stem component takes on top of `size`. Each one,
 * when missing, follows `size`.
 */
export interface StemScaleProps {
  /** Font size. */
  textSize?: StemSize
  /** Icon size (and line height). A token, or any CSS length. */
  iconSize?: StemSize | (string & {})
  /** Padding on both axes, and gap. */
  space?: StemSpace
  /** Horizontal padding, and gap. */
  spaceX?: StemSpace
  /** Vertical padding. */
  spaceY?: StemSpace
  /** Squircle radius. */
  roundness?: StemSize
  /** Pill: fully round ends, never a squircle. */
  rounded?: boolean
  /**
   * Trim the label by the font's side bearing on the side of an icon, so the
   * gap to the icon is measured to the letters. `auto` (default): only beside
   * icons; `always`: also a label without icons, on both sides; `never`:
   * none. See src/css/scale.css.
   */
  opticalLabel?: StemOpticalLabel
}

/** Defaults of the scale props: pass to withDefaults in every wrapper. */
export type StemOpticalLabel = 'auto' | 'always' | 'never'

export const stemScaleDefaults = {opticalLabel: 'auto'} as const

/** The mode of `optical-label`; the old boolean still reads: true → auto, false → never. */
export function stemOpticalMode(v: unknown): StemOpticalLabel {
  if (v === false || v === 'false') return 'never'
  return v === 'always' || v === 'never' ? v : 'auto'
}

/**
 * The optical label trim (src/css/scale.css), on a label slot. On the side
 * of an icon only: `iconStart` for an icon on its left, `iconEnd` for one on
 * its right (both, if both); the side facing the padding stays as it is.
 * `alone` for a label without icons (always mode only).
 */
export const stemLabelShift = {
  iconStart: 'ms-[calc(var(--s-label-icon-start,0em)*-1)]',
  iconEnd: 'me-[calc(var(--s-label-icon-end,0em)*-1)]',
  alone: 'ms-[calc(var(--s-label-alone-start,0em)*-1)] me-[calc(var(--s-label-alone-end,0em)*-1)]',
} as const

function isToken(v: unknown): v is StemSize {
  return typeof v === 'string' && v in stemScale
}

/** The classes that move each axis off `size`. Plain CSS, not Tailwind. */
export function stemScaleClasses(p: StemScaleProps): string[] {
  const out: string[] = []
  // `!= null`, not truthiness: 0 is a value of the space scale.
  if (p.space != null) out.push(`s-space-${p.space}`)
  if (p.spaceX != null) out.push(`s-space-x-${p.spaceX}`)
  if (p.spaceY != null) out.push(`s-space-y-${p.spaceY}`)
  if (p.textSize) out.push(`s-text-${p.textSize}`)
  if (isToken(p.iconSize)) out.push(`s-icon-${p.iconSize}`)
  if (p.roundness) out.push(`s-roundness-${p.roundness}`)
  if (p.rounded) out.push('s-pill')
  out.push(`s-optical-label-${stemOpticalMode(p.opticalLabel)}`)
  return out
}

/** Inline style for what a class can't say: an icon size off the scale. */
export function stemScaleStyle(p: StemScaleProps): Record<string, string> | undefined {
  if (p.iconSize && !isToken(p.iconSize)) return {'--s-icon-size': p.iconSize}
  return undefined
}

/**
 * The Tailwind classes that read the scale. Put `stemSizeClass(size)` on the
 * component's root and these on the element that holds the text.
 */
export const stemScaleText = 'text-(length:--s-text) leading-(--s-icon-size)'
export const stemScalePadding = 'px-(--s-px) py-(--s-py) gap-(--s-gap)'
export const stemScaleIcon = 'size-(--s-icon-size) shrink-0'

export function stemSizeClass(size: StemSize) {
  return `s-size-${size}`
}

const spacePx: Record<string, number> = {'0': 0, '2xs': 4}

function spaceValue(v: StemSpace): number {
  return String(v) in spacePx ? spacePx[String(v)]! : stemScale[v as StemSize].space
}

/**
 * The scale as inline custom properties, for a root that already carries
 * another size class it cannot drop (an alert, whose theme gives toasts and
 * bare UAlerts a default): inline style beats any class.
 */
export function stemScaleVars(size: StemSize, p: StemScaleProps): Record<string, string> {
  const base = stemScale[size]
  const sx = p.spaceX ?? p.space
  const sy = p.spaceY ?? p.space
  const icon = p.iconSize
    ? (isToken(p.iconSize) ? `${stemScale[p.iconSize].icon}px` : p.iconSize)
    : `${base.icon}px`
  return {
    '--s-text': `${stemScale[p.textSize ?? size].text}px`,
    '--s-icon-size': icon,
    '--s-px': `${sx != null ? spaceValue(sx) : base.space}px`,
    '--s-py': `${sy != null ? spaceValue(sy) : base.space}px`,
    '--s-gap': `${sx != null ? spaceValue(sx) : base.space}px`,
    '--s-radius': p.rounded ? '9999px' : `${stemScale[p.roundness ?? size].radius}px`,
    ...(p.rounded ? {'--s-corner-shape': 'round'} : {}),
    ...stemOpticalVars(stemOpticalMode(p.opticalLabel)),
  }
}

/** The optical label variables of a mode, inline (see stemScaleVars). */
function stemOpticalVars(mode: StemOpticalLabel): Record<string, string> {
  const start = 'var(--s-label-bearing-start)'
  const end = 'var(--s-label-bearing-end)'
  return {
    '--s-label-icon-start': mode === 'never' ? '0em' : start,
    '--s-label-icon-end': mode === 'never' ? '0em' : end,
    '--s-label-alone-start': mode === 'always' ? start : '0em',
    '--s-label-alone-end': mode === 'always' ? end : '0em',
  }
}
