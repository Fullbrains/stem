<script setup lang="ts">
import {computed} from 'vue'
import {stemScale} from '../theme/scale'

// Defaults to the ambient icon size so a spinner swapped in for an icon keeps
// the same box, falling back to 1em where --s-icon-size is not set (the
// component is standalone and must also work outside the Stem theme).
// `size` takes a token of the Stem scale (xs…xl: the icon of that size) or
// any CSS length.
const props = withDefaults(defineProps<{
  size?: keyof typeof stemScale | (string & {})
  stroke?: number
  grow?: boolean
}>(), {
  size: 'var(--s-icon-size, 1em)',
  stroke: 1,
  grow: false,
})

// Sized through CSS rather than the width/height attributes, which do not
// accept var().
const resolvedSize = computed(() => props.size in stemScale
  ? `${stemScale[props.size as keyof typeof stemScale].icon}px`
  : props.size)
const sizeStyle = computed(() => ({width: resolvedSize.value, height: resolvedSize.value}))
</script>

<template>
  <span v-if="grow"
        class="inline-flex overflow-hidden animate-[s-spinner-grow-in_500ms_ease-out_both]">
    <svg
        class="animate-[s-spinner-rotate_1.4s_linear_infinite] shrink-0"
        :style="sizeStyle"
        viewBox="0 0 24 24"
        fill="none"
    >
      <circle class="animate-[s-spinner-dash_1.4s_linear_infinite]" cx="12" cy="12" r="10" stroke="currentColor"
              :stroke-width="stroke" stroke-linecap="round" pathLength="100"/>
    </svg>
  </span>
  <svg
      v-else
      class="animate-[s-spinner-rotate_1.4s_linear_infinite] shrink-0"
      :style="sizeStyle"
      viewBox="0 0 24 24"
      fill="none"
  >
    <circle class="animate-[s-spinner-dash_1.4s_linear_infinite]" cx="12" cy="12" r="10" stroke="currentColor"
            :stroke-width="stroke" stroke-linecap="round" pathLength="100"/>
  </svg>
</template>

<style>
@keyframes s-spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes s-spinner-dash {
  0% {
    stroke-dasharray: 1, 100;
    stroke-dashoffset: 0;
  }
  40% {
    stroke-dasharray: 99, 100;
    stroke-dashoffset: -20;
  }
  65% {
    stroke-dasharray: 99, 100;
    stroke-dashoffset: -60;
  }
  100% {
    stroke-dasharray: 1, 100;
    stroke-dashoffset: -100;
  }
}

@keyframes s-spinner-grow-in {
  0% {
    max-width: 0;
    opacity: 0;
  }
  100% {
    max-width: 2em;
    opacity: 1;
  }
}

@keyframes s-spinner-shrink {
  0% {
    max-width: 2em;
    opacity: 1;
  }
  100% {
    max-width: 0;
    opacity: 0;
  }
}
</style>
