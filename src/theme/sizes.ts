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

/**
 * A one-line <input> sets its text as a button's label does: the text's own
 * box (line-height normal, Vimana's 1.25em) centred in the field. A button
 * places it at (height − box) / 2 rounded DOWN to the screen's pixel; an
 * <input> centres it itself and rounds UP, so where that half is not on a
 * pixel (sm 7.25, lg 12.75; xs 4.5 at 1x) the input's text sat lower. So
 * the input gets no centring to do: padding-top is that half, rounded down
 * to the device pixel (--s-line-top, src/css/scale.css), the content box
 * exactly the text's, and padding-bottom the rest (--s-line-bottom) — the
 * field's height the same.
 *
 * `s-line-text` declares the two variables from the field's height
 * (--s-line-h: icon + 2 × padding-y, unless set). They need CSS round() and
 * the lh unit: without them the input keeps no padding-y and the browser
 * centres its text, as before. Also on Stem's own bare inputs (the search
 * bar's, the color picker's).
 */
// Written out in full: Tailwind reads the classes from this source.
export const singleLineText = 's-line-text py-0! supports-[padding:round(down,1lh,1px)]:leading-[normal]! supports-[padding:round(down,1lh,1px)]:pt-(--s-line-top)! supports-[padding:round(down,1lh,1px)]:pb-(--s-line-bottom)!'

/** After the size variants, so it wins over py-(--s-py)!. */
export const singleLineFieldCompounds = [
  {class: {base: singleLineText}},
]
