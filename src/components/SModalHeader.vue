<script setup lang="ts">
import {computed} from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  description?: string
  icon?: string
  /**
   * The compact header: less air, a smaller title, the icon inline with it.
   * `'mobileOnly'`: compact below sm — where SModal is a sheet from the
   * bottom — and full from sm.
   */
  compact?: boolean | 'mobileOnly'
  closeable?: boolean
  disabled?: boolean
}>(), {
  closeable: true,
  disabled: false,
})

defineEmits<{
  close: []
}>()

/** Each part of the header, compact, full, or compact below sm only. */
const compactClasses = computed(() => {
  if (props.compact === 'mobileOnly') {
    return {
      header: 'py-6 max-sm:py-4',
      title: 'text-2xl max-sm:text-lg',
      blockIcon: 'max-sm:hidden',
      inlineIcon: 'sm:hidden',
    }
  }

  return props.compact
      ? {header: 'py-4', title: 'text-lg', blockIcon: 'hidden', inlineIcon: ''}
      : {header: 'py-6', title: 'text-2xl', blockIcon: '', inlineIcon: 'hidden'}
})

const slots = defineSlots<{
  title?: () => unknown
  description?: () => unknown
  /** Buttons in the header, beside the close button (e.g. "Remove"). */
  actions?: () => unknown
}>()
</script>

<template>
  <header
      class="px-6 flex relative shrink-0 w-full"
      :class="[
      compactClasses.header,
      (description || slots.description) ? 'items-start' : 'items-center',
    ]"
  >
    <!-- pr-8 keeps the text clear of the close button, pinned in the corner;
         with actions, they stand between the two and keep the distance. -->
    <div
        class="min-w-0 flex-1 flex flex-col truncate text-base gap-[1em]"
        :class="{ 'pr-8': !slots.actions }"
    >
      <UIcon
          v-if="icon"
          :name="icon"
          class="size-10 shrink-0"
          :class="compactClasses.blockIcon"
      />
      <div
          v-if="title || slots.title"
          class="leading-tight block truncate flex items-center gap-[0.5em]"
          :class="compactClasses.title"
      >
        <UIcon
            v-if="icon"
            :name="icon"
            class="size-6 shrink-0"
            :class="compactClasses.inlineIcon"
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
    <!-- me-10: 8px short of the close button (12px in, 44px wide). -my-1:
         a button taller than the title does not push the row down, so the
         actions stay level with the close button, pinned 12px down. -->
    <div
        v-if="slots.actions"
        class="ms-3 me-10 -my-1 flex shrink-0 items-center gap-2"
    >
      <slot name="actions"/>
    </div>
    <SCloseButton
        v-if="closeable"
        class="absolute top-3 right-3"
        :disabled="disabled"
        @click="$emit('close')"
    />
  </header>
</template>
