<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps} from '../theme/scale'
import {useConfirmModal} from '../composables/useConfirmModal'

/**
 * UButton on the Stem scale. `size` sets text, icon, padding, gap and radius
 * together; `text-size`, `icon-size`, `space`, `space-x`, `space-y` and
 * `roundness` move one of them; `rounded` makes it a pill.
 *
 * Without a label it is square (padding-y on every side) and as tall as with
 * one; add `rounded` for a circle.
 */
const props = defineProps<StemScaleProps & {
  icon?: string
  label?: string
  trailingIcon?: string
  caret?: boolean
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
}>()


const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const {confirm} = useConfirmModal()

const resolvedColor = computed(() => props.destructive ? 'error' : undefined)

const scaleClasses = computed(() => stemScaleClasses(props))
const resolvedStyle = computed(() => stemScaleStyle(props))

const resolvedUi = computed(() => {
  const ui: Record<string, string> = {}
  if (props.caret) ui.trailingIcon = 'ml-auto'
  return Object.keys(ui).length ? ui : undefined
})

const resolvedTrailingIcon = computed(() => {
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
      :label="label"
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
    <template v-if="$slots.default" #default>
      <slot/>
    </template>
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing"/>
    </template>
  </UButton>
</template>
