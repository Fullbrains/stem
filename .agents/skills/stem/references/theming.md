# Stem Theming Reference

How the theme of `@fullbrains/stem` is built: the scale, its CSS, the corners, the colours, each Nuxt UI theme override and the module that injects them. Component APIs are in `components.md`.

| Where | What |
|-------|------|
| `src/theme/scale.ts` | The scale's numbers, types and helpers |
| `src/css/scale.css` | The same numbers as CSS classes and variables |
| `src/theme/sizes.ts` | Size variants shared by the themes |
| `src/theme/*.ts` | One Nuxt UI theme override per file, collected in `src/theme/index.ts` as `stem` |
| `src/css/*.css` | Runtime CSS, imported by `base.css` |
| `src/config.ts`, `src/stem-config.ts` | `stemColors`, `stemIcons`, and the `appConfig.ui` object |
| `src/module.ts`, `src/standalone.ts` | The Nuxt modules |

## The scale

One table for every control with a `size` (`stemScale`, px):

| size | text | icon (= line height) | space (padding, gap) | radius |
|------|------|----------------------|----------------------|--------|
| xs | 12 | 12 | 6 | 4 |
| sm | 14 | 16 | 8 | 6 |
| md | 16 | 20 | 10 | 8 |
| lg | 18 | 24 | 12 | 10 |
| xl | 20 | 28 | 14 | 12 |

The line height equals the icon, so text and icon share one row and a control is exactly `icon + 2 × padding-y` tall. Padding and gap are half the icon.

**The space scale** (`StemSpace`) runs past the sizes at both ends:

