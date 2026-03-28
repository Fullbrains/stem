<script setup lang="ts">
import {computed} from 'vue'

type Size = 'sm' | 'md' | 'lg' | 'xl' | 'full' | number

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  size?: Size
  header?: boolean
  closeable?: boolean
  footer?: boolean
  headerSeparator?: boolean
  footerSeparator?: boolean
  disabled?: boolean
  open?: boolean
  defaultOpen?: boolean
}>(), {
  side: 'top',
  size: 'md',
  header: true,
  closeable: true,
  footer: true,
  footerSeparator: true,
  disabled: false,
})

const emit = defineEmits<{
  close: []
  'update:open': [value: boolean]
}>()

const sizeClasses = computed(() => {
  if (typeof props.size === 'number') {
    return {width: `${props.size}px`}
  }

  const sizeMap = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'w-full max-w-full',
  }

  return sizeMap[props.size] || sizeMap.md
})

const uiConfig = computed(() => {
  const classes = typeof sizeClasses.value === 'string' ? sizeClasses.value : ''
  return {
    content: [classes, 'ring-black/5 sm:inset-x-4 max-sm:rounded-b-none shadow-xl sm:inset-t-4 max-sm:inset-b-0 max-sm:inset-t-auto max-sm:top-auto max-sm:bottom-0 mx-auto mt-auto sm:mt-4 max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-2rem)] rounded-2xl'],
    header: 'block px-0 sm:px-0 py-0 min-h-auto',
    body: '!p-0',
    footer: 'px-0 sm:px-0 py-0',
  }
})

const contentStyle = computed(() => {
  return typeof sizeClasses.value === 'object' ? sizeClasses.value : undefined
})

function handleClose() {
  emit('close')
  emit('update:open', false)
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
      @update:open="val => { if (!val) handleClose() }"
  >
    <template #header>
      <SModalHeader
          v-if="header"
          :title="title"
          :description="description"
          :icon="icon"
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
