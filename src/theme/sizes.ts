import {stemScaleIcon, stemScalePadding, stemScaleText, stemSizeClass, stemSizes, type StemSize} from './scale'

/**
 * Size variants built on the Stem scale (see scale.ts).
 *
 * `sizes`: for components whose root element holds the text — UButton,
 * UBadge, USelect, USelectMenu (their `base` is the root).
 *
 * `fieldSizes`: for components with a `root` wrapping the field — UInput,
 * UTextarea, UInputMenu, UInputTags. The scale is declared on `root`, where
 * the wrapper's classes land too, and read on `base`, which inherits it.
 *
 * Paddings carry `!`: Nuxt UI's own size and leading/trailing compound
 * variants (`ps-9`, `py-1.5`…) would otherwise win on some of them.
 */
function size(token: StemSize) {
  return {
    base: `${stemSizeClass(token)} ${stemScaleText} ${stemScalePadding}`,
    leadingIcon: stemScaleIcon,
    trailingIcon: stemScaleIcon,
  }
}

function fieldSize(token: StemSize) {
  return {
    root: stemSizeClass(token),
    base: `${stemScaleText} px-(--s-px)! py-(--s-py)! gap-(--s-gap)`,
    leading: 'ps-(--s-px)!',
    trailing: 'pe-(--s-px)!',
    leadingIcon: stemScaleIcon,
    trailingIcon: stemScaleIcon,
  }
}

export const sizes = Object.fromEntries(stemSizes.map(s => [s, size(s)])) as Record<StemSize, ReturnType<typeof size>>

export const fieldSizes = Object.fromEntries(stemSizes.map(s => [s, fieldSize(s)])) as Record<StemSize, ReturnType<typeof fieldSize>>

/**
 * With an icon inside the field, the text starts after it: padding + icon +
 * gap, the same distance as in a button, measured on the icon's box.
 * Compound variants, not variants:
 * they come after the size's `px-(--s-px)!`, which tailwind-merge would
 * otherwise let win over an earlier `ps-*`.
 */
export const fieldIconCompounds = [
  {leading: true, class: {base: 'ps-[calc(var(--s-px)+var(--s-icon-size)+var(--s-gap))]!'}},
  {trailing: true, class: {base: 'pe-[calc(var(--s-px)+var(--s-icon-size)+var(--s-gap))]!'}},
]

/**
 * The optical label shift on a field's text (stemLabelShift): its
 * padding-left, with or without a leading icon, less the shift. Only on
 * fields with an edge; after fieldIconCompounds, so they win.
 */
const fieldEdged = ['outline', 'soft', 'subtle']
export const fieldLabelCompounds = [
  {variant: fieldEdged, class: {base: 'ps-[calc(var(--s-px)-var(--s-label-shift,0em))]!'}},
  {variant: fieldEdged, leading: true, class: {base: 'ps-[calc(var(--s-px)+var(--s-icon-size)+var(--s-gap)-var(--s-label-shift,0em))]!'}},
]
