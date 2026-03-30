import {inputSlots, inputCompoundVariants, inputVariants} from './input-commons'
import {selectOpenRing, selectSizes} from './select-commons'
import {menuItemSlots} from './menu-items'

export default {
  slots: {
    ...inputSlots,
    ...menuItemSlots,
  },
  compoundVariants: [...inputCompoundVariants, ...selectOpenRing],
  variants: {
    ...inputVariants,
    active: {
      false: {
        item: 'before:transition-none',
      },
    },
    size: selectSizes,
  },
}
