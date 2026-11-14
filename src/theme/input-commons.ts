import {fieldSizes, fieldIconCompounds} from './sizes'

// `outline-none`: Nuxt UI v4.10 moved input focus onto `focus-visible:outline`
// on top of the existing ring. Stem draws its focus as an inset ring (see
// inputFocusRing below), so we suppress Nuxt UI's outline to avoid a double ring.
// Radius, padding and text come from the Stem scale (sizes.ts).
export const inputBase = 'placeholder:text-iron-500/80 placeholder:select-none s-corner transition duration-200 outline-none'

// Single-line fields: the browser gives an <input> at least the font's
// natural line height (~1.2em), taller than the scale's leading at xs. The
// height is set outright: icon + 2 × padding-y, like a button.
export const singleLineHeight = 'h-[calc(var(--s-icon-size)+2*var(--s-py))]'

export const inputSlots = {
  base: inputBase,
  trailingIcon: 'text-(--ui-text)!',
}

// The border is an inset ring, and so is the focus: neither adds a pixel to
// the field, so a field is exactly as tall as a button of the same size.
export const outlineCommons: string = `
  border-0
  ring-1 ring-inset
`

// shared by all components (input, select, textarea, etc.)
export const baseCompoundVariants = [
  // color-only (icons + placeholder, inherited by all variants)
  {
    color: 'primary',
    class: {
      base: 'placeholder:text-iron-500/80',
      leadingIcon: 'text-iron-500/80',
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
        ring-iron-500/30 hover:not-focus:not-disabled:ring-iron-500/50`,
    },
  },
  {
    color: 'error',
    variant: 'outline',
    class: {
      base: `${outlineCommons}
        ring-rose-500/30 hover:not-focus:not-disabled:ring-rose-500/50`,
    },
  },
  {
    color: 'success',
    variant: 'outline',
    class: {
      base: `${outlineCommons}
        ring-emerald-500/30 hover:not-focus:not-disabled:ring-emerald-500/50`,
    },
  },
  // soft
  {
    color: 'primary',
    variant: 'soft',
    class: {
      base: 'bg-iron-500/10 hover:not-disabled:bg-iron-500/15 focus-visible:bg-iron-500/15',
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
        bg-iron-500/5 hover:not-disabled:bg-iron-500/10 focus-visible:bg-iron-500/5
        ring-iron-500/30 hover:not-focus:not-disabled:ring-iron-500/50`,
    },
  },
  {
    color: 'error',
    variant: 'subtle',
    class: {
      base: `${outlineCommons}
        bg-rose-500/5 hover:not-disabled:bg-rose-500/10 focus-visible:bg-rose-500/5
        ring-rose-500/30 hover:not-focus:not-disabled:ring-rose-500/50`,
    },
  },
  {
    color: 'success',
    variant: 'subtle',
    class: {
      base: `${outlineCommons}
        bg-emerald-500/5 hover:not-disabled:bg-emerald-500/10 focus-visible:bg-emerald-500/5
        ring-emerald-500/30 hover:not-focus:not-disabled:ring-emerald-500/50`,
    },
  },
  // ghost
  {
    color: 'primary',
    variant: 'ghost',
    class: {
      base: 'bg-transparent hover:not-disabled:bg-iron-500/10 focus-visible:bg-iron-500/10',
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

// Focus for inputs (focus-visible on the element itself): the 1px inset
// border darkens and a 3.5px halo appears outside. A box-shadow, so neither
// changes the field's size.
export const inputFocusRing = [
  {
    color: 'primary',
    variant: ['outline', 'subtle'],
    class: {base: 'focus-visible:ring-iron-500/80 focus-visible:shadow-[0_0_0_3.5px] focus-visible:shadow-iron-500/20'},
  },
  {
    color: 'error',
    variant: ['outline', 'subtle'],
    class: {base: 'focus-visible:ring-rose-500/80 focus-visible:shadow-[0_0_0_3.5px] focus-visible:shadow-rose-500/20'},
  },
  {
    color: 'success',
    variant: ['outline', 'subtle'],
    class: {base: 'focus-visible:ring-emerald-500/80 focus-visible:shadow-[0_0_0_3.5px] focus-visible:shadow-emerald-500/20'},
  },
]

// Neutralize Nuxt UI's default `fixed: false` compoundVariants that add
// responsive `md:text-*` classes and override the scale's text on desktop.
export const fixedSizeOverrides = [
  {fixed: false, class: {base: 'md:text-(length:--s-text)'}},
]

export const inputCompoundVariants = [...baseCompoundVariants, ...inputFocusRing, ...fixedSizeOverrides, ...fieldIconCompounds]

export const inputVariants = {
  size: fieldSizes,
}
