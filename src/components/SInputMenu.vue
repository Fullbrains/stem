<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * UInputMenu on the Stem scale — an autocomplete field. At a given `size` the trigger is exactly as tall as an SButton; border
 * and focus ring are drawn inside. The menu's items are controls of the same
 * size too.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. The menu floats in a
 * portal, out of reach of the classes on the trigger, so they go on its
 * `content` as well. Every UInputMenu prop, event and slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)
const attrs = useAttrs()

const scale = useStemScale(props)
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))

const ui = computed(() => {
  const given = (attrs.ui ?? {}) as Record<string, unknown>
  const content = [given.content, ...scaleClasses.value].filter(Boolean).join(' ')
  return content ? {...given, content} : given
})
</script>

<template>
  <UInputMenu :size="scale.size" v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle" :ui="ui">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UInputMenu>
</template>
