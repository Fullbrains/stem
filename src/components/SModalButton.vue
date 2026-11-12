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

// `pad`: with a label, room at the sides for the text; `bare`: icon only
// (the X), the pill as narrow as it was.
const sizes = {
  md: {class: 'h-8 gap-1.5 text-sm', pad: 'px-4!', bare: 'px-3!', icon: 'xl'},
  sm: {class: 'h-6 gap-1 text-xs', pad: 'px-3!', bare: 'px-2!', icon: 'md'},
  xs: {class: 'h-5 gap-1 text-xs', pad: 'px-2.5!', bare: 'px-1.5!', icon: 'sm'},
} as const

const resolved = computed(() => sizes[props.size])
const padding = computed(() => props.label ? resolved.value.pad : resolved.value.bare)
</script>

<template>
  <SButton
    :class="['min-h-0 shrink-0 py-0! font-normal', resolved.class, padding]"
    rounded
    size="xl"
    variant="soft"
    :icon-size="resolved.icon"
    :icon="icon"
    :label="label"
  />
</template>
