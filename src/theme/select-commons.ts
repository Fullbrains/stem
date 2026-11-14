import {sizes, fieldSizes} from './sizes'
import {menuItemSizes} from './menu-items'
import {stemLabelShift} from './scale'

export const selectOutlineHover = [
  {color: 'primary', variant: 'outline', class: {base: 'hover:bg-iron-500/5'}},
  {color: 'error', variant: 'outline', class: {base: 'hover:bg-rose-500/5'}},
  {color: 'success', variant: 'outline', class: {base: 'hover:bg-emerald-500/5'}},
]

// Open or focused: as a focused input — the 1px border darkens, a 3.5px
// halo outside. Written out in full: Tailwind only generates classes it can
// read in the source.
const openRing = 'focus:shadow-[0_0_0_3.5px] data-[state=open]:shadow-[0_0_0_3.5px]'

export const selectOpenRing = [
  {color: 'primary', variant: ['outline', 'subtle'], class: {base: `${openRing} focus:ring-iron-500/80! data-[state=open]:ring-iron-500/80! focus:shadow-iron-500/20 data-[state=open]:shadow-iron-500/20`}},
  {color: 'error', variant: ['outline', 'subtle'], class: {base: `${openRing} focus:ring-rose-500/80! data-[state=open]:ring-rose-500/80! focus:shadow-rose-500/20 data-[state=open]:shadow-rose-500/20`}},
  {color: 'success', variant: ['outline', 'subtle'], class: {base: `${openRing} focus:ring-emerald-500/80! data-[state=open]:ring-emerald-500/80! focus:shadow-emerald-500/20 data-[state=open]:shadow-emerald-500/20`}},
]

// The optical label trim on the chosen value and the placeholder, on the
// side of an icon: the chevron on the right always, a leading icon if any.
export const selectLabelCompounds = [
  {class: {value: stemLabelShift.iconEnd, placeholder: stemLabelShift.iconEnd}},
  {leading: true, class: {value: stemLabelShift.iconStart, placeholder: stemLabelShift.iconStart}},
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
