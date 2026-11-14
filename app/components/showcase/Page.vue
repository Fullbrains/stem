<script setup lang="ts">
const props = defineProps<{
  title: string
  description?: string
  /** Il componente Nuxt UI che c'è sotto, se Stem ne avvolge uno. */
  wraps?: string
}>()

useHead({title: () => `${props.title} · Stem`})
</script>

<template>
  <div class="space-y-12">
    <header>
      <div class="flex items-baseline gap-3">
        <h1 class="text-2xl font-semibold tracking-tight text-gray-900">{{ title }}</h1>
        <span v-if="wraps" class="font-mono text-[11px] text-gray-400">avvolge {{ wraps }}</span>
      </div>
      <p v-if="description" class="mt-1 max-w-2xl text-[14px] text-gray-500">{{ description }}</p>
    </header>
    <slot/>
  </div>
</template>
