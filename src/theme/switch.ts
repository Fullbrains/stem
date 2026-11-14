import {stemSizeClass, stemSizes, type StemSize} from './scale'

/**
 * Switch on the Stem scale: the track is as tall as the size's icon and
 * 1.75 times as wide; the thumb fills it inside the 2px border and travels
 * the difference. The label, gap and row padding-y are a checkbox's.
 */
function switchSize(token: StemSize) {
  return {
    root: `${stemSizeClass(token)} py-(--s-py)`,
    container: 'h-(--s-icon-size)',
    base: 'h-(--s-icon-size) w-[calc(var(--s-icon-size)*1.75)]',
    thumb: 'size-[calc(var(--s-icon-size)-4px)] data-[state=checked]:translate-x-[calc(var(--s-icon-size)*0.75)]! data-[state=checked]:rtl:-translate-x-[calc(var(--s-icon-size)*0.75)]!',
    wrapper: 'text-(length:--s-text) leading-(--s-icon-size)',
  }
}

export default {
  slots: {
    base: 'cursor-pointer',
    // The gap less the optical label shift (stemLabelShift).
    wrapper: 'ms-[calc(var(--s-gap)-var(--s-label-shift,0em))]!',
  },
  variants: {
    size: Object.fromEntries(stemSizes.map(s => [s, switchSize(s)])),
  },
  compoundVariants: [
    {
      color: 'primary',
      class: {
        base: 'data-[state=checked]:bg-gray-800 dark:data-[state=checked]:bg-stem-100 focus-visible:outline-iron-500',
      },
    },
  ],
}
