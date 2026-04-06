export default {
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: {
        root: `
          text-white dark:text-stem-900
          bg-stem-900 dark:bg-stem-100
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: {
        root: `
          text-white dark:text-white
          bg-stem-600 dark:bg-stem-600
        `,
      },
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: {
        root: `
          text-(--ui-text) dark:text-iron-100
          bg-white dark:bg-iron-800
        `,
      },
    },
    {
      color: 'primary',
      variant: 'outline',
      class: {
        root: `
          text-stem-900 dark:text-stem-100
          ring-stem-900/25 dark:ring-stem-100/25
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: {
        root: `
          text-stem-600 dark:text-stem-400
          ring-iron-500/25 dark:ring-iron-400/25
        `,
      },
    },
    {
      color: 'primary',
      variant: 'soft',
      class: {
        root: `
          text-muto-800 dark:text-muto-200
          bg-iron-400/20
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: {
        root: `
          text-muto-800 dark:text-muto-200
          bg-iron-400/10
        `,
      },
    },
    {
      color: 'primary',
      variant: 'subtle',
      class: {
        root: `
          text-muto-800 dark:text-muto-200
          bg-iron-400/20
          ring-muto-500/30 dark:ring-muto-300/20
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class: {
        root: `
          text-muto-800 dark:text-muto-200
          bg-iron-400/10
          ring-muto-500/20 dark:ring-muto-300/15
        `,
      },
    },
  ],
}
