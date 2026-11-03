<script setup lang="ts">
import {computed} from 'vue'

/**
 * A button of a modal's header: the soft pill the close button is, for the
 * actions that stand beside it — a "Remove", a way to open the content
 * elsewhere. Same ground, same rounding, same height and icon size as the
 * close button at every width, so the header's controls read as one row;
 * SCloseButton is this, with an X.
 *
 * With a `label` the text shows beside the icon, smaller than the icon's
 * scale so the pill keeps the close button's height. Icon only, pass
 * `aria-label`: the button has no other name.
 *
 * `size` scales the pill down for the small surfaces that close too — a
 * popover, a card by a link — where a header's pill would outweigh the
 * title: `sm` is 24px tall, `xs` 20px. `md`, a modal's header, is 32px.
 * Scaled down, a Phosphor icon takes its bold weight (`i-ph-x` →
 * `i-ph-x-bold`): the regular stroke went thin at 16px and under. An icon
 * that names its weight, or of another set, is drawn as given.
 *
 * Everything else goes to SButton (`color`, `disabled`, `to`, `loading`…).
 */
const props = withDefaults(defineProps<{
  icon?: string
  /** Shown beside the icon. */
  label?: string
  size?: 'xs' | 'sm' | 'md'
}>(), {
  icon: undefined,
  label: undefined,
  size: 'md',
})

const sizes = {
  md: {class: 'h-8 gap-1.5 px-3! text-sm', icon: 'xl'},
  sm: {class: 'h-6 gap-1 px-2! text-xs', icon: 'md'},
  xs: {class: 'h-5 gap-1 px-1.5! text-xs', icon: 'sm'},
} as const

const resolved = computed(() => sizes[props.size])

/** Phosphor's weights, as the end of an icon's name. */
const WEIGHTED = /-(thin|light|bold|fill|duotone)$/

const icon = computed(() => props.size !== 'md' && props.icon?.startsWith('i-ph-') && !WEIGHTED.test(props.icon)
  ? `${props.icon}-bold`
  : props.icon)
</script>

<template>
  <SButton
    :class="['min-h-0 shrink-0 py-0! font-medium', resolved.class]"
    rounded
    size="xl"
    variant="soft"
    :icon-size="resolved.icon"
    :icon="icon"
    :label="label"
  />
</template>
