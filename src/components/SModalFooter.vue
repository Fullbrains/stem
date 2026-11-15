<script setup lang="ts">
import {computed, provide} from 'vue'
import {stemSizeStep, stemSpacePx, stemSpaceShift, stemSpaceStep, type StemSize, type StemSizeValue, type StemSpaceValue} from '../theme/scale'
import {STEM_SCALE, useStemScale} from '../composables/useStemScale'

/**
 * The modal's footer, on the alert's rules: padded all around three steps of
 * space above the modal's size (md: 16px).
 *
 * Its buttons are SButtons of the modal's size, space-x a step above a
 * button's own, space-y its own (md: 12 × 8px, 36px tall), four steps
 * below the footer's padding apart (md: 8px). The slot gets them as params, to bind on what it renders:
 *   <template #footer="{button, primary}">
 *     <SButton v-bind="primary" label="Salva"/>
 *     <SButton v-bind="button" label="Annulla"/>
 *   </template>
 * `button` is a plain one (soft), `primary` the default action (primary, solid).
 * `buttons` moves the group from there. Any other Stem control in the slot
 * takes the modal's size, with its own space.
 */
const props = withDefaults(defineProps<{
  separator?: boolean
  /**
   * The buttons' scale, all of them at once: `size`, `spaceX`, `spaceY`,
   * each a step or a shift (from a button's own) replacing the default
   * (size: the modal's; space-x: '+1'; space-y: a button's own).
   */
  buttons?: {size?: StemSizeValue, spaceX?: StemSpaceValue, spaceY?: StemSpaceValue}
}>(), {
  separator: true,
})

defineSlots<{
  default?: (props: {button: Record<string, unknown>, primary: Record<string, unknown>}) => unknown
}>()

const scale = useStemScale({}, {space: '+3'})
const size = computed(() => scale.value.size ?? 'md')
const padding = computed(() => scale.value.space ?? stemSpaceStep(size.value, 3))

const buttonScale = computed(() => {
  const b = props.buttons ?? {}
  const by = stemSpaceShift(b.size)
  return {
    size: b.size == null ? size.value : by == null ? b.size as StemSize : stemSizeStep(size.value, by),
    // A step wider than a button's own (md: 12 × 8px, 36px).
    spaceX: b.spaceX ?? '+1',
    ...(b.spaceY != null && {spaceY: b.spaceY}),
  }
})
const params = computed(() => ({
  button: {...buttonScale.value, variant: 'soft'},
  primary: {...buttonScale.value, color: 'primary', variant: 'solid'},
}))

const style = computed(() => ({
  padding: `${stemSpacePx(padding.value)}px`,
  gap: `${stemSpacePx(stemSpaceStep(padding.value, -4))}px`,
}))

// What the controls inside inherit: the modal's size and type, not the
// footer's space.
provide(STEM_SCALE, computed(() => ({...scale.value, roundness: undefined, space: undefined, spaceX: undefined, spaceY: undefined})))
</script>

<template>
  <footer
    class="w-full flex shrink-0 flex-wrap items-center relative select-none"
    :style="style"
    :class="{ 'border-t border-(--ui-border)': separator }"
  >
    <slot v-bind="params"/>
  </footer>
</template>
