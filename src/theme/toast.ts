import {alertClasses, alertColors, alertOrientation, alertSlots} from './alert-colors'

/**
 * UToast: the alert arriving on its own. The inline alert's `outline`
 * (`alert.ts`), lifted with a shadow: same box, type, icon colors and close
 * pill, from `alert-colors.ts`.
 *
 * UToast has no `variant` prop, so its theme can only give it one look. For
 * another, pass the alert's classes per toast:
 *   toast.add({..., ui: alertClasses('error', 'solid')})
 */
export default {
  slots: {
    ...alertSlots,
    root: `${alertSlots.root} relative group overflow-hidden shadow-lg dark:shadow-black/40`,
    wrapper: 'w-0 flex-1 flex flex-col',
    actions: alertSlots.actions.replace('flex-wrap ', ''),
  },
  variants: {
    color: Object.fromEntries(alertColors.map((color) => {
      const c = alertClasses(color, 'outline')
      return [color, {root: `${c.root} focus-visible:outline-2`, icon: c.icon, title: c.title, description: c.description}]
    })),
    orientation: alertOrientation,
  },
}
