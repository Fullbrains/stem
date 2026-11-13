/**
 * One source for the look of an alert, inline (UAlert) or arriving as a
 * toast (UToast): the box, the type, the close pill and the color × variant
 * classes. `alert.ts` and `toast.ts` are both built from here, so the two
 * cannot drift apart.
 *
 * Variants:
 * - `outline`: the surface (white in light mode) with a ring and the color in
 *   the icon only. It is what a toast is: the toast is this, floating.
 * - `soft`: a tinted ground, no ring.
 * - `subtle`: the tinted ground with a ring.
 * - `solid`: the color as ground, white text (dark text on warning).
 *
 * Text stays the default text color on outline, soft and subtle, so the
 * description reads at AA on every tint; the color lives in the icon, the
 * ground and the ring. Tones follow SHint: info is sky, the others the
 * theme's own (success, warning, error).
 */

export const alertSlots = {
  root: 's-corner [--s-radius:10px] p-3.5 gap-3',
  wrapper: 'min-w-0 flex-1 flex flex-col',
  title: 'text-sm font-medium',
  description: 'text-sm opacity-100',
  icon: 'shrink-0 size-5',
  // The actions are UButtons Nuxt UI renders from `actions`, so a toast
  // cannot hand them SButton props: they are made SButton `sm rounded compact`
  // here, whatever size an action asks for. The close pill is left alone.
  actions: `
    flex flex-wrap gap-1.5 shrink-0
    [&>button:not([data-slot=close])]:text-sm
    [&>button:not([data-slot=close])]:rounded-full!
    [&>button:not([data-slot=close])]:[corner-shape:initial]!
    [&>button:not([data-slot=close])]:py-[0.25em]!
    [&>button:not([data-slot=close])]:px-[0.65em]!
    [&>button:not([data-slot=close])]:min-h-[calc(1lh+0.5em)]!
  `,
  // The X is an action too: SButton `sm rounded compact soft`, the same pill
  // as the actions beside it, with a 1em icon.
  close: `
    text-sm min-h-[calc(1lh+0.5em)]! py-[0.25em]! px-[0.65em]!
    rounded-full! [corner-shape:initial]!
    bg-iron-400/20 hover:bg-iron-400/30 active:bg-iron-400/20
    text-muto-800 dark:text-muto-200 hover:text-muto-800 dark:hover:text-muto-200
    [&_[data-slot=leadingIcon]]:size-[1em]
  `,
}

// Icon, actions and X line up with the title, never with the middle of the
// box: everything starts at the top. The icon (20px) is as tall as the
// title's line; the buttons (27px) overhang it by 3.5px above and below, so
// they sit centred on it without making a one-line alert taller. In
// `vertical` the X keeps the `horizontal` classes (Nuxt UI renders it there).
export const alertOrientation = {
  horizontal: {root: 'items-start', actions: 'items-start -my-[3.5px]'},
  vertical: {root: 'items-start', actions: 'items-start mt-3'},
}

export type AlertColor = 'primary' | 'secondary' | 'neutral' | 'info' | 'success' | 'warning' | 'error'
export type AlertVariant = 'solid' | 'outline' | 'soft' | 'subtle'

type Tone = {
  /** Icon color on outline / soft / subtle. */
  icon: string
  /**
   * Tint of soft and subtle, as a gradient laid over the opaque surface
   * (`bg-default`): a toast floats over content and must not let it through.
   */
  tint: string
  /** Ring of outline and subtle. */
  ring: string
  /** Ground and text of solid. */
  solid: string
  /** Text color of solid, for title and description. */
  onSolid: string
  /** The close pill on solid: the iron pill would vanish on a colored ground. */
  closeSolid: string
}

