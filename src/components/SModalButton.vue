<script setup lang="ts">
import {computed} from 'vue'
import {stemSpaceStep, type StemSize, type StemSpace} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

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
  size: undefined,
  space: undefined,
  spaceX: undefined,
  spaceY: undefined,
})

// Size and space inherited from a parent when not given; sm by default.
const scale = useStemScale(props, {size: 'sm'})

const resolvedSpaceX = computed(() => scale.value.spaceX ?? (scale.value.space != null ? undefined : stemSpaceStep(scale.value.size!, 1)))
const resolvedSpaceY = computed(() => scale.value.spaceY ?? (scale.value.space != null ? undefined : stemSpaceStep(scale.value.size!, -1)))
</script>

<template>
  <SButton
      variant="soft"
      rounded
      :size="scale.size"
      :space="scale.space"
      :space-x="resolvedSpaceX"
      :space-y="resolvedSpaceY"
  />
</template>
