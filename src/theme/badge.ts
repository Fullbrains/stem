import {sizes} from './sizes'

export default {
  // Same scale as a button: at a given size a badge is as tall as a button,
  // with the same text, icon, padding and radius. Squircle; pill via `rounded`.
  slots: {
    base: 's-corner font-normal',
    // The optical label shift: `center` on a label alone, `icon` beside an
    // icon or avatar. UBadge has no leading/trailing variants, so the
    // siblings decide (the more specific selectors win).
    label: 'ms-[calc(var(--s-label-shift-center,0em)*-1)] [[data-slot=leadingIcon]+&]:ms-[calc(var(--s-label-shift-icon,0em)*-1)] [[data-slot=leadingAvatar]+&]:ms-[calc(var(--s-label-shift-icon,0em)*-1)] [&:has(+[data-slot=trailingIcon])]:ms-[calc(var(--s-label-shift-icon,0em)*-1)]',
  },
  variants: {
    size: sizes,
  },
  compoundVariants: [
    // Icon only (no label): Nuxt UI calls it `square` and gives it a smaller
    // padding of its own. On the scale it keeps the size's padding, so it is
    // as tall as the same control with a label — and square, since padding-x
    // and padding-y are equal unless space-x / space-y set them apart.
    {square: true, class: {base: 'px-(--s-px)! py-(--s-py)!'}},
    {
      color: 'primary',
      variant: 'solid',
      class: `
        text-white dark:text-stem-900
        bg-gray-800 dark:bg-stem-100
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
        text-gray-800 dark:text-stem-100
        ring-gray-800/50 dark:ring-stem-100/50
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
