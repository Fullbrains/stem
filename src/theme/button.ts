import {sizes} from './sizes'
import {stemLabelShift} from './scale'

export default {
  slots: {
    base: 'cursor-pointer select-none s-corner transition duration-300 font-normal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2',
    // The label truncates along the line only: its line is as tall as the
    // icon, and the text's own box is taller at xs and sm — clipped on both
    // axes, the descenders (g, y) lost their bottoms.
    label: '[overflow-x:clip]! [overflow-y:visible]!',
  },
  compoundVariants: [
    // Icon only (no label): Nuxt UI calls it `square` and gives it a smaller
    // padding of its own. On the scale it keeps the size's padding, so it is
    // as tall as the same control with a label — and square, since padding-x
    // and padding-y are equal unless space-x / space-y set them apart.
    // A round one wider than tall (space-x above space-y) is a pill, and takes
    // the pill's compensation as a label does (--s-pill-x, more padding-x
    // given back as a negative margin); a circle (px = py) takes none, so it
    // stays a circle. --s-pill-sq: --s-pill-x where px > py, else 0.
    {square: true, class: {base: '[--s-pill-sq:min(var(--s-pill-x,0px),max(0px,calc((var(--s-px)-var(--s-py))*1000)))] px-[calc(var(--s-px)+var(--s-pill-sq))]! py-(--s-py)! mx-[calc(var(--s-pill-sq)*-1)]!'}},
    // The optical label trim on the side of an icon; `alone` on a side without
    // (SButton draws its own leading icon and sets that side itself).
    {leading: false, trailing: false, class: {label: stemLabelShift.alone}},
    {leading: true, class: {label: stemLabelShift.iconStart}},
    {trailing: true, class: {label: stemLabelShift.iconEnd}},
    {leading: true, trailing: false, class: {label: stemLabelShift.aloneEnd}},
    {leading: false, trailing: true, class: {label: stemLabelShift.aloneStart}},
    {
      color: 'primary',
      variant: 'solid',
      class: `
        text-white dark:text-stem-900
        bg-gray-800 dark:bg-stem-100
        hover:bg-gray-700 dark:hover:bg-stem-300
        active:bg-gray-800 dark:active:bg-stem-100
        disabled:bg-gray-800 dark:disabled:bg-stem-100
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
      color: ['primary', 'neutral', 'secondary'],
      variant: 'ghost',
      class: `
        text-muto-800 dark:text-muto-200
        hover:bg-iron-400/20
        active:bg-iron-400/30
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
