---
name: stem
description: This skill should be used when the user works with @fullbrains/stem, a Nuxt module that extends Nuxt UI v4 with opinionated theming, custom components (SButton, SModal, SSpinner), and design conventions. Use when adding stem to a project, configuring its theme, using SButton/SModal/SConfirmDialog, customizing Stem's Tailwind Variants overrides, or following Stem's sizing and color conventions.
---

# @fullbrains/stem

A Nuxt module that layers opinionated design tokens, theme overrides, and custom components on top of Nuxt UI v4. It provides a consistent visual language across Fullbrains projects.

## Installation

Install as an npm package, then register as a Nuxt module. Both steps are required — the npm install alone does nothing without the module registration.

```bash
pnpm add @fullbrains/stem
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@fullbrains/stem/nuxt'],
  css: ['~/assets/css/main.css'],
})
```

`@fullbrains/stem/nuxt` must come after `@nuxt/ui` in the modules array. Once registered, Stem auto-registers its components, composables, theme overrides, icons, and CSS. No manual import needed.

### CSS setup

Stem injects its own CSS (fonts via `@fullbrains/vimana`, animations, base styles) before the app's CSS, so app-level overrides always win.

```css
/* app/assets/css/main.css */
@import "tailwindcss";
@import "@nuxt/ui";
/* app-level overrides here */
```

### Optional: extend theme in app.config.ts

Stem's theme is injected at module level. To add project-specific overrides on top:

```ts
// app/app.config.ts
export default defineAppConfig({
  ui: {
    button: { /* project-level overrides */ },
  },
})
```

## Component Preference

When a Stem component exists for a given purpose, always prefer it over the raw Nuxt UI equivalent:

| Instead of... | Use...       | Why |
|---------------|--------------|-----|
| `UButton`     | `SButton`    | Loading spinner, confirm dialogs, disc/rounded/caret modes |
| `UModal` / `USlideover` | `SModal` | Structured header/body/footer, responsive slide animation, close handling |
| custom spinner | `SSpinner`  | Consistent animated spinner, em-scaled, grow animation |
| `UIcon` (for local SVGs) | `SIcon` | Loads SVGs from `assets/icons/`, inherits currentColor, proportional mode |
| custom search/filter UI | `SSearchBar` + `SSearchFilter` + `SSearchOrder` | Responsive search with collapsible filters, multi-select, sort order |
| empty state placeholder | `SEmpty` | Icon + label + action slot, vertical/horizontal orientation, golden rule sizes |
| `UColorPicker` (inline) | `SColorPicker` | Hex input + swatch + popover picker, variant/color/size/disabled matching Stem inputs |
| `UScrollArea` | `SScrollArea` | Gradient fade overlays at scroll edges, auto dark mode, doesn't cover scrollbar |

Stem components wrap and extend their Nuxt UI counterparts — all original props/attrs are passed through.

### Standalone usage (without Stem module)

`SIcon` and `SSpinner` can be imported directly without registering the Stem Nuxt module. Both are fully self-contained with no external CSS dependencies:

```ts
import { SIcon, SSpinner } from '@fullbrains/stem'
``` For components without a Stem wrapper (e.g., `UInput`, `USelect`, `UTabs`, `UBadge`, `UAlert`), use the Nuxt UI component directly — Stem's theme overrides are applied automatically via `app.config.ui`.

## Design Conventions

### Golden Rule of Sizes

Every component with a `size` prop follows a single scale. Deviating from this rule breaks visual consistency.

| size | text     | leadingIcon | trailingIcon |
|------|----------|-------------|--------------|
| xs   | text-xs  | size-3.5    | size-3.5     |
| sm   | text-sm  | size-4      | size-4       |
| md   | text-base| size-4.5    | size-4.5     |
| lg   | text-lg  | size-5      | size-5       |
| xl   | text-xl  | size-5.5    | size-5.5     |

Padding uses `em` units so it scales proportionally with text size (e.g., `px-[1em] py-[0.5em]`).

### Color System

Stem maps semantic colors to specific Tailwind palettes:

| Semantic  | Palette  | Notes |
|-----------|----------|-------|
| primary   | slate    | Dark bg in light, light bg in dark |
| secondary | slate    | Inverse of primary: white bg in light, dark bg in dark |
| neutral   | gray     | Mid-tone, same in both modes |
| success   | emerald  | |
| error     | rose     | |

Theme overrides use hardcoded slate/gray classes (not CSS variable-based semantic classes) to ensure buttons, badges, alerts, and tabs all share the exact same visual appearance for each color+variant combination.

The `secondary` color is the visual inverse of `primary`:

