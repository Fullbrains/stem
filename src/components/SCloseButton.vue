<script setup lang="ts">
/**
 * The close button of Stem's surfaces: a soft pill with an X, the one SModal
 * shows in its header. Standalone so that every panel, drawer or slideover
 * closes with the same control instead of an approximation of it.
 *
 * Icon-only, so `label` is its accessible name (aria-label), never shown.
 * It defaults to English like Stem's other built-in texts: pass the app's
 * own wording.
 *
 * Placement is the caller's: SModalHeader pins it to its corner.
 */
withDefaults(defineProps<{
  /** Accessible name (aria-label). Not rendered. */
  label?: string
  disabled?: boolean
}>(), {
  label: 'Close',
  disabled: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <SButton
    class="shrink-0 min-h-none py-[0.2em]! px-[0.6em]!"
    rounded
    icon="i-ph-x"
    size="xl"
    variant="soft"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  />
</template>
