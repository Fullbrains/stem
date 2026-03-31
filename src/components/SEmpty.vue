<script setup lang="ts">
import {computed} from 'vue'

type Orientation = 'vertical' | 'horizontal'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  label?: string
  icon?: string
  loading?: boolean
  orientation?: Orientation
  size?: Size
}>(), {
  orientation: 'vertical',
  size: 'md',
})

const resolvedIcon = computed(() =>
    props.icon ?? (props.orientation === 'vertical' ? 'i-ph-empty-light' : 'i-ph-empty'),
)

const iconSize: Record<Orientation, Record<Size, string>> = {
  horizontal: {
    xs: 'size-4.5',
    sm: 'size-5',
    md: 'size-6',
    lg: 'size-7',
    xl: 'size-8',
  },
  vertical: {
    xs: 'size-8',
    sm: 'size-10',
    md: 'size-12',
    lg: 'size-14',
    xl: 'size-16',
  },
}

const textSize: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}
</script>

<template>
  <div
      class="s-empty gap-3"
      :class="[
      orientation === 'vertical'
        ? 'flex flex-col items-center text-center'
        : 'flex items-center',
    ]"
  >
    <SSpinner v-if="loading" :class="iconSize[orientation][size]" :stroke="orientation === 'vertical' ? 1.5 : undefined" class="text-(--ui-text-muted) shrink-0"/>
    <UIcon v-else :name="resolvedIcon" :class="iconSize[orientation][size]"
           class="text-(--ui-text-muted) shrink-0"/>
    <div v-if="label || $slots.default" :class="size && textSize[size]" class="text-(--ui-text-muted)">
      <slot>{{ label }}</slot>
    </div>
    <slot name="after"/>
  </div>
</template>
