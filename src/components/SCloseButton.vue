<script setup lang="ts">
import {computed} from 'vue'
import {useLocale} from '@nuxt/ui/composables'

/**
 * The close button of Stem's surfaces: SModalButton with an X, the one
 * SModal shows in its header. Standalone so that every panel, drawer or
 * slideover closes with the same control.
 *
 * Icon only, so `label` is its accessible name (aria-label), never shown.
 * Without one it takes Nuxt UI's own word for "close" (`modal.close`), in
 * the locale the app gives UApp — the same the Nuxt UI overlays read.
 *
 * Everything else — `size`, the scale props, `disabled`, `@click` — passes
 * through to SModalButton and SButton. Placement is the caller's:
 * SModalHeader pins it to its corner.
 */
const props = defineProps<{
  /** Accessible name (aria-label). Not rendered. */
  label?: string
}>()

const {t} = useLocale()

const ariaLabel = computed(() => props.label ?? t('modal.close'))
</script>

<template>
  <SModalButton icon="i-ph-x" :aria-label="ariaLabel"/>
</template>
