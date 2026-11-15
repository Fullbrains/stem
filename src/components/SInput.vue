<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * UInput on the Stem scale — a text field. At a given `size` it is exactly as tall
 * as an SButton, with the same text, icon, padding and radius; border and
 * focus ring are drawn inside, so neither shifts the field.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every UInput prop, event and
 * slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)

const scale = useStemScale(props)
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))
</script>

<template>
  <UInput :size="scale.size" v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UInput>
</template>
