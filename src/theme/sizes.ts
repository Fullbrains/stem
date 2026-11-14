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
    // A pill's extra padding comes back as a negative margin (--s-pill-x):
    // its content lines up with a squircle's, its ends spill over the sides.
    base: `${stemSizeClass(token)} ${stemScaleText} ${stemScalePadding} mx-[calc(var(--s-pill-x,0px)*-1)]`,
    leadingIcon: stemScaleIcon,
    trailingIcon: stemScaleIcon,
  }
}

function fieldSize(token: StemSize) {
  return {
    // The pill's negative margin goes on the root, the field's box.
    root: `${stemSizeClass(token)} mx-[calc(var(--s-pill-x,0px)*-1)]`,
    base: `${stemScaleText} px-[calc(var(--s-px)+var(--s-pill-x,0px))]! py-(--s-py)! gap-(--s-gap)`,
    leading: 'ps-[calc(var(--s-px)+var(--s-pill-x,0px))]!',
    trailing: 'pe-[calc(var(--s-px)+var(--s-pill-x,0px))]!',
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
  {leading: true, class: {base: 'ps-[calc(var(--s-px)+var(--s-pill-x,0px)+var(--s-icon-size)+var(--s-gap))]!'}},
  {trailing: true, class: {base: 'pe-[calc(var(--s-px)+var(--s-pill-x,0px)+var(--s-icon-size)+var(--s-gap))]!'}},
]

/**
 * The optical label trim on a field's text, on its start (the end of a field
 * is not the text's): its padding-left less the letter's air after a leading
 * icon (`icon`), or with none (`alone`, always mode only). After fieldIconCompounds, so they win.
 */
export const fieldLabelCompounds = [
  {class: {base: 'ps-[calc(var(--s-px)+var(--s-pill-x,0px)-var(--s-label-alone-start,0em))]!'}},
  {leading: true, class: {base: 'ps-[calc(var(--s-px)+var(--s-pill-x,0px)+var(--s-icon-size)+var(--s-gap)-var(--s-label-icon-start,0em))]!'}},
]
