<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * UBadge on the Stem scale: at a given size, as tall as a button, with the
 * same text, icon, padding and radius. Icons on both sides (`icon`,
 * `trailing-icon`); no caret. By default a pill with space-y a step below
 * the size's (sm: 6px, 28px tall); `:rounded="false"` for a squircle.
 */
const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)

const scale = useStemScale(props, {rounded: true, spaceY: '-1'})
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))
</script>

<template>
  <UBadge :size="scale.size" :class="scaleClasses" :style="resolvedStyle">
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
