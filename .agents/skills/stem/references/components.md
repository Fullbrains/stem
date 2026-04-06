# Stem Components Reference

Detailed API for all custom components provided by `@fullbrains/stem`.

## SBadge

Enhanced badge wrapping Nuxt UI's `UBadge`. Adds compact mode for reduced padding.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `compact` | `boolean \| 'x' \| 'y'` | `false` | Reduce padding. `true` = both axes, `'x'` = horizontal only, `'y'` = vertical only |

### Slots

| Slot | Description |
|------|-------------|
| `leading` | Custom leading content |
| `default` | Custom badge content |
| `trailing` | Custom trailing content |

### Inherited

All `UBadge` props are passed through via `$attrs` (e.g., `label`, `icon`, `variant`, `size`, `color`, `avatar`, `leadingIcon`, `trailingIcon`).

### Compact Details

- `compact` or `compact="true"` — `py-[0.15em]! px-[0.5em]!`
- `compact="x"` — `px-[0.5em]!`
- `compact="y"` — `py-[0.15em]!`

### Examples

```vue
<!-- Normal -->
<SBadge label="Status" icon="i-ph-tag" />

<!-- Compact both axes -->
<SBadge label="Compact" icon="i-ph-tag" compact />

<!-- Compact horizontal only -->
<SBadge label="Compact X" compact="x" />

<!-- Compact vertical only -->
<SBadge label="Compact Y" compact="y" />

<!-- All UBadge props work -->
<SBadge label="Error" color="error" variant="soft" size="lg" compact />
```

## SButton

Enhanced button wrapping Nuxt UI's `UButton`. Provides loading states with animated spinner, confirmation dialogs, disc mode, caret mode, and rounded mode.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | — | Leading icon name (e.g., `i-ph-check`) |
| `label` | `string` | — | Button text label |
| `trailingIcon` | `string` | — | Trailing icon name |
| `caret` | `boolean` | `false` | Show a caret (chevron-down) as trailing icon, pushed to the right with `ml-auto` |
| `rounded` | `boolean` | `false` | Make button pill-shaped (`rounded-full`) |
| `disc` | `boolean` | `false` | Circular icon-only button. Removes min-height, hides label and trailing icon, applies uniform `p-[0.3em]` padding |
| `compact` | `boolean` | `false` | Reduced vertical padding (`py-[0.25em]`) and no min-height. Useful for inline/toolbar contexts |
| `loading` | `boolean` | `false` | Show spinner instead of icon, disable click |
| `destructive` | `boolean` | `false` | Use error color |
| `confirmTitle` | `string` | — | Title for confirmation dialog |
| `confirmMessage` | `string` | — | Message for confirmation dialog |
| `confirmIcon` | `string` | — | Icon for confirmation dialog |
| `confirmLabel` | `string` | — | Confirm button label (falls back to `label`) |
| `confirmMatch` | `string` | — | Exact string user must type to enable confirm (type-to-confirm pattern) |
| `confirmPlaceholder` | `string` | — | Placeholder for the type-to-confirm input |
| `onConfirm` | `() => Promise<void> \| void` | — | Callback when confirmed. When provided, clicking the button opens a confirmation dialog instead of emitting `click` |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `click` | `MouseEvent` | Emitted on click when `onConfirm` is not set |

### Slots

| Slot | Description |
|------|-------------|
| `leading` | Custom leading content (replaces icon/spinner) |
| `default` | Custom button content (replaces label) |

### Inherited

All `UButton` props are passed through via `$attrs` (e.g., `variant`, `size`, `color`, `disabled`, `to`).

### Behavior Details

- **Loading**: When `loading` is true, the icon slot shows an `SSpinner` with a smooth grow-in animation. Click events are suppressed.
- **Icon animation**: The leading icon/spinner container uses `max-w` transition. When no icon and not loading, it collapses to `max-w-0` with negative margin to eliminate gap.
- **Confirm flow**: When `onConfirm` is provided, click is intercepted with `stopPropagation()`, and `useConfirmModal()` opens a modal. The `click` event is NOT emitted.
- **Disc mode**: Sets `rounded-full`, `min-h-0!`, `p-[0.3em]!`. Label and trailing icon are not passed to `UButton`.

### Examples

