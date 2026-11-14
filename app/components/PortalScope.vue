<script lang="ts">
const DARK_PORTAL_ID = 'showcase-dark-portal'

/**
 * Un contenitore `.dark` figlio diretto del body, creato alla prima richiesta.
 * Gli overlay del pannello scuro si teletrasportano qui e si aprono scuri,
 * invece di finire nel body, che è sempre in chiaro.
 */
export function darkPortalTarget(): HTMLElement {
  let el = document.getElementById(DARK_PORTAL_ID)
  if (!el) {
    el = document.createElement('div')
    el.id = DARK_PORTAL_ID
    // text-(--ui-text): il colore del body è quello del tema chiaro.
    el.className = 'dark text-(--ui-text)'
    Object.assign(el.style, showcaseRebasedVars(useAppConfig().ui.colors as Record<string, string>))
    document.body.appendChild(el)
  }
  return el
}
</script>

<script setup lang="ts">
import {portalTargetInjectionKey} from '#ui/composables/usePortal'

/**
 * Senza markup: avvolge il contenuto di un pannello dello Stage e, nel pannello
 * scuro, sposta il portal di default di Nuxt UI (popover, dropdown, tooltip,
 * slideover con `portal` lasciato a true) nel contenitore `.dark`.
 */
const props = defineProps<{
  mode: 'light' | 'dark'
}>()

const target = shallowRef<HTMLElement>()
onMounted(() => {
  if (props.mode === 'dark') target.value = darkPortalTarget()
})

provide(portalTargetInjectionKey, computed(() => (props.mode === 'dark' && target.value) || 'body'))
</script>

<template>
  <slot/>
</template>
