import {inputSlots, inputCompoundVariants, inputVariants, singleLineHeight} from './input-commons'
import {selectOpenRing, fieldSelectSizes} from './select-commons'
import {menuItemSlots} from './menu-items'

export default {
  slots: {
    ...inputSlots,
    ...menuItemSlots,
    base: `${inputSlots.base} ${singleLineHeight}`,
  },
  compoundVariants: [...inputCompoundVariants, ...selectOpenRing],
  variants: {
    ...inputVariants,
    active: {
      false: {
        item: 'data-highlighted:not-data-disabled:before:bg-elevated before:transition-none',
      },
    },
    size: fieldSelectSizes,
  },
}
