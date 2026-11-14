<script setup lang="ts">
/**
 * Misura l'elemento che contiene (il primo figlio) e, con "Misure" attivo,
 * disegna sopra il padding e scrive sotto altezza, larghezza, padding e testo
 * in px. Con `labels` le scritte restano sempre visibili (le scale le usano).
 */
const props = defineProps<{
  labels?: boolean
}>()

const {measure} = useShowcase()

const root = ref<HTMLElement>()
const slotEl = ref<HTMLElement>()
const m = ref<null | {
  x: number, y: number, w: number, h: number
  pt: number, pr: number, pb: number, pl: number
  fs: number, icon: number | null
}>(null)

const r1 = (n: number) => Math.round(n * 10) / 10

function read() {
  const wrap = root.value
  const el = slotEl.value?.firstElementChild as HTMLElement | null
  if (!wrap || !el) return
  const wr = wrap.getBoundingClientRect()
  const er = el.getBoundingClientRect()
  // Negli input il padding sta sul campo interno, non sul contenitore:
  // se il primo figlio non ne ha, lo si legge dal primo discendente che ne ha.
  const padded = (e: Element) => {
    const c = getComputedStyle(e)
    return parseFloat(c.paddingTop) + parseFloat(c.paddingLeft) > 0
  }
  const inner = padded(el)
    ? el
    : [...el.querySelectorAll('input, textarea, button, [data-slot="base"], *')].find(padded) ?? el
  const cs = getComputedStyle(inner)
  const icon = el.querySelector('.iconify, svg')
  m.value = {
    x: er.left - wr.left,
    y: er.top - wr.top,
    w: er.width,
    h: er.height,
    pt: parseFloat(cs.paddingTop),
    pr: parseFloat(cs.paddingRight),
    pb: parseFloat(cs.paddingBottom),
    pl: parseFloat(cs.paddingLeft),
    fs: parseFloat(cs.fontSize),
    icon: icon ? icon.getBoundingClientRect().height : null,
  }
}

const showLabels = computed(() => props.labels || measure.value)

let ro: ResizeObserver | undefined
let mo: MutationObserver | undefined
onMounted(() => {
  read()
  ro = new ResizeObserver(read)
  mo = new MutationObserver(() => requestAnimationFrame(read))
  // Solo lo slot: osservare anche gli overlay farebbe un ciclo infinito.
  if (slotEl.value) {
    ro.observe(slotEl.value)
    mo.observe(slotEl.value, {subtree: true, attributes: true, childList: true})
  }
})
onBeforeUnmount(() => {
  ro?.disconnect()
  mo?.disconnect()
})
watch(measure, () => nextTick(read))
</script>

<template>
  <div ref="root" class="relative inline-flex flex-col items-center gap-1.5">
    <div ref="slotEl" class="inline-flex">
      <slot/>
    </div>
    <template v-if="measure && m">
      <div
          class="pointer-events-none absolute outline outline-1 outline-dashed outline-pink-500/70"
          :style="{left: `${m.x}px`, top: `${m.y}px`, width: `${m.w}px`, height: `${m.h}px`}"
      >
        <div class="absolute inset-x-0 top-0 bg-emerald-400/30" :style="{height: `${m.pt}px`}"/>
        <div class="absolute inset-x-0 bottom-0 bg-emerald-400/30" :style="{height: `${m.pb}px`}"/>
        <div class="absolute left-0 bg-emerald-400/30" :style="{top: `${m.pt}px`, bottom: `${m.pb}px`, width: `${m.pl}px`}"/>
        <div class="absolute right-0 bg-emerald-400/30" :style="{top: `${m.pt}px`, bottom: `${m.pb}px`, width: `${m.pr}px`}"/>
      </div>
    </template>
    <div
        v-if="showLabels && m"
        class="font-mono text-[10px] leading-tight whitespace-nowrap text-(--ui-text-dimmed) text-center tabular-nums"
    >
      <div><span class="text-(--ui-text-muted)">{{ r1(m.h) }}</span> × {{ r1(m.w) }}</div>
      <div>p {{ r1(m.pt) }}/{{ r1(m.pl) }} · t {{ r1(m.fs) }}<template v-if="m.icon"> · i {{ r1(m.icon) }}</template></div>
    </div>
  </div>
</template>
