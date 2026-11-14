<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemScaleClasses, stemScaleStyle, stemSpaceStep, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * UTabs on the Stem scale — tabs: the list is as tall as a button of the same size, with the same text, icon, gap and radius.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every UTabs prop, event and
 * slot passes through.
 *
 * A tab's badge is an SBadge of the tab's size, with its defaults: a pill,
 * space-y a step below the size (sm: 28px). Its padding-y comes back as a
 * negative margin-y: in the layout it is as tall as the line, so a tab with
 * a badge is as tall as one without.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)

const scale = useStemScale(props)
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))

const attrs = useAttrs()
const resolvedUi = computed(() => {
  const ui = (attrs.ui ?? {}) as Record<string, unknown>
  const size = scale.value.size ?? 'md'
  return {
    ...ui,
    trailingBadgeSize: ui.trailingBadgeSize ?? size,
    trailingBadge: [`s-pill s-space-y-${stemSpaceStep(size, -1)} my-[calc(var(--s-py)*-1)]`, ui.trailingBadge].filter(Boolean).join(' '),
  }
})
</script>

<template>
  <UTabs :size="scale.size" v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle" :ui="resolvedUi">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UTabs>
</template>
