import {sizes, fieldSizes} from './sizes'
import {menuItemSizes} from './menu-items'

export const selectOutlineHover = [
  {color: 'primary', variant: 'outline', class: {base: 'hover:bg-iron-500/5'}},
  {color: 'error', variant: 'outline', class: {base: 'hover:bg-rose-500/5'}},
  {color: 'success', variant: 'outline', class: {base: 'hover:bg-emerald-500/5'}},
]

// Open or focused: the same inset 2px ring as a focused input. Written out
// in full: Tailwind only generates classes it can read in the source.
const openRing = 'focus:ring-2! data-[state=open]:ring-2!'

export const selectOpenRing = [
  {color: 'primary', variant: ['outline', 'subtle'], class: {base: `${openRing} focus:ring-iron-500/80! data-[state=open]:ring-iron-500/80!`}},
  {color: 'error', variant: ['outline', 'subtle'], class: {base: `${openRing} focus:ring-rose-500/80! data-[state=open]:ring-rose-500/80!`}},
  {color: 'success', variant: ['outline', 'subtle'], class: {base: `${openRing} focus:ring-emerald-500/80! data-[state=open]:ring-emerald-500/80!`}},
]

// USelect / USelectMenu: the trigger is the root; leading and trailing icons
// sit inside it, absolutely positioned, one padding from the edge.
const selectEdges = {leading: 'ps-(--s-px)!', trailing: 'pe-(--s-px)!'}

export const selectSizes = {
  xs: {...sizes.xs, ...selectEdges, ...menuItemSizes.xs},
  sm: {...sizes.sm, ...selectEdges, ...menuItemSizes.sm},
  md: {...sizes.md, ...selectEdges, ...menuItemSizes.md},
  lg: {...sizes.lg, ...selectEdges, ...menuItemSizes.lg},
  xl: {...sizes.xl, ...selectEdges, ...menuItemSizes.xl},
}

// UInputMenu has a root around the field, like UInput.
export const fieldSelectSizes = {
  xs: {...fieldSizes.xs, ...menuItemSizes.xs},
  sm: {...fieldSizes.sm, ...menuItemSizes.sm},
  md: {...fieldSizes.md, ...menuItemSizes.md},
  lg: {...fieldSizes.lg, ...menuItemSizes.lg},
  xl: {...fieldSizes.xl, ...menuItemSizes.xl},
}
