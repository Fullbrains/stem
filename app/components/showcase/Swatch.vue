<script setup lang="ts">
/**
 * Un campione di colore che legge il valore risolto nel suo tema (le palette
 * di Stem cambiano sotto `.dark`) e scrive hex e contrasto con lo sfondo del
 * pannello: Aa nero su chiaro / bianco su scuro, con il rapporto WCAG.
 */
const props = defineProps<{
  /** Un valore CSS: `var(--color-stem-500)`, `var(--ui-primary)`, un hex… */
  color: string
  label?: string
  /** Mostra anche il nome della variabile sotto. */
  name?: string
}>()

const el = ref<HTMLElement>()
const info = ref<{hex: string, ratio: number} | null>(null)

function read() {
  if (!el.value) return
  const rgb = toRgb(getComputedStyle(el.value).backgroundColor)
  const bg = toRgb(backgroundOf(el.value.parentElement))
  if (!rgb || !bg) return
  info.value = {hex: toHex(rgb), ratio: contrast(rgb, bg)}
}

onMounted(() => requestAnimationFrame(read))
watch(() => props.color, () => nextTick(read))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-1">
    <div
        ref="el"
        class="h-12 rounded-md ring-1 ring-black/5 ring-inset dark:ring-white/10"
        :style="{background: color}"
    />
    <div class="font-mono text-[10px] leading-tight text-(--ui-text-muted)">
      <div v-if="label" class="text-(--ui-text)">{{ label }}</div>
      <div v-if="info">{{ info.hex }}</div>
      <div
          v-if="info"
          :class="info.ratio >= 4.5 ? 'text-(--ui-text)' : info.ratio >= 3 ? '' : 'text-(--ui-text-dimmed)'"
          :title="'Contrasto con lo sfondo del pannello'"
      >
        {{ info.ratio.toFixed(1) }}{{ info.ratio >= 4.5 ? ' AA' : info.ratio >= 3 ? ' AA L' : '' }}
      </div>
      <div v-if="name" class="truncate text-(--ui-text-dimmed)">{{ name }}</div>
    </div>
  </div>
</template>
