import {inputSlots, inputCompoundVariants, inputVariants, singleLineHeight} from './input-commons'

export default {
  slots: {
    ...inputSlots,
    base: `${inputSlots.base} ${singleLineHeight}`,
  },
  compoundVariants: inputCompoundVariants,
  variants: inputVariants,
}
