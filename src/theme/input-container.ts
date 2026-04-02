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
  primary: 'text-smut-500/80',
  error: 'text-rose-500/80',
  success: 'text-emerald-500/80',
}

const common = 'ring-0 rounded-[6px] transition duration-200'

export const inputContainerClasses: Record<InputColor, Record<InputVariant, ContainerClasses>> = {
  primary: {
    outline: {
      base: `${common} bg-default border border-smut-500/30`,
      hover: 'hover:border-smut-500/50',
      focus: 'border-smut-500/80! shadow-[0_0_0_3.5px] shadow-smut-500/20',
      placeholder: 'placeholder:text-smut-500/80',
    },
    soft: {
      base: `${common} bg-smut-500/10`,
      hover: 'hover:bg-smut-500/15',
      focus: 'bg-smut-500/15',
      placeholder: 'placeholder:text-smut-500/80',
    },
    subtle: {
      base: `${common} border bg-smut-500/5 border-smut-500/30`,
      hover: 'hover:bg-smut-500/10 hover:border-smut-500/50',
      focus: 'border-smut-500/80! shadow-[0_0_0_3.5px] shadow-smut-500/20 bg-smut-500/5!',
      placeholder: 'placeholder:text-smut-500/80',
    },
    ghost: {
      base: `${common} bg-transparent`,
      hover: 'hover:bg-smut-500/10',
      focus: 'bg-smut-500/10',
      placeholder: 'placeholder:text-smut-500/80',
    },
    none: {base: '', hover: '', focus: '', placeholder: 'placeholder:text-smut-500/80'},
  },
  error: {
    outline: {
      base: `${common} bg-default border border-rose-500/30`,
      hover: 'hover:border-rose-500/50',
      focus: 'border-rose-500/80! shadow-[0_0_0_3.5px] shadow-rose-500/20',
      placeholder: 'placeholder:text-rose-500/80',
    },
    soft: {
      base: `${common} bg-rose-500/10`,
      hover: 'hover:bg-rose-500/15',
      focus: 'bg-rose-500/15',
      placeholder: 'placeholder:text-rose-500/80',
    },
    subtle: {
      base: `${common} border bg-rose-500/5 border-rose-500/30`,
      hover: 'hover:bg-rose-500/10 hover:border-rose-500/50',
      focus: 'border-rose-500/80! shadow-[0_0_0_3.5px] shadow-rose-500/20 bg-rose-500/5!',
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
      base: `${common} bg-default border border-emerald-500/30`,
      hover: 'hover:border-emerald-500/50',
      focus: 'border-emerald-500/80! shadow-[0_0_0_3.5px] shadow-emerald-500/20',
      placeholder: 'placeholder:text-emerald-500/80',
    },
    soft: {
      base: `${common} bg-emerald-500/10`,
      hover: 'hover:bg-emerald-500/15',
      focus: 'bg-emerald-500/15',
      placeholder: 'placeholder:text-emerald-500/80',
    },
    subtle: {
      base: `${common} border bg-emerald-500/5 border-emerald-500/30`,
      hover: 'hover:bg-emerald-500/10 hover:border-emerald-500/50',
      focus: 'border-emerald-500/80! shadow-[0_0_0_3.5px] shadow-emerald-500/20 bg-emerald-500/5!',
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
