<script setup lang="ts">
/**
 * Misura l'elemento che contiene (il primo figlio) e, con "Misure" attivo,
 * disegna sopra il padding e i box degli elementi interni (icone in azzurro,
 * testo in ambra, gap in viola) e scrive sotto altezza, larghezza, padding e testo in px. Con `labels` le scritte restano sempre visibili (le scale le usano).
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

type Box = {x: number, y: number, w: number, h: number, kind: 'icon' | 'text' | 'gap'}
const boxes = ref<Box[]>([])

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
  boxes.value = innerBoxes(el, wr)
}

/**
 * I box di ciò che sta dentro: icone, testo (il box dell'elemento che lo
 * contiene, cioè con la sua line-height) e l'area del testo di input e
 * textarea (il content box, senza padding né bordo).
 */
function innerBoxes(el: HTMLElement, wr: DOMRect): Box[] {
  const out: Box[] = []
  const add = (r: DOMRect, kind: Box['kind']) => {
    if (r.width < 0.5 || r.height < 0.5) return
    out.push({x: r.left - wr.left, y: r.top - wr.top, w: r.width, h: r.height, kind})
  }
  const visible = (e: Element) => {
    const c = getComputedStyle(e)
    return c.display !== 'none' && c.visibility !== 'hidden' && parseFloat(c.opacity) > 0.05
  }
  const icons = [...el.querySelectorAll('.iconify, svg')].filter(i => !i.parentElement?.closest('svg, .iconify'))
  for (const i of icons) if (visible(i)) add(i.getBoundingClientRect(), 'icon')

  for (const f of el.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input:not([type=checkbox]):not([type=radio]):not([type=hidden]), textarea')) {
    if (!visible(f)) continue
    const c = getComputedStyle(f)
    const r = f.getBoundingClientRect()
    const l = parseFloat(c.paddingLeft) + parseFloat(c.borderLeftWidth)
    const t = parseFloat(c.paddingTop) + parseFloat(c.borderTopWidth)
    const w = r.width - l - parseFloat(c.paddingRight) - parseFloat(c.borderRightWidth)
    const h = r.height - t - parseFloat(c.paddingBottom) - parseFloat(c.borderBottomWidth)
    add(new DOMRect(r.left + l, r.top + t, w, h), 'text')
  }

  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const seen = new Set<Element>()
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue
    const parent = n.parentElement
    if (!parent || parent.closest('svg, .iconify') || !visible(parent)) continue
    // Testo da solo nel suo elemento: il box dell'elemento. Mescolato ad
    // altro (icone, altri elementi): il box del solo testo.
    const alone = [...parent.childNodes].every(c => c === n || (c.nodeType === Node.TEXT_NODE && !c.textContent?.trim()) || c.nodeType === Node.COMMENT_NODE)
    if (alone && parent !== el) {
      if (seen.has(parent)) continue
      seen.add(parent)
      add(parent.getBoundingClientRect(), 'text')
    } else {
      const range = document.createRange()
      range.selectNodeContents(n)
      add(range.getBoundingClientRect(), 'text')
    }
  }
  return [...out, ...gaps(out)]
}

/**
 * I gap: lo spazio fra due box interni vicini sulla stessa riga, alto quanto
 * la parte in cui si sovrappongono.
 */
function gaps(list: Box[]): Box[] {
  const sorted = [...list].sort((a, b) => a.x - b.x)
  const out: Box[] = []
  for (const [i, a] of sorted.entries()) {
    const right = a.x + a.w
    // Il primo box che inizia dopo a, sulla stessa riga.
    const b = sorted.slice(i + 1).find(c => c.x >= right - 0.5 && c.y < a.y + a.h && a.y < c.y + c.h)
    if (!b || b.x - right < 0.5) continue
    // Se in mezzo c'è un altro box, non è un gap fra questi due.
    if (sorted.some(c => c !== a && c !== b && c.x >= right - 0.5 && c.x + c.w <= b.x + 0.5 && c.y < a.y + a.h && a.y < c.y + c.h)) continue
    const top = Math.max(a.y, b.y)
    const bottom = Math.min(a.y + a.h, b.y + b.h)
    out.push({x: right, y: top, w: b.x - right, h: bottom - top, kind: 'gap'})
  }
  return out
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
      <div
          v-for="(b, i) in boxes"
          :key="i"
          class="pointer-events-none absolute"
          :class="{
            icon: 'bg-sky-400/40',
            text: 'bg-amber-300/40',
            gap: 'bg-violet-500/35',
          }[b.kind]"
          :style="{left: `${b.x}px`, top: `${b.y}px`, width: `${b.w}px`, height: `${b.h}px`}"
      />
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
