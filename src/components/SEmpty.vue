<script setup lang="ts">
import {computed} from 'vue'
import {stemScale, stemScaleClasses, stemScaleStyle, type StemScaleProps} from '../theme/scale'

type Orientation = 'vertical' | 'horizontal'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<StemScaleProps & {
  /**
   * What is missing. Alone, a muted line (as for a loading or error state);
   * with a `description`, the state's title.
   */
  label?: string
  /** How to start: the line under the title. */
  description?: string
  icon?: string
  loading?: boolean
  stroke?: number
  orientation?: Orientation
  size?: Size
}>(), {
  orientation: 'vertical',
  size: 'md',
})

const resolvedIcon = computed(() =>
    props.icon ?? (props.orientation === 'vertical' ? 'i-ph-empty-light' : 'i-ph-empty'),
)

// The empty-state glyph is an illustration, not an inline icon, so it keeps a
// scale of its own rather than following --s-icon-size: horizontal reads as an
// oversized inline icon, vertical as a proper graphic. Both are still built on
// the same 4px step as the icon scale, and `iconSize` overrides either.
const glyphSize: Record<Orientation, Record<Size, string>> = {
  horizontal: {
    xs: '16px',
    sm: '20px',
    md: '24px',
    lg: '28px',
    xl: '32px',
  },
  vertical: {
    xs: '32px',
    sm: '40px',
    md: '48px',
    lg: '56px',
    xl: '64px',
  },
}

// `iconSize`: a token of the Stem scale (that size's icon) or any CSS length.
const resolvedGlyphSize = computed(() => {
  const v = props.iconSize
  if (!v) return glyphSize[props.orientation][props.size]
  return v in stemScale ? `${stemScale[v as Size].icon}px` : v
})

// Text and gap from the scale; the glyph keeps its own (above).
const scaleClasses = computed(() => [`s-size-${props.size}`, ...stemScaleClasses({...props, iconSize: undefined})])
const scaleStyle = computed(() => stemScaleStyle({...props, iconSize: undefined}))

const glyphStyle = computed(() => ({
  width: resolvedGlyphSize.value,
  height: resolvedGlyphSize.value,
}))

// The description sits one step below the title.
const descriptionSize: Record<Size, string> = {
  xs: `${stemScale.xs.text}px`,
  sm: `${stemScale.xs.text}px`,
  md: `${stemScale.sm.text}px`,
  lg: `${stemScale.md.text}px`,
  xl: `${stemScale.lg.text}px`,
}
</script>

<template>
  <div
      class="s-empty gap-(--s-gap) select-none"
      :style="scaleStyle"
      :class="[
      scaleClasses,
      orientation === 'vertical'
        ? 'flex flex-col items-center text-center'
        : 'flex items-center',
    ]"
  >
    <SSpinner v-if="loading" :size="resolvedGlyphSize" :stroke="stroke ?? (orientation === 'vertical' ? 1.5 : undefined)" class="text-(--ui-text-muted) shrink-0"/>
    <UIcon v-else :name="resolvedIcon" :style="glyphStyle"
           class="text-(--ui-text-muted) shrink-0"/>
    <div v-if="description || $slots.description" class="flex flex-col gap-1"
         :class="orientation === 'vertical' ? 'items-center max-w-sm' : ''">
      <div v-if="label || $slots.default" class="text-(length:--s-text) font-medium text-(--ui-text)">
        <slot>{{ label }}</slot>
      </div>
      <div :style="{fontSize: descriptionSize[size]}" class="text-(--ui-text-muted) text-pretty">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
    <div v-else-if="label || $slots.default" class="text-(length:--s-text) text-(--ui-text-muted)">
      <slot>{{ label }}</slot>
    </div>
    <slot name="after"/>
  </div>
</template>
