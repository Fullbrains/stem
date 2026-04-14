# Stem Theming Reference

Complete theme configuration for every component overridden by `@fullbrains/stem`.

## Custom Color Palettes

Stem defines three custom color palettes with different light/dark mappings. The `@theme static` block is in `src/css/colors-theme.css` and injected into `ui.css` by the module at build time. Dark overrides are in `src/css/colors.css` (runtime CSS).

| Palette | Role | Light | Dark |
|---------|------|-------|------|
| **stem** | primary | tar (custom oklch) | zinc |
| **iron** | secondary, UI surfaces, borders | slate | zinc |
| **muto** | neutral text | gray | zinc |

```ts
// src/config.ts
export const stemColors = {
  primary: 'stem',
  secondary: 'iron',
  neutral: 'muto',
  success: 'emerald',
  error: 'rose',
}
```

Stem bypasses Nuxt UI's CSS-variable-based semantic colors with hardcoded palette classes. This ensures that `primary` always renders as stem-900/stem-100 regardless of Nuxt UI's internal color resolution.

## Avatar Theme

```ts
// src/theme/avatar.ts
{
  slots: {
    root: 'bg-iron-500/10',
    fallback: 'leading-normal',
  },
}
```

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

## Checkbox Theme

```ts
// src/theme/checkbox.ts
{
  compoundVariants: [
    {
      color: 'primary',
      class: {
        indicator: 'bg-stem-900 dark:bg-stem-100',
        base: 'focus-visible:outline-iron-500',
      },
    },
  ],
}
```

## Button Theme

```ts
// src/theme/button.ts
{
  slots: {
    base: 'cursor-pointer select-none s-corner [--s-radius:8px] transition duration-300 font-normal disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2',
  },
  compoundVariants: [
    // primary solid
    { color: 'primary', variant: 'solid', class: 'text-white dark:text-stem-900 bg-stem-900 dark:bg-stem-100 hover:bg-stem-800 dark:hover:bg-stem-300 active:bg-stem-900 dark:active:bg-stem-100 disabled:bg-stem-900 dark:disabled:bg-stem-100 focus-visible:outline-iron-500' },
    // neutral solid
    { color: 'neutral', variant: 'solid', class: 'text-white dark:text-white bg-muto-600 dark:bg-muto-600 hover:bg-muto-500 dark:hover:bg-muto-700 active:bg-muto-600 dark:active:bg-muto-600 disabled:bg-muto-600 dark:disabled:bg-muto-300 focus-visible:outline-muto-400' },
    // secondary solid (inverse of primary: white bg in light, dark bg in dark)
    { color: 'secondary', variant: 'solid', class: 'text-(--ui-text) dark:text-iron-100 bg-white dark:bg-iron-800 hover:bg-iron-50 dark:hover:bg-iron-700 active:bg-white dark:active:bg-iron-800 disabled:bg-white dark:disabled:bg-iron-800 focus-visible:outline-iron-400' },
    // error solid
    { color: 'error', variant: 'solid', class: 'bg-rose-600 dark:bg-rose-400 hover:bg-rose-700 dark:hover:bg-rose-500 active:bg-rose-600 dark:active:bg-rose-400' },
    // soft (shared)
    { color: ['primary', 'neutral', 'secondary'], variant: 'soft', class: 'text-muto-800 dark:text-muto-200 bg-iron-400/20 hover:bg-iron-400/30 active:bg-iron-400/20' },
    // subtle primary/neutral
    { color: ['primary', 'neutral'], variant: 'subtle', class: 'text-muto-800 dark:text-muto-200 bg-iron-400/20 hover:bg-iron-400/30 active:bg-iron-400/20 ring-muto-500/30 dark:ring-muto-300/20' },
    // subtle secondary (white bg + inset border)
    { color: 'secondary', variant: 'subtle', class: 'text-(--ui-text) dark:text-iron-100 bg-white dark:bg-iron-800 hover:bg-iron-50 dark:hover:bg-iron-700 active:bg-white dark:active:bg-iron-800 ring-inset ring-(--ui-border)' },
  ],
  variants: { size: sizes },
  defaultVariants: { color: 'primary', variant: 'solid', size: 'md' },
}
```

## Input Commons (shared by input, textarea, select, selectMenu, inputMenu, inputTags)

```ts
// src/theme/input-commons.ts
const inputBase = 'placeholder:text-iron-500/80 placeholder:select-none s-corner [--s-radius:6px] py-[0.5em]! transition duration-200'

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
{ color: 'primary', variant: ['outline', 'subtle'], class: { base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-iron-500/80 focus-visible:shadow-iron-500/20' } },
{ color: 'error', variant: ['outline', 'subtle'], class: { base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-rose-500/80 focus-visible:shadow-rose-500/20' } },
{ color: 'success', variant: ['outline', 'subtle'], class: { base: 'focus-visible:shadow-[0_0_0_3.5px]! focus:border-emerald-500/80 focus-visible:shadow-emerald-500/20' } },
```

