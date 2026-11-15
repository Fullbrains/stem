<script setup lang="ts">
import {computed, inject} from 'vue'
import {SEARCH_BAR_COMPACT, SEARCH_BAR_PANEL} from '../composables/searchBarContext'
import {stemScaleDefaults, type StemScaleProps, type StemSize, type StemSizeValue} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * A filter chip: SButton soft, pill, with a caret. On the Stem scale: `size`
 * (sm by default) and the scale props are SButton's, space-x and gap a
 * step below its size's (sm: 6px); inside an SSearchBar it takes the bar's size and
 * tightens to space-y two steps below.
 */
const props = withDefaults(defineProps<StemScaleProps & {
  size?: StemSizeValue
  leadingIcon?: string
  trailingIcon?: string
  active?: boolean
  label?: string
  /** Drawn before the label, which then shows only while everything is selected; the label stays as the accessible name. */
  labelIcon?: string
  selectedValues?: string[]
  count?: number
  threshold?: number
  allLabel?: string
  selectedTemplate?: string
}>(), {
  ...stemScaleDefaults,
  threshold: 3,
  allLabel: 'All',
  selectedTemplate: '% selected',
})

// Inside an SSearchBar (not its panel of extra filters) a chip takes the
// bar's size and tightens: space-y two steps below, so it sits 4px inside the
// bar at every size (sm: 24 in 32, md: 32 in 40).
const inBar = inject(SEARCH_BAR_COMPACT, null) !== null && !inject(SEARCH_BAR_PANEL, false)

// Scale props inherited from a parent when not given; sm and a pill by
// default, space-x (and gap) a step below its size's, two steps less above
// and below in a bar — one at xs, where two would leave no padding-y at all
// (a 12px chip, its descenders on the pill's edge).
const sized = useStemScale(props, {size: 'sm'})
const scale = useStemScale(props, {
  size: 'sm',
  rounded: true,
  spaceX: '-1',
  get spaceY() { return inBar ? (sized.value.size === 'xs' ? '-1' : '-2') : undefined },
})

const coversAll = computed(() => !!props.selectedValues && props.selectedValues.length === props.count)

const displayValue = computed(() => {
  if (!props.selectedValues || props.count === undefined) return null
  const len = props.selectedValues.length
  if (coversAll.value) return props.allLabel
  if (len <= props.threshold) return props.selectedValues.join(', ')
  return props.selectedTemplate.replace('%', String(len))
})
</script>

<template>
  <SButton
      :icon="leadingIcon"
      caret
      variant="soft"
      :size="scale.size"
      :rounded="scale.rounded"
      :space="scale.space"
      :space-x="scale.spaceX"
      :space-y="scale.spaceY"
      :text-size="scale.textSize"
      :optical-label="scale.opticalLabel"
      :icon-size="scale.iconSize"
      :roundness="scale.roundness"
      class="select-none"
      :aria-label="labelIcon && label && displayValue !== null ? `${label}: ${displayValue}` : undefined"
      :class="[
        active ? 'bg-iron-400/30!' : '',
      ]"
  >
    <!-- Label and value a word space apart (0.25em); the label icon the
         scale's gap from the text, as a button's icon. -->
    <span v-if="label && displayValue !== null" class="flex min-w-0 items-center gap-[0.25em]">
      <UIcon
          v-if="labelIcon"
          :name="labelIcon"
          class="size-(--s-icon-size) shrink-0 text-(--ui-text-toned) me-[calc(var(--s-gap)-0.25em)]"
      />
      <span v-if="!labelIcon || coversAll" class="text-(--ui-text-toned) shrink-0 font-normal">{{ label }}</span>
      <span class="font-semibold truncate">{{ displayValue }}</span>
    </span>
    <slot v-else/>
  </SButton>
</template>