| step | `0` | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` | `4xl` | `5xl` |
|------|-----|-------|------|------|------|------|------|-------|-------|-------|-------|
| px | 0 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 18 | 20 | 22 |

`2xs` and `0` are for tighter controls, `2xl`–`5xl` for containers (an alert's or a modal's padding). There is no text, icon or radius step outside xs–xl.

**Default heights.** The numbers above are a control with the size's own space. Most controls default to space-y one step below (`useStemScale(props, {spaceY: '-1'})` in the wrapper); fields keep the size's own.

| | xs | sm | md | lg | xl |
|--|----|----|----|----|----|
| Button, badge, tab, checkbox / switch / radio row (`spaceY: '-1'`) | 20 | 28 | 36 | 44 | 52 |
| Input, select, select menu, input menu, tags, colour picker, search bar, menu item (own space) | 24 | 32 | 40 | 48 | 56 |
| Textarea padding-y (`spaceY: '+1'`) | 8 | 10 | 12 | 14 | 16 |

These defaults live in the `S*` wrappers, not in the theme: a bare `UButton` gets the size's own space (md: 40px).

### `scale.ts`

```ts
export type StemSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type StemSpace = 0 | '0' | '2xs' | StemSize | '2xl' | '3xl' | '4xl' | '5xl'
export type StemSpaceShift = '+1' | … | '+6' | '-1' | … | '-6' | number
export type StemOpticalLabel = 'auto' | 'always' | 'never'
```

The types are written out as literals, not derived (`keyof typeof stemScale`, template types): Vue reads a prop's runtime type from its TS type and cannot resolve those.

| Export | What it does |
|--------|--------------|
| `stemScale`, `stemSizes` | The table and its keys |
| `stemScaleDefaults` | Every scale prop `undefined`, for `withDefaults`: an absent prop stays absent, so it can be inherited |
| `stemSizeStep(from, by)`, `stemSpaceStep(from, by)` | A size / space `by` steps away, clamped to the scale |
| `stemSpaceShift(v)` | The shift of a relative value in steps, `null` for an absolute one (a signed string or a non-zero number is a shift) |
| `stemSpacePx(v)` | A space step in px |
| `stemSizeClass(size)` | `s-size-{size}` |
| `stemScaleClasses(props)` | The single-axis classes: `s-space-*`, `s-space-x-*`, `s-space-y-*`, `s-text-*`, `s-icon-*` (tokens only), `s-roundness-*`, `s-pill`, then always `s-optical-label-{mode}` and `s-control` |
| `stemScaleStyle(props)` | `{'--s-icon-size': …}` for an `iconSize` that is not a token, else `undefined` |
| `stemScaleVars(size, props)` | The whole scale as inline custom properties, for a root that cannot drop its size class (SAlert) |
| `stemOpticalMode(v)` | The mode of `optical-label`; `false` → `never`, anything else unknown → `auto` |
| `stemLabelShift` | The label trim classes: `iconStart`, `iconEnd`, `aloneStart`, `aloneEnd`, `alone` |

`s-control` marks a Stem control: the alert theme sizes the bare `UButton`s Nuxt UI renders in a toast, and leaves `.s-control` ones alone.

The Tailwind classes that read the scale, shared by every theme:

```ts
export const stemScaleText = 'text-(length:--s-text) leading-(--s-icon-size)'
export const stemScalePadding = 'px-[calc(var(--s-px)+var(--s-pill-x,0px))] py-(--s-py) gap-(--s-gap)'
export const stemScaleIcon = 'size-(--s-icon-size) shrink-0'
```

## `scale.css`

Each class declares custom properties on the component's root; the theme reads them, so an element nested inside the root (the `<input>` of UInput) inherits them. Everything is in `@layer components` (a Tailwind utility on the same element still wins) except `s-pill-full`, `--s-device-px` and `s-line-text`.

| Variable | Meaning |
|----------|---------|
| `--s-text` | Font size |
| `--s-icon-size` | Icon size, and the line height |
| `--s-px`, `--s-py` | Padding |
| `--s-gap` | Gap between icon and label; follows space-x |
| `--s-radius` | Squircle radius (read by `s-corner`) |
| `--s-pill-x` | A pill's extra horizontal padding; `0px` on every `[class*="s-size-"]` |
| `--s-corner-shape` | `round` on a pill; unset otherwise |
| `--s-device-px` | The device pixel in CSS px: `1px`, `0.5px` at 2dppx, `1px / 3` at 3dppx |

| Class | Sets |
|-------|------|
| `.s-size-{xs…xl}` | All six: `--s-text`, `--s-icon-size`, `--s-px`, `--s-py`, `--s-gap`, `--s-radius` |
| `.s-space-{0, 2xs … 5xl}` | `--s-px`, `--s-py`, `--s-gap` |
| `.s-space-x-*` | `--s-px`, `--s-gap` |
| `.s-space-y-*` | `--s-py` |
| `.s-text-{xs…xl}` | `--s-text` |
| `.s-icon-{xs…xl}` | `--s-icon-size` |
| `.s-roundness-{xs…xl}` | `--s-radius` |
| `.s-pill` | `--s-radius: 9999px`, `--s-corner-shape: round`, `--s-pill-x` |
| `.s-optical-label-{auto, always, never}` | The four `--s-label-*` trims |
| `.s-pill-full` | `width: calc(100% + 2 * var(--s-pill-x, 0px)); max-width: none` |
| `.s-line-text` | `--s-line-room`, `--s-line-top`, `--s-line-bottom` |

Order matters: the single-axis classes come after `s-size-*` and `s-space-*` in the file, so they override them. Keep the numbers in step with `scale.ts`.

### Pill

```css
.s-pill {
    --s-radius: 9999px;
    --s-corner-shape: round;
    --s-pill-x: calc((var(--s-icon-size) + 2 * var(--s-py)) * 0.08);
}
```

A pill's round ends take more of the corners than a squircle's, so the content would look closer to the edge. `--s-pill-x` (8% of the height) is added to the horizontal padding and taken back as a negative margin-x (`mx-[calc(var(--s-pill-x,0px)*-1)]` in `sizes.ts`): the layout box and the content stay where a squircle's would be, only the ends spill over the sides. Every sized root resets it to 0, so a control inside a pill does not inherit it.

A negative margin widens only a box whose content sets its width. For a full-width pill use `s-pill-full` instead of `w-full`; on a squircle it is plain `w-full`.

### Optical label

A letter carries air inside its box, so the gap between a label and an icon looks wider than it is; an icon carries air too (a Phosphor icon: 24/256 = 0.09375 of its size).

```css
:root { --s-label-bearing-start: 0.09em; --s-label-bearing-end: var(--s-label-bearing-start); }
:root, .s-optical-label-auto {
    --s-label-icon-start: var(--s-label-bearing-start);
    --s-label-icon-end: var(--s-label-bearing-end);
    --s-label-alone-start: calc(var(--s-icon-size) * -0.09375);
    --s-label-alone-end: calc(var(--s-icon-size) * -0.09375);
}
```

| Variable | Used on | `auto` | `always` | `never` |
|----------|---------|--------|----------|---------|
| `--s-label-icon-start` / `-end` | The label's side facing an icon | the bearing | the bearing | 0 |
| `--s-label-alone-start` / `-end` | A side without an icon | minus the icon's air (space added) | bearing − icon's air | 0 |

The themes apply them as negative margins on the label (`stemLabelShift`), e.g. `ms-[calc(var(--s-label-icon-start,0em)*-1)]`; a negative trim is added space. On a field, where the text has no element of its own, they go into the padding-left (`fieldLabelCompounds`). Setting a bearing to 0 on `:root` turns that side off app-wide.

## `sizes.ts`

Size variants built on the scale, shared by the themes.

- **`sizes`** — for components whose root holds the text (UButton, UBadge, USelect, USelectMenu):

  ```ts
  base: `${stemSizeClass(token)} ${stemScaleText} ${stemScalePadding} mx-[calc(var(--s-pill-x,0px)*-1)]`,
  leadingIcon: stemScaleIcon, trailingIcon: stemScaleIcon,
  ```

- **`fieldSizes`** — for components with a `root` around the field (UInput, UTextarea, UInputMenu, UInputTags). The scale is declared on `root`, where the wrapper's classes land too, and read on `base`. Paddings carry `!`: Nuxt UI's own size and leading / trailing compound variants would otherwise win.
- **`fieldIconCompounds`** — with an icon inside the field the text starts after it: `padding + icon + gap`, as in a button. Compound variants, so they come after the size's padding.
- **`fieldLabelCompounds`** — the optical label trim on the field's start, after `fieldIconCompounds` so they win.
- **`singleLineText`** / **`singleLineFieldCompounds`** — the one-line input text placement rule.

### One-line input text (`singleLineText`)

A button places its label at `(height − text box) / 2` rounded **down** to the screen's pixel; an `<input>` centres its text itself and rounds **up**. Where that half is not on a pixel (sm 7.25, lg 12.75) the input's text sat lower than a button's. So the input gets no centring to do:

```ts
export const singleLineText = 's-line-text py-0! supports-[padding:round(down,1lh,1px)]:leading-[normal]! supports-[padding:round(down,1lh,1px)]:pt-(--s-line-top)! supports-[padding:round(down,1lh,1px)]:pb-(--s-line-bottom)!'
```

```css
.s-line-text {
    --s-line-room: calc(var(--s-line-h, calc(var(--s-icon-size) + 2 * var(--s-py))) - 1lh);
    --s-line-top: round(down, calc(var(--s-line-room) / 2), var(--s-device-px, 1px));
    --s-line-bottom: calc(var(--s-line-room) - var(--s-line-top));
}
```

Line-height `normal` makes the content box exactly the text's; padding-top is half the room left, rounded down to the device pixel; padding-bottom is the rest; the field's height does not change. `--s-line-h` is the field's height (icon + 2 × padding-y unless set). Without CSS `round()` and the `lh` unit the input keeps no padding-y and the browser centres the text. Used by the `input` and `inputMenu` themes, and on Stem's own bare inputs (SSearchBar, SColorPicker).

## Corners (`corner-shape.css`)

Stem's corners are squircles: `s-corner` plus `--s-radius` on the element (from the scale, or set by hand: `s-corner [--s-radius:10px]`).

```css
:root { --s-squircle: 1.5; --s-squircle-radius: 1.6; }

