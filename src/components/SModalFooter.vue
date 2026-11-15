<script setup lang="ts">
import {computed, provide} from 'vue'
import {stemSizeStep, stemSpacePx, stemSpaceShift, stemSpaceStep, type StemSize, type StemSizeValue, type StemSpace, type StemSpaceValue} from '../theme/scale'
import {STEM_SCALE, useStemScale} from '../composables/useStemScale'

/**
 * The modal's footer, on the alert's rules: padded all around two steps of
 * space above the modal's size (md: 14px), as an alert's padding-x.
 *
 * Its buttons are SModalButtons of the modal's size, squircles (not pills):
 * space-x a step above the size's own, space-y a step below (md: 12 × 8px,
 * 36px tall), two steps below the footer's padding apart (md: 10px). The slot gets them as params, to bind on what
 * it renders:
 *   <template #footer="{button, primary}">
 *     <SModalButton v-bind="primary" label="Salva"/>
 *     <SModalButton v-bind="button" label="Annulla"/>
 *   </template>
 * `button` is a plain one, `primary` the default action (primary, solid).
 * `buttons` moves the group from there. Any other Stem control in the slot
 * takes the modal's size, with its own space.
 */
const props = withDefaults(defineProps<{
  separator?: boolean
  /**
   * The buttons' scale, all of them at once: `size`, `spaceX`, `spaceY`,
   * each a step or a shift from their default (size: the modal's; space-x:
   * their size's; space-y: a step below it).
   */
  buttons?: {size?: StemSizeValue, spaceX?: StemSpaceValue, spaceY?: StemSpaceValue}
}>(), {
  separator: true,
})

defineSlots<{
  default?: (props: {button: Record<string, unknown>, primary: Record<string, unknown>}) => unknown
}>()

const scale = useStemScale({}, {space: '+2'})
const size = computed(() => scale.value.size ?? 'md')
const padding = computed(() => scale.value.space ?? stemSpaceStep(size.value, 2))

function shiftOr<T>(v: unknown, base: T, step: (from: T, by: number) => T): T {
  if (v == null) return base
  const by = stemSpaceShift(v)
  return by == null ? v as T : step(base, by)
}
const buttonSize = computed(() => shiftOr<StemSize>(props.buttons?.size, size.value, stemSizeStep))
// Squircles, not pills: the footer's buttons are the modal's actions, not
// the header's round ones.
const buttonScale = computed(() => ({
  rounded: false,
  size: buttonSize.value,
  spaceX: shiftOr<StemSpace>(props.buttons?.spaceX, stemSpaceStep(buttonSize.value, 1), stemSpaceStep),
  spaceY: shiftOr<StemSpace>(props.buttons?.spaceY, stemSpaceStep(buttonSize.value, -1), stemSpaceStep),
}))
const params = computed(() => ({
  button: {...buttonScale.value},
  primary: {...buttonScale.value, color: 'primary', variant: 'solid'},
}))

const style = computed(() => ({
  padding: `${stemSpacePx(padding.value)}px`,
  gap: `${stemSpacePx(stemSpaceStep(padding.value, -2))}px`,
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
