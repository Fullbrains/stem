import {inputBase, baseCompoundVariants, fixedSizeOverrides} from './input-commons'
import {fieldSizes, fieldIconCompounds} from './sizes'
import {stemSizes} from './scale'

// InputTags: the focus is on the inner input, so the ring reacts to
// has-focus-visible on the container: darker border, halo outside.
const inputTagsFocusRing = [
  {color: 'primary', variant: ['outline', 'subtle'], class: {base: 'has-focus-visible:ring-iron-500/80 has-focus-visible:shadow-[0_0_0_3.5px] has-focus-visible:shadow-iron-500/20'}},
  {color: 'error', variant: ['outline', 'subtle'], class: {base: 'has-focus-visible:ring-rose-500/80 has-focus-visible:shadow-[0_0_0_3.5px] has-focus-visible:shadow-rose-500/20'}},
  {color: 'success', variant: ['outline', 'subtle'], class: {base: 'has-focus-visible:ring-emerald-500/80 has-focus-visible:shadow-[0_0_0_3.5px] has-focus-visible:shadow-emerald-500/20'}},
]

// Remap focus-visible → has-focus-visible in baseCompoundVariants
const remappedBase = baseCompoundVariants.map((cv) => {
  if (cv.class && typeof cv.class === 'object' && 'base' in cv.class && typeof cv.class.base === 'string') {
    return {
      ...cv,
      class: {
        ...cv.class,
        base: cv.class.base
          .replace(/focus-visible:/g, 'has-focus-visible:')
          .replace(/focus:/g, 'has-focus:'),
      },
    }
  }
  return cv
})

// A tag is a rounded button of the field's size with an X on its right:
// the same text, icon, padding-x, gap, pill and label trim. Only its padding-y is
// smaller, two steps below the size (sm: 4px, so 24px in a 32px field), as a
// chip in a search bar; the field takes that much off its own padding-y
// (--s-tag-py), so it is as tall with tags as without. Literal per size, so
// Tailwind sees them.
//
// The X is an SButton of its own, icon only and rounded: the size below the
// tag's, space 2xs (sm: a 12px X in a 20px circle). It sits at the pill's
// round end, concentric with it: as far from the right edge as from the top
// and bottom (sm: 2px). Its X is a gap from the text, as a button's trailing
// icon. --s-tag-x: the X's icon; --s-tag-x-pad: the circle's padding.
const tagPy: Record<string, string> = {
  xs: '[--s-tag-py:0px] [--s-tag-x:8px] [--s-tag-x-pad:2px]',
  sm: '[--s-tag-py:4px] [--s-tag-x:12px] [--s-tag-x-pad:4px]',
  md: '[--s-tag-py:6px] [--s-tag-x:16px] [--s-tag-x-pad:4px]',
  lg: '[--s-tag-py:8px] [--s-tag-x:20px] [--s-tag-x-pad:4px]',
  xl: '[--s-tag-py:10px] [--s-tag-x:24px] [--s-tag-x-pad:4px]',
}

function tagSize(token: string) {
  return {
    root: tagPy[token]!,
    // A pill, compensated as a rounded button's (--s-pill-x, 8% of its
    // height): more padding-x, given back as a negative margin.
    // On the right the X's circle takes over: padding-right is its inset from
    // the pill's end, the gap is the button's less the circle's padding.
    item: 'py-(--s-tag-py) ps-[calc(var(--s-px)+(var(--s-icon-size)+2*var(--s-tag-py))*0.08)] ms-[calc((var(--s-icon-size)+2*var(--s-tag-py))*-0.08)] pe-[calc((var(--s-icon-size)+2*var(--s-tag-py)-var(--s-tag-x)-2*var(--s-tag-x-pad))/2)] gap-[calc(var(--s-gap)-var(--s-tag-x-pad))] text-(length:--s-text) leading-(--s-icon-size)',
    // As tall as the text's line in the flow (a negative margin-y), so the
    // circle does not make the tag taller.
    itemDelete: 'size-[calc(var(--s-tag-x)+2*var(--s-tag-x-pad))] -my-[calc((var(--s-tag-x)+2*var(--s-tag-x-pad)-var(--s-icon-size))/2)] justify-center shrink-0',
    itemDeleteIcon: 'size-(--s-tag-x) shrink-0',
  }
}

// The field gives the tags' padding-y back; the typing line is a tag's height.
const tagFieldCompounds = [
  {class: {base: 'py-[calc(var(--s-py)-var(--s-tag-py,0px))]!'}},
]

export default {
  slots: {
    base: inputBase,
    trailingIcon: 'text-(--ui-text)!',
    // As an SButton soft and rounded: always a pill, same tint and text.
    item: 'rounded-full ring-0 font-normal bg-iron-400/20 text-muto-800 dark:text-muto-200',
    // The label trim of a label with an icon on its right (stemLabelShift).
    itemText: 'ms-[calc(var(--s-label-alone-start,0em)*-1)] me-[calc(var(--s-label-icon-end,0em)*-1)]',
    itemDelete: 'rounded-full cursor-pointer hover:bg-iron-400/30 text-muto-800 dark:text-muto-200 p-0',
    // The typing field takes the space left on the row, instead of its
    // intrinsic ~20ch that pushed it onto a second line.
    // The optical label trim on the typed text, `alone` (its start only).
    input: 'w-0 min-w-[4ch] leading-(--s-icon-size) h-[calc(var(--s-icon-size)+2*var(--s-tag-py,0px))] py-0 ms-[calc(var(--s-label-alone-start,0em)*-1)]',
  },
  compoundVariants: [...remappedBase, ...inputTagsFocusRing, ...fixedSizeOverrides, ...fieldIconCompounds, ...tagFieldCompounds],
  variants: {
    size: Object.fromEntries(stemSizes.map(k => [k, {...fieldSizes[k], ...tagSize(k), root: `${fieldSizes[k].root} ${tagPy[k]}`}])),
  },
}
