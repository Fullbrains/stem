/**
 * Single source of truth for icon sizing across Stem.
 *
 * Icon size is decoupled from the component's text size: a size token maps to
 * a fixed pixel value, not to a multiple of the font size. This is deliberate —
 * an icon next to `text-base` is not always meant to be 16px, and expressing
 * icon size in `em` made every component drift as soon as its text scale moved.
 *
 * The scale is sm/md/lg/xl. `xs` is not part of the public scale but is kept as
 * an alias of `sm` so that `size="xs"`, which Nuxt UI still accepts, never ends
 * up with no icon class at all.
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

/** Class that makes an element read its dimensions from `--s-icon-size`. */
export const iconSizeClass = 'size-(--s-icon-size) shrink-0'

/** Sets `--s-icon-size` for a given size token, as a Tailwind arbitrary property. */
export function iconSizeFor(size: keyof typeof iconSizes): string {
  return `[${iconSizeVar}:${iconSizes[size]}]`
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
