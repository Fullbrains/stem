<script setup lang="ts">
import {computed} from 'vue'

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full' | number

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: Size
  header?: boolean
  closeable?: boolean
  footer?: boolean
  /** SModalHeader's `compact`: true, false, or `'mobileOnly'` (below sm). */
  headerCompact?: boolean | 'mobileOnly'
  headerSeparator?: boolean
  footerSeparator?: boolean
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
  /** Classes added to the slideover's own, per slot. */
  ui?: Partial<Record<'content' | 'header' | 'body' | 'footer', string>>
}>(), {
  side: 'top',
  size: 'xl',
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
  footer?: () => unknown
}>()

const emit = defineEmits<{
  close: []
  'update:open': [value: boolean]
}>()

const sizeClasses = computed(() => {
  if (typeof props.size === 'number') {
    return {width: `${props.size}px`}
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

  return sizeMap[props.size] || sizeMap.md
})

const uiConfig = computed(() => {
  const classes = typeof sizeClasses.value === 'string' ? sizeClasses.value : ''
  return {
    content: [classes, 'overflow-hidden ring-black/5 sm:inset-x-4 max-sm:rounded-b-none shadow-xl sm:inset-t-4 max-sm:inset-b-0 max-sm:inset-t-auto max-sm:top-auto max-sm:bottom-0 mx-auto mt-auto sm:mt-4 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-2rem)] s-corner [--s-radius:16px]', props.ui?.content],
    header: ['block px-0 sm:px-0 py-0 min-h-auto', props.ui?.header],
    body: ['!p-0', props.ui?.body],
    footer: ['px-0 sm:px-0 py-0', props.ui?.footer],
  }
})

const contentStyle = computed(() => {
  return typeof sizeClasses.value === 'object' ? sizeClasses.value : undefined
})

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
      :style="contentStyle"
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
      <slot name="after-header"/>
      <div class="w-full h-px bg-border" v-if="headerSeparator"/>
    </template>

    <template #body>
      <slot name="body"/>
    </template>

    <template
        v-if="footer"
        #footer
    >
      <SModalFooter :separator="footerSeparator">
        <slot name="footer"/>
      </SModalFooter>
    </template>
  </USlideover>
</template>
