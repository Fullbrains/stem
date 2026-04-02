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
        text-white dark:text-smut-900
        bg-smut-900 dark:bg-smut-100
        hover:bg-smut-800 dark:hover:bg-smut-300
        active:bg-smut-900 dark:active:bg-smut-100
        disabled:bg-smut-900 dark:disabled:bg-smut-100
        focus-visible:outline-smut-500
      `,
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: `
        text-white dark:text-white
        bg-smut-600 dark:bg-smut-600
        hover:bg-gray-500 dark:hover:bg-gray-200
        active:bg-gray-600 dark:active:bg-gray-300
        disabled:bg-gray-600 dark:disabled:bg-gray-300
        focus-visible:outline-gray-400
      `,
    },
    {
      color: 'secondary',
      variant: 'solid',
      class: `
        text-(--ui-text) dark:text-smut-100
        bg-white dark:bg-smut-800
        hover:bg-smut-50 dark:hover:bg-smut-700
        active:bg-white dark:active:bg-smut-800
        disabled:bg-white dark:disabled:bg-smut-800
        focus-visible:outline-smut-400
      `,
    },
    {
      color: 'error',
      variant: 'solid',
      class: `
        bg-rose-600 dark:bg-rose-600
        hover:bg-rose-700 dark:hover:bg-rose-500
        active:bg-rose-600 dark:active:bg-rose-600
      `,
    },
    {
      color: ['primary', 'neutral', 'secondary'],
      variant: 'soft',
      class: `
        text-gray-800 dark:text-gray-200
        bg-smut-400/20
        hover:bg-smut-400/30
        active:bg-smut-400/20
      `
    },
    {
      color: ['primary', 'neutral'],
      variant: 'subtle',
      class: `
        text-gray-800 dark:text-gray-200
        bg-smut-400/20
        hover:bg-smut-400/30
        active:bg-smut-400/20
        ring-gray-500/30 dark:ring-gray-300/20
      `
    },
    {
      color: 'secondary',
      variant: 'subtle',
      class: `
        text-(--ui-text) dark:text-smut-100
        bg-white dark:bg-smut-800
        hover:bg-smut-50 dark:hover:bg-smut-700
        active:bg-white dark:active:bg-smut-800
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
