<script setup lang="ts">
import {computed} from 'vue'
import type {StemSize, StemSpace} from '../theme/scale'

/**
 * A button of a modal's header: SButton, soft and rounded — the pill the
 * close button is, for the actions that stand beside it (a "Remove", a way
 * to open the content elsewhere). Nothing of its own about size: `size`,
 * `space`, `icon-size`, `text-size`… are SButton's, on the Stem scale.
 *
 * Its one default: a pill a step wider and a step lower than its size —
 * space-x one step above `size`, space-y one step below (sm: 10px × 6px,
 * 28px tall). `space`, `space-x` or `space-y` given by the caller win.
 * The default `size` is sm. Icon only, pass `aria-label`.
 *
 * Every SButton prop and event passes through (`color`, `disabled`, `to`,
 * `loading`, `variant`…).
 */
const props = withDefaults(defineProps<{
  size?: StemSize
  space?: StemSpace
  spaceX?: StemSpace
  spaceY?: StemSpace
}>(), {
  size: 'sm',
  space: undefined,
  spaceX: undefined,
  spaceY: undefined,
})

const steps: StemSpace[] = ['0', '2xs', 'xs', 'sm', 'md', 'lg', 'xl']

function step(from: StemSize, by: number): StemSpace {
  const i = steps.indexOf(from)
  return steps[Math.min(steps.length - 1, Math.max(0, i + by))]!
}

const resolvedSpaceX = computed(() => props.spaceX ?? (props.space != null ? undefined : step(props.size, 1)))
const resolvedSpaceY = computed(() => props.spaceY ?? (props.space != null ? undefined : step(props.size, -1)))
</script>

<template>
  <SButton
      variant="soft"
      rounded
      :size="size"
      :space="space"
      :space-x="resolvedSpaceX"
      :space-y="resolvedSpaceY"
  />
</template>
