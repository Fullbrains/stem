import {inputSlots, inputCompoundVariants, inputVariants} from './input-commons'

export default {
  slots: {
    ...inputSlots,
    leading: `${inputSlots.leading} pt-[0.5em]`,
    trailing: `${inputSlots.trailing} pt-[0.5em]`,
  },
  compoundVariants: inputCompoundVariants,
  variants: inputVariants,
}
