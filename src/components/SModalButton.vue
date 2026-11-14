<script setup lang="ts">
import type {StemSize} from '../theme/scale'

/**
 * A button of a modal's header: SButton, soft and rounded — the pill the
 * close button is, for the actions that stand beside it (a "Remove", a way
 * to open the content elsewhere). Nothing of its own about size: `size`,
 * `space`, `icon-size`, `text-size`… are SButton's, on the Stem scale.
 *
 * The default `size` is sm (32px), the modal header's. Icon only, pass
 * `aria-label`: the button has no other name.
 *
 * Every SButton prop and event passes through (`color`, `disabled`, `to`,
 * `loading`, `variant`…).
 */
withDefaults(defineProps<{
  size?: StemSize
}>(), {
  size: 'sm',
})
</script>

<template>
  <SButton variant="soft" rounded :size="size"/>
</template>
