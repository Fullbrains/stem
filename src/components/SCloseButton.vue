<script setup lang="ts">
import {computed} from 'vue'
import {useLocale} from '@nuxt/ui/composables'

/**
 * The close button of Stem's surfaces: a soft pill with an X, the one SModal
 * shows in its header — SModalButton, the pill every header button is. Standalone so that every panel, drawer or slideover
 * closes with the same control instead of an approximation of it.
 *
 * Icon-only, so `label` is its accessible name (aria-label), never shown.
 * Without one it takes Nuxt UI's own word for "close" (`modal.close`), in
 * the locale the app gives UApp — the same the Nuxt UI overlays read.
 *
 * Placement is the caller's: SModalHeader pins it to its corner.
 */
const props = withDefaults(defineProps<{
  /** Accessible name (aria-label). Not rendered. */
  label?: string
  disabled?: boolean
}>(), {
  label: undefined,
  disabled: false,
})

const {t} = useLocale()

const ariaLabel = computed(() => props.label ?? t('modal.close'))

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<template>
  <!-- SModalButton with an X: the header's other buttons are the same pill. -->
  <SModalButton
    icon="i-ph-x"
    :aria-label="ariaLabel"
    :disabled="disabled"
    @click="$emit('click', $event)"
  />
</template>