```vue
<!-- All sizes -->
<SButton label="Extra small" size="xs" />
<SButton label="Small" size="sm" />
<SButton label="Medium" size="md" />
<SButton label="Large" size="lg" />
<SButton label="Extra large" size="xl" />

<!-- Variants -->
<SButton label="Solid" variant="solid" />
<SButton label="Soft" variant="soft" />
<SButton label="Subtle" variant="subtle" />
<SButton label="Ghost" variant="ghost" />
<SButton label="Link" variant="link" />
<SButton label="Outline" variant="outline" />

<!-- Disc buttons (different sizes) -->
<SButton disc icon="i-ph-plus" size="xs" />
<SButton disc icon="i-ph-plus" size="sm" />
<SButton disc icon="i-ph-plus" size="md" />
<SButton disc icon="i-ph-plus" size="lg" />
<SButton disc icon="i-ph-plus" size="xl" />

<!-- Destructive with confirm -->
<SButton
  label="Delete account"
  destructive
  icon="i-ph-trash"
  confirm-title="Delete account?"
  confirm-message="This action is irreversible. All data will be lost."
  confirm-icon="i-ph-warning"
  :on-confirm="deleteAccount"
/>

<!-- Dropdown trigger with caret -->
<SButton label="Select option" caret />
```

## SModal

Slide-over modal built on Nuxt UI's `USlideover`. Provides a structured layout with header, body, and footer sections. Opens from the top on desktop (with slide animation) and from the bottom on mobile.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Modal title |
| `description` | `string` | — | Description text below title |
| `icon` | `string` | — | Icon displayed above title |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Slide direction |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| '4xl' \| '5xl' \| '6xl' \| '7xl' \| 'full' \| number` | `'xl'` | Modal width. Number = exact pixels |
| `header` | `boolean` | `true` | Show header section |
| `headerCompact` | `boolean` | `false` | Compact header: reduced padding (py-3), smaller title (text-lg), icon inline beside title at 1em |
| `closeable` | `boolean` | `true` | Show close button |
| `footer` | `boolean` | `true` | Show footer section |
| `headerSeparator` | `boolean` | `undefined` | Show separator line below header |
| `footerSeparator` | `boolean` | `true` | Show separator line above footer |
| `disabled` | `boolean` | `false` | Prevent closing (useful during async operations) |
| `open` | `boolean` | — | Control open state (v-model:open) |
| `defaultOpen` | `boolean` | — | Initial open state (uncontrolled) |

### Size Map

| Size | CSS Class | Width |
|------|-----------|-------|
| `sm` | `max-w-sm` | 24rem (384px) |
| `md` | `max-w-md` | 28rem (448px) |
| `lg` | `max-w-lg` | 32rem (512px) |
| `xl` | `max-w-xl` | 36rem (576px) |
| `2xl` | `max-w-2xl` | 42rem (672px) |
| `3xl` | `max-w-3xl` | 48rem (768px) |
| `4xl` | `max-w-4xl` | 56rem (896px) |
| `5xl` | `max-w-5xl` | 64rem (1024px) |
| `6xl` | `max-w-6xl` | 72rem (1152px) |
| `7xl` | `max-w-7xl` | 80rem (1280px) |
| `full` | `w-full max-w-full` | 100% |
| number | `width: {n}px` | exact pixels |

### Emits

| Event | Payload | Description |
|-------|---------|-------------|
| `close` | — | Emitted when modal is closed |
| `update:open` | `boolean` | For v-model:open binding |

### Slots

| Slot | Description |
|------|-------------|
| `title` | Custom title content |
| `after-header` | Content between header and body |
| `body` | Main content area |
| `footer` | Footer buttons/actions |

### Layout

- On desktop: slides from top, centered horizontally with `mx-auto mt-4`, max-height `calc(100vh - 2rem)`, rounded `2xl`
- On mobile: slides from bottom, full width, no bottom rounding, sticks to bottom

### Example

```vue
<script setup>
const isOpen = ref(false)
const loading = ref(false)

async function save() {
  loading.value = true
  await api.save(form)
  loading.value = false
  isOpen.value = false
}
</script>

<template>
  <SButton label="Open" @click="isOpen = true" />

  <SModal
    v-model:open="isOpen"
    title="Edit Profile"
    description="Update your personal information"
    icon="i-ph-user-circle"
    size="md"
    :disabled="loading"
  >
    <template #body>
      <div class="p-6">
        <!-- form fields -->
      </div>
    </template>
    <template #footer>
      <SButton label="Save" :loading="loading" @click="save" />
      <SButton label="Cancel" variant="soft" :disabled="loading" @click="isOpen = false" />
    </template>
  </SModal>
