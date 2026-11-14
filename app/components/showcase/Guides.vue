<script setup lang="ts">
/**
 * Linee guida verticali sopra un confronto: una linea rossa trasparente a
 * ogni bordo dei controlli che contiene (button, badge…) e dei loro pezzi
 * (icone, label), così controlli impilati uno sotto l'altro mostrano subito
 * dove i bordi e il contenuto combaciano e dove no. Solo con "Misure" attivo.
 */
const {measure} = useShowcase()
const root = ref<HTMLElement>()
const lines = ref<number[]>([])

const parts = '[data-slot=base], [data-slot=leadingIcon], [data-slot=trailingIcon], [data-slot=label], .iconify'

function read() {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const xs: number[] = []
  for (const p of el.querySelectorAll(parts)) {
    const b = p.getBoundingClientRect()
    if (b.width < 0.5) continue
    xs.push(b.left - r.left, b.right - r.left)
  }
  // Una linea sola per bordi a meno di mezzo pixel l'uno dall'altro.
  const sorted = xs.sort((a, b) => a - b)
  lines.value = sorted.filter((x, i) => i === 0 || x - sorted[i - 1]! > 0.5)
}

let ro: ResizeObserver | undefined
onMounted(() => {
  nextTick(read)
  ro = new ResizeObserver(read)
  if (root.value) ro.observe(root.value)
  document.fonts?.ready.then(read)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div ref="root" class="relative">
    <slot/>
    <template v-if="measure">
      <div
          v-for="(x, i) in lines"
          :key="i"
          class="pointer-events-none absolute inset-y-0 w-px bg-red-500/40"
          :style="{left: `${x - 0.5}px`}"
      />
    </template>
  </div>
</template>
