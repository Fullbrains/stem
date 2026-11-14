<script setup lang="ts">
import {computed} from 'vue'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * UInputTags on the Stem scale — a field that collects tags. At a given `size` it is exactly as tall
 * as an SButton, with the same text, icon, padding and radius; border and
 * focus ring are drawn inside, so neither shifts the field.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every UInputTags prop, event and
 * slot passes through.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)

const scale = useStemScale(props)
const scaleClasses = computed(() => {
  const from = scale.value.spaceY ?? scale.value.space ?? scale.value.size
  return [...stemScaleClasses(scale.value), from != null && tagPyClass[String(from)]]
})
// The tags' padding-y: two steps below the field's own, so they follow its
// space as a button does (the theme has it per size, for a bare field). A
// class, since UInputTags gives its style to the inner input. Literal, so
// Tailwind sees them.
const tagPyClass: Record<string, string> = {
  '0': '[--s-tag-py:0px]', '2xs': '[--s-tag-py:0px]', 'xs': '[--s-tag-py:0px]',
  'sm': '[--s-tag-py:4px]', 'md': '[--s-tag-py:6px]', 'lg': '[--s-tag-py:8px]', 'xl': '[--s-tag-py:10px]',
}
const resolvedStyle = computed(() => stemScaleStyle(scale.value))
</script>

<template>
  <UInputTags :size="scale.size" v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UInputTags>
</template>
