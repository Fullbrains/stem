# Stem Components Reference

Detailed API of every component and composable in `@fullbrains/stem`. Conventions and the reasons behind them are in `SKILL.md`; how the theme is built is in `theming.md`.

Every file in `src/components/` is auto-registered by the Nuxt module, and every export of `src/composables/` is auto-imported. "Passes through" means the wrapper declares only the props listed here: every other prop, attribute and listener reaches the wrapped component.

## The scale props

Every sized Stem component takes these (`StemScaleProps`, `src/theme/scale.ts`). The sections below say "scale props" and list only what is specific to the component.

| Prop | Type | Meaning |
|------|------|---------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` or a shift | Text, icon, padding, gap and radius at once |
| `textSize` | `StemSize` | Font size only |
| `iconSize` | `StemSize` or any CSS length | Icon size (and line height). A length is set inline as `--s-icon-size` |
| `space` | `0 \| '2xs' \| 'xs' … 'xl' \| '2xl' … '5xl'` or a shift | Padding on both axes, and gap |
| `spaceX` | same as `space` | Horizontal padding, and gap |
| `spaceY` | same as `space` | Vertical padding |
| `roundness` | `StemSize` or a shift | Squircle radius |
| `rounded` | `boolean` | Pill: round ends, never a squircle |
| `opticalLabel` | `'auto' \| 'always' \| 'never'` | Label trim beside an icon (`auto` when absent; the old boolean reads `true` → `auto`, `false` → `never`) |

All default to `undefined`: an absent prop stays absent and can be inherited.

**Values.** Space steps in px: `0` 0, `2xs` 4, `xs` 6, `sm` 8, `md` 10, `lg` 12, `xl` 14, `2xl` 16, `3xl` 18, `4xl` 20, `5xl` 22. A **shift** is a signed string (`'-1'`, `'+2'`, up to ±6) or a non-zero number (`:space-y="-1"`): that many steps from the value the component would have otherwise, clamped at the ends of the scale. `0` is always the absolute "none".

**Resolution** (`useStemScale`), per prop:

1. the component's own prop;
2. else the nearest parent that provides a scale: `SScale`, `SModal`, `SModalFooter`, `SAlert`, `SSearchBar`;
3. else the component's default (table below);
4. else nothing: Nuxt UI's own default applies (`md`, or a `UFieldGroup`'s size).

An absolute value replaces what is below it; a shift moves it. A component's default shift is applied over what it inherits; an absolute default stands only where nothing came down (and a shift that came down moves it). A shift with no base left settles from `md` (`size`), from the size's own space (`space*`), from the size's own radius (`roundness`). On each axis `space` is applied first, then `spaceX` / `spaceY` over it. A shift on a container reaches its children still a shift, so each child moves from its own size.

Only components pass a scale down (provide/inject): a plain `<div>` cannot. Use `<SScale>`.

**Defaults per component**

| Component | `size` | Other defaults | Result at the default size |
|-----------|--------|----------------|----------------------------|
| SButton | — (md) | `spaceY: '-1'` | 10 × 8px padding, 36px tall |
| SBadge | — (md) | `rounded`, `spaceY: '-1'` | pill, 36px tall (sm: 28px) |
| SModalButton, SCloseButton | sm | `spaceY: '-1'`, soft, `rounded` | 8 × 6px, 28px tall |
| SInput, SSelect, SSelectMenu, SInputMenu, SInputTags | — (md) | none | 40px tall |
| STextarea | — (md) | `spaceY: '+1'` | 12px padding-y |
| SDropdownMenu | — (md) | none | items 40px tall |
| STabs, SCheckbox, SSwitch, SRadioGroup | — (md) | `spaceY: '-1'` | tab / row 36px tall |
| SAlert | sm | `spaceX: '+2'`, `spaceY: '+4'`, `roundness: '+1'` | 12 × 16px padding, 8px radius |
| SHint | xs | none | 12px text and icon |
| SEmpty | md | none | |
| SColorPicker | sm | none | 32px tall |
| SSearchBar | md (sm with `compact`) | `rounded` | 40px tall |
| SSearchChip | sm | `rounded`, `spaceX: '-1'`; in a bar also `spaceY: '-2'` (`'-1'` at xs) | 6px padding-x, 28px tall |
| SSearchFilter | sm | `rounded`, `spaceX: '-1'` | |
| SSearchOrder | sm | `rounded` | |

A control is `icon + 2 × padding-y` tall: md is 20 + 2 × 8 = 36px with `spaceY: '-1'`, 20 + 2 × 10 = 40px without.

```vue
<SButton size="sm" label="Save" icon="i-ph-floppy-disk"/>      <!-- 28px -->
<SButton size="sm" space-x="lg" space-y="xs" label="Wide"/>    <!-- 12 × 6px -->
<SInput size="md" text-size="sm" icon-size="lg"/>
<SBadge size="sm" :rounded="false" roundness="xl"/>           <!-- squircle, xl radius -->
<SScale size="-1" space-y="-1"><SButton label="A"/><SModalButton label="B"/></SScale>
```

## SScale

A scale for everything inside it. Renders one plain element carrying the scale's classes, so plain content inside can read the CSS variables too.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | | Passed to every Stem component inside that does not set its own |
| `as` | `string` | `'div'` | The element it renders |

**Slots:** `default`.

- Nested SScales override one another prop by prop.
- `<SScale size="-1">` makes an SButton sm and an SModalButton xs: the shift reaches each child and moves its own default.
- The element gets `s-size-{size}` (when a size is resolved), the single-axis classes, `s-optical-label-*` and `s-control`.

## SButton

`UButton` on the scale, plus confirm dialogs, a loading spinner, a caret and a 1:1 mode.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `spaceY: '-1'` | |
| `icon` | `string` | — | Leading icon, drawn in SButton's own `leading` slot |
| `label` | `string` | — | Label; with `square`, the accessible name only |
| `trailingIcon` | `string` | — | Trailing icon |
| `caret` | `boolean` | — | Trailing `i-ph-caret-down`, pushed to the right edge (`ml-auto`); wins over `trailingIcon` |
| `square` | `boolean` | — | 1:1: padding-y on every side, icon only |
| `loading` | `boolean` | — | Spinner in place of the icon; the button is disabled and ignores clicks |
| `destructive` | `boolean` | — | `color="error"` (an explicit `color` still wins), and passed to the confirm dialog |
| `confirmTitle`, `confirmMessage`, `confirmIcon`, `confirmLabel`, `confirmCancelLabel`, `confirmMatch`, `confirmPlaceholder` | `string` | — | The confirm dialog's options (see `useConfirmModal`). `confirmLabel` falls back to `label` |
| `onConfirm` | `() => Promise<void> \| void` | — | When set, a click opens the confirm dialog instead of emitting `click` |

**Emits:** `click: [e: MouseEvent]` — not while `loading`, and not when `onConfirm` is set.

**Slots:** `leading` (replaces icon and spinner), `default` (label content; not rendered with `square`), `trailing`.

**Passes through:** every other `UButton` prop and attribute (`color`, `variant`, `to`, `disabled`, `type`, `block`, `class`…).

- Without a label it keeps padding-x and padding-y, so it is wider than tall (md: 40 × 36). `square` makes it 1:1 (md: 36 × 36); with `rounded`, a circle. Unlike UButton's `square`, it never turns on by itself.
- `square` drops the trailing icon and the caret, hides `label` and sets it as `aria-label`.
- The icon's wrapper animates its width, so an icon or a spinner arriving does not jump.
- With `onConfirm` the click's propagation is stopped before the dialog opens.

```vue
<SButton label="Save" icon="i-ph-floppy-disk" trailing-icon="i-ph-arrow-right"/>
<SButton label="Options" caret variant="soft"/>
<SButton icon="i-ph-plus" label="Add" square rounded/>            <!-- circle, aria-label "Add" -->
<SButton label="Delete" destructive
         confirm-title="Delete it?" confirm-message="This cannot be undone."
         :on-confirm="remove"/>
