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
        text-white dark:text-stem-900
        bg-stem-900 dark:bg-stem-100
      `,
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: `
        text-white dark:text-white
        bg-stem-600 dark:bg-stem-600
      `,
    },
    {
      color: 'primary',
      variant: 'outline',
      class: `
        text-stem-900 dark:text-stem-100
        ring-stem-900/50 dark:ring-stem-100/50
      `,
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: `
        text-stem-600 dark:text-stem-400
        ring-iron-500/30 dark:ring-iron-400/30
      `,
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: `
        text-(--ui-text) dark:text-iron-100
        bg-white dark:bg-iron-800
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
        text-muto-800 dark:text-muto-200
        bg-iron-400/20
      `,
    },
    {
      color: ['primary', 'neutral'],
      variant: 'subtle',
      class: `
        text-muto-800 dark:text-muto-200
        bg-iron-400/20
        ring-muto-500/30 dark:ring-muto-300/20
      `,
    },
    {
      color: 'secondary',
      variant: 'subtle',
      class: `
        text-(--ui-text) dark:text-iron-100
        bg-white dark:bg-iron-800
        ring-inset ring-(--ui-border)
      `,
    },
  ],
}
