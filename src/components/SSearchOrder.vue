<script setup lang="ts">
import {computed, inject} from 'vue'
import {SEARCH_BAR_PANEL} from '../composables/searchBarContext'
import {stemScaleClasses, type StemScaleProps, type StemSize, type StemSizeValue, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

const model = defineModel<string>({required: true})
const open = defineModel<boolean>('open', {default: false})

const props = withDefaults(defineProps<StemScaleProps & {
  /** On the Stem scale, for the chip and the menu: sm by default. */
  size?: StemSizeValue
  options: { value: string; label: string }[]
  /** The chip's name for what it chooses, in the app's language. */
  label?: string
  contentClass?: string
  chipClass?: string
}>(), {
  ...stemScaleDefaults,
  label: 'Order by',
  contentClass: 'min-w-36 w-full',
})

// The scale props, inherited from a parent when not given (sm and a pill
// by default), forwarded to the chip and the menu.
const scale = useStemScale(props, {size: 'sm', rounded: true})
const rootScale = computed(() => [`s-size-${scale.value.size}`, ...stemScaleClasses(scale.value)])
// The menu is a plain Stem menu: the chip's scale, not its pill.
const menuScale = computed(() => ({...scale.value, rounded: false}))

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
  <!-- The root takes the pill's spill, the chip inside none (it would be
       clipped by the root's overflow). -->
  <div
    class="inline-flex items-center overflow-hidden s-corner mx-[calc(var(--s-pill-x,0px)*-1)]"
    :class="[rootScale, chipClass]"
  >
    <SDropdownMenu
      v-model:open="open"
      :items="items"
      v-bind="menuScale"
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
        class="flex-1 min-w-0 mx-0!"
      />
    </SDropdownMenu>
  </div>
</template>
