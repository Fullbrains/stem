<script setup lang="ts">
import {computed} from 'vue'
import {resolveIconSize} from '../theme/icon-sizes'

type Orientation = 'vertical' | 'horizontal'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(defineProps<{
  label?: string
  icon?: string
  loading?: boolean
  stroke?: number
  orientation?: Orientation
  size?: Size
  iconSize?: string
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

const resolvedGlyphSize = computed(() =>
    resolveIconSize(props.iconSize) ?? glyphSize[props.orientation][props.size],
)

const glyphStyle = computed(() => ({
  width: resolvedGlyphSize.value,
  height: resolvedGlyphSize.value,
}))

const textSize: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}
</script>

<template>
  <div
      class="s-empty gap-3 select-none"
      :class="[
      orientation === 'vertical'
        ? 'flex flex-col items-center text-center'
        : 'flex items-center',
    ]"
  >
    <SSpinner v-if="loading" :size="resolvedGlyphSize" :stroke="stroke ?? (orientation === 'vertical' ? 1.5 : undefined)" class="text-(--ui-text-muted) shrink-0"/>
    <UIcon v-else :name="resolvedIcon" :style="glyphStyle"
           class="text-(--ui-text-muted) shrink-0"/>
    <div v-if="label || $slots.default" :class="size && textSize[size]" class="text-(--ui-text-muted)">
      <slot>{{ label }}</slot>
    </div>
    <slot name="after"/>
  </div>
</template>
