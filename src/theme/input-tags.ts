import {inputBase, baseCompoundVariants, fixedSizeOverrides} from './input-commons'
import {fieldSizes, fieldIconCompounds} from './sizes'
import {stemScaleIcon, stemSizes} from './scale'

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

// A tag is exactly one line of the scale tall (no vertical padding), so a
// field with tags is as tall as an empty one.
const tagSize = {
  item: 'py-0 leading-(--s-icon-size) px-(--s-px) gap-(--s-gap)',
  itemDeleteIcon: stemScaleIcon,
}

export default {
  slots: {
    base: inputBase,
    trailingIcon: 'text-(--ui-text)!',
    item: 'rounded-full ring-0 font-normal bg-iron-400/20 text-muto-800 dark:text-muto-200',
    itemDelete: 'rounded-full cursor-pointer hover:bg-iron-400/30 text-muto-800 dark:text-muto-200 p-0',
    // The typing field takes the space left on the row, instead of its
    // intrinsic ~20ch that pushed it onto a second line.
    input: 'w-0 min-w-[4ch] leading-(--s-icon-size) h-(--s-icon-size) py-0',
  },
  compoundVariants: [...remappedBase, ...inputTagsFocusRing, ...fixedSizeOverrides, ...fieldIconCompounds],
  variants: {
    size: Object.fromEntries(stemSizes.map(k => [k, {...fieldSizes[k], ...tagSize}])),
  },
}