```

## SModalButton

`SButton`, soft and a pill: the button of a header, an alert, a toolbar.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `size` | size or shift | `'sm'` (inherited first) | |
| `space`, `spaceX`, `spaceY` | space or shift | `spaceY: '-1'` | Given by the caller they win, or shift it further when relative |

**Passes through:** every other SButton prop and event (`label`, `icon`, `caret`, `color`, `variant`, `loading`, `to`, `text-size`, `icon-size`…); a `variant` given by the caller wins over soft. It forwards no slots: use `label` and `icon`.

- sm: 8 × 6px, 28px tall. Icon only, pass `aria-label`.
- It resolves size and space itself and hands SButton absolute values.

```vue
<SModalButton label="Remove" icon="i-ph-trash"/>
<SModalButton icon="i-ph-arrow-square-out" aria-label="Open" size="md"/>
```

## SCloseButton

`SModalButton` with an X (`i-ph-x`): the close control of every Stem surface.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `label` | `string` | Nuxt UI's `modal.close` in the app's locale | Accessible name (`aria-label`), never shown |

**Passes through:** everything else, to SModalButton and SButton (`size`, scale props, `disabled`, `@click`). No slots. Placement is the caller's.

```vue
<SCloseButton @click="open = false"/>
```

## SCopyButton

Copies a text to the clipboard and shows a check in place of its icon while the copy is fresh. An icon-only `SButton`.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `text` | `string \| (() => string \| null \| Promise<string \| null>)` | required | What to copy. A function is called on click; `null` copies nothing |
| `label` | `string` | `'Copy'` | Accessible name (`aria-label`), never shown |
| `color` | `ButtonProps['color']` | `'neutral'` | |
| `variant` | `ButtonProps['variant']` | `'soft'` | |
| `size` | `ButtonProps['size']` | — | |
| `icon` | `string` | `'i-ph-copy'` | |
| `copiedIcon` | `string` | `'i-ph-check'` | |
| `duration` | `number` | `1500` | How long the check stays, in ms |

**Emits:** `copied: [text: string]`, `error: [error: unknown]`.

**Passes through:** everything else SButton takes (`space`, `square`, `rounded`, `class`…). No slots.

- Falls back to `document.execCommand('copy')` where the Clipboard API is refused.
- A failure is emitted as `error` and leaves the icon alone.

```vue
<SCopyButton :text="url" label="Copy link" square/>
<SCopyButton :text="() => fetchSecret()" @copied="toast.add({title: 'Copied'})"/>
```

## SBadge

`UBadge` on the scale: same text, icon, padding-x and gap as an SButton of the size.

**Props:** the scale props only (defaults `rounded`, `spaceY: '-1'`).

**Slots:** `leading`, `default`, `trailing`.

**Passes through:** every `UBadge` prop (`label`, `icon`, `trailingIcon`, `avatar`, `color`, `variant`…).

- A pill by default; `:rounded="false"` for a squircle. A parent SScale's `rounded` wins over the default.
- sm: 6px padding-y, 28px tall; `space-y="sm"` gives the size's own (32px). No caret.

```vue
<SBadge label="Draft" icon="i-ph-file" size="sm"/>
<SBadge label="Draft" size="sm" :rounded="false" space-y="sm" variant="subtle"/>
```

## SInput

`UInput` on the scale.

**Props:** the scale props only (no default shift). **Slots, events, other props:** all `UInput`'s, passed through (`inheritAttrs: false`, every slot forwarded with its params).

- md is 40px tall: a step taller than a button, whose space-y is a step below.
- Border and focus are drawn as an inset ring and an outer shadow: neither changes the field's size.
- The text is placed as a button's label (see `singleLineText` in `theming.md`).

```vue
<SInput v-model="name" placeholder="Name" icon="i-ph-user"/>
<SInput v-model="q" size="sm" variant="soft" trailing-icon="i-ph-magnifying-glass"/>
```

## STextarea

`UTextarea` on the scale.

**Props:** the scale props only (default `spaceY: '+1'`). Everything else is `UTextarea`'s, passed through with every slot.

- md: 12px padding-y, 10px padding-x.
- Leading and trailing icons sit at the top, one padding-y from the edge.

```vue
<STextarea v-model="notes" :rows="4" placeholder="Notes"/>
```

## SSelect, SSelectMenu, SInputMenu

`USelect`, `USelectMenu` and `UInputMenu` on the scale: the trigger and the menu's items.

**Props:** the scale props only (no default shift). Everything else passes through with every slot.

- The trigger is as tall as an SInput (md: 40px); the items are controls of the same size.
- The menu floats in a portal, out of reach of the trigger's classes: the scale classes are added to `ui.content` as well (a `ui.content` given by the caller is kept).
- An `iconSize` given as a CSS length is set inline on the trigger only; the menu takes tokens.

```vue
<SSelect v-model="status" :items="['Todo', 'Done']" placeholder="Status"/>
<SSelectMenu v-model="owner" :items="people" value-key="id" size="sm" icon="i-ph-user"/>
<SInputMenu v-model="city" :items="cities" placeholder="City"/>
```

## SInputTags

`UInputTags` on the scale.

**Props:** the scale props only. Everything else is `UInputTags`'s, passed through with every slot.

- A tag is a soft pill with the field's text, icon size, padding-x and gap; its padding-y is two steps below the field's (sm: 4px, a 24px tag in a 32px field).
- The field gives that padding-y back, so it is as tall with tags as without.
- The wrapper sets `--s-tag-py` from `spaceY ?? space ?? size` (0px at xs and below, sm 4, md 6, lg 8, xl 10); steps above xl have no entry and keep the size's own.

```vue
<SInputTags v-model="tags" placeholder="Add a tag"/>
```

## SCheckbox, SSwitch, SRadioGroup

`UCheckbox`, `USwitch` and `URadioGroup` on the scale.

**Props:** the scale props only (default `spaceY: '-1'`). Everything else passes through with every slot.

- Box, track and dot are as big as the size's icon (md: 20px); the switch's track is 1.75 times as wide.
- The row has the size's text, gap and padding-y, no padding-x: md is 36px tall, as a button.
- Radio options side by side are a padding-x apart.

```vue
<SCheckbox v-model="agree" label="I agree"/>
<SSwitch v-model="enabled" label="Enabled" size="sm"/>
<SRadioGroup v-model="plan" :items="['Free', 'Pro']" orientation="horizontal"/>
```

## SDropdownMenu

`UDropdownMenu` on the scale: its items are controls of the size.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | none | For the items |
| `arrow` | `boolean \| Record<string, unknown>` | — | `true`: Stem's arrow; an object is Reka's arrow props laid over it |
| `content` | `Record<string, unknown>` | — | Reka's content props; with an arrow, `arrowPadding: 16` is added unless given |

**Passes through:** every other `UDropdownMenu` prop, event and slot (`items`, `v-model:open`, item slots…).

- The scale classes go on `ui.content` (the menu is in a portal); the trigger is whatever the default slot holds and is not touched.
- An item is as tall as an input of the size (md: 40px): the menu has no space-y shift of its own.
- Only scale tokens reach the menu: an `iconSize` given as a CSS length is not applied.

```vue
<SDropdownMenu :items="items" arrow size="sm">
  <SButton label="Actions" caret variant="soft" size="sm"/>
