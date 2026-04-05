<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps<{
  compact?: boolean | 'x' | 'y'
}>()

const resolvedUi = computed(() => {
  if (!props.compact) return undefined
  const classes: string[] = []
  const axis = props.compact === 'x' ? 'x' : props.compact === 'y' ? 'y' : 'xy'
  if (axis.includes('y')) classes.push('py-[0.15em]!')
  if (axis.includes('x')) classes.push('px-[0.5em]!')
  return {base: classes.join(' ')}
})
</script>

<template>
  <UBadge :ui="resolvedUi">
    <template v-if="$slots.leading" #leading>
      <slot name="leading"/>
    </template>
    <template v-if="$slots.default" #default>
      <slot/>
    </template>
    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing"/>
    </template>
  </UBadge>
</template>
