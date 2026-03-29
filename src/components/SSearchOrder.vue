<script setup lang="ts">
import {computed} from 'vue'

const model = defineModel<string>({required: true})
const open = defineModel<boolean>('open', {default: false})

const props = withDefaults(defineProps<{
  options: { value: string; label: string }[]
  contentClass?: string
  chipClass?: string
}>(), {
  contentClass: 'min-w-36 w-full',
})

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
    class="inline-flex items-center overflow-hidden rounded-full"
    :class="chipClass"
  >
    <UDropdownMenu
      v-model:open="open"
      :items="items"
      size="sm"
      :content="{align: 'end' as const, sideOffset: 3}"
      :ui="{content: contentClass}"
    >
      <SSearchChip
        trailing-icon="i-ph-caret-down"
        :active="open"
        label="Order by"
        :selected-values="[sortLabel]"
        :count="options.length"
        class="flex-1 min-w-0"
      />
    </UDropdownMenu>
  </div>
</template>
