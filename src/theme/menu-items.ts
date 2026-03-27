export const menuItemSlots = {
  content: 's-floating-menu rounded-lg',
  group: 'p-1',
  item: 'text-highlighted cursor-pointer items-center font-normal data-highlighted:not-data-disabled:before:bg-elevated data-disabled:opacity-50 before:transition-none',
  itemLeadingIcon: 'text-highlighted',
}

export const menuItemSizes = {
  xs: {item: 'p-[0.5em] text-xs gap-[0.5em]', itemLeadingIcon: 'size-3.5', itemTrailingIcon: 'size-3.5'},
  sm: {item: 'p-[0.5em] text-sm gap-[0.5em]', itemLeadingIcon: 'size-4', itemTrailingIcon: 'size-4'},
  md: {item: 'p-[0.5em] text-base gap-[0.5em]', itemLeadingIcon: 'size-4.5', itemTrailingIcon: 'size-4.5'},
  lg: {item: 'p-[0.5em] text-lg gap-[0.5em]', itemLeadingIcon: 'size-5', itemTrailingIcon: 'size-5'},
  xl: {item: 'p-[0.5em] text-xl gap-[0.5em]', itemLeadingIcon: 'size-5.5', itemTrailingIcon: 'size-5.5'},
}
