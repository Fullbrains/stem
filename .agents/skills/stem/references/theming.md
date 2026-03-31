# Stem Theming Reference

Complete theme configuration for every component overridden by `@fullbrains/stem`.

## Color Mappings

```ts
// src/config.ts
export const stemColors = {
  primary: 'slate',
  secondary: 'slate',
  neutral: 'gray',
  success: 'emerald',
  error: 'rose',
}
```

Stem bypasses Nuxt UI's CSS-variable-based semantic colors with hardcoded Tailwind classes. This ensures that `primary` always renders as slate-900/slate-100 regardless of Nuxt UI's internal color resolution.

## Icon Mappings

```ts
// src/config.ts — complete stemIcons map
export const stemIcons = {
  arrowDown: 'i-ph-arrow-down',
  arrowLeft: 'i-ph-arrow-left',
  arrowRight: 'i-ph-arrow-right',
  arrowUp: 'i-ph-arrow-up',
  caution: 'i-ph-warning-circle',
  check: 'i-ph-check',
  chevronDoubleLeft: 'i-ph-caret-double-left',
  chevronDoubleRight: 'i-ph-caret-double-right',
  chevronDown: 'i-ph-caret-down',
  chevronLeft: 'i-ph-caret-left',
  chevronRight: 'i-ph-caret-right',
  chevronUp: 'i-ph-caret-up',
  close: 'i-ph-x',
  copy: 'i-ph-copy',
  copyCheck: 'i-ph-check-circle',
  dark: 'i-ph-moon',
  drag: 'i-ph-dots-six-vertical',
  ellipsis: 'i-ph-dots-three',
  error: 'i-ph-x-circle',
  external: 'i-ph-arrow-up-right',
  eye: 'i-ph-eye',
  eyeOff: 'i-ph-eye-slash',
  file: 'i-ph-file',
  folder: 'i-ph-folder',
  folderOpen: 'i-ph-folder-open',
  hash: 'i-ph-hash',
  info: 'i-ph-info',
  light: 'i-ph-sun',
  loading: 'i-ph-circle-notch',
  menu: 'i-ph-list',
  minus: 'i-ph-minus',
  panelClose: 'i-ph-caret-left',
  panelOpen: 'i-ph-caret-right',
  plus: 'i-ph-plus',
  reload: 'i-ph-arrow-counter-clockwise',
  search: 'i-ph-magnifying-glass',
  stop: 'i-ph-square',
  success: 'i-ph-check-circle',
  system: 'i-ph-monitor',
  tip: 'i-ph-lightbulb',
  upload: 'i-ph-upload',
  warning: 'i-ph-warning',
}
```

## Shared Sizing System

All components with `size` follow the Golden Rule. The shared `sizes` object:

```ts
// src/theme/sizes.ts
export const sizes = {
  xs: { base: 'px-[1em] py-[0.5em] text-xs gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]', leadingIcon: 'size-3.5', trailingIcon: 'size-3.5' },
  sm: { base: 'px-[1em] py-[0.5em] text-sm gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]', leadingIcon: 'size-4', trailingIcon: 'size-4' },
  md: { base: 'px-[1em] py-[0.5em] text-base gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
  lg: { base: 'px-[1em] py-[0.5em] text-lg gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]', leadingIcon: 'size-5', trailingIcon: 'size-5' },
  xl: { base: 'px-[1em] py-[0.5em] text-xl gap-[0.5em] leading-normal min-h-[calc(1lh+1em)]', leadingIcon: 'size-5.5', trailingIcon: 'size-5.5' },
}
```

## Button Theme

