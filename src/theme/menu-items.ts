export const menuItemSlots = {
  content: 'shadow-lg',
  item: 'text-highlighted cursor-pointer items-center! data-highlighted:not-data-disabled:before:bg-elevated!',
  itemLeadingIcon: 'text-highlighted',
}

export const menuItemSizes = {
  xs: {item: 'p-1 text-xs! gap-1', itemLeadingIcon: 'size-3!', itemTrailingIcon: 'size-3!'},
  sm: {item: 'p-1.5 text-sm! gap-1.5', itemLeadingIcon: 'size-3.5!', itemTrailingIcon: 'size-3.5!'},
  md: {item: 'p-1.5 text-base! gap-1.5', itemLeadingIcon: 'size-4!', itemTrailingIcon: 'size-4!'},
  lg: {item: 'p-2 text-lg! gap-2', itemLeadingIcon: 'size-4.5!', itemTrailingIcon: 'size-4.5!'},
  xl: {item: 'p-2 text-xl! gap-2', itemLeadingIcon: 'size-5!', itemTrailingIcon: 'size-5!'},
}
