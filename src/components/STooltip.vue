<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemArrowProps} from '../arrow'

/**
 * UTooltip with Stem's arrow: `arrow` (true) draws it instead of Reka's
 * plain V, kept 16px off the panel's corners. An object is Reka's arrow
 * props, laid over Stem's. Every other UTooltip prop, event and slot
 * passes through.
 */
defineOptions({inheritAttrs: false})

const props = defineProps<{
  arrow?: boolean | Record<string, unknown>
  content?: Record<string, unknown>
}>()
const attrs = useAttrs()
const resolved = computed(() => stemArrowProps(props.arrow, props.content))
</script>

<template>
  <UTooltip v-bind="attrs" :arrow="resolved.arrow as any" :content="resolved.content as any">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UTooltip>
</template>
