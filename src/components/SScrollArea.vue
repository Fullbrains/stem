<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, watch, nextTick, useAttrs} from 'vue'

const props = withDefaults(defineProps<{
  fade?: boolean
  fadeSize?: string
  fadeColor?: string
  /**
   * How the edges fade. `color` (default) paints a gradient of the surface's
   * colour over the content: it needs a surface of one colour. `mask` fades
   * the content itself to transparent (s-scroll-mask): whatever is behind
   * shows through, a gradient, an image, a translucent surface.
   */
  fadeMode?: 'color' | 'mask'
}>(), {
  fade: true,
  fadeSize: '1.5rem',
  fadeMode: 'color',
})

const attrs = useAttrs()

const scrollRef = ref<InstanceType<typeof import('#components').UScrollArea> | null>(null)

const scrollTop = ref(0)
const scrollHeight = ref(0)
const clientHeight = ref(0)
const paddingTop = ref(0)
const paddingBottom = ref(0)
const resolvedBgColor = ref('')
const scrollbarWidth = ref(0)

const hasOverflow = computed(() => scrollHeight.value > clientHeight.value)
const showTop = computed(() => hasOverflow.value && scrollTop.value > 1)
const showBottom = computed(() => hasOverflow.value && scrollTop.value < scrollHeight.value - clientHeight.value - 1)

const fadeColorValue = computed(() => props.fadeColor ?? (resolvedBgColor.value || 'var(--ui-bg)'))

const masked = computed(() => props.fade && props.fadeMode === 'mask')
const painted = computed(() => props.fade && props.fadeMode === 'color')

/** The mask's edges, and the scrollbar it leaves out: a classic scrollbar
    measured, an overlay one (0 wide in layout, drawn over the content)
    given room of its own. */
const maskStyle = computed(() => masked.value
  ? {
      '--s-mask-top': showTop.value ? props.fadeSize : '0px',
      '--s-mask-bottom': showBottom.value ? props.fadeSize : '0px',
      '--s-mask-gutter': scrollbarWidth.value ? `${scrollbarWidth.value}px` : undefined,
    }
  : {})

function getScrollElement(): HTMLElement | null {
  if (!scrollRef.value?.$el) return null
  return scrollRef.value.$el as HTMLElement
}

function isTransparent(color: string): boolean {
  return !color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)'
}

function resolveBackgroundColor(el: HTMLElement): string {
  let current: HTMLElement | null = el
  while (current) {
    const bg = window.getComputedStyle(current).backgroundColor
    if (!isTransparent(bg)) return bg
    current = current.parentElement
  }
  return ''
}

function updateScrollState() {
  const el = getScrollElement()
  if (!el) return
  scrollTop.value = el.scrollTop
  scrollHeight.value = el.scrollHeight
  clientHeight.value = el.clientHeight
  const styles = window.getComputedStyle(el)
  paddingTop.value = parseFloat(styles.paddingTop) || 0
  paddingBottom.value = parseFloat(styles.paddingBottom) || 0
  scrollbarWidth.value = el.offsetWidth - el.clientWidth - (parseFloat(styles.borderLeftWidth) || 0) - (parseFloat(styles.borderRightWidth) || 0)

  if (!props.fadeColor) {
    resolvedBgColor.value = resolveBackgroundColor(el)
  }
}

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const el = getScrollElement()
  if (!el) return

  el.addEventListener('scroll', updateScrollState, {passive: true})

  resizeObserver = new ResizeObserver(() => updateScrollState())
  resizeObserver.observe(el)
  for (const child of el.children) {
    resizeObserver.observe(child)
  }

  updateScrollState()
})

onUnmounted(() => {
  const el = getScrollElement()
  if (el) el.removeEventListener('scroll', updateScrollState)
  resizeObserver?.disconnect()
})

watch(() => scrollRef.value, async () => {
  await nextTick()
  updateScrollState()
})
</script>

<template>
  <UScrollArea
      ref="scrollRef"
      v-bind="attrs"
      :class="masked && 's-scroll-mask'"
      :style="{
        '--s-fade-size': fadeSize,
        '--s-fade-color': fadeColorValue,
        ...maskStyle,
      }"
  >
    <template v-if="painted">
      <div
          class="s-scroll-fade sticky inset-x-0 top-0 z-1 shrink-0 pointer-events-none opacity-0 transition-opacity duration-300"
          :class="showTop && 'opacity-100'"
          :style="{
            transform: `translateY(${-paddingTop}px)`,
            marginBottom: `calc(-1 * var(--s-fade-size) - ${paddingTop}px)`,
          }"
      />
    </template>
    <slot/>
    <template v-if="painted">
      <div
          class="s-scroll-fade s-scroll-fade--bottom sticky inset-x-0 bottom-0 z-1 shrink-0 pointer-events-none opacity-0 transition-opacity duration-300"
          :class="showBottom && 'opacity-100'"
          :style="{
            transform: `translateY(${paddingBottom}px)`,
            marginTop: `calc(-1 * var(--s-fade-size) - ${paddingBottom}px)`,
          }"
      />
    </template>
  </UScrollArea>
</template>
