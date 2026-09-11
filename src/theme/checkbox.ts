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
