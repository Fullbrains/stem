import {menuItemSlots, menuItemSizes} from './menu-items'

export default {
  slots: {
    ...menuItemSlots,
    itemLeadingIcon: 'shrink-0 text-default',
  },
  variants: {
    active: {
      false: {
        item: 'data-highlighted:before:bg-elevated data-[state=open]:before:bg-elevated before:transition-none',
        itemLeadingIcon: [
          'text-default group-data-highlighted:text-default group-data-[state=open]:text-default',
          'transition-colors',
        ],
      },
      true: {
        itemLeadingIcon: 'text-default',
      },
    },
    size: menuItemSizes,
  },
}
