import {alertClasses, alertColors, alertOrientation, alertSlots, alertVariants} from './alert-colors'

/**
 * UAlert: the inline alert. Same box, type and close pill as the toast
 * (`toast.ts`), from `alert-colors.ts`. `outline` is the default: the
 * surface with the color in the icon, what a toast looks like.
 */
export default {
  slots: alertSlots,
  variants: {
    orientation: alertOrientation,
  },
  compoundVariants: alertColors.flatMap(color => alertVariants.map(variant => {
    const c = alertClasses(color, variant)
    return {
      color,
      variant,
      class: {
        root: variant === 'solid' ? c.root : `${c.root} text-default`,
        icon: c.icon,
        title: c.title,
        description: c.description,
        ...(c.close && {close: c.close}),
      },
    }
  })),
  defaultVariants: {
    variant: 'outline',
  },
}
