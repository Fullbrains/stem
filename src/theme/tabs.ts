import {stemScaleIcon, stemSizeClass, stemSizes, type StemSize} from './scale'

/**
 * Tabs on the Stem scale. A trigger is a button of the same size in every
 * way: its text, icon, padding, height and squircle (sm: 32px, 6px). The pill
 * list wraps them with a 2px inset (--s-inset) on every side, so it is a
 * button plus 4px tall, its corners rounder by the inset (s-corner-outer) and
 * concentric with the active tab's. Pill with `rounded`.
 */
function tabsSize(token: StemSize) {
  return {
    // A pill list: its triggers, pills too, take the extra padding-x
    // (--s-pill-x), given back as the root's negative margin, so the tabs line
    // up with squircle ones. The list's inset stays the same on every side,
    // so the active pill is concentric with the list's.
    root: `${stemSizeClass(token)} mx-[calc(var(--s-pill-x,0px)*-1)]`,
    trigger: 'text-(length:--s-text) leading-(--s-icon-size) px-[calc(var(--s-px)+var(--s-pill-x,0px))] py-(--s-py) gap-(--s-gap)',
    leadingIcon: stemScaleIcon,
  }
}

export default {
  slots: {
    root: '[--s-inset:2px]',
    trigger: 's-corner cursor-pointer font-normal',
    // The optical label trim on the side of an icon or avatar; `alone`
    // without icons. The siblings decide; the more specific selectors win.
    label: 'ms-[calc(var(--s-label-alone-start,0em)*-1)] me-[calc(var(--s-label-alone-end,0em)*-1)] [[data-slot=leadingIcon]+&]:ms-[calc(var(--s-label-icon-start,0em)*-1)] [[data-slot=leadingAvatar]+&]:ms-[calc(var(--s-label-icon-start,0em)*-1)] [&:has(+[data-slot=trailingIcon])]:me-[calc(var(--s-label-icon-end,0em)*-1)]',
  },
  variants: {
    variant: {
      pill: {
        list: 's-corner-outer p-(--s-inset)',
        indicator: 's-corner shadow-none',
      },
      link: {
        list: 'p-0',
      },
    },
    size: Object.fromEntries(stemSizes.map(s => [s, tabsSize(s)])),
  },
  compoundVariants: [
    {orientation: 'horizontal', variant: 'pill', class: {indicator: 'inset-y-(--s-inset)!'}},
    {orientation: 'vertical', variant: 'pill', class: {indicator: 'inset-x-(--s-inset)!'}},
    // Link: no inset around the triggers, so they take the whole padding.
    {variant: 'link', class: {trigger: 'py-(--s-py)!'}},
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
