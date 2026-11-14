// Color×variant class lookup for custom input-like containers (SColorPicker, etc.)
// Same visual appearance as Stem inputs, but split into base/hover/focus for manual application
// on container elements (where focus is tracked programmatically, not via :focus-visible).

export type InputColor = 'primary' | 'error' | 'success'
export type InputVariant = 'outline' | 'soft' | 'subtle' | 'ghost' | 'none'

export interface ContainerClasses {
  base: string
  hover: string
  focus: string
  placeholder: string
}

// Icon colors per semantic color (matches leadingIcon/trailingIcon from input-commons.ts)
export const inputIconColors: Record<InputColor, string> = {
  primary: 'text-iron-500/80',
  error: 'text-rose-500/80',
  success: 'text-emerald-500/80',
}

// Radius from the Stem scale (the container carries an s-size-* class). The
// border is a 1px inset ring; focus darkens it and adds a halo outside. Both
// are box-shadows: they never resize it.
const common = 's-corner transition duration-200'

export const inputContainerClasses: Record<InputColor, Record<InputVariant, ContainerClasses>> = {
  primary: {
    outline: {
      base: `${common} bg-default ring-1 ring-inset ring-iron-500/30`,
      hover: 'hover:ring-iron-500/50',
      focus: 'ring-iron-500/80! shadow-[0_0_0_3.5px] shadow-iron-500/20',
      placeholder: 'placeholder:text-iron-500/80',
    },
    soft: {
      base: `${common} bg-iron-500/10`,
      hover: 'hover:bg-iron-500/15',
      focus: 'bg-iron-500/15',
      placeholder: 'placeholder:text-iron-500/80',
    },
    subtle: {
      base: `${common} ring-1 ring-inset bg-iron-500/5 ring-iron-500/30`,
      hover: 'hover:bg-iron-500/10 hover:ring-iron-500/50',
      focus: 'ring-iron-500/80! shadow-[0_0_0_3.5px] shadow-iron-500/20 bg-iron-500/5!',
      placeholder: 'placeholder:text-iron-500/80',
    },
    ghost: {
      base: `${common} bg-transparent`,
      hover: 'hover:bg-iron-500/10',
      focus: 'bg-iron-500/10',
      placeholder: 'placeholder:text-iron-500/80',
    },
    none: {base: '', hover: '', focus: '', placeholder: 'placeholder:text-iron-500/80'},
  },
  error: {
    outline: {
      base: `${common} bg-default ring-1 ring-inset ring-rose-500/30`,
      hover: 'hover:ring-rose-500/50',
      focus: 'ring-rose-500/80! shadow-[0_0_0_3.5px] shadow-rose-500/20',
      placeholder: 'placeholder:text-rose-500/80',
    },
    soft: {
      base: `${common} bg-rose-500/10`,
      hover: 'hover:bg-rose-500/15',
      focus: 'bg-rose-500/15',
      placeholder: 'placeholder:text-rose-500/80',
    },
    subtle: {
      base: `${common} ring-1 ring-inset bg-rose-500/5 ring-rose-500/30`,
      hover: 'hover:bg-rose-500/10 hover:ring-rose-500/50',
      focus: 'ring-rose-500/80! shadow-[0_0_0_3.5px] shadow-rose-500/20 bg-rose-500/5!',
      placeholder: 'placeholder:text-rose-500/80',
    },
    ghost: {
      base: `${common} bg-transparent`,
      hover: 'hover:bg-rose-500/10',
      focus: 'bg-rose-500/10',
      placeholder: 'placeholder:text-rose-500/80',
    },
    none: {base: '', hover: '', focus: '', placeholder: 'placeholder:text-rose-500/80'},
  },
  success: {
    outline: {
      base: `${common} bg-default ring-1 ring-inset ring-emerald-500/30`,
      hover: 'hover:ring-emerald-500/50',
      focus: 'ring-emerald-500/80! shadow-[0_0_0_3.5px] shadow-emerald-500/20',
      placeholder: 'placeholder:text-emerald-500/80',
    },
    soft: {
      base: `${common} bg-emerald-500/10`,
      hover: 'hover:bg-emerald-500/15',
      focus: 'bg-emerald-500/15',
      placeholder: 'placeholder:text-emerald-500/80',
    },
    subtle: {
      base: `${common} ring-1 ring-inset bg-emerald-500/5 ring-emerald-500/30`,
      hover: 'hover:bg-emerald-500/10 hover:ring-emerald-500/50',
      focus: 'ring-emerald-500/80! shadow-[0_0_0_3.5px] shadow-emerald-500/20 bg-emerald-500/5!',
      placeholder: 'placeholder:text-emerald-500/80',
    },
    ghost: {
      base: `${common} bg-transparent`,
      hover: 'hover:bg-emerald-500/10',
      focus: 'bg-emerald-500/10',
      placeholder: 'placeholder:text-emerald-500/80',
    },
    none: {base: '', hover: '', focus: '', placeholder: 'placeholder:text-emerald-500/80'},
  },
}
