<script setup lang="ts">
import {computed} from 'vue'
import {stemScale, stemScaleDefaults, stemSpacePx, type StemScaleProps, type StemSizeValue, type StemSpaceValue} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

type Width = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | number

const props = withDefaults(defineProps<StemScaleProps & {
  title?: string
  description?: string
  icon?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  /** The panel's width: a Tailwind max-width step, full, or pixels. */
  width?: Width
  header?: boolean
  closeable?: boolean
  footer?: boolean
  /** SModalHeader's `compact`: true, false, or `'mobileOnly'` (below sm). */
  headerCompact?: boolean | 'mobileOnly'
  /** SModalHeader's `wrap`: the title on as many lines as it needs. */
  headerWrap?: boolean
  headerSeparator?: boolean
  footerSeparator?: boolean
  /** The footer buttons' scale (SModalFooter's `buttons`): size, spaceX, spaceY. */
  buttons?: {size?: StemSizeValue, spaceX?: StemSpaceValue, spaceY?: StemSpaceValue}
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
  /** Classes added to the slideover's own, per slot. */
  ui?: Partial<Record<'content' | 'header' | 'body' | 'footer', string>>
}>(), {
  ...stemScaleDefaults,
  side: 'top',
  width: 'xl',
  header: true,
  closeable: true,
  footer: true,
  footerSeparator: true,
  disabled: false,
})

defineSlots<{
  /** The trigger that opens the modal (optional: `open` works without). */
  default?: () => unknown
  title?: () => unknown
  description?: () => unknown
  /** Buttons in the header, beside the close button. */
  actions?: () => unknown
  'after-header'?: () => unknown
  body?: () => unknown
  /** Gets the buttons' props: `{button, primary}` (see SModalFooter). */
  footer?: (props: {button: Record<string, unknown>, primary: Record<string, unknown>}) => unknown
}>()

const emit = defineEmits<{
  close: []
  'update:open': [value: boolean]
}>()

// The scale props (size, space…) pass to everything inside: header buttons,
// body, footer. Not set, they come from a parent SScale.
useStemScale(props, {}, {provide: true})

// Header, body and footer share one padding, all around: three steps of
// space above the modal's size (md: 16px).
const padScale = useStemScale(props, {space: '+3'})
const padding = computed(() => `${stemSpacePx(padScale.value.space!)}px`)

const sizeClasses = computed(() => {
  if (typeof props.width === 'number') {
    return {width: `${props.width}px`}
  }

  const sizeMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'w-full max-w-full',
  }

  return sizeMap[props.width] || sizeMap.md
})

const uiConfig = computed(() => {
  const classes = typeof sizeClasses.value === 'string' ? sizeClasses.value : ''
  return {
    // `!` on the square corners: s-corner sets the radius outside the
    // layers, and a plain utility lost to it — a sheet on the bottom edge
    // kept its rounded lower corners.
    content: [classes, props.side === 'bottom' && 'rounded-b-none!', 'overflow-hidden ring-black/5 sm:inset-x-4 max-sm:rounded-b-none! shadow-xl sm:inset-t-4 max-sm:inset-b-0 max-sm:inset-t-auto max-sm:top-auto max-sm:bottom-0 max-sm:pb-[env(safe-area-inset-bottom)] mx-auto mt-auto sm:mt-4 max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-2rem)] s-corner', props.ui?.content],
    header: ['block px-0 sm:px-0 py-0 min-h-auto', props.ui?.header],
    body: ['!p-0', props.ui?.body],
    footer: ['px-0 sm:px-0 py-0', props.ui?.footer],
  }
})

// On the panel itself (USlideover's `content`; a plain style stops at the
// overlay): a width in pixels, and the padding as a variable for what the
// slots put inside (`p-(--s-modal-p)`). Its squircle is twice the size's
// radius (md: 16px, before the squircle factor).
const radius = computed(() => `${stemScale[padScale.value.roundness ?? padScale.value.size ?? 'md'].radius * 2}px`)
const content = computed(() => ({
  style: {
    ...(typeof sizeClasses.value === 'object' ? sizeClasses.value : {}),
    '--s-modal-p': padding.value,
    '--s-radius': radius.value,
  },
}))

function handleClose() {
  emit('close')
  emit('update:open', false)
}

/** Both ways, for `v-model:open`; closing emits `close` too. */
function onUpdateOpen(value: boolean) {
  if (value) emit('update:open', true)
  else handleClose()
}
</script>

<template>
  <USlideover
      :side="side"
      :ui="uiConfig"
      :content="content"
      :dismissible="!disabled"
      :open="open"
      :default-open="defaultOpen"
      @update:open="onUpdateOpen"
  >
    <template v-if="$slots.default" #default>
      <slot/>
    </template>

    <template #header>
      <SModalHeader
          v-if="header"
          :title="title"
          :description="description"
          :icon="icon"
          :compact="headerCompact"
          :wrap="headerWrap"
          :separator="headerSeparator"
          :closeable="closeable"
          :disabled="disabled"
          @close="handleClose"
      >
        <template v-if="$slots.title" #title>
          <slot name="title"/>
        </template>
        <template v-if="$slots.description" #description>
          <slot name="description"/>
        </template>
        <template v-if="$slots.actions" #actions>
          <slot name="actions"/>
        </template>
      </SModalHeader>
      <div v-if="$slots['after-header']">
        <slot name="after-header"/>
      </div>
      <div class="w-full h-px bg-border" v-if="headerSeparator"/>
    </template>

    <template v-if="$slots.body" #body>
      <div class="p-(--s-modal-p)">
        <slot name="body"/>
      </div>
    </template>

    <template
        v-if="footer"
        #footer
    >
      <SModalFooter v-slot="params" :separator="footerSeparator" :buttons="buttons">
        <slot name="footer" v-bind="params"/>
      </SModalFooter>
    </template>
  </USlideover>
</template>
