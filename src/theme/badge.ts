export default {
  slots: {
    base: 'rounded-full font-normal',
  },
  variants: {
    size: {
      xs: {
        base: 'rounded-full text-xs px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-3 shrink-0',
        trailingIcon: 'size-3 shrink-0',
      },
      sm: {
        base: 'rounded-full text-sm px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-3.5 shrink-0',
        trailingIcon: 'size-3.5 shrink-0',
      },
      md: {
        base: 'rounded-full text-base px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-4 shrink-0',
        trailingIcon: 'size-4 shrink-0',
      },
      lg: {
        base: 'rounded-full text-lg px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-4.5 shrink-0',
        trailingIcon: 'size-4.5 shrink-0',
      },
      xl: {
        base: 'rounded-full text-xl px-[0.75em] py-[0.35em] gap-[0.5em]',
        leadingIcon: 'size-5 shrink-0',
        trailingIcon: 'size-5 shrink-0',
      },
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: `
        text-white dark:text-smut-900
        bg-smut-900 dark:bg-smut-100
      `,
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: `
        text-white dark:text-white
        bg-smut-600 dark:bg-smut-600
      `,
    },
    {
      color: 'primary',
      variant: 'outline',
      class: `
        text-smut-900 dark:text-smut-100
        ring-smut-900/50 dark:ring-smut-100/50
      `,
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: `
        text-smut-600 dark:text-smut-400
        ring-smut-500/30 dark:ring-smut-400/30
      `,
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: `
        text-(--ui-text) dark:text-smut-100
        bg-white dark:bg-smut-800
      `,
    },
    {
      color: 'error',
      variant: 'solid',
      class: `
        bg-rose-600 dark:bg-rose-600
      `,
    },
    {
      color: ['primary', 'neutral', 'secondary'],
      variant: 'soft',
      class: `
        text-gray-800 dark:text-gray-200
        bg-smut-400/20
      `,
    },
    {
      color: ['primary', 'neutral'],
      variant: 'subtle',
      class: `
        text-gray-800 dark:text-gray-200
        bg-smut-400/20
        ring-gray-500/30 dark:ring-gray-300/20
      `,
    },
    {
      color: 'secondary',
      variant: 'subtle',
      class: `
        text-(--ui-text) dark:text-smut-100
        bg-white dark:bg-smut-800
        ring-inset ring-(--ui-border)
      `,
    },
  ],
}
