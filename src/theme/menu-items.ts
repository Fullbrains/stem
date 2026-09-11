import {iconSizeClass, iconSizeFor} from './icon-sizes'

export const menuItemSlots = {
  content: 's-floating-menu s-corner [--s-radius:10px]',
  group: 'p-1',
  item: 'cursor-pointer items-center font-normal data-disabled:opacity-50 before:transition-none',
  itemLeadingIcon: '',
}

export const menuItemSizes = {
  xs: {item: `p-[0.5em] text-xs gap-[0.5em] ${iconSizeFor('xs')}`, itemLeadingIcon: iconSizeClass, itemTrailingIcon: iconSizeClass},
  // sm mirrors the metrics of a standard selectable row (36px box, px-2,
  // gap-2): min-h instead of a fixed height so multi-line items can still
  // grow, with py-1 as the guard for that case.
  sm: {item: `min-h-9 px-2 py-1 text-sm gap-2 ${iconSizeFor('sm')}`, itemLeadingIcon: iconSizeClass, itemTrailingIcon: iconSizeClass},
  md: {item: `p-[0.5em] text-base gap-[0.5em] ${iconSizeFor('md')}`, itemLeadingIcon: iconSizeClass, itemTrailingIcon: iconSizeClass},
  lg: {item: `p-[0.5em] text-lg gap-[0.5em] ${iconSizeFor('lg')}`, itemLeadingIcon: iconSizeClass, itemTrailingIcon: iconSizeClass},
  xl: {item: `p-[0.5em] text-xl gap-[0.5em] ${iconSizeFor('xl')}`, itemLeadingIcon: iconSizeClass, itemTrailingIcon: iconSizeClass},
}