```ts
// src/theme/button.ts
{
  slots: {
    base: 'cursor-pointer rounded-[8px] transition duration-300 font-normal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2',
  },
  compoundVariants: [
    // primary solid
    { color: 'primary', variant: 'solid', class: 'text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-300 active:bg-slate-900 dark:active:bg-slate-100 disabled:bg-slate-900 dark:disabled:bg-slate-100 focus-visible:outline-slate-500' },
    // neutral solid
    { color: 'neutral', variant: 'solid', class: 'text-white dark:text-white bg-slate-600 dark:bg-slate-600 hover:bg-gray-500 dark:hover:bg-gray-200 active:bg-gray-600 dark:active:bg-gray-300 disabled:bg-gray-600 dark:disabled:bg-gray-300 focus-visible:outline-gray-400' },
    // secondary solid (inverse of primary: white bg in light, dark bg in dark)
    { color: 'secondary', variant: 'solid', class: 'text-(--ui-text) dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-white dark:active:bg-slate-800 disabled:bg-white dark:disabled:bg-slate-800 focus-visible:outline-slate-400' },
    // soft (shared — transparent for all three)
    { color: ['primary', 'neutral', 'secondary'], variant: 'soft', class: 'text-gray-800 dark:text-gray-200 bg-slate-400/20 hover:bg-slate-400/30 active:bg-slate-400/20' },
    // subtle primary/neutral (transparent)
    { color: ['primary', 'neutral'], variant: 'subtle', class: 'text-gray-800 dark:text-gray-200 bg-slate-400/20 hover:bg-slate-400/30 active:bg-slate-400/20 ring-gray-500/30 dark:ring-gray-300/20' },
    // subtle secondary (white bg + inset border)
    { color: 'secondary', variant: 'subtle', class: 'text-(--ui-text) dark:text-slate-100 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:bg-white dark:active:bg-slate-800 ring-inset ring-(--ui-border)' },
  ],
  variants: { size: sizes },
  defaultVariants: { color: 'primary', variant: 'solid', size: 'md' },
}
```

## Input Commons (shared by input, textarea, select, selectMenu, inputMenu, inputTags)

```ts
// src/theme/input-commons.ts
const inputBase = 'placeholder:text-slate-500/80 rounded-[6px] py-[0.5em]! transition duration-200'

const inputSlots = {
  base: inputBase,
  leading: 'ml-[0.1em]!',
  trailing: 'mr-[0.1em]!',
  trailingIcon: 'text-(--ui-text)!',
}
```

### Input Focus Ring (shadow-based, not outline)

```ts
// Focus ring for primary/error/success with outline and subtle variants
{ color: 'primary', variant: ['outline', 'subtle'], class: { base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-slate-500/80 focus-visible:shadow-slate-500/20' } },
{ color: 'error', variant: ['outline', 'subtle'], class: { base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-rose-500/80 focus-visible:shadow-rose-500/20' } },
{ color: 'success', variant: ['outline', 'subtle'], class: { base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-emerald-500/80 focus-visible:shadow-emerald-500/20' } },
```

### Outline Variant

Uses `border` + `ring-0!` instead of Nuxt UI's default ring-based outline. Border colors: `slate-500/30`, `rose-500/30`, `emerald-500/30`.

### Fixed Size Overrides

Neutralizes Nuxt UI's responsive `md:text-*` classes that would override the golden rule on desktop:

```ts
{ fixed: false, size: 'xs', class: 'md:text-xs' },
{ fixed: false, size: 'sm', class: 'md:text-sm' },
{ fixed: false, size: 'md', class: 'md:text-base' },
{ fixed: false, size: 'lg', class: 'md:text-lg' },
```

## Badge Theme

```ts
// src/theme/badge.ts
{
  slots: { base: 'rounded-full' },
  variants: {
    size: {
      xs: { base: 'rounded-full text-xs px-[0.75em] py-[0.35em] gap-[0.5em]', leadingIcon: 'size-3', trailingIcon: 'size-3' },
      sm: { base: 'rounded-full text-sm px-[0.75em] py-[0.35em] gap-[0.5em]', leadingIcon: 'size-3.5', trailingIcon: 'size-3.5' },
      md: { base: 'rounded-full text-base px-[0.75em] py-[0.35em] gap-[0.5em]', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      lg: { base: 'rounded-full text-lg px-[0.75em] py-[0.35em] gap-[0.5em]', leadingIcon: 'size-4.5', trailingIcon: 'size-4.5' },
      xl: { base: 'rounded-full text-xl px-[0.75em] py-[0.35em] gap-[0.5em]', leadingIcon: 'size-5', trailingIcon: 'size-5' },
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: 'text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100' },
    { color: 'neutral', variant: 'solid', class: 'text-white dark:text-white bg-slate-600 dark:bg-slate-600' },
    { color: 'secondary', variant: 'solid', class: 'text-(--ui-text) dark:text-slate-100 bg-white dark:bg-slate-800' },
    { color: 'primary', variant: 'outline', class: 'text-slate-900 dark:text-slate-100 ring-slate-900/50 dark:ring-slate-100/50' },
    { color: 'neutral', variant: 'outline', class: 'text-slate-600 dark:text-slate-400 ring-slate-500/30 dark:ring-slate-400/30' },
    // secondary outline: no override — uses Nuxt UI default with slate palette
    { color: ['primary', 'neutral', 'secondary'], variant: 'soft', class: 'text-gray-800 dark:text-gray-200 bg-slate-400/20' },
    { color: ['primary', 'neutral'], variant: 'subtle', class: 'text-gray-800 dark:text-gray-200 bg-slate-400/20 ring-gray-500/30 dark:ring-gray-300/20' },
    { color: 'secondary', variant: 'subtle', class: 'text-(--ui-text) dark:text-slate-100 bg-white dark:bg-slate-800 ring-inset ring-(--ui-border)' },
  ],
}
```