### Outline Variant

Uses `border` + `ring-0!` instead of Nuxt UI's default ring-based outline. Border colors: `iron-500/30`, `rose-500/30`, `emerald-500/30`.

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
  slots: { base: 'rounded-full font-normal' },
  variants: {
    size: {
      xs: { base: 'rounded-full text-xs px-[0.75em] py-[0.35em] gap-[0.5em]', leadingIcon: 'size-3 shrink-0', trailingIcon: 'size-3 shrink-0' },
      // sm, md, lg, xl follow same pattern with larger text/icons
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: 'text-white dark:text-stem-900 bg-stem-900 dark:bg-stem-100' },
    { color: 'neutral', variant: 'solid', class: 'text-white dark:text-white bg-stem-600 dark:bg-stem-600' },
    { color: 'secondary', variant: 'solid', class: 'text-(--ui-text) dark:text-iron-100 bg-white dark:bg-iron-800' },
    { color: 'error', variant: 'solid', class: 'bg-rose-600 dark:bg-rose-600' },
    { color: 'primary', variant: 'outline', class: 'text-stem-900 dark:text-stem-100 ring-stem-900/50 dark:ring-stem-100/50' },
    { color: 'neutral', variant: 'outline', class: 'text-stem-600 dark:text-stem-400 ring-iron-500/30 dark:ring-iron-400/30' },
    { color: ['primary', 'neutral', 'secondary'], variant: 'soft', class: 'text-muto-800 dark:text-muto-200 bg-iron-400/20' },
    { color: ['primary', 'neutral'], variant: 'subtle', class: 'text-muto-800 dark:text-muto-200 bg-iron-400/20 ring-muto-500/30 dark:ring-muto-300/20' },
    { color: 'secondary', variant: 'subtle', class: 'text-(--ui-text) dark:text-iron-100 bg-white dark:bg-iron-800 ring-inset ring-(--ui-border)' },
  ],
}
```

Note: `rounded-full` must be in each size variant to override Nuxt UI's per-size `rounded-sm`/`rounded-md`.

## Alert Theme

```ts
// src/theme/alert.ts
{
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: { root: 'text-white dark:text-stem-900 bg-stem-900 dark:bg-stem-100' } },
    { color: 'neutral', variant: 'solid', class: { root: 'text-white dark:text-white bg-stem-600 dark:bg-stem-600' } },
    { color: 'primary', variant: 'outline', class: { root: 'text-stem-900 dark:text-stem-100 ring-stem-900/25 dark:ring-stem-100/25' } },
    { color: 'neutral', variant: 'outline', class: { root: 'text-stem-600 dark:text-stem-400 ring-iron-500/25 dark:ring-iron-400/25' } },
    { color: 'primary', variant: 'soft', class: { root: 'text-muto-800 dark:text-muto-200 bg-iron-400/20' } },
    { color: 'neutral', variant: 'soft', class: { root: 'text-muto-800 dark:text-muto-200 bg-iron-400/10' } },
    { color: 'primary', variant: 'subtle', class: { root: 'text-muto-800 dark:text-muto-200 bg-iron-400/20 ring-muto-500/30 dark:ring-muto-300/20' } },
    { color: 'neutral', variant: 'subtle', class: { root: 'text-muto-800 dark:text-muto-200 bg-iron-400/10 ring-muto-500/20 dark:ring-muto-300/15' } },
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
    { color: 'primary', variant: 'pill', class: { indicator: 'bg-stem-900 dark:bg-stem-100', trigger: 'data-[state=active]:text-white dark:data-[state=active]:text-stem-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iron-500' } },
    { color: 'primary', variant: 'link', class: { indicator: 'bg-stem-900 dark:bg-stem-100', trigger: 'data-[state=active]:text-stem-900 dark:data-[state=active]:text-stem-100 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-iron-500' } },
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
    item: 'rounded-full ring-0 pl-[0.6em] leading-none pr-[3px] py-0.5 gap-[0.25em] font-normal bg-iron-400/20 text-muto-800 dark:text-muto-200',
    itemDelete: 'rounded-full cursor-pointer hover:bg-iron-400/30 text-muto-800 dark:text-muto-200 p-0.5',
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
  content: 's-floating-menu s-corner [--s-radius:10px]',
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
- Outline hover: subtle background on hover (`hover:bg-iron-500/5`)
- Combined sizes: merges input sizes with menu item sizes

## FieldGroup Theme

```ts
// src/theme/field-group.ts
{
  base: 's-field-group',
}
```

Adds the `s-field-group` class so that `corner-shape.css` can zero out inner corners on grouped elements automatically.

## FormField Theme

```ts
// src/theme/form-field.ts
{
  slots: {
    error: 'mt-1 text-error text-xs',
    label: 'text-iron-600',
  },
}
```

