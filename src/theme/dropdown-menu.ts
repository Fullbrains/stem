export default {
  slots: {
    itemLeadingIcon: 'shrink-0 text-default',
  },
  variants: {
    active: {
      false: {
        itemLeadingIcon: [
          'text-default group-data-highlighted:text-default group-data-[state=open]:text-default',
          'transition-colors',
        ],
      },
      true: {
        itemLeadingIcon: 'text-default',
      },
    },
  },
}
