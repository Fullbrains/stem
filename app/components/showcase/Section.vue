<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="space-y-3">
    <div>
      <h2 class="text-[15px] font-semibold text-gray-900">{{ title }}</h2>
      <p v-if="description" class="mt-0.5 max-w-2xl text-[13px] text-gray-500">{{ description }}</p>
    </div>
    <slot/>
  </section>
</template>