</template>
```

## SModalHeader

Internal component used by `SModal`. Renders title, description, icon, and close button.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | — | Header title |
| `description` | `string` | — | Description (rendered as HTML) |
| `icon` | `string` | — | Large icon (size-10) above title |
| `compact` | `boolean` | `false` | Compact mode: py-3 instead of py-6, text-lg instead of text-2xl, icon inline beside title at size-[1em] |
| `closeable` | `boolean` | `true` | Show close button |
| `disabled` | `boolean` | `false` | Disable close button |

### Slots

| Slot | Description |
|------|-------------|
| `title` | Custom title content |

## SModalFooter

Internal component used by `SModal`. Renders footer with responsive button layout.

### Props

| Prop | Type | Default |
|------|------|---------|
| `separator` | `boolean` | `true` |

### Button Layout

- Mobile: buttons are full-width, stacked vertically
- Desktop (sm+): buttons are inline, auto-width, with horizontal padding `1.5em`

## SConfirmModal

Confirmation dialog used internally by `SButton` when `onConfirm` is provided. Can also be used programmatically via `useConfirmModal()`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Confirm'` | Dialog title |
| `message` | `string` | `'Are you sure?'` | Confirmation message |
| `label` | `string` | `'Confirm'` | Confirm button label |
| `cancelLabel` | `string` | `'Cancel'` | Cancel button label |
| `icon` | `string` | — | Dialog icon |
| `destructive` | `boolean` | `false` | Use error color for confirm button |
| `confirmMatch` | `string` | — | Exact string the user must type to enable the confirm button |
| `confirmPlaceholder` | `string` | — | Placeholder for the type-to-confirm input |
| `onConfirm` | `() => Promise<void> \| void` | — | Async callback executed on confirm |

### Behavior

- While `onConfirm` runs, a loading state prevents closing the dialog
- On confirm success, emits `close(true)`
- On cancel or close, emits `close(false)`
- When `confirmMatch` is provided, a `UInput` appears between the description and footer. The confirm button stays disabled until the typed value matches exactly (case-sensitive). Enter key submits when match is valid.

## SAlertModal

Simple message modal with a single OK button. Used programmatically via `useAlertModal()`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `'Info'` | Modal title |
| `message` | `string` | — | Message body |
| `icon` | `string` | — | Modal icon |
| `confirmLabel` | `string` | `'OK'` | Button label |
| `confirmColor` | `string` | — | Button color |

### Behavior

- Emits `close` when the user clicks OK or closes the modal
- No loading state, no cancel button — purely informational

## useAlertModal

Composable for programmatic alert/message modals via Nuxt UI's overlay system.

### Usage

```ts
const { alert } = useAlertModal()

// Simple string message
await alert('Operation completed')

// Full options
await alert({
  title: 'Error',
  message: 'Something went wrong.',
  icon: 'i-ph-warning',
  confirmColor: 'error',
})
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | No | Modal title |
| `message` | `string` | No | Message body |
| `icon` | `string` | No | Modal icon |
| `confirmLabel` | `string` | No | Button label (default: 'OK') |
| `confirmColor` | `string` | No | Button color |

When called with a string, it is used as the `message`.

### Implementation

Uses `useOverlay()` from Nuxt UI to create and open an `SAlertModal` instance with `destroyOnClose: true`.

## SSpinner

SVG-based animated loading spinner. Uses CSS keyframe animations for rotation and dash offset.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `string` | `'1em'` | Width and height (supports any CSS unit) |
| `stroke` | `number` | `2` | Stroke width of the circle |
| `grow` | `boolean` | `false` | Animate in from 0 width (used by SButton) |

### Animations

- `s-spinner-rotate`: Continuous 360 rotation (1.4s linear)
- `s-spinner-dash`: Stroke dash animation (expanding/contracting arc)
- `s-spinner-grow-in`: Width expansion from 0 (500ms ease-out, used with `grow` prop)

## SIcon

Loads local SVG files from the project's `assets/icons/` directory and renders them inline. SVG fills/strokes set to `black`/`#000`/`#000000` are automatically remapped to `currentColor`.

Does not depend on Nuxt UI or the Stem module — can be imported standalone in any Vue/Nuxt project.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | (required) | Path relative to `assets/icons/`, without `.svg` extension. Supports subdirectories (e.g., `brand/logo`) |
| `proportional` | `boolean` | `false` | SVG fills its container (width: 100%, height: 100%) |
| `constrained` | `boolean` | `false` | Prevents SVG expansion in flex containers (Safari fix — sets width: auto) |

