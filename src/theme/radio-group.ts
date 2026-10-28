/** The checked radio in the product's primary, as the checkbox's
 (checkbox.ts) and the solid button's: Nuxt UI's `bg-primary` is the
 palette's middle grey, lighter than either. */
export default {
  slots: {
    base: 'cursor-pointer',
    label: 'cursor-pointer',
  },
  compoundVariants: [
    {
      color: 'primary',
      class: {
        indicator: 'bg-gray-800 dark:bg-stem-100',
        base: 'focus-visible:outline-iron-500',
      },
    },
  ],
}
