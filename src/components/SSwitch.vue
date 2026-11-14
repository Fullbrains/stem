<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps} from '../theme/scale'

/**
 * USwitch on the Stem scale — a switch: the row is as tall as a button of the same size, with the same text, icon, gap and radius.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every USwitch prop, event and
 * slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = defineProps<StemScaleProps>()

const scaleClasses = computed(() => stemScaleClasses(props))
const resolvedStyle = computed(() => stemScaleStyle(props))
</script>

<template>
  <USwitch v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </USwitch>
</template>
