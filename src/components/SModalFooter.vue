<script setup lang="ts">
import {computed} from 'vue'
import {stemSpacePx} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

withDefaults(defineProps<{
  separator?: boolean
}>(), {
  separator: true,
})

// The padding, all around, as the header's: two steps of space above the
// modal's size (md: 16px).
const scale = useStemScale({}, {space: '+2'})
const paddingStyle = computed(() => ({padding: `${stemSpacePx(scale.value.space!)}px`}))
</script>

<template>
  <footer
    class="s-modal-footer ring-inset text-2xl w-full flex shrink-0 flex-wrap items-center relative select-none"
    :style="paddingStyle"
    :class="{ 'border-t border-(--ui-border)': separator }"
  >
    <slot />
  </footer>
</template>

<style>
.s-modal-footer {
  & > button {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0;
    margin-bottom: 0.5rem;

    @media (min-width: 640px) {
      height: auto;
      width: auto;
      margin-right: 0.5rem;
      margin-bottom: 0;
      padding-left: 1.5em;
      padding-right: 1.5em;
    }

    &:last-child {
      margin-right: 0 !important;
      margin-bottom: 0 !important;
    }
  }
}
</style>
