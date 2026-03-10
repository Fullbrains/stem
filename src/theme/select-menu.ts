import {inputSlots, inputCompoundVariants, inputVariants} from './input-commons'
import {selectOutlineHover, selectOpenRing, selectSizes} from './select-commons'
import {menuItemSlots} from './menu-items'

export default {
  slots: {
    ...inputSlots,
    ...menuItemSlots,
    base: `${inputSlots.base} cursor-pointer`,
  },
  compoundVariants: [...inputCompoundVariants, ...selectOutlineHover, ...selectOpenRing],
  variants: {
    ...inputVariants,
    size: selectSizes,
  },
}
