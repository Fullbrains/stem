<script setup lang="ts">
const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  compact?: boolean
  closeable?: boolean
  disabled?: boolean
}>(), {
  closeable: true,
  disabled: false,
})

defineEmits<{
  close: []
}>()

const slots = defineSlots<{
  title?: () => unknown
  description?: () => unknown
}>()
</script>

<template>
  <header
      class="px-6 flex relative shrink-0 w-full"
      :class="[
      compact ? 'py-4' : 'py-6',
      (description || slots.description) ? 'items-start' : 'items-center',
    ]"
  >
    <div class="pr-8 flex flex-col truncate text-base gap-[1em]">
      <UIcon
          v-if="icon && !compact"
          :name="icon"
          class="size-10 shrink-0"
      />
      <div
          v-if="title || slots.title"
          class="leading-tight block truncate flex items-center gap-[0.5em]"
          :class="compact ? 'text-lg' : 'text-2xl'"
      >
        <UIcon
            v-if="icon && compact"
            :name="icon"
            class="size-6 shrink-0"
        />
        <slot name="title">{{ title }}</slot>
      </div>
      <div
          v-if="description || slots.description"
          class="text-base block whitespace-normal sm:whitespace-pre-line"
      >
        <slot name="description"><span v-html="description"/></slot>
      </div>
    </div>
    <SCloseButton
        v-if="closeable"
        class="absolute top-3 right-3"
        :disabled="disabled"
        @click="$emit('close')"
    />
  </header>
</template>
