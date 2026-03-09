import {inputSlots, baseCompoundVariants, inputVariants} from './input-commons'
import {selectOpenRing, selectSizes} from './select-commons'
import {menuItemSlots} from './menu-items'

export default {
  slots: {
    ...inputSlots,
    ...menuItemSlots,
  },
  compoundVariants: [...baseCompoundVariants, ...selectOpenRing],
  variants: {
    ...inputVariants,
    size: selectSizes,
  },
}
