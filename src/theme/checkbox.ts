export default {
  slots: {
    base: 'cursor-pointer',
    label: 'cursor-pointer',
  },
  compoundVariants: [
    {
      color: 'primary',
      class: {
        indicator: 'bg-stem-900 dark:bg-stem-100',
        base: 'focus-visible:outline-iron-500',
      },
    },
  ],
}
