<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'

/**
 * URadioGroup on the Stem scale — a radio group: each option is as tall as a button of the same size, with the same text, icon, gap and radius.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every URadioGroup prop, event and
 * slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)

const scaleClasses = computed(() => stemScaleClasses(props))
const resolvedStyle = computed(() => stemScaleStyle(props))
</script>

<template>
  <URadioGroup v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </URadioGroup>
</template>
