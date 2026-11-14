import {fieldLabelCompounds, singleLineFieldCompounds} from './sizes'
import {inputSlots, inputCompoundVariants, inputVariants, singleLineHeight} from './input-commons'

export default {
  slots: {
    ...inputSlots,
    base: `${inputSlots.base} ${singleLineHeight}`,
  },
  compoundVariants: [...inputCompoundVariants, ...fieldLabelCompounds, ...singleLineFieldCompounds],
  variants: inputVariants,
}
