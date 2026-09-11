<script setup lang="ts">
import {computed} from 'vue'
import {iconSizeStyle} from '../theme/icon-sizes'
import {useConfirmModal} from '../composables/useConfirmModal'

const props = defineProps<{
  icon?: string
  label?: string
  trailingIcon?: string
  iconSize?: string
  caret?: boolean
  rounded?: boolean
  disc?: boolean
  compact?: boolean | 'x' | 'y'
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

const resolvedUi = computed(() => {
  const ui: Record<string, string> = {}
  if (props.rounded || props.disc) ui.base = 'rounded-full'
  if (props.disc) ui.base = (ui.base || '') + ' aspect-square justify-center p-0!'
  if (props.compact) {
    if (props.disc) {
      ui.base = (ui.base || '') + ' min-h-0! p-[0.4em]!'
    } else {
      const axis = props.compact === 'x' ? 'x' : props.compact === 'y' ? 'y' : 'xy'
      if (axis.includes('y')) ui.base = (ui.base || '') + ' py-[0.25em]! min-h-[calc(1lh+0.5em)]!'
      if (axis.includes('x')) ui.base = (ui.base || '') + ' px-[0.65em]!'
    }
  }
  if (props.caret) ui.trailingIcon = 'ml-auto'
  return Object.keys(ui).length ? ui : undefined
})

// Overrides --s-icon-size for this instance; the size variant sets it otherwise.
// Inherited by leading icon, trailing icon and the loading spinner alike.
const resolvedStyle = computed(() => iconSizeStyle(props.iconSize))

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
      :label="disc ? undefined : label"
      :trailing-icon="disc ? undefined : resolvedTrailingIcon"
      :color="resolvedColor"
      :ui="resolvedUi"
      :style="resolvedStyle"
      :disabled="loading || $attrs.disabled as boolean"
      @click="handleClick"
  >
    <template #leading>
      <slot v-if="$slots.leading" name="leading"/>
      <span
          v-else
          class="inline-flex overflow-hidden transition-all duration-300 ease-out"
          :class="loading || icon ? 'max-w-(--s-icon-size) opacity-100' : 'max-w-0 opacity-0 -mr-[0.5em]'"
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