</SDropdownMenu>
```

## SPopover, STooltip

`UPopover` and `UTooltip` with Stem's arrow.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `arrow` | `boolean \| Record<string, unknown>` | — | `true`: Stem's arrow; an object is Reka's arrow props laid over it |
| `content` | `Record<string, unknown>` | — | Reka's content props; with an arrow, `arrowPadding: 16` is added unless given |

**Passes through:** every other prop, event and slot.

- Without `arrow` they are the Nuxt UI components as themed.
- A bare Nuxt UI overlay takes the same arrow as `:arrow="stemArrow"`.

```vue
<SPopover arrow>
  <SButton label="Open"/>
  <template #content><div class="p-4">Content</div></template>
</SPopover>
<STooltip text="Copy" arrow><SButton icon="i-ph-copy" label="Copy" square/></STooltip>
```

## SArrow

The SVG Reka renders as the arrow of a popover, tooltip or menu. Not used directly: it is the `as` of `stemArrow`.

**Props:** none. It reads `class`, `width`, `height` and `data-slot` from its attributes (Reka's), and draws `STEM_ARROW_SHAPE`.

- Reka's arrow points down: the shape, drawn pointing up, is flipped.
- The fill and stroke come from the overlay theme's `arrow` slot: Stem sets `fill-(--ui-bg) stroke-black/10 dark:stroke-white/10` for popover, dropdown menu and context menu; a tooltip keeps Nuxt UI's own.
- The outline is a 2px line under the fill, clipped above the surface's own ring.

## STabs

`UTabs` on the scale: each tab is a button of the size.

**Props:** the scale props only (default `spaceY: '-1'`). Everything else passes through with every slot.

- A tab has a button's text, icon, padding, height and squircle (md: 36px). The pill list wraps the tabs with a 2px inset, so it is 4px taller and concentric with the active tab.
- `rounded` makes the list and the tabs pills.
- An item's `badge` becomes a soft badge (`{variant: 'soft', …}`; the item's own badge props win), a size below the tab's (`ui.trailingBadgeSize`, unless given), a pill, with space-x and space-y a step below that size's. Its padding-y comes back as a negative margin, so a tab with a badge is as tall as one without. In the active tab its text takes the tab's colour.

```vue
<STabs v-model="tab" :items="[{label: 'All', value: 'all', badge: 12}, {label: 'Mine', value: 'mine'}]"/>
<STabs :items="items" variant="link" size="sm"/>
```

## SAlert

`UAlert` on the scale, with a content slot under the text and SModalButton actions.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'sm'`, `spaceX: '+2'`, `spaceY: '+4'`, `roundness: '+1'` | Set inline on the root (`stemScaleVars`) |
| `description` | `string` | — | |
| `orientation` | `'horizontal' \| 'vertical'` | — (UAlert's: vertical) | |
| `close` | `boolean \| Record<string, unknown>` | `false` | The X: `true`, or the SModalButton props it takes |
| `closeIcon` | `string` | `appConfig.ui.icons.close`, else `i-ph-x` | |
| `buttons` | `{size?, spaceX?, spaceY?}` | — | The scale of all the buttons at once (X, actions, slot params); each a step or a shift from its default |
| `descriptionTextSize` | size or shift | `'-1'` | The description's text, from the alert's |
| `ui` | `Record<string, string \| undefined>` | — | Classes per UAlert slot, merged with SAlert's own |

**Emits:** `update:open: [value: boolean]` — `false` when the X is clicked.

**Slots:** `default` (content under the description), `actions` (params `{button, primary}`), `close`, `description`; every other UAlert slot (`leading`, `title`) is forwarded.

**Passes through:** every other `UAlert` prop (`title`, `icon`, `avatar`, `color`, `variant`, `actions`…).

- Colours `neutral`, `primary`, `secondary`, `info`, `success`, `warning`, `error`; variants `outline` (default), `soft`, `subtle`, `solid`.
- sm: 12 × 16px padding, 8px radius. Its children inherit its size and type, not its space or radius.
- Actions (from `actions`) and the X are SModalButtons of the alert's size with their own defaults (sm: 28px tall), a step below the alert's space-x apart (sm: 10px). In `horizontal` their row is exactly the title's line and they are centred on it, so a one-line alert is no taller for them.
- In the `#actions` slot bind `button` on a plain SModalButton and `primary` on the default action (primary, solid); each carries size, the `buttons` space and the solid tint.
- On a solid alert the X and the soft actions take the tone's tint, a solid action the ground's opposite.
- The description is a text step below the title, on lines of that step's icon plus 4px (sm alert: 12px on 16px lines).
- With `orientation="horizontal"` and a default slot the alert is laid out as a grid and the slot spans the text's and the actions' columns; otherwise the slot stays under the description in the text's column.
- The avatar is twice the icon (sm: 32px).
- Without `orientation` the alert is vertical (UAlert's default), and SAlert lays its buttons out accordingly.

```vue
<SAlert title="Upload failed" description="The file is too large." icon="i-ph-warning-circle"
        color="error" orientation="horizontal" close :actions="[{label: 'Retry'}]"/>

<SAlert title="What went wrong?" orientation="horizontal" close>
  <template #actions="{button, primary}">
    <SModalButton v-bind="button" label="Skip"/>
    <SModalButton v-bind="primary" label="Send"/>
  </template>
  <ReasonChips/>
</SAlert>
```

A toast has no such slot: its `description` takes a render function. `UToast` has no `variant` either: pass `ui: alertClasses(color, variant)` to `toast.add()`.

## SHint

One small line telling where a rule applies.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'xs'` | `spaceX` is the gap |
| `color` | `'muted' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'muted'` | The whole line's colour, and its icon |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'xs'` (inherited first) | |
| `icon` | `string` | the colour's own | `i-ph-info` (muted, primary, info), `i-ph-check-circle`, `i-ph-warning`, `i-ph-warning-circle` |

**Slots:** `default` (the text). Types `HintColor`, `HintSize` are exported.

- A `<p>` with no padding or margin of its own.
- The icon sits on the first line. `iconSize` changes the icon alone: the lines stay as tall as the size's icon (`--s-hint-line`) and the icon stays centred on the first one.
- `info` is sky, not the theme's info.

```vue
<SHint>You can save it in many folders at once.</SHint>
<SHint color="warning" size="sm">This link expires in 24 hours.</SHint>
```

## SEmpty

Empty state: a glyph, a label, an optional description and an action.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'md'` | Text and gap; `iconSize` sets the glyph (a token: that size's icon; or a CSS length) |
| `label` | `string` | — | Alone, a muted line; with a description, the title |
| `description` | `string` | — | The line under the title, a text step below, muted |
| `icon` | `string` | `i-ph-empty-light` (vertical), `i-ph-empty` (horizontal) | |
| `loading` | `boolean` | — | An SSpinner of the glyph's size instead of the icon |
| `stroke` | `number` | `1` | The spinner's stroke |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` (inherited first) | |

**Slots:** `default` (replaces the label), `description`, `after` (e.g. a button).

- The glyph is an illustration with a scale of its own: horizontal 16 / 20 / 24 / 28 / 32px, vertical 32 / 40 / 48 / 56 / 64px (xs … xl).
- The gap is the size's (`--s-gap`); vertical is centred, and with a description the text block is at most `max-w-sm` wide.
- Glyph and muted text are `--ui-text-muted`; a title over a description is `--ui-text`, medium.

```vue
<SEmpty label="No results"/>
<SEmpty label="Nothing here yet" description="Create your first project." icon="i-ph-folder-open">
  <template #after><SButton label="Create" icon="i-ph-plus" size="sm" variant="soft"/></template>
</SEmpty>
<SEmpty label="Loading" loading orientation="horizontal" size="sm"/>
```

## SSpinner

Animated SVG spinner. Self-contained (its keyframes are in its own `<style>`): usable without the Stem module, from `@fullbrains/stem/components/SSpinner`.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `size` | `StemSize` or any CSS length | `'var(--s-icon-size, 1em)'` | A token is that size's icon in px |
| `stroke` | `number` | `1` | Stroke width, in the 24-unit viewBox |
| `grow` | `boolean` | `false` | Animates in from zero width (500ms) |

- By default it follows the ambient icon size, so a spinner swapped in for an icon keeps the same box.
- Sized through CSS `width` / `height`; the colour is `currentColor`.

```vue
<SSpinner/>
<SSpinner size="lg" :stroke="2"/>
<SSpinner size="2em" grow/>
```

## SIcon

A local SVG rendered inline, so it takes `currentColor`. Usable without the Stem module, from `@fullbrains/stem/components/SIcon`.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `name` | `string` | required | The icon's name for the injected loader: with the module, its path under the icons directory without `.svg` (`logo`, `brand/wordmark`) |
| `proportional` | `boolean` | `false` | The SVG fills its container (100% × 100%) |
| `constrained` | `boolean` | `false` | With `proportional`: `width: auto` (Safari, in flex containers) |

**Emits:** `ready` — after the SVG is in the DOM, and also when loading fails.

- The source comes from the `StemIconLoader` injected with `STEM_ICON_LOADER`; without a loader, or when it returns `null`, nothing is rendered.
- The module (or `@fullbrains/stem/standalone`) provides a loader built from `<srcDir>/<iconsDir>/**/*.svg`; `iconsDir` defaults to `assets/icons`.
- Fills and strokes set to `black`, `#000` or `#000000` are remapped to `currentColor`.
- The SVG is injected with `v-html`: only trusted sources.

```vue
<SIcon name="logo" class="w-24"/>
<SIcon name="brand/wordmark" proportional constrained class="h-6"/>
```

## SModal

A sheet built on `USlideover`, with a header, a body and a footer.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | none | Passed to everything inside; the padding is three steps above the size's space |
| `title`, `description`, `icon` | `string` | — | The header's (`description` is sanitized HTML) |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | |
| `width` | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' … '7xl' \| 'full' \| number` | `'xl'` | A Tailwind `max-w-*` step, `full`, or pixels |
| `header` | `boolean` | `true` | Render the header |
| `closeable` | `boolean` | `true` | The X in the header |
| `footer` | `boolean` | `true` | Render the footer |
| `headerCompact` | `boolean \| 'mobileOnly'` | — | Icon inline with the title; `'mobileOnly'`: below sm only |
| `headerWrap` | `boolean` | — | The title wraps instead of being cut |
| `headerSeparator` | `boolean` | — | A line under the header |
| `footerSeparator` | `boolean` | `true` | A line over the footer |
| `buttons` | `{size?, spaceX?, spaceY?}` | — | The footer buttons' scale (SModalFooter's `buttons`) |
| `disabled` | `boolean` | `false` | Not dismissible, and the X disabled |
| `open` | `boolean` | `undefined` | Controlled state (`v-model:open`) |
| `defaultOpen` | `boolean` | — | |
| `ui` | `Partial<Record<'content' \| 'header' \| 'body' \| 'footer', string>>` | — | Classes added to the slideover's own |

**Emits:** `close`, `update:open: [value: boolean]` (closing emits both).

**Slots:** `default` (the trigger; optional), `title`, `description`, `actions` (header buttons beside the X), `after-header`, `body`, `footer` (params `{button, primary}`).

- Padding, all around header, body and footer: md 16px (sm 14, lg 18). It is on the panel as `--s-modal-p`: the body is padded already; `after-header` content adds its own (`px-(--s-modal-p)`). `ui.body: 'p-0 sm:p-0'` for a body that runs edge to edge.
- Without `v-model:open` it opens by itself: from its default slot (the trigger) or with `default-open`.
- The panel's radius is twice the size's (md: 16px, before the squircle factor).
- With `side="top"` (default) it slides from the bottom below sm, where it is a bottom sheet with square lower corners, and from the top from sm.
- The header's title is a text step above the modal's size (md: 18px; the size's own when compact), semibold; the description a step below, muted.
- Header buttons are a size below the modal's, never below sm; `#actions` content inherits it. They sit at the top, centred on a row as tall as the title's line.
- Footer buttons: see SModalFooter.

```vue
<SModal v-model:open="open" title="Edit profile" description="Update your details." icon="i-ph-user" width="lg">
  <template #body><SInput v-model="name" class="w-full"/></template>
  <template #footer="{button, primary}">
    <SButton v-bind="primary" label="Save" @click="save"/>
    <SButton v-bind="button" label="Cancel" @click="open = false"/>
  </template>
</SModal>
```

## SModalHeader

The modal's header. Used by SModal; reads the scale from its parent (it takes no scale props).

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `title` | `string` | — | |
| `description` | `string` | — | HTML, sanitized (DOMPurify; escaped to text on the server) |
| `icon` | `string` | — | 40px above the title; 24px inline when compact |
| `compact` | `boolean \| 'mobileOnly'` | — | The icon inline with the title |
| `closeable` | `boolean` | `true` | Shows an SCloseButton |
| `disabled` | `boolean` | `false` | Disables the close button |
| `wrap` | `boolean` | — | The title on as many lines as it needs |

**Emits:** `close`. **Slots:** `title`, `description`, `actions`.

- The actions and the close sit in an `SScale` of the buttons' size, a step above that size's space apart (md modal: sm buttons, 10px).

## SModalFooter

The modal's footer. Used by SModal; reads the scale from its parent.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `separator` | `boolean` | `true` | A line above |
| `buttons` | `{size?, spaceX?, spaceY?}` | — | Each a step or a shift, replacing the default (size: the modal's; spaceX: `'+1'`; spaceY: a button's own) |

**Slots:** `default`, with params `{button, primary}`: `button` is `{size, spaceX, variant: 'soft'}`, `primary` is `{size, spaceX, color: 'primary', variant: 'solid'}`.

- Buttons bound to them are SButtons of the modal's size, md: 12 × 8px, 36px tall.
- The gap between its children is four steps below its padding (md: 8px).
- Other Stem controls inside inherit the modal's size and type, with their own space.

## SConfirmModal

The confirmation dialog `useConfirmModal()` and SButton's `onConfirm` open. An SModal with a confirm and a cancel button.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `title` | `string` | `'Confirm'` | |
| `message` | `string` | `'Are you sure?'` | HTML, sanitized |
| `label` | `string` | `'Confirm'` | The confirm button |
| `cancelLabel` | `string` | `'Cancel'` | |
| `icon` | `string` | — | |
| `destructive` | `boolean` | — | The confirm button in `error` |
| `confirmMatch` | `string` | — | The user must type this exact text to enable the confirm button |
| `confirmPlaceholder` | `string` | — | The typing field's placeholder |
| `headerSeparator` | `boolean` | — | A line under the title; the message then moves into the body |
| `headerCompact` | `boolean \| 'mobileOnly'` | — | SModal's compact header |
| `onConfirm` | `() => Promise<void> \| void` | — | Awaited before closing; the dialog is disabled and the button loading meanwhile |

**Emits:** `close: [confirmed: boolean]`.

- Enter in the typing field confirms, once the text matches.
- If `onConfirm` throws, the dialog stays open.

## SAlertModal

A message with one button, opened by `useAlertModal()`.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `title` | `string` | `'Info'` | |
| `message` | `string` | — | The header's description (sanitized HTML) |
| `icon` | `string` | — | |
| `confirmLabel` | `string` | `'OK'` | |
| `confirmColor` | `string` | — (primary) | |

**Emits:** `close`.

## SScrollArea

`UScrollArea` with fades at the top and bottom edges while there is more to scroll.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| `fade` | `boolean` | `true` | |
| `fadeSize` | `string` | `'1.5rem'` | The fade's height |
| `fadeColor` | `string` | the first non-transparent background up the DOM, else `var(--ui-bg)` | `color` mode only |
| `fadeMode` | `'color' \| 'mask'` | `'color'` | `color` paints a gradient of the surface over the content; `mask` fades the content itself to transparent |

**Slots:** `default`. **Passes through:** every `UScrollArea` prop and attribute (`class`, `orientation`, `ui`…).

- Give it a height: a fade shows only while the content overflows and is not at that edge (300ms transition).
- `color` needs a surface of one colour. The fades are sticky inside the viewport and compensate the scroller's padding.
- `mask` (`.s-scroll-mask`) lets whatever is behind show through, and leaves a strip whole along the scrollbar.

```vue
<SScrollArea class="h-64"><Row v-for="r in rows" :key="r.id" :row="r"/></SScrollArea>
<SScrollArea class="h-48" fade-mode="mask" fade-size="3rem">…</SScrollArea>
```

## SColorPicker

A hex colour field: swatch, text input, reset and a popover `UColorPicker`.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'sm'` | |
| `modelValue` | `string` | required | `v-model`, a lowercase `#rrggbb` (or `''` with `allowEmpty`) |
| `defaultValue` | `string` | — | Shows a reset button while the value differs |
| `allowEmpty` | `boolean` | — | An empty field is valid and emits `''` |
| `placeholder` | `string` | — | |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` (inherited first) | |
| `variant` | `'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'none'` | `'outline'` | |
| `color` | `'primary' \| 'error' \| 'success'` | `'primary'` | |
| `disabled` | `boolean` | `false` | |

**Emits:** `update:modelValue: [value: string]`.

- As tall as an input of the size (sm: 32px), from `inputContainerClasses`: same border, hover and focus as a Stem input.
- The swatch is a circle as big as the size's icon; clicking it opens the popover, the caret toggles it.
- The typed text is validated on blur and on Enter: six hex digits, with or without `#`, emitted lowercase. Invalid text turns the ring rose and emits nothing.
- The popover is as wide as the field and takes the field's scale classes.

```vue
<SColorPicker v-model="color" placeholder="#hex"/>
<SColorPicker v-model="color" default-value="#3b82f6" size="md" variant="soft"/>
```

## SSearchBar

A search field that holds filter chips and collapses them into a funnel panel when the input runs out of room.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `rounded`; size md | |
| `modelValue` | `string` | `''` | `v-model` |
| `placeholder` | `string` | `'Search...'` | |
| `minInputWidth` | `number` | `280` | Below this input width, in px, the filters collapse |
| `variant` | `'outline' \| 'soft' \| 'subtle' \| 'ghost'` | `'outline'` | |
| `activeFilterCount` | `number` | `0` | Shown as a count on the funnel button when above 0 |
| `filtersLabel` | `string` | `'Filters'` | The funnel button's accessible name |
| `compact` | `boolean` | `false` | The sm size, when no `size` is given or inherited |
| `icon` | `string` | `appConfig.ui.icons.search`, else `i-ph-magnifying-glass` | |
| `hideClear` | `boolean` | `false` | Hides the button that empties the field |

**Slots:** `filters` (inline; moved into the panel when collapsed), `more` (always in the panel), `trailing` (always visible, after the filters).

- md is 40px tall, as an input; a pill unless `:rounded="false"`. Border and focus are inset rings, as an input's.
- The funnel button shows when the filters are collapsed or `#more` has content; it opens a panel under the row.
- It passes its size and type to what it holds, not its space. Chips in the row take the bar's size and tighten (space-y two steps below: 32px in a 40px bar, 24 in 32); chips in the panel do not, and their menus open from the chip's left edge. Chips in the row are 4px apart and 4px from the bar's right edge.
- The clear button shows while there is text.

```vue
<SSearchBar v-model="query" placeholder="Search projects" :active-filter-count="status.size">
  <template #filters>
    <SSearchFilter v-model="status" :options="statusOptions" label="Status"/>
    <SSearchOrder v-model="order" :options="orderOptions"/>
  </template>
</SSearchBar>
```

## SSearchChip

A filter chip: `SButton` soft, pill, with a caret.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'sm'`, `rounded`, `spaceX: '-1'` | |
| `leadingIcon` | `string` | — | The button's leading icon |
| `trailingIcon` | `string` | — | Declared; the chip always draws its caret |
| `active` | `boolean` | — | A darker ground (the menu is open) |
| `label` | `string` | — | |
| `labelIcon` | `string` | — | Drawn before the label, which then shows only while everything is selected; label and value become the `aria-label` |
| `selectedValues` | `string[]` | — | |
| `count` | `number` | — | The total number of options |
| `threshold` | `number` | `3` | Above it, the values are replaced by `selectedTemplate` |
| `allLabel` | `string` | `'All'` | Shown when `selectedValues.length === count` |
| `selectedTemplate` | `string` | `'% selected'` | `%` is replaced by the count |

**Slots:** `default` — rendered instead of the label and value when `label`, `selectedValues` or `count` is missing.

- sm: 6px padding-x and gap, 28px tall; inside an SSearchBar's row it takes the bar's size, with space-y two steps below (one at xs).
- Every other SButton prop and event passes through.

```vue
<SSearchChip label="Status" :selected-values="['Active', 'Pending']" :count="5"/>
```

## SSearchFilter

A dropdown filter: a chip, a menu of options and a reset button.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'sm'`, `rounded`, `spaceX: '-1'` | For the chip, the menu and the reset |
| `modelValue` | `Set<string>` | required | `v-model`. Empty means "all" |
| `options` | `readonly SSearchFilterOption[]` | required | `{value, label, icon?, iconClass?, group?}` |
| `label` | `string` | required | |
| `icon` | `string` | — | Drawn before the label; one selected option shows its own icon |
| `multiple` | `boolean` | `true` | `false`: one value, the menu closes on select |
| `placeholder` | `string` | `'None selected'` | Single mode, nothing selected |
| `allLabel` | `string` | `'All'` | |
| `groups` | `readonly SSearchFilterGroup[]` | — | `{value, label}`; options join one by `group` |
| `nullable` | `boolean` | `false` | Adds a "no value" option |
| `nullLabel` | `string` | `'Not Contacted'` | |
| `nullValue` | `string` | `'not_contacted'` | |
| `nullIcon` | `string` | `'i-ph-dots-three'` | |
| `nullIconClass` | `string` | `'text-(--ui-text-muted)'` | |
| `counts` | `Record<string, number>` | — | A count beside each option; "all" shows their sum |
| `chipClass` | `string` | — | Classes for the root pill |
| `threshold` | `number` | `3` | The chip's |
| `contentClass` | `string` | `'min-w-48'` | Classes for the menu |
| `alignEnd` | `boolean` | — | The menu aligned to the pill's end (inline in a bar only) |
| `resetLabel` | `string` | `'Reset'` | The reset button's accessible name |
| `selectedTemplate` | `string` | — (the chip's) | |

**Models:** `v-model` (`Set<string>`), `v-model:open` (`boolean`). **Emits:** `update:modelValue: [value: Set<string>]`.

**Slots:** `chip` (params `{values: string[]}`; replaces label and values while something is filtered), `item` (params `{option, checked}`; a whole row), `leading` (params `{option}`; the row's icon).

**Types:** `SSearchFilterOption`, `SSearchFilterGroup` (exported).

- Multiple: selecting every option resets to the empty set, unless there is only one option. A group header toggles its whole group.
- The reset (X) shows on a partial multiple selection and animates its width; the menu is anchored to the whole pill, so it does not move.
- Without its label text (an `icon` or the `chip` slot, while filtering) the chip shows the label in a tooltip.
- Attributes land on the root pill (`inheritAttrs: false`).

```vue
<SSearchFilter v-model="status" label="Status" :counts="{active: 12, done: 5}"
               :options="[{value: 'active', label: 'Active', icon: 'i-ph-circle'}, {value: 'done', label: 'Done'}]"/>
<SSearchFilter v-model="owner" label="Owner" :options="people" :multiple="false" align-end/>
```

## SSearchOrder

A single-choice dropdown for the sort order, with an SSearchChip as trigger.

| Prop | Type | Default | Meaning |
|------|------|---------|---------|
| scale props | | `size: 'sm'`, `rounded` | For the chip and the menu (the menu is never a pill) |
| `modelValue` | `string` | required | `v-model` |
| `options` | `{value: string, label: string}[]` | required | |
| `label` | `string` | `'Order by'` | The chip's label |
| `contentClass` | `string` | `'min-w-36 w-full'` | Classes for the menu |
| `chipClass` | `string` | — | Classes for the root |

**Models:** `v-model` (`string`), `v-model:open` (`boolean`, default `false`).

- The menu aligns to the end inline, to the start in a search bar's panel.

```vue
<SSearchOrder v-model="order" :options="[{value: 'new', label: 'Newest'}, {value: 'old', label: 'Oldest'}]"/>
```

## Composables

### useStemScale

```ts
function useStemScale(
  props: StemScaleProps,
  defaults: StemScaleProps = {},
  options: {provide?: boolean} = {},
): ComputedRef<StemScaleResolved>
```

Resolves a component's scale props as described in *The scale props*: own prop, else the injected parent's, else `defaults`, with shifts settled into steps. With `{provide: true}` it provides what it layered (shifts with no base kept as shifts) to its children under `STEM_SCALE`. `defaults` may use getters to stay reactive.

Also exported from the file: `STEM_SCALE` (`InjectionKey<ComputedRef<StemScaleProps>>`) and `stemScaleKeys`. A container that passes only part of its scale provides its own value:

```ts
const scale = useStemScale(props, {size: 'sm', spaceY: '-1'})
provide(STEM_SCALE, computed(() => ({...scale.value, space: undefined, spaceX: undefined, spaceY: undefined})))
```

### useConfirmModal

```ts
const {confirm} = useConfirmModal()
await confirm({
  title: 'Delete bot?',
  message: 'Type <b>My Bot</b> to confirm.',   // sanitized HTML
  label: 'Delete', cancelLabel: 'Keep',
  icon: 'i-ph-trash',
  destructive: true,
  confirmMatch: 'My Bot', confirmPlaceholder: 'Bot name',
  headerSeparator: false, headerCompact: 'mobileOnly',
  onConfirm: () => api.delete(id),             // required
})
```

Opens an `SConfirmModal` through Nuxt UI's `useOverlay` (destroyed on close). The promise resolves when the dialog closes, with no value: do the work in `onConfirm`.

### useAlertModal

```ts
const {alert} = useAlertModal()
await alert('Saved')
await alert({title: 'Error', message: 'Something went wrong', icon: 'i-ph-warning', confirmLabel: 'Close', confirmColor: 'error'})
```

Opens an `SAlertModal`; a string is the `message`. Resolves when it closes.

### searchBarContext

`SEARCH_BAR_COMPACT` (`InjectionKey<Ref<boolean>>`, true in an sm or xs bar) and `SEARCH_BAR_PANEL` (`InjectionKey<boolean>`, true inside the funnel panel): what SSearchBar provides to the chips in its slots.

## Package exports

`@fullbrains/stem` exports the theme (`stem`, `stemColors`, `stemIcons`), the scale helpers (`stemScale`, `stemSizes`, `stemScaleClasses`, `stemScaleStyle`, `stemScaleVars`, `stemSpaceStep`, types `StemSize`, `StemSpace`, `StemScaleProps`), `alertClasses`, `alertColors`, `alertVariants`, `inputContainerClasses`, `inputIconColors`, the arrow (`stemArrow`, `stemArrowProps`, `arrowShape`, `STEM_ARROW_SHAPE`, `STEM_ARROW_PADDING`), `useConfirmModal`, `useAlertModal`, `STEM_ICON_LOADER` and these components: SModal, SModalHeader, SModalFooter, SBadge, SButton, SInput, STextarea, SSelect, SSelectMenu, SInputMenu, SInputTags, SDropdownMenu, STabs, SCheckbox, SSwitch, SRadioGroup, SCloseButton, SConfirmModal, SAlertModal, SSpinner, SIcon, SSearchBar, SSearchChip, SSearchFilter, SSearchOrder, SEmpty, SHint, SColorPicker, SScrollArea, SPopover, STooltip.

SAlert, SArrow, SCopyButton, SModalButton, SScale and `useStemScale` (with `STEM_SCALE`, `stemScaleKeys`) are exported from `src/index.ts` too.

Subpaths: `@fullbrains/stem/nuxt`, `/standalone`, `/theme`, `/icon-loader`, `/components/SIcon`, `/components/SSpinner`.

## Removed

- `compact` on SButton and SBadge → `space`, `space-x`, `space-y` (a step or a shift).
- `disc` on SButton → `square` with `rounded`.
- SModal `size` as the panel's width → `width`; `size` is now the scale.
