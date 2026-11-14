/**
 * The Stem scale: one table for every control with a `size`.
 *
 * At a given size every control — button, badge, input, select… — has the
 * same text, icon, padding, gap and radius, so they line up optically
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
}

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

/**
 * Optical alignment of an icon beside text. Phosphor draws inside a 256 grid
 * with 24 units of air on each side (3/32 of the icon), so a box-exact gap or
 * padding looks wider next to an icon than next to text. A negative margin of
 * that much on the icon's sides brings the drawing, not its box, to the
 * padding and the gap. Off when the control is icon only (`square`): there
 * the box is what must stay square.
 */
export const stemIconOptical = '-mx-[calc(var(--s-icon-size)*0.09375)]'

export function stemSizeClass(size: StemSize) {
  return `s-size-${size}`
}