### Emits

| Event | Description |
|-------|-------------|
| `ready` | Emitted after SVG loads successfully, or on error (to avoid blocking dependent logic) |

### How it works

Uses `import.meta.glob('assets/icons/**/**.svg', { query: '?raw' })` to lazy-load SVGs at build time. The glob is resolved in the consuming project's context, so SVG files must live in the consumer's `assets/icons/` directory.

### Examples

```vue
<!-- Simple icon -->
<SIcon name="logo" />

<!-- Icon in subdirectory -->
<SIcon name="brand/wordmark" />

<!-- Proportional: fills parent container -->
<div class="size-8">
  <SIcon name="logo" proportional />
</div>

<!-- Proportional + constrained (Safari flex fix) -->
<div class="flex items-center size-8">
  <SIcon name="logo" proportional constrained />
</div>
```

### Standalone usage

```ts
import { SIcon } from '@fullbrains/stem'
```

No CSS import needed. Works in any Vue/Nuxt project as long as SVGs are in `assets/icons/`.

## useConfirmModal

Composable for programmatic confirmation dialogs via Nuxt UI's overlay system.

### Usage

```ts
const { confirm } = useConfirmModal()

// In an event handler or function:
await confirm({
  title: 'Delete item?',
  message: 'This cannot be undone.',
  label: 'Delete',
  icon: 'i-ph-trash',
  destructive: true,
  onConfirm: async () => {
    await api.delete(itemId)
  },
})
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | No | Dialog title |
| `message` | `string` | No | Confirmation message |
| `label` | `string` | No | Confirm button label |
| `cancelLabel` | `string` | No | Cancel button label |
| `icon` | `string` | No | Dialog icon |
| `destructive` | `boolean` | No | Error color for confirm button |
| `confirmMatch` | `string` | No | Exact string user must type to enable confirm button |
| `confirmPlaceholder` | `string` | No | Placeholder for the type-to-confirm input |
| `onConfirm` | `() => Promise<void> \| void` | Yes | Action to execute on confirmation |

### Implementation

Uses `useOverlay()` from Nuxt UI to create and open an `SConfirmModal` instance with `destroyOnClose: true`.

## SScrollArea

Wraps Nuxt UI's `UScrollArea` with gradient fade overlays at top/bottom edges when content overflows. Gradient appears/disappears based on scroll position with a 300ms opacity transition. Uses `position: sticky` inside the scroll viewport so the gradient does not cover the scrollbar.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fade` | `boolean` | `true` | Enable/disable the gradient fades |
| `fadeSize` | `string` | `'1.5rem'` | Height of the gradient overlay |
| `fadeColor` | `string` | `'var(--ui-bg)'` | Gradient color (defaults to page background, auto dark mode) |

All other props/attrs are forwarded to `UScrollArea` (e.g., `items`, `virtualize`, `orientation`, `ui`, `class`).

### Usage

```vue
<!-- Basic: give it a fixed height, gradient fades appear automatically -->
<SScrollArea class="h-64">
  <div v-for="item in items" :key="item.id">{{ item.name }}</div>
</SScrollArea>

<!-- Custom fade size -->
<SScrollArea class="h-48" fade-size="3rem">
  <slot />
</SScrollArea>

<!-- On a colored background: override fade color -->
<div class="bg-neutral-100 dark:bg-neutral-900">
  <SScrollArea class="h-40" fade-color="var(--color-neutral-100)">
    <slot />
  </SScrollArea>
</div>

<!-- Disable fade -->
<SScrollArea class="h-48" :fade="false">
  <slot />
</SScrollArea>

<!-- With UScrollArea virtualization -->
<SScrollArea class="h-96" :items="bigList" virtualize>
  <template #default="{ item }">
    <div>{{ item.name }}</div>
  </template>
</SScrollArea>
```

## SSearchBar

Responsive search bar with collapsible inline filters. Uses `ResizeObserver` to monitor row width and collapse filters into a funnel dropdown when the input area falls below `minInputWidth`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `''` | Search text (v-model) |
| `placeholder` | `string` | `'Search...'` | Input placeholder |
| `minInputWidth` | `number` | `280` | Minimum input width before filters collapse |
| `variant` | `'outline' \| 'soft' \| 'subtle' \| 'ghost'` | `'outline'` | Visual variant, matches Stem input variants |
| `activeFilterCount` | `number` | `0` | Number of active filters — shows count on funnel button |

