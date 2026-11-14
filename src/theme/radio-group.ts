import {stemSizeClass, stemSizes, type StemSize} from './scale'

/**
 * Radio group on the Stem scale: each option is a row like a checkbox's —
 * dot as big as the size's icon, the size's text, gap and padding-y. Options
 * side by side are a padding-x apart.
 *
 * The checked radio is in the product's primary, as the checkbox's and the
 * solid button's: Nuxt UI's `bg-primary` is the palette's middle grey,
 * lighter than either.
 */
function radioSize(token: StemSize) {
  return {
    root: stemSizeClass(token),
    fieldset: 'gap-x-(--s-px) gap-y-0',
    legend: 'text-(length:--s-text) leading-(--s-icon-size)',
    item: 'py-(--s-py) text-(length:--s-text) leading-(--s-icon-size)',
    container: 'h-(--s-icon-size)',
    base: 'size-(--s-icon-size)',
    indicator: 'after:size-[calc(var(--s-icon-size)*0.4)]',
  }
}

export default {
  slots: {
    base: 'cursor-pointer',
    label: 'cursor-pointer',
    // The gap less the optical label trim, `alone`: a box is not an icon.
    wrapper: 'ms-[calc(var(--s-gap)-var(--s-label-alone-start,0em))]!',
  },
  variants: {
    size: Object.fromEntries(stemSizes.map(s => [s, radioSize(s)])),
  },
  compoundVariants: [
    {
      color: 'primary',
      class: {
        indicator: 'bg-gray-800 dark:bg-stem-100',
        base: 'focus-visible:outline-iron-500',
      },
    },
  ],
}
