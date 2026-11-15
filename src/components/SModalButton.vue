<script setup lang="ts">
import type {StemSizeValue, StemSpaceValue} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * A button of a modal's header: SButton, soft and rounded — the pill the
 * close button is, for the actions that stand beside it (a "Remove", a way
 * to open the content elsewhere). Nothing of its own about size: `size`,
 * `space`, `icon-size`, `text-size`… are SButton's, on the Stem scale.
 *
 * Its one default: a pill a step lower than it would be — space-y '-1'
 * over what it inherits, else over its size; space-x the size's own
 * (sm: 8px × 6px, 28px tall). `space`, `space-x` or `space-y` given by the
 * caller win, or shift it further when relative ('-1').
 * The default `size` is sm. Icon only, pass `aria-label`.
 *
 * Every SButton prop and event passes through (`color`, `disabled`, `to`,
 * `loading`, `variant`…).
 */
const props = withDefaults(defineProps<{
  size?: StemSizeValue
  space?: StemSpaceValue
  spaceX?: StemSpaceValue
  spaceY?: StemSpaceValue
}>(), {
  size: undefined,
  space: undefined,
  spaceX: undefined,
  spaceY: undefined,
})

// Size and space inherited from a parent when not given; sm by default,
// a step lower than what it inherits.
const scale = useStemScale(props, {size: 'sm', spaceY: '-1'})
</script>

<template>
  <SButton
      variant="soft"
      rounded
      :size="scale.size"
      :space="scale.space"
      :space-x="scale.spaceX"
      :space-y="scale.spaceY"
  />
</template>