## Popover Theme

```ts
// src/theme/popover.ts
{
  slots: { content: 's-floating-menu s-corner [--s-radius:10px] ring-0' },
}
```

## Slideover Theme (used by SModal)

```ts
// src/theme/slideover.ts
{
  slots: {
    overlay: 'fixed inset-0 bg-neutral-800/90 backdrop-blur-sm',
    content: 'p-0 divide-y-0 s-corner [--s-radius:12px]',
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

## Corner Shape — superellipse via `s-corner` + `--s-radius`

`src/css/corner-shape.css` provides the `s-corner` class system for superellipse corners via `@supports (corner-shape: squircle)`.

### How it works

Add class `s-corner` and set `--s-radius` on the element:

```html
<div class="s-corner [--s-radius:8px]">...</div>
```

- **Base**: `border-radius: var(--s-radius)`
- **@supports**: `border-radius: calc(var(--s-radius) * 1.5); corner-shape: superellipse(1.5);`

The ×1.5 multiplier compensates for superellipse's tighter visual curve.

### Usage in Stem themes

| Component | Radius |
|-----------|--------|
| Button | `s-corner [--s-radius:8px]` |
| Inputs (input, select, textarea, inputTags) | `s-corner [--s-radius:6px]` |
| Input container (SColorPicker) | `s-corner [--s-radius:6px]` |
| Floating menus (dropdown, select, inputMenu) | `s-corner [--s-radius:10px]` |
| Popover | `s-corner [--s-radius:10px]` |
| Slideover | `s-corner [--s-radius:12px]` |
| SModal | `s-corner [--s-radius:16px]` |
| SColorPicker popover | `s-corner [--s-radius:8px]` |

### UFieldGroup support — `s-field-group`

The `fieldGroup` theme adds `s-field-group` to the base class automatically. CSS in `corner-shape.css` handles zeroing inner corners for grouped elements:

```css
@supports (corner-shape: squircle) {
    .s-field-group > :not(:only-child):first-child .s-corner { border-start-end-radius: 0; border-end-end-radius: 0; }
    .s-field-group > :not(:only-child):last-child .s-corner { border-start-start-radius: 0; border-end-start-radius: 0; }
    .s-field-group > :not(:only-child):not(:first-child):not(:last-child) .s-corner { border-radius: 0; }
}
```

### rounded-full protection

`.rounded-full` is explicitly reset inside `@supports` so circles/pills (badges, disc buttons, rounded buttons, tags) are never affected:

```css
.rounded-full { border-radius: 9999px !important; corner-shape: initial !important; }
```

### Standalone `s-corner-*` utilities

Also available: `s-corner-squircle`, `s-corner-bevel`, `s-corner-scoop`, `s-corner-notch`, `s-corner-round`, `s-corner-superellipse-{2..10}`.

## CSS: base.css

```css
@import "@fullbrains/vimana";       /* Font theme */
@import "./animations.css";          /* Modal animations */
@import "./colors.css";              /* Dark mode palette overrides */
@import "./corner-shape.css";        /* s-corner + s-corner-* utilities */

:root { --font-sans: vimana; }

/* Font smoothing */
@layer base {
  *, *::before, *::after {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }
}

/* Custom border and text color variables */
:root { --ui-border: color-mix(in oklch, var(--color-iron-500) 20%, transparent); }
:root:not(.dark) { --ui-text: var(--color-stem-900); }

/* Floating menu shadow (used by dropdowns, selects, popovers) */
.s-floating-menu { ... }

/* Outline utilities (use iron-500 for borders/shadows) */
.s-outline { border: 1px solid color-mix(in oklch, var(--color-iron-500) 30%, transparent); ... }
.s-outline-hover { transition: border-color 200ms, box-shadow 200ms; }
.s-outline-focus, .s-outline-focus-within:focus-within, .s-outline-hover:hover {
  border: 1px solid color-mix(in oklch, var(--color-iron-500) 80%, transparent);
  box-shadow: 0 0 0 3.5px color-mix(in oklch, var(--color-iron-500) 20%, transparent);
}
```

## Module Internals

The Nuxt module (`src/module.ts`):

1. Merges `stemAppConfig` into `nuxt.options.appConfig.ui` using `defu` for theme objects and `Object.assign` for colors (to override Nuxt UI defaults like `secondary: 'blue'`)
2. Auto-registers components from `src/components/`
3. Auto-imports composables from `src/composables/`
4. Injects `src/css/base.css` before app CSS
5. Writes a `stem-classes.html` template into `.nuxt/` and adds it as a Tailwind `@source` so all theme classes get generated
6. **Injects `src/css/colors-theme.css`** (the `@theme static` block with palette definitions) into `.nuxt/ui.css` at build time, so Tailwind recognizes stem/iron/muto as valid color palettes
7. Allows Vite to serve Stem source files (needed for linked/local installs)
