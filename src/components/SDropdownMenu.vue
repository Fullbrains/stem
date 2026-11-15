<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {stemArrowProps} from '../arrow'
import {useStemScale} from '../composables/useStemScale'

/**
 * UDropdownMenu on the Stem scale — a menu of actions. Its items are controls on the scale: at a given `size`, as tall as an
 * SButton, with the same text, icon, padding, gap and radius.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. The menu floats in a
 * portal, out of reach of the classes on the trigger, so they go on its
 * `content` as well. `arrow` (true) draws Stem's arrow (see SPopover).
 * Every UDropdownMenu prop, event and slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps & {
  /** Stem's arrow (true), or Reka's arrow props laid over it. */
  arrow?: boolean | Record<string, unknown>
  content?: Record<string, unknown>
}>(), {...stemScaleDefaults, arrow: undefined, content: undefined})
const attrs = useAttrs()

const scale = useStemScale(props)
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))

// `arrow` (true): Stem's arrow, kept off the corners (see SPopover).
const arrowed = computed(() => stemArrowProps(props.arrow, props.content))

const ui = computed(() => {
  const given = (attrs.ui ?? {}) as Record<string, unknown>
  const content = [given.content, ...scaleClasses.value].filter(Boolean).join(' ')
  return content ? {...given, content} : given
})
</script>

<template>
  <UDropdownMenu :size="scale.size" v-bind="$attrs" :arrow="arrowed.arrow as any" :content="arrowed.content as any" :ui="ui">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UDropdownMenu>
</template>
