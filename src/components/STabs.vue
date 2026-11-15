<script setup lang="ts">
import {computed, useAttrs} from 'vue'
import {stemScaleClasses, stemScaleStyle, stemSizeStep, stemSpaceStep, type StemScaleProps, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * UTabs on the Stem scale — tabs: the list is as tall as a button of the same size, with the same text, icon, gap and radius.
 *
 * `text-size`, `icon-size`, `space`, `space-x`, `space-y`, `roundness` move
 * one axis off `size`; `rounded` makes it a pill. Every UTabs prop, event and
 * slot passes through.
 *
 * A tab's badge is an SBadge a size below the tab's, with its defaults (a
 * pill, space-y a step below its size) and space-x a step below too: in an
 * sm tab an xs badge, 20px tall, 4px padding-x. Soft, without a border; in
 * the active tab its text takes the tab's (on a solid ground). Its padding-y comes back as a
 * negative margin-y: in the layout it is as tall as the line, so a tab with
 * a badge is as tall as one without.
 */
defineOptions({inheritAttrs: false})

const props = withDefaults(defineProps<StemScaleProps>(), stemScaleDefaults)

const scale = useStemScale(props, {spaceY: '-1'})
const scaleClasses = computed(() => stemScaleClasses(scale.value))
const resolvedStyle = computed(() => stemScaleStyle(scale.value))

const attrs = useAttrs()
const resolvedUi = computed(() => {
  const ui = (attrs.ui ?? {}) as Record<string, unknown>
  const size = scale.value.size ?? 'md'
  const badge = stemSizeStep(size, -1)
  return {
    ...ui,
    trailingBadgeSize: ui.trailingBadgeSize ?? badge,
    trailingBadge: [`group-data-[state=active]:text-current s-pill s-space-x-${stemSpaceStep(badge, -1)} s-space-y-${stemSpaceStep(badge, -1)} my-[calc(var(--s-py)*-1)]`, ui.trailingBadge].filter(Boolean).join(' '),
  }
})

// Soft by default (UTabs draws it outline); an item's own badge props win.
const resolvedItems = computed(() => {
  const items = attrs.items as Record<string, unknown>[] | undefined
  return items?.map((item) => {
    const b = item.badge
    if (b == null || b === false) return item
    return {...item, badge: {variant: 'soft', ...(typeof b === 'object' ? b : {label: b})}}
  })
})
</script>

<template>
  <UTabs :size="scale.size" v-bind="$attrs" :class="scaleClasses" :style="resolvedStyle" :ui="(resolvedUi as any)" :items="(resolvedItems as any)">
    <template v-for="(_, slot) in $slots" #[slot]="slotProps">
      <slot :name="slot" v-bind="slotProps ?? {}"/>
    </template>
  </UTabs>
</template>
