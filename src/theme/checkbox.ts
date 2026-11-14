import {stemSizeClass, stemSizes, type StemSize} from './scale'

/**
 * Checkbox on the Stem scale: the box is as big as the size's icon, the label
 * has its text and line height, the gap between them is the size's, and the
 * row has its padding-y — so a checkbox row is as tall as a button of the
 * same size. No padding-x: the box stays on the left edge of the content.
 */
function checkboxSize(token: StemSize) {
  return {
    root: `${stemSizeClass(token)} py-(--s-py)`,
    container: 'h-(--s-icon-size)',
    base: 'size-(--s-icon-size)',
    icon: 'size-[calc(var(--s-icon-size)*0.75)]',
    wrapper: 'text-(length:--s-text) leading-(--s-icon-size)',
  }
}

export default {
  slots: {
    base: 'cursor-pointer s-corner-inner [--s-inset:calc(var(--s-radius)/2)]',
    label: 'cursor-pointer',
    // The gap less the optical label trim, `alone`: a box is not an icon.
    wrapper: 'ms-[calc(var(--s-gap)-var(--s-label-alone-start,0em))]!',
  },
  variants: {
    size: Object.fromEntries(stemSizes.map(s => [s, checkboxSize(s)])),
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
