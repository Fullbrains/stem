<script setup lang="ts">
import {computed, inject} from 'vue'
import {SEARCH_BAR_PANEL} from '../composables/searchBarContext'
import {stemScaleClasses, type StemScaleProps, type StemSize} from '../theme/scale'

const model = defineModel<string>({required: true})
const open = defineModel<boolean>('open', {default: false})

const props = withDefaults(defineProps<StemScaleProps & {
  /** On the Stem scale, for the chip and the menu: sm by default. */
  size?: StemSize
  options: { value: string; label: string }[]
  /** The chip's name for what it chooses, in the app's language. */
  label?: string
  contentClass?: string
  chipClass?: string
}>(), {
  label: 'Order by',
  contentClass: 'min-w-36 w-full',
  size: 'sm',
  rounded: true,
})

const scale = computed(() => ({
  size: props.size,
  textSize: props.textSize,
  iconSize: props.iconSize,
  space: props.space,
  spaceX: props.spaceX,
  spaceY: props.spaceY,
  roundness: props.roundness,
  rounded: props.rounded,
}))
const rootScale = computed(() => [`s-size-${props.size}`, ...stemScaleClasses(props)])

const inPanel = inject(SEARCH_BAR_PANEL, false)

const sortLabel = computed(() =>
  props.options.find(o => o.value === model.value)?.label ?? model.value,
)

const items = computed(() => [
  props.options.map(o => ({
    label: o.label,
    type: 'checkbox' as const,
    checked: model.value === o.value,
    onUpdateChecked: () => { model.value = o.value },
  })),
])
</script>

<template>
  <div
    class="inline-flex items-center overflow-hidden s-corner"
    :class="[rootScale, chipClass]"
  >
    <SDropdownMenu
      v-model:open="open"
      :items="items"
      v-bind="scale"
      :content="{align: inPanel ? 'start' as const : 'end' as const, sideOffset: 3}"
      :ui="{content: contentClass}"
    >
      <SSearchChip
        v-bind="scale"
        trailing-icon="i-ph-caret-down"
        :active="open"
        :label="label"
        :selected-values="[sortLabel]"
        :count="options.length"
        class="flex-1 min-w-0"
      />
    </SDropdownMenu>
  </div>
</template>
