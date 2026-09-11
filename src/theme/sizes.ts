import {iconSizeClass, iconSizeFor} from './icon-sizes'

const base = 'px-[1em] py-[0.5em] gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]'

function size(token: 'xs' | 'sm' | 'md' | 'lg' | 'xl', text: string) {
  return {
    // The size token sets --s-icon-size on the root; leading and trailing icons
    // read it, so an `iconSize` override on the component overrides both at once.
    base: `${base} ${text} ${iconSizeFor(token)}`,
    leadingIcon: iconSizeClass,
    trailingIcon: iconSizeClass,
  }
}

export const sizes = {
  xs: size('xs', 'text-xs'),
  sm: size('sm', 'text-sm'),
  md: size('md', 'text-base'),
  lg: size('lg', 'text-lg'),
  xl: size('xl', 'text-xl'),
}
