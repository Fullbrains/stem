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

/**
 * The space scale: the sizes, plus 2xs (4px) and 0 (none) below xs, and
 * 2xl to 5xl (16–22px) above xl, for containers.
 */
export type StemSpace = 0 | '0' | '2xs' | StemSize | '2xl' | '3xl' | '4xl' | '5xl'

const spaceSteps: StemSpace[] = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl']

/**
 * A step relative to the space the control would have otherwise (its
 * parent's, else its size's): '-1' one step tighter, '+2' two looser. A
 * signed string, or a non-zero number (0 is the absolute none).
 */
export type StemSpaceShift = `${'+' | '-'}${1 | 2 | 3 | 4 | 5 | 6}` | number

/** A space prop's value: a step of the scale, or a shift from the one it would have. */
export type StemSpaceValue = StemSpace | StemSpaceShift

/** The shift of a relative space value in steps, or null for an absolute one. */
export function stemSpaceShift(v: unknown): number | null {
  if (typeof v === 'number') return v === 0 ? null : v
  if (typeof v === 'string' && /^[+-]\d+$/.test(v)) return Number(v)
  return null
}

/** A size prop's value: a size, or a shift from the one it would have ('-1': a size below). */
export type StemSizeValue = StemSize | StemSpaceShift

/** The size `by` steps from another, clamped to the scale (sm, -1 → xs). */
export function stemSizeStep(from: StemSize, by: number): StemSize {
  const i = stemSizes.indexOf(from)
  return stemSizes[Math.min(stemSizes.length - 1, Math.max(0, i + by))]!
}

/** The space `by` steps from a size or space, clamped to the scale (sm, +1 → md). */
export function stemSpaceStep(from: StemSpace, by: number): StemSpace {
  const i = spaceSteps.indexOf(String(from) as StemSpace)
  return spaceSteps[Math.min(spaceSteps.length - 1, Math.max(0, i + by))]!
}

/**
 * The props every sized Stem component takes on top of `size`. Each one,
 * when missing, follows `size`.
 */
export interface StemScaleProps {
  /**
   * The size: text, icon, padding, gap and radius at once. A size, or a
   * shift ('-1', '+1') from the one it would have.
   */
  size?: StemSizeValue
  /** Font size. */
  textSize?: StemSize
  /** Icon size (and line height). A token, or any CSS length. */
  iconSize?: StemSize | (string & {})
  /** Padding on both axes, and gap. A step, or a shift ('-1', '+1'). */
  space?: StemSpaceValue
  /** Horizontal padding, and gap. A step, or a shift ('-1', '+1'). */
  spaceX?: StemSpaceValue
  /** Vertical padding. A step, or a shift ('-1', '+1'). */
  spaceY?: StemSpaceValue
  /** Squircle radius. A size, or a shift ('+1') from the size's own. */
  roundness?: StemSizeValue
  /** Pill: fully round ends, never a squircle. */
  rounded?: boolean
  /**
   * Trim the label by the font's side bearing on the side of an icon, and
   * give a side without one the air a Phosphor icon carries. `auto`
   * (default): both; `always`: also trims the bare sides by the bearing;
   * `never`: none. See src/css/scale.css.
   */
  opticalLabel?: StemOpticalLabel
}

/** The scale props once resolved: shifts settled into steps. */
export type StemScaleResolved = Omit<StemScaleProps, 'size' | 'roundness' | 'space' | 'spaceX' | 'spaceY'> & {
  size?: StemSize
  roundness?: StemSize
  space?: StemSpace
  spaceX?: StemSpace
  spaceY?: StemSpace
}

/** Defaults of the scale props: pass to withDefaults in every wrapper. */
export type StemOpticalLabel = 'auto' | 'always' | 'never'

/**
 * Defaults of the scale props: pass to withDefaults in every wrapper. All
 * undefined, so an absent prop stays absent (a boolean would turn false) and
 * useStemScale can take it from a parent.
 */
export const stemScaleDefaults = {
  size: undefined,
  textSize: undefined,
  iconSize: undefined,
  space: undefined,
  spaceX: undefined,
  spaceY: undefined,
  roundness: undefined,
  rounded: undefined,
  opticalLabel: undefined,
} as const

