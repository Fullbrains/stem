<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
}>()

const model = defineModel<boolean>({default: false})
</script>

<template>
  <button
      type="button"
      class="flex items-center gap-1.5 rounded-md px-2 py-1 text-[12px] transition-colors"
      :class="model ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'"
      :aria-pressed="model"
      @click="model = !model"
  >
    <UIcon v-if="icon" :name="icon" class="size-3.5"/>
    {{ label }}
  </button>
</template>
