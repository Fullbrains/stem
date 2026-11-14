import {menuItemSlots, menuItemSizes, menuItemHighlight} from './menu-items'

export default {
  slots: {
    ...menuItemSlots,
    itemLeadingIcon: 'shrink-0 text-default',
  },
  variants: {
    active: {
      false: {
        item: menuItemHighlight,
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