| Variant | Light mode | Dark mode |
|---------|-----------|-----------|
| **solid** | bg-white, text default | bg-slate-800, text-slate-100 |
| **soft** | Same as primary/neutral (bg-slate-400/20, transparent) | Same |
| **subtle** | bg-white + ring-inset ring-(--ui-border) | bg-slate-800 + ring-inset ring-(--ui-border) |
| **outline** (badge only) | No override (transparent, Nuxt UI default with slate palette) | Same |

Currently themed for button and badge.

### Floating Menus

All floating panels (dropdown menus, select menus, input menus, popovers) use the `.s-floating-menu` CSS class for consistent shadow and border treatment. This class is defined in Stem's `base.css`.

### Utility CSS Classes

Stem exports utility CSS classes in `base.css` for building custom containers that match input styling:

| Class | Effect |
|-------|--------|
| `.s-outline` | Resting input border (slate-500/30, hover: slate-500/50, rounded 6px, 200ms transition) |
| `.s-outline-focus` | Focused input border + glow (slate-500/80 border, 3.5px slate-500/20 shadow) |
| `.s-outline-focus-within` | Same as `.s-outline-focus` but triggers on `:focus-within` (for containers with inner inputs) |
| `.s-outline-hover` | Same as `.s-outline-focus` but triggers on `:hover` (for clickable containers) |

Compose them to create custom containers that look like Stem inputs:

```html
<!-- Container that behaves like a Stem input -->
<div class="s-outline s-outline-focus-within">
  <span>Tag</span>
  <input type="text" class="border-none outline-none" />
</div>
```

When combining `.s-outline` with `.s-outline-focus-within`, the focus state automatically wins over the hover state.

### Icon Set

Stem uses Phosphor Icons (`@iconify-json/ph`) as its icon set, mapped via `stemIcons` in the config. Format: `i-ph-{name}`.

## Components

### SButton

Enhanced button wrapping `UButton`. Adds confirm dialogs, loading states with animated spinner, and disc mode.

```vue
<!-- Basic -->
<SButton label="Save" icon="i-ph-check" />

<!-- Loading state (spinner replaces icon, click disabled) -->
<SButton label="Saving..." loading />

<!-- Destructive with confirmation dialog -->
<SButton
  label="Delete"
  destructive
  confirm-title="Delete item?"
  confirm-message="This action cannot be undone."
  :on-confirm="handleDelete"
/>

<!-- Disc: circular icon-only button -->
<SButton disc icon="i-ph-plus" />
<SButton disc icon="i-ph-x" variant="soft" size="sm" />

<!-- Caret: trailing chevron-down, auto-pushed right -->
<SButton label="Options" caret />

<!-- Rounded: pill shape -->
<SButton label="Tag" rounded />
```

**Props:** `icon`, `label`, `trailingIcon`, `caret`, `rounded`, `disc`, `compact` (boolean | 'x' | 'y'), `loading`, `destructive`, `confirmTitle`, `confirmMessage`, `confirmIcon`, `confirmLabel`, `confirmMatch`, `confirmPlaceholder`, `onConfirm`

The `compact` prop reduces padding and removes min-height. It accepts:
- `true` — reduces both axes (`py-[0.25em]`, `px-[0.65em]`, `min-h-0`)
- `"x"` — reduces only horizontal padding (`px-[0.65em]`)
- `"y"` — reduces only vertical padding (`py-[0.25em]`, `min-h-0`)

On disc buttons, `compact` produces a smaller circle (`p-[0.4em]`, `min-h-0`). The `x`/`y` axis distinction is ignored for disc.

The `disc` prop makes the button a circle with `aspect-square`, same height as a normal button at the same size. Hides label and trailing icon.

### SModal

Slide-over modal built on `USlideover` with header/footer structure.

```vue
<SModal
  v-model:open="isOpen"
  title="Edit Profile"
  description="Update your information"
  icon="i-ph-user"
  size="md"
  @close="isOpen = false"
>
  <template #body>
    <!-- form content -->
  </template>
  <template #footer>
    <SButton label="Save" :on-confirm="save" />
    <SButton label="Cancel" variant="soft" @click="isOpen = false" />
  </template>
</SModal>
```

**Props:** `title`, `description`, `icon`, `side` (top/right/bottom/left, default: top), `size` (sm/md/lg/xl/full/number), `header`, `closeable`, `footer`, `headerSeparator`, `footerSeparator`, `disabled`, `open`, `defaultOpen`

**Slots:** `title`, `after-header`, `body`, `footer`

### SConfirmDialog

Used internally by `SButton` via `useConfirmDialog()`. Renders an `SModal` with confirm/cancel buttons.

### SSpinner

SVG-based animated spinner. Scales with `em` units by default.

```vue
<SSpinner />               <!-- 1em, inherits text color -->
<SSpinner size="2em" />    <!-- Explicit size -->
<SSpinner grow />          <!-- Animates in from 0 width -->
```

