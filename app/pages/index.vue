<script setup lang="ts">
useHead({title: 'Stem'})
</script>

<template>
  <div class="space-y-10">
    <header>
      <h1 class="text-2xl font-semibold tracking-tight text-gray-900">Stem</h1>
      <p class="mt-1 text-[14px] text-gray-500">Il design system di Fullbrains su Nuxt UI. Una pagina per componente, con chiaro e scuro affiancati.</p>
    </header>
    <div class="grid grid-cols-3 gap-4">
      <div v-for="group in showcaseNav" :key="group.label" class="rounded-xl p-4 ring-1 ring-gray-200">
        <p class="mb-2 text-[11px] font-medium text-gray-400">{{ group.label }}</p>
        <ul class="space-y-0.5">
          <li v-for="item in group.items" :key="item.to">
            <span v-if="item.soon" class="text-[13px] text-gray-300">{{ item.label }}</span>
            <NuxtLink v-else :to="item.to" class="text-[13px] text-gray-700 hover:text-gray-900 hover:underline">{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
