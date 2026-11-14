<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps} from '../theme/scale'

/**
 * UInputMenu on the Stem scale — an autocomplete field. At a given `size` it is exactly as tall
 * as an SButton, with the same text, icon, padding and radius; border and
 * focus ring are drawn inside, so neither shifts the field.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every UInputMenu prop, event and
 * slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = defineProps<StemScaleProps>()

const scaleClasses = computed(() => stemScaleClasses(props))
const resolvedStyle = computed(() => stemScaleStyle(props))
</script>

<template>
  <UInputMenu v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UInputMenu>
</template>