### SIcon

Loads local SVG icons from the project's `assets/icons/` directory. Renders them inline so they inherit `currentColor`. Does not require Stem as a Nuxt module — can be imported standalone in any Vue/Nuxt project.

```vue
<!-- Standalone import (no Stem module needed) -->
<script setup>
import { SIcon } from '@fullbrains/stem'
</script>

<!-- Auto-registered when Stem module is active -->
<SIcon name="logo" />
<SIcon name="brand/wordmark" proportional />
<SIcon name="ui/arrow" proportional constrained />
```

**Props:** `name` (required — path relative to `assets/icons/`, without `.svg`), `proportional` (SVG fills container), `constrained` (prevents SVG expansion in flex — Safari fix)

**Emits:** `ready` — emitted after SVG loads (or on error, to avoid blocking)

SVG fills/strokes set to `black`/`#000`/`#000000` are automatically remapped to `currentColor`, so the icon inherits text color.

### SSearchBar

Responsive search bar with collapsible inline filters. Uses `ResizeObserver` to collapse filters into a funnel dropdown when the input space falls below `minInputWidth`.

```vue
<SSearchBar v-model="query" placeholder="Search projects...">
  <template #filters>
    <SSearchFilter v-model="statusFilter" :options="statusOptions" label="Status" />
    <SSearchOrder v-model="sortOrder" :options="sortOptions" />
  </template>
  <template #more>
    <!-- Extra filters shown only in funnel dropdown -->
  </template>
  <template #trailing>
    <!-- Buttons always visible after input -->
  </template>
</SSearchBar>
```

**Props:** `modelValue` (string, v-model), `placeholder`, `minInputWidth` (default: 280), `variant` ('outline' | 'soft' | 'subtle' | 'ghost', default: 'outline'), `activeFilterCount` (number, default: 0 — shows count badge on funnel button)

**Slots:** `filters` (inline, collapse into funnel on small widths), `more` (always in funnel dropdown), `trailing` (always visible after input)

Supports the same `variant` prop as Stem inputs (`outline`, `soft`, `subtle`, `ghost`), always with primary (slate) color. Focus ring matches input behavior exactly.

### SSearchChip

Filter chip wrapping `SButton` (variant="soft", size="sm", rounded, compact). Displays a label + selected values summary. When the count exceeds `threshold`, shows "N selected" instead of listing all values.

```vue
<SSearchChip label="Status" :selected-values="['Active', 'Pending']" :count="5" />
```

**Props:** `leadingIcon`, `trailingIcon`, `active`, `label`, `selectedValues` (string[]), `count`, `threshold` (default: 3), `allLabel` (default: 'All'), `selectedTemplate` (default: '% selected')

### SSearchFilter

Multi-select dropdown filter with chip trigger, optional groups, nullable option, counts, and animated reset button.

```vue
<SSearchFilter
  v-model="selectedStatuses"
  :options="[{value: 'active', label: 'Active', icon: 'i-ph-check-circle'}]"
  label="Status"
  :counts="{active: 12, pending: 5}"
/>
```

**Props:** `modelValue` (Set\<string\>, v-model), `options` (SSearchFilterOption[]), `label`, `allLabel`, `groups` (SSearchFilterGroup[]), `nullable`, `nullLabel`, `nullValue`, `nullIcon`, `nullIconClass`, `counts` (Record\<string, number\>), `chipClass`, `threshold`, `contentClass`, `alignEnd` (boolean — align dropdown to end)

**v-model:open** — controls dropdown open state

**Slot:** `#leading` — custom leading content for filter items (receives `{option}`)

Empty Set = "All selected". When all options are selected, resets to empty Set.

### SSearchOrder

Single-select dropdown for sort order, using `SSearchChip` as trigger.

```vue
<SSearchOrder
  v-model="sortOrder"
  :options="[{value: 'newest', label: 'Newest first'}, {value: 'oldest', label: 'Oldest first'}]"
/>
```

**Props:** `modelValue` (string, v-model), `options` ({value, label}[]), `contentClass`, `chipClass`

### SEmpty

Empty state placeholder with icon, label, and optional action slot.

```vue
<!-- Vertical (default) -->
<SEmpty label="No results found" />

<!-- With action button -->
<SEmpty label="Nothing here yet" icon="i-ph-folder-open">
  <template #after>
    <SButton label="Create new" size="sm" variant="soft" icon="i-ph-plus" />
  </template>
</SEmpty>

<!-- Horizontal -->
<SEmpty label="Empty list" orientation="horizontal" />

<!-- Custom slot text -->
<SEmpty>
  <span>Custom <strong>formatted</strong> text</span>
</SEmpty>
```

