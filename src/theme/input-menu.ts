import {inputSlots, inputCompoundVariants, inputVariants, singleLineHeight} from './input-commons'
import {selectOpenRing, fieldSelectSizes} from './select-commons'
import {menuItemSlots, menuItemHighlight} from './menu-items'

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
        item: menuItemHighlight,
      },
    },
    size: fieldSelectSizes,
  },
}
