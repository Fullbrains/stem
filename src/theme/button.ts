import {sizes} from './sizes'

export default {
  slots: {
    base: 'cursor-pointer rounded-[8px]! transition! duration-300! font-normal disabled:cursor-not-allowed disabled:opacity-30! focus-visible:outline-2! focus-visible:outline-offset-2! px-[1em]! gap-[0.5em]! py-[0.5em]! leading-normal!',
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
        hover:bg-slate-400/30!
        active:bg-slate-400/20!
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

// --- Vecchi compoundVariants recuperati dalla sessione precedente ---
// {
//   color: 'primary',
//   variant: 'subtle',
//   class: `
//     text-slate-700 dark:text-slate-300
//     ring ring-inset ring-slate-500/25
//     bg-slate-500/10
//     hover:bg-slate-500/15
//     active:bg-slate-500/15
//     focus-visible:ring-2 focus-visible:ring-slate-500
//     disabled:bg-slate-500/10
//   `,
// },
// {
//   color: 'error',
//   variant: 'solid',
//   class: `
//     text-white
//     bg-rose-500
//     hover:bg-rose-600
//     active:bg-rose-600
//     disabled:bg-rose-500
//     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500
//   `,
// },
// {
//   color: 'error',
//   variant: 'soft',
//   class: `
//     text-rose-700 dark:text-rose-300
//     bg-rose-500/10
//     hover:bg-rose-500/15
//     active:bg-rose-500/15
//     focus-visible:bg-rose-500/15
//     disabled:bg-rose-500/10
//   `,
// },
// {
//   color: 'error',
//   variant: 'subtle',
//   class: `
//     text-rose-700 dark:text-rose-300
//     ring ring-inset ring-rose-500/25
//     bg-rose-500/10
//     hover:bg-rose-500/15
//     active:bg-rose-500/15
//     focus-visible:ring-2 focus-visible:ring-rose-500
//     disabled:bg-rose-500/10
//   `,
// },
// --- Vecchio primary × soft (diverso dall'attuale) ---
// {
//   color: 'primary',
//   variant: 'soft',
//   class: `
//     text-slate-700 dark:text-slate-100
//     bg-slate-500/10 dark:bg-slate-100/20
//     hover:bg-slate-500/20 dark:hover:bg-slate-100/30
//     active:bg-slate-500/10 dark:active:bg-slate-100/20
//     focus-visible:bg-slate-500/20
//     disabled:bg-slate-500/10
//   `,
// },
