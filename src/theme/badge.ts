export default {
  slots: {
    base: 'rounded-full',
  },
  variants: {
    size: {
      xs: {
        base: 'rounded-full text-xs px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-3',
        trailingIcon: 'size-3',
      },
      sm: {
        base: 'rounded-full text-sm px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-3.5',
        trailingIcon: 'size-3.5',
      },
      md: {
        base: 'rounded-full text-base px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-4',
        trailingIcon: 'size-4',
      },
      lg: {
        base: 'rounded-full text-lg px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-4.5',
        trailingIcon: 'size-4.5',
      },
      xl: {
        base: 'rounded-full text-xl px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-5',
        trailingIcon: 'size-5',
      },
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: `
        text-white dark:text-slate-900
        bg-slate-900 dark:bg-slate-100
      `,
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: `
        text-white dark:text-white
        bg-slate-600 dark:bg-slate-600
      `,
    },
    {
      color: 'primary',
      variant: 'outline',
      class: `
        text-slate-900 dark:text-slate-100
        ring-slate-900/50 dark:ring-slate-100/50
      `,
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: `
        text-slate-600 dark:text-slate-400
        ring-slate-500/30 dark:ring-slate-400/30
      `,
    },
    {
      color: ['primary', 'neutral'],
      variant: 'soft',
      class: `
        text-gray-800 dark:text-gray-200
        bg-slate-400/20
      `,
    },
    {
      color: ['primary', 'neutral'],
      variant: 'subtle',
      class: `
        text-gray-800 dark:text-gray-200
        bg-slate-400/20
        ring-gray-500/30 dark:ring-gray-300/20
      `,
    },
  ],
}
