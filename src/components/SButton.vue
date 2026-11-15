<script setup lang="ts">
import {computed, useSlots} from 'vue'
import {stemLabelShift, stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'
import {useConfirmModal} from '../composables/useConfirmModal'

/**
 * UButton on the Stem scale. `size` sets text, icon, padding, gap and radius
 * together; `text-size`, `icon-size`, `space`, `space-x`, `space-y` and
 * `roundness` move one of them; `rounded` makes it a pill.
 *
 * Space-y a step below the size's own by default (md: 10 × 8px, 36px tall).
 * Without a label it keeps padding-x and padding-y, so it is wider than
 * tall: `square` makes it 1:1, padding-y on every side; with `rounded`, a
 * circle.
 */
const props = withDefaults(defineProps<StemScaleProps & {
  icon?: string
  label?: string
  trailingIcon?: string
  caret?: boolean
  /**
   * 1:1, width = height: padding-y on every side. Icon only: no label,
   * trailing icon or caret. A squircle; with `rounded`, a circle. Unlike
   * UButton's own `square`, never on by itself.
   */
  square?: boolean
  loading?: boolean
  destructive?: boolean
  confirmTitle?: string
  confirmMessage?: string
  confirmIcon?: string
  confirmLabel?: string
  confirmCancelLabel?: string
  confirmMatch?: string
  confirmPlaceholder?: string
  onConfirm?: () => Promise<void> | void
}>(), stemScaleDefaults)


const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const {confirm} = useConfirmModal()

const resolvedColor = computed(() => props.destructive ? 'error' : undefined)

const scale = useStemScale(props, {spaceY: '-1'})
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))

const slots = useSlots()

// The icon is drawn in SButton's own leading slot, so UButton does not know
// it is there (its `leading` variant stays off, and it would take the label
// for one alone): the optical label trim on its left, after the icon,
// is set here. Every other case is UButton's own (theme/button.ts).
const labelShift = computed(() =>
  !!(props.icon || props.loading) && !!(props.label || slots.default),
)

// Slot content takes UButton's place for the label, so the theme's trim
// does not reach it: each side gets it here, `icon` beside an icon, `alone`
// (the icon's air added) without.
const slotLabelClass = computed(() => [
  labelShift.value ? stemLabelShift.iconStart : stemLabelShift.aloneStart,
  (props.caret || props.trailingIcon) ? stemLabelShift.iconEnd : stemLabelShift.aloneEnd,
].join(' '))

const resolvedUi = computed(() => {
  const ui: Record<string, string> = {}
  // 1:1: the vertical padding on every side, so width = height.
  if (props.square) ui.base = 'aspect-square justify-center p-(--s-py)! mx-0!'
  if (props.caret) ui.trailingIcon = 'ml-auto'
  if (labelShift.value) ui.label = stemLabelShift.iconStart
  return Object.keys(ui).length ? ui : undefined
})

const resolvedTrailingIcon = computed(() => {
  if (props.square) return undefined
  if (props.caret) return 'i-ph-caret-down'
  return props.trailingIcon
})

function handleClick(e: MouseEvent) {
  if (props.loading) return
  if (props.onConfirm) {
    e.stopPropagation()
    confirm({
      title: props.confirmTitle,
      message: props.confirmMessage,
      label: props.confirmLabel || props.label,
      cancelLabel: props.confirmCancelLabel,
      icon: props.confirmIcon,
      destructive: props.destructive,
      confirmMatch: props.confirmMatch,
      confirmPlaceholder: props.confirmPlaceholder,
      onConfirm: props.onConfirm,
    })
  } else {
    emit('click', e)
  }
}
</script>

<template>
  <UButton
      :size="scale.size"
      :label="square ? undefined : label"
      :trailing-icon="resolvedTrailingIcon"
      :color="resolvedColor"
      :ui="resolvedUi"
      :class="scaleClasses"
      :style="resolvedStyle"
      :disabled="loading || $attrs.disabled as boolean"
      @click="handleClick"
  >
    <template #leading>
      <slot v-if="$slots.leading" name="leading"/>
      <span
          v-else
          class="inline-flex overflow-hidden transition-all duration-300 ease-out"
          :class="[
            loading || icon ? 'max-w-(--s-icon-size) opacity-100' : 'max-w-0 opacity-0 -mr-(--s-gap)',
          ]"
      >
        <SSpinner v-if="loading"/>
        <UIcon v-else-if="icon" :name="icon" class="size-(--s-icon-size) shrink-0"/>
      </span>
    </template>
    <template v-if="$slots.default && !square" #default>
      <span data-slot="label" :class="slotLabelClass">
        <slot/>
      </span>
    </template>
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing"/>
    </template>
  </UButton>
</template>
