<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps} from '../theme/scale'

/**
 * USelect on the Stem scale — a native-feeling select. At a given `size` the trigger is exactly as tall as an SButton; border
 * and focus ring are drawn inside. The menu's items are controls of the same
 * size too.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. The menu floats in a
 * portal, out of reach of the classes on the trigger, so they go on its
 * `content` as well. Every USelect prop, event and slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = defineProps<StemScaleProps>()
const attrs = useAttrs()

const scaleClasses = computed(() => stemScaleClasses(props))
const resolvedStyle = computed(() => stemScaleStyle(props))

const ui = computed(() => {
  const given = (attrs.ui ?? {}) as Record<string, unknown>
  const content = [given.content, ...scaleClasses.value].filter(Boolean).join(' ')
  return content ? {...given, content} : given
})
</script>

<template>
  <USelect v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle" :ui="ui">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </USelect>
</template>
