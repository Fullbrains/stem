import {iconSizeClass, iconSizeFor} from './icon-sizes'

const base = 'px-[1em] py-[0.5em] gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]'

function size(_token: 'xs' | 'sm' | 'md' | 'lg' | 'xl', text: string) {
  return {
    // The base declares --s-icon-size as 1em, so icons follow THIS variant's
    // text size; leading and trailing icons read it, and an `iconSize` prop on
    // the component overrides both at once.
    base: `${base} ${text} ${iconSizeFor()}`,
    // In the inputs (Input, InputNumber, InputMenu, Textarea) `base` is the
    // field itself and the icons sit beside it, under `root`: declared there
    // too, or they would read nothing and stay zero wide. Components without
    // a root slot ignore the key.
    root: iconSizeFor(),
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
