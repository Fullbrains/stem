<script setup lang="ts">
import {computed, inject} from 'vue'
import {SEARCH_BAR_COMPACT} from '../composables/searchBarContext'
import {stemScaleDefaults, stemSpaceStep, type StemScaleProps, type StemSize} from '../theme/scale'
import {useStemScale} from '../composables/useStemScale'

/**
 * A filter chip: SButton soft, pill, with a caret. On the Stem scale: `size`
 * (sm by default) and the scale props are SButton's. Its one default: a
 * step more air at the sides (space-x one step above size) unless `space`
 * or `space-x` is given; inside a small SSearchBar it tightens to space-y 2xs.
 */
const props = withDefaults(defineProps<StemScaleProps & {
  size?: StemSize
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

// Scale props inherited from a parent when not given; sm and a pill by default.
const scale = useStemScale(props, {size: 'sm', rounded: true})

const resolvedSpaceX = computed(() => scale.value.spaceX ?? (scale.value.space != null ? undefined : stemSpaceStep(scale.value.size!, 1)))

// Inside a compact SSearchBar the chips tighten too (see searchBarContext).
const searchBarCompact = inject(SEARCH_BAR_COMPACT, null)
const tight = computed(() => !!searchBarCompact?.value)

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
      :space-x="resolvedSpaceX"
      :space-y="scale.spaceY ?? (tight ? '2xs' : undefined)"
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
    <template v-if="label && displayValue !== null">
      <UIcon
          v-if="labelIcon"
          :name="labelIcon"
          class="size-(--s-icon-size) shrink-0 text-(--ui-text-toned)"
      />
      <span v-if="!labelIcon || coversAll" class="text-(--ui-text-toned) shrink-0 font-normal">{{ label }}</span>
      <span class="font-semibold truncate">{{ displayValue }}</span>
    </template>
    <slot v-else/>
  </SButton>
</template>
