/**
 * Single source of truth for icon sizing across Stem.
 *
 * Icon size follows TEXT size: the default is `1em`, so an icon is always
 * proportional to the label beside it and a component that changes its text
 * scale carries its icons along. This works because the icon sets in use
 * (Phosphor, and the brand sets built on stroke weight rather than on
 * per-pixel grids) are drawn to scale.
 *
 * ⚠️ This reverses the fixed-pixel scale introduced in 353f242. That decision
 * assumed icon sets drawn for specific pixel sizes, where rendering at an
 * in-between size wastes the hinting; with scalable sets, following the text
 * is what keeps a button's icon and label optically paired at every size.
 *
 * The named scale survives for the cases that genuinely need a fixed size —
 * an icon standing alone, with no text to follow.
 */
export const iconSizeScale = {
  sm: '12px',
  md: '16px',
  lg: '20px',
  xl: '24px',
} as const

export type IconSizeToken = keyof typeof iconSizeScale

/** Public tokens, in ascending order. Excludes the `xs` compatibility alias. */
export const iconSizeTokens = Object.keys(iconSizeScale) as IconSizeToken[]

/**
 * Every size key a component may receive, including the `xs` alias.
 * Use this when building Tailwind Variants `size` maps.
 */
export const iconSizes = {
  xs: iconSizeScale.sm,
  ...iconSizeScale,
} as const

/**
 * Components size their icons off the `--s-icon-size` custom property rather
 * than a hardcoded `size-*` class, so a single declaration on the root cascades
 * to leading icon, trailing icon and spinner together — and can be overridden
 * per instance via the `iconSize` prop.
 */
export const iconSizeVar = '--s-icon-size'

/** The default: an icon is as tall as one em of the text beside it. */
export const iconSizeDefault = '1em'

/** Class that makes an element read its dimensions from `--s-icon-size`. */
export const iconSizeClass = 'size-(--s-icon-size) shrink-0'

/**
 * Declares `--s-icon-size` on a component root, as a Tailwind arbitrary
 * property. Called with no argument it declares the `1em` default, which is
 * what every size variant does: the icon then tracks that variant's text.
 */
export function iconSizeFor(size?: keyof typeof iconSizes): string {
  const value = size ? iconSizes[size] : iconSizeDefault
  return `[${iconSizeVar}:${value}]`
}

/**
 * Resolves an `iconSize` prop to a CSS length.
 *
 * Accepts either a scale token (`'lg'`) or any CSS length (`'1.5em'`, `'20px'`,
 * `'var(--x)'`), so callers can stay on the scale by default and step off it
 * when a specific instance genuinely needs to.
 */
export function resolveIconSize(value: string | undefined): string | undefined {
  if (!value) return undefined
  return value in iconSizes ? iconSizes[value as keyof typeof iconSizes] : value
}

/** Inline style that overrides `--s-icon-size`, or undefined when unset. */
export function iconSizeStyle(value: string | undefined): Record<string, string> | undefined {
  const resolved = resolveIconSize(value)
  return resolved ? {[iconSizeVar]: resolved} : undefined
}