const tones: Record<AlertColor, Tone> = {
  primary: {
    icon: 'text-gray-800 dark:text-stem-100',
    tint: 'from-iron-400/12 to-iron-400/12',
    ring: 'ring-gray-800/20 dark:ring-stem-100/20',
    solid: 'bg-gray-800 dark:bg-stem-100',
    onSolid: 'text-white dark:text-stem-900',
    closeSolid: 'bg-white/20 hover:bg-white/30 active:bg-white/20 text-white hover:text-white dark:bg-stem-900/10 dark:hover:bg-stem-900/15 dark:text-stem-900 dark:hover:text-stem-900',
  },
  secondary: {
    icon: 'text-iron-600 dark:text-iron-300',
    tint: 'from-iron-400/6 to-iron-400/6',
    ring: 'ring-iron-500/25 dark:ring-iron-400/25',
    solid: 'bg-white dark:bg-iron-800',
    onSolid: 'text-(--ui-text) dark:text-iron-100',
    closeSolid: '',
  },
  neutral: {
    icon: 'text-muted',
    tint: 'from-iron-400/6 to-iron-400/6',
    ring: 'ring-iron-500/25 dark:ring-iron-400/25',
    solid: 'bg-stem-600',
    onSolid: 'text-white',
    closeSolid: 'bg-white/20 hover:bg-white/30 active:bg-white/20 text-white hover:text-white dark:text-white dark:hover:text-white',
  },
  info: {
    icon: 'text-sky-700 dark:text-sky-400',
    tint: 'from-sky-500/5 to-sky-500/5',
    ring: 'ring-sky-600/25 dark:ring-sky-400/25',
    solid: 'bg-sky-700 dark:bg-sky-600',
    onSolid: 'text-white',
    closeSolid: 'bg-white/20 hover:bg-white/30 active:bg-white/20 text-white hover:text-white dark:text-white dark:hover:text-white',
  },
  success: {
    icon: 'text-(--ui-color-success-700) dark:text-(--ui-success)',
    tint: 'from-(--ui-color-success-500)/5 to-(--ui-color-success-500)/5',
    ring: 'ring-(--ui-color-success-600)/25 dark:ring-(--ui-color-success-400)/25',
    solid: 'bg-(--ui-color-success-700) dark:bg-(--ui-color-success-600)',
    onSolid: 'text-white',
    closeSolid: 'bg-white/20 hover:bg-white/30 active:bg-white/20 text-white hover:text-white dark:text-white dark:hover:text-white',
  },
  warning: {
    icon: 'text-(--ui-color-warning-700) dark:text-(--ui-warning)',
    tint: 'from-(--ui-color-warning-500)/7 to-(--ui-color-warning-500)/7',
    ring: 'ring-(--ui-color-warning-600)/30 dark:ring-(--ui-color-warning-400)/25',
    solid: 'bg-(--ui-color-warning-400)',
    onSolid: 'text-(--ui-color-warning-950)',
    closeSolid: 'bg-black/10 hover:bg-black/15 active:bg-black/10 text-(--ui-color-warning-950) hover:text-(--ui-color-warning-950) dark:text-(--ui-color-warning-950) dark:hover:text-(--ui-color-warning-950)',
  },
  error: {
    icon: 'text-(--ui-color-error-600) dark:text-(--ui-error)',
    tint: 'from-(--ui-color-error-500)/5 to-(--ui-color-error-500)/5',
    ring: 'ring-(--ui-color-error-600)/25 dark:ring-(--ui-color-error-400)/25',
    solid: 'bg-(--ui-color-error-600)',
    onSolid: 'text-white',
    closeSolid: 'bg-white/20 hover:bg-white/30 active:bg-white/20 text-white hover:text-white dark:text-white dark:hover:text-white',
  },
}

export const alertColors = Object.keys(tones) as AlertColor[]
export const alertVariants: AlertVariant[] = ['outline', 'soft', 'subtle', 'solid']

type SlotClasses = {root: string, icon: string, title: string, description: string, close?: string}

const text = {title: 'text-highlighted', description: 'text-muted'}

/** The slot classes of one color × variant, for UAlert and UToast alike. */
export function alertClasses(color: AlertColor, variant: AlertVariant): SlotClasses {
  const t = tones[color]
  switch (variant) {
    case 'outline':
      return {root: `bg-default bg-none ring ring-inset ${t.ring}`, icon: t.icon, ...text}
    case 'soft':
      return {root: `bg-default bg-linear-to-b ${t.tint} ring-0`, icon: t.icon, ...text}
    case 'subtle':
      return {root: `bg-default bg-linear-to-b ${t.tint} ring ring-inset ${t.ring}`, icon: t.icon, ...text}
    case 'solid':
      return {
        root: `${t.solid} bg-none ${t.onSolid} ring-0`,
        icon: t.onSolid,
        title: t.onSolid,
        description: `${t.onSolid} opacity-90`,
        close: t.closeSolid,
      }
  }
}
