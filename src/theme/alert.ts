export default {
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: {
        root: `
          text-white dark:text-smut-900
          bg-smut-900 dark:bg-smut-100
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: {
        root: `
          text-white dark:text-white
          bg-smut-600 dark:bg-smut-600
        `,
      },
    },
    {
      color: 'primary',
      variant: 'outline',
      class: {
        root: `
          text-smut-900 dark:text-smut-100
          ring-smut-900/25 dark:ring-smut-100/25
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: {
        root: `
          text-smut-600 dark:text-smut-400
          ring-smut-500/25 dark:ring-smut-400/25
        `,
      },
    },
    {
      color: 'primary',
      variant: 'soft',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-smut-400/20
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-smut-400/10
        `,
      },
    },
    {
      color: 'primary',
      variant: 'subtle',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-smut-400/20
          ring-gray-500/30 dark:ring-gray-300/20
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-smut-400/10
          ring-gray-500/20 dark:ring-gray-300/15
        `,
      },
    },
  ],
}
