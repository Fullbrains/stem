import {inputSlots, inputCompoundVariants, inputVariants} from './input-commons'
import {selectOutlineHover, selectOpenRing, selectSizes, selectLabelCompound} from './select-commons'
import {menuItemSlots, menuItemHighlight} from './menu-items'

export default {
  slots: {
    ...inputSlots,
    ...menuItemSlots,
    base: `${inputSlots.base} cursor-pointer`,
  },
  compoundVariants: [...inputCompoundVariants, ...selectOutlineHover, ...selectOpenRing, selectLabelCompound],
  variants: {
    ...inputVariants,
    active: {
      false: {
        item: menuItemHighlight,
      },
    },
    size: selectSizes,
  },
}