Note: `rounded-full` must be in each size variant to override Nuxt UI's per-size `rounded-sm`/`rounded-md`.

## Alert Theme

```ts
// src/theme/alert.ts
{
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: { root: 'text-white dark:text-slate-900 bg-slate-900 dark:bg-slate-100' } },
    { color: 'neutral', variant: 'solid', class: { root: 'text-white dark:text-white bg-slate-600 dark:bg-slate-600' } },
    { color: 'primary', variant: 'outline', class: { root: 'text-slate-900 dark:text-slate-100 ring-slate-900/25 dark:ring-slate-100/25' } },
    { color: 'neutral', variant: 'outline', class: { root: 'text-slate-600 dark:text-slate-400 ring-slate-500/25 dark:ring-slate-400/25' } },
    { color: 'primary', variant: 'soft', class: { root: 'text-gray-800 dark:text-gray-200 bg-slate-400/20' } },
    { color: 'neutral', variant: 'soft', class: { root: 'text-gray-800 dark:text-gray-200 bg-slate-400/10' } },
    { color: 'primary', variant: 'subtle', class: { root: 'text-gray-800 dark:text-gray-200 bg-slate-400/20 ring-gray-500/30 dark:ring-gray-300/20' } },
    { color: 'neutral', variant: 'subtle', class: { root: 'text-gray-800 dark:text-gray-200 bg-slate-400/10 ring-gray-500/20 dark:ring-gray-300/15' } },
  ],
}
```

Alert has no `size` prop in Nuxt UI, so the golden rule does not apply.

## Tabs Theme

```ts
// src/theme/tabs.ts
{
  variants: {
    variant: {
      pill: { list: 'rounded-full', indicator: 'rounded-full shadow-none', trigger: 'cursor-pointer' },
      link: { trigger: 'cursor-pointer' },
    },
    size: {
      xs: { trigger: 'px-2 py-1 text-xs gap-1', leadingIcon: 'size-3' },
      sm: { trigger: 'px-2.5 py-1.5 text-sm gap-1.5', leadingIcon: 'size-3.5' },
      md: { trigger: 'px-3 py-1.5 text-base gap-1.5', leadingIcon: 'size-4' },
      lg: { trigger: 'px-3 py-2 text-lg gap-2', leadingIcon: 'size-4.5' },
      xl: { trigger: 'px-3 py-2 text-xl gap-2', leadingIcon: 'size-5' },
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'pill', class: { indicator: 'bg-slate-900 dark:bg-slate-100', trigger: 'data-[state=active]:text-white dark:data-[state=active]:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500' } },
    { color: 'primary', variant: 'link', class: { indicator: 'bg-slate-900 dark:bg-slate-100', trigger: 'data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-slate-500' } },
  ],
}
```

## InputTags Theme

```ts
// src/theme/input-tags.ts
{
  slots: {
    base: inputBase,
    leading: 'ml-[0.1em]!',
    trailing: 'mr-[0.1em]!',
    trailingIcon: 'text-(--ui-text)!',
    item: 'rounded-full ring-0 pl-[0.6em] leading-none pr-[3px] py-0.5 gap-[0.25em] font-normal bg-slate-400/20 text-gray-800 dark:text-gray-200',
    itemDelete: 'rounded-full cursor-pointer hover:bg-slate-400/30 text-gray-800 dark:text-gray-200 p-0.5',
  },
  variants: {
    size: {
      xs: { ...sizes.xs, item: 'text-xs', itemDeleteIcon: 'size-3' },
      sm: { ...sizes.sm, item: 'text-sm', itemDeleteIcon: 'size-3.5' },
      md: { ...sizes.md, item: 'text-base', itemDeleteIcon: 'size-4' },
      lg: { ...sizes.lg, item: 'text-lg', itemDeleteIcon: 'size-4.5' },
      xl: { ...sizes.xl, item: 'text-xl', itemDeleteIcon: 'size-5' },
    },
  },
}
```

Focus ring uses `has-focus-visible:` instead of `focus-visible:` since focus is on the inner input, not the root element.

## Menu Items (shared by dropdownMenu, select, selectMenu, inputMenu)

