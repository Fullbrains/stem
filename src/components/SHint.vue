<script lang="ts">
export type HintColor = 'muted' | 'primary' | 'info' | 'success' | 'warning' | 'danger'
export type HintSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
</script>

<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps} from '../theme/scale'

/**
 * A rule told where it applies, in one small line under or over what it is
 * about ("You can save it in many folders at once").
 *
 * - `color`: `muted` (the default, a hint the reader can pass over),
 *   `primary`, `info`, `success`, `warning`, `danger`. The whole line takes
 *   it, and each has its own icon unless `icon` names another.
 *   `primary` is the default text color; `info` is sky, not the theme's
 *   info. In light mode info, success and warning are a 700 and danger a 600:
 *   the lightest that pass AA (4.5:1) as small text on white.
 * - `size`: on the Stem scale, `xs` (the default) to `xl`: text, icon (and
 *   line height) and gap. `text-size`, `icon-size`, `space-x` (the gap)
 *   move one of them.
 *
 * No padding nor margin of its own: where it stands is its container's. The
 * icon sits on the first line, so a hint that wraps keeps it at the top.
 */
const props = withDefaults(defineProps<StemScaleProps & {
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
  primary: {text: 'text-(--ui-text)', icon: 'i-ph-info'},
  info: {text: 'text-sky-700 dark:text-sky-400', icon: 'i-ph-info'},
  success: {text: 'text-(--ui-color-success-700) dark:text-(--ui-success)', icon: 'i-ph-check-circle'},
  warning: {text: 'text-(--ui-color-warning-700) dark:text-(--ui-warning)', icon: 'i-ph-warning'},
  danger: {text: 'text-(--ui-color-error-600) dark:text-(--ui-error)', icon: 'i-ph-warning-circle'},
}

const color = computed(() => COLORS[props.color])
const scaleClasses = computed(() => [`s-size-${props.size}`, ...stemScaleClasses(props)])
const scaleStyle = computed(() => stemScaleStyle(props))
</script>

<template>
  <p
      :class="['flex items-start gap-(--s-gap) text-(length:--s-text) leading-(--s-icon-size)', scaleClasses, color.text]"
      :style="scaleStyle"
  >
    <UIcon :name="icon ?? color.icon" class="size-(--s-icon-size) shrink-0"/>
    <span><slot/></span>
  </p>
</template>