.s-corner { border-radius: var(--s-radius); }

@supports (corner-shape: squircle) {
    .s-corner {
        border-radius: calc(var(--s-radius) * var(--s-squircle-radius));
        corner-shape: var(--s-corner-shape, superellipse(var(--s-squircle)));
    }
}
```

A superellipse leaves the side later than a circle, so the corner looks smaller: where `corner-shape` is supported the radius grows by `--s-squircle-radius` (sm: 6 × 1.6 = 9.6px). Elsewhere it is a plain radius. Both variables are global: one pair for every corner.

| Class | Radius (before the squircle factor) | For |
|-------|--------------------------------------|-----|
| `s-corner` | `--s-radius` | A control |
| `s-corner-outer` | `--s-radius + --s-inset` | A surface around controls: a menu around its items, a tab list around its tabs |
| `s-corner-inner` | `max(0, --s-radius − --s-inset)` | A part inside a control: a checkbox's box |

`--s-inset` is the gap between the two, 4px by default (a menu's group padding, `p-1`); the tabs set 2px, the checkbox half its radius. Nested corners stay concentric.

- **Pill.** `.s-pill` sets `--s-corner-shape: round`, so `s-corner` draws a plain round end.
- **`.rounded-full`** is reset outside `@supports`, with `!important`: `border-radius: 9999px; corner-shape: initial`. A circle or a pill written with Tailwind never becomes a squircle, in every browser.
- **`s-field-group`** (the `fieldGroup` theme's `base`) squares the inner corners of grouped controls: first child loses its end corners, last child its start corners, middle children all four. For `.s-corner` inside `@supports`, for `.rounded-full` always.
- **`.max-sm:rounded-b-none`** is re-declared with `!important` below 40rem, so SModal's bottom sheet keeps its square lower corners over `s-corner`.
- **Standalone utilities** (inside `@supports`): `s-corner-squircle`, `-bevel`, `-scoop`, `-notch`, `-round`, `s-corner-superellipse-{2,3,4,5,6,8,10}`.

## Colours

```ts
export const stemColors = {
  primary: 'stem', secondary: 'iron', neutral: 'muto',
  success: 'emerald', info: 'sky', error: 'rose',
}
```

| Palette | Role | Light (`colors-theme.css`) | Dark (`colors.css`, `.dark`) |
|---------|------|----------------------------|-------------------------------|
| `stem` | primary | tar, a custom oklch ramp (hue 244) | zinc |
| `iron` | secondary, UI surfaces, borders, rings | slate | zinc |
| `muto` | neutral, text | gray | zinc |
| `smut` | muted text | a cool grey in 25-step increments, 50 … 950 (hue 241) | the same values |

- `colors-theme.css` is an `@theme static` block: it registers the palettes with Tailwind. It is not loaded at runtime: the module prepends it to Nuxt UI's generated `ui.css`.
- `colors.css` is runtime CSS: under `.dark` it redeclares `stem`, `iron` and `muto` 50–950, all three with the same zinc values.
- `base.css` sets the semantic variables: `--ui-border` (iron-500 at 20%), and in light mode `--ui-text: gray-800` and `--ui-text-muted: smut-525`; in dark `--ui-text-muted: smut-400`. The two muted greys are the lightest (darkest, in dark) that keep 4.5:1 on the background and on elevated surfaces.

**Light-mode primary is Tailwind `gray`, not the `stem` ramp**: `gray-800` for solid grounds, indicators and text, `gray-700` for hover. Dark mode uses `stem-100` / `stem-300` / `stem-900`. The overrides write palette classes out in full rather than Nuxt UI's semantic ones, so a button, a badge, a tab and an alert of the same colour and variant are the same.

| Colour × variant | Classes (button; badge the same without hover) |
|------------------|-----------------------------------------------|
| primary solid | `bg-gray-800 dark:bg-stem-100`, `text-white dark:text-stem-900`, hover `gray-700` / `stem-300` |
| secondary solid | `bg-white dark:bg-iron-800`, `text-(--ui-text) dark:text-iron-100` |
| neutral solid | button `bg-muto-600`; badge and alert `bg-stem-600` |
| error solid | `bg-rose-600`, dark `rose-400` (button) / `rose-600` (badge) |
| primary / neutral / secondary soft, ghost | `bg-iron-400/20` (ghost: on hover), `text-muto-800 dark:text-muto-200` |
| primary / neutral subtle | soft plus `ring-muto-500/30 dark:ring-muto-300/20` |
| secondary subtle | secondary solid plus `ring-inset ring-(--ui-border)` |
| fields | `iron-500` at 30% (border), 50% (hover), 80% (focus, placeholder, icons) |

`stem-600` is kept for neutral solid and outline in badge and alert: the one place primary and neutral stay distinct in light mode, since `muto` is Tailwind gray.

## Theme overrides

`src/theme/index.ts` exports `stem`: `avatar`, `checkbox`, `radioGroup`, `fieldGroup`, `button`, `input`, `textarea`, `select`, `selectMenu`, `inputMenu`, `inputTags`, `slideover`, `dropdownMenu`, `contextMenu`, `formField`, `tabs`, `badge`, `alert`, `toast`, `popover`, `switch`. Each is a partial Tailwind Variants config merged over Nuxt UI's.

### `button.ts`

- `base`: `cursor-pointer select-none s-corner transition duration-300 font-normal`, disabled at 30% opacity, a 2px focus-visible outline.
- `label`: `[overflow-x:clip]! [overflow-y:visible]!` — the line is as tall as the icon and shorter than the text's box at xs and sm; clipped on both axes, descenders lost their bottoms.
- `variants.size`: `sizes`. `defaultVariants`: primary, solid, md.
- Icon only (Nuxt UI's `square`) keeps the size's padding instead of Nuxt UI's smaller one:

  ```ts
  {square: true, class: {base: '[--s-pill-sq:min(var(--s-pill-x,0px),max(0px,calc((var(--s-px)-var(--s-py))*1000)))] px-[calc(var(--s-px)+var(--s-pill-sq))]! py-(--s-py)! mx-[calc(var(--s-pill-sq)*-1)]!'}},
  ```

  `--s-pill-sq` is `--s-pill-x` where padding-x is above padding-y, else 0: an icon-only pill wider than tall is compensated as a label is, a circle is not and stays a circle.
- The label trim per side, from UButton's own `leading` / `trailing` variants (`stemLabelShift`). SButton draws its leading icon itself and sets that side in the wrapper.
- Colour compounds: primary, neutral, secondary and error solid; soft and ghost for the three greys; subtle.

### `badge.ts`

`base: 's-corner font-normal'`, `variants.size: sizes` — a badge is a button's box. The label trim is decided by its siblings (`[[data-slot=leadingIcon]+&]:…`, `[&:has(+[data-slot=trailingIcon])]:…`). Icon only: `px-(--s-px)! py-(--s-py)! mx-0!`. Colour compounds: solid (primary, neutral, secondary, error), outline (primary, neutral), soft, subtle; no hover states. The pill is SBadge's default, not the theme's.

### `input-commons.ts`

Shared by input, textarea, select, selectMenu, inputMenu and (partly) inputTags.

- `inputBase`: `placeholder:text-iron-500/80 placeholder:select-none s-corner transition duration-200 outline-none`. `outline-none` suppresses Nuxt UI's focus outline: Stem draws its own.
- `singleLineHeight`: `h-[calc(var(--s-icon-size)+2*var(--s-py))]` — a browser gives an `<input>` at least the font's natural line height, taller than the scale's at xs, so the height is set outright.
- **Border and focus never resize a field.** The border is `border-0 ring-1 ring-inset` (`outlineCommons`); focus darkens the ring and adds a halo outside, as a box-shadow:

  ```ts
  class: {base: 'focus-visible:ring-iron-500/80 focus-visible:shadow-[0_0_0_3.5px] focus-visible:shadow-iron-500/20'}
  ```

- `baseCompoundVariants`: placeholder and icon colours per colour (primary iron, error rose, success emerald), then outline, soft, subtle and ghost for each.
- `fixedSizeOverrides`: `{fixed: false, class: {base: 'md:text-(length:--s-text)'}}` neutralizes Nuxt UI's responsive `md:text-*`.
- `inputCompoundVariants` = base + focus ring + fixed size + `fieldIconCompounds`; `inputVariants` = `{size: fieldSizes}`.

### `input.ts`, `textarea.ts`

`input`: the shared slots with `singleLineHeight` on `base`, and `inputCompoundVariants` + `fieldLabelCompounds` + `singleLineFieldCompounds`. `textarea`: no fixed height and no one-line rule; its leading and trailing icons are pinned to the top (`top-(--s-py)! bottom-auto!`).

### `select-commons.ts`, `select.ts`, `select-menu.ts`, `input-menu.ts`

- `select` and `selectMenu` are the same config: the trigger is the root, so its sizes are `sizes` + the icon edges (`ps` / `pe` one padding from the edge) + `menuItemSizes`. `base` adds `cursor-pointer`.
- `inputMenu` has a root around the field: `fieldSizes` + `menuItemSizes`, with the input's height and one-line rule.
- `selectOutlineHover`: a faint ground on hover for the outline variant.
- `selectOpenRing`: open or focused, the trigger looks like a focused input (`focus:` and `data-[state=open]:` ring and halo).
- `selectLabelCompounds`: the trim on `value` and `placeholder` — the chevron's side always, the start by a leading icon or alone.
- All three take `menuItemSlots` and, for `active: false`, `menuItemHighlight`.

### `menu-items.ts`

A menu item is a control like any other. Shared by `dropdownMenu`, `contextMenu`, `select`, `selectMenu` and `inputMenu`.

```ts
export const menuItemSlots = {
  content: 's-floating-menu s-corner-outer',
  group: 'p-1',
  item: 'cursor-pointer items-center font-normal s-corner before:hidden data-disabled:opacity-50',
  …
}
export const menuItemHighlight = 'data-highlighted:not-data-disabled:bg-elevated data-[state=open]:bg-elevated'
```

- The menu floats in a portal, out of the trigger's reach, so the size class goes on `content` itself (`menuItemSizes[size].content`), and the wrappers add the single-axis classes there.
- Per size, `item`, `label` and `empty` get `text-(length:--s-text) leading-(--s-icon-size) px-(--s-px) py-(--s-py) gap-(--s-gap)`; item icons are `stemScaleIcon`.
- The menu's corners are the item's plus the group padding (`s-corner-outer`, 4px): items and menu are concentric.
- The highlight is the item's own background, a squircle; Nuxt UI's `::before` is hidden (it can only be plainly rounded).

### `dropdown-menu.ts`, `context-menu.ts`

`dropdownMenu`: `menuItemSlots`, `size: menuItemSizes`, leading icons in the default text colour whatever the state, and the arrow's classes. `contextMenu` is the same object.

### `input-tags.ts`

The field is an input whose focus is on the inner input, so every `focus-visible:` of `baseCompoundVariants` is remapped to `has-focus-visible:` on the container.

- A tag (`item`) is a soft pill: `rounded-full ring-0 font-normal bg-iron-400/20 text-muto-800 dark:text-muto-200`, with the field's text, icon size, padding-x and gap.
- Its padding-y is `--s-tag-py`, two steps below the size (xs 0, sm 4, md 6, lg 8, xl 10px); the field takes the same off its own (`py-[calc(var(--s-py)-var(--s-tag-py,0px))]!`), so it is as tall with tags as without. SInputTags overrides the variable from its space.
- The delete X is a circle at the pill's round end: `--s-tag-x` is its icon (8 / 12 / 16 / 20 / 24px), `--s-tag-x-pad` its padding (2px at xs, else 4px), shrunk (`--s-tag-xp`) when the tag is too short for it.
- The typing input is `w-0 min-w-[4ch]`: it takes the space left on the row instead of wrapping onto a new one.

### `tabs.ts`

```ts
slots: {root: '[--s-inset:2px]', trigger: 's-corner cursor-pointer font-normal', label: /* trim */},
variants: {variant: {pill: {list: 's-corner-outer p-(--s-inset)', indicator: 's-corner shadow-none'}, link: {list: 'p-0'}}, size: …}
```

- A trigger is a button's box: `text-(length:--s-text) leading-(--s-icon-size) px-[calc(var(--s-px)+var(--s-pill-x,0px))] py-(--s-py) gap-(--s-gap)`. The size class and the pill's negative margin go on `root`.
- The pill list wraps the triggers with a 2px inset on every side; the indicator is inset by the same (`inset-y-(--s-inset)!`, `inset-x-` when vertical), so the active tab is concentric with the list.
- Primary: indicator `bg-gray-800 dark:bg-stem-100`; the active pill's text is `white` / `stem-900`, the active link's `gray-800` / `stem-100`.

### `checkbox.ts`, `radio-group.ts`, `switch.ts`

The size class goes on `root`; box, dot and track are sized from `--s-icon-size`.

| | Sizes | Row |
|--|-------|-----|
| checkbox | `base: size-(--s-icon-size)`, the check 75% of it; `s-corner-inner` with `--s-inset` half the radius | `py-(--s-py)`, no padding-x |
| radioGroup | `base: size-(--s-icon-size)`, the dot 40% of it | each item `py-(--s-py)`; items `gap-x-(--s-px)` apart |
| switch | track `h-(--s-icon-size) w-[calc(var(--s-icon-size)*1.75)]`, thumb the icon − 4px, travelling 0.75 of the icon | `py-(--s-py)` |

The label is `--s-gap` from the box less the `alone` trim. Primary is `bg-gray-800 dark:bg-stem-100` on all three (Nuxt UI's `bg-primary` is the palette's middle grey, lighter than a solid button).

### `alert-colors.ts`, `alert.ts`, `toast.ts`

One source for an alert inline (UAlert) and an alert arriving as a toast (UToast).

- `alertSlots.root`: `s-size-sm s-corner px-(--s-px) py-(--s-py) gap-(--s-gap)` — a bare UAlert or a toast is sm with the size's own space; SAlert sets the variables inline with its own defaults.
- `title`: the scale's text, medium. `description`: `--s-alert-description-text` / `-leading` when set (SAlert), else the alert's text on lines of icon + 4px. `avatar`: twice the icon.
- `actions`: bare `UButton`s (a toast's) are made pills of the alert's text with half the padding-y, through `[&>button:not([data-slot=close]):not(.s-control)]:…`; Stem controls are left alone. `close`: the same pill, iron tint.
- `alertOrientation`: everything starts at the top (`items-start`); in `horizontal` the actions overhang the title's line (`-my-[calc(var(--s-py)/2)]`), in `vertical` they sit `mt-3` under the text.
- `tones`: per colour (`primary`, `secondary`, `neutral`, `info`, `success`, `warning`, `error`) the icon colour, the tint, the ring, the solid ground and text, and the close pill and solid action on a solid ground.
- `alertClasses(color, variant)` returns the slot classes:

  | variant | root |
  |---------|------|
  | `outline` | `bg-default bg-none ring ring-inset` + the tone's ring; colour in the icon only |
  | `soft` | `bg-default bg-linear-to-b` + the tint, no ring |
  | `subtle` | the tint and the ring |
  | `solid` | the tone's ground and text; description muted (primary, secondary) or at 90% |

  The tint is a gradient laid over the opaque surface: a toast floats over content and must not let it through. Text stays the default colour on outline, soft and subtle.
- `alertSolidAction(color)`: a solid action's classes on a solid alert (the ground's opposite).
- `alert.ts`: `slots: alertSlots`, one compound variant per colour × variant, `defaultVariants: {variant: 'outline'}`.
- `toast.ts`: the `outline` alert with `shadow-lg dark:shadow-black/40`, per colour. UToast has no `variant` prop: pass `ui: alertClasses(color, variant)` to `toast.add()` for another look.

### `popover.ts`

```ts
content: 's-floating-menu s-corner [--s-radius:10px] ring-0',
arrow: 'fill-(--ui-bg) stroke-black/10 dark:stroke-white/10',
```

### `slideover.ts`

- `overlay`: `fixed inset-0 bg-neutral-800/90 backdrop-blur-sm`. `content`: `p-0 divide-y-0 s-corner [--s-radius:12px]` (SModal sets its own radius inline). `body`: `p-0 sm:p-0`.
- Motion reads `--s-sheet-duration` (500ms) and `--s-sheet-ease` from `base.css`, so a scrim or a handover timed on the sheet can read them too. `side: 'top'` slides softly from the bottom below sm and from the top from sm; `side: 'bottom'` from the bottom at every width; the overlay fades on the same clock. Keyframes (`slide-soft-from-top`, `-to-top`, `-from-bottom`, `-to-bottom`: 30px and opacity) are in `animations.css`.

### `avatar.ts`, `form-field.ts`, `field-group.ts`

- `avatar`: `root: 'bg-iron-500/10'`, `fallback: 'leading-normal'`.
- `formField`: `error: 'mt-1 text-error text-xs'`, `label: 'text-iron-600'`.
- `fieldGroup`: `base: 's-field-group'` (see *Corners*).

### `input-container.ts`

Not a Nuxt UI override: a colour × variant lookup for containers that must look like a Stem input without being one, where focus is tracked in JS (SColorPicker). Exported as `inputContainerClasses[color][variant]` → `{base, hover, focus, placeholder}` and `inputIconColors[color]`; colours `primary`, `error`, `success`; variants `outline`, `soft`, `subtle`, `ghost`, `none`. The container carries an `s-size-*` class for its radius; border and focus are the same inset ring and 3.5px halo as an input's.

## Floating menus and the arrow

```css
.s-floating-menu {
    border: none;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
```

In dark mode the 1px ring is white at 10% and the shadows are deeper. Used by `popover` (`s-corner`, 10px) and by every menu through `menuItemSlots.content` (`s-corner-outer`: the item's radius + 4px). The tooltip has no Stem theme.

**The arrow** (`src/arrow-shape.ts`, `src/arrow.ts`, `SArrow.vue`):

- `arrowShape({scale, baseRadius, tipRadius, foot, height})` returns `{width, height, edge, fill}`: a triangle (by default ±10 wide at the base, 12.5 high) with a rounded tip and concave fillets where the sides meet the edge, so there is no corner at the base. `fill` goes 1px past the base, into the surface, so no seam is left.
- `STEM_ARROW_SHAPE = arrowShape({scale: 0.6, baseRadius: 10})`; `STEM_ARROW_PADDING = 16` keeps the arrow off a panel's rounded corners (Reka's `arrowPadding`).
- `stemArrow = {as: markRaw(SArrow), width, height}` is what Nuxt UI's `arrow` prop takes: Reka keeps placing and rotating it, SArrow draws it. Imported, not async: Reka measures the element to centre it.
- `stemArrowProps(arrow, content)` is what SPopover, STooltip and SDropdownMenu call: a falsy `arrow` is returned as is; otherwise `{arrow: {...stemArrow, ...own}, content: {arrowPadding: 16, ...content}}`.
- The theme's `arrow` slot (popover, dropdownMenu, contextMenu) fills it with the surface and outlines it as the floating menu's ring: `fill-(--ui-bg) stroke-black/10 dark:stroke-white/10`.

## `base.css`

Imports `animations.css`, `colors.css`, `corner-shape.css`, `scale.css` and `scroll-fade.css`; sets font smoothing in `@layer base`, the semantic colour variables and the sheet's timing.

| Class | Effect |
|-------|--------|
| `.s-floating-menu` | See above |
| `.s-overlay` | `background: rgba(0, 0, 0, 0.85)` |
| `.s-outline` | A 1px `iron-500` border at 30% (50% on hover), 6px radius (a squircle where supported), 200ms transition |
| `.s-outline-focus` | The focused look: border at 80% and a 3.5px halo at 20% |
| `.s-outline-focus-within` | The same on `:focus-within` |
| `.s-outline-hover` | The same on `:hover` |
| `.s-scroll-fade`, `.s-scroll-fade--bottom` | The painted fade of a scrolling edge; `--s-fade-color` (default `--ui-bg`), `--s-fade-size` (default 1.5rem) |
| `.s-scroll-mask` | The same fade as a mask on the scroller; `--s-mask-top`, `--s-mask-bottom` (registered lengths, 300ms transition), `--s-mask-gutter` (default 1rem) |

`fonts.css` (loaded unless `fonts: false`) imports `@fullbrains/vimana` and sets `--font-sans: vimana`.

## Icons

`stemIcons` maps Nuxt UI's icon tokens to Phosphor (`i-ph-*`): `close: 'i-ph-x'`, `check: 'i-ph-check-bold'`, `chevronDown: 'i-ph-caret-down'`, `loading: 'i-ph-circle-notch'`, `search: 'i-ph-magnifying-glass'`… It becomes `appConfig.ui.icons`. Icons are sized by the scale (`--s-icon-size`), in px: 12, 16, 20, 24, 28.

## Module internals

`src/stem-config.ts` builds what is injected: `{ui: {...stem, colors: stemColors, icons: stemIcons}}`.

`src/module.ts` (`@fullbrains/stem/nuxt`, config key `stem`, options `iconsDir: 'assets/icons'` and `fonts: true`), in order:

1. **Standalone sub-module.** `installModule('./standalone', {iconsDir})`: registers `SIcon` and `SSpinner` (priority 10, so the later directory scan does not warn) and writes a plugin that globs `/<iconsDir>/**/*.svg` (relative to `srcDir`) with `?raw` and provides the loader under `STEM_ICON_LOADER`.
2. **Theme.** For each key of `stemAppConfig.ui`: `colors` is `Object.assign`ed over the current value (Stem's palettes win over Nuxt UI's defaults); objects are merged with `defu(value, current)`; anything else is assigned. The app's own `app.config.ts` is applied again at runtime and still wins.
3. **Components and composables.** `addComponentsDir('./components')`, `addImportsDir('./composables')`.
4. **Vite.** Stem's root is pushed to `server.fs.allow` (linked installs).
5. **CSS.** `base.css` is unshifted into `nuxt.options.css`, then `fonts.css` if `fonts !== false`: fonts, then base, then the app's CSS, which can override both.
6. **Tailwind sources.** The theme's classes exist only in `appConfig`, which Tailwind does not scan. Every string in `stemAppConfig.ui` is collected into `.nuxt/stem-classes.html`, and on `build:before` this is prepended, once (guarded by the `/* Stem */` marker), to Nuxt UI's generated `.nuxt/ui.css`:

   ```css
   /* Stem */
   @source "<stem>/src/components";
   @source "<stem>/src/theme";
   @source "./stem-classes.html";
   /* …the content of colors-theme.css (@theme static) */
   ```

   `src/theme` is a source too: `inputContainerClasses` is public, so its classes can appear in a consumer's component.

A class built at runtime is never generated: themes and components write their classes out in full, per size where needed.

`src/standalone.ts` (`@fullbrains/stem/standalone`, config key `stemStandalone`, option `iconsDir`) is step 1 alone, for projects without `@nuxt/ui`.
