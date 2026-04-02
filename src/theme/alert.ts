export default {
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: {
        root: `
          text-white dark:text-slate-900
          bg-slate-900 dark:bg-slate-100
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: {
        root: `
          text-white dark:text-white
          bg-slate-600 dark:bg-slate-600
        `,
      },
    },
    {
      color: 'primary',
      variant: 'outline',
      class: {
        root: `
          text-slate-900 dark:text-slate-100
          ring-slate-900/25 dark:ring-slate-100/25
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: {
        root: `
          text-slate-600 dark:text-slate-400
          ring-slate-500/25 dark:ring-slate-400/25
        `,
      },
    },
    {
      color: 'primary',
      variant: 'soft',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-slate-400/20
        `,
      },
    },
    {
      color: 'neutral',
      variant: 'soft',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-slate-400/10
        `,
      },
    },
    {
      color: 'primary',
      variant: 'subtle',
      class: {
        root: `
          text-gray-800 dark:text-gray-200
          bg-slate-400/20
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
          bg-slate-400/10
          ring-gray-500/20 dark:ring-gray-300/15
        `,
      },
    },
  ],
}
