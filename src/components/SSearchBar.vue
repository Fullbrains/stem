<script setup lang="ts">
import {ref, computed, watch, nextTick, onMounted, onUnmounted, provide, useSlots, defineComponent} from 'vue'
import {useAppConfig} from '#imports'
import {SEARCH_BAR_COMPACT, SEARCH_BAR_PANEL} from '../composables/searchBarContext'
import {stemScaleClasses, stemScaleStyle, type StemScaleProps, type StemSize, stemScaleDefaults} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

const modelValue = defineModel<string>({default: ''})

/**
 * The search bar on the Stem scale: at a given `size` the bar is as tall as
 * an SButton of that size, with its text, icon, padding, gap and radius. It
 * is a pill by default (`rounded`, pass `:rounded="false"` for a squircle).
 * `compact` is the sm size, kept for the chips that tighten inside it.
 */
const props = withDefaults(defineProps<StemScaleProps & {
  size?: StemSize
  placeholder?: string
  minInputWidth?: number
  variant?: 'outline' | 'soft' | 'subtle' | 'ghost'
  activeFilterCount?: number
  /** Accessible name of the funnel button that opens the extra filters. */
  filtersLabel?: string
  compact?: boolean
  icon?: string
  /** Nasconde il pulsante che svuota il campo. Utile dove la ricerca ha già
   un proprio modo di chiudersi, e due comandi di annullamento vicini
   confonderebbero. */
  hideClear?: boolean
}>(), {
  ...stemScaleDefaults,
  minInputWidth: 280,
  variant: 'outline',
  activeFilterCount: 0,
  filtersLabel: 'Filters',
  compact: false,
  hideClear: false,
  size: undefined,
})

// Scale props inherited from a parent when not given; a pill by default, md
// (sm when compact).
const scale = useStemScale(props, {rounded: true})
const resolvedSize = computed<StemSize>(() => scale.value.size ?? (props.compact ? 'sm' : 'md'))
const scaleClasses = computed(() => [`s-size-${resolvedSize.value}`, ...stemScaleClasses(scale.value)])
const scaleStyle = computed(() => stemScaleStyle(scale.value))

const appConfig = useAppConfig()

// The default icon is the `ui.icons.search` token (Nuxt UI convention, seeded
// by stemIcons), so an app can rebrand every searchbar from its app.config;
// the prop stays as a per-instance override.
const searchIcon = computed(() => props.icon ?? appConfig.ui?.icons?.search ?? 'i-ph-magnifying-glass')

// Chips tighten in a small bar (sm and below), where a full chip would fill it.
provide(SEARCH_BAR_COMPACT, computed(() => resolvedSize.value === 'sm' || resolvedSize.value === 'xs'))

const PanelScope = defineComponent({
  setup(_, {slots}) {
    provide(SEARCH_BAR_PANEL, true)
    return () => slots.default?.()
  },
})

const slots = useSlots()
const hasFilters = computed(() => !!slots.filters)
const hasMore = computed(() => !!slots.more)

const collapsed = ref(false)
const mobileExpanded = ref(false)
const rowEl = ref<HTMLElement>()
const inputWrapperEl = ref<HTMLElement>()
const filtersEl = ref<HTMLElement>()
const mobileFiltersEl = ref<HTMLElement>()
const inputFocus = ref(false)

// Bordered variants use an INSET RING, not a border, and so does the focus:
// neither adds a pixel to the bar. Radius from the scale (s-corner, pill by
// default).
const variantClasses = computed(() => {
  const base = 's-corner transition duration-200'
  const focused = inputFocus.value
  switch (props.variant) {
    case 'soft':
      return [
        `${base} bg-iron-500/10`,
        focused ? 'bg-iron-500/15!' : 'hover:bg-iron-500/15',
      ]
    case 'subtle':
      return [
        `${base} ring ring-inset ring-iron-500/30 bg-iron-500/5`,
        focused
            ? 'ring-iron-500/80! shadow-[0_0_0_3.5px] shadow-iron-500/20'
            : 'hover:ring-iron-500/50 hover:bg-iron-500/10',
      ]
    case 'ghost':
      return [
        `${base} bg-transparent`,
        focused ? 'bg-iron-500/10!' : 'hover:bg-iron-500/10',
      ]
    case 'outline':
    default:
      return [
        `${base} ring ring-inset ring-iron-500/30`,
        focused
            ? 'ring-iron-500/80! shadow-[0_0_0_3.5px] shadow-iron-500/20'
            : 'hover:ring-iron-500/50',
      ]
  }
})

let lastFiltersWidth = 0
let observer: ResizeObserver | null = null

