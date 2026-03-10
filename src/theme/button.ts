import {sizes} from './sizes'

export default {
  slots: {
    base: 'cursor-pointer rounded-[8px] transition duration-300 font-normal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2',
  },
  compoundVariants: [
    {
      color: 'primary',
      variant: 'solid',
      class: `
        text-white dark:text-slate-900
        bg-slate-900 dark:bg-slate-100
        hover:bg-slate-800 dark:hover:bg-slate-300
        active:bg-slate-900 dark:active:bg-slate-100
        disabled:bg-slate-900 dark:disabled:bg-slate-100
        focus-visible:outline-slate-500
      `,
    },
    {
      color: 'neutral',
      variant: 'solid',
      class: `
        text-white dark:text-white
        bg-slate-600 dark:bg-slate-600
        hover:bg-gray-500 dark:hover:bg-gray-200
        active:bg-gray-600 dark:active:bg-gray-300
        disabled:bg-gray-600 dark:disabled:bg-gray-300
        focus-visible:outline-gray-400
      `,
    },
    {
      color: ['primary', 'neutral'],
      variant: ['soft', 'subtle'],
      class: `
        text-gray-800 dark:text-gray-200
        bg-slate-400/20
        hover:bg-slate-400/30
        active:bg-slate-400/20
      `
    },
    {
      color: ['primary', 'neutral'],
      variant: 'subtle',
      class: `
        ring-gray-500/30 dark:ring-gray-300/20
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
