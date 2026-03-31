<script setup lang="ts">
import {computed} from 'vue'

const props = withDefaults(defineProps<{
  leadingIcon?: string
  trailingIcon?: string
  active?: boolean
  label?: string
  selectedValues?: string[]
  count?: number
  threshold?: number
  allLabel?: string
  selectedTemplate?: string
}>(), {
  threshold: 3,
  allLabel: 'All',
  selectedTemplate: '% selected',
})

const displayValue = computed(() => {
  if (!props.selectedValues || props.count === undefined) return null
  const len = props.selectedValues.length
  if (len === props.count) return props.allLabel
  if (len <= props.threshold) return props.selectedValues.join(', ')
  return props.selectedTemplate.replace('%', String(len))
})
</script>

<template>
  <SButton
      :icon="leadingIcon"
      caret
      variant="soft"
      size="sm"
      rounded
      compact
      class="select-none"
      :class="[active ? 'bg-slate-400/30!' : '']"
  >
    <template v-if="label && displayValue !== null">
      <span class="text-(--ui-text-toned) shrink-0 font-normal">{{ label }}</span>
      <span class="font-semibold truncate">{{ displayValue }}</span>
    </template>
    <slot v-else/>
  </SButton>
</template>
