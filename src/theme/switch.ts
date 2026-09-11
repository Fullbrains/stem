export default {
  slots: {
    base: 'cursor-pointer',
  },
  compoundVariants: [
    {
      color: 'primary',
      class: {
        base: 'data-[state=checked]:bg-gray-800 dark:data-[state=checked]:bg-stem-100 focus-visible:outline-iron-500',
      },
    },
  ],
}
