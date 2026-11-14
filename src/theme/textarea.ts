import {fieldLabelCompounds} from './sizes'
import {inputSlots, inputCompoundVariants, inputVariants} from './input-commons'

export default {
  slots: {
    ...inputSlots,
    leading: 'top-(--s-py)! bottom-auto!',
    trailing: 'top-(--s-py)! bottom-auto!',
  },
  compoundVariants: [...inputCompoundVariants, ...fieldLabelCompounds],
  variants: inputVariants,
}
