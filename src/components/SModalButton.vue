<script setup lang="ts">
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
 * Everything else goes to SButton (`color`, `disabled`, `to`, `loading`…).
 */
defineProps<{
  icon?: string
  /** Shown beside the icon. */
  label?: string
}>()
</script>

<template>
  <SButton
    class="h-8 min-h-0 shrink-0 gap-1.5 px-3! py-0! text-sm font-medium"
    rounded
    size="xl"
    variant="soft"
    icon-size="xl"
    :icon="icon"
    :label="label"
  />
</template>
