import {sizes} from './sizes'

export const inputBase = 'placeholder:text-smut-500/80 placeholder:select-none rounded-[6px] py-[0.5em]! transition duration-200'

export const inputSlots = {
  base: inputBase,
  leading: 'ml-[0.1em]!',
  trailing: 'mr-[0.1em]!',
  trailingIcon: 'text-(--ui-text)!',
}

export const outlineCommons: string = `
  border
  ring-0!
`

// shared by all components (input, select, textarea, etc.)
export const baseCompoundVariants = [
  // color-only (icons + placeholder, inherited by all variants)
  {
    color: 'primary',
    class: {
      base: 'placeholder:text-smut-500/80',
      leadingIcon: 'text-smut-500/80',
    },
  },
  {
    color: 'error',
    class: {
      base: 'placeholder:text-rose-500/80',
      leadingIcon: 'text-rose-500/80',
      trailingIcon: 'text-rose-500/80!',
    },
  },
  {
    color: 'success',
    class: {
      base: 'placeholder:text-emerald-500/80',
      leadingIcon: 'text-emerald-500/80',
      trailingIcon: 'text-emerald-500/80!',
    },
  },
  // outline (border + bg, no focus ring)
  {
    color: 'primary',
    variant: 'outline',
    class: {
      base: `${outlineCommons}
        border-smut-500/30 hover:not-focus:not-disabled:border-smut-500/50`,
    },
  },
  {
    color: 'error',
    variant: 'outline',
    class: {
      base: `${outlineCommons}
        border-rose-500/30 hover:not-focus:not-disabled:border-rose-500/50`,
    },
  },
  {
    color: 'success',
    variant: 'outline',
    class: {
      base: `${outlineCommons}
        border-emerald-500/30 hover:not-focus:not-disabled:border-emerald-500/50`,
    },
  },
  // soft
  {
    color: 'primary',
    variant: 'soft',
    class: {
      base: 'bg-smut-500/10 hover:not-disabled:bg-smut-500/15 focus-visible:bg-smut-500/15',
    },
  },
  {
    color: 'error',
    variant: 'soft',
    class: {
      base: 'bg-rose-500/10 hover:not-disabled:bg-rose-500/15 focus-visible:bg-rose-500/15',
    },
  },
  {
    color: 'success',
    variant: 'soft',
    class: {
      base: 'bg-emerald-500/10 hover:not-disabled:bg-emerald-500/15 focus-visible:bg-emerald-500/15',
    },
  },
  // subtle (border + bg, no focus ring)
  {
    color: 'primary',
    variant: 'subtle',
    class: {
      base: `${outlineCommons}
        bg-smut-500/5 hover:not-disabled:bg-smut-500/10 focus-visible:bg-smut-500/5
        border-smut-500/30 hover:not-focus:not-disabled:border-smut-500/50`,
    },
  },
  {
    color: 'error',
    variant: 'subtle',
    class: {
      base: `${outlineCommons}
        bg-rose-500/5 hover:not-disabled:bg-rose-500/10 focus-visible:bg-rose-500/5
        border-rose-500/30 hover:not-focus:not-disabled:border-rose-500/50`,
    },
  },
  {
    color: 'success',
    variant: 'subtle',
    class: {
      base: `${outlineCommons}
        bg-emerald-500/5 hover:not-disabled:bg-emerald-500/10 focus-visible:bg-emerald-500/5
        border-emerald-500/30 hover:not-focus:not-disabled:border-emerald-500/50`,
    },
  },
  // ghost
  {
    color: 'primary',
    variant: 'ghost',
    class: {
      base: 'bg-transparent hover:not-disabled:bg-smut-500/10 focus-visible:bg-smut-500/10',
    },
  },
  {
    color: 'error',
    variant: 'ghost',
    class: {
      base: 'bg-transparent hover:not-disabled:bg-rose-500/10 focus-visible:bg-rose-500/10',
    },
  },
  {
    color: 'success',
    variant: 'ghost',
    class: {
      base: 'bg-transparent hover:not-disabled:bg-emerald-500/10 focus-visible:bg-emerald-500/10',
    },
  },
]

// focus ring for inputs only (focus-visible on the element itself)
export const inputFocusRing = [
  {
    color: 'primary',
    variant: ['outline', 'subtle'],
    class: {base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-smut-500/80 focus-visible:shadow-smut-500/20'},
  },
  {
    color: 'error',
    variant: ['outline', 'subtle'],
    class: {base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-rose-500/80 focus-visible:shadow-rose-500/20'},
  },
  {
    color: 'success',
    variant: ['outline', 'subtle'],
    class: {base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-emerald-500/80 focus-visible:shadow-emerald-500/20'},
  },
]

// Neutralize Nuxt UI's default `fixed: false` compoundVariants that add
// responsive `md:text-*` classes and override our size variants on desktop.
const fixedSizeOverrides = [
  {fixed: false, size: 'xs', class: 'md:text-xs'},
  {fixed: false, size: 'sm', class: 'md:text-sm'},
  {fixed: false, size: 'md', class: 'md:text-base'},
  {fixed: false, size: 'lg', class: 'md:text-lg'},
]

export const inputCompoundVariants = [...baseCompoundVariants, ...inputFocusRing, ...fixedSizeOverrides]

export const inputVariants = {
  leading: {
    false: {base: 'pl-2.5!'},
  },
  trailing: {
    false: {base: 'pr-2.5!'},
  },
  size: sizes,
}