function getFixedWidth() {
  const row = rowEl.value
  if (!row) return 0
  let fixed = 0
  const style = getComputedStyle(row)
  fixed += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
  const gap = parseFloat(style.gap) || 0
  let visibleCount = 1 // always count inputWrapper
  for (const child of row.children) {
    const el = child as HTMLElement
    if (el === inputWrapperEl.value || el === filtersEl.value) continue
    if (el.offsetWidth > 0) {
      fixed += el.offsetWidth
      visibleCount++
    }
  }
  // Add filters as a visible item (for gap calculation)
  visibleCount++
  if (visibleCount > 1) fixed += gap * (visibleCount - 1)
  return fixed
}

function onRowResize() {
  const w = rowEl.value?.offsetWidth ?? 0
  if (w === 0 || !hasFilters.value) return

  if (!collapsed.value) {
    if (filtersEl.value) lastFiltersWidth = filtersEl.value.offsetWidth
    const inputSpace = w - lastFiltersWidth - getFixedWidth()
    if (inputSpace < props.minInputWidth && lastFiltersWidth > 0) {
      collapsed.value = true
    }
  } else {
    // Use lastFiltersWidth (measured before collapse) to estimate if there's room
    const inputSpace = w - lastFiltersWidth - getFixedWidth()
    if (inputSpace >= props.minInputWidth) {
      collapsed.value = false
    }
  }
}

onMounted(() => {
  if (rowEl.value) {
    observer = new ResizeObserver(onRowResize)
    observer.observe(rowEl.value)
  }
})

onUnmounted(() => {
  observer?.disconnect()
})

watch(collapsed, async (val) => {
  if (!val) {
    mobileExpanded.value = false
    await nextTick()
    if (filtersEl.value) lastFiltersWidth = filtersEl.value.offsetWidth
  }
})

const showFunnel = computed(() => collapsed.value || hasMore.value)

const mobileHeight = ref(0)

watch(mobileExpanded, async (val) => {
  if (val) {
    await nextTick()
    mobileHeight.value = mobileFiltersEl.value?.scrollHeight ?? 0
  } else {
    mobileHeight.value = 0
  }
})

function clear() {
  modelValue.value = ''
}
</script>

<template>
  <div
      class="flex flex-col relative"
      :class="[...scaleClasses, ...variantClasses]"
      :style="scaleStyle"
  >
    <!-- Left padding lives on the input wrapper only (the row keeps just the
         right inset for chips and the funnel button), so the border→icon
         distance is a single readable value: the scale's padding-x. -->
    <div
        ref="rowEl"
        class="flex items-center gap-1 h-[calc(var(--s-icon-size)+2*var(--s-py))] pr-(--s-gap)"
    >
      <div
          ref="inputWrapperEl"
          class="flex items-center pr-1 flex-1 min-w-0 ps-(--s-px) gap-(--s-gap)"
      >
        <UIcon
            :name="searchIcon"
            class="size-(--s-icon-size) text-iron-500/80 shrink-0"
        />
        <input
            v-model="modelValue"
            type="text"
            :placeholder="placeholder ?? 'Search...'"
            class="bg-transparent border-none outline-none placeholder:text-iron-500/80 flex-1 min-w-0 text-(length:--s-text) leading-(--s-icon-size)"
            @focus="inputFocus = true"
            @blur="inputFocus = false"
        >

        <SButton
            v-if="modelValue?.length && !hideClear"
            color="neutral"
            variant="link"
            aria-label="Clear search"
            class="shrink-0 min-h-0 p-1!"
            @click="clear"
        >
          <template #leading>
            <UIcon
                name="i-ph-backspace-fill"
                class="size-5 shrink-0"
            />
          </template>
        </SButton>
      </div>

      <div
          v-if="hasFilters && !collapsed"
          ref="filtersEl"
          class="flex items-center gap-1 shrink-0"
      >
        <slot name="filters"/>
      </div>

      <div
          v-if="$slots.trailing"
          class="flex items-center gap-1 shrink-0"
      >
        <slot name="trailing"/>
      </div>

      <!-- The count rides on a chip, not in the label: a label widens the
           button every time a filter is toggled and shoves the row sideways. -->
      <UChip
          v-if="showFunnel"
          :text="activeFilterCount"
          :show="activeFilterCount > 0"
          size="3xl"
          :ui="{base: 'px-1 tabular-nums ring-0'}"
      >
        <SButton
            icon="i-ph-funnel-simple"
            :aria-label="filtersLabel"
            :variant="mobileExpanded ? 'solid' : 'soft'"
            size="sm"
            rounded
            class="select-none"
            @click="mobileExpanded = !mobileExpanded"
        />
      </UChip>
    </div>

    <div
        v-if="showFunnel"
        ref="mobileFiltersEl"
        class="overflow-hidden transition-[height] duration-200 ease-in-out"
        :style="{height: `${mobileHeight}px`}"
    >
      <div class="flex flex-wrap gap-1 pt-2 pb-2 border-t pl-0.5 border-(--ui-border) mx-1.5">
        <PanelScope>
          <slot v-if="collapsed" name="filters"/>
          <slot name="more"/>
        </PanelScope>
      </div>
    </div>
  </div>
</template>
