<script setup lang="ts">
/**
 * Superficie di anteprima: rende lo slot una volta per ogni tema attivo
 * (chiaro, scuro o entrambi), ciascuno su uno sfondo vero dell'app.
 */
const props = withDefaults(defineProps<{
  /** row = temi affiancati, col = uno sopra l'altro. */
  direction?: 'row' | 'col'
  /** Classi del contenitore interno di ogni pannello. */
  bodyClass?: string
}>(), {
  direction: 'col',
  bodyClass: 'flex flex-wrap items-center justify-center gap-4 p-8',
})

const {activeModes, checker} = useShowcase()

const gridClass = computed(() =>
  props.direction === 'row' && activeModes.value.length > 1 ? 'grid grid-cols-2' : 'grid grid-cols-1',
)
</script>

<template>
  <div class="overflow-hidden rounded-xl ring-1 ring-gray-200" :class="gridClass">
    <div
        v-for="mode in activeModes"
        :key="mode"
        class="relative bg-(--ui-bg) text-(--ui-text)"
        :class="[mode, checker && 'checkerboard']"
    >
      <span
          v-if="activeModes.length > 1"
          class="pointer-events-none absolute top-2 left-3 text-[10px] font-medium text-(--ui-text-dimmed)"
      >{{ mode === 'light' ? 'Chiaro' : 'Scuro' }}</span>
      <div :class="bodyClass">
        <slot :mode="mode"/>
      </div>
    </div>
  </div>
</template>
