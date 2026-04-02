import {inputBase, baseCompoundVariants, outlineCommons} from './input-commons'
import {sizes} from './sizes'

// InputTags uses has-focus-visible (focus is on inner input, not root)
const inputTagsFocusRing = [
  {
    color: 'primary',
    variant: ['outline', 'subtle'],
    class: {base: 'has-focus-visible:shadow-[0_0_0_3.5px]! has-focus:border-slate-500/80 has-focus-visible:shadow-slate-500/20'},
  },
  {
    color: 'error',
    variant: ['outline', 'subtle'],
    class: {base: 'has-focus-visible:shadow-[0_0_0_3.5px]! has-focus:border-rose-500/80 has-focus-visible:shadow-rose-500/20'},
  },
  {
    color: 'success',
    variant: ['outline', 'subtle'],
    class: {base: 'has-focus-visible:shadow-[0_0_0_3.5px]! has-focus:border-emerald-500/80 has-focus-visible:shadow-emerald-500/20'},
  },
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

const fixedSizeOverrides = [
  {fixed: false, size: 'xs', class: 'md:text-xs'},
  {fixed: false, size: 'sm', class: 'md:text-sm'},
  {fixed: false, size: 'md', class: 'md:text-base'},
  {fixed: false, size: 'lg', class: 'md:text-lg'},
]

export default {
  slots: {
    base: inputBase,
    leading: 'ml-[0.1em]!',
    trailing: 'mr-[0.1em]!',
    trailingIcon: 'text-(--ui-text)!',
    item: 'rounded-full ring-0 pl-[0.6em] leading-none pr-[3px] py-0.5 gap-[0.25em] font-normal bg-slate-400/20 text-gray-800 dark:text-gray-200',
    itemDelete: 'rounded-full cursor-pointer hover:bg-slate-400/30 text-gray-800 dark:text-gray-200 p-0.5',
  },
  compoundVariants: [...remappedBase, ...inputTagsFocusRing, ...fixedSizeOverrides],
  variants: {
    leading: {
      false: {base: 'pl-2.5!'},
    },
    trailing: {
      false: {base: 'pr-2.5!'},
    },
    size: {
      xs: {...sizes.xs, item: 'text-xs', itemDeleteIcon: 'size-3'},
      sm: {...sizes.sm, item: 'text-sm', itemDeleteIcon: 'size-3.5'},
      md: {...sizes.md, item: 'text-base', itemDeleteIcon: 'size-4'},
      lg: {...sizes.lg, item: 'text-lg', itemDeleteIcon: 'size-4.5'},
      xl: {...sizes.xl, item: 'text-xl', itemDeleteIcon: 'size-5'},
    },
  },
}
