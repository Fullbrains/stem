<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleDefaults, stemScaleStyle, type StemScaleProps} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * A scale for everything inside it: every Stem component within takes these
 * props when it does not set its own (size, text-size, icon-size, space,
 * space-x, space-y, roundness, rounded, optical-label). Nested SScales
 * override one another prop by prop. It renders a plain element (`as`, a
 * div by default) carrying the scale's CSS variables, so plain content
 * inside can read them too.
 */
const props = withDefaults(defineProps<StemScaleProps & {
  as?: string
}>(), {
  ...stemScaleDefaults,
  as: 'div',
})

const scale = useStemScale(props, {}, {provide: true})

const classes = computed(() => [
  scale.value.size && `s-size-${scale.value.size}`,
  ...stemScaleClasses(scale.value),
])
const style = computed(() => stemScaleStyle(scale.value))
</script>

<template>
  <component :is="as" :class="classes" :style="style">
    <slot/>
  </component>
</template>
