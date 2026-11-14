<script setup lang="ts">
/**
 * Una fila di elementi in progressione (di solito le size), allineati sulla
 * base e con le misure sempre scritte sotto. Lo slot `item` riceve `{item, mode}`.
 */
defineProps<{
  items: string[]
}>()
</script>

<template>
  <ShowcaseStage body-class="flex flex-wrap items-end justify-center gap-x-8 gap-y-6 p-8 pt-10">
    <template #default="{mode}">
      <div v-for="item in items" :key="item" class="flex flex-col items-center gap-2">
        <ShowcaseMeasure labels>
          <slot name="item" :item="item" :mode="mode"/>
        </ShowcaseMeasure>
        <span class="font-mono text-[11px] font-medium text-(--ui-text-muted)">{{ item }}</span>
      </div>
    </template>
  </ShowcaseStage>
</template>