### Slots

| Slot | Description |
|------|-------------|
| `filters` | Inline filters (collapse into funnel on small widths) |
| `more` | Extra filters always shown only in funnel dropdown |
| `trailing` | Always visible after input (e.g., action buttons) |

### Behavior

- Supports same variants as Stem inputs (outline, soft, subtle, ghost), always primary (slate) color
- `ResizeObserver` monitors the row element; when input space < `minInputWidth`, filters collapse
- A funnel button appears when collapsed or when `#more` slot is provided
- Funnel panel animates open/closed via height transition

### Example

```vue
<SSearchBar v-model="query" placeholder="Search projects...">
  <template #filters>
    <SSearchFilter v-model="statusFilter" :options="statusOptions" label="Status" />
    <SSearchOrder v-model="sortOrder" :options="sortOptions" />
  </template>
</SSearchBar>
```

## SSearchChip

Filter chip that wraps `SButton` (variant="soft", size="sm", rounded, compact). Displays a label with selected values summary.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leadingIcon` | `string` | — | Leading icon |
| `trailingIcon` | `string` | — | Trailing icon |
| `active` | `boolean` | `false` | Active/pressed state (darker bg) |
| `label` | `string` | — | Label text |
| `selectedValues` | `string[]` | — | Selected value labels |
| `count` | `number` | — | Total option count |
| `threshold` | `number` | `3` | Max values to list before showing "N selected" |
| `allLabel` | `string` | `'All'` | Label when all are selected |
| `selectedTemplate` | `string` | `'% selected'` | Template for count display (`%` = count) |

### Behavior

- When `selectedValues.length === count` → shows `allLabel`
- When `selectedValues.length <= threshold` → shows comma-joined values
- Otherwise → shows `selectedTemplate` with count

## SSearchFilter

Dropdown filter with `SSearchChip` trigger, optional groups, nullable option, counts, and animated reset button. Supports multi-select (default) and single-select modes.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `Set<string>` | (required) | Selected values (v-model). Empty Set = all selected (multi) or none (single) |
| `options` | `SSearchFilterOption[]` | (required) | Available options |
| `label` | `string` | (required) | Filter label |
| `multiple` | `boolean` | `true` | Multi-select mode. When `false`: single select, no checkbox, no "All", no reset button, dropdown closes on select |
| `placeholder` | `string` | `'None selected'` | Placeholder shown in single mode when nothing is selected |
| `allLabel` | `string` | `'All'` | Label for "select all" (multi mode only) |
| `groups` | `SSearchFilterGroup[]` | — | Option groups |
| `nullable` | `boolean` | `false` | Show a "null" option |
| `nullLabel` | `string` | `'Not Contacted'` | Null option label |
| `nullValue` | `string` | `'not_contacted'` | Null option value |
| `nullIcon` | `string` | `'i-ph-dots-three'` | Null option icon |
| `nullIconClass` | `string` | `'text-(--ui-text-muted)'` | Null option icon class |
| `counts` | `Record<string, number>` | — | Count per option value |
| `chipClass` | `string` | — | Class on outer wrapper |
| `threshold` | `number` | `3` | Max values to list in chip |
| `contentClass` | `string` | `'min-w-48'` | Dropdown content class |
| `alignEnd` | `boolean` | `false` | Align dropdown to end (right) instead of start |

### Models

| Model | Type | Description |
|-------|------|-------------|
| `modelValue` | `Set<string>` | Selected values |
| `open` | `boolean` | Dropdown open state |

### Types

```ts
interface SSearchFilterOption {
  readonly value: string
  readonly label: string
  readonly icon?: string
  readonly iconClass?: string
  readonly group?: string
}

interface SSearchFilterGroup {
  readonly value: string
  readonly label: string
}
```

### Slots

| Slot | Props | Description |
|------|-------|-------------|
| `item` | `{ option, checked }` | Replace the entire menu item content |
| `leading` | `{ option }` | Custom leading content for filter items (inside default item layout) |

### Behavior

- **Multi mode** (default): Empty `Set` = all selected. When all options toggled on, resets to empty Set. Groups: clicking header toggles all in group. Reset button (×) animates in/out.
- **Single mode** (`multiple=false`): No checkbox, no "All" option, no reset button. Dropdown closes on selection. Chip shows selected label or placeholder.

## SSearchOrder

Single-select dropdown for sort order, using `SSearchChip` as trigger.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | (required) | Selected sort value (v-model) |
| `options` | `{value: string, label: string}[]` | (required) | Sort options |
| `contentClass` | `string` | `'min-w-36 w-full'` | Dropdown content class |
| `chipClass` | `string` | — | Class on outer wrapper |

### Example

```vue
<SSearchOrder
  v-model="sortOrder"
  :options="[
    {value: 'newest', label: 'Newest first'},
    {value: 'oldest', label: 'Oldest first'},
  ]"
