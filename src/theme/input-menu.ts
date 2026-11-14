import {fieldLabelCompounds, singleLineFieldCompounds} from './sizes'
import {inputSlots, inputCompoundVariants, inputVariants, singleLineHeight} from './input-commons'
import {selectOpenRing, fieldSelectSizes} from './select-commons'
import {menuItemSlots, menuItemHighlight} from './menu-items'

export default {
  slots: {
    ...inputSlots,
    ...menuItemSlots,
    base: `${inputSlots.base} ${singleLineHeight}`,
  },
  compoundVariants: [...inputCompoundVariants, ...fieldLabelCompounds, ...singleLineFieldCompounds, ...selectOpenRing],
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