/** The mode of `optical-label`; the old boolean still reads: true → auto, false → never. */
export function stemOpticalMode(v: unknown): StemOpticalLabel {
  if (v === false || v === 'false') return 'never'
  return v === 'always' || v === 'never' ? v : 'auto'
}

/**
 * The optical label trim (src/css/scale.css), on a label slot. On the side
 * of an icon only: `iconStart` for an icon on its left, `iconEnd` for one on
 * its right (both, if both); the side facing the padding stays as it is.
 * `aloneStart` / `aloneEnd` for a side without an icon (the icon's air
 * added), `alone` for both.
 */
export const stemLabelShift = {
  iconStart: 'ms-[calc(var(--s-label-icon-start,0em)*-1)]',
  iconEnd: 'me-[calc(var(--s-label-icon-end,0em)*-1)]',
  aloneStart: 'ms-[calc(var(--s-label-alone-start,0em)*-1)]',
  aloneEnd: 'me-[calc(var(--s-label-alone-end,0em)*-1)]',
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
  // Marks a Stem control: themes that size bare Nuxt UI children (an alert's
  // or a toast's buttons) leave these alone.
  out.push('s-control')
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
export const stemScalePadding = 'px-[calc(var(--s-px)+var(--s-pill-x,0px))] py-(--s-py) gap-(--s-gap)'
export const stemScaleIcon = 'size-(--s-icon-size) shrink-0'

export function stemSizeClass(size: StemSize) {
  return `s-size-${size}`
}

const spacePx: Record<string, number> = {'0': 0, '2xs': 4, '2xl': 16, '3xl': 18, '4xl': 20, '5xl': 22}

/** A step of the space scale in px (0, 2xs 4, xs 6 … xl 14 … 5xl 22). */
export function stemSpacePx(v: StemSpace): number {
  return String(v) in spacePx ? spacePx[String(v)]! : stemScale[v as StemSize].space
}

/**
 * The scale as inline custom properties, for a root that already carries
 * another size class it cannot drop (an alert, whose theme gives toasts and
 * bare UAlerts a default): inline style beats any class.
 */
export function stemScaleVars(size: StemSize, p: StemScaleResolved): Record<string, string> {
  const base = stemScale[size]
  const sx = p.spaceX ?? p.space
  const sy = p.spaceY ?? p.space
  const icon = p.iconSize
    ? (isToken(p.iconSize) ? `${stemScale[p.iconSize].icon}px` : p.iconSize)
    : `${base.icon}px`
  return {
    '--s-text': `${stemScale[p.textSize ?? size].text}px`,
    '--s-icon-size': icon,
    '--s-px': `${sx != null ? stemSpacePx(sx as StemSpace) : base.space}px`,
    '--s-py': `${sy != null ? stemSpacePx(sy as StemSpace) : base.space}px`,
    '--s-gap': `${sx != null ? stemSpacePx(sx as StemSpace) : base.space}px`,
    '--s-radius': p.rounded ? '9999px' : `${stemScale[p.roundness ?? size].radius}px`,
    ...(p.rounded ? {'--s-corner-shape': 'round'} : {}),
    ...stemOpticalVars(stemOpticalMode(p.opticalLabel)),
  }
}

/** The optical label variables of a mode, inline (see stemScaleVars). */
function stemOpticalVars(mode: StemOpticalLabel): Record<string, string> {
  const start = 'var(--s-label-bearing-start)'
  const end = 'var(--s-label-bearing-end)'
  // A Phosphor icon's air inside its box, given to the sides without one.
  const air = 'var(--s-icon-size) * 0.09375'
  return {
    '--s-label-icon-start': mode === 'never' ? '0em' : start,
    '--s-label-icon-end': mode === 'never' ? '0em' : end,
    '--s-label-alone-start': mode === 'never' ? '0em' : mode === 'always' ? `calc(${start} - ${air})` : `calc(-1 * ${air})`,
    '--s-label-alone-end': mode === 'never' ? '0em' : mode === 'always' ? `calc(${end} - ${air})` : `calc(-1 * ${air})`,
  }
}