/>
```

## SEmpty

Empty state placeholder with icon, label, and optional action slot. Supports vertical and horizontal orientation.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | `i-ph-empty-light` (vertical) / `i-ph-empty` (horizontal) | Icon name |
| `label` | `string` | — | Text label |
| `loading` | `boolean` | `false` | Show SSpinner instead of icon (same size) |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Layout direction |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Text and icon size (follows golden rule) |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Replaces label for custom text content |
| `after` | Content after text (e.g., action button) |

### Behavior

- Vertical: `flex-col items-center text-center`, icon is large (size-8 to size-16), uses light icon variant
- Horizontal: `flex items-center`, icon is slightly larger than text (size-4.5 to size-8), uses regular icon
- Text and icon use `text-(--ui-text-muted)` color
- Gap defaults to `gap-3`, overridable via `class`
- CSS class `s-empty` on root element

### Examples

```vue
<!-- Simple -->
<SEmpty label="No results found" />

<!-- With action -->
<SEmpty label="Nothing here yet" icon="i-ph-folder-open">
  <template #after>
    <SButton label="Create new" size="sm" variant="soft" icon="i-ph-plus" />
  </template>
</SEmpty>

<!-- Horizontal -->
<SEmpty label="Empty list" orientation="horizontal" />

<!-- Loading state -->
<SEmpty loading label="Loading..." />
```

## SColorPicker

Hex color input with inline swatch, text input, and popover `UColorPicker`. Supports the same `variant`, `color`, `size`, and `disabled` props as Stem inputs via shared `input-container.ts`.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | — | Hex color value (v-model) |
| `placeholder` | `string` | — | Input placeholder text |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Size following golden rule |
| `variant` | `'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'none'` | `'outline'` | Visual variant matching Stem inputs |
| `color` | `'primary' \| 'error' \| 'success'` | `'primary'` | Semantic color |
| `disabled` | `boolean` | `false` | Disable interaction |
| `defaultValue` | `string` | — | Default hex value. When set, shows a reset button if current value differs |
| `allowEmpty` | `boolean` | `false` | Allow empty string as valid value |

### Behavior

- **Swatch**: colored circle on the left, clickable to open color picker popover
- **Text input**: editable hex value, validates on blur/enter. Auto-prepends `#` if missing
- **Caret**: dropdown toggle button on the right, color follows semantic color (primary=slate, error=rose, success=emerald)
- **Reset button**: appears when `defaultValue` is set and current value differs; neutral color (not themed)
- **Popover**: anchored to the full container (`align: 'start'`), width matches input width
- **Error state**: red border + swatch outline when invalid hex is entered
- **Variant/color classes**: imported from `src/theme/input-container.ts` (shared lookup, no duplication)

### Usage

```vue
<!-- Basic -->
<SColorPicker v-model="color" placeholder="#hex" />

<!-- With variant, color, size -->
<SColorPicker v-model="color" variant="soft" color="error" size="lg" />

<!-- With default value (shows reset button) -->
<SColorPicker v-model="color" default-value="#3b82f6" />

<!-- Allow empty -->
<SColorPicker v-model="color" allow-empty placeholder="Optional" />

<!-- Disabled -->
<SColorPicker v-model="color" disabled />
```

## Package Exports

```ts
// Main entry (@fullbrains/stem)
export { stem } from './theme'              // Theme objects
export { stemIcons, stemColors } from './config' // Config
export { SBadge, SModal, SModalHeader, SModalFooter, SButton, SConfirmModal, SAlertModal, SSpinner, SIcon } from './components'
export { SSearchBar, SSearchChip, SSearchFilter, SSearchOrder, SEmpty, SColorPicker } from './components'
export type { SSearchFilterOption, SSearchFilterGroup } from './components/SSearchFilter.vue'
export { useConfirmModal } from './composables'
export { useAlertModal } from './composables'

// Nuxt module (@fullbrains/stem/nuxt)
// Auto-registers everything above

// Theme only (@fullbrains/stem/theme)
export { stem } from './theme'
```