```ts
// src/theme/menu-items.ts
const menuItemSlots = {
  content: 's-floating-menu rounded-lg',
  group: 'p-1',
  item: 'cursor-pointer items-center font-normal data-disabled:opacity-50 before:transition-none',
  itemLeadingIcon: 'text-highlighted',
}

const menuItemSizes = {
  xs: { item: 'p-[0.5em] text-xs gap-[0.5em]', itemLeadingIcon: 'size-3.5', itemTrailingIcon: 'size-3.5' },
  sm: { item: 'p-[0.5em] text-sm gap-[0.5em]', itemLeadingIcon: 'size-4', itemTrailingIcon: 'size-4' },
  md: { item: 'p-[0.5em] text-base gap-[0.5em]', itemLeadingIcon: 'size-4.5', itemTrailingIcon: 'size-4.5' },
  lg: { item: 'p-[0.5em] text-lg gap-[0.5em]', itemLeadingIcon: 'size-5', itemTrailingIcon: 'size-5' },
  xl: { item: 'p-[0.5em] text-xl gap-[0.5em]', itemLeadingIcon: 'size-5.5', itemTrailingIcon: 'size-5.5' },
}
```

Note: menu item icons are one step larger than button icons at the same size (e.g., md = size-4.5 vs size-4 for buttons).

**Highlight background** is NOT in menuItemSlots (to avoid CSS specificity conflicts with Nuxt UI compound variants for colored items like `color: 'error'`). Instead, each component adds it in its own `active: false` variant:
- **dropdownMenu**: `data-highlighted:before:bg-elevated` (same selector as Nuxt UI compound variants, so `bg-error/10` wins)
- **select, selectMenu, inputMenu**: `data-highlighted:not-data-disabled:before:bg-elevated`

## Select Commons

Select and SelectMenu add on top of input commons:

- `cursor-pointer` on base
- Open-state ring: `data-[state=open]:shadow-[0_0_0_3.5px]!` matching the focus ring
- Outline hover: subtle background on hover (`hover:bg-slate-500/5`)
- Combined sizes: merges input sizes with menu item sizes

## Popover Theme

```ts
// src/theme/popover.ts
{
  slots: { content: 's-floating-menu rounded-lg ring-0' },
}
```

## Slideover Theme (used by SModal)

```ts
// src/theme/slideover.ts
{
  slots: {
    overlay: 'fixed inset-0 bg-neutral-800/90 backdrop-blur-sm',
    content: 'p-0 divide-y-0 !rounded-xl',
    body: '!p-0',
    header: 'flex-shrink-0',
    footer: 'flex-shrink-0',
  },
  compoundVariants: [
    { transition: true, side: 'top', class: {
      content: 'data-[state=open]:animate-[slide-soft-from-bottom_500ms...] sm:data-[state=open]:animate-[slide-soft-from-top_500ms...]',
      overlay: 'data-[state=open]:animate-[fade-in_500ms...] data-[state=closed]:animate-[fade-out_500ms...]',
    }},
  ],
}
```

## FormField Theme

```ts
// src/theme/form-field.ts
{
  slots: {
    error: 'mt-1 text-error text-xs',
    label: 'text-slate-600',
  },
}
```

## CSS: base.css

```css
@import "@fullbrains/vimana";       /* Font theme */
@import "./animations.css";          /* Spinner + modal animations */

:root { --font-sans: vimana; }

/* Font smoothing */
@layer base {
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
}

/* Light mode text color */
:root:not(.dark) { --ui-text: var(--color-slate-900); }

/* Floating menu shadow (used by dropdowns, selects, popovers) */
.s-floating-menu {
  border: none;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1);
}
.dark .s-floating-menu {
  box-shadow: 0 0 0 1px rgba(255,255,255,0.1), 0 10px 15px -3px rgba(0,0,0,0.25), 0 4px 6px -4px rgba(0,0,0,0.2);
}
```

## Module Internals

The Nuxt module (`src/module.ts`):

1. Merges `stemAppConfig` into `nuxt.options.appConfig.ui` using `defu` for theme objects and `Object.assign` for colors (to override Nuxt UI defaults like `secondary: 'blue'`)
2. Auto-registers components from `src/components/`
3. Auto-imports composables from `src/composables/`
4. Injects `src/css/base.css` before app CSS
5. Writes a `stem-classes.html` template into `.nuxt/` and adds it as a Tailwind `@source` so all theme classes get generated
6. Allows Vite to serve Stem source files (needed for linked/local installs)
