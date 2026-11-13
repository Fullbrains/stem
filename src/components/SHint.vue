<script lang="ts">
export type HintColor = 'muted' | 'primary' | 'info' | 'success' | 'warning' | 'danger'
export type HintSize = 'xs' | 'sm' | 'md' | 'lg'
</script>

<script setup lang="ts">
import {computed} from 'vue'

/**
 * A rule told where it applies, in one small line under or over what it is
 * about ("You can save it in many folders at once").
 *
 * - `color`: `muted` (the default, a hint the reader can pass over),
 *   `primary`, `info`, `success`, `warning`, `danger`. The whole line takes
 *   it, and each has its own icon unless `icon` names another.
 * - `size`: `xs` (the default), `sm`, `md`, `lg`: the text's and the icon's.
 *
 * No padding nor margin of its own: where it stands is its container's. The
 * icon is centred on the first line (`h-[1lh]`), so a hint that wraps keeps
 * it at the top, at every size.
 */
const props = withDefaults(defineProps<{
  color?: HintColor
  size?: HintSize
  /** Another icon than the color's own. */
  icon?: string
}>(), {
  color: 'muted',
  size: 'xs',
  icon: undefined,
})

const COLORS: Record<HintColor, {text: string, icon: string}> = {
  muted: {text: 'text-(--ui-text-muted)', icon: 'i-ph-info'},
  primary: {text: 'text-(--ui-primary)', icon: 'i-ph-info'},
  info: {text: 'text-(--ui-info)', icon: 'i-ph-info'},
  success: {text: 'text-(--ui-success)', icon: 'i-ph-check-circle'},
  warning: {text: 'text-(--ui-warning)', icon: 'i-ph-warning'},
  danger: {text: 'text-(--ui-error)', icon: 'i-ph-warning-circle'},
}

const SIZES: Record<HintSize, {text: string, icon: string, gap: string}> = {
  xs: {text: 'text-xs', icon: 'size-3.5', gap: 'gap-1.5'},
  sm: {text: 'text-sm', icon: 'size-4', gap: 'gap-1.5'},
  md: {text: 'text-base', icon: 'size-4.5', gap: 'gap-2'},
  lg: {text: 'text-lg', icon: 'size-5', gap: 'gap-2'},
}

const color = computed(() => COLORS[props.color])
const size = computed(() => SIZES[props.size])
</script>

<template>
  <p :class="['flex items-start', size.gap, size.text, color.text]">
    <span class="flex h-[1lh] shrink-0 items-center">
      <UIcon :name="icon ?? color.icon" :class="size.icon"/>
    </span>
    <span><slot/></span>
  </p>
</template>
