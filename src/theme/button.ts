import {sizes} from './sizes'

export default {
  slots: {
    base: 'cursor-pointer select-none rounded-[8px] transition duration-300 font-normal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2',
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: `
        text-white dark:text-stem-900
        bg-stem-900 dark:bg-stem-100
        hover:bg-stem-800 dark:hover:bg-stem-300
        active:bg-stem-900 dark:active:bg-stem-100
        disabled:bg-stem-900 dark:disabled:bg-stem-100
        focus-visible:outline-iron-500
      `,
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: `
        text-white dark:text-white
        bg-muto-600 dark:bg-muto-600
        hover:bg-muto-500 dark:hover:bg-muto-700
        active:bg-muto-600 dark:active:bg-muto-600
        disabled:bg-muto-600 dark:disabled:bg-muto-300
        focus-visible:outline-muto-400
      `,
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: `
        text-(--ui-text) dark:text-iron-100
        bg-white dark:bg-iron-800
        hover:bg-iron-50 dark:hover:bg-iron-700
        active:bg-white dark:active:bg-iron-800
        disabled:bg-white dark:disabled:bg-iron-800
        focus-visible:outline-iron-400
      `,
    },
    {
      color: 'error',
      variant: 'solid',
      class: `
        bg-rose-600 dark:bg-rose-400
        hover:bg-rose-700 dark:hover:bg-rose-500
        active:bg-rose-600 dark:active:bg-rose-400
      `,
    },
    {
      color: ['primary', 'neutral', 'secondary'],
      variant: 'soft',
      class: `
        text-muto-800 dark:text-muto-200
        bg-iron-400/20
        hover:bg-iron-400/30
        active:bg-iron-400/20
      `
    },
    {
      color: ['primary', 'neutral'],
      variant: 'subtle',
      class: `
        text-muto-800 dark:text-muto-200
        bg-iron-400/20
        hover:bg-iron-400/30
        active:bg-iron-400/20
        ring-muto-500/30 dark:ring-muto-300/20
      `
    },
    {
      color: 'secondary',
      variant: 'subtle',
      class: `
        text-(--ui-text) dark:text-iron-100
        bg-white dark:bg-iron-800
        hover:bg-iron-50 dark:hover:bg-iron-700
        active:bg-white dark:active:bg-iron-800
        ring-inset ring-(--ui-border)
      `
    }
  ],
  variants: {
    size: sizes,
  },
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
}
