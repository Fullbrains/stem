<script setup lang="ts">
withDefaults(defineProps<{
  size?: string
  stroke?: number
  grow?: boolean
}>(), {
  size: '1em',
  stroke: 2,
  grow: false,
})
</script>

<template>
  <span v-if="grow"
        class="inline-flex overflow-hidden animate-[s-spinner-grow-in_500ms_ease-out_both]">
    <svg
        class="animate-[s-spinner-rotate_1.4s_linear_infinite]"
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        fill="none"
    >
      <circle class="animate-[s-spinner-dash_1.4s_linear_infinite]" cx="12" cy="12" r="10" stroke="currentColor"
              :stroke-width="stroke" stroke-linecap="round" pathLength="100"/>
    </svg>
  </span>
  <svg
      v-else
      class="animate-[s-spinner-rotate_1.4s_linear_infinite]"
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
  >
    <circle class="animate-[s-spinner-dash_1.4s_linear_infinite]" cx="12" cy="12" r="10" stroke="currentColor"
            :stroke-width="stroke" stroke-linecap="round" pathLength="100"/>
  </svg>
</template>
