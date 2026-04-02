export default {
  variants: {
    variant: {
      pill: {
        list: 'rounded-full',
        indicator: 'rounded-full shadow-none',
        trigger: 'cursor-pointer',
      },
      link: {
        trigger: 'cursor-pointer',
      },
    },
    size: {
      xs: {trigger: 'px-2 py-1 text-xs gap-1', leadingIcon: 'size-3'},
      sm: {trigger: 'px-2.5 py-1.5 text-sm gap-1.5', leadingIcon: 'size-3.5'},
      md: {trigger: 'px-3 py-1.5 text-base gap-1.5', leadingIcon: 'size-4'},
      lg: {trigger: 'px-3 py-2 text-lg gap-2', leadingIcon: 'size-4.5'},
      xl: {trigger: 'px-3 py-2 text-xl gap-2', leadingIcon: 'size-5'},
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'pill',
      class: {
        indicator: 'bg-smut-900 dark:bg-smut-100',
        trigger: 'data-[state=active]:text-white dark:data-[state=active]:text-smut-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-smut-500',
      },
    },
    {
      color: 'primary',
      variant: 'link',
      class: {
        indicator: 'bg-smut-900 dark:bg-smut-100',
        trigger: 'data-[state=active]:text-smut-900 dark:data-[state=active]:text-smut-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-smut-500',
      },
    },
  ],
}
