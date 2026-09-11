import {iconSizeClass, iconSizeFor} from './icon-sizes'

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
      xs: {trigger: `px-2 py-1 text-xs gap-1 ${iconSizeFor('xs')}`, leadingIcon: iconSizeClass},
      sm: {trigger: `px-2.5 py-1.5 text-sm gap-1.5 ${iconSizeFor('sm')}`, leadingIcon: iconSizeClass},
      md: {trigger: `px-3 py-1.5 text-base gap-1.5 ${iconSizeFor('md')}`, leadingIcon: iconSizeClass},
      lg: {trigger: `px-3 py-2 text-lg gap-2 ${iconSizeFor('lg')}`, leadingIcon: iconSizeClass},
      xl: {trigger: `px-3 py-2 text-xl gap-2 ${iconSizeFor('xl')}`, leadingIcon: iconSizeClass},
    },
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'pill',
      class: {
        indicator: 'bg-gray-800 dark:bg-stem-100',
        trigger: 'data-[state=active]:text-white dark:data-[state=active]:text-stem-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iron-500',
      },
    },
    {
      color: 'primary',
      variant: 'link',
      class: {
        indicator: 'bg-gray-800 dark:bg-stem-100',
        trigger: 'data-[state=active]:text-gray-800 dark:data-[state=active]:text-stem-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-iron-500',
      },
    },
  ],
}
