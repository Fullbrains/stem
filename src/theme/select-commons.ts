import {sizes} from './sizes'
import {menuItemSizes} from './menu-items'

export const selectOutlineHover = [
  {color: 'primary', variant: 'outline', class: {base: 'hover:bg-smut-500/5'}},
  {color: 'error', variant: 'outline', class: {base: 'hover:bg-rose-500/5'}},
  {color: 'success', variant: 'outline', class: {base: 'hover:bg-emerald-500/5'}},
]

const openRingShadow = `
  data-[state=open]:shadow-[0_0_0_3.5px]!
  focus:shadow-[0_0_0_3.5px]!
`

export const selectOpenRing = [
  {
    color: 'primary',
    variant: ['outline', 'subtle'],
    class: {
      base: `
      focus:border-smut-500/80! data-[state=open]:border-smut-500/80!
      ${openRingShadow}
      focus:shadow-smut-500/20! data-[state=open]:shadow-smut-500/20!
    `
    },
  },
  {
    color: 'error',
    variant: ['outline', 'subtle'],
    class: {
      base: `
      focus:border-rose-500/80! data-[state=open]:border-rose-500/80!
      ${openRingShadow}
      focus:shadow-rose-500/20! data-[state=open]:shadow-rose-500/20!
    `
    },
  },
  {
    color: 'success',
    variant: ['outline', 'subtle'],
    class: {
      base: `
      focus:border-emerald-500/80! data-[state=open]:border-emerald-500/80!
      ${openRingShadow}
      focus:shadow-emerald-500/20! data-[state=open]:shadow-emerald-500/20!
    `
    },
  },
]

export const selectSizes = {
  xs: {...sizes.xs, ...menuItemSizes.xs},
  sm: {...sizes.sm, ...menuItemSizes.sm},
  md: {...sizes.md, ...menuItemSizes.md},
  lg: {...sizes.lg, ...menuItemSizes.lg},
  xl: {...sizes.xl, ...menuItemSizes.xl},
}
