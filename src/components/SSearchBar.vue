<script setup lang="ts">
import {ref, computed, watch, nextTick, onMounted, onUnmounted, provide, toRef, useSlots} from 'vue'
import {useAppConfig} from '#imports'
import {SEARCH_BAR_COMPACT} from '../composables/searchBarContext'

const modelValue = defineModel<string>({default: ''})

const props = withDefaults(defineProps<{
  placeholder?: string
  minInputWidth?: number
  variant?: 'outline' | 'soft' | 'subtle' | 'ghost'
  activeFilterCount?: number
  compact?: boolean
  icon?: string
}>(), {
  minInputWidth: 280,
  variant: 'outline',
  activeFilterCount: 0,
  compact: false,
})

const appConfig = useAppConfig()

// The default icon is the `ui.icons.search` token (Nuxt UI convention, seeded
// by stemIcons), so an app can rebrand every searchbar from its app.config;
// the prop stays as a per-instance override.
const searchIcon = computed(() => props.icon ?? appConfig.ui?.icons?.search ?? 'i-ph-magnifying-glass')

provide(SEARCH_BAR_COMPACT, toRef(props, 'compact'))

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

// Bordered variants use an INSET RING, not a border: a border adds 2px to the
// box, making the collapsed bar 42px instead of an exact 40px (h-10).
// The radius is half the bar height (pill shape): 20px on h-10, 16px on h-8.
const variantClasses = computed(() => {
  const base = `${props.compact ? 'rounded-[16px]!' : 'rounded-[20px]!'} transition duration-200`
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
      :class="variantClasses"
  >
    <!-- Left padding lives on the input wrapper only (the row keeps just the
         right inset for chips and the funnel button), so the border→icon
         distance is a single readable value: pl-4, or pl-2 in compact. -->
    <div
        ref="rowEl"
        class="flex items-center gap-1"
        :class="{'h-8 pr-1': compact, 'h-10 pr-1.5': !compact}"
    >
      <div
          ref="inputWrapperEl"
          class="flex items-center pr-1 flex-1 min-w-0"
          :class="{'pl-2 gap-2': compact, 'pl-4 gap-4': !compact}"
      >
        <UIcon
            :name="searchIcon"
            class="size-4 text-iron-500/80 shrink-0"
        />
        <input
            v-model="modelValue"
            type="text"
            :placeholder="placeholder ?? 'Search...'"
            class="bg-transparent border-none outline-none placeholder:text-iron-500/80 flex-1 min-w-0"
            :class="{'text-sm': compact, 'text-base': !compact}"
            @focus="inputFocus = true"
            @blur="inputFocus = false"
        >

        <SButton
            v-if="modelValue?.length"
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

      <SButton
          v-if="showFunnel"
          icon="i-ph-funnel-simple"
          :label="activeFilterCount && activeFilterCount > 0 ? String(activeFilterCount) : undefined"
          :variant="mobileExpanded ? 'solid' : 'soft'"
          size="sm"
          rounded
          compact
          class="select-none"
          :class="{'py-[0.1em]! min-h-[calc(1lh+0.2em)]!': props.compact}"
          @click="mobileExpanded = !mobileExpanded"
      />
    </div>

    <div
        v-if="showFunnel"
        ref="mobileFiltersEl"
        class="overflow-hidden transition-[height] duration-200 ease-in-out"
        :style="{height: `${mobileHeight}px`}"
    >
      <div class="flex flex-wrap gap-1 pt-2 pb-2 border-t pl-0.5 border-(--ui-border) mx-1.5">
        <slot v-if="collapsed" name="filters"/>
        <slot name="more"/>
      </div>
    </div>
  </div>
</template>