**Props:** `icon` (default: `i-ph-empty-light` vertical, `i-ph-empty` horizontal), `label`, `orientation` ('vertical' | 'horizontal', default: 'vertical'), `size` (xs/sm/md/lg/xl, default: md)

**Slots:** `default` (replaces label), `after` (content after text, e.g. a button)

In vertical mode the icon is significantly larger (size-8 to size-16) with the light variant for visual weight. In horizontal mode the icon is slightly larger than text (size-4.5 to size-8). Text and icon use `text-(--ui-text-muted)` color. Gap defaults to `gap-3`, overridable via `class`.

### SColorPicker

Hex color input with inline swatch, text input, and popover `UColorPicker`. Supports the same `variant`, `color`, `size`, and `disabled` props as Stem inputs.

```vue
<SColorPicker v-model="color" placeholder="#hex" />

<!-- With variant, color, size -->
<SColorPicker v-model="color" variant="soft" color="error" size="lg" />

<!-- With default value (shows reset button when changed) -->
<SColorPicker v-model="color" default-value="#3b82f6" />

<!-- Allow empty -->
<SColorPicker v-model="color" allow-empty placeholder="Optional" />
```

**Props:** `modelValue` (string, v-model), `placeholder`, `size` (xs/sm/md/lg/xl, default: sm), `variant` ('outline' | 'soft' | 'subtle' | 'ghost' | 'none', default: 'outline'), `color` ('primary' | 'error' | 'success', default: 'primary'), `disabled`, `defaultValue` (shows reset button when value differs), `allowEmpty` (permits empty string)

Variant/color classes come from shared `input-container.ts` (same visual appearance as UInput). The swatch opens the popover on click; the caret toggles it. Focus ring, placeholder color, and icon colors all follow the semantic color.

### SScrollArea

Wraps `UScrollArea` with gradient fade overlays at top/bottom edges. Fades appear/disappear based on scroll position with a 300ms transition. Uses `position: sticky` inside the viewport so the gradient doesn't cover the scrollbar.

```vue
<!-- Basic: give it a fixed height -->
<SScrollArea class="h-64">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</SScrollArea>

<!-- Custom fade size and color -->
<SScrollArea class="h-48" fade-size="3rem" fade-color="var(--color-neutral-100)">
  <slot />
</SScrollArea>

<!-- Disable fade -->
<SScrollArea class="h-48" :fade="false">
  <slot />
</SScrollArea>
```

**Props:** `fade` (boolean, default: true), `fadeSize` (string, default: '1.5rem'), `fadeColor` (string, default: 'var(--ui-bg)' — auto dark mode). All other props/attrs forwarded to `UScrollArea` (supports `items`, `virtualize`, `orientation`, `ui`).

### useConfirmDialog

Composable for programmatic confirmation dialogs.

```ts
const { confirm } = useConfirmDialog()

await confirm({
  title: 'Delete item?',
  message: 'This cannot be undone.',
  label: 'Delete',
  destructive: true,
  onConfirm: () => api.delete(id),
})

// Type-to-confirm pattern (user must type exact string to enable confirm button)
await confirm({
  title: 'Delete Bot',
  message: 'This action is irreversible. Type <b>My Bot</b> to confirm.',
  label: 'Delete',
  destructive: true,
  confirmMatch: 'My Bot',
  confirmPlaceholder: 'Type the bot name',
  onConfirm: () => deleteBot(id),
})
```

## Theme Overrides

Stem overrides these Nuxt UI component themes via `app.config.ui`:

- **avatar** — Custom bg (bg-slate-500/10), fallback text with leading-normal instead of leading-none
- **button** — Hardcoded slate primary/secondary/neutral colors, em-based sizing, rounded-[8px], cursor-pointer, smooth transitions
- **input / textarea** — Custom placeholder colors, rounded-[6px], shadow-based focus rings (not outline), border-based outline variant
- **select / selectMenu / inputMenu** — Inherit input styling + floating menu + open-state ring
- **inputTags** — Pill-shaped tags (rounded-full, bg-slate-400/20), proportional delete button
- **badge** — Always rounded-full, em-based padding, hardcoded slate colors matching button (includes secondary)
- **alert** — Hardcoded slate colors matching button (no size prop)
- **tabs** — Slate-900 indicator for primary, cursor-pointer on all variants, golden rule sizes
- **dropdownMenu** — Floating menu styling, highlighted items
- **popover** — Floating menu styling (s-floating-menu), ring-0
- **slideover** — Dark overlay, rounded content, slide animations
- **switch** — cursor-pointer
- **formField** — Slate-600 label color, small error text

## Additional References

For detailed theme source code, component internals, and the full Tailwind Variants configuration:

- **`references/theming.md`** — Complete theme files for every component, color mappings, sizing system
- **`references/components.md`** — Detailed component API, slots, props, and usage patterns
