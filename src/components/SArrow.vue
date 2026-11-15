<script setup lang="ts">
import {useAttrs, useId} from 'vue'
import {STEM_ARROW_SHAPE} from '../arrow-shape'

/**
 * Stem's arrow (arrow-shape.ts) as the arrow of a Nuxt UI popover, tooltip
 * or menu, through their `arrow` prop (`stemArrow`): Reka renders it in
 * place of its own SVG and keeps placing and rotating it; the `fill-*` /
 * `stroke-*` classes of the theme's `arrow` slot land on this SVG.
 *
 * Reka's arrow points DOWN: the shape, drawn pointing up, is flipped. The
 * outline is 1px outside — a 2px line under the fill — clipped above the
 * band of the surface's own ring, which the fill covers: every pixel of the
 * outline is drawn once.
 */
defineOptions({inheritAttrs: false})

const attrs = useAttrs()
const clipId = useId()
const shape = STEM_ARROW_SHAPE
</script>

<template>
  <svg
      :class="attrs.class"
      :width="attrs.width as number"
      :height="attrs.height as number"
      :data-slot="attrs['data-slot'] as string"
      :viewBox="`0 0 ${shape.width} ${shape.height}`"
      preserveAspectRatio="none"
      class="block overflow-visible"
      aria-hidden="true"
  >
    <g :transform="`matrix(1 0 0 -1 0 ${shape.height})`">
      <clipPath :id="clipId">
        <rect x="-2" y="-2" :width="shape.width + 4" :height="shape.height + 1"/>
      </clipPath>
      <path :d="shape.edge" fill="none" stroke-width="2" :clip-path="`url(#${clipId})`"/>
      <path :d="shape.fill" stroke="none"/>
    </g>
  </svg>
</template>
