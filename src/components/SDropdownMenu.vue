<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'

/**
 * UDropdownMenu on the Stem scale — a menu of actions. Its items are controls on the scale: at a given `size`, as tall as an
 * SButton, with the same text, icon, padding, gap and radius.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. The menu floats in a
 * portal, out of reach of the classes on the trigger, so they go on its
 * `content` as well. Every UDropdownMenu prop, event and slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)
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
  <UDropdownMenu v-bind="$attrs" :ui="ui">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UDropdownMenu>
</template>
